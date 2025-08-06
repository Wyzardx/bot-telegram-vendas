import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'agora mesmo'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m atrás`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d atrás`
  }

  return formatDate(date)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getAvatarUrl(avatar?: string, discordId?: string): string {
  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png?size=256`
  }
  return `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`
}

export function calculateLevel(experience: number): number {
  return Math.floor(Math.sqrt(experience / 100))
}

export function calculateExperienceForLevel(level: number): number {
  return level * level * 100
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'online':
      return 'text-green-400'
    case 'idle':
      return 'text-yellow-400'
    case 'dnd':
      return 'text-red-400'
    case 'offline':
    case 'invisible':
      return 'text-gray-400'
    default:
      return 'text-gray-400'
  }
}

export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-400/10'
    case 'pending':
      return 'text-yellow-400 bg-yellow-400/10'
    case 'failed':
    case 'cancelled':
      return 'text-red-400 bg-red-400/10'
    default:
      return 'text-gray-400 bg-gray-400/10'
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function downloadQRCode(qrCodeBase64: string, filename: string = 'qr-code.png') {
  const link = document.createElement('a')
  link.href = `data:image/png;base64,${qrCodeBase64}`
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function validateDiscordId(id: string): boolean {
  return /^\d{17,19}$/.test(id)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}