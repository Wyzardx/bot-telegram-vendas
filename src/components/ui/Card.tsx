import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function Card({ children, className, hover = true, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'hover:scale-[1.02]',
        glow && 'glow-effect',
        className
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'primary'
}: {
  title: string
  value: string | number
  change?: string
  icon: any
  color?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  const colorClasses = {
    primary: 'text-nitro-primary bg-nitro-primary/10',
    success: 'text-green-400 bg-green-400/10',
    warning: 'text-yellow-400 bg-yellow-400/10',
    danger: 'text-red-400 bg-red-400/10'
  }

  return (
    <Card className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-400 mt-1">{change}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}

export function UserCard({ user, onEdit, onBan }: {
  user: any
  onEdit: () => void
  onBan: () => void
}) {
  return (
    <Card>
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar || `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`}
          alt={user.username}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-white">{user.username}</h3>
          <p className="text-white/60 text-sm">
            {user.tokens} tokens • Level {user.level}
          </p>
          {user.premium && (
            <span className="inline-block px-2 py-1 text-xs bg-nitro-primary/20 text-nitro-primary rounded-full mt-1">
              Premium
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="btn-secondary text-sm"
          >
            Editar
          </button>
          <button
            onClick={onBan}
            className={cn(
              'px-3 py-1 text-sm rounded-lg font-medium transition-colors',
              user.banned
                ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
            )}
          >
            {user.banned ? 'Desbanir' : 'Banir'}
          </button>
        </div>
      </div>
    </Card>
  )
}