'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { authenticateUser } from '@/lib/json-auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = authenticateUser(email, password);

      if (result.success && result.user) {
        console.log('[v0] Login successful, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('[v0] Login error:', err);
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">STTIS</h1>
            <p className="text-muted-foreground text-sm">
              Smart Tea Traceability & Intelligence System
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sttis.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Besoin d&apos;aide?{' '}
            <Link href="/help" className="text-primary hover:underline font-medium">
              Consulter l&apos;aide
            </Link>
          </div>
        </div>

        {/* Credentials Card */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex gap-3">
            <HelpCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">
                Identifiants de test disponibles
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Admin:</strong> admin@sttis.local</p>
                <p><strong>QA:</strong> qa@sttis.local</p>
                <p><strong>Stock:</strong> stock@sttis.local</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Tous les mots de passe: Admin@123456, QA@123456, Stock@123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
