import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { Server } from 'http'

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string
  isAlive?: boolean
}

export class WebSocketManager {
  private wss: WebSocketServer
  private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map()

  constructor(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: '/ws'
    })

    this.wss.on('connection', this.handleConnection.bind(this))
    this.setupHeartbeat()
  }

  private handleConnection(ws: AuthenticatedWebSocket, req: IncomingMessage) {
    console.log('New WebSocket connection')

    const userId = this.authenticateConnection(req)

    if (!userId) {
      ws.close(1008, 'Unauthorized')
      return
    }

    ws.userId = userId
    ws.isAlive = true

    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set())
    }
    this.clients.get(userId)!.add(ws)

    ws.on('pong', () => {
      ws.isAlive = true
    })

    ws.on('message', (data) => {
      this.handleMessage(ws, data)
    })

    ws.on('close', () => {
      this.handleClose(ws)
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    ws.send(JSON.stringify({
      type: 'connected',
      userId
    }))
  }

  private authenticateConnection(req: IncomingMessage): string | null {
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const token = url.searchParams.get('token')

    if (!token) {
      return null
    }

    return token
  }

  private handleMessage(ws: AuthenticatedWebSocket, data: any) {
    try {
      const message = JSON.parse(data.toString())

      switch (message.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }))
          break

        case 'subscribe':
          break

        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  }

  private handleClose(ws: AuthenticatedWebSocket) {
    if (ws.userId) {
      const userClients = this.clients.get(ws.userId)
      if (userClients) {
        userClients.delete(ws)
        if (userClients.size === 0) {
          this.clients.delete(ws.userId)
        }
      }
    }
  }

  private setupHeartbeat() {
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        const authWs = ws as AuthenticatedWebSocket

        if (authWs.isAlive === false) {
          return authWs.terminate()
        }

        authWs.isAlive = false
        authWs.ping()
      })
    }, 30000)

    this.wss.on('close', () => {
      clearInterval(interval)
    })
  }

  public broadcast(userId: string, message: any) {
    const userClients = this.clients.get(userId)
    if (userClients) {
      const data = JSON.stringify(message)
      userClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data)
        }
      })
    }
  }

  public broadcastToAll(message: any) {
    const data = JSON.stringify(message)
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.clients.keys())
  }

  public getUserConnectionCount(userId: string): number {
    return this.clients.get(userId)?.size || 0
  }
}