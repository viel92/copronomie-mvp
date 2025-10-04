'use client'

import React from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@copronomie/ui'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // You can log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback

      if (FallbackComponent && this.state.error) {
        return (
          <FallbackComponent
            error={this.state.error}
            reset={() => this.setState({ hasError: false, error: null })}
          />
        )
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error | null; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Une erreur est survenue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nous sommes désolés, une erreur inattendue s'est produite. Veuillez réessayer ou retourner à l'accueil.
          </p>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-mono text-red-800 break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={reset}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && error?.stack && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                Stack trace (dev only)
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  )
}

// Simpler hook-based error boundary for specific components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error)
    setError(error)
  }, [])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  if (error) {
    throw error // This will be caught by the nearest ErrorBoundary
  }

  return { handleError, resetError }
}
