import axios from 'axios'
import type { NitroPaymentResponse } from '../types'

const NITRO_API_URL = 'https://api.nitropagamentos.com.br/v1'
const NITRO_API_KEY = import.meta.env.VITE_NITRO_API_KEY || 'your-nitro-api-key'

const nitroApi = axios.create({
  baseURL: NITRO_API_URL,
  headers: {
    'Authorization': `Bearer ${NITRO_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const nitroPayments = {
  async createPixPayment(amount: number, description: string, userId: string): Promise<NitroPaymentResponse> {
    try {
      const response = await nitroApi.post('/payments/pix', {
        amount: amount * 100, // Convert to cents
        description,
        external_id: userId,
        expires_in: 3600, // 1 hour
        callback_url: `${window.location.origin}/api/webhooks/nitro`
      })

      return {
        success: true,
        data: {
          payment_id: response.data.id,
          pix_code: response.data.pix_code,
          qr_code: response.data.qr_code_base64,
          expires_at: response.data.expires_at,
          amount: response.data.amount / 100
        }
      }
    } catch (error: any) {
      console.error('Nitro Payment Error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar pagamento PIX'
      }
    }
  },

  async getPaymentStatus(paymentId: string) {
    try {
      const response = await nitroApi.get(`/payments/${paymentId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.error('Error getting payment status:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao consultar pagamento'
      }
    }
  },

  async cancelPayment(paymentId: string) {
    try {
      const response = await nitroApi.post(`/payments/${paymentId}/cancel`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.error('Error canceling payment:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao cancelar pagamento'
      }
    }
  },

  // Token packages
  getTokenPackages() {
    return [
      {
        id: 'basic',
        name: 'Pacote Básico',
        tokens: 1000,
        price: 5.00,
        bonus: 0,
        popular: false,
        description: 'Ideal para começar'
      },
      {
        id: 'premium',
        name: 'Pacote Premium',
        tokens: 2500,
        price: 10.00,
        bonus: 500,
        popular: true,
        description: 'Melhor custo-benefício'
      },
      {
        id: 'ultimate',
        name: 'Pacote Ultimate',
        tokens: 5000,
        price: 18.00,
        bonus: 1500,
        popular: false,
        description: 'Para usuários avançados'
      },
      {
        id: 'mega',
        name: 'Pacote Mega',
        tokens: 10000,
        price: 30.00,
        bonus: 5000,
        popular: false,
        description: 'Máximo de tokens'
      }
    ]
  },

  // Calculate tokens based on amount
  calculateTokens(amount: number): number {
    const packages = this.getTokenPackages()
    const package_ = packages.find(p => p.price === amount)
    
    if (package_) {
      return package_.tokens + package_.bonus
    }
    
    // Default rate: R$ 1 = 200 tokens
    return Math.floor(amount * 200)
  }
}