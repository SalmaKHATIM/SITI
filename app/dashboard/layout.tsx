'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-provider';
import {
  BarChart3,
  Boxes,
  Leaf,
  LogOut,
  Map,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Zap,
  Truck,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading STTIS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-primary">STTIS</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Tea Intelligence</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-sidebar-border">
          <p className="text-sm font-medium text-sidebar-foreground">
            {user.email}
          </p>
          <p className="text-xs text-sidebar-foreground/60">
            {user.role}
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          <Link href="/dashboard/products">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Leaf className="w-4 h-4 mr-2" />
              Products
            </Button>
          </Link>

          <Link href="/dashboard/batches">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Boxes className="w-4 h-4 mr-2" />
              Batches
            </Button>
          </Link>

          <Link href="/dashboard/stock">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Zap className="w-4 h-4 mr-2" />
              Stock
            </Button>
          </Link>

          <Link href="/dashboard/insights">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
          </Link>

          <Link href="/dashboard/chat">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat Assistant
            </Button>
          </Link>

          {/* Divider */}
          <div className="my-2 h-px bg-sidebar-border"></div>

          {/* New Features */}
          <Link href="/dashboard/logistics">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Truck className="w-4 h-4 mr-2" />
              Logistics & Tracking
            </Button>
          </Link>

          {/* Admin Only */}
          {user?.role === 'Administrator' && (
            <Link href="/dashboard/users">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Users className="w-4 h-4 mr-2" />
                Users Management
              </Button>
            </Link>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-sidebar-border space-y-2">
          <Link href="/dashboard/settings">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>

          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-6">
          <h2 className="text-lg font-semibold text-foreground">STTIS Dashboard</h2>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
