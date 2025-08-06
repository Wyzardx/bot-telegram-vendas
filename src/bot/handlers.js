import { mainKeyboard, adminKeyboard, productsKeyboard, productDetailKeyboard, paymentMethodKeyboard, confirmPaymentKeyboard, backToMenuKeyboard } from './keyboards.js';
import Database from '../database/database.js';
import PixService from '../services/pixService.js';

const db = new Database();
const pixService = new PixService();

export async function handleStart(ctx) {
  const user = ctx.from;
  
  // Criar ou atualizar usuário
  await db.createUser({
    telegram_id: user.id.toString(),
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name
  });

  const dbUser = await db.getUser(user.id.toString());
  
  const welcomeMessage = `🎯 *Bem-vindo ao ${process.env.BOT_NAME || 'Loja Bot'}!*

👤 *Seu Perfil:*
📛 Nome: ${user.first_name} ${user.last_name || ''}
🆔 ID: \`${user.id}\`
💰 Saldo: R$ ${dbUser.balance.toFixed(2)}
🎯 Pontos: ${dbUser.points}

✨ É com imensa satisfação que lhe damos as boas-vindas! Aqui, no Bot de Laras do Nando, oferecemos laras com o preço mais acessível do mercado, aliado à mais avançada tecnologia e praticidade.

💎 As nossas laras destacam-se pela extrema qualidade, ao contrário de alguns concorrentes que praticam preços abusivos e cujas laras frequentemente apresentam problemas de queda. Aqui, não temos nenhum relato de qualquer lara que tenha sofrido quedas.

Escolha uma opção abaixo:`;

  if (dbUser.is_admin) {
    await ctx.reply(welcomeMessage + '\n\n🔧 *Você é um administrador*', { 
      parse_mode: 'Markdown',
      ...mainKeyboard 
    });
    
    setTimeout(() => {
      ctx.reply('🛠️ *Painel Administrativo*', { 
        parse_mode: 'Markdown',
        ...adminKeyboard 
      });
    }, 1000);
  } else {
    await ctx.reply(welcomeMessage, { 
      parse_mode: 'Markdown',
      ...mainKeyboard 
    });
  }
}

export async function handleBuyProducts(ctx) {
  const user = await db.getUser(ctx.from.id.toString());
  
  let message = `💎 *Comprar Laras*\n`;
  message += `_- Qual o tipo de LARA que você deseja comprar?_\n\n`;
  message += `🪪 *Carteira:*\n`;
  message += `├ 🆔 *ID:* \`${ctx.from.id}\`\n`;
  message += `├ 👤 *NOME:* ${ctx.from.first_name.toUpperCase()}\n`;
  message += `├ 📱 *USERNAME:* @${ctx.from.username || 'N/A'}\n`;
  message += `├ 💰 *SALDO:* R$${user?.balance?.toFixed(0) || '0'}\n`;
  message += `└ 🎯 *PONTOS:* ${user?.points || 0}`;
  
  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    ...productsKeyboard([])
  });
}

export async function handleProductDetail(ctx, productId) {
  const product = await db.getProduct(productId);
  const user = await db.getUser(ctx.from.id.toString());
  
  if (!product) {
    return ctx.answerCbQuery('❌ Produto não encontrado');
  }

  if (product.stock <= 0) {
    return ctx.answerCbQuery('❌ Produto fora de estoque');
  }

  // Simular dados da lara baseado nas imagens
  let message = `📧 *Email:* Lai***************\n`;
  message += `🔐 *Senha:* ********\n`;
  message += `💎 *Tipo:* ${product.name}\n`;
  message += `👤 *Nome:* Laís\n`;
  message += `⚧️ *Sexo:* FEMININO\n`;
  message += `🆔 *Cpf:* ***.020.812-**\n\n`;
  message += `💰 *Valor:* R$ ${product.price.toFixed(0)}\n`;
  message += `💳 *Seu saldo:* R$ ${user?.balance?.toFixed(0) || '0'}\n\n`;
  message += `_- Atenção! Após a compra, você receberá um vídeo tutorial mostrando como acessar a Lara adquirida._\n\n`;
  message += `*Exibindo 1 de 3*`;

  await ctx.editMessageText(message, { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ | Confirmar', callback_data: `buy_${productId}` }
        ],
        [
          { text: '◀️', callback_data: 'prev_product' },
          { text: '▶️', callback_data: 'next_product' }
        ],
        [
          { text: '🔻 Voltar', callback_data: 'buy_products' }
        ]
      ]
    }
  });
}

export async function handleBuyProduct(ctx, productId) {
  const user = await db.getUser(ctx.from.id.toString());
  const product = await db.getProduct(productId);

  if (!product || product.stock <= 0) {
    return ctx.answerCbQuery('❌ Produto não disponível');
  }

  // Criar pedido
  const orderResult = await db.createOrder({
    user_id: user.id,
    product_id: product.id,
    quantity: 1,
    total_amount: product.price,
    payment_method: 'pending'
  });

  const orderId = orderResult.lastID;

  let message = `🛒 *Confirmar Compra*\n\n`;
  message += `📦 *Produto:* ${product.name}\n`;
  message += `💰 *Valor:* R$ ${product.price.toFixed(2)}\n`;
  message += `🔢 *Quantidade:* 1\n\n`;
  message += `💳 *Seu saldo atual:* R$ ${user.balance.toFixed(2)}\n\n`;
  message += `Escolha a forma de pagamento:`;

  await ctx.editMessageText(message, { 
    parse_mode: 'Markdown',
    ...paymentMethodKeyboard(orderId) 
  });
}

export async function handlePixPayment(ctx, orderId) {
  const order = await db.getOrder(orderId);
  
  if (!order) {
    return ctx.answerCbQuery('❌ Pedido não encontrado');
  }

  try {
    const pixPayment = await pixService.createPixPayment({
      orderId: order.id,
      amount: order.total_amount,
      customerName: order.first_name,
      description: `Compra: ${order.product_name}`
    });

    if (pixPayment.success) {
      // Salvar dados do pagamento
      await db.createPayment({
        order_id: order.id,
        payment_id: pixPayment.paymentId,
        amount: order.total_amount,
        pix_code: pixPayment.pixCode,
        pix_qr_code: pixPayment.pixQrCode,
        expires_at: pixPayment.expiresAt
      });

      let message = `💳 *Pagamento PIX*\n\n`;
      message += `📦 *Produto:* ${order.product_name}\n`;
      message += `💰 *Valor:* R$ ${order.total_amount.toFixed(2)}\n\n`;
      message += `📱 *Escaneie o QR Code ou copie o código PIX:*\n\n`;
      message += `\`${pixPayment.pixCode}\`\n\n`;
      message += `⏰ *Expira em:* 24 horas\n\n`;
      message += `❗️ Após o pagamento, clique em "Confirmar Pagamento"`;

      // Enviar QR Code
      await ctx.editMessageText(message, { 
        parse_mode: 'Markdown',
        ...confirmPaymentKeyboard(pixPayment.paymentId) 
      });

      // Enviar imagem do QR Code
      const qrBuffer = Buffer.from(pixPayment.pixQrCode.replace('data:image/png;base64,', ''), 'base64');
      await ctx.replyWithPhoto({ source: qrBuffer }, {
        caption: `QR Code PIX - R$ ${order.total_amount.toFixed(2)}`,
        reply_markup: confirmPaymentKeyboard(pixPayment.paymentId).reply_markup
      });
      
    } else {
      throw new Error(pixPayment.error || 'Erro ao gerar PIX');
    }
  } catch (error) {
    console.error('Erro ao processar PIX:', error);
    await ctx.editMessageText('❌ Erro ao gerar pagamento PIX. Tente novamente.', backToMenuKeyboard);
  }
}

export async function handleBalancePayment(ctx, orderId) {
  const order = await db.getOrder(orderId);
  const user = await db.getUser(ctx.from.id.toString());
  
  if (!order) {
    return ctx.answerCbQuery('❌ Pedido não encontrado');
  }

  if (user.balance < order.total_amount) {
    let message = `❌ *Saldo Insuficiente*\n\n`;
    message += `💰 *Seu saldo:* R$ ${user.balance.toFixed(2)}\n`;
    message += `💸 *Valor necessário:* R$ ${order.total_amount.toFixed(2)}\n`;
    message += `💳 *Faltam:* R$ ${(order.total_amount - user.balance).toFixed(2)}\n\n`;
    message += `Por favor, adicione saldo à sua conta ou escolha outra forma de pagamento.`;

    return ctx.editMessageText(message, { 
      parse_mode: 'Markdown',
      ...backToMenuKeyboard 
    });
  }

  // Processar pagamento
  await db.updateUserBalance(ctx.from.id.toString(), -order.total_amount);
  await db.updateUserPoints(ctx.from.id.toString(), Math.floor(order.total_amount));
  await db.updateProductStock(order.product_id, 1);

  // Registrar transação
  await db.createTransaction({
    user_id: user.id,
    type: 'purchase',
    amount: -order.total_amount,
    description: `Compra: ${order.product_name}`,
    reference_id: order.id.toString()
  });

  // Atualizar pedido
  await db.db.run(
    'UPDATE orders SET payment_status = ?, completed_at = ? WHERE id = ?',
    ['paid', new Date().toISOString(), order.id]
  );

  let message = `✅ *Compra Realizada com Sucesso!*\n\n`;
  message += `📦 *Produto:* ${order.product_name}\n`;
  message += `💰 *Valor Pago:* R$ ${order.total_amount.toFixed(2)}\n`;
  message += `🎯 *Pontos Ganhos:* ${Math.floor(order.total_amount)}\n\n`;
  message += `💰 *Novo Saldo:* R$ ${(user.balance - order.total_amount).toFixed(2)}\n\n`;
  message += `📧 *Atenção!* Após a compra, você receberá um vídeo tutorial mostrando como acessar a Lara adquirida.\n\n`;
  message += `📱 *Produto será entregue em instantes...*`;

  await ctx.editMessageText(message, { 
    parse_mode: 'Markdown',
    ...backToMenuKeyboard 
  });

  // Simular entrega do produto
  setTimeout(async () => {
    await ctx.reply(`📦 *Entrega Completa!*\n\nSeu produto ${order.product_name} foi entregue com sucesso!\n\n📱 Acesse seus produtos no menu "Meus Pedidos".`, {
      parse_mode: 'Markdown'
    });
  }, 3000);
}

export async function handleMyInfo(ctx) {
  const user = await db.getUser(ctx.from.id.toString());
  const orders = await db.getUserOrders(user.id);
  const transactions = await db.getUserTransactions(user.id);

  let message = `👤 *Minhas Informações*\n\n`;
  message += `📛 *Nome:* ${ctx.from.first_name} ${ctx.from.last_name || ''}\n`;
  message += `🆔 *ID:* \`${ctx.from.id}\`\n`;
  message += `👤 *Username:* ${ctx.from.username ? '@' + ctx.from.username : 'Não definido'}\n`;
  message += `💰 *Saldo:* R$ ${user.balance.toFixed(2)}\n`;
  message += `🎯 *Pontos:* ${user.points}\n`;
  message += `🎫 *Código de Referência:* \`${user.referral_code}\`\n\n`;
  message += `📊 *Estatísticas:*\n`;
  message += `🛒 *Total de Pedidos:* ${orders.length}\n`;
  message += `💸 *Transações:* ${transactions.length}\n`;
  message += `📅 *Membro desde:* ${new Date(user.created_at).toLocaleDateString('pt-BR')}`;

  await ctx.editMessageText(message, { 
    parse_mode: 'Markdown',
    ...backToMenuKeyboard 
  });
}

export async function handleMyOrders(ctx) {
  const user = await db.getUser(ctx.from.id.toString());
  const orders = await db.getUserOrders(user.id);

  if (orders.length === 0) {
    let message = `📋 *Meus Pedidos*\n\n`;
    message += `❌ Você ainda não fez nenhum pedido.\n\n`;
    message += `🛒 Que tal fazer sua primeira compra?`;
    
    return ctx.editMessageText(message, { 
      parse_mode: 'Markdown',
      ...backToMenuKeyboard 
    });
  }

  let message = `📋 *Meus Pedidos*\n\n`;
  
  orders.slice(0, 10).forEach((order, index) => {
    const status = order.payment_status === 'paid' ? '✅' : order.payment_status === 'pending' ? '⏳' : '❌';
    message += `${status} *Pedido #${order.id}*\n`;
    message += `📦 ${order.product_name}\n`;
    message += `💰 R$ ${order.total_amount.toFixed(2)}\n`;
    message += `📅 ${new Date(order.created_at).toLocaleDateString('pt-BR')}\n\n`;
  });

  if (orders.length > 10) {
    message += `... e mais ${orders.length - 10} pedidos`;
  }

  await ctx.editMessageText(message, { 
    parse_mode: 'Markdown',
    ...backToMenuKeyboard 
  });
}

export async function handleCheckPayment(ctx, paymentId) {
  try {
    const payment = await db.getPayment(paymentId);
    
    if (!payment) {
      return ctx.answerCbQuery('❌ Pagamento não encontrado');
    }

    const status = await pixService.checkPaymentStatus(paymentId);
    
    if (status.success && status.status === 'RECEIVED') {
      // Pagamento confirmado
      await db.updatePaymentStatus(paymentId, 'paid');
      
      const order = await db.getOrder(payment.order_id);
      const user = await db.getUserById(order.user_id);
      
      // Atualizar pedido
      await db.db.run(
        'UPDATE orders SET payment_status = ?, completed_at = ? WHERE id = ?',
        ['paid', new Date().toISOString(), order.id]
      );
      
      // Atualizar estoque
      await db.updateProductStock(order.product_id, 1);
      
      // Adicionar pontos
      await db.updateUserPoints(user.telegram_id, Math.floor(order.total_amount));
      
      // Registrar transação
      await db.createTransaction({
        user_id: user.id,
        type: 'purchase',
        amount: order.total_amount,
        description: `Compra PIX: ${order.product_name}`,
        reference_id: order.id.toString()
      });

      let message = `✅ *Pagamento Confirmado!*\n\n`;
      message += `📦 *Produto:* ${order.product_name}\n`;
      message += `💰 *Valor:* R$ ${order.total_amount.toFixed(2)}\n`;
      message += `🎯 *Pontos Ganhos:* ${Math.floor(order.total_amount)}\n\n`;
      message += `🎉 *Parabéns! Sua compra foi processada com sucesso!*\n`;
      message += `📱 *Produto será entregue em instantes...*`;

      await ctx.editMessageText(message, { 
        parse_mode: 'Markdown',
        ...backToMenuKeyboard 
      });

      // Simular entrega
      setTimeout(async () => {
        await ctx.reply(`📦 *Entrega Completa!*\n\nSeu produto ${order.product_name} foi entregue com sucesso!`, {
          parse_mode: 'Markdown'
        });
      }, 2000);

    } else {
      ctx.answerCbQuery('⏳ Pagamento ainda pendente. Aguarde a confirmação.');
    }
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    ctx.answerCbQuery('❌ Erro ao verificar pagamento');
  }
}

export async function handleAdminStats(ctx) {
  const stats = await db.getStats();
  
  let message = `📈 *Estatísticas do Sistema*\n\n`;
  message += `👥 *Total de Usuários:* ${stats.totalUsers}\n`;
  message += `📦 *Total de Pedidos:* ${stats.totalOrders}\n`;
  message += `💰 *Receita Total:* R$ ${stats.totalRevenue.toFixed(2)}\n`;
  message += `⏳ *Pedidos Pendentes:* ${stats.pendingOrders}\n\n`;
  message += `📊 *Dashboard Web:* http://localhost:${process.env.WEB_PORT || 3000}`;

  await ctx.editMessageText(message, { 
    parse_mode: 'Markdown',
    ...backToMenuKeyboard 
  });
}

export async function handleNotifications(ctx) {
  const notifications = await db.getActiveNotifications();
  
  let message = '🔔 *Notificações*\n\n';
  
  if (notifications.length === 0) {
    message += 'Você não possui notificações no momento.';
  } else {
    notifications.forEach((notif, index) => {
      const icon = notif.type === 'warning' ? '⚠️' : notif.type === 'error' ? '❌' : 'ℹ️';
      message += `${icon} *${notif.title}*\n`;
      message += `${notif.message}\n`;
      message += `📅 ${new Date(notif.created_at).toLocaleDateString('pt-BR')}\n\n`;
    });
  }
  
  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    ...backToMenuKeyboard
  });
}