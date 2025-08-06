import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Bot,
  Heart,
  CreditCard,
  Trophy,
  MessageSquare,
  Shield,
  Settings,
  Code,
  Menu,
  X,
  Zap
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Configuração Bot', href: '/bot-config', icon: Bot },
  { name: 'Laras', href: '/laras', icon: Heart },
  { name: 'Pagamentos', href: '/payments', icon: CreditCard },
  { name: 'Ranking', href: '/ranking', icon: Trophy },
  { name: 'Mensagens', href: '/messages', icon: MessageSquare },
  { name: 'Moderação', href: '/moderation', icon: Shield },
  { name: 'Developer', href: '/developer', icon: Code },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  return (
    <>
      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full glass-dark border-r border-white/10 transition-all duration-300 z-50',
          isCollapsed ? '-translate-x-full lg:w-20' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-nitro-primary to-nitro-secondary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">NitroBot</h1>
                <p className="text-xs text-white/60">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'sidebar-item',
                  isActive && 'active',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/40">
                NitroBot Admin v2.0
              </p>
              <p className="text-xs text-white/40 mt-1">
                Powered by Nitro Pagamentos
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className={cn(
          'fixed top-4 left-4 z-40 p-2 glass rounded-lg lg:hidden transition-opacity',
          !isCollapsed && 'opacity-0 pointer-events-none'
        )}
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  )
}