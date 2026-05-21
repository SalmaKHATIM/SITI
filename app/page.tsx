'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Leaf, TrendingUp, Shield, Zap, BarChart3, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        router.push('/dashboard');
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-40 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-40 animate-pulse"></div>

      {/* Navigation with glassmorphism */}
      <nav className="relative z-50 backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">STTIS</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 text-white border-0 shadow-md transition-all duration-300"
            >
              Login <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Brand Image */}
      <section className="relative w-full z-10">
        <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
          <img
            src="/images/hero-banner.jpg"
            alt="STTI Premium Tea Packing"
            className="w-full h-full object-cover"
          />
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background"></div>
        </div>
      </section>

      {/* Introduction Section with glassmorphism card */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 -mt-20 mb-20">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-2 justify-center mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Premium Tea Supply Chain Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-center mb-6 leading-tight">
            Smart Tea Traceability & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Intelligence System</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-10 leading-relaxed">
            Enterprise-grade supply chain management for premium tea producers. Real-time traceability, AI-powered insights, and intelligent inventory optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-white px-10 py-6 text-lg font-semibold border-0 rounded-xl transition-all duration-300"
            >
              Sign In <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section with Image */}
      <section className="relative w-full py-20 z-10 px-4 md:px-8">
        <div className="relative w-full max-w-6xl mx-auto h-[300px] md:h-[400px] overflow-hidden rounded-4xl">
          <img
            src="/images/tea-leaves-hero.jpg"
            alt="Tea Products & Services"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to manage your tea supply chain with intelligence and precision</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Complete Traceability</h3>
            <p className="text-muted-foreground leading-relaxed">Track every batch from production to delivery with QR codes and comprehensive audit logs.</p>
          </div>

          {/* Feature 2 */}
          <div className="group backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-accent/5 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-accent/20 transition-all">
              <TrendingUp className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Sales Forecasting</h3>
            <p className="text-muted-foreground leading-relaxed">AI-powered predictions up to 12 months ahead. Optimize inventory and maximize profitability.</p>
          </div>

          {/* Feature 3 */}
          <div className="group backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 hover:border-secondary/50 hover:bg-gradient-to-br hover:from-secondary/10 hover:to-secondary/5 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-secondary/20 transition-all">
              <Zap className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Smart Stock Management</h3>
            <p className="text-muted-foreground leading-relaxed">Intelligent thresholds, automatic alerts, and ML-powered optimization recommendations.</p>
          </div>

          {/* Feature 4 */}
          <div className="group backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Anomaly Detection</h3>
            <p className="text-muted-foreground leading-relaxed">Real-time monitoring for quality issues and production anomalies with severity assessment.</p>
          </div>

          {/* Feature 5 */}
          <div className="group backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-accent/5 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-accent/20 transition-all">
              <MessageSquare className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">NLP Chat Assistant</h3>
            <p className="text-muted-foreground leading-relaxed">Ask natural language questions about products, batches, and traceability. Get instant answers.</p>
          </div>

          {/* Feature 6 */}
          <div className="group backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 hover:border-secondary/50 hover:bg-gradient-to-br hover:from-secondary/10 hover:to-secondary/5 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-secondary/20 transition-all">
              <Shield className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Role-Based Access</h3>
            <p className="text-muted-foreground leading-relaxed">Flexible permission system for Admin, Quality Managers, and Stock Managers with full audit trails.</p>
          </div>
        </div>
      </section>

      {/* Who Are We Section */}
      <section className="relative w-full py-20 z-10 px-4 md:px-8">
        <div className="relative w-full max-w-6xl mx-auto h-[350px] md:h-[450px] overflow-hidden rounded-3xl">
          <img
            src="/images/tea-products-gallery.jpg"
            alt="Who Are We - Tea Products Gallery"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative w-full py-20 z-10 px-4 md:px-8">
        <div className="relative w-full max-w-6xl mx-auto h-[350px] md:h-[450px] overflow-hidden rounded-3xl">
          <img
            src="/images/tea-quality-ecosystem.jpg"
            alt="Values of the Ecosystem"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="backdrop-blur-xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 border border-white/20 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Ready to Transform Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tea Supply Chain?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Start your STTIS journey today and gain complete visibility and control over your tea operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border border-white/30 hover:bg-white/20 px-12 py-6 text-lg rounded-xl transition-all duration-300"
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-lg bg-white/5 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg text-foreground">STTIS</span>
              </div>
              <p className="text-muted-foreground text-sm">Smart Tea Traceability & Intelligence System</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2026 STTIS. Smart Tea Traceability & Intelligence System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
