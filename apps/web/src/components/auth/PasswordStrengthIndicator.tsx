'use client'

import { useMemo } from 'react'
import { Check, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  password: string
}

// Liste noire de mots de passe communs (synchronisée avec le backend)
const COMMON_PASSWORDS = new Set([
  '123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890',
  'qwerty', 'abc123', '111111', '123123', 'admin', 'letmein', 'welcome', 'monkey',
  'password1', '1234', 'dragon', 'master', 'sunshine', 'princess', 'iloveyou',
  'football', 'shadow', 'superman', 'trustno1', 'passw0rd', 'baseball', 'batman',
])

interface PasswordRequirement {
  label: string
  met: boolean
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const requirements = useMemo((): PasswordRequirement[] => {
    return [
      {
        label: 'Au moins 12 caractères',
        met: password.length >= 12,
      },
      {
        label: 'Une lettre majuscule',
        met: /[A-Z]/.test(password),
      },
      {
        label: 'Une lettre minuscule',
        met: /[a-z]/.test(password),
      },
      {
        label: 'Un chiffre',
        met: /[0-9]/.test(password),
      },
      {
        label: 'Un caractère spécial (!@#$%^&*...)',
        met: /[^A-Za-z0-9]/.test(password),
      },
      {
        label: 'Pas un mot de passe commun',
        met: password.length > 0 ? !COMMON_PASSWORDS.has(password.toLowerCase()) : true,
      },
      {
        label: 'Pas de caractères répétés (ex: aaa, 111)',
        met: password.length > 0 ? !/(.)\1{2,}/.test(password) : true,
      },
    ]
  }, [password])

  const allMet = requirements.every(req => req.met)
  const metCount = requirements.filter(req => req.met).length

  // Calcul de la force du mot de passe (0-100)
  const strength = Math.round((metCount / requirements.length) * 100)

  // Couleur de la barre de progression
  const getStrengthColor = () => {
    if (strength < 30) return 'bg-red-500'
    if (strength < 60) return 'bg-orange-500'
    if (strength < 90) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength < 30) return 'Très faible'
    if (strength < 60) return 'Faible'
    if (strength < 90) return 'Moyen'
    return 'Fort'
  }

  // Ne rien afficher si pas de mot de passe
  if (!password) return null

  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      {/* Barre de progression */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">Force du mot de passe</span>
          <span className={`font-semibold ${
            strength < 30 ? 'text-red-600' :
            strength < 60 ? 'text-orange-600' :
            strength < 90 ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Liste des exigences */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-700">
          Exigences du mot de passe:
        </div>
        <ul className="space-y-1.5">
          {requirements.map((requirement, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs"
            >
              {requirement.met ? (
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <span className={requirement.met ? 'text-green-700' : 'text-slate-600'}>
                {requirement.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Message de validation */}
      {allMet && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-xs text-green-700 font-medium">
            Mot de passe sécurisé
          </span>
        </div>
      )}
    </div>
  )
}
