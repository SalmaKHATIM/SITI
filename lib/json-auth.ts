import credentials from '@/credentials.json';

export interface User {
  id: number;
  email: string;
  role: string;
  role_fr: string;
  description: string;
  permissions: string[];
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const authenticateUser = (email: string, password: string): AuthResult => {
  console.log('[v0] Attempting login with email:', email);
  
  const account = credentials.accounts.find(
    (acc: any) => acc.email === email && acc.password === password
  );

  if (account) {
    console.log('[v0] Login successful for:', email);
    const user: User = {
      id: account.id,
      email: account.email,
      role: account.role,
      role_fr: account.role_fr,
      description: account.description,
      permissions: account.permissions,
    };
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sttis_user', JSON.stringify(user));
      localStorage.setItem('sttis_auth_token', `token_${account.id}_${Date.now()}`);
    }
    
    return { success: true, user };
  }

  console.log('[v0] Login failed for:', email);
  return {
    success: false,
    error: 'Email ou mot de passe invalide',
  };
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sttis_user');
    localStorage.removeItem('sttis_auth_token');
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('sttis_user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('sttis_auth_token');
  }
  return false;
};
