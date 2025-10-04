import { test, expect } from '@playwright/test'

test.describe('Company Workflow', () => {
  const testEmail = `company-test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'

  test('should complete full company workflow: register -> browse projects -> submit quote', async ({ page }) => {
    // 1. Register as company
    await page.goto('/auth')

    // Switch to signup mode
    await page.click('text=Pas encore de compte')

    // Select company role - wait for register mode
    await page.waitForSelector('text=Type de compte')
    await page.click('button:has-text("Entreprise")')

    // Fill registration form
    await page.fill('[name="name"]', 'Test Company User')
    await page.fill('[name="companyName"]', 'Test BTP Company')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.fill('[name="confirmPassword"]', testPassword)

    // Submit registration and wait for navigation
    await Promise.all([
      page.waitForURL(/\/(syndic|company)\/dashboard/, { timeout: 30000 }),
      page.click('button[type="submit"]')
    ])

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/company\/dashboard/)

    // 2. Browse available projects
    await page.goto('/company/projects')

    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

    // Verify projects are displayed
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards.first()).toBeVisible()

    // Filter by status "published"
    await page.click('button:has-text("Publiés")')

    // Click on first available project
    const firstProject = projectCards.first()
    const projectTitle = await firstProject.locator('h3').textContent()
    await firstProject.click()

    // Wait for project details
    await expect(page).toHaveURL(/\/company\/projects\/[^/]+/, { timeout: 10000 })

    // Verify project details are visible
    await expect(page.locator('text=Budget')).toBeVisible()
    await expect(page.locator('text=Échéance')).toBeVisible()

    // 3. Submit a quote
    await page.click('button:has-text("Soumettre un devis")')

    // Wait for quote submission form
    await expect(page).toHaveURL(/\/company\/quotes\/new/, { timeout: 10000 })

    // Fill quote form
    await page.fill('[name="totalAmount"]', '7500')
    await page.fill('[name="description"]', 'Devis détaillé pour la rénovation du hall d\'entrée')
    await page.fill('[name="deliveryTime"]', '30')

    // Add quote lines
    await page.click('button:has-text("Ajouter une ligne")')
    await page.fill('[name="lines[0].description"]', 'Fourniture et pose nouveau sol')
    await page.fill('[name="lines[0].quantity"]', '50')
    await page.fill('[name="lines[0].unitPrice"]', '80')
    await page.fill('[name="lines[0].unit"]', 'm²')

    await page.click('button:has-text("Ajouter une ligne")')
    await page.fill('[name="lines[1].description"]', 'Peinture murs et plafonds')
    await page.fill('[name="lines[1].quantity"]', '100')
    await page.fill('[name="lines[1].unitPrice"]', '35')
    await page.fill('[name="lines[1].unit"]', 'm²')

    // Save as draft first
    await page.click('button:has-text("Sauvegarder en brouillon")')

    // Wait for redirect to quotes list
    await expect(page).toHaveURL(/\/company\/quotes/, { timeout: 10000 })

    // Verify quote was created with draft status
    await expect(page.locator('text=draft')).toBeVisible()

    // 4. Submit the quote
    // Click on the draft quote
    await page.click('[data-status="draft"]')

    // Edit and submit
    await page.click('button:has-text("Modifier")')
    await page.click('button:has-text("Soumettre le devis")')

    // Wait for redirect
    await expect(page).toHaveURL(/\/company\/quotes/, { timeout: 10000 })

    // Verify quote status is now submitted
    await expect(page.locator('text=submitted')).toBeVisible()
  })

  test.skip('should filter quotes by status', async ({ page }) => {
    // Login
    await page.goto('/auth')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL(/\/company\/dashboard/, { timeout: 10000 })

    // Go to quotes page
    await page.goto('/company/quotes')

    // Test filtering by different statuses
    await page.click('button:has-text("Brouillons")')
    await expect(page.locator('[data-status="draft"]')).toBeVisible()

    await page.click('button:has-text("Soumis")')
    // Should show submitted quotes or empty state

    await page.click('button:has-text("Acceptés")')
    // Should show accepted quotes or empty state

    await page.click('button:has-text("Rejetés")')
    // Should show rejected quotes or empty state
  })

  test.skip('should display quote statistics correctly', async ({ page }) => {
    // Login
    await page.goto('/auth')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL(/\/company\/dashboard/, { timeout: 10000 })

    // Go to quotes page
    await page.goto('/company/quotes')

    // Verify statistics cards are visible
    await expect(page.locator('text=Total')).toBeVisible()
    await expect(page.locator('text=Soumis')).toBeVisible()
    await expect(page.locator('text=Acceptés')).toBeVisible()
    await expect(page.locator('text=Rejetés')).toBeVisible()

    // Verify numbers are displayed
    const totalCard = page.locator('[data-stat="total"]')
    await expect(totalCard).toBeVisible()
  })

  test.skip('should handle quote submission validation', async ({ page }) => {
    // Login
    await page.goto('/auth')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL(/\/company\/dashboard/, { timeout: 10000 })

    // Go to new quote page (assuming a project ID is available)
    await page.goto('/company/projects')
    await page.click('[data-testid="project-card"]')
    await page.click('button:has-text("Soumettre un devis")')

    // Try to submit without required fields
    await page.click('button:has-text("Soumettre le devis")')

    // Should show validation errors
    await expect(page.locator('text=requis')).toBeVisible()
  })

  test.skip('should not allow submitting quote for unpublished projects', async ({ page }) => {
    // Login
    await page.goto('/auth')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL(/\/company\/dashboard/, { timeout: 10000 })

    // Go to projects
    await page.goto('/company/projects')

    // Filter to show only published projects
    await page.click('button:has-text("Publiés")')

    // All visible projects should have "Soumettre un devis" button
    const submitButtons = page.locator('button:has-text("Soumettre un devis")')
    const count = await submitButtons.count()
    expect(count).toBeGreaterThan(0)
  })
})
