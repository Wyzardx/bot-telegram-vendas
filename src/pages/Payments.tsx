import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { CreditCard, QrCode, Copy, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Payment } from '../types'
import { formatCurrency, formatDate, calculateTokensFromAmount } from '../lib/utils'
import { nitroPayments } from '../lib/nitro-payments'
import toast from 'react-hot-toast'

const mockPayments: Payment[] = [
  {
    id: '1',
    user_id: '123456789',
    amount: 1000, // R$ 10,00 em centavos
    tokens: 1000,
    status: 'completed',
    payment_method: 'pix',
    nitro_payment_id: 'nitro_123',
    created_at: '2024-01-20T10:30:00Z',
    updated_at: '2024-01-20T10:35:00Z'
  },
  {
    id: '2',
    user_id: '987654321',
    amount: 2500, // R$ 25,00 em centavos
    tokens: 2500,
    status: 'pending',
    payment_method: 'pix',
    nitro_payment_id: 'nitro_456',
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    pix_code: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913FULANO DE TAL6008BRASILIA62070503***63041D3D',
    created_at: '2024-01-20T15:20:00Z',
    updated_at: '2024-01-20T15:20:00Z'
  }
]

const tokenPackages = [
  { tokens: 1000, price: 1000, popular: false },
  { tokens: 2500, price: 2000, popular: true },
  { tokens: 5000, price: 3500, popular: false },
  { tokens: 10000, price: 6000, popular: false },
]

export function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [creating, setCreating] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<typeof tokenPackages[0] | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPayments(mockPayments)
      setLoading(false)
    }, 1000)
  }, [])

  const createPayment = async (packageData: typeof tokenPackages[0]) => {
    setCreating(true)
    try {
      // Simulate creating payment with Nitro API
      const paymentData = {
        amount: packageData.price,
        description: `Compra de ${packageData.tokens} tokens`,
        customer: {
          name: 'Usuário Discord',
          email: 'user@discord.com',
          document: '00000000000'
        }
      }

      // In a real app, you would call the Nitro API here
      // const nitroPayment = await nitroPayments.createPixPayment(paymentData)

      // Simulate API response
      const newPayment: Payment = {
        id: Date.now().toString(),
        user_id: '123456789',
        amount: packageData.price,
        tokens: packageData.tokens,
        status: 'pending',
        payment_method: 'pix',
        nitro_payment_id: `nitro_${Date.now()}`,
        qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        pix_code: '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913FULANO DE TAL6008BRASILIA62070503***63041D3D',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setPayments([newPayment, ...payments])
      setSelectedPayment(newPayment)
      setShowCreateModal(false)
      setShowPaymentModal(true)
      toast.success('Pagamento PIX criado com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar pagamento')
    } finally {
      setCreating(false)
    }
  }

  const copyPixCode = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode)
    toast.success('Código PIX copiado!')
  }

  const refreshPaymentStatus = async (payment: Payment) => {
    try {
      // In a real app, you would call the Nitro API here
      // const updatedPayment = await nitroPayments.getPaymentStatus(payment.nitro_payment_id)
      
      // Simulate status update
      const updatedPayment = { ...payment, status: 'completed' as const }
      setPayments(payments.map(p => p.id === payment.id ? updatedPayment : p))
      setSelectedPayment(updatedPayment)
      toast.success('Status atualizado!')
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'Pago'
      case 'failed':
        return 'Falhou'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Pendente'
    }
  }

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      case 'failed':
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-yellow-500/20 text-yellow-400'
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
          <h1 className="text-3xl font-bold text-white mb-2">Pagamentos</h1>
          <p className="text-white/60">Gerencie pagamentos e vendas de tokens</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Novo Pagamento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Hoje</p>
              <p className="text-2xl font-bold text-white">R$ 127,50</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Concluídos</p>
              <p className="text-2xl font-bold text-white">47</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Taxa Sucesso</p>
              <p className="text-2xl font-bold text-white">94%</p>
            </div>
            <CreditCard className="w-8 h-8 text-primary-400" />
          </div>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Pagamentos Recentes</h3>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedPayment(payment)
                setShowPaymentModal(true)
              }}
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(payment.status)}
                <div>
                  <p className="font-medium text-white">
                    {formatCurrency(payment.amount)} • {payment.tokens.toLocaleString()} tokens
                  </p>
                  <p className="text-sm text-white/60">
                    {formatDate(payment.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                  {getStatusText(payment.status)}
                </span>
                <span className="text-white/60 text-sm">PIX</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Payment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Criar Novo Pagamento"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-white/80">Selecione um pacote de tokens para criar o pagamento PIX:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokenPackages.map((pkg) => (
              <div
                key={pkg.tokens}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPackage?.tokens === pkg.tokens
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                } ${pkg.popular ? 'ring-2 ring-primary-500/50' : ''}`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      Mais Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{pkg.tokens.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">tokens</p>
                  <p className="text-xl font-semibold text-primary-400 mt-2">
                    {formatCurrency(pkg.price)}
                  </p>
                  {pkg.price < pkg.tokens && (
                    <p className="text-green-400 text-sm">
                      Economia de {formatCurrency(pkg.tokens - pkg.price)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={() => selectedPackage && createPayment(selectedPackage)}
              disabled={!selectedPackage || creating}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Criar Pagamento PIX
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Payment Details Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false)
          setSelectedPayment(null)
        }}
        title="Detalhes do Pagamento"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(selectedPayment.status)}
                <div>
                  <p className="font-semibold text-white">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                  <p className="text-white/60">{selectedPayment.tokens.toLocaleString()} tokens</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPayment.status)}`}>
                  {getStatusText(selectedPayment.status)}
                </span>
                <button
                  onClick={() => refreshPaymentStatus(selectedPayment)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            {selectedPayment.status === 'pending' && selectedPayment.qr_code && (
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="font-semibold text-white mb-4">QR Code PIX</h4>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img
                      src={selectedPayment.qr_code}
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                </div>

                {selectedPayment.pix_code && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Código PIX Copia e Cola
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={selectedPayment.pix_code}
                        readOnly
                        className="input-field flex-1 text-xs"
                      />
                      <button
                        onClick={() => copyPixCode(selectedPayment.pix_code!)}
                        className="btn-secondary"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">ID do Pagamento:</span>
                <p className="text-white font-mono">{selectedPayment.id}</p>
              </div>
              <div>
                <span className="text-white/60">Método:</span>
                <p className="text-white">PIX</p>
              </div>
              <div>
                <span className="text-white/60">Criado em:</span>
                <p className="text-white">{formatDate(selectedPayment.created_at)}</p>
              </div>
              <div>
                <span className="text-white/60">Atualizado em:</span>
                <p className="text-white">{formatDate(selectedPayment.updated_at)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}