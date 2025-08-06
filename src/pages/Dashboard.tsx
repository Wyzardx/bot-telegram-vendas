import { useState, useEffect } from 'react'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Bot,
  Activity,
  Crown,
  MessageSquare,
  Zap
} from 'lucide-react'
import { StatCard } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { db } from '../lib/supabase'
import { formatCurrency, formatNumber } from '../lib/utils'
import type { DashboardStats } from '../types'

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await db.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Dashboard
        </h1>
        <p className="text-white/60">
          Visão geral do seu bot Discord e sistema de pagamentos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuários"
          value={formatNumber(stats?.total_users || 0)}
          change="+12% este mês"
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Usuários Ativos"
          value={formatNumber(stats?.active_users || 0)}
          change="+8% hoje"
          icon={Activity}
          color="success"
        />
        <StatCard
          title="Receita Total"
          value={formatCurrency(stats?.total_revenue || 0)}
          change="+23% este mês"
          icon={CreditCard}
          color="success"
        />
        <StatCard
          title="Usuários Premium"
          value={formatNumber(stats?.premium_users || 0)}
          change="+15% este mês"
          icon={Crown}
          color="warning"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tokens Distribuídos"
          value={formatNumber(stats?.total_tokens_distributed || 0)}
          icon={Zap}
          color="primary"
        />
        <StatCard
          title="Pagamentos Pendentes"
          value={formatNumber(stats?.pending_payments || 0)}
          icon={TrendingUp}
          color="warning"
        />
        <StatCard
          title="Uptime do Bot"
          value={`${stats?.bot_uptime || 0}%`}
          change="99.9% média"
          icon={Bot}
          color="success"
        />
        <StatCard
          title="Comandos Executados"
          value={formatNumber(stats?.commands_executed || 0)}
          change="+1.2k hoje"
          icon={MessageSquare}
          color="primary"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {[
              {
                action: 'Novo usuário registrado',
                user: '@João123',
                time: '2 min atrás',
                type: 'user'
              },
              {
                action: 'Pagamento aprovado',
                user: '@Maria456',
                time: '5 min atrás',
                type: 'payment'
              },
              {
                action: 'Lara utilizada',
                user: '@Pedro789',
                time: '8 min atrás',
                type: 'lara'
              },
              {
                action: 'Tokens adicionados',
                user: '@Ana321',
                time: '12 min atrás',
                type: 'tokens'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-400' :
                  activity.type === 'payment' ? 'bg-green-400' :
                  activity.type === 'lara' ? 'bg-pink-400' :
                  'bg-yellow-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-white/60 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-4">
            Status do Sistema
          </h3>
          <div className="space-y-4">
            {[
              { service: 'Bot Discord', status: 'online', uptime: '99.9%' },
              { service: 'API Nitro Pagamentos', status: 'online', uptime: '100%' },
              { service: 'Banco de Dados', status: 'online', uptime: '99.8%' },
              { service: 'Sistema de Laras', status: 'online', uptime: '99.5%' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className="text-white font-medium">{service.service}</span>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">{service.uptime}</p>
                  <p className={`text-xs ${
                    service.status === 'online' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {service.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}