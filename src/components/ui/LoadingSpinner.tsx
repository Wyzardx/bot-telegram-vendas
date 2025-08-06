import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-white/20 border-t-white',
          sizeClasses[size]
        )}
      />
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white/10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className={cn(
                'h-4 bg-white/10 rounded',
                j === 0 ? 'w-1/4' : j === cols - 1 ? 'w-1/6' : 'flex-1'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}