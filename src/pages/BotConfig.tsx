import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Bot, Save, Upload, Activity, MessageCircle, Shield, Coins } from 'lucide-react'
import { BotConfig as BotConfigType } from '../types'
import toast from 'react-hot-toast'

const mockConfig: BotConfigType = {
  id: '1',
  bot_name: 'MeuBot',
  prefix: '!',
  status: 'online',
  activity_type: 'PLAYING',
  activity_name: 'com os usuários',
  welcome_message: 'Bem-vindo(a) ao servidor, {user}! 🎉',
  farewell_message: 'Tchau {user}, sentiremos sua falta! 👋',
  auto_role: 'Membro',
  moderation_enabled: true,
  economy_enabled: true,
  updated_at: '2024-01-20T15:45:00Z'
}

export function BotConfig() {
  const [config, setConfig] = useState<BotConfigType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConfig(mockConfig)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof BotConfigType, value: string | boolean) => {
    if (!config) return
    setConfig({ ...config, [field]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!config) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações do Bot</h1>
          <p className="text-white/60">Configure o comportamento e aparência do seu bot</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            Configurações Básicas
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nome do Bot
              </label>
              <input
                type="text"
                value={config.bot_name}
                onChange={(e) => handleInputChange('bot_name', e.target.value)}
                className="input-field w-full"
                placeholder="Nome do seu bot"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Prefixo de Comandos
              </label>
              <input
                type="text"
                value={config.prefix}
                onChange={(e) => handleInputChange('prefix', e.target.value)}
                className="input-field w-full"
                placeholder="!"
                maxLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Status
              </label>
              <select
                value={config.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="input-field w-full"
              >
                <option value="online">Online</option>
                <option value="idle">Ausente</option>
                <option value="dnd">Não Perturbe</option>
                <option value="invisible">Invisível</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Avatar do Bot
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <button className="btn-secondary">
                  <Upload className="w-4 h-4 mr-2" />
                  Alterar Avatar
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Atividade
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tipo de Atividade
              </label>
              <select
                value={config.activity_type}
                onChange={(e) => handleInputChange('activity_type', e.target.value as any)}
                className="input-field w-full"
              >
                <option value="PLAYING">Jogando</option>
                <option value="WATCHING">Assistindo</option>
                <option value="LISTENING">Ouvindo</option>
                <option value="STREAMING">Transmitindo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nome da Atividade
              </label>
              <input
                type="text"
                value={config.activity_name}
                onChange={(e) => handleInputChange('activity_name', e.target.value)}
                className="input-field w-full"
                placeholder="com os usuários"
              />
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-white/60 mb-2">Preview:</p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white font-medium">{config.bot_name}</span>
                <span className="text-white/60">
                  {config.activity_type === 'PLAYING' && 'Jogando'}
                  {config.activity_type === 'WATCHING' && 'Assistindo'}
                  {config.activity_type === 'LISTENING' && 'Ouvindo'}
                  {config.activity_type === 'STREAMING' && 'Transmitindo'}
                  {' '}{config.activity_name}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Messages Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Mensagens
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Mensagem de Boas-vindas
              </label>
              <textarea
                value={config.welcome_message}
                onChange={(e) => handleInputChange('welcome_message', e.target.value)}
                className="input-field w-full h-24 resize-none"
                placeholder="Mensagem para novos membros"
              />
              <p className="text-xs text-white/50 mt-1">
                Use {'{user}'} para mencionar o usuário
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Mensagem de Despedida
              </label>
              <textarea
                value={config.farewell_message}
                onChange={(e) => handleInputChange('farewell_message', e.target.value)}
                className="input-field w-full h-24 resize-none"
                placeholder="Mensagem quando alguém sai"
              />
              <p className="text-xs text-white/50 mt-1">
                Use {'{user}'} para mencionar o usuário
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Cargo Automático
              </label>
              <input
                type="text"
                value={config.auto_role || ''}
                onChange={(e) => handleInputChange('auto_role', e.target.value)}
                className="input-field w-full"
                placeholder="Nome do cargo para novos membros"
              />
            </div>
          </div>
        </Card>

        {/* Features Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Recursos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="font-medium text-white">Sistema de Moderação</p>
                  <p className="text-sm text-white/60">Comandos de ban, kick, mute, etc.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.moderation_enabled}
                  onChange={(e) => handleInputChange('moderation_enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Coins className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-medium text-white">Sistema de Economia</p>
                  <p className="text-sm text-white/60">Tokens, loja, ranking, etc.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.economy_enabled}
                  onChange={(e) => handleInputChange('economy_enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}