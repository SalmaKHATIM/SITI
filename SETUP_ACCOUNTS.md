# Configuration des Comptes STTIS

## Identifiants Disponibles

Les identifiants de test sont sauvegardés dans deux fichiers:

- **CREDENTIALS.csv** - Format CSV pour import
- **CREDENTIALS.txt** - Format texte lisible

### Comptes de Connexion

```
1. ADMINISTRATEUR
   Email:    admin@sttis.local
   Password: Admin@123456

2. RESPONSABLE QUALITÉ  
   Email:    qa@sttis.local
   Password: QA@123456

3. RESPONSABLE STOCKS
   Email:    stock@sttis.local
   Password: Stock@123456
```

## Démarrage Rapide

### Option 1: Connexion Directe

1. Ouvrez `http://localhost:3000/login`
2. Entrez un email et mot de passe ci-dessus
3. Cliquez sur "Se connecter"

### Option 2: Créer les Comptes dans Supabase

Si vous voulez créer automatiquement les comptes de test:

```bash
# Assurer que les variables d'environnement sont définies
export NEXT_PUBLIC_SUPABASE_URL=votre_url
export SUPABASE_SERVICE_ROLE_KEY=votre_cle

# Lancer le script de création
node scripts/setup-accounts.js
```

## Variables d'Environnement Requises

Vérifiez que vous avez les variables correctes dans `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Recommandations

- **Pour explorer le système complet**: Utilisez le compte **ADMINISTRATEUR**
- **Pour tester les rôles limités**: Utilisez QA ou Stock Manager
- **Tous les mots de passe sont temporaires**: Changez-les après la première connexion

## Dépannage

**"Email not found" lors de la connexion?**
- Vérifiez que l'email est orthographié correctement
- Les emails sont sensibles à la casse
- Assurez-vous que Supabase est configuré correctement

**"Invalid password"?**
- Vérifiez que le mot de passe est correct (sensible à la casse)
- Réinitialiser le mot de passe via la page de connexion si nécessaire

**Le compte n'existe pas?**
- Lancez le script: `node scripts/setup-accounts.js`
- Ou créez un compte manuellement via la page inscription

## Support

Consultez les fichiers:
- `CREDENTIALS.txt` - Identifiants en format texte
- `CREDENTIALS.csv` - Identifiants en format CSV
- `.env.example` - Variables d'environnement requises
