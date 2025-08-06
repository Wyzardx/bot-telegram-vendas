import 'dotenv/config';
import bot from './src/bot/bot.js';
import app, { PORT } from './src/web/server.js';

// Inicializar servidor web
app.listen(PORT, () => {
  console.log(`🌐 Servidor web rodando na porta ${PORT}`);
  console.log(`📊 Painel admin: http://localhost:${PORT}`);
});

// Inicializar bot do Telegram
bot.launch().then(() => {
  console.log('🤖 Bot do Telegram iniciado com sucesso!');
  console.log('📱 Bot Name:', process.env.BOT_NAME || 'Loja Bot');
}).catch(error => {
  console.error('❌ Erro ao iniciar bot:', error);
  process.exit(1);
});

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n⚡ Encerrando aplicação...');
  bot.stop('SIGINT');
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('\n⚡ Encerrando aplicação...');
  bot.stop('SIGTERM');
  process.exit(0);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

console.log('🚀 Sistema de vendas iniciado!');
console.log('📋 Configurações:');
console.log(`   • Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`   • PIX API: ${process.env.PIX_ACCESS_TOKEN ? '✅ Configurado' : '⚠️  Modo Demo'}`);
console.log(`   • Admin: ${process.env.ADMIN_USERNAME || 'admin'}`);
console.log(`   • Porta Web: ${PORT}`);