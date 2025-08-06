import { Telegraf } from 'telegraf';
import { 
  handleStart, 
  handleBuyProducts, 
  handleProductDetail, 
  handleBuyProduct,
  handlePixPayment,
  handleBalancePayment,
  handleMyInfo,
  handleMyOrders,
  handleCheckPayment,
  handleAdminStats
} from './handlers.js';
import { mainKeyboard, backToMenuKeyboard } from './keyboards.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middleware para logging
bot.use((ctx, next) => {
  console.log(`[${new Date().toISOString()}] ${ctx.from?.id} ${ctx.from?.username || 'N/A'}: ${ctx.message?.text || ctx.callbackQuery?.data || 'action'}`);
  return next();
});

// Comando /start
bot.start(handleStart);

// Comando /menu
bot.command('menu', (ctx) => {
  ctx.reply('🏠 *Menu Principal*', { 
    parse_mode: 'Markdown',
    ...mainKeyboard 
  });
});

// Comando /admin (apenas para administradores)
bot.command('admin', async (ctx) => {
  // Verificar se é admin (implementar verificação)
  const adminKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '👥 Usuários', callback_data: 'admin_users' },
          { text: '📦 Produtos', callback_data: 'admin_products' }
        ],
        [
          { text: '📊 Estatísticas', callback_data: 'admin_stats' },
          { text: '⚙️ Configurações', callback_data: 'admin_settings' }
        ]
      ]
    }
  };

  await ctx.reply('🛠️ *Painel Administrativo*', { 
    parse_mode: 'Markdown',
    ...adminKeyboard 
  });
});

// Callback queries
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  
  try {
    if (data === 'buy_products') {
      await handleBuyProducts(ctx);
    }
    else if (data.startsWith('product_')) {
      const productId = data.split('_')[1];
      await handleProductDetail(ctx, productId);
    }
    else if (data.startsWith('buy_')) {
      const productId = data.split('_')[1];
      await handleBuyProduct(ctx, productId);
    }
    else if (data.startsWith('pay_pix_')) {
      const orderId = data.split('_')[2];
      await handlePixPayment(ctx, orderId);
    }
    else if (data.startsWith('pay_balance_')) {
      const orderId = data.split('_')[2];
      await handleBalancePayment(ctx, orderId);
    }
    else if (data.startsWith('check_payment_')) {
      const paymentId = data.split('_')[2];
      await handleCheckPayment(ctx, paymentId);
    }
    else if (data === 'my_info') {
      await handleMyInfo(ctx);
    }
    else if (data === 'my_orders') {
      await handleMyOrders(ctx);
    }
    else if (data === 'admin_stats') {
      await handleAdminStats(ctx);
    }
    else if (data === 'back_to_menu') {
      const user = await import('../database/database.js').then(m => new m.default()).then(db => db.getUser(ctx.from.id.toString()));
      
      let message = `🏠 *Menu Principal*\n\n`;
      message += `👤 *${ctx.from.first_name}*\n`;
      message += `💰 Saldo: R$ ${user?.balance?.toFixed(2) || '0.00'}\n`;
      message += `🎯 Pontos: ${user?.points || 0}\n\n`;
      message += `Escolha uma opção:`;

      await ctx.editMessageText(message, { 
        parse_mode: 'Markdown',
        ...mainKeyboard 
      });
    }
    else if (data === 'notifications') {
      await ctx.editMessageText('🔔 *Notificações*\n\nVocê não possui notificações no momento.', {
        parse_mode: 'Markdown',
        ...backToMenuKeyboard
      });
    }
    else if (data === 'referrals') {
      const db = await import('../database/database.js').then(m => new m.default());
      const user = await db.getUser(ctx.from.id.toString());
      
      let message = `👥 *Sistema de Referências*\n\n`;
      message += `🎫 *Seu código:* \`${user.referral_code}\`\n\n`;
      message += `📤 *Compartilhe seu código e ganhe benefícios:*\n`;
      message += `• 10% de comissão em cada venda\n`;
      message += `• Pontos extras por indicação\n`;
      message += `• Bônus especiais\n\n`;
      message += `💡 *Como usar:* Compartilhe o link abaixo com seus amigos!\n`;
      message += `https://t.me/${ctx.botInfo.username}?start=${user.referral_code}`;

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...backToMenuKeyboard
      });
    }
    else if (data === 'terms') {
      let message = `📜 *Termos de Uso*\n\n`;
      message += `1. **Produtos Digitais**: Todos os produtos são digitais e entregues instantaneamente.\n\n`;
      message += `2. **Pagamento**: Aceitamos PIX e saldo da conta.\n\n`;
      message += `3. **Reembolso**: Não realizamos reembolsos após a entrega.\n\n`;
      message += `4. **Suporte**: Disponível 24/7 pelo bot.\n\n`;
      message += `5. **Qualidade**: Garantimos produtos de alta qualidade.\n\n`;
      message += `📞 *Dúvidas?* Use o menu "Suporte"`;

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...backToMenuKeyboard
      });
    }
    else if (data === 'support') {
      let message = `💬 *Suporte ao Cliente*\n\n`;
      message += `🕐 *Horário de Atendimento:* 24/7\n\n`;
      message += `📱 *Canais de Contato:*\n`;
      message += `• Bot automático (você está aqui!)\n`;
      message += `• Telegram: @suporte_laras\n`;
      message += `• WhatsApp: (11) 99999-9999\n\n`;
      message += `❓ *FAQ:*\n`;
      message += `• Como recebo meu produto? Automaticamente após pagamento\n`;
      message += `• Posso cancelar? Não após confirmação\n`;
      message += `• Tem garantia? Sim, produtos testados`;

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...backToMenuKeyboard
      });
    }
    else if (data === 'add_balance') {
      let message = `💰 *Adicionar Saldo*\n\n`;
      message += `Para adicionar saldo à sua conta, entre em contato com nosso suporte:\n\n`;
      message += `📱 *Telegram:* @suporte_laras\n`;
      message += `💬 *WhatsApp:* (11) 99999-9999\n\n`;
      message += `💳 *Métodos aceitos:*\n`;
      message += `• PIX\n`;
      message += `• Transferência bancária\n`;
      message += `• Cartão de crédito\n\n`;
      message += `⚡️ *Processamento instantâneo!*`;

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        ...backToMenuKeyboard
      });
    }

    await ctx.answerCbQuery();
  } catch (error) {
    console.error('Erro no callback:', error);
    await ctx.answerCbQuery('❌ Erro interno. Tente novamente.');
  }
});

// Tratamento de erros
bot.catch((err, ctx) => {
  console.error('Erro no bot:', err);
  ctx.reply('❌ Ocorreu um erro. Tente novamente ou entre em contato com o suporte.');
});

export default bot;