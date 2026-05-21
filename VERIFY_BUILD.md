# Vérification du Build STTIS v2

## Avant de Démarrer

Assurez-vous que:
- Node.js et pnpm sont installés
- Vous êtes dans le répertoire `/vercel/share/v0-project`
- Les dépendances ont été installées

---

## 1️⃣ Vérifier les Fichiers Créés

### Commande
```bash
ls -la app/dashboard/*/page.tsx app/api/users/route.ts components/map/leaflet-map.tsx
```

### Résultat Attendu
```
✓ app/dashboard/users/page.tsx (288 lignes)
✓ app/dashboard/origins-map/page.tsx (184 lignes)
✓ app/dashboard/reports/page.tsx (343 lignes)
✓ app/api/users/route.ts (158 lignes)
✓ components/map/leaflet-map.tsx (124 lignes)
```

---

## 2️⃣ Vérifier les Fichiers Modifiés

### Commande
```bash
grep -l "tea_products\|stock_movements\|Users Management" \
  app/dashboard/batches/page.tsx \
  app/dashboard/stock/page.tsx \
  app/dashboard/layout.tsx
```

### Résultat Attendu
```
✓ app/dashboard/batches/page.tsx (table renommée)
✓ app/dashboard/stock/page.tsx (table renommée)
✓ app/dashboard/layout.tsx (navigation mise à jour)
```

---

## 3️⃣ Vérifier les Dépendances

### Commande
```bash
pnpm list | grep -E "jspdf|html2canvas|react-leaflet|leaflet"
```

### Résultat Attendu
```
✓ jspdf@^2.x
✓ html2canvas@^1.x
✓ react-leaflet@^4.x
✓ leaflet@^1.x
```

---

## 4️⃣ Démarrer l'Application

### Commande
```bash
npm run dev
```

### Résultat Attendu
```
✓ Server running on http://localhost:3000
✓ Compilation réussie
✓ Pas d'erreurs critiques
```

---

## 5️⃣ Tester l'Authentification

### Étapes
1. Ouvrir http://localhost:3000/login
2. Entrer: `admin@sttis.local` / `Admin@123456`
3. Cliquer "Sign In"

### Résultat Attendu
```
✓ Redirection vers /dashboard
✓ Affichage du nom d'utilisateur
✓ Navigation complète visible
```

---

## 6️⃣ Vérifier la Navigation

### Page Dashboard
```
✓ Dashboard (page d'accueil)
✓ Products (produits)
✓ Batches (lots) ← FIXED
✓ Stock Management (stock) ← FIXED
✓ Origins Map (carte) ← NEW
✓ Reports (rapports) ← NEW
✓ Users Management (admin only) ← NEW
✓ Settings
```

---

## 7️⃣ Tester les Pages Corrigées

### Page Batches
```bash
# Naviguer à http://localhost:3000/dashboard/batches

Vérifications:
✓ Les lots s'affichent (data from tea_products)
✓ Chaque lot montre le produit associé
✓ Formulaire "New Batch" fonctionne
✓ Création de lot réussie
```

### Page Stock
```bash
# Naviguer à http://localhost:3000/dashboard/stock

Vérifications:
✓ Les mouvements s'affichent (data from stock_movements)
✓ Chaque mouvement montre le produit
✓ Formulaire "Add Stock" fonctionne
✓ Ajout de stock réussi
```

---

## 8️⃣ Tester les Nouvelles Fonctionnalités

### Gestion des Utilisateurs
```bash
# http://localhost:3000/dashboard/users
# Connecté: admin@sttis.local

Vérifications:
✓ Page accessible (admin only)
✓ Les 3 utilisateurs par défaut affichés
✓ Formulaire de création fonctionne
✓ CRUD complet opérationnel
```

### Carte des Origines
```bash
# http://localhost:3000/dashboard/origins-map

Vérifications:
✓ Carte Leaflet s'affiche
✓ 8 marqueurs visibles
✓ Liste des régions à gauche
✓ Popups au clic sur marqueurs
```

### Export PDF
```bash
# http://localhost:3000/dashboard/reports

Vérifications:
✓ Statistiques affichées
✓ 3 types de rapports disponibles
✓ Bouton "Télécharger PDF" fonctionne
✓ PDF généré avec contenu correct
```

---

## 9️⃣ Tester le Contrôle d'Accès

### Admin (admin@sttis.local)
```
✓ Accès à tous les menus
✓ Users Management visible
```

### QA Manager (qa@sttis.local)
```
1. Se déconnecter
2. Se connecter avec qa@sttis.local / QA@123456
3. Vérifier:
   ✓ Batches accessible
   ✓ Stock NON accessible (redirection)
   ✓ Users Management NON accessible
   ✓ Origins Map accessible
```

### Stock Manager (stock@sttis.local)
```
1. Se déconnecter
2. Se connecter avec stock@sttis.local / Stock@123456
3. Vérifier:
   ✓ Batches NON accessible
   ✓ Stock accessible
   ✓ Users Management NON accessible
   ✓ Origins Map accessible
```

---

## 🔟 Tester l'API

### Récupérer tous les utilisateurs
```bash
curl http://localhost:3000/api/users
```

**Résultat attendu**: Liste JSON des 3 utilisateurs

### Créer un utilisateur
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@sttis.local",
    "password":"Test@123456",
    "fullName":"Test User",
    "role":"Quality Manager"
  }'
```

**Résultat attendu**: Nouvel utilisateur créé

---

## 📋 Checklist Finale

### Fichiers
- [ ] app/dashboard/batches/page.tsx modifié
- [ ] app/dashboard/stock/page.tsx modifié
- [ ] app/dashboard/layout.tsx modifié
- [ ] app/dashboard/users/page.tsx créé
- [ ] app/dashboard/origins-map/page.tsx créé
- [ ] app/dashboard/reports/page.tsx créé
- [ ] app/api/users/route.ts créé
- [ ] components/map/leaflet-map.tsx créé

### Dépendances
- [ ] jspdf installé
- [ ] html2canvas installé
- [ ] react-leaflet installé
- [ ] leaflet installé

### Fonctionnalités
- [ ] Page Batches affiche les données
- [ ] Page Stock affiche les données
- [ ] Création de lot fonctionne
- [ ] Ajout de stock fonctionne
- [ ] Gestion des utilisateurs fonctionne
- [ ] Carte des origines s'affiche
- [ ] Export PDF fonctionne
- [ ] Contrôle d'accès fonctionne

### Tests
- [ ] Admin peut tout faire
- [ ] QA Manager a accès limité
- [ ] Stock Manager a accès limité
- [ ] Redirection des pages restreintes
- [ ] API /users fonctionne

---

## 🆘 Si Quelque Chose Ne Fonctionne Pas

### Erreur: "Cannot find module 'jspdf'"
```bash
pnpm install jspdf html2canvas react-leaflet leaflet
pnpm install
npm run dev
```

### Erreur: "Cannot find table 'products'"
```
✓ Les tables existent dans la base de données
✓ Vérifiez que vous utilisez 'tea_products'
✓ Les modifications ont été appliquées
```

### La carte ne s'affiche pas
```bash
# Vérifier les imports
grep -n "import.*leaflet" app/dashboard/origins-map/page.tsx

# Redémarrer
npm run dev
```

### Users Management n'est pas visible
```
✓ Vérifiez que vous êtes connecté comme admin
✓ Vérifiez que le layout a été mis à jour
✓ Vérifiez que user.role === 'Administrator'
```

---

## 📞 Ressources

### Documentation Fournie
1. **BUILD_COMPLETE.md** - Vue d'ensemble complète
2. **IMPLEMENTATION_SUMMARY.md** - Détails techniques
3. **TESTING_GUIDE.md** - Guide de test étape par étape
4. **GUIDE_AUTHENTIFICATION.md** - Système d'authentification

### Fichiers de Configuration
- `/credentials.json` - Mots de passe des 3 utilisateurs
- `/DATABASE_SCHEMA.sql` - Schéma de la base de données
- `/scripts/02-seed-data.sql` - Données d'exemple

---

## ✅ Prêt?

Si tout passe cette vérification, votre STTIS v2 est **100% opérationnel**! 

🚀 Commencez à utiliser votre application!

