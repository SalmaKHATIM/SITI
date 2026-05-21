'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Shield, Users } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'Administrator' | 'Quality Manager' | 'Stock Manager';
  role_fr?: string;
  full_name?: string;
  created_at?: string;
  source?: 'credentials' | 'database';
  password?: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'Stock Manager' as const,
    password: '',
  });

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'Administrator') {
      router.push('/dashboard');
      return;
    }
    loadUsers();
  }, [currentUser, router]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.accounts || []);
      console.log('[STTIS] Users loaded:', data.accounts);
    } catch (error) {
      console.error('[STTIS] Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role,
        }),
      });

      if (response.ok) {
        await loadUsers();
        setFormData({ email: '', full_name: '', role: 'Stock Manager', password: '' });
        setShowForm(false);
        alert('Utilisateur créé avec succès!');
      } else {
        const error = await response.json();
        alert('Erreur: ' + (error.error || 'Erreur lors de la création'));
      }
    } catch (error) {
      console.error('[STTIS] Error adding user:', error);
      alert('Erreur: ' + String(error));
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) return;

    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, email: email }),
      });

      if (response.ok) {
        await loadUsers();
        alert('Utilisateur supprimé avec succès!');
      } else {
        const error = await response.json();
        alert('Erreur: ' + (error.error || 'Erreur lors de la suppression'));
      }
    } catch (error) {
      console.error('[STTIS] Error deleting user:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Quality Manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Stock Manager':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };



  if (currentUser?.role !== 'Administrator') {
    return (
      <div className="p-6">
        <Card className="p-12 text-center border border-red-200 bg-red-50">
          <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-900 mb-2">Accès Refusé</h2>
          <p className="text-red-700">Seuls les administrateurs peuvent gérer les utilisateurs.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground mt-1">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Add User Form */}
      {showForm && (
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Créer un nouvel utilisateur</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input
                  type="email"
                  placeholder="utilisateur@sttis.local"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe *</label>
                <Input
                  type="password"
                  placeholder="Mot de passe sécurisé"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <Input
                  type="text"
                  placeholder="Jean Dupont"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rôle *</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  required
                >
                  <option value="Administrator">Administrateur</option>
                  <option value="Quality Manager">Responsable Qualité</option>
                  <option value="Stock Manager">Responsable Stocks</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Créer Utilisateur
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
                className="border-border"
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      ) : users.length === 0 ? (
        <Card className="p-12 border border-border text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Aucun utilisateur créé</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user: any) => (
            <Card key={user.id || user.email} className="p-6 border border-border hover:border-primary/50 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-lg text-foreground">
                      {user.email}
                    </h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getRoleColor(user.role)}`}>
                      {user.role_fr || user.role}
                    </span>
                  </div>
                  {user.full_name && (
                    <p className="text-sm text-muted-foreground">
                      Nom: {user.full_name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Rôle technique: {user.role}
                  </p>
                  {user.created_at && (
                    <p className="text-xs text-muted-foreground">
                      Créé: {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {user.email !== 'admin@sttis.local' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteUser(user.id || user.email, user.email)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
