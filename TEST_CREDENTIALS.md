# STTIS - Identifiants de Test

Bienvenue dans STTIS (Smart Tea Traceability & Intelligence System)! Voici les identifiants pour tester le système avec différents rôles d'accès.

## 🔐 Comptes de Test

### Admin - Accès Complet
- **Email:** `admin@sttis.tea`
- **Mot de passe:** `Admin@12345`
- **Rôle:** Admin
- **Accès:** Gestion complète du système, utilisateurs, audit logs, paramètres globaux

### Quality Manager - Gestion Qualité
- **Email:** `qa@sttis.tea`
- **Mot de passe:** `QA@12345`
- **Rôle:** Quality Manager
- **Accès:** Gestion de la qualité, traçabilité, rapports de production, anomalies

### Stock Manager - Gestion des Stocks
- **Email:** `stock@sttis.tea`
- **Mot de passe:** `Stock@12345`
- **Rôle:** Stock Manager
- **Accès:** Gestion des stocks, inventaire, mouvements, alertes de seuil

## 📝 Instructions de Connexion

1. **Visitez la page d'accueil** - Cliquez sur "Identifiants de Test" ou allez à `/demo`
2. **Copiez les identifiants** - Utilisez l'icône de copie pour copier l'email et le mot de passe
3. **Accédez à la page de connexion** - Cliquez sur "Se Connecter"
4. **Entrez les identifiants** - Collez l'email et le mot de passe
5. **Connectez-vous** - Cliquez sur le bouton de connexion

## 🎯 Ce Que Vous Pouvez Tester

### Avec Tous les Comptes
- ✅ Dashboard principal avec métriques
- ✅ Navigation entre les pages
- ✅ Gestion du profil utilisateur
- ✅ Chat NLP avec assistant IA
- ✅ Insights et prédictions

### Avec Admin
- ✅ Gestion des utilisateurs
- ✅ Audit logs complets
- ✅ Paramètres système
- ✅ Gestion des rôles et permissions

### Avec Quality Manager
- ✅ Création et modification de lots
- ✅ Scores de qualité
- ✅ Détection d'anomalies
- ✅ Traçabilité des batches
- ✅ Rapports de production

### Avec Stock Manager
- ✅ Gestion de l'inventaire
- ✅ Mouvements de stock
- ✅ Alertes de seuil
- ✅ Optimisation des stocks IA
- ✅ Prédictions de ventes

## 🚀 Démarrage Rapide

### Option 1 - Récupérer les Identifiants
1. Allez à `http://localhost:3000/demo`
2. Copiez l'email et le mot de passe d'un rôle
3. Allez à `http://localhost:3000/login`
4. Collez et connectez-vous

### Option 2 - Créer un Compte
1. Allez à `http://localhost:3000/signup`
2. Remplissez le formulaire
3. Cliquez sur "S'inscrire"
4. Vous serez redirigé vers le dashboard

## 🔄 Réinitialiser les Données

Si vous voulez réinitialiser les données de test:

```bash
# Exécutez le script d'initialisation
node scripts/init-supabase.ts
```

## 📊 Données de Démonstration

Le système inclut des données pré-remplies pour les tests:

- **Produits:** Thés verts, noirs, oolong
- **Lots:** Plusieurs batches en différents statuts
- **Stock:** Niveaux d'inventaire avec seuils
- **Prédictions:** Données de prévisions 12 mois
- **Anomalies:** Quelques anomalies de test détectées

## 🐛 Dépannage

### Je ne peux pas me connecter
- Vérifiez que vous avez copié correctement l'email et le mot de passe
- Assurez-vous que Supabase est correctement configuré
- Essayez de réinitialiser avec le script d'initialisation

### La création de compte ne fonctionne pas
- Utilisez les identifiants de test fournis
- Si vous voulez créer un compte personnalisé, assurez-vous que votre email est unique
- Vérifiez que Supabase Auth est activé

### Les données ne s'affichent pas
- Vérifiez que la base de données est initialisée
- Assurez-vous que vous avez les bonnes permissions pour votre rôle
- Videz le cache du navigateur et rafraîchissez

## 📞 Support

Pour plus d'informations:
- Documentation: `/README.md`
- Déploiement: `/DEPLOYMENT.md`
- Résumé du Projet: `/PROJECT_SUMMARY.md`

---

**Note:** Ces identifiants sont destinés aux tests uniquement. En production, utilisez des mots de passe forts et sécurisés.
