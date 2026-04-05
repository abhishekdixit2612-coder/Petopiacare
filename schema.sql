-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  sku VARCHAR UNIQUE NOT NULL,
  category VARCHAR,
  image_url VARCHAR,
  stock_quantity INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  customer_phone VARCHAR,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR DEFAULT 'pending', -- pending, paid, shipped, delivered
  razorpay_order_id VARCHAR UNIQUE,
  razorpay_payment_id VARCHAR,
  shipping_address TEXT,
  city VARCHAR,
  pincode VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customers table (optional, for email list)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
