'use client'

import { useEffect } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@copronomie/ui'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error)
  }, [error])

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

          {error.message && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-mono text-red-800 break-words">
                {error.message}
              </p>
            </div>
          )}

          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
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

          {process.env.NODE_ENV === 'development' && error.stack && (
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
