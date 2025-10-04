import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Resend BEFORE importing the service
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn(),
    },
  })),
}))

import { EmailService, SendEmailInput, QuoteNotificationInput, QuoteAcceptedNotificationInput } from '../../apps/api/src/services/email.service'

describe('EmailService', () => {
  let emailService: EmailService
  let mockResendSend: any

  beforeEach(() => {
    emailService = new EmailService()
    vi.clearAllMocks()

    // Get mock Resend instance
    const { Resend } = require('resend')
    const mockResend = new Resend('test-api-key')
    mockResendSend = mockResend.emails.send
  })

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const input: SendEmailInput = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      }

      const mockResponse = {
        id: 'email-123',
        from: 'onboarding@resend.dev',
        to: input.to,
        created_at: '2025-10-02',
      }

      mockResendSend.mockResolvedValue({ data: mockResponse, error: null })

      const result = await emailService.sendEmail(input)

      expect(result).toEqual(mockResponse)
      expect(mockResendSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: input.to,
        subject: input.subject,
        html: input.html,
      })
    })

    it('should throw error when Resend fails', async () => {
      const input: SendEmailInput = {
        to: 'error@example.com',
        subject: 'Error Email',
        html: '<p>Error</p>',
      }

      const mockError = { message: 'Resend API error' }

      mockResendSend.mockResolvedValue({ data: null, error: mockError })

      await expect(emailService.sendEmail(input)).rejects.toThrow('Failed to send email')
    })

    it('should handle network errors', async () => {
      const input: SendEmailInput = {
        to: 'network@example.com',
        subject: 'Network Error',
        html: '<p>Network</p>',
      }

      mockResendSend.mockRejectedValue(new Error('Network failure'))

      await expect(emailService.sendEmail(input)).rejects.toThrow('Email service error')
    })
  })

  describe('sendQuoteReceivedNotification', () => {
    it('should send quote received notification to syndic', async () => {
      const input: QuoteNotificationInput = {
        syndicEmail: 'syndic@example.com',
        syndicName: 'Test Syndic',
        projectTitle: 'Test Project',
        companyName: 'Test Company',
        quoteAmount: 10000,
        projectId: 'project-123',
      }

      const mockResponse = {
        id: 'email-quote-123',
        from: 'onboarding@resend.dev',
        to: input.syndicEmail,
      }

      mockResendSend.mockResolvedValue({ data: mockResponse, error: null })

      const result = await emailService.sendQuoteReceivedNotification(input)

      expect(result).toEqual(mockResponse)
      expect(mockResendSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: input.syndicEmail,
        subject: expect.stringContaining(input.projectTitle),
        html: expect.any(String),
      })
    })

    it('should include company name and quote amount in email', async () => {
      const input: QuoteNotificationInput = {
        syndicEmail: 'syndic@example.com',
        syndicName: 'Test Syndic',
        projectTitle: 'Renovation Project',
        companyName: 'ABC Company',
        quoteAmount: 15000,
        projectId: 'project-456',
      }

      mockResendSend.mockResolvedValue({ data: {}, error: null })

      await emailService.sendQuoteReceivedNotification(input)

      const callArgs = mockResendSend.mock.calls[0][0]
      expect(callArgs.html).toContain('ABC Company')
      expect(callArgs.html).toContain('15000')
    })

    it('should throw error if sending fails', async () => {
      const input: QuoteNotificationInput = {
        syndicEmail: 'syndic@example.com',
        syndicName: 'Test Syndic',
        projectTitle: 'Test Project',
        companyName: 'Test Company',
        quoteAmount: 10000,
        projectId: 'project-123',
      }

      mockResendSend.mockResolvedValue({ data: null, error: { message: 'Send failed' } })

      await expect(emailService.sendQuoteReceivedNotification(input)).rejects.toThrow()
    })
  })

  describe('sendQuoteAcceptedNotification', () => {
    it('should send quote accepted notification to company', async () => {
      const input: QuoteAcceptedNotificationInput = {
        companyEmail: 'company@example.com',
        companyName: 'Test Company',
        projectTitle: 'Test Project',
        quoteAmount: 12000,
        syndicName: 'Test Syndic',
        projectId: 'project-789',
      }

      const mockResponse = {
        id: 'email-accepted-123',
        from: 'onboarding@resend.dev',
        to: input.companyEmail,
      }

      mockResendSend.mockResolvedValue({ data: mockResponse, error: null })

      const result = await emailService.sendQuoteAcceptedNotification(input)

      expect(result).toEqual(mockResponse)
      expect(mockResendSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: input.companyEmail,
        subject: expect.stringContaining(input.projectTitle),
        html: expect.any(String),
      })
    })

    it('should include syndic name and project title in email', async () => {
      const input: QuoteAcceptedNotificationInput = {
        companyEmail: 'company@example.com',
        companyName: 'XYZ Company',
        projectTitle: 'Hall Renovation',
        quoteAmount: 20000,
        syndicName: 'Paris Syndic',
        projectId: 'project-999',
      }

      mockResendSend.mockResolvedValue({ data: {}, error: null })

      await emailService.sendQuoteAcceptedNotification(input)

      const callArgs = mockResendSend.mock.calls[0][0]
      expect(callArgs.html).toContain('Paris Syndic')
      expect(callArgs.html).toContain('Hall Renovation')
    })

    it('should throw error if sending fails', async () => {
      const input: QuoteAcceptedNotificationInput = {
        companyEmail: 'company@example.com',
        companyName: 'Test Company',
        projectTitle: 'Test Project',
        quoteAmount: 12000,
        syndicName: 'Test Syndic',
        projectId: 'project-789',
      }

      mockResendSend.mockResolvedValue({ data: null, error: { message: 'Send failed' } })

      await expect(emailService.sendQuoteAcceptedNotification(input)).rejects.toThrow()
    })
  })

  describe('Email Templates', () => {
    it('should generate valid HTML for quote received template', async () => {
      const input: QuoteNotificationInput = {
        syndicEmail: 'syndic@example.com',
        syndicName: 'Test Syndic',
        projectTitle: 'Test Project',
        companyName: 'Test Company',
        quoteAmount: 10000,
        projectId: 'project-123',
      }

      mockResendSend.mockResolvedValue({ data: {}, error: null })

      await emailService.sendQuoteReceivedNotification(input)

      const callArgs = mockResendSend.mock.calls[0][0]
      expect(callArgs.html).toContain('<!DOCTYPE html>')
      expect(callArgs.html).toContain('</html>')
      expect(callArgs.html).toContain('<body>')
    })

    it('should generate valid HTML for quote accepted template', async () => {
      const input: QuoteAcceptedNotificationInput = {
        companyEmail: 'company@example.com',
        companyName: 'Test Company',
        projectTitle: 'Test Project',
        quoteAmount: 12000,
        syndicName: 'Test Syndic',
        projectId: 'project-789',
      }

      mockResendSend.mockResolvedValue({ data: {}, error: null })

      await emailService.sendQuoteAcceptedNotification(input)

      const callArgs = mockResendSend.mock.calls[0][0]
      expect(callArgs.html).toContain('<!DOCTYPE html>')
      expect(callArgs.html).toContain('</html>')
      expect(callArgs.html).toContain('<body>')
    })
  })

  describe('Error Handling', () => {
    it('should log error when email sending fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const input: SendEmailInput = {
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      }

      mockResendSend.mockResolvedValue({ data: null, error: { message: 'API error' } })

      await expect(emailService.sendEmail(input)).rejects.toThrow()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should log success when email is sent', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const input: SendEmailInput = {
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      }

      mockResendSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })

      await emailService.sendEmail(input)

      expect(consoleSpy).toHaveBeenCalledWith('Email sent successfully:', expect.any(Object))
      consoleSpy.mockRestore()
    })
  })
})
