'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Label,
  Textarea
} from '@copronomie/ui'
import {
  ArrowLeft,
  Calendar,
  Euro,
  Building,
  FileText,
  Loader2,
  Send,
  Upload,
  PenTool
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { QuoteLinesForm, type QuoteLine } from '@/components/quotes/QuoteLinesForm'

export default function CompanyProjectDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const utils = trpc.useUtils()

  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [quoteMode, setQuoteMode] = useState<'platform' | 'pdf'>('platform')
  const [quoteLines, setQuoteLines] = useState<QuoteLine[]>([
    {
      id: 'temp-1',
      description: '',
      quantity: 1,
      unit_price_ht: 0,
      vat_rate: 20,
      total_ht: 0,
      total_vat: 0,
      total_ttc: 0,
    }
  ])
  const [quoteDescription, setQuoteDescription] = useState('')
  const [quoteDelay, setQuoteDelay] = useState('')
  const [quotePdfFile, setQuotePdfFile] = useState<File | null>(null)
  const [uploadingPdf, setUploadingPdf] = useState(false)

  const { data: projectData, isLoading: projectLoading } = trpc.projects.getById.useQuery({ id: projectId })
  const { data: user } = trpc.auth.me.useQuery()

  const createQuoteLinesMutation = trpc.quoteLines.createBulk.useMutation()
  const createQuoteMutation = trpc.quotes.create.useMutation()
  const submitQuoteMutation = trpc.quotes.submit.useMutation()
  const deleteQuoteMutation = trpc.quotes.delete.useMutation()

  // Fetch existing quotes for this project
  const { data: projectQuotesData } = trpc.quotes.getByProject.useQuery({ projectId })

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const project = projectData?.project

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/company/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Projet introuvable</h1>
        </div>
        <p className="text-muted-foreground">Le projet demandé n&apos;existe pas ou n&apos;est plus disponible.</p>
      </div>
    )
  }

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.user?.id) {
      toast.error('Utilisateur non connecté')
      return
    }

    // Mode PDF: just upload the PDF
    if (quoteMode === 'pdf') {
      if (!quotePdfFile) {
        toast.error('Veuillez sélectionner un fichier PDF')
        return
      }

      setUploadingPdf(true)
      try {
        // TODO: Upload PDF to Supabase Storage
        toast.info('Upload PDF vers Supabase Storage à implémenter')
        // const pdfUrl = await uploadToSupabaseStorage(quotePdfFile)

        await submitQuoteMutation.mutateAsync({
          project_id: projectId,
          company_id: user.user.id,
          description: quoteDescription || 'Devis PDF',
          delay_days: quoteDelay ? parseInt(quoteDelay) : undefined,
          pdf_url: undefined, // Will be the uploaded URL
        })

        setUploadingPdf(false)
        return
      } catch (error) {
        toast.error('Erreur lors de l\'upload du devis')
        setUploadingPdf(false)
        return
      }
    }

    // Mode Platform: create quote with lines
    if (quoteLines.length === 0) {
      toast.error('Veuillez ajouter au moins une ligne au devis')
      return
    }

    const hasEmptyDescription = quoteLines.some(line => !line.description.trim())
    if (hasEmptyDescription) {
      toast.error('Toutes les lignes doivent avoir une description')
      return
    }

    const hasInvalidQuantity = quoteLines.some(line => line.quantity <= 0)
    if (hasInvalidQuantity) {
      toast.error('Les quantités doivent être supérieures à 0')
      return
    }

    try {
      // Step 1: Check for existing draft quotes from this company and delete them
      const existingQuotes = projectQuotesData?.quotes || []
      const myDraftQuotes = existingQuotes.filter(
        q => q.company_id === user.user.id && q.status === 'draft'
      )

      if (myDraftQuotes.length > 0) {
        console.log(`Deleting ${myDraftQuotes.length} existing draft quote(s)...`)
        for (const draftQuote of myDraftQuotes) {
          await deleteQuoteMutation.mutateAsync({ id: draftQuote.id })
        }
      }

      // Step 2: Create the quote (without amounts - will be calculated by trigger)
      console.log('Creating quote...')
      const quote = await createQuoteMutation.mutateAsync({
        project_id: projectId,
        company_id: user.user.id,
        description: quoteDescription,
        delay_days: quoteDelay ? parseInt(quoteDelay) : undefined,
        pdf_url: undefined,
      })

      console.log('Quote created:', quote)

      // Step 3: Create the quote lines (trigger will auto-update quote totals)
      console.log('Creating quote lines...')
      await createQuoteLinesMutation.mutateAsync({
        lines: quoteLines.map((line, index) => ({
          quote_id: quote.quote.id,
          description: line.description,
          quantity: line.quantity,
          unit_price_ht: line.unit_price_ht,
          vat_rate: line.vat_rate,
          line_order: index,
        }))
      })

      console.log('Quote lines created successfully')

      // Step 4: Submit the quote (change status from draft to submitted)
      console.log('Submitting quote...')
      await submitQuoteMutation.mutateAsync({ id: quote.quote.id })

      console.log('Quote submitted successfully')

      // Success: reset form and invalidate cache
      toast.success('Devis soumis avec succès')
      setShowQuoteForm(false)
      setQuoteLines([{
        id: 'temp-1',
        description: '',
        quantity: 1,
        unit_price_ht: 0,
        vat_rate: 20,
        total_ht: 0,
        total_vat: 0,
        total_ttc: 0,
      }])
      setQuoteDescription('')
      setQuoteDelay('')
      setQuotePdfFile(null)
      utils.quotes.getByCompany.invalidate()
      utils.quotes.getByProject.invalidate({ projectId })
    } catch (error) {
      console.error('Error submitting quote:', error)
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      draft: { label: 'Brouillon', className: 'bg-gray-100 text-gray-700 border-gray-200' },
      published: { label: 'Publié', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      analyzing: { label: 'En analyse', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      awarded: { label: 'Attribué', className: 'bg-green-100 text-green-800 border-green-200' },
      completed: { label: 'Terminé', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    }

    const config = variants[status] || variants.draft
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      roofing: 'Toiture',
      heating: 'Chauffage',
      elevator: 'Ascenseur',
      painting: 'Peinture',
      facade: 'Façade',
      plumbing: 'Plomberie',
      electrical: 'Électricité'
    }
    return types[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/company/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground mt-1">Détails du projet</p>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(project.status || 'draft')}
          {project.type && (
            <Badge variant="outline">
              {getTypeLabel(project.type)}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {project.description || 'Aucune description fournie'}
              </p>
            </CardContent>
          </Card>

          {!showQuoteForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Soumettre un devis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Intéressé par ce projet ? Soumettez votre devis dès maintenant.
                </p>
                <Button onClick={() => setShowQuoteForm(true)} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Faire une proposition
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Votre devis</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuote} className="space-y-6">
                  {/* Mode selection */}
                  <div className="space-y-3">
                    <Label>Mode de soumission *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setQuoteMode('platform')}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          quoteMode === 'platform'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <PenTool className={`h-5 w-5 mt-0.5 ${quoteMode === 'platform' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <div className="font-medium">Créer sur la plateforme</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Construisez votre devis ligne par ligne
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuoteMode('pdf')}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          quoteMode === 'pdf'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Upload className={`h-5 w-5 mt-0.5 ${quoteMode === 'pdf' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <div className="font-medium">Uploader un PDF</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Déposez votre devis existant
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Platform mode form */}
                  {quoteMode === 'platform' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Lignes de devis *</Label>
                        <QuoteLinesForm
                          lines={quoteLines}
                          onChange={setQuoteLines}
                          disabled={submitQuoteMutation.isPending || createQuoteLinesMutation.isPending}
                        />
                      </div>
                    </div>
                  )}

                  {/* PDF mode form */}
                  {quoteMode === 'pdf' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pdf-upload">Devis PDF *</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <Input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file && file.type === 'application/pdf') {
                                setQuotePdfFile(file)
                              } else if (file) {
                                toast.error('Veuillez sélectionner un fichier PDF')
                                e.target.value = ''
                              }
                            }}
                            className="hidden"
                          />
                          <label htmlFor="pdf-upload" className="cursor-pointer">
                            <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                            {quotePdfFile ? (
                              <div>
                                <p className="font-medium text-primary">{quotePdfFile.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {(quotePdfFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="font-medium">Cliquez pour uploader votre devis</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Format PDF uniquement, max 10 MB
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="delay">Délai d'exécution (jours)</Label>
                    <Input
                      id="delay"
                      type="number"
                      placeholder="30"
                      value={quoteDelay}
                      onChange={(e) => setQuoteDelay(e.target.value)}
                      disabled={submitQuoteMutation.isPending || createQuoteLinesMutation.isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description de votre offre {quoteMode === 'pdf' && '*'}
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre proposition, les matériaux utilisés, les garanties..."
                      rows={4}
                      value={quoteDescription}
                      onChange={(e) => setQuoteDescription(e.target.value)}
                      disabled={submitQuoteMutation.isPending || createQuoteLinesMutation.isPending}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowQuoteForm(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitQuoteMutation.isPending || createQuoteLinesMutation.isPending}
                      className="flex-1"
                    >
                      {(submitQuoteMutation.isPending || createQuoteLinesMutation.isPending) ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Soumettre le devis
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(project.budget_min || project.budget_max) && (
                <div className="flex items-start gap-3">
                  <Euro className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Budget indicatif</p>
                    <p className="text-sm text-muted-foreground">
                      {project.budget_min?.toLocaleString()}€ - {project.budget_max?.toLocaleString()}€
                    </p>
                  </div>
                </div>
              )}

              {project.deadline && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Date limite de soumission</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.deadline).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Type de travaux</p>
                  <p className="text-sm text-muted-foreground">
                    {getTypeLabel(project.type)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Publication</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
