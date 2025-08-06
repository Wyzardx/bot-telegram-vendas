import sqlite3 from 'sqlite3';
import { promisify } from 'util';

class Database {
  constructor(dbPath = process.env.DATABASE_PATH || './database.sqlite') {
    this.db = new sqlite3.Database(dbPath);
    this.db.run = promisify(this.db.run.bind(this.db));
    this.db.get = promisify(this.db.get.bind(this.db));
    this.db.all = promisify(this.db.all.bind(this.db));
    this.init();
  }

  async init() {
    await this.createTables();
  }

  async createTables() {
    // Users table
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        telegram_id TEXT UNIQUE NOT NULL,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        balance REAL DEFAULT 0,
        points INTEGER DEFAULT 0,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_admin INTEGER DEFAULT 0,
        is_banned INTEGER DEFAULT 0
      )
    `);

    // Products table
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        stock INTEGER DEFAULT 0,
        image_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER,
        quantity INTEGER DEFAULT 1,
        total_amount REAL,
        payment_id TEXT,
        payment_status TEXT DEFAULT 'pending',
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    // Payments table
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        payment_id TEXT UNIQUE,
        amount REAL,
        status TEXT DEFAULT 'pending',
        pix_code TEXT,
        pix_qr_code TEXT,
        expires_at DATETIME,
        paid_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id)
      )
    `);

    // Transactions table
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME
      )
    `);

    // Admin notifications table
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        reference_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Insert default products
    await this.insertDefaultProducts();
  }

  async insertDefaultProducts() {
    const existingProducts = await this.db.get('SELECT COUNT(*) as count FROM products');
    if (existingProducts.count === 0) {
      const defaultProducts = [
        {
          name: 'Lara G10',
          description: 'Lara premium com qualidade superior',
          price: 70.00,
          category: 'premium',
          stock: 100
        },
        {
          name: 'Lara SAMPABANK',
          description: 'Lara especial SAMPABANK',
          price: 85.00,
          category: 'premium',
          stock: 50
        },
        {
          name: 'Lara TARGET',
          description: 'Lara exclusiva TARGET',
          price: 95.00,
          category: 'exclusive',
          stock: 25
        }
      ];

      for (const product of defaultProducts) {
        await this.db.run(
          'INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.category, product.stock]
        );
      }
    }
  }

  // User methods
  async createUser(userData) {
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return await this.db.run(
      'INSERT OR REPLACE INTO users (telegram_id, username, first_name, last_name, referral_code) VALUES (?, ?, ?, ?, ?)',
      [userData.telegram_id, userData.username, userData.first_name, userData.last_name, referralCode]
    );
  }

  async getUser(telegramId) {
    return await this.db.get('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);
  }

  async getUserById(id) {
    return await this.db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  async updateUserBalance(telegramId, amount) {
    return await this.db.run(
      'UPDATE users SET balance = balance + ? WHERE telegram_id = ?',
      [amount, telegramId]
    );
  }

  async updateUserPoints(telegramId, points) {
    return await this.db.run(
      'UPDATE users SET points = points + ? WHERE telegram_id = ?',
      [points, telegramId]
    );
  }

  // Product methods
  async getAllProducts() {
    return await this.db.all('SELECT * FROM products WHERE is_active = 1 ORDER BY category, price');
  }

  async getProduct(id) {
    return await this.db.get('SELECT * FROM products WHERE id = ?', [id]);
  }

  async updateProductStock(id, quantity) {
    return await this.db.run(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [quantity, id]
    );
  }

  // Order methods
  async createOrder(orderData) {
    return await this.db.run(
      'INSERT INTO orders (user_id, product_id, quantity, total_amount, payment_method) VALUES (?, ?, ?, ?, ?)',
      [orderData.user_id, orderData.product_id, orderData.quantity, orderData.total_amount, orderData.payment_method]
    );
  }

  async getOrder(id) {
    return await this.db.get(`
      SELECT o.*, p.name as product_name, u.telegram_id, u.first_name 
      FROM orders o 
      JOIN products p ON o.product_id = p.id 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `, [id]);
  }

  async getUserOrders(userId) {
    return await this.db.all(`
      SELECT o.*, p.name as product_name 
      FROM orders o 
      JOIN products p ON o.product_id = p.id 
      WHERE o.user_id = ? 
      ORDER BY o.created_at DESC
    `, [userId]);
  }

  // Payment methods
  async createPayment(paymentData) {
    return await this.db.run(
      'INSERT INTO payments (order_id, payment_id, amount, pix_code, pix_qr_code, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [paymentData.order_id, paymentData.payment_id, paymentData.amount, paymentData.pix_code, paymentData.pix_qr_code, paymentData.expires_at]
    );
  }

  async getPayment(paymentId) {
    return await this.db.get('SELECT * FROM payments WHERE payment_id = ?', [paymentId]);
  }

  async updatePaymentStatus(paymentId, status) {
    const paidAt = status === 'paid' ? new Date().toISOString() : null;
    return await this.db.run(
      'UPDATE payments SET status = ?, paid_at = ? WHERE payment_id = ?',
      [status, paidAt, paymentId]
    );
  }

  // Notification methods
  async createNotification(notificationData) {
    return await this.db.run(
      'INSERT INTO notifications (title, message, type, expires_at) VALUES (?, ?, ?, ?)',
      [notificationData.title, notificationData.message, notificationData.type, notificationData.expires_at]
    );
  }

  async getActiveNotifications() {
    return await this.db.all(`
      SELECT * FROM notifications 
      WHERE is_active = 1 AND (expires_at IS NULL OR expires_at > datetime('now'))
      ORDER BY created_at DESC
    `);
  }

  async deleteNotification(id) {
    return await this.db.run('DELETE FROM notifications WHERE id = ?', [id]);
  }

  // Transaction methods
  async createTransaction(transactionData) {
    return await this.db.run(
      'INSERT INTO transactions (user_id, type, amount, description, reference_id) VALUES (?, ?, ?, ?, ?)',
      [transactionData.user_id, transactionData.type, transactionData.amount, transactionData.description, transactionData.reference_id]
    );
  }

  async getUserTransactions(userId) {
    return await this.db.all(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  // Admin methods
  async getAllUsers() {
    return await this.db.all('SELECT * FROM users ORDER BY created_at DESC');
  }

  async getAllOrders() {
    return await this.db.all(`
      SELECT o.*, p.name as product_name, u.telegram_id, u.first_name, u.username
      FROM orders o 
      JOIN products p ON o.product_id = p.id 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
  }

  async getStats() {
    const totalUsers = await this.db.get('SELECT COUNT(*) as count FROM users');
    const totalOrders = await this.db.get('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await this.db.get('SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "paid"');
    const pendingOrders = await this.db.get('SELECT COUNT(*) as count FROM orders WHERE payment_status = "pending"');
    
    return {
      totalUsers: totalUsers.count,
      totalOrders: totalOrders.count,
      totalRevenue: totalRevenue.total || 0,
      pendingOrders: pendingOrders.count
    };
  }
}

export default Database;