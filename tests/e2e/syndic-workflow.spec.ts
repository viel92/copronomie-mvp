import { test, expect } from '@playwright/test'

test.describe('Syndic Workflow', () => {
  const testEmail = `syndic-test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'

  test('should complete full syndic workflow: register -> create condo -> create project -> publish', async ({ page }) => {
    // 1. Register as syndic
    await page.goto('/auth')

    // Switch to signup mode
    await page.click('text=Pas encore de compte')

    // Select syndic role - wait for register mode to be active
    await page.waitForSelector('text=Type de compte')
    await page.click('button:has-text("Syndic")')

    // Fill registration form
    await page.fill('[name="name"]', 'Test Syndic')
    await page.fill('[name="companyName"]', 'Syndic Test Company')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.fill('[name="confirmPassword"]', testPassword)

    // Submit registration and wait for navigation
    await Promise.all([
      page.waitForURL(/\/(syndic|company)\/dashboard/, { timeout: 30000 }),
      page.click('button[type="submit"]')
    ])

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/syndic\/dashboard/)

    // 2. Create a copropriété
    await page.goto('/syndic/condos/new')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Use manual entry method
    await page.click('text=Saisie Manuelle')

    // Wait for form to be visible
    await page.waitForSelector('form >> [name="name"]', { state: 'visible', timeout: 5000 })

    // Fill condo form
    await page.fill('[name="name"]', 'Test Residence Les Lilas')
    await page.fill('[name="address"]', '10 Rue de Test, 75001 Paris')
    await page.fill('#units_count', '25')
    await page.fill('#numero_immatriculation', '12345678901234')

    // Submit condo creation
    await page.click('button:has-text("Créer la copropriété")')

    // Wait for redirect to condos list
    await expect(page).toHaveURL(/\/syndic\/condos/, { timeout: 10000 })

    // Verify condo was created
    await expect(page.locator('text=Test Residence Les Lilas')).toBeVisible()

    // 3. Create a project (draft)
    await page.goto('/syndic/projects/new')

    // Wait for form to load
    await page.waitForSelector('#title', { state: 'visible', timeout: 10000 })

    // Fill project form
    await page.fill('#title', 'Test Projet - Rénovation Hall')
    await page.fill('#description', 'Rénovation complète du hall d\'entrée avec nouveau sol et peinture')

    // Select the condo we just created
    await page.click('button:has-text("Sélectionnez la copropriété")')
    await page.click('[role="option"]:has-text("Test Residence Les Lilas")')

    // Select project type
    await page.click('button:has-text("Sélectionnez le type")')
    await page.click('[role="option"]:has-text("Toiture")')

    // Fill budget
    await page.fill('#budget_min', '5000')
    await page.fill('#budget_max', '10000')

    // Set deadline (30 days from now)
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    const dateString = futureDate.toISOString().split('T')[0]
    await page.fill('#deadline', dateString)

    // Save as draft
    await page.click('button:has-text("Sauvegarder en brouillon")')

    // Wait for redirect to projects list
    await expect(page).toHaveURL(/\/syndic\/projects/, { timeout: 10000 })

    // Verify project was created with draft status
    await expect(page.locator('text=Test Projet - Rénovation Hall')).toBeVisible()
    await expect(page.locator('text=draft')).toBeVisible()

    // 4. Publish the project
    // Click on the project to view details
    await page.click('text=Test Projet - Rénovation Hall')

    // Wait for project details page
    await expect(page).toHaveURL(/\/syndic\/projects\/[^/]+$/, { timeout: 10000 })

    // Click edit button
    await page.click('button:has-text("Modifier")')

    // Wait for edit page
    await expect(page).toHaveURL(/\/syndic\/projects\/[^/]+\/edit/, { timeout: 10000 })

    // Publish the project
    await page.click('button:has-text("Publier")')

    // Wait for redirect back to project details
    await expect(page).toHaveURL(/\/syndic\/projects\/[^/]+$/, { timeout: 10000 })

    // Verify project status is now published
    await expect(page.locator('text=published')).toBeVisible()
  })

  test.skip('should handle validation errors when creating project with missing fields', async ({ page }) => {
    // Login with test account (assuming it exists from previous test)
    await page.goto('/auth')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL(/\/syndic\/dashboard/, { timeout: 10000 })

    // Navigate to new project
    await page.goto('/syndic/projects/new')

    // Try to submit without filling required fields
    await page.click('button:has-text("Publier")')

    // Should show validation errors
    await expect(page.locator('text=requis')).toBeVisible()
  })

  test.skip('should only allow editing draft projects', async ({ page }) => {
    // Login
    await page.goto('/auth')
    await page.fill('[name="email"]', testEmail)
    await page.fill('[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL(/\/syndic\/dashboard/, { timeout: 10000 })

    // Go to projects list
    await page.goto('/syndic/projects')

    // Click on a published project
    await page.click('text=published')

    // Edit button should be disabled or not visible for published projects
    const editButton = page.locator('button:has-text("Modifier")')
    if (await editButton.isVisible()) {
      await expect(editButton).toBeDisabled()
    }
  })
})
