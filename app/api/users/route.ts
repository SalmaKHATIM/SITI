import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const CREDENTIALS_FILE = path.join(process.cwd(), 'credentials.json');

interface UserAccount {
  id?: string | number;
  email: string;
  password: string;
  role: string;
  role_fr?: string;
  full_name?: string;
  created_at?: string;
  permissions?: string[];
  source?: 'credentials' | 'database';
}

// GET: Récupérer tous les utilisateurs (credentials + database)
export async function GET() {
  try {
    const allUsers: UserAccount[] = [];
    const emailsProcessed = new Set<string>();

    // 1. Récupérer les utilisateurs de credentials.json
    let credentialsUsers: UserAccount[] = [];
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
      const credentials = JSON.parse(data);
      credentialsUsers = (credentials.accounts || []).map((account: UserAccount) => ({
        ...account,
        password: account.password ? '*'.repeat(8) : '',
        source: 'credentials',
      }));
    }

    // Ajouter les utilisateurs de credentials
    credentialsUsers.forEach((user) => {
      allUsers.push(user);
      emailsProcessed.add(user.email);
    });

    // 2. Récupérer les utilisateurs de Supabase
    const { data: dbUsers, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('[STTIS] Supabase error:', error);
    } else if (dbUsers && Array.isArray(dbUsers)) {
      // Mapper les rôles français aux rôles techniques
      const roleFrToEn: { [key: string]: string } = {
        'Administrateur': 'Administrator',
        'Responsable Qualité': 'Quality Manager',
        'Responsable Stocks': 'Stock Manager',
      };

      const roleEnToFr: { [key: string]: string } = {
        'Administrator': 'Administrateur',
        'Quality Manager': 'Responsable Qualité',
        'Stock Manager': 'Responsable Stocks',
      };

      // Ajouter les utilisateurs de la DB qui ne sont pas déjà dans credentials
      dbUsers.forEach((dbUser: any) => {
        if (!emailsProcessed.has(dbUser.email)) {
          // Déterminer le rôle technique (priorité au rôle EN s'il existe)
          let techRole = dbUser.role || 'Stock Manager';
          let frRole = dbUser.role_fr || roleEnToFr[techRole] || 'Responsable Stocks';

          // Si le rôle est en français, le convertir en anglais
          if (!['Administrator', 'Quality Manager', 'Stock Manager'].includes(techRole)) {
            techRole = roleFrToEn[techRole] || techRole;
          }

          allUsers.push({
            id: dbUser.id,
            email: dbUser.email,
            password: '*'.repeat(8),
            role: techRole,
            role_fr: frRole,
            full_name: dbUser.full_name,
            created_at: dbUser.created_at,
            source: 'database',
          });
          emailsProcessed.add(dbUser.email);
        }
      });
    }

    return NextResponse.json({ accounts: allUsers });
  } catch (error) {
    console.error('[STTIS] Error reading users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST: Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, mot de passe et rôle requis' },
        { status: 400 }
      );
    }

    let credentials = { accounts: [] };
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
      credentials = JSON.parse(data);
    }

    // Vérifier que l'email n'existe pas déjà dans credentials
    if (credentials.accounts.some((acc: UserAccount) => acc.email === email)) {
      return NextResponse.json(
        { error: 'Cet email existe déjà' },
        { status: 400 }
      );
    }

    // Vérifier que l'email n'existe pas dans la base de données
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email existe déjà dans la base de données' },
        { status: 400 }
      );
    }

    // Mapper le rôle
    const roleMap: { [key: string]: string } = {
      'Administrator': 'Administrator',
      'Quality Manager': 'Quality Manager',
      'Stock Manager': 'Stock Manager',
    };

    const roleFrMap: { [key: string]: string } = {
      'Administrator': 'Administrateur',
      'Quality Manager': 'Responsable Qualité',
      'Stock Manager': 'Responsable Stocks',
    };

    const newUser: UserAccount = {
      id: credentials.accounts.length + 1,
      email,
      password,
      role: roleMap[role] || role,
      role_fr: roleFrMap[role] || role,
      full_name: full_name || null,
      created_at: new Date().toISOString(),
      permissions: [],
      source: 'credentials',
    };

    credentials.accounts.push(newUser);
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));

    return NextResponse.json({
      message: 'Utilisateur créé avec succès',
      user: { ...newUser, password: '*'.repeat(8) },
    });
  } catch (error) {
    console.error('[STTIS] Error creating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un utilisateur
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email } = body;

    if (!id && !email) {
      return NextResponse.json(
        { error: 'ID ou email utilisateur requis' },
        { status: 400 }
      );
    }

    // Protection de l'admin principal
    if (email === 'admin@sttis.local') {
      return NextResponse.json(
        { error: 'Impossible de supprimer l\'administrateur principal' },
        { status: 403 }
      );
    }

    let deleted = false;

    // 1. Essayer de supprimer de credentials.json
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
      const credentials = JSON.parse(data);

      const userToDelete = credentials.accounts.find(
        (acc: UserAccount) => acc.email === email || acc.id === id
      );

      if (userToDelete?.email === 'admin@sttis.local') {
        return NextResponse.json(
          { error: 'Impossible de supprimer l\'administrateur principal' },
          { status: 403 }
        );
      }

      const initialLength = credentials.accounts.length;
      credentials.accounts = credentials.accounts.filter(
        (acc: UserAccount) => acc.email !== email && acc.id !== id
      );

      if (credentials.accounts.length < initialLength) {
        fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
        deleted = true;
      }
    }

    // 2. Essayer de supprimer de la base de données
    if (!deleted && id) {
      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (!dbError) {
        deleted = true;
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('[STTIS] Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}
