'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: 'Je ne peux pas me connecter avec les identifiants de test',
      answer: 'Assurez-vous que vous avez copié correctement l\'email et le mot de passe (sans espaces). Si le problème persiste, essayez de rafraîchir la page et réessayez.',
    },
    {
      question: 'Comment créer mon propre compte?',
      answer: 'Allez à la page d\'inscription (/signup) et remplissez le formulaire avec votre email, nom complet et mot de passe. Votre compte sera créé immédiatement avec le rôle "Stock Manager" par défaut.',
    },
    {
      question: 'Quel est le mot de passe pour le compte admin?',
      answer: 'Email: admin@sttis.local, Mot de passe: Admin@123456. Consultez le fichier credentials.json ou CREDENTIALS.csv dans le dossier racine du projet.',
    },
    {
      question: 'Comment obtenir les identifiants de test?',
      answer: 'Consultez les fichiers credentials.json, CREDENTIALS.csv ou CREDENTIALS.txt dans le dossier racine du projet pour voir tous les identifiants.',
    },
    {
      question: 'Je vois une erreur "Unauthorized"',
      answer: 'Cela signifie que Supabase n\'est pas correctement configuré. Vérifiez que les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies.',
    },
    {
      question: 'Les données du dashboard ne s\'affichent pas',
      answer: 'Vérifiez que vous avez les bonnes permissions pour votre rôle. Essayez de vous déconnecter et de vous reconnecter, ou videz le cache du navigateur.',
    },
  ];

  const troubleshooting = [
    {
      title: 'Problème de Connexion',
      steps: [
        'Vérifiez l\'email et le mot de passe (attention à la casse)',
        'Videz le cache du navigateur',
        'Essayez un navigateur différent',
        'Vérifiez votre connexion Internet',
      ],
    },
    {
      title: 'Problème de Création de Compte',
      steps: [
        'Utilisez un email unique (non utilisé avant)',
        'Le mot de passe doit avoir au moins 6 caractères',
        'Entrez votre nom complet',
        'Acceptez les conditions (si applicable)',
      ],
    },
    {
      title: 'Problème d\'Affichage des Données',
      steps: [
        'Vérifiez votre rôle d\'utilisateur',
        'Rafraîchissez la page (F5)',
        'Videz le cache (Ctrl+Shift+Delete)',
        'Vérifiez les permissions RLS de Supabase',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Centre d'Aide STTIS</h1>
          <p className="text-lg text-muted-foreground">
            Trouvez des réponses à vos questions et résolvez les problèmes courants
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link href="/login">
            <Card className="border border-border p-6 cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CheckCircle2 className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Se Connecter</h3>
              <p className="text-sm text-muted-foreground">Accéder à votre compte STTIS</p>
            </Card>
          </Link>

          <Link href="/signup">
            <Card className="border border-border p-6 cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CheckCircle2 className="w-8 h-8 text-secondary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Créer un Compte</h3>
              <p className="text-sm text-muted-foreground">Créer votre propre compte utilisateur</p>
            </Card>
          </Link>
        </div>

        {/* Troubleshooting Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Dépannage Rapide</h2>
          <div className="grid gap-6">
            {troubleshooting.map((item, index) => (
              <Card key={index} className="border border-border p-6">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                    <ol className="space-y-2">
                      {item.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Questions Fréquentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Documentation Links */}
        <Card className="border border-border p-8 bg-primary/5 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Documentation Complète</h2>
          <p className="text-muted-foreground mb-6">
            Pour plus de détails sur le projet et son architecture, consultez:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <strong className="text-foreground">README.md</strong> - Guide complet du projet
            </li>
            <li>
              <strong className="text-foreground">TEST_CREDENTIALS.md</strong> - Identifiants et instructions de test
            </li>
            <li>
              <strong className="text-foreground">DEPLOYMENT.md</strong> - Guide de déploiement en production
            </li>
            <li>
              <strong className="text-foreground">PROJECT_SUMMARY.md</strong> - Résumé technique complet
            </li>
          </ul>
        </Card>

        {/* Contact Section */}
        <Card className="border border-border p-8 text-center bg-accent/5">
          <h2 className="text-xl font-bold text-foreground mb-4">Besoin d'aide supplémentaire?</h2>
          <p className="text-muted-foreground mb-6">
            Si vous ne trouvez pas la réponse à votre question, consultez la documentation ou réessayez plus tard.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button variant="outline" className="border-border">
                Retour à l'Accueil
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Se Connecter
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
