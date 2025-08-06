import PixAPI from '../api/pixApi.js';

class PixService {
  constructor() {
    this.pixApi = new PixAPI();
  }

  async createPixPayment(orderData) {
    return await this.pixApi.createPayment({
      orderId: orderData.orderId,
      amount: orderData.amount,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerCpf: orderData.customerCpf,
      description: orderData.description || 'Compra no bot'
    });
  }

  async checkPaymentStatus(paymentId) {
    return await this.pixApi.checkPaymentStatus(paymentId);
  }

  async setupWebhook(webhookUrl) {
    return await this.pixApi.setupWebhook(webhookUrl);
  }
}

export default PixService;