import DOMPurify from 'isomorphic-dompurify'
import { logger } from './logger'

/**
 * Configuration de sanitization HTML sécurisée
 * CRITIQUE-7: Prévention des attaques XSS stockées
 */

// Tags HTML autorisés (liste blanche stricte)
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'span', 'div',
]

// Attributs HTML autorisés par tag
const ALLOWED_ATTR = {
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  'span': ['class'],
  'div': ['class'],
  'td': ['colspan', 'rowspan'],
  'th': ['colspan', 'rowspan'],
}

// Protocoles autorisés pour les liens
const ALLOWED_URI_REGEXP = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - HTML string to sanitize
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  html: string,
  options?: {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
  }
): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  try {
    const config = {
      ALLOWED_TAGS: options?.allowedTags || ALLOWED_TAGS,
      ALLOWED_ATTR: options?.allowedAttributes || ALLOWED_ATTR,
      ALLOWED_URI_REGEXP,
      ALLOW_DATA_ATTR: false, // Bloquer data-* attributes (souvent utilisés pour XSS)
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SAFE_FOR_TEMPLATES: true,
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      FORCE_BODY: false,
      SANITIZE_DOM: true,
      KEEP_CONTENT: true,
    }

    const clean = DOMPurify.sanitize(html, config)

    // Log si du contenu a été supprimé (potentielle tentative d'attaque)
    if (clean !== html && clean.length < html.length * 0.9) {
      logger.warn({
        event: 'sanitization_removed_content',
        originalLength: html.length,
        cleanedLength: clean.length,
        removedPercent: Math.round((1 - clean.length / html.length) * 100),
      }, 'Significant content removed during sanitization')
    }

    return clean
  } catch (error) {
    logger.error({ err: error }, 'HTML sanitization failed')
    // En cas d'erreur, retourner une chaîne vide (fail-safe)
    return ''
  }
}

/**
 * Sanitize plain text (remove all HTML tags)
 * @param text - Text to sanitize
 * @returns Plain text without HTML
 */
export function sanitizePlainText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  try {
    // Utiliser DOMPurify pour supprimer tout HTML
    const clean = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // Aucun tag autorisé
      KEEP_CONTENT: true, // Garder le texte
    })

    return clean.trim()
  } catch (error) {
    logger.error({ err: error }, 'Plain text sanitization failed')
    return ''
  }
}

/**
 * Sanitize JSON object recursively
 * Applique la sanitization sur toutes les propriétés string
 * @param obj - Object to sanitize
 * @param options - Sanitization options
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options?: {
    htmlFields?: string[] // Champs qui peuvent contenir du HTML
    textFields?: string[] // Champs texte pur (pas de HTML)
  }
): T {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const sanitized = { ...obj }
  const htmlFields = options?.htmlFields || []
  const textFields = options?.textFields || []

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      // Champs HTML: autoriser certains tags
      if (htmlFields.includes(key)) {
        sanitized[key] = sanitizeHtml(value)
      }
      // Champs texte: supprimer tout HTML
      else if (textFields.includes(key) || !htmlFields.length) {
        sanitized[key] = sanitizePlainText(value)
      }
    }
    // Récursif pour les objets imbriqués
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value, options)
    }
    // Récursif pour les tableaux
    else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'object' ? sanitizeObject(item, options) : item
      )
    }
  }

  return sanitized
}

/**
 * Validate and sanitize URL
 * @param url - URL to validate
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  try {
    const trimmed = url.trim()

    // Bloquer les protocoles dangereux
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
    const lowerUrl = trimmed.toLowerCase()

    if (dangerousProtocols.some(proto => lowerUrl.startsWith(proto))) {
      logger.warn({
        event: 'dangerous_url_blocked',
        url: trimmed.substring(0, 50), // Log seulement les premiers 50 caractères
      }, 'Blocked dangerous URL protocol')
      return null
    }

    // Valider avec URL constructor
    new URL(trimmed)

    return trimmed
  } catch (error) {
    logger.warn({
      event: 'invalid_url',
      url: url.substring(0, 50),
    }, 'Invalid URL provided')
    return null
  }
}

/**
 * Escape SQL-like patterns dans les recherches
 * Pour les requêtes LIKE/ILIKE PostgreSQL
 * @param pattern - Search pattern
 * @returns Escaped pattern
 */
export function escapeSqlLikePattern(pattern: string): string {
  if (!pattern || typeof pattern !== 'string') {
    return ''
  }

  // Échapper les caractères spéciaux SQL LIKE: % _ \ '
  return pattern
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
    .replace(/'/g, "''")
}
