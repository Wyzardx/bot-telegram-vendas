import { useState } from 'react'
import { Bell, Search, User, LogOut, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifications = [
    {
      id: 1,
      title: 'Novo pagamento recebido',
      message: 'Usuário @João comprou 1000 tokens',
      time: '2 min atrás',
      type: 'success'
    },
    {
      id: 2,
      title: 'Bot offline',
      message: 'O bot ficou offline por 30 segundos',
      time: '5 min atrás',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Nova Lara criada',
      message: 'Lara "Assistente Virtual" foi adicionada',
      time: '1h atrás',
      type: 'info'
    }
  ]

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Buscar usuários, pagamentos..."
            className="input-field w-full pl-10"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 glass rounded-xl shadow-xl z-50 border border-white/10">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Notificações</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                          notification.type === 'success' && 'bg-green-400',
                          notification.type === 'warning' && 'bg-yellow-400',
                          notification.type === 'info' && 'bg-blue-400'
                        )}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-white/60 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-white/40 text-xs mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10">
                <button className="text-nitro-primary text-sm font-medium hover:text-nitro-secondary transition-colors">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-white/60">Administrador</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 glass rounded-xl shadow-xl z-50 border border-white/10">
              <div className="p-2">
                <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Perfil</span>
                </button>
                <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Configurações</span>
                </button>
                <hr className="my-2 border-white/10" />
                <button className="flex items-center space-x-3 w-full p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}