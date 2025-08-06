import axios from 'axios';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

/**
 * API PIX - Configuração centralizada para pagamentos PIX
 * 
 * Suporte para múltiplas APIs:
 * - Asaas
 * - MercadoPago  
 * - PagSeguro
 * - Gerencianet
 * - Mock (para desenvolvimento)
 */

class PixAPI {
  constructor() {
    this.provider = process.env.PIX_PROVIDER || 'mock'; // asaas, mercadopago, pagseguro, gerencianet, mock
    this.config = this.getProviderConfig();
  }

  getProviderConfig() {
    const configs = {
      asaas: {
        baseURL: process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3',
        headers: {
          'access_token': process.env.ASAAS_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      },
      mercadopago: {
        baseURL: 'https://api.mercadopago.com/v1',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      },
      pagseguro: {
        baseURL: 'https://ws.sandbox.pagseguro.uol.com.br',
        headers: {
          'Authorization': `Bearer ${process.env.PAGSEGURO_TOKEN}`,
          'Content-Type': 'application/json'
        }
      },
      gerencianet: {
        baseURL: 'https://sandbox.gerencianet.com.br/v1',
        headers: {
          'Authorization': `Bearer ${process.env.GERENCIANET_TOKEN}`,
          'Content-Type': 'application/json'
        }
      },
      mock: {
        baseURL: 'https://mock-api.local',
        headers: { 'Content-Type': 'application/json' }
      }
    };

    return configs[this.provider] || configs.mock;
  }

  /**
   * Criar pagamento PIX
   */
  async createPayment(paymentData) {
    try {
      switch (this.provider) {
        case 'asaas':
          return await this.createAsaasPayment(paymentData);
        case 'mercadopago':
          return await this.createMercadoPagoPayment(paymentData);
        case 'pagseguro':
          return await this.createPagSeguroPayment(paymentData);
        case 'gerencianet':
          return await this.createGerencianetPayment(paymentData);
        default:
          return await this.createMockPayment(paymentData);
      }
    } catch (error) {
      console.error(`Erro na API PIX (${this.provider}):`, error.message);
      // Fallback para mock em caso de erro
      return await this.createMockPayment(paymentData);
    }
  }

  /**
   * Verificar status do pagamento
   */
  async checkPaymentStatus(paymentId) {
    try {
      switch (this.provider) {
        case 'asaas':
          return await this.checkAsaasPayment(paymentId);
        case 'mercadopago':
          return await this.checkMercadoPagoPayment(paymentId);
        case 'pagseguro':
          return await this.checkPagSeguroPayment(paymentId);
        case 'gerencianet':
          return await this.checkGerencianetPayment(paymentId);
        default:
          return await this.checkMockPayment(paymentId);
      }
    } catch (error) {
      console.error(`Erro ao verificar pagamento (${this.provider}):`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ========== ASAAS ==========
  async createAsaasPayment(data) {
    const payload = {
      customer: {
        name: data.customerName,
        cpfCnpj: data.customerCpf || '00000000000',
        email: data.customerEmail || 'customer@example.com'
      },
      billingType: 'PIX',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: data.amount,
      description: data.description,
      externalReference: data.orderId.toString()
    };

    const response = await axios.post(`${this.config.baseURL}/payments`, payload, {
      headers: this.config.headers
    });

    if (response.data.id) {
      const pixInfo = await this.getAsaasPixInfo(response.data.id);
      const qrCode = await QRCode.toDataURL(pixInfo.encodedImage);

      return {
        success: true,
        paymentId: response.data.id,
        pixCode: pixInfo.payload,
        pixQrCode: qrCode,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    }

    throw new Error('Falha ao criar pagamento Asaas');
  }

  async getAsaasPixInfo(paymentId) {
    const response = await axios.get(`${this.config.baseURL}/payments/${paymentId}/pixQrCode`, {
      headers: this.config.headers
    });
    return response.data;
  }

  async checkAsaasPayment(paymentId) {
    const response = await axios.get(`${this.config.baseURL}/payments/${paymentId}`, {
      headers: this.config.headers
    });

    return {
      success: true,
      status: response.data.status,
      paidValue: response.data.value || 0
    };
  }

  // ========== MERCADO PAGO ==========
  async createMercadoPagoPayment(data) {
    const payload = {
      transaction_amount: data.amount,
      description: data.description,
      payment_method_id: 'pix',
      payer: {
        email: data.customerEmail || 'customer@example.com',
        first_name: data.customerName,
        identification: {
          type: 'CPF',
          number: data.customerCpf || '00000000000'
        }
      }
    };

    const response = await axios.post(`${this.config.baseURL}/payments`, payload, {
      headers: this.config.headers
    });

    if (response.data.id) {
      const qrCode = await QRCode.toDataURL(response.data.point_of_interaction.transaction_data.qr_code);

      return {
        success: true,
        paymentId: response.data.id.toString(),
        pixCode: response.data.point_of_interaction.transaction_data.qr_code,
        pixQrCode: qrCode,
        expiresAt: response.data.date_of_expiration
      };
    }

    throw new Error('Falha ao criar pagamento MercadoPago');
  }

  async checkMercadoPagoPayment(paymentId) {
    const response = await axios.get(`${this.config.baseURL}/payments/${paymentId}`, {
      headers: this.config.headers
    });

    return {
      success: true,
      status: response.data.status,
      paidValue: response.data.transaction_amount || 0
    };
  }

  // ========== PAGSEGURO ==========
  async createPagSeguroPayment(data) {
    // Implementar conforme documentação PagSeguro
    throw new Error('PagSeguro não implementado ainda');
  }

  async checkPagSeguroPayment(paymentId) {
    throw new Error('PagSeguro não implementado ainda');
  }

  // ========== GERENCIANET ==========
  async createGerencianetPayment(data) {
    // Implementar conforme documentação Gerencianet
    throw new Error('Gerencianet não implementado ainda');
  }

  async checkGerencianetPayment(paymentId) {
    throw new Error('Gerencianet não implementado ainda');
  }

  // ========== MOCK (DESENVOLVIMENTO) ==========
  async createMockPayment(data) {
    const paymentId = uuidv4();
    const pixCode = this.generateMockPixCode(data.amount, data.customerName);
    const qrCode = await QRCode.toDataURL(pixCode);

    console.log(`🔧 MOCK PIX: Pagamento ${paymentId} criado para R$ ${data.amount}`);

    return {
      success: true,
      paymentId,
      pixCode,
      pixQrCode: qrCode,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      mock: true
    };
  }

  async checkMockPayment(paymentId) {
    // Simula aprovação aleatória para testes
    const statuses = ['PENDING', 'PENDING', 'RECEIVED'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    console.log(`🔧 MOCK PIX: Verificando pagamento ${paymentId} - Status: ${randomStatus}`);

    return {
      success: true,
      status: randomStatus,
      paidValue: 0,
      mock: true
    };
  }

  generateMockPixCode(amount, customerName) {
    const paymentId = uuidv4().replace(/-/g, '').substring(0, 25);
    return `00020126330014BR.GOV.BCB.PIX0111${paymentId}520400005303986540${amount.toFixed(2)}5802BR5925${customerName.substring(0, 25).toUpperCase()}6009SAO PAULO62070503***6304`;
  }

  /**
   * Configurar webhook para receber notificações de pagamento
   */
  async setupWebhook(webhookUrl) {
    try {
      switch (this.provider) {
        case 'asaas':
          return await this.setupAsaasWebhook(webhookUrl);
        case 'mercadopago':
          return await this.setupMercadoPagoWebhook(webhookUrl);
        default:
          console.log(`🔧 MOCK: Webhook configurado para ${webhookUrl}`);
          return { success: true, mock: true };
      }
    } catch (error) {
      console.error('Erro ao configurar webhook:', error.message);
      return { success: false, error: error.message };
    }
  }

  async setupAsaasWebhook(webhookUrl) {
    const payload = {
      name: 'Bot Telegram Webhook',
      url: webhookUrl,
      events: ['PAYMENT_RECEIVED', 'PAYMENT_OVERDUE'],
      enabled: true
    };

    const response = await axios.post(`${this.config.baseURL}/webhooks`, payload, {
      headers: this.config.headers
    });

    return { success: true, webhookId: response.data.id };
  }

  async setupMercadoPagoWebhook(webhookUrl) {
    // Implementar webhook MercadoPago
    throw new Error('Webhook MercadoPago não implementado');
  }
}

export default PixAPI;