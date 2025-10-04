import { test, expect } from '@playwright/test'

test.describe('Condo Creation', () => {
  test('should create a condo via manual entry', async ({ page }) => {
    const syndicEmail = `syndic-condo-test-${Date.now()}@example.com`
    const password = 'TestPassword123!'

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text())
      }
    })

    // Listen for page errors
    page.on('pageerror', error => {
      console.log('Page error:', error.message)
    })

    // Register syndic
    await page.goto('/auth', { waitUntil: 'networkidle' })

    // Wait for React hydration and click register button
    await page.waitForTimeout(1000)

    // Force click using JavaScript to bypass any event handler issues
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent?.includes("Pas encore de compte")
      );
      if (button) button.click();
    })

    // Wait for register form to appear
    await page.waitForSelector('text=Type de compte', { timeout: 5000 })
    await page.click('button:has-text("Syndic")')
    await page.fill('[name="name"]', 'Test Syndic')
    await page.fill('[name="companyName"]', 'Test Syndic Company')
    await page.fill('[name="email"]', syndicEmail)
    await page.fill('[name="password"]', password)
    await page.fill('[name="confirmPassword"]', password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/syndic\/dashboard/, { timeout: 10000 })

    // Go to new condo page
    await page.goto('/syndic/condos/new')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Click on "Saisie Manuelle" tab
    console.log('Clicking on Saisie Manuelle tab...')
    await page.click('text=Saisie Manuelle')

    // Wait for the form to be visible
    await page.waitForSelector('form >> [name="name"]', { state: 'visible', timeout: 5000 })

    console.log('Filling form...')
    await page.fill('[name="name"]', 'Test Residence E2E')
    await page.fill('[name="address"]', '123 Test Street, Paris')
    await page.fill('#units_count', '25')
    await page.fill('#numero_immatriculation', '12345678901234')

    // Check localStorage for session
    const localStorage = await page.evaluate(() => {
      const session = window.localStorage.getItem('copronomie_session')
      const user = window.localStorage.getItem('copronomie_user')
      return { session, user }
    })
    console.log('LocalStorage before submit:', localStorage)

    // Take screenshot before submit
    await page.screenshot({ path: 'test-results/before-submit.png' })

    console.log('Submitting form...')
    await page.click('button:has-text("Créer la copropriété")')

    // Wait for either success (redirect to list) or error toast
    try {
      // Wait for redirect to condos list (NOT /new)
      await expect(page).toHaveURL(/\/syndic\/condos\/?$/, { timeout: 10000 })
      console.log('Successfully redirected to condos list')
    } catch (error) {
      // Check for error toast
      const errorToast = page.locator('[role="status"], [role="alert"]').filter({ hasText: /erreur|error/i })
      if (await errorToast.isVisible({ timeout: 2000 }).catch(() => false)) {
        const errorText = await errorToast.textContent()
        console.log('Error toast found:', errorText)
      }

      // Take screenshot on failure
      await page.screenshot({ path: 'test-results/after-submit-error.png' })
      console.log('Failed to redirect. Current URL:', page.url())
      throw error
    }

    // Verify the condo appears in the list
    await expect(page.locator('text=Test Residence E2E')).toBeVisible()
  })
})
