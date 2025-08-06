import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Heart, Plus, Edit, Trash2, MessageSquare, Eye, EyeOff } from 'lucide-react'
import { Lara, LaraResponse } from '../types'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

const mockLaras: Lara[] = [
  {
    id: '1',
    name: 'Lara Assistente',
    description: 'Uma assistente virtual amigável e prestativa',
    avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    personality: 'Amigável, prestativa e sempre disposta a ajudar os usuários',
    responses: [],
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T15:45:00Z'
  },
  {
    id: '2',
    name: 'Lara Moderadora',
    description: 'Especializada em moderação e manutenção da ordem',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    personality: 'Séria, justa e focada em manter a ordem no servidor',
    responses: [],
    is_active: false,
    created_at: '2024-01-10T08:20:00Z',
    updated_at: '2024-01-18T12:30:00Z'
  }
]

export function Laras() {
  const [laras, setLaras] = useState<Lara[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLara, setEditingLara] = useState<Lara | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar_url: '',
    personality: ''
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLaras(mockLaras)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Nome e descrição são obrigatórios')
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (editingLara) {
        setLaras(laras.map(lara =>
          lara.id === editingLara.id
            ? { ...lara, ...formData, updated_at: new Date().toISOString() }
            : lara
        ))
        toast.success('Lara atualizada com sucesso!')
      } else {
        const newLara: Lara = {
          id: Date.now().toString(),
          ...formData,
          responses: [],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setLaras([...laras, newLara])
        toast.success('Lara criada com sucesso!')
      }

      setShowModal(false)
      setEditingLara(null)
      setFormData({ name: '', description: '', avatar_url: '', personality: '' })
    } catch (error) {
      toast.error('Erro ao salvar Lara')
    }
  }

  const handleEdit = (lara: Lara) => {
    setEditingLara(lara)
    setFormData({
      name: lara.name,
      description: lara.description,
      avatar_url: lara.avatar_url,
      personality: lara.personality
    })
    setShowModal(true)
  }

  const handleDelete = async (lara: Lara) => {
    if (!confirm(`Tem certeza que deseja excluir a Lara "${lara.name}"?`)) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setLaras(laras.filter(l => l.id !== lara.id))
      toast.success('Lara excluída com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir Lara')
    }
  }

  const toggleActive = async (lara: Lara) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setLaras(laras.map(l =>
        l.id === lara.id
          ? { ...l, is_active: !l.is_active, updated_at: new Date().toISOString() }
          : l
      ))
      
      toast.success(`Lara ${lara.is_active ? 'desativada' : 'ativada'} com sucesso!`)
    } catch (error) {
      toast.error('Erro ao alterar status da Lara')
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
          <h1 className="text-3xl font-bold text-white mb-2">Laras</h1>
          <p className="text-white/60">Gerencie as personalidades do seu bot</p>
        </div>
        <button
          onClick={() => {
            setEditingLara(null)
            setFormData({ name: '', description: '', avatar_url: '', personality: '' })
            setShowModal(true)
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Lara
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {laras.map((lara) => (
          <Card key={lara.id} className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={lara.avatar_url}
                  alt={lara.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-white">{lara.name}</h3>
                  <p className="text-sm text-white/60">{lara.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleActive(lara)}
                  className={`p-2 rounded-lg transition-colors ${
                    lara.is_active
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                  }`}
                >
                  {lara.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-white/60">Personalidade:</span>
                <p className="text-sm text-white mt-1">{lara.personality}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  lara.is_active 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {lara.is_active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Criada em:</span>
                <span className="text-white">{formatDate(lara.created_at)}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleEdit(lara)}
                className="flex-1 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Edit className="w-4 h-4 mr-1 inline" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(lara)}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1 inline" />
                Excluir
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingLara(null)
          setFormData({ name: '', description: '', avatar_url: '', personality: '' })
        }}
        title={editingLara ? 'Editar Lara' : 'Nova Lara'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nome da Lara
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field w-full"
                placeholder="Ex: Lara Assistente"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                URL do Avatar
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="input-field w-full"
                placeholder="https://exemplo.com/avatar.jpg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full"
              placeholder="Uma breve descrição da Lara"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Personalidade
            </label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              className="input-field w-full h-24 resize-none"
              placeholder="Descreva a personalidade e comportamento da Lara..."
            />
          </div>

          {formData.avatar_url && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Preview do Avatar
              </label>
              <img
                src={formData.avatar_url}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400'
                }}
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setEditingLara(null)
                setFormData({ name: '', description: '', avatar_url: '', personality: '' })
              }}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              <Heart className="w-4 h-4 mr-2" />
              {editingLara ? 'Atualizar Lara' : 'Criar Lara'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}