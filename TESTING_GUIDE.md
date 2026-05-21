# Guide de Test - STTIS v2

## Préparation

1. **Démarrer l'application**
```bash
npm run dev
```

2. **Se connecter**
- URL: http://localhost:3000/login
- Email: `admin@sttis.local`
- Mot de passe: `Admin@123456`

---

## 1. Test de la Page Batches ✅

### Étape 1: Naviguer vers Batches
```
Dashboard → Batches
URL: http://localhost:3000/dashboard/batches
```

### Étape 2: Vérifier le chargement
- [ ] Les lots s'affichent dans la liste
- [ ] Le nombre de lots correspond à la base de données
- [ ] Chaque lot affiche: Numéro, Statut, Produit, Quantité

### Étape 3: Créer un lot
```
1. Cliquer "New Batch"
2. Remplir le formulaire:
   - Batch Number: (auto-généré ou personnalisé)
   - Product: Choisir un produit
   - Quantity: 50 kg
   - Production Date: Aujourd'hui
3. Cliquer "Create Batch"
```

### Étape 4: Vérifier le résultat
- [ ] Message "Lot créé avec succès!" apparaît
- [ ] Le nouveau lot apparaît en haut de la liste
- [ ] Le statut est "pending"

---

## 2. Test de la Page Stock ✅

### Étape 1: Naviguer vers Stock
```
Dashboard → Stock Management
URL: http://localhost:3000/dashboard/stock
```

### Étape 2: Vérifier le chargement
- [ ] Les mouvements de stock s'affichent
- [ ] Chaque mouvement affiche: Type, Produit, Quantité, Localisation

### Étape 3: Ajouter du stock
```
1. Cliquer "Add Stock"
2. Remplir le formulaire:
   - Product: Choisir un produit
   - Warehouse Location: "Warehouse A, Zone 1"
   - Quantity: 100 kg
   - Min Threshold: 20 kg
   - Max Threshold: 500 kg
3. Cliquer "Add Stock Level"
```

### Étape 4: Vérifier le résultat
- [ ] Message "Stock ajouté avec succès!" apparaît
- [ ] Le nouveau mouvement apparaît dans la liste
- [ ] Les quantités sont correctes

---

## 3. Test de la Gestion des Utilisateurs (Admin) ⭐

### Étape 1: Naviguer vers Users
```
Dashboard → Users Management
URL: http://localhost:3000/dashboard/users
```

### Étape 2: Vérifier le chargement
- [ ] Les 3 utilisateurs par défaut s'affichent:
  - admin@sttis.local (Administrator)
  - qa@sttis.local (Quality Manager)
  - stock@sttis.local (Stock Manager)
- [ ] Les rôles sont affichés en badges colorés

### Étape 3: Créer un nouvel utilisateur
```
1. Cliquer "Nouvel Utilisateur"
2. Remplir le formulaire:
   - Email: test@sttis.local
   - Mot de passe: Test@123456
   - Nom complet: Test User
   - Rôle: Quality Manager
3. Cliquer "Créer Utilisateur"
```

### Étape 4: Vérifier le résultat
- [ ] Message "Utilisateur créé avec succès!" apparaît
- [ ] Le nouvel utilisateur apparaît dans la liste
- [ ] L'email et le rôle sont corrects

### Étape 5: Tester l'accès (Test d'un autre utilisateur)
```
1. Se déconnecter
2. Se connecter avec test@sttis.local / Test@123456
3. Essayer d'accéder à /dashboard/users
```

### Étape 6: Vérifier le contrôle d'accès
- [ ] Redirection vers /dashboard
- [ ] Message "Accès Refusé - Seuls les administrateurs..."

### Étape 7: Supprimer l'utilisateur de test
```
1. Se reconnecter avec admin@sttis.local
2. Aller à Users Management
3. Trouver test@sttis.local
4. Cliquer le bouton Trash
5. Confirmer la suppression
```

### Étape 8: Vérifier la suppression
- [ ] Message "Utilisateur supprimé avec succès!"
- [ ] test@sttis.local n'apparaît plus dans la liste

---

## 4. Test de la Carte des Origines 🌍

### Étape 1: Navigater vers Origins Map
```
Dashboard → Origins Map
URL: http://localhost:3000/dashboard/origins-map
```

### Étape 2: Vérifier la carte
- [ ] La carte Leaflet s'affiche
- [ ] La carte est centrée sur l'Asie
- [ ] Des marqueurs sont visibles (8 régions)

### Étape 3: Vérifier les régions
- [ ] La liste des régions apparaît à gauche
- [ ] Chaque région affiche:
  - Nom de la région
  - Type de thé (Thé Vert, Noir, etc.)
  - Nombre de produits

### Étape 4: Interagir avec la carte
```
1. Cliquer sur une région de la liste
2. La région doit être mise en évidence sur la carte
3. Un popup doit s'afficher
```

### Étape 5: Vérifier les statistiques
- [ ] Le nombre de régions actives est affiché
- [ ] Le total de produits est correct
- [ ] Les codes couleur correspondent aux types

---

## 5. Test de l'Export PDF 📊

### Étape 1: Naviguer vers Reports
```
Dashboard → Reports
URL: http://localhost:3000/dashboard/reports
```

### Étape 2: Vérifier les statistiques
- [ ] Total Produits s'affiche
- [ ] Total Lots s'affiche
- [ ] Alertes Stock s'affiche
- [ ] Score Qualité Moyen s'affiche

### Étape 3: Générer un rapport complet
```
1. Sélectionner "Rapport Complet"
2. Cliquer "Télécharger le Rapport PDF"
```

### Étape 4: Vérifier le téléchargement
- [ ] Un fichier PDF est téléchargé
- [ ] Le nom est: rapport-sttis-[timestamp].pdf

### Étape 5: Vérifier le contenu du PDF
```
Ouvrir le PDF et vérifier:
- [ ] Titre "Rapport STTIS"
- [ ] Date de génération
- [ ] Statistiques Inventaire
- [ ] Liste des Produits (max 10)
- [ ] Liste des Lots (max 10)
- [ ] Alertes Actives
- [ ] Footer avec heure de génération
```

### Étape 6: Tester les autres types
```
Répéter pour:
- Rapport Inventaire (stocks et alertes)
- Rapport Qualité (lots et contrôles)
```

---

## 6. Test du Contrôle d'Accès 🔐

### Scénario 1: Admin
```
Connecté: admin@sttis.local
Accès à:
- [X] Dashboard
- [X] Products
- [X] Batches
- [X] Stock
- [X] Users Management ← Admin only!
- [X] Origins Map
- [X] Reports
```

### Scénario 2: Quality Manager
```
Connecté: qa@sttis.local
Accès à:
- [X] Dashboard
- [X] Products
- [X] Batches ← Peut voir/créer
- [ ] Stock ← Accès refusé
- [ ] Users Management ← Accès refusé
- [X] Origins Map ← Lecture seule
- [X] Reports ← Qualité uniquement
```

### Scénario 3: Stock Manager
```
Connecté: stock@sttis.local
Accès à:
- [X] Dashboard
- [X] Products ← Lecture seule
- [ ] Batches ← Accès refusé
- [X] Stock ← Peut gérer
- [ ] Users Management ← Accès refusé
- [X] Origins Map ← Lecture seule
- [X] Reports ← Inventaire uniquement
```

---

## Checklist Complète

### Corrections (FIXED)
- [ ] Page Batches charge et affiche les données
- [ ] Page Stock charge et affiche les données
- [ ] Création de lot fonctionne
- [ ] Ajout de stock fonctionne

### Nouvelles Fonctionnalités (ADDED)
- [ ] Gestion des utilisateurs fonctionnelle
- [ ] Carte des origines affichée correctement
- [ ] Export PDF fonctionne
- [ ] API /api/users responsive

### Contrôle d'Accès
- [ ] Admin peut gérer les utilisateurs
- [ ] QA Manager ne peut pas gérer les utilisateurs
- [ ] Stock Manager ne peut pas gérer les utilisateurs
- [ ] Les pages restreintes redirigent

### Performance
- [ ] Les pages se chargent rapidement
- [ ] Les images se chargent correctement
- [ ] Pas d'erreurs dans la console
- [ ] Les PDFs se génèrent rapidement

---

## Commandes Utiles

### Voir les logs
```bash
# Terminal 1: Démarrer l'app
npm run dev

# Terminal 2: Voir les logs
tail -f /tmp/sttis-debug.log
```

### Réinitialiser les données
```bash
# Supprimer les données de test
rm credentials.json

# Redémarrer
npm run dev
```

### Tester l'API directement
```bash
# Récupérer tous les utilisateurs
curl http://localhost:3000/api/users

# Créer un utilisateur
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"Test@123456",
    "role":"Quality Manager"
  }'
```

---

✅ Vous êtes prêt à tester!

Si vous trouvez des problèmes, consultez IMPLEMENTATION_SUMMARY.md pour plus de détails.

