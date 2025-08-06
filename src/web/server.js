import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import Database from '../database/database.js';

const app = express();
const db = new Database();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { username, isAdmin: true }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ success: true, token, user: { username, isAdmin: true } });
    } else {
      res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Rota para verificar token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Rotas da API
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await db.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    await db.db.run(
      'INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)',
      [name, description, parseFloat(price), category, parseInt(stock)]
    );
    
    res.json({ success: true, message: 'Produto criado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, is_active } = req.body;
    
    await db.db.run(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, is_active = ? WHERE id = ?',
      [name, description, parseFloat(price), category, parseInt(stock), is_active ? 1 : 0, id]
    );
    
    res.json({ success: true, message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.db.run('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Notification routes
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await db.db.all('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { title, message, type, expires_at } = req.body;
    
    await db.createNotification({
      title,
      message,
      type: type || 'info',
      expires_at
    });
    
    res.json({ success: true, message: 'Notificação criada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/notifications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteNotification(id);
    res.json({ success: true, message: 'Notificação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Servir arquivos estáticos do painel admin
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

const PORT = process.env.WEB_PORT || 3000;

export default app;
export { PORT };