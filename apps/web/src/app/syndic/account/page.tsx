'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
  Textarea
} from '@copronomie/ui'
import {
  User,
  Phone,
  Save,
  Loader2,
  Shield,
  Bell,
  Settings
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AccountPage() {
  const { data: user, isLoading } = trpc.auth.me.useQuery()
  const [activeTab, setActiveTab] = useState('profile')

  const [formData, setFormData] = useState({
    company_name: '',
    phone: '',
    company_info: ''
  })

  const updateUserMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du profil')
    }
  })

  const handleSave = async () => {
    if (!user?.user?.id) return

    await updateUserMutation.mutateAsync({
      id: user.user.id,
      companyName: formData.company_name || undefined,
      phone: formData.phone || undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user?.user?.role !== 'syndic') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mon Compte</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alertes
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nom de l&apos;entreprise</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="Votre entreprise"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      L&apos;email ne peut pas être modifié
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_info">Informations sur l&apos;entreprise</Label>
                  <Textarea
                    id="company_info"
                    value={formData.company_info}
                    onChange={(e) => setFormData({ ...formData, company_info: e.target.value })}
                    placeholder="Description de votre cabinet de syndic..."
                    rows={4}
                  />
                </div>

                <Separator />

                <Button
                  onClick={handleSave}
                  disabled={updateUserMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {updateUserMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Informations du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Statut</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      Actif
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Rôle</span>
                    <Badge variant="outline">
                      Syndic
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  Compte créé le {user?.user?.created_at ? new Date(user.user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Gestion des alertes à venir
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Paramètres à venir
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}