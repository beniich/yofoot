'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  Warehouse, 
  Activity, 
  BarChart3, 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Menu,
  TrendingUp,
  TrendingDown,
  Globe,
  Brain,
  Users,
  DollarSign,
  ShoppingCart,
  Truck,
  Settings,
  Bell,
  Search,
  Filter,
  ChevronDown,
  Building,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  PieChart,
  LineChart,
  Database,
  Shield,
  CreditCard,
  Calendar,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Cpu,
  Network,
  Crown,
  Star,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Info,
  UserCheck,
  Mail,
  Phone,
  Globe2,
  Server,
  Lock,
  Unlock,
  Ban,
  Unban,
  Clock,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';

// Types for Multi-tenant SaaS ERP
interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  max_users: number;
  max_storage_mb: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  settings: Record<string, any>;
  billing_info: Record<string, any>;
  usage_stats: {
    users_count: number;
    storage_used_mb: number;
    api_calls: number;
    ai_requests: number;
  };
}

interface User {
  id: string;
  tenant_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer';
  department: string;
  is_active: boolean;
  preferences: Record<string, any>;
}

interface GlobalResource {
  id: string;
  resource_type: string;
  resource_name: string;
  region: string;
  country: string;
  current_price: number;
  currency: string;
  unit_of_measure: string;
  availability_status: string;
  market_trends: Record<string, any>;
  last_updated: string;
}

interface AIInsight {
  id: string;
  tenant_id: string;
  insight_type: string;
  title: string;
  description: string;
  confidence_score: number;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  module_affected: string;
  recommendations: string[];
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed';
  created_at: string;
}

interface DashboardStats {
  total_revenue: number;
  total_expenses: number;
  total_customers: number;
  total_orders: number;
  active_users: number;
  ai_insights_count: number;
  inventory_value: number;
  profit_margin: number;
}

interface NavItem {
  id: string;
  tenant_id?: string;
  name: string;
  href: string;
  icon?: any;
  description?: string;
  visible?: boolean;
  order?: number;
  badge?: Record<string, any>;
  metadata?: Record<string, any>;
}

// SaaS ERP Context
const SaaSCtx = createContext<any>(null);

const useSaaS = () => {
  const context = useContext(SaaSCtx);
  if (!context) {
    throw new Error('useSaaS must be used within a SaaSProvider');
  }
  return context;
};

const SaaSProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [globalResources, setGlobalResources] = useState<GlobalResource[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [navigation, setNavigation] = useState<NavItem[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('saas_token');
    if (savedToken) {
      setToken(savedToken);
      // Load user and tenant data
      loadUserData();
    }
    // Load global resources (public data)
    loadGlobalResources();
  }, []);

  // API base (override with NEXT_PUBLIC_API_URL)
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:8000';

  // Helper for calling backend endpoints (with token)
  const backendRequest = async (path: string, method = 'GET', body?: any) => {
    const url = `${API_BASE}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Request failed ${res.status}: ${text}`);
    }
    return res.json();
  };

  const loadUserData = async () => {
    // Simulate loading user data
    const mockUser: User = {
      id: '1',
      tenant_id: 'tenant-1',
      email: 'admin@company.com',
      username: 'admin',
      first_name: 'John',
      last_name: 'Doe',
      role: 'admin',
      department: 'IT',
      is_active: true,
      preferences: {}
    };

    const mockTenant: Tenant = {
      id: 'tenant-1',
      name: 'TechCorp International',
      domain: 'techcorp.com',
      subdomain: 'techcorp',
      plan: 'enterprise',
      max_users: 1000,
      max_storage_mb: 102400,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-15',
      settings: {},
      billing_info: {},
      usage_stats: {
        users_count: 89,
        storage_used_mb: 148480,
        api_calls: 125000,
        ai_requests: 3420
      }
    };

    setUser(mockUser);
    setTenant(mockTenant);
    // Load navigation from server (tenant-scoped), fallback to localStorage
    try {
      const items = await backendRequest('/navigation');
      if (Array.isArray(items)) {
        // normalize icons if needed
        setNavigation(items.map((it: any) => ({ ...it, visible: it.visible !== false })));
        localStorage.setItem('saas_navigation', JSON.stringify(items));
      }
    } catch (err) {
      // fallback to localStorage
      const saved = localStorage.getItem('saas_navigation');
      if (saved) {
        try {
          setNavigation(JSON.parse(saved));
        } catch (e) {
          setNavigation([]);
        }
      }
    }
  };

  const loadGlobalResources = async () => {
    // Simulate global resources data
    const mockResources: GlobalResource[] = [
      {
        id: '1',
        resource_type: 'Oil',
        resource_name: 'Crude Oil Brent',
        region: 'Europe',
        country: 'UK',
        current_price: 82.45,
        currency: 'USD',
        unit_of_measure: 'Barrel',
        availability_status: 'Available',
        market_trends: { trend: 'up', change: '+2.3%', volume: 'High' },
        last_updated: new Date().toISOString()
      },
      {
        id: '2',
        resource_type: 'Metal',
        resource_name: 'Copper',
        region: 'Asia',
        country: 'China',
        current_price: 8456.78,
        currency: 'USD',
        unit_of_measure: 'Ton',
        availability_status: 'Limited',
        market_trends: { trend: 'down', change: '-1.2%', volume: 'Medium' },
        last_updated: new Date().toISOString()
      }
    ];

    setGlobalResources(mockResources);
  };

  const login = async (email: string, password: string, subdomain?: string) => {
    // Simulate API call with multi-tenant support
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if ((email === 'admin@company.com' && password === 'admin123') ||
        (email === 'user@company.com' && password === 'user123')) {
      
      const mockToken = 'saas-jwt-token-enterprise';
      setToken(mockToken);
      localStorage.setItem('saas_token', mockToken);
      
      await loadUserData();
      
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials or tenant not found' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setTenant(null);
    setAiInsights([]);
    localStorage.removeItem('saas_token');
  };

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    // If calling Next.js internal API routes, keep using relative path
    const isNextApi = endpoint.startsWith('/api');
    try {
      if (isNextApi) {
        const res = await fetch(endpoint, options);
        if (!res.ok) throw new Error('API error');
        return res.json();
      }

      // Otherwise call backend service
      const method = options.method || 'GET';
      const headers = { 'Content-Type': 'application/json' } as Record<string, string>;
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}${endpoint}`, { method, headers, body: options.body });
      if (!res.ok) {
        throw new Error('Backend API error');
      }
      return res.json();
    } catch (err) {
      // graceful fallback: return empty object
      console.warn('apiCall fallback', err);
      return {};
    }
  };

  // Navigation CRUD helpers (use backend when token is present, otherwise localStorage)
  const fetchNavigation = async () => {
    if (!token) {
      const saved = localStorage.getItem('saas_navigation');
      if (saved) return setNavigation(JSON.parse(saved));
      return setNavigation([]);
    }

    try {
      const items = await backendRequest('/navigation');
      setNavigation(items);
      localStorage.setItem('saas_navigation', JSON.stringify(items));
    } catch (e) {
      console.warn('fetchNavigation failed', e);
      const saved = localStorage.getItem('saas_navigation');
      if (saved) setNavigation(JSON.parse(saved));
    }
  };

  const addNavItem = async (item: Partial<NavItem>) => {
    // optimistic id
    const tempId = `tmp-${Date.now()}`;
    const newItem: NavItem = {
      id: tempId,
      name: item.name || 'New',
      href: item.href || '/',
      icon: item.icon || null,
      description: item.description || '',
      visible: item.visible !== false,
      order: item.order || (navigation.length + 1),
      badge: item.badge || {},
      metadata: item.metadata || {}
    };
    setNavigation(prev => [...prev, newItem]);
    try {
      if (token) {
        const created = await backendRequest('/navigation', 'POST', newItem);
        setNavigation(prev => prev.map(p => p.id === tempId ? created : p));
        localStorage.setItem('saas_navigation', JSON.stringify(navigation));
        return created;
      } else {
        localStorage.setItem('saas_navigation', JSON.stringify([...navigation, newItem]));
        return newItem;
      }
    } catch (e) {
      console.error('addNavItem failed', e);
      return null;
    }
  };

  const updateNavItem = async (id: string, patch: Partial<NavItem>) => {
    setNavigation(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
    try {
      if (token) {
        const updated = await backendRequest(`/navigation/${id}`, 'PUT', patch);
        setNavigation(prev => prev.map(it => it.id === id ? updated : it));
        localStorage.setItem('saas_navigation', JSON.stringify(navigation));
        return updated;
      } else {
        const saved = navigation.map(it => it.id === id ? { ...it, ...patch } : it);
        localStorage.setItem('saas_navigation', JSON.stringify(saved));
        return saved.find((i: any) => i.id === id);
      }
    } catch (e) {
      console.error('updateNavItem failed', e);
      return null;
    }
  };

  const removeNavItem = async (id: string) => {
    setNavigation(prev => prev.filter(it => it.id !== id));
    try {
      if (token) {
        await backendRequest(`/navigation/${id}`, 'DELETE');
        localStorage.setItem('saas_navigation', JSON.stringify(navigation));
        return true;
      } else {
        const saved = navigation.filter(it => it.id !== id);
        localStorage.setItem('saas_navigation', JSON.stringify(saved));
        return true;
      }
    } catch (e) {
      console.error('removeNavItem failed', e);
      return false;
    }
  };

  return (
    <SaaSCtx.Provider value={{ 
      token, 
      user, 
      tenant, 
      globalResources, 
      aiInsights, 
      login, 
      logout, 
      apiCall, 
      isAuthenticated: !!token 
    }}>
      {children}
    </SaaSCtx.Provider>
  );
};

// Login Component with Multi-tenant Support
const SaaSLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    subdomain: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useSaaS();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password, formData.subdomain);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Branding */}
            <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-l-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">SaaS ERP Pro</h1>
                <p className="text-blue-100 mb-8">Enterprise Resource Planning<br/>Powered by Artificial Intelligence</p>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span className="text-sm">Multi-tenant Architecture</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span className="text-sm">AI-Powered Analytics</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span className="text-sm">Global Resource Monitoring</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span className="text-sm">Real-time Insights</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-blue-200">Sign in to your enterprise dashboard</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Company Subdomain</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="your-company"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({...formData, subdomain: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-3 text-blue-300">.saas-erp.com</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@your-company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-3 text-blue-300 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5 mr-2" />
                        Sign In to Dashboard
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <p className="text-blue-200 text-sm font-medium mb-2">Demo Accounts:</p>
                <div className="space-y-1 text-blue-100 text-xs">
                  <p><strong>Admin:</strong> admin@company.com / admin123</p>
                  <p><strong>User:</strong> user@company.com / user123</p>
                  <p><strong>Subdomain:</strong> techcorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Global Resources Dashboard Component
const GlobalResourcesDashboard = () => {
  const { globalResources } = useSaaS();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Global Resources Monitor</h2>
          <p className="text-gray-600">Real-time worldwide resource pricing and availability</p>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-gray-600">Live Market Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {globalResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{resource.resource_name}</h3>
                  <p className="text-sm text-gray-600">{resource.resource_type}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(resource.availability_status)}`}>
                  {resource.availability_status}
                </span>
              </div>

              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${resource.current_price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 ml-1">/{resource.unit_of_measure}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(resource.market_trends.trend)}
                  <span className={`text-sm font-medium ${
                    resource.market_trends.trend === 'up' ? 'text-green-600' :
                    resource.market_trends.trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {resource.market_trends.change}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {resource.country}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Volume: {resource.market_trends.volume}</span>
                <span>Updated: {new Date(resource.last_updated).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Insights Component
const AIInsightsPanel = () => {
  const { aiInsights } = useSaaS();

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
          <p className="text-gray-600">Machine learning recommendations for your business</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <span className="text-sm text-gray-600">{aiInsights.length} Active Insights</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiInsights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(insight.impact_level)}`}>
                {insight.impact_level}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">{insight.module_affected}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className={`text-sm font-medium ml-1 ${getConfidenceColor(insight.confidence_score)}`}>
                    {Math.round(insight.confidence_score * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Recommendations:</p>
              <ul className="space-y-1">
                {insight.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {new Date(insight.created_at).toLocaleDateString()}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                insight.status === 'new' ? 'bg-blue-100 text-blue-800' :
                insight.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                insight.status === 'implemented' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {insight.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const SaaSDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_revenue: 0,
    total_expenses: 0,
    total_customers: 0,
    total_orders: 0,
    active_users: 0,
    ai_insights_count: 0,
    inventory_value: 0,
    profit_margin: 0
  });
  const [loading, setLoading] = useState(true);
  const { apiCall, user, tenant } = useSaaS();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiCall('/api/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `$${(stats.total_revenue / 1000000).toFixed(1)}M`, 
      icon: DollarSign, 
      color: 'bg-green-500', 
      bgColor: 'bg-green-50', 
      textColor: 'text-green-600',
      change: '+12.5%'
    },
    { 
      title: 'Active Users', 
      value: stats.active_users.toString(), 
      icon: Users, 
      color: 'bg-blue-500', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600',
      change: '+8.2%'
    },
    { 
      title: 'Total Orders', 
      value: stats.total_orders.toLocaleString(), 
      icon: ShoppingCart, 
      color: 'bg-purple-500', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600',
      change: '+23.1%'
    },
    { 
      title: 'AI Insights', 
      value: stats.ai_insights_count.toString(), 
      icon: Brain, 
      color: 'bg-orange-500', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-600',
      change: '+5 new'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enterprise Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.first_name}! Here's what's happening at {tenant?.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="font-semibold text-gray-900 capitalize">{tenant?.plan}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <div className="flex items-center text-sm font-medium text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {card.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights and Global Resources */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <AIInsightsPanel />
        <GlobalResourcesDashboard />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <DollarSign className="h-6 w-6 text-green-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">Financial Reports</p>
            <p className="text-xs text-gray-600">View P&L, Balance Sheet</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="h-6 w-6 text-blue-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">HR Management</p>
            <p className="text-xs text-gray-600">Employees, Attendance</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <ShoppingCart className="h-6 w-6 text-purple-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">Sales & CRM</p>
            <p className="text-xs text-gray-600">Customers, Opportunities</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Truck className="h-6 w-6 text-orange-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">Supply Chain</p>
            <p className="text-xs text-gray-600">Inventory, Suppliers</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// Navigation Component with Enhanced Interactivity
const SaaSNavigation = ({ currentPage, setCurrentPage, children }: { 
  currentPage: string; 
  setCurrentPage: (page: string) => void;
  children?: React.ReactNode;
}) => {
  const { user, tenant, logout } = useSaaS();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const pathname = usePathname();

  const { navigation, updateNavItem, addNavItem, removeNavItem } = useSaaS();
  const [editMode, setEditMode] = useState(false);

  // helper: toggle visibility of an item
  const toggleVisibility = (id: string) => {
    const item = navigation.find(n => n.id === id)
    if (!item) return
    updateNavItem(id, { visible: !item.visible })
  }

  const addNewNav = () => {
    addNavItem({ name: 'New', href: '/', visible: true, description: '' })
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleNavigation = (href: string) => {
    setCurrentPage(href);
    // Close mobile sidebar after navigation
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const getNotificationCount = () => {
    // Simulate notification count
    return Math.floor(Math.random() * 5) + 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col w-64 h-full bg-white shadow-xl">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-white mr-2" />
              <h1 className="text-lg font-semibold text-white">SaaS ERP Pro</h1>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-200 p-1 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name} className="mb-2">
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage === item.href 
                      ? 'bg-blue-100 text-blue-900 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 ${
                    currentPage === item.href ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    )}
                  </div>
                  {item.badge && (
                    <div className="ml-2">
                      {item.badge.count ? (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${item.badge.color}`}>
                          {item.badge.count}
                        </span>
                      ) : (
                        <span className={item.badge.color}>
                          {item.badge.text}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </nav>

          {/* Mobile User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <div className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</div>
                <div className="text-xs">{user?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          {/* Desktop Header */}
          <div className="flex items-center h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-white mr-2" />
              <h1 className="text-lg font-semibold text-white">SaaS ERP Pro</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Notification Bell */}
              <button className="relative p-2 text-white hover:bg-white/10 rounded-md transition-colors">
                <Bell className="h-5 w-5" />
                {getNotificationCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getNotificationCount()}
                  </span>
                )}
              </button>

              {/* Quick Actions */}
              <button className="p-2 text-white hover:bg-white/10 rounded-md transition-colors">
                <Settings className="h-5 w-5" />
              </button>
                {/* Edit navigation toggle */}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-3 py-1 text-white bg-white/10 hover:bg-white/20 rounded-md text-sm"
                >
                  {editMode ? 'Done' : 'Edit Nav'}
                </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {/* Main Navigation */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main</h3>
              {navigation.slice(0, 4).map((item) => (
                <div key={item.name} className="group">
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === item.href 
                        ? 'bg-blue-100 text-blue-900 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${
                      currentPage === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      )}
                    </div>
                    {item.badge && (
                      <div className="ml-2">
                        {item.badge.count ? (
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${item.badge.color}`}>
                            {item.badge.count}
                          </span>
                        ) : (
                          <span className={item.badge.color}>
                            {item.badge.text}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Business Operations */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Business Operations</h3>
              {navigation.slice(4, 8).map((item) => (
                <div key={item.name} className="group">
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === item.href 
                        ? 'bg-blue-100 text-blue-900 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${
                      currentPage === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* System */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">System</h3>
              {navigation.slice(8).map((item) => (
                <div key={item.name} className="group">
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === item.href 
                        ? 'bg-blue-100 text-blue-900 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${
                      currentPage === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Tenant Info */}
            {editMode && (
              <div className="p-3 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 mb-2">Edit Navigation</h4>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {navigation.map((nav) => (
                    <div key={nav.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={nav.visible !== false}
                          onChange={() => toggleVisibility(nav.id)}
                        />
                        <span className="truncate">{nav.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-xs text-red-500" onClick={() => removeNavItem(nav.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <button onClick={addNewNav} className="text-xs px-3 py-1 bg-blue-600 text-white rounded">Add item</button>
                </div>
              </div>
            )}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Building className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{tenant?.name}</span>
                </div>
                <div className="text-xs text-gray-600">
                  Plan: <span className="font-semibold text-gray-900 capitalize">{tenant?.plan}</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center h-16 bg-white border-b border-gray-200">
          {/* Mobile menu button */}
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="px-4 text-gray-500 hover:text-gray-600 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Breadcrumb/Navigation Path */}
          <div className="flex-1 px-4 lg:px-6">
            <div className="flex items-center text-sm text-gray-600">
              <span className="hover:text-gray-900 transition-colors">
                {navigation.find(item => item.href === currentPage)?.name || 'Dashboard'}
              </span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4 px-4 lg:px-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-600 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              {getNotificationCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getNotificationCount()}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-600">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content will be rendered here */}
        <main className="flex-1">
          {/* Content area */}
          {children}
        </main>
      </div>
    </div>
  );
};

// Import all our components
const AdvancedAnalytics = React.lazy(() => import('../components/AdvancedAnalytics'));
const SubscriptionManagement = React.lazy(() => import('../components/SubscriptionManagement'));

// Original SaaS App Component
const SaaSApp = () => {
  const { isAuthenticated } = useSaaS();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <SaaSLogin />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <SaaSDashboard />;
      case 'resources':
        return <GlobalResourcesDashboard />;
      case 'insights':
        return <AIInsightsPanel />;
      case 'analytics':
        return (
          <React.Suspense fallback={<div className="p-6">Loading Analytics...</div>}>
            <AdvancedAnalytics />
          </React.Suspense>
        );
      case 'subscription':
        return (
          <React.Suspense fallback={<div className="p-6">Loading Subscription...</div>}>
            <SubscriptionManagement />
          </React.Suspense>
        );
      case 'financial':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
            <p className="text-gray-600">Comprehensive financial analytics and reporting</p>
          </div>
        );
      case 'hr':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">HR Management</h1>
            <p className="text-gray-600">Employee management and analytics</p>
          </div>
        );
      case 'sales':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">Sales & CRM</h1>
            <p className="text-gray-600">Customer relationship management</p>
          </div>
        );
      case 'supplychain':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">Supply Chain</h1>
            <p className="text-gray-600">Inventory and supplier management</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">System configuration and preferences</p>
          </div>
        );
      default:
        return <SaaSDashboard />;
    }
  };

  return (
    <SaaSNavigation currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </SaaSNavigation>
  );
};

// Export main component
export default function Home() {
  return (
    <SaaSProvider>
      <SaaSApp />
    </SaaSProvider>
  );
}