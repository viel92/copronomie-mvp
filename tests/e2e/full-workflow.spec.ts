import { test, expect } from '@playwright/test'

test.describe('Full End-to-End Workflow', () => {
  const syndicEmail = `syndic-e2e-${Date.now()}@example.com`
  const companyEmail = `company-e2e-${Date.now()}@example.com`
  const password = 'TestPassword123!'

  let projectTitle: string
  let projectId: string

  test('should complete entire workflow: syndic creates project -> company submits quote -> syndic accepts', async ({ browser }) => {
    test.setTimeout(180000) // 3 minutes timeout for this complex test

    // Use 2 browser contexts to simulate 2 different users
    const syndicContext = await browser.newContext()
    const companyContext = await browser.newContext()

    const syndicPage = await syndicContext.newPage()
    const companyPage = await companyContext.newPage()

    try {
      // ========== PART 1: SYNDIC CREATES AND PUBLISHES PROJECT ==========

      // Register syndic
      await syndicPage.goto('/auth', { waitUntil: 'networkidle' })
      await syndicPage.waitForTimeout(1000)

      await syndicPage.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent?.includes("Pas encore de compte")
        );
        if (button) button.click();
      })

      await syndicPage.waitForSelector('text=Type de compte')
      await syndicPage.click('button:has-text("Syndic")')
      await syndicPage.fill('[name="name"]', 'E2E Syndic Test')
      await syndicPage.fill('[name="companyName"]', 'Syndic E2E Company')
      await syndicPage.fill('[name="email"]', syndicEmail)
      await syndicPage.fill('[name="password"]', password)
      await syndicPage.fill('[name="confirmPassword"]', password)
      await syndicPage.click('button[type="submit"]')

      await expect(syndicPage).toHaveURL(/\/syndic\/dashboard/, { timeout: 10000 })

      // Create copropriete
      await syndicPage.goto('/syndic/condos/new')

      // Wait for page to load and click on "Saisie Manuelle" tab
      await syndicPage.waitForSelector('text=Saisie Manuelle')
      await syndicPage.click('text=Saisie Manuelle')

      // Wait for the manual form to be visible
      await syndicPage.waitForSelector('form >> [name="name"]', { state: 'visible' })

      await syndicPage.fill('[name="name"]', 'E2E Test Residence')
      await syndicPage.fill('[name="address"]', '100 Rue E2E, 75001 Paris')
      await syndicPage.fill('#units_count', '30')
      await syndicPage.fill('#numero_immatriculation', '98765432109876')
      await syndicPage.click('button:has-text("Créer la copropriété")')

      await expect(syndicPage).toHaveURL(/\/syndic\/condos/, { timeout: 10000 })

      // Wait a bit for the condo to be fully created in DB
      await syndicPage.waitForTimeout(1000)

      // Create project
      projectTitle = `E2E Test Projet ${Date.now()}`
      await syndicPage.goto('/syndic/projects/new')

      // Wait for condos to load in the select
      await syndicPage.waitForTimeout(1000)
      await syndicPage.fill('#title', projectTitle)
      await syndicPage.fill('#description', 'Projet test E2E pour validation workflow complet')

      await syndicPage.click('button:has-text("Sélectionnez la copropriété")')
      await syndicPage.click('[role="option"]:has-text("E2E Test Residence")')

      await syndicPage.click('button:has-text("Sélectionnez le type")')
      await syndicPage.click('[role="option"]:has-text("Toiture")')

      await syndicPage.fill('#budget_min', '8000')
      await syndicPage.fill('#budget_max', '15000')

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 45)
      await syndicPage.fill('#deadline', futureDate.toISOString().split('T')[0])

      // Publish directly
      await syndicPage.click('button:has-text("Publier")')

      await expect(syndicPage).toHaveURL(/\/syndic\/projects\/[^/]+$/, { timeout: 10000 })

      // Extract project ID from URL
      const url = syndicPage.url()
      projectId = url.split('/').pop() || ''

      // Verify published status
      await expect(syndicPage.locator('text=published')).toBeVisible()

      // ========== PART 2: COMPANY SEES PROJECT AND SUBMITS QUOTE ==========

      // Register company
      await companyPage.goto('/auth', { waitUntil: 'networkidle' })
      await companyPage.waitForTimeout(1000)

      await companyPage.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent?.includes("Pas encore de compte")
        );
        if (button) button.click();
      })

      await companyPage.waitForSelector('text=Type de compte')
      await companyPage.click('button:has-text("Entreprise")')
      await companyPage.fill('[name="name"]', 'E2E Company Test')
      await companyPage.fill('[name="companyName"]', 'E2E BTP Company')
      await companyPage.fill('[name="email"]', companyEmail)
      await companyPage.fill('[name="password"]', password)
      await companyPage.fill('[name="confirmPassword"]', password)
      await companyPage.click('button[type="submit"]')

      await expect(companyPage).toHaveURL(/\/company\/dashboard/, { timeout: 10000 })

      // Browse projects and find the one we just created
      await companyPage.goto('/company/projects')

      // Wait for project cards to load
      await companyPage.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })

      // Click on our test project
      await companyPage.click(`text=${projectTitle}`)
      await expect(companyPage).toHaveURL(/\/company\/projects\/[^/]+/, { timeout: 10000 })

      // Submit quote
      await companyPage.click('button:has-text("Soumettre un devis")')
      await expect(companyPage).toHaveURL(/\/company\/quotes\/new/, { timeout: 10000 })

      await companyPage.fill('[name="totalAmount"]', '12000')
      await companyPage.fill('#description', 'Devis E2E test avec details complets')
      await companyPage.fill('[name="deliveryTime"]', '30')

      // Add quote lines
      await companyPage.click('button:has-text("Ajouter une ligne")')
      await companyPage.fill('[name="lines[0].description"]', 'Main d\'oeuvre')
      await companyPage.fill('[name="lines[0].quantity"]', '10')
      await companyPage.fill('[name="lines[0].unitPrice"]', '500')
      await companyPage.fill('[name="lines[0].unit"]', 'jour')

      // Submit the quote
      await companyPage.click('button:has-text("Soumettre le devis")')

      await expect(companyPage).toHaveURL(/\/company\/quotes/, { timeout: 10000 })
      await expect(companyPage.locator('text=submitted')).toBeVisible()

      // ========== PART 3: SYNDIC SEES QUOTE AND ACCEPTS IT ==========

      // Go back to syndic to see the quote
      await syndicPage.goto(`/syndic/projects/${projectId}`)

      // Wait for quote to appear
      await syndicPage.waitForTimeout(2000) // Give time for quote to be processed
      await syndicPage.reload()

      // Should see the quote in the list
      await expect(syndicPage.locator('text=E2E BTP Company')).toBeVisible()
      await expect(syndicPage.locator('text=12000')).toBeVisible()

      // Accept the quote
      await syndicPage.click('button:has-text("Accepter")')

      // Confirm acceptance (if modal exists)
      const confirmButton = syndicPage.locator('button:has-text("Confirmer")')
      if (await confirmButton.isVisible()) {
        await confirmButton.click()
      }

      // Wait for status update
      await syndicPage.waitForTimeout(1000)

      // Verify quote is accepted
      await expect(syndicPage.locator('text=accepted')).toBeVisible()

      // Verify project status changed to "awarded"
      await expect(syndicPage.locator('text=awarded')).toBeVisible()

      // ========== PART 4: COMPANY SEES ACCEPTANCE NOTIFICATION ==========

      // Company goes to quotes page
      await companyPage.goto('/company/quotes')

      // Click on accepted filter
      await companyPage.click('button:has-text("Acceptés")')

      // Should see the accepted quote
      await expect(companyPage.locator('text=accepted')).toBeVisible()
      await expect(companyPage.locator(`text=${projectTitle}`)).toBeVisible()

      // Statistics should be updated
      const acceptedCard = companyPage.locator('[data-stat="accepted"]')
      await expect(acceptedCard).toContainText('1')

    } finally {
      // Cleanup
      await syndicContext.close()
      await companyContext.close()
    }
  })

  test.skip('should handle quote rejection workflow', async ({ browser }) => {
    const syndicContext = await browser.newContext()
    const companyContext = await browser.newContext()

    const syndicPage = await syndicContext.newPage()
    const companyPage = await companyContext.newPage()

    try {
      // Login as existing syndic (from previous test)
      await syndicPage.goto('/auth')
      await syndicPage.fill('[name="email"]', syndicEmail)
      await syndicPage.fill('[name="password"]', password)
      await syndicPage.click('button[type="submit"]')

      // Create another project
      await syndicPage.goto('/syndic/projects/new')
      const projectTitle2 = `E2E Rejection Test ${Date.now()}`
      await syndicPage.fill('#title', projectTitle2)
      await syndicPage.fill('#description', 'Test rejection workflow')

      await syndicPage.click('button:has-text("Sélectionnez la copropriété")')
      await syndicPage.click('[role="option"]:has-text("E2E Test Residence")')

      await syndicPage.click('button:has-text("Sélectionnez le type")')
      await syndicPage.click('[role="option"]:has-text("Chauffage")')

      await syndicPage.fill('#budget_min', '3000')
      await syndicPage.fill('#budget_max', '6000')

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      await syndicPage.fill('#deadline', futureDate.toISOString().split('T')[0])

      await syndicPage.click('button:has-text("Publier")')

      const projectId2 = syndicPage.url().split('/').pop() || ''

      // Login as company
      await companyPage.goto('/auth')
      await companyPage.fill('[name="email"]', companyEmail)
      await companyPage.fill('[name="password"]', password)
      await companyPage.click('button[type="submit"]')

      // Submit a quote
      await companyPage.goto(`/company/projects/${projectId2}`)
      await companyPage.click('button:has-text("Soumettre un devis")')
      await companyPage.fill('[name="totalAmount"]', '5000')
      await companyPage.fill('#description', 'Quote to be rejected')
      await companyPage.fill('[name="deliveryTime"]', '15')
      await companyPage.click('button:has-text("Soumettre le devis")')

      // Syndic rejects the quote
      await syndicPage.goto(`/syndic/projects/${projectId2}`)
      await syndicPage.waitForTimeout(2000)
      await syndicPage.reload()

      await syndicPage.click('button:has-text("Rejeter")')

      // Fill rejection reason
      await syndicPage.fill('[name="rejectionReason"]', 'Prix trop eleve pour le budget')
      await syndicPage.click('button:has-text("Confirmer")')

      // Verify quote is rejected
      await expect(syndicPage.locator('text=rejected')).toBeVisible()

      // Company sees rejection
      await companyPage.goto('/company/quotes')
      await companyPage.click('button:has-text("Rejetés")')
      await expect(companyPage.locator('text=rejected')).toBeVisible()
      await expect(companyPage.locator('text=Prix trop eleve')).toBeVisible()

    } finally {
      await syndicContext.close()
      await companyContext.close()
    }
  })

  test.skip('should prevent accepting multiple quotes for same project', async ({ browser }) => {
    const syndicContext = await browser.newContext()
    const company1Context = await browser.newContext()
    const company2Context = await browser.newContext()

    const syndicPage = await syndicContext.newPage()
    const company1Page = await company1Context.newPage()
    const company2Page = await company2Context.newPage()

    try {
      // Login as syndic and create project
      await syndicPage.goto('/auth')
      await syndicPage.fill('[name="email"]', syndicEmail)
      await syndicPage.fill('[name="password"]', password)
      await syndicPage.click('button[type="submit"]')

      // ... (create project, get 2 companies to submit quotes)
      // ... (accept first quote)
      // ... (try to accept second quote - should fail)

      // This test requires full implementation
      // Placeholder for now

    } finally {
      await syndicContext.close()
      await company1Context.close()
      await company2Context.close()
    }
  })
})
