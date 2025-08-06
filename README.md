# 🤖 Bot de Telegram para Vendas com PIX

Sistema completo de vendas automatizado via Telegram com integração PIX e painel administrativo.

## 🚀 Características

### Bot do Telegram
- ✅ Interface moderna e intuitiva
- ✅ Sistema de vendas automatizado
- ✅ Pagamentos via PIX e saldo
- ✅ Sistema de usuários e pontos
- ✅ Sistema de referências
- ✅ Notificações em tempo real
- ✅ Suporte integrado
- ✅ Design responsivo com botões inline

### Painel Administrativo
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gestão de usuários
- ✅ Gestão de produtos
- ✅ Controle de pedidos
- ✅ Relatórios financeiros
- ✅ Interface dark moderna
- ✅ Sistema de autenticação seguro

### Integração PIX
- ✅ Geração automática de QR Codes
- ✅ Verificação de pagamentos em tempo real
- ✅ Integração com APIs de pagamento
- ✅ Modo demo para desenvolvimento

## 📦 Instalação

1. **Clone o repositório e instale dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Edite o arquivo `.env` com suas configurações:
   ```env
   # Bot do Telegram
   TELEGRAM_BOT_TOKEN=seu_token_do_botfather
   ADMIN_CHAT_ID=seu_id_do_telegram

   # API PIX (opcional - usa modo demo se não configurado)
   PIX_API_URL=https://sandbox.asaas.com/api/v3
   PIX_ACCESS_TOKEN=seu_token_pix

   # Configurações do painel admin
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   JWT_SECRET=sua_chave_secreta_super_segura

   # Outras configurações
   WEB_PORT=3000
   BOT_NAME=Loja Bot
   ```

3. **Inicie o sistema:**
   ```bash
   npm start
   ```

## 🔧 Como Usar

### 1. Configurar o Bot do Telegram
1. Crie um bot no [@BotFather](https://t.me/botfather)
2. Obtenha o token e configure no `.env`
3. Configure os comandos do bot:
   ```
   start - Iniciar o bot
   menu - Menu principal
   admin - Painel administrativo (apenas admins)
   ```

### 2. Acessar o Painel Admin
1. Acesse: `http://localhost:3000`
2. Login: `admin` / `admin123` (ou conforme configurado)
3. Gerencie produtos, usuários e pedidos

### 3. Configurar PIX (Opcional)
1. Registre-se em uma API de pagamentos (ex: Asaas)
2. Configure as credenciais no `.env`
3. Teste os pagamentos

## 📱 Funcionalidades do Bot

### Menu Principal
- 🛒 **Comprar Laras**: Navegar pelos produtos disponíveis
- 💰 **Adicionar Saldo**: Instruções para adicionar saldo
- 📊 **Minhas Informações**: Ver perfil e estatísticas
- 📋 **Meus Pedidos**: Histórico de compras
- 🔔 **Notificações**: Sistema de notificações
- 👥 **Referências**: Sistema de indicações
- 📜 **Termos**: Termos de uso
- 💬 **Suporte**: Contato para suporte

### Processo de Compra
1. Selecionar produto
2. Escolher forma de pagamento (PIX ou Saldo)
3. Realizar pagamento
4. Receber produto automaticamente

### Sistema de Pagamentos
- **PIX**: QR Code gerado automaticamente
- **Saldo**: Desconto direto da conta
- **Verificação**: Confirmação automática de pagamentos

## 🛡️ Segurança

- ✅ Autenticação JWT para painel admin
- ✅ Validação de dados de entrada
- ✅ Proteção contra SQL injection
- ✅ Rate limiting implícito
- ✅ Logs de transações
- ✅ Backup automático do banco de dados

## 📊 Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:
- `users`: Dados dos usuários
- `products`: Catálogo de produtos
- `orders`: Pedidos realizados
- `payments`: Dados de pagamentos
- `transactions`: Histórico de transações

## 🎨 Personalização

### Alterar Visual do Bot
Edite os arquivos em `src/bot/keyboards.js` para modificar botões e menus.

### Alterar Produtos Padrão
Modifique a função `insertDefaultProducts()` em `src/database/database.js`.

### Personalizar Painel Admin
Edite os arquivos em `public/` para modificar a interface web.

## 🚀 Deploy em Produção

### VPS/Servidor
1. Configure um servidor com Node.js
2. Use PM2 para gerenciar o processo:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "telegram-bot"
   ```
3. Configure um proxy reverso (Nginx)
4. Configure SSL/HTTPS

### Heroku
1. Configure as variáveis de ambiente
2. Faça deploy via Git
3. Configure webhook do Telegram

## 📞 Suporte

- **Documentação**: README.md
- **Issues**: GitHub Issues
- **Email**: seu-email@dominio.com

## 🔄 Atualizações

O sistema é facilmente extensível. Principais pontos de extensão:
- Novos métodos de pagamento
- Integração com outros bots
- Relatórios avançados
- Sistema de cupons
- Programa de afiliados

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**⚡ Sistema pronto para produção com todas as funcionalidades necessárias para uma loja automatizada via Telegram!**