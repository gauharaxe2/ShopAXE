import { pgTable, text, doublePrecision, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Products Table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: doublePrecision('price').notNull(),
  originalPrice: doublePrecision('original_price'),
  deliveryCharges: doublePrecision('delivery_charges').default(0),
  rating: doublePrecision('rating').default(5.0),
  reviewCount: integer('review_count').default(0),
  image: text('image').notNull(),
  secondaryImage: text('secondary_image'),
  description: text('description').notNull(),
  details: jsonb('details').$type<string[]>().default([]),
  badge: text('badge'),
  isNew: boolean('is_new').default(false),
  isBestseller: boolean('is_bestseller').default(false),
  isTrending: boolean('is_trending').default(false),
  stockCount: integer('stock_count').default(10),
  sku: text('sku').notNull(),
  inStock: boolean('in_stock').default(true),
  colors: jsonb('colors').$type<{ name: string; hex: string }[]>().default([]),
  sizes: jsonb('sizes').$type<string[]>().default([]),
  images: jsonb('images').$type<string[]>().default([]),
  videoUrl: text('video_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders Table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  items: jsonb('items').notNull(),
  subtotal: doublePrecision('subtotal').notNull(),
  total: doublePrecision('total').notNull(),
  status: text('status').notNull().default('Pending'),
  paymentGateway: text('payment_gateway').notNull(),
  paymentDetails: jsonb('payment_details'),
  shippingAddress: text('shipping_address').notNull(),
  trackingNumber: text('tracking_number'),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customers Table
export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  totalOrders: integer('total_orders').default(0),
  totalSpent: doublePrecision('total_spent').default(0),
  status: text('status').$type<'VIP' | 'Regular' | 'New'>().default('New'),
  lastOrderDate: text('last_order_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Support Tickets Table
export const supportTickets = pgTable('support_tickets', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').$type<'Open' | 'Resolved' | 'In Progress'>().default('Open'),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Security Logs Table
export const securityLogs = pgTable('security_logs', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  action: text('action').notNull(),
  category: text('category').$type<'Auth' | 'Inventory' | 'Order' | 'Settings' | 'Security' | 'CRM'>().notNull(),
  severity: text('severity').$type<'info' | 'warning' | 'critical'>().notNull(),
  ipAddress: text('ip_address').notNull(),
  user: text('user').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Store Settings Table
export const storeSettings = pgTable('store_settings', {
  id: text('id').primaryKey().default('default'),
  storeName: text('store_name').notNull().default('Shopaxe'),
  supportEmail: text('support_email').notNull().default('axe426622@gmail.com'),
  taxRatePercent: doublePrecision('tax_rate_percent').default(8),
  freeShippingThreshold: doublePrecision('free_shipping_threshold').default(150),
  themeTemplate: text('theme_template').default('midnight-cyber'),
  paymentGateway: jsonb('payment_gateway'),
  sellerPhone2FA: jsonb('seller_phone_2fa'),
  pakistanPayments: jsonb('pakistan_payments'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Seller Wallet Balance Table
export const sellerWallet = pgTable('seller_wallet', {
  id: text('id').primaryKey().default('default'),
  availableBalance: doublePrecision('available_balance').default(0),
  pendingBalance: doublePrecision('pending_balance').default(0),
  totalEarnings: doublePrecision('total_earnings').default(0),
  totalWithdrawn: doublePrecision('total_withdrawn').default(0),
  currency: text('currency').default('USD'),
  lastPayoutDate: text('last_payout_date'),
  lastPayoutAmount: doublePrecision('last_payout_amount'),
  lastPayoutMethod: text('last_payout_method'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Wallet Withdrawals Table
export const walletWithdrawals = pgTable('wallet_withdrawals', {
  id: text('id').primaryKey(),
  referenceId: text('reference_id').notNull(),
  amount: doublePrecision('amount').notNull(),
  fee: doublePrecision('fee').default(0),
  netAmount: doublePrecision('net_amount').notNull(),
  method: text('method').notNull(), // 'crypto' | 'easypaisa'
  status: text('status').notNull().default('Completed'),
  cryptoNetwork: text('crypto_network'),
  cryptoAddress: text('crypto_address'),
  txHash: text('tx_hash'),
  memo: text('memo'),
  easypaisaTitle: text('easypaisa_title'),
  easypaisaPhone: text('easypaisa_phone'),
  easypaisaCnic: text('easypaisa_cnic'),
  amountPkr: doublePrecision('amount_pkr'),
  exchangeRatePkr: doublePrecision('exchange_rate_pkr'),
  note: text('note'),
  timestamp: text('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Wallet Transactions Ledger Table
export const walletTransactions = pgTable('wallet_transactions', {
  id: text('id').primaryKey(),
  referenceId: text('reference_id').notNull(),
  type: text('type').notNull(),
  direction: text('direction').notNull(), // 'credit' | 'debit'
  amount: doublePrecision('amount').notNull(),
  currency: text('currency').default('USD'),
  status: text('status').notNull().default('Completed'),
  description: text('description').notNull(),
  orderId: text('order_id'),
  withdrawalId: text('withdrawal_id'),
  recipient: text('recipient'),
  details: jsonb('details'),
  timestamp: text('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

