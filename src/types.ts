export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  deliveryCharges?: number;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage?: string;
  images?: string[]; // Up to 5 product gallery images
  videoUrl?: string; // Optional product video (MP4, YouTube, Vimeo)
  colors: ProductColor[];
  sizes?: string[];
  description: string;
  details: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  inStock: boolean;
  stockCount: number;
  sku: string;
}

export interface CartItem {
  id: string; // Unique combination of product id + color + size
  product: Product;
  selectedColor: ProductColor;
  selectedSize?: string;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image: string;
  description?: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface FilterOptions {
  searchQuery: string;
  category: string; // 'all' or specific category
  priceRange: [number, number];
  sortBy: SortOption;
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'cart' | 'wishlist' | 'info' | 'success' | 'share';
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface PakistanPaymentSettings {
  easypaisaEnabled: boolean;
  easypaisaNumber: string;
  easypaisaTitle: string;
  jazzcashEnabled: boolean;
  jazzcashNumber: string;
  jazzcashTitle: string;
  exchangeRatePkr: number;
  instructions?: string;
}

export interface PaymentGatewaySettings {
  isEnabled: boolean;
  gatewayName: string;
  environment: 'sandbox' | 'live';
  pakistanPayments?: PakistanPaymentSettings;
}

export interface Phone2FASettings {
  enabled: boolean;
  phoneNumber: string;
  countryCode: string;
  channel?: 'sms' | 'whatsapp' | 'both';
  autoSendOnGate?: boolean;
  lastVerifiedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  announcementBarText?: string;
  announcementCodeText?: string;
  announcementSubtext?: string;
  announcementBadgeText?: string;
  announcementEnabled?: boolean;
  paymentGateway?: PaymentGatewaySettings;
  sellerPhone2FA?: Phone2FASettings;
  pakistanPayments?: PakistanPaymentSettings;
}

export interface OrderPaymentDetails {
  method?: string;
  authCode?: string;
  transactionId?: string;
  status?: string;
  network?: string;
  merchantReceivingAddress?: string;
  customerSenderAddress?: string;
  txHash?: string;
  amountUsdt?: number;
  amountUsd?: number;
  amountPkr?: number;
  exchangeRatePkr?: number;
  trxId?: string;
  senderMobile?: string;
  senderAccountTitle?: string;
  merchantAccount?: string;
  cardBrand?: string;
  last4?: string;
  cardholderName?: string;
  receiptImage?: string;
  receiptName?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentGateway: string;
  paymentDetails?: OrderPaymentDetails;
  receiptImage?: string;
  receiptName?: string;
  currency?: 'USD';
  date: string;
  shippingAddress: string;
  trackingNumber?: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'Auth' | 'Inventory' | 'Order' | 'Settings' | 'Security' | 'CRM';
  severity: 'info' | 'warning' | 'critical';
  ipAddress: string;
  user: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: 'VIP' | 'Regular' | 'New';
  lastOrderDate: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  date: string;
  status: 'Open' | 'Resolved' | 'In Progress';
}

// ================= SELLER WALLET & PAYOUT TYPES ================= //
export type WithdrawalMethod = 'payoneer' | 'easypaisa' | 'jazzcash';

export interface WithdrawalRequest {
  id: string;
  referenceId: string;
  amount: number; // in USD
  fee: number; // platform fee in USD
  netAmount: number; // net received
  method: WithdrawalMethod;
  status: 'Completed' | 'Processing' | 'Pending' | 'Rejected';
  timestamp: string;
  // Payoneer specific
  payoneerEmail?: string;
  payoneerAccountTitle?: string;
  payoneerCustomerId?: string;
  memo?: string;
  // Easypaisa & JazzCash specific
  easypaisaTitle?: string;
  easypaisaPhone?: string;
  easypaisaCnic?: string;
  jazzcashTitle?: string;
  jazzcashPhone?: string;
  jazzcashCnic?: string;
  amountPkr?: number;
  exchangeRatePkr?: number;
  note?: string;
}

export type WalletTransactionType = 
  | 'ORDER_PAYMENT' 
  | 'WITHDRAWAL_PAYONEER'
  | 'WITHDRAWAL_EASYPAISA' 
  | 'WITHDRAWAL_JAZZCASH' 
  | 'REVENUE_RELEASE' 
  | 'ADJUSTMENT';

export interface WalletTransaction {
  id: string;
  referenceId: string;
  type: WalletTransactionType;
  direction: 'credit' | 'debit';
  amount: number;
  currency: 'USD';
  status: 'Completed' | 'Processing' | 'Pending' | 'Failed';
  description: string;
  timestamp: string;
  orderId?: string;
  withdrawalId?: string;
  recipient?: string;
  details?: Record<string, any>;
}

export interface SellerWallet {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  currency: 'USD';
  lastPayoutDate?: string;
  lastPayoutAmount?: number;
  lastPayoutMethod?: WithdrawalMethod;
  updatedAt: string;
}

