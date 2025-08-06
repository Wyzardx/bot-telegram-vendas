export const mainKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🛒 Comprar Laras', callback_data: 'buy_products' },
        { text: '💰 Adicionar Saldo', callback_data: 'add_balance' }
      ],
      [
        { text: '📊 Minhas Informações', callback_data: 'my_info' },
        { text: '📋 Meus Pedidos', callback_data: 'my_orders' }
      ],
      [
        { text: '🔔 Notificações', callback_data: 'notifications' },
        { text: '👥 Referências', callback_data: 'referrals' }
      ],
      [
        { text: '📜 Termos', callback_data: 'terms' },
        { text: '💬 Suporte', callback_data: 'support' }
      ]
    ]
  }
};

export const adminKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '👥 Usuários', callback_data: 'admin_users' },
        { text: '📦 Produtos', callback_data: 'admin_products' }
      ],
      [
        { text: '📊 Pedidos', callback_data: 'admin_orders' },
        { text: '💰 Financeiro', callback_data: 'admin_finance' }
      ],
      [
        { text: '📈 Estatísticas', callback_data: 'admin_stats' },
        { text: '⚙️ Configurações', callback_data: 'admin_settings' }
      ],
      [
        { text: '🔙 Voltar ao Menu', callback_data: 'back_to_menu' }
      ]
    ]
  }
};

export const productsKeyboard = (products) => {
  const keyboard = [
    [
      { text: 'G10', callback_data: 'product_1' },
      { text: 'SAMPABANK', callback_data: 'product_2' }
    ],
    [
      { text: 'TARGET', callback_data: 'product_3' }
    ],
    [
      { text: '🔍 Buscar laras por Nome', callback_data: 'search_products' }
    ],
    [
      { text: '🔻 Voltar', callback_data: 'back_to_menu' }
    ]
  ];
  
  return { reply_markup: { inline_keyboard: keyboard } };
};

export const productDetailKeyboard = (productId) => ({
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🛒 Comprar Agora', callback_data: `buy_${productId}` }
      ],
      [
        { text: '🔙 Voltar aos Produtos', callback_data: 'buy_products' },
        { text: '🏠 Menu Principal', callback_data: 'back_to_menu' }
      ]
    ]
  }
});

export const paymentMethodKeyboard = (orderId) => ({
  reply_markup: {
    inline_keyboard: [
      [
        { text: '💳 PIX', callback_data: `pay_pix_${orderId}` }
      ],
      [
        { text: '💰 Usar Saldo', callback_data: `pay_balance_${orderId}` }
      ],
      [
        { text: '❌ Cancelar', callback_data: 'cancel_order' }
      ]
    ]
  }
});

export const confirmPaymentKeyboard = (paymentId) => ({
  reply_markup: {
    inline_keyboard: [
      [
        { text: '✅ Confirmar Pagamento', callback_data: `confirm_payment_${paymentId}` }
      ],
      [
        { text: '🔄 Verificar Status', callback_data: `check_payment_${paymentId}` }
      ],
      [
        { text: '❌ Cancelar', callback_data: 'cancel_payment' }
      ]
    ]
  }
});

export const backToMenuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '🔙 Voltar ao Menu', callback_data: 'back_to_menu' }]
    ]
  }
};