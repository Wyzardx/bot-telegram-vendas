import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { User, Ban, Gift, Search, Filter, MoreVertical, Shield, Coins } from 'lucide-react'
import { User as UserType } from '../types'
import { formatDate, getAvatarUrl } from '../lib/utils'
import toast from 'react-hot-toast'

const mockUsers: UserType[] = [
  {
    id: '1',
    discord_id: '123456789',
    username: 'João',
    discriminator: '1234',
    tokens: 15420,
    is_banned: false,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T15:45:00Z'
  },
  {
    id: '2',
    discord_id: '987654321',
    username: 'Maria',
    discriminator: '5678',
    tokens: 8750,
    is_banned: false,
    created_at: '2024-01-10T08:20:00Z',
    updated_at: '2024-01-19T12:30:00Z'
  },
  {
    id: '3',
    discord_id: '456789123',
    username: 'Pedro',
    discriminator: '9012',
    tokens: 2340,
    is_banned: true,
    ban_reason: 'Spam excessivo',
    created_at: '2024-01-05T14:15:00Z',
    updated_at: '2024-01-18T09:20:00Z'
  }
]

export function Users() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.discriminator.includes(searchTerm)
  )

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(users.map(user =>
        user.id === selectedUser.id
          ? { ...user, is_banned: true, ban_reason: banReason }
          : user
      ))
      
      toast.success(`Usuário ${selectedUser.username} foi banido`)
      setShowBanModal(false)
      setBanReason('')
      setSelectedUser(null)
    } catch (error) {
      toast.error('Erro ao banir usuário')
    }
  }

  const handleUnbanUser = async (user: UserType) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(users.map(u =>
        u.id === user.id
          ? { ...u, is_banned: false, ban_reason: undefined }
          : u
      ))
      
      toast.success(`Usuário ${user.username} foi desbanido`)
    } catch (error) {
      toast.error('Erro ao desbanir usuário')
    }
  }

  const handleAddTokens = async () => {
    if (!selectedUser || !tokenAmount.trim()) return

    try {
      const amount = parseInt(tokenAmount)
      if (isNaN(amount) || amount <= 0) {
        toast.error('Quantidade inválida de tokens')
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(users.map(user =>
        user.id === selectedUser.id
          ? { ...user, tokens: user.tokens + amount }
          : user
      ))
      
      toast.success(`${amount} tokens adicionados para ${selectedUser.username}`)
      setShowTokenModal(false)
      setTokenAmount('')
      setSelectedUser(null)
    } catch (error) {
      toast.error('Erro ao adicionar tokens')
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Usuários</h1>
          <p className="text-white/60">Gerencie os usuários do seu bot</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-80"
            />
          </div>
          <button className="btn-secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={getAvatarUrl(user.discord_id, user.avatar)}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-white">
                    {user.username}#{user.discriminator}
                  </h3>
                  <p className="text-sm text-white/60">
                    {user.tokens.toLocaleString()} tokens
                  </p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    setSelectedUser(user)
                    setShowUserModal(true)
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.is_banned 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {user.is_banned ? 'Banido' : 'Ativo'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Membro desde:</span>
                <span className="text-white">{formatDate(user.created_at)}</span>
              </div>
              {user.is_banned && user.ban_reason && (
                <div className="text-sm">
                  <span className="text-white/60">Motivo:</span>
                  <p className="text-red-400 mt-1">{user.ban_reason}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              {user.is_banned ? (
                <button
                  onClick={() => handleUnbanUser(user)}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Shield className="w-4 h-4 mr-1 inline" />
                  Desbanir
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedUser(user)
                    setShowBanModal(true)
                  }}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Ban className="w-4 h-4 mr-1 inline" />
                  Banir
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedUser(user)
                  setShowTokenModal(true)
                }}
                className="flex-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Coins className="w-4 h-4 mr-1 inline" />
                Tokens
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Ban User Modal */}
      <Modal
        isOpen={showBanModal}
        onClose={() => {
          setShowBanModal(false)
          setBanReason('')
          setSelectedUser(null)
        }}
        title="Banir Usuário"
      >
        <div className="space-y-4">
          <p className="text-white/80">
            Tem certeza que deseja banir o usuário <strong>{selectedUser?.username}#{selectedUser?.discriminator}</strong>?
          </p>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Motivo do banimento
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Digite o motivo do banimento..."
              className="input-field w-full h-24 resize-none"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowBanModal(false)
                setBanReason('')
                setSelectedUser(null)
              }}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleBanUser}
              disabled={!banReason.trim()}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Banir Usuário
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Tokens Modal */}
      <Modal
        isOpen={showTokenModal}
        onClose={() => {
          setShowTokenModal(false)
          setTokenAmount('')
          setSelectedUser(null)
        }}
        title="Adicionar Tokens"
      >
        <div className="space-y-4">
          <p className="text-white/80">
            Adicionar tokens para <strong>{selectedUser?.username}#{selectedUser?.discriminator}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Quantidade de tokens
            </label>
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="Digite a quantidade..."
              className="input-field w-full"
              min="1"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowTokenModal(false)
                setTokenAmount('')
                setSelectedUser(null)
              }}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddTokens}
              disabled={!tokenAmount.trim()}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar Tokens
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}