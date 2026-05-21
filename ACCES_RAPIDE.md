# 🍵 STTIS - Guide d'Accès Rapide

## ✨ Bienvenue dans STTIS!

Vous ne pouvez pas accéder au système? Pas de problème! Voici comment vous connecter en moins d'une minute.

---

## 🚀 Solution Rapide (2 étapes)

### Étape 1: Récupérez les Identifiants
**Allez à:** `http://localhost:3000/demo`

Vous verrez 3 comptes avec des mots de passe affichés. Cliquez sur l'icône de copie pour copier l'email et le mot de passe.

### Étape 2: Connectez-vous
**Allez à:** `http://localhost:3000/login`

Collez l'email et le mot de passe, puis cliquez sur "Sign in".

---

## 📋 Identifiants de Test Prêts à L'Emploi

Voici les 3 comptes disponibles:

### 1️⃣ Admin (Accès Complet)
```
Email:    admin@sttis.tea
Password: Admin@12345
Rôle:     Administrateur
```
→ Idéal pour tester **toutes les fonctionnalités**

### 2️⃣ Quality Manager (Gestion Qualité)
```
Email:    qa@sttis.tea
Password: QA@12345
Rôle:     Responsable Qualité
```
→ Pour tester **traçabilité et qualité des lots**

### 3️⃣ Stock Manager (Gestion des Stocks)
```
Email:    stock@sttis.tea
Password: Stock@12345
Rôle:     Responsable Stocks
```
→ Pour tester **inventaire et prédictions IA**

---

## 📍 Pages Principales

Une fois connecté(e), vous pouvez accéder à:

| Page | Lien | Ce que vous pouvez faire |
|------|------|--------------------------|
| **Dashboard** | `/dashboard` | Voir les métriques clés |
| **Produits** | `/dashboard/products` | Gérer les produits de thé |
| **Lots** | `/dashboard/batches` | Créer et suivre les batches |
| **Stock** | `/dashboard/stock` | Gérer l'inventaire |
| **Insights IA** | `/dashboard/insights` | Voir prédictions et anomalies |
| **Chat IA** | `/dashboard/chat` | Poser des questions au chatbot |
| **Paramètres** | `/dashboard/settings` | Modifier votre profil |

---

## 🆘 Si Vous Avez un Problème

### ❌ "Email ou mot de passe incorrect"
**Solution:** 
- Vérifiez que vous avez copié **correctement** (pas d'espaces)
- Assurez-vous que la **casse est correcte** (majuscules/minuscules)
- Allez à `/demo` et copiez à nouveau

### ❌ "Impossible de créer un compte"
**Solution:**
- Utilisez les **identifiants de test fournis** au lieu de créer un compte
- Si vous voulez un compte personnel, utilisez un **email unique** et un mot de passe d'au moins 6 caractères

### ❌ "Connexion impossible / Erreur Supabase"
**Solutions:**
1. Videz le cache: `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
2. Rafraîchissez la page: `F5`
3. Essayez un **navigateur différent**
4. Vérifiez votre **connexion Internet**

### ❌ "Les données ne s'affichent pas après connexion"
**Solutions:**
1. Rafraîchissez: `F5`
2. Videz le cache
3. Reconnectez-vous
4. Vérifiez que vous êtes **connecté** (avez-vous cliqué sur "Sign in"?)

---

## 💡 Pour Mieux Comprendre

| Question | Réponse |
|----------|--------|
| **Quel compte choisir?** | Commencez par **Admin** pour explorer tout, ou choisissez selon votre rôle |
| **Est-ce gratuit?** | Oui, c'est un système de démonstration pour tester |
| **Les données sont-elles réelles?** | Non, ce sont des données de démonstration pour les tests |
| **Combien de temps reste-je connecté?** | Jusqu'à ce que vous vous déconnectiez manuellement |
| **Je peux modifier les données?** | Oui, selon votre rôle d'utilisateur |
| **Je peux créer plusieurs comptes?** | Oui, mais utilisez d'abord les identifiants de test |

---

## 🎯 Scénarios de Test Recommandés

### Scénario 1: Découvrir le Système (15 min)
1. Connectez-vous avec **Admin**
2. Explorez le dashboard
3. Allez voir les **Produits**, **Lots** et **Stock**
4. Regardez les **Insights IA**

### Scénario 2: Tester la Traçabilité (10 min)
1. Connectez-vous avec **Quality Manager**
2. Allez à **Lots**
3. Créez un nouveau lot
4. Générez un QR code
5. Visitez la page de traçabilité

### Scénario 3: Tester l'IA (10 min)
1. Connectez-vous avec **Stock Manager**
2. Allez à **Insights IA**
3. Générez des prédictions
4. Allez au **Chat IA**
5. Posez une question

---

## 📱 Accès Rapide par Lien

Cliquez directement sur les liens:

- **Page Demo:** http://localhost:3000/demo
- **Connexion:** http://localhost:3000/login
- **Inscription:** http://localhost:3000/signup
- **Aide:** http://localhost:3000/help
- **Accueil:** http://localhost:3000

---

## 🎓 Prochaines Étapes

1. ✅ Allez à `/demo`
2. ✅ Copiez les identifiants
3. ✅ Allez à `/login`
4. ✅ Connectez-vous
5. ✅ Explorez le système

---

## 📞 Documentation

Pour plus d'informations:
- **Guide Complet:** `README.md`
- **Questions Fréquentes:** `TEST_CREDENTIALS.md`
- **Centre d'Aide:** `/help`
- **Déploiement:** `DEPLOYMENT.md`

---

**Vous êtes prêt(e)! Bonne visite! 🍵**
