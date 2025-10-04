import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailInput {
  to: string
  subject: string
  html: string
}

export interface QuoteNotificationInput {
  syndicEmail: string
  syndicName: string
  projectTitle: string
  companyName: string
  quoteAmount: number
  projectId: string
}

export interface QuoteAcceptedNotificationInput {
  companyEmail: string
  companyName: string
  projectTitle: string
  quoteAmount: number
  syndicName: string
  projectId: string
}

export class EmailService {
  private fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  async sendEmail(input: SendEmailInput) {
    try {
      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: input.to,
        subject: input.subject,
        html: input.html,
      })

      if (error) {
        console.error('Email send error:', error)
        throw new Error(`Failed to send email: ${error.message}`)
      }

      console.log('Email sent successfully:', data)
      return data
    } catch (error: any) {
      console.error('Email service error:', error)
      throw new Error(`Email service error: ${error.message}`)
    }
  }

  async sendQuoteReceivedNotification(input: QuoteNotificationInput) {
    const html = this.getQuoteReceivedTemplate(input)

    return this.sendEmail({
      to: input.syndicEmail,
      subject: `Nouveau devis recu pour ${input.projectTitle}`,
      html,
    })
  }

  async sendQuoteAcceptedNotification(input: QuoteAcceptedNotificationInput) {
    const html = this.getQuoteAcceptedTemplate(input)

    return this.sendEmail({
      to: input.companyEmail,
      subject: `Votre devis a ete accepte - ${input.projectTitle}`,
      html,
    })
  }

  private getQuoteReceivedTemplate(input: QuoteNotificationInput): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nouveau Devis Recu</h1>
            </div>
            <div class="content">
              <p>Bonjour ${input.syndicName},</p>

              <p>Vous avez recu un nouveau devis pour votre projet <strong>${input.projectTitle}</strong>.</p>

              <div class="details">
                <h3>Details du devis :</h3>
                <p><strong>Entreprise :</strong> ${input.companyName}</p>
                <p><strong>Montant :</strong> ${input.quoteAmount.toLocaleString('fr-FR')} EUR</p>
                <p><strong>Projet :</strong> ${input.projectTitle}</p>
              </div>

              <p>Connectez-vous a votre espace pour consulter le devis en detail et prendre une decision.</p>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/syndic/projects/${input.projectId}" class="button">
                Voir le devis
              </a>

              <p>Cordialement,<br>L'equipe Copronomie</p>
            </div>
            <div class="footer">
              <p>Cet email a ete envoye automatiquement. Merci de ne pas y repondre.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private getQuoteAcceptedTemplate(input: QuoteAcceptedNotificationInput): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .success { color: #10b981; font-size: 20px; font-weight: bold; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Felicitations !</h1>
            </div>
            <div class="content">
              <p>Bonjour ${input.companyName},</p>

              <p class="success">Votre devis a ete accepte !</p>

              <p>Le syndic <strong>${input.syndicName}</strong> a accepte votre devis pour le projet <strong>${input.projectTitle}</strong>.</p>

              <div class="details">
                <h3>Details du projet :</h3>
                <p><strong>Projet :</strong> ${input.projectTitle}</p>
                <p><strong>Montant accepte :</strong> ${input.quoteAmount.toLocaleString('fr-FR')} EUR</p>
                <p><strong>Syndic :</strong> ${input.syndicName}</p>
              </div>

              <p>Le syndic va vous contacter prochainement pour finaliser les details du contrat et planifier les travaux.</p>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/company/quotes" class="button">
                Voir mes devis
              </a>

              <p>Cordialement,<br>L'equipe Copronomie</p>
            </div>
            <div class="footer">
              <p>Cet email a ete envoye automatiquement. Merci de ne pas y repondre.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export const emailService = new EmailService()
