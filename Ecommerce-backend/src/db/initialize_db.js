import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function initialize() {
  try {
    // Connect to MySQL server
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });

    //  Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log("✅ Database created or already exists");

    await connection.query(`USE ${process.env.DB_NAME}`);

    const createTablesSQL = `
    -- ============================================
    -- ROLES & USERS
    -- ============================================
    CREATE TABLE IF NOT EXISTS roles (
      role_id INT AUTO_INCREMENT PRIMARY KEY,
      role_name VARCHAR(50) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      role_id INT NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(role_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_addresses (
      address_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      address_line1 VARCHAR(255) NOT NULL,
      address_line2 VARCHAR(255),
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100),
      postal_code VARCHAR(20),
      country VARCHAR(100) NOT NULL,
      is_default BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- ============================================
    -- PRODUCT CATALOG
    -- ============================================
    CREATE TABLE IF NOT EXISTS categories (
      category_id INT AUTO_INCREMENT PRIMARY KEY,
      category_name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      product_id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      product_name VARCHAR(150) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock INT DEFAULT 0,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    );

    -- ============================================
    -- CART SYSTEM
    -- ============================================
    CREATE TABLE IF NOT EXISTS carts (
      cart_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
      cart_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL CHECK (quantity > 0),
      FOREIGN KEY (cart_id) REFERENCES carts(cart_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    );

    -- ============================================
    -- ORDERS & ITEMS
    -- ============================================
    CREATE TABLE IF NOT EXISTS orders (
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      address_id INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status ENUM('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (address_id) REFERENCES user_addresses(address_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_item_id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL CHECK (quantity > 0),
      price_at_purchase DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    );

    -- ============================================
    -- PAYMENTS
    -- ============================================
    CREATE TABLE IF NOT EXISTS payments (
      payment_id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      transaction_id VARCHAR(100) NOT NULL UNIQUE,
      amount DECIMAL(10,2) NOT NULL,
      method ENUM('Credit Card','Debit Card','PayPal','Bank Transfer','COD') NOT NULL,
      status ENUM('Pending','Completed','Failed','Refunded') DEFAULT 'Pending',
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    );

    
    `;

    await connection.query(createTablesSQL);
    console.log(" All normalized tables created successfully");

    const insertDataSQL = `
    INSERT INTO roles (role_name) VALUES ('Admin'), ('Customer')
      ON DUPLICATE KEY UPDATE role_name=role_name;

    INSERT INTO users (role_id, full_name, email, password_hash, phone)
      VALUES (1, 'Admin User', 'admin@shop.com', '$10$qBp6rPOF1rvn1RA7baPnuOFkcZ/kLyREfuaxDecl24eJj.ZXmLenG', '1234567890')
      ON DUPLICATE KEY UPDATE email=email;

    INSERT INTO categories (category_name, description)
      VALUES ('Mobiles', 'Smartphones and devices'),
             ('Laptops', 'All laptop types'),
             ('Accessories', 'Computer and mobile accessories')
      ON DUPLICATE KEY UPDATE category_name=category_name;

    INSERT INTO products (category_id, product_name, description, price, stock, image_url)
      VALUES (1, 'iPhone 16', 'Latest Apple smartphone', 1200.00, 10, 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lJTIwMTR8ZW58MHx8MHx8fDA%3D'),
             (2, 'Dell XPS 15', 'High-performance laptop', 1500.00, 5, 'https://images.unsplash.com/photo-1720556405438-d67f0f9ecd44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRlbGwlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D'),
             (3, 'Wireless Mouse', 'Ergonomic wireless mouse', 25.00, 100, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW91c2V8ZW58MHx8MHx8fDA%3D')
      ON DUPLICATE KEY UPDATE product_name=product_name; `;

    await connection.query(insertDataSQL);
    console.log(" Base data inserted successfully");

    await connection.end();
    console.log(" Database initialization completed!");
    console.log("Password for admin = 1234567890")
  } catch (err) {
    console.error(" Error initializing database:", err.message);
  }
}

initialize();
// -- ============================================
    // -- ADMIN ACTION LOGS
    // -- ============================================
    // CREATE TABLE IF NOT EXISTS admin_actions (
    //   action_id INT AUTO_INCREMENT PRIMARY KEY,
    //   admin_id INT NOT NULL,
    //   action_type VARCHAR(100) NOT NULL,
    //   description TEXT,
    //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //   FOREIGN KEY (admin_id) REFERENCES users(user_id)
    //     ON DELETE CASCADE ON UPDATE CASCADE
    // );