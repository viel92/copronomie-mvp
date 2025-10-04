async function globalSetup() {
  const maxRetries = 30
  const retryDelay = 1000

  console.log('Waiting for API to be ready...')

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('http://localhost:4000/health')
      if (response.ok) {
        console.log('API is ready!')
        return
      }
    } catch (error) {
      // API not ready yet
    }

    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }

  throw new Error('API failed to start within timeout')
}

export default globalSetup
