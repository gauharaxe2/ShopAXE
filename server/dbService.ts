import { eq, desc } from 'drizzle-orm';
import { db } from '../src/db/index.ts';
import {
  products,
  orders,
  customers,
  supportTickets,
  securityLogs,
  storeSettings,
  sellerWallet,
  walletWithdrawals,
  walletTransactions,
} from '../src/db/schema.ts';
import {
  Product,
  AdminOrder,
  CustomerRecord,
  SupportTicket,
  SecurityLog,
  StoreSettings,
  SellerWallet,
  WithdrawalRequest,
  WalletTransaction,
} from '../src/types.ts';
import { MOCK_PRODUCTS } from '../src/data/products.ts';
import { DEFAULT_STORE_SETTINGS } from '../src/lib/firebase.ts';

function formatDbProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    deliveryCharges: p.deliveryCharges !== undefined && p.deliveryCharges !== null ? Number(p.deliveryCharges) : 0,
    rating: Number(p.rating ?? 5.0),
    reviewCount: Number(p.reviewCount ?? 1),
    image: p.image,
    secondaryImage: p.secondaryImage || undefined,
    images: Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : [p.image, ...(p.secondaryImage ? [p.secondaryImage] : [])].filter(Boolean),
    videoUrl: p.videoUrl || p.video_url || undefined,
    description: p.description,
    details: Array.isArray(p.details) && p.details.length > 0 ? p.details : [
      '100% Sustainable Organic Textile',
      'Pre-washed handcrafted fabric',
      'Machine wash cold gentle cycle',
    ],
    isNew: !!p.isNew,
    isBestseller: !!p.isBestseller,
    inStock: !!p.inStock,
    stockCount: Number(p.stockCount ?? 10),
    sku: p.sku || `AXE-${Math.floor(1000 + Math.random() * 9000)}`,
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [
      { name: 'Onyx Black', hex: '#18181b' },
      { name: 'Off-White', hex: '#fafaf9' },
    ],
    sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL'],
  };
}

/**
 * Seed initial catalog to PostgreSQL if table is currently empty
 */
export async function seedInitialProductsIfEmpty(): Promise<void> {
  try {
    const existing = await db.select().from(products).limit(1);
    if (existing.length === 0) {
      console.log('Seeding initial product catalog into PostgreSQL...');
      for (const p of MOCK_PRODUCTS) {
        await db.insert(products).values({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice ?? null,
          rating: p.rating ?? 5.0,
          reviewCount: p.reviewCount ?? 12,
          image: p.image,
          description: p.description,
          badge: null,
          isNew: p.isNew ?? false,
          isBestseller: p.isBestseller ?? false,
          isTrending: false,
          stockCount: p.stockCount ?? 20,
          sku: p.sku || `AXE-${Math.floor(1000 + Math.random() * 9000)}`,
          inStock: (p.stockCount ?? 20) > 0,
          colors: p.colors ?? [],
          sizes: p.sizes ?? [],
          images: p.images ?? [p.image],
          videoUrl: p.videoUrl ?? null,
        }).onConflictDoNothing();
      }
      console.log('PostgreSQL catalog seeded successfully.');
    }
  } catch (err) {
    console.error('Error checking/seeding PostgreSQL catalog:', err);
  }
}

// ================= PRODUCTS ================= //
export async function getDbProducts(): Promise<Product[]> {
  try {
    const rows = await db.select().from(products);
    if (rows.length === 0) {
      await seedInitialProductsIfEmpty();
      const refetched = await db.select().from(products);
      return refetched.map(formatDbProduct);
    }
    return rows.map(formatDbProduct);
  } catch (err) {
    console.error('getDbProducts error:', err);
    return MOCK_PRODUCTS;
  }
}

export async function getDbProductById(id: string): Promise<Product | null> {
  try {
    const rows = await db.select().from(products).where(eq(products.id, id));
    return rows.length > 0 ? formatDbProduct(rows[0]) : null;
  } catch (err) {
    console.error('getDbProductById error:', err);
    return null;
  }
}

export async function createDbProduct(data: Partial<Product>): Promise<Product> {
  const newProduct: Product = {
    id: data.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: data.name || 'New Minimalist Product',
    category: (data.category as any) || 'Apparel',
    price: Number(data.price) || 99,
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    deliveryCharges: data.deliveryCharges !== undefined ? Number(data.deliveryCharges) : 0,
    rating: data.rating || 5.0,
    reviewCount: data.reviewCount || 1,
    image: data.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    secondaryImage: data.secondaryImage,
    images: Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : [data.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', ...(data.secondaryImage ? [data.secondaryImage] : [])].filter(Boolean),
    videoUrl: data.videoUrl,
    colors: data.colors && data.colors.length > 0 ? data.colors : [
      { name: 'Onyx Black', hex: '#18181b' },
      { name: 'Off-White', hex: '#fafaf9' }
    ],
    description: data.description || 'Handcrafted minimalist essential designed for longevity.',
    details: data.details || ['100% Sustainable Organic Textile', 'Machine wash cold'],
    isNew: data.isNew ?? true,
    inStock: (data.stockCount ?? 25) > 0,
    stockCount: Number(data.stockCount ?? 25),
    sku: data.sku || `AXE-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  try {
    await db.insert(products).values({
      id: newProduct.id,
      name: newProduct.name,
      category: newProduct.category,
      price: newProduct.price,
      originalPrice: newProduct.originalPrice ?? null,
      deliveryCharges: newProduct.deliveryCharges ?? 0,
      rating: newProduct.rating,
      reviewCount: newProduct.reviewCount,
      image: newProduct.image,
      description: newProduct.description,
      badge: null,
      isNew: newProduct.isNew ?? false,
      isBestseller: newProduct.isBestseller ?? false,
      isTrending: false,
      stockCount: newProduct.stockCount,
      sku: newProduct.sku,
      inStock: newProduct.inStock,
      colors: newProduct.colors,
      sizes: newProduct.sizes ?? [],
      images: newProduct.images ?? [],
      videoUrl: newProduct.videoUrl ?? null,
    }).onConflictDoUpdate({
      target: products.id,
      set: {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice ?? null,
        deliveryCharges: newProduct.deliveryCharges ?? 0,
        rating: newProduct.rating,
        reviewCount: newProduct.reviewCount,
        image: newProduct.image,
        description: newProduct.description,
        isNew: newProduct.isNew ?? false,
        isBestseller: newProduct.isBestseller ?? false,
        stockCount: newProduct.stockCount,
        sku: newProduct.sku,
        inStock: newProduct.inStock,
        colors: newProduct.colors,
        sizes: newProduct.sizes ?? [],
        images: newProduct.images ?? [],
        videoUrl: newProduct.videoUrl ?? null,
      }
    });
  } catch (err) {
    console.error('createDbProduct error:', err);
  }

  return newProduct;
}

export async function upsertDbProduct(data: Partial<Product>): Promise<Product> {
  if (data.id) {
    const existing = await getDbProductById(data.id);
    if (existing) {
      const updated = await updateDbProduct(data.id, data);
      if (updated) return updated;
    }
  }
  return await createDbProduct(data);
}

export async function updateDbProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  try {
    const existing = await getDbProductById(id);
    if (!existing) {
      return await createDbProduct({ ...data, id });
    }

    const stockCount = data.stockCount !== undefined ? Number(data.stockCount) : existing.stockCount;
    const inStock = data.inStock !== undefined ? data.inStock : stockCount > 0;
    const deliveryCharges = data.deliveryCharges !== undefined ? Number(data.deliveryCharges) : (existing.deliveryCharges ?? 0);

    await db.update(products).set({
      name: data.name !== undefined ? data.name : existing.name,
      category: data.category !== undefined ? data.category : existing.category,
      price: data.price !== undefined ? Number(data.price) : existing.price,
      originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : existing.originalPrice,
      deliveryCharges,
      image: data.image !== undefined ? data.image : existing.image,
      description: data.description !== undefined ? data.description : existing.description,
      stockCount,
      inStock,
      sku: data.sku !== undefined ? data.sku : existing.sku,
      colors: data.colors !== undefined ? data.colors : existing.colors,
      sizes: data.sizes !== undefined ? data.sizes : existing.sizes,
      images: data.images !== undefined ? data.images : (existing.images ?? []),
      videoUrl: data.videoUrl !== undefined ? data.videoUrl : (existing.videoUrl ?? null),
    }).where(eq(products.id, id));

    return await getDbProductById(id);
  } catch (err) {
    console.error('updateDbProduct error:', err);
    return null;
  }
}

export async function deleteDbProduct(id: string): Promise<boolean> {
  try {
    await db.delete(products).where(eq(products.id, id));
    return true;
  } catch (err) {
    console.error('deleteDbProduct error:', err);
    return false;
  }
}

// ================= ORDERS ================= //
export async function getDbOrders(): Promise<AdminOrder[]> {
  try {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return rows.map((r) => ({
      id: r.id,
      customerName: r.customerName,
      customerEmail: r.customerEmail,
      items: r.items as any,
      subtotal: r.subtotal,
      total: r.total,
      status: r.status as any,
      paymentGateway: r.paymentGateway,
      paymentDetails: r.paymentDetails as any,
      receiptImage: (r.paymentDetails as any)?.receiptImage || undefined,
      receiptName: (r.paymentDetails as any)?.receiptName || undefined,
      shippingAddress: r.shippingAddress,
      trackingNumber: r.trackingNumber || undefined,
      date: r.date,
    }));
  } catch (err) {
    console.error('getDbOrders error:', err);
    return [];
  }
}

export async function upsertDbOrder(order: AdminOrder): Promise<AdminOrder> {
  try {
    const existing = await db.select().from(orders).where(eq(orders.id, order.id));
    if (existing.length > 0) {
      await db.update(orders).set({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        subtotal: order.subtotal,
        total: order.total,
        status: order.status,
        paymentGateway: order.paymentGateway,
        paymentDetails: order.paymentDetails,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber || null,
        date: order.date,
      }).where(eq(orders.id, order.id));
      return order;
    } else {
      await db.insert(orders).values({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        subtotal: order.subtotal,
        total: order.total,
        status: order.status,
        paymentGateway: order.paymentGateway,
        paymentDetails: order.paymentDetails,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber || null,
        date: order.date,
      });
      return order;
    }
  } catch (err) {
    console.error('upsertDbOrder error:', err);
    return order;
  }
}

export async function syncDbOrders(incomingOrders: AdminOrder[] = []): Promise<AdminOrder[]> {
  try {
    // 1. Process and upsert incoming orders
    if (incomingOrders && Array.isArray(incomingOrders) && incomingOrders.length > 0) {
      for (const ord of incomingOrders) {
        if (ord && ord.id) {
          await upsertDbOrder(ord);
        }
      }
    }
    // 2. Return latest unified list from PostgreSQL database
    return await getDbOrders();
  } catch (err) {
    console.error('syncDbOrders error:', err);
    return await getDbOrders();
  }
}

export async function createDbOrder(data: Partial<AdminOrder>): Promise<AdminOrder> {
  const newOrder: AdminOrder = {
    id: data.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customerName: data.customerName || 'Shopaxe Customer',
    customerEmail: data.customerEmail || 'customer@shopaxe.com',
    items: data.items || [],
    subtotal: Number(data.subtotal || data.total || 0),
    total: Number(data.total || 0),
    status: data.status || 'Pending',
    paymentGateway: data.paymentGateway || 'Card (Visa / Mastercard to Payoneer)',
    paymentDetails: data.paymentDetails,
    date: data.date || new Date().toISOString().replace('T', ' ').slice(0, 16),
    shippingAddress: data.shippingAddress || 'Standard Delivery',
    trackingNumber: data.trackingNumber || `TRK-${Math.floor(10000000 + Math.random() * 90000000)}PK`,
  };

  try {
    await db.insert(orders).values({
      id: newOrder.id,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      total: newOrder.total,
      status: newOrder.status,
      paymentGateway: newOrder.paymentGateway,
      paymentDetails: newOrder.paymentDetails,
      shippingAddress: newOrder.shippingAddress,
      trackingNumber: newOrder.trackingNumber,
      date: newOrder.date,
    });
  } catch (err) {
    console.error('createDbOrder error:', err);
  }

  return newOrder;
}

export async function updateDbOrderStatus(orderId: string, status: string, trackingNumber?: string): Promise<boolean> {
  try {
    const updateData: any = { status };
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }
    await db.update(orders).set(updateData).where(eq(orders.id, orderId));
    return true;
  } catch (err) {
    console.error('updateDbOrderStatus error:', err);
    return false;
  }
}

export async function deleteDbOrder(orderId: string): Promise<boolean> {
  try {
    await db.delete(orders).where(eq(orders.id, orderId));
    return true;
  } catch (err) {
    console.error('deleteDbOrder error:', err);
    return false;
  }
}

// ================= CUSTOMERS ================= //
export async function getDbCustomers(): Promise<CustomerRecord[]> {
  try {
    const rows = await db.select().from(customers).orderBy(desc(customers.createdAt));
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      totalOrders: c.totalOrders ?? 0,
      totalSpent: c.totalSpent ?? 0,
      status: (c.status as any) || 'New',
      lastOrderDate: c.lastOrderDate || undefined,
    }));
  } catch (err) {
    console.error('getDbCustomers error:', err);
    return [];
  }
}

export async function createDbCustomer(data: Partial<CustomerRecord>): Promise<CustomerRecord> {
  const newCustomer: CustomerRecord = {
    id: data.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
    name: data.name || 'New Customer',
    email: data.email || 'user@shopaxe.com',
    totalOrders: Number(data.totalOrders ?? 1),
    totalSpent: Number(data.totalSpent ?? 0),
    status: data.status || 'New',
    lastOrderDate: data.lastOrderDate || new Date().toISOString().slice(0, 10),
  };

  try {
    await db.insert(customers).values({
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      totalOrders: newCustomer.totalOrders,
      totalSpent: newCustomer.totalSpent,
      status: newCustomer.status,
      lastOrderDate: newCustomer.lastOrderDate,
    }).onConflictDoNothing();
  } catch (err) {
    console.error('createDbCustomer error:', err);
  }

  return newCustomer;
}

export async function updateDbCustomer(id: string, data: Partial<CustomerRecord>): Promise<CustomerRecord | null> {
  try {
    await db.update(customers).set({
      name: data.name,
      email: data.email,
      totalOrders: data.totalOrders,
      totalSpent: data.totalSpent,
      status: data.status,
      lastOrderDate: data.lastOrderDate,
    }).where(eq(customers.id, id));

    const rows = await db.select().from(customers).where(eq(customers.id, id));
    if (rows.length > 0) {
      const c = rows[0];
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        totalOrders: c.totalOrders ?? 0,
        totalSpent: c.totalSpent ?? 0,
        status: (c.status as any) || 'New',
        lastOrderDate: c.lastOrderDate || undefined,
      };
    }
    return null;
  } catch (err) {
    console.error('updateDbCustomer error:', err);
    return null;
  }
}

export async function deleteDbCustomer(id: string): Promise<boolean> {
  try {
    await db.delete(customers).where(eq(customers.id, id));
    return true;
  } catch (err) {
    console.error('deleteDbCustomer error:', err);
    return false;
  }
}

// ================= SUPPORT TICKETS ================= //
export async function getDbSupportTickets(): Promise<SupportTicket[]> {
  try {
    const rows = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
    return rows.map((t) => ({
      id: t.id,
      customerName: t.customerName,
      customerEmail: t.customerEmail,
      subject: t.subject,
      message: t.message,
      status: (t.status as any) || 'Open',
      date: t.date,
    }));
  } catch (err) {
    console.error('getDbSupportTickets error:', err);
    return [];
  }
}

export async function createDbSupportTicket(data: Partial<SupportTicket>): Promise<SupportTicket> {
  const ticket: SupportTicket = {
    id: data.id || `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: data.customerName || 'Customer',
    customerEmail: data.customerEmail || 'support@shopaxe.com',
    subject: data.subject || 'Store Inquiry',
    message: data.message || '',
    status: data.status || 'Open',
    date: data.date || new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  try {
    await db.insert(supportTickets).values({
      id: ticket.id,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      date: ticket.date,
    });
  } catch (err) {
    console.error('createDbSupportTicket error:', err);
  }

  return ticket;
}

export async function updateDbSupportTicketStatus(id: string, status: string): Promise<boolean> {
  try {
    await db.update(supportTickets).set({ status: status as any }).where(eq(supportTickets.id, id));
    return true;
  } catch (err) {
    console.error('updateDbSupportTicketStatus error:', err);
    return false;
  }
}

export async function deleteDbSupportTicket(id: string): Promise<boolean> {
  try {
    await db.delete(supportTickets).where(eq(supportTickets.id, id));
    return true;
  } catch (err) {
    console.error('deleteDbSupportTicket error:', err);
    return false;
  }
}

// ================= SECURITY LOGS ================= //
export async function getDbSecurityLogs(): Promise<SecurityLog[]> {
  try {
    const rows = await db.select().from(securityLogs).orderBy(desc(securityLogs.createdAt)).limit(100);
    return rows.map((l) => ({
      id: l.id,
      timestamp: l.timestamp,
      action: l.action,
      category: l.category as any,
      severity: l.severity as any,
      ipAddress: l.ipAddress,
      user: l.user,
    }));
  } catch (err) {
    console.error('getDbSecurityLogs error:', err);
    return [];
  }
}

export async function createDbSecurityLog(data: Partial<SecurityLog>): Promise<SecurityLog> {
  const log: SecurityLog = {
    id: data.id || `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: data.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19),
    action: data.action || 'System Operation',
    category: data.category || 'Security',
    severity: data.severity || 'info',
    ipAddress: data.ipAddress || '127.0.0.1',
    user: data.user || 'System',
  };

  try {
    await db.insert(securityLogs).values({
      id: log.id,
      timestamp: log.timestamp,
      action: log.action,
      category: log.category,
      severity: log.severity,
      ipAddress: log.ipAddress,
      user: log.user,
    });
  } catch (err) {
    console.error('createDbSecurityLog error:', err);
  }

  return log;
}

// ================= STORE SETTINGS ================= //
export async function getDbStoreSettings(): Promise<StoreSettings> {
  try {
    const rows = await db.select().from(storeSettings).where(eq(storeSettings.id, 'default'));
    if (rows.length > 0) {
      const r = rows[0];
      const pg: any = r.paymentGateway || {};
      return {
        storeName: r.storeName || DEFAULT_STORE_SETTINGS.storeName,
        supportEmail: r.supportEmail || DEFAULT_STORE_SETTINGS.supportEmail,
        taxRatePercent: r.taxRatePercent ?? 8,
        freeShippingThreshold: r.freeShippingThreshold ?? 150,
        announcementBarText: pg.announcementBarText ?? (r as any).announcementBarText ?? DEFAULT_STORE_SETTINGS.announcementBarText,
        announcementCodeText: pg.announcementCodeText ?? (r as any).announcementCodeText ?? DEFAULT_STORE_SETTINGS.announcementCodeText,
        announcementSubtext: pg.announcementSubtext ?? (r as any).announcementSubtext ?? DEFAULT_STORE_SETTINGS.announcementSubtext,
        announcementBadgeText: pg.announcementBadgeText ?? (r as any).announcementBadgeText ?? DEFAULT_STORE_SETTINGS.announcementBadgeText,
        announcementEnabled: pg.announcementEnabled !== undefined ? pg.announcementEnabled : ((r as any).announcementEnabled !== undefined ? (r as any).announcementEnabled : DEFAULT_STORE_SETTINGS.announcementEnabled),
        paymentGateway: pg.gatewayName ? pg : DEFAULT_STORE_SETTINGS.paymentGateway,
        sellerPhone2FA: (r as any).sellerPhone2FA || pg.sellerPhone2FA || DEFAULT_STORE_SETTINGS.sellerPhone2FA,
      };
    }
  } catch (err) {
    console.error('getDbStoreSettings error:', err);
  }
  return DEFAULT_STORE_SETTINGS;
}

export async function updateDbStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getDbStoreSettings();
  const updated: StoreSettings = {
    ...current,
    ...settings,
    paymentGateway: {
      ...(current.paymentGateway || {}),
      ...(settings.paymentGateway || {}),
      // embed announcement configs inside json payload for persistent resilience
      announcementBarText: settings.announcementBarText !== undefined ? settings.announcementBarText : current.announcementBarText,
      announcementCodeText: settings.announcementCodeText !== undefined ? settings.announcementCodeText : current.announcementCodeText,
      announcementSubtext: settings.announcementSubtext !== undefined ? settings.announcementSubtext : current.announcementSubtext,
      announcementBadgeText: settings.announcementBadgeText !== undefined ? settings.announcementBadgeText : current.announcementBadgeText,
      announcementEnabled: settings.announcementEnabled !== undefined ? settings.announcementEnabled : current.announcementEnabled,
    } as any,
  };

  try {
    await db.insert(storeSettings).values({
      id: 'default',
      storeName: updated.storeName,
      supportEmail: updated.supportEmail,
      taxRatePercent: updated.taxRatePercent,
      freeShippingThreshold: updated.freeShippingThreshold,
      paymentGateway: updated.paymentGateway,
    }).onConflictDoUpdate({
      target: storeSettings.id,
      set: {
        storeName: updated.storeName,
        supportEmail: updated.supportEmail,
        taxRatePercent: updated.taxRatePercent,
        freeShippingThreshold: updated.freeShippingThreshold,
        paymentGateway: updated.paymentGateway,
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('updateDbStoreSettings error:', err);
  }

  return updated;
}

// ================= SELLER WALLET & WITHDRAWALS ================= //

export const DEFAULT_SELLER_WALLET: SellerWallet = {
  availableBalance: 0.0,
  pendingBalance: 0.0,
  totalEarnings: 0.0,
  totalWithdrawn: 0.0,
  currency: 'USD',
  updatedAt: new Date().toISOString(),
};

export async function getDbWallet(): Promise<SellerWallet> {
  try {
    const allOrders = await getDbOrders();
    const validOrders = allOrders.filter(o => o.status !== 'Cancelled');
    const earnings = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const pending = allOrders.filter(o => o.status === 'Pending').reduce((sum, o) => sum + Number(o.total || 0), 0);

    const rows = await db.select().from(sellerWallet).where(eq(sellerWallet.id, 'default'));
    if (rows.length > 0) {
      const r = rows[0];
      // If no orders ever placed and no real withdrawals, clear example values
      const currentWithdrawn = Number(r.totalWithdrawn ?? 0);
      const computedEarnings = earnings > 0 ? earnings : 0;
      const computedAvailable = Math.max(0, computedEarnings - currentWithdrawn);
      const computedPending = pending > 0 ? pending : 0;

      return {
        availableBalance: computedAvailable,
        pendingBalance: computedPending,
        totalEarnings: computedEarnings,
        totalWithdrawn: currentWithdrawn,
        currency: 'USD',
        lastPayoutDate: r.lastPayoutDate || undefined,
        lastPayoutAmount: r.lastPayoutAmount ? Number(r.lastPayoutAmount) : undefined,
        lastPayoutMethod: (r.lastPayoutMethod as any) || undefined,
        updatedAt: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString(),
      };
    } else {
      // Calculate from live orders
      const initialWallet: SellerWallet = {
        availableBalance: Math.max(0, earnings),
        pendingBalance: pending,
        totalEarnings: earnings,
        totalWithdrawn: 0,
        currency: 'USD',
        updatedAt: new Date().toISOString(),
      };
      await db.insert(sellerWallet).values({
        id: 'default',
        availableBalance: initialWallet.availableBalance,
        pendingBalance: initialWallet.pendingBalance,
        totalEarnings: initialWallet.totalEarnings,
        totalWithdrawn: initialWallet.totalWithdrawn,
        currency: 'USD',
        updatedAt: new Date(),
      }).onConflictDoNothing();
      return initialWallet;
    }
  } catch (err) {
    console.error('getDbWallet error:', err);
    return DEFAULT_SELLER_WALLET;
  }
}

export async function updateDbWallet(data: Partial<SellerWallet>): Promise<SellerWallet> {
  let current: SellerWallet = DEFAULT_SELLER_WALLET;
  try {
    const rows = await db.select().from(sellerWallet).where(eq(sellerWallet.id, 'default'));
    if (rows.length > 0) {
      const r = rows[0];
      current = {
        availableBalance: Number(r.availableBalance ?? 0),
        pendingBalance: Number(r.pendingBalance ?? 0),
        totalEarnings: Number(r.totalEarnings ?? 0),
        totalWithdrawn: Number(r.totalWithdrawn ?? 0),
        currency: 'USD',
        lastPayoutDate: r.lastPayoutDate || undefined,
        lastPayoutAmount: r.lastPayoutAmount ? Number(r.lastPayoutAmount) : undefined,
        lastPayoutMethod: (r.lastPayoutMethod as any) || undefined,
        updatedAt: r.updatedAt ? r.updatedAt.toISOString() : new Date().toISOString(),
      };
    }
  } catch {}

  const updated: SellerWallet = {
    ...current,
    ...data,
    availableBalance: data.availableBalance !== undefined ? Number(data.availableBalance) : current.availableBalance,
    pendingBalance: data.pendingBalance !== undefined ? Number(data.pendingBalance) : current.pendingBalance,
    totalEarnings: data.totalEarnings !== undefined ? Number(data.totalEarnings) : current.totalEarnings,
    totalWithdrawn: data.totalWithdrawn !== undefined ? Number(data.totalWithdrawn) : current.totalWithdrawn,
    updatedAt: new Date().toISOString(),
  };

  try {
    await db.insert(sellerWallet).values({
      id: 'default',
      availableBalance: updated.availableBalance,
      pendingBalance: updated.pendingBalance,
      totalEarnings: updated.totalEarnings,
      totalWithdrawn: updated.totalWithdrawn,
      currency: 'USD',
      lastPayoutDate: updated.lastPayoutDate || null,
      lastPayoutAmount: updated.lastPayoutAmount || null,
      lastPayoutMethod: updated.lastPayoutMethod || null,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: sellerWallet.id,
      set: {
        availableBalance: updated.availableBalance,
        pendingBalance: updated.pendingBalance,
        totalEarnings: updated.totalEarnings,
        totalWithdrawn: updated.totalWithdrawn,
        lastPayoutDate: updated.lastPayoutDate || null,
        lastPayoutAmount: updated.lastPayoutAmount || null,
        lastPayoutMethod: updated.lastPayoutMethod || null,
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('updateDbWallet error:', err);
  }

  return updated;
}

export async function getDbWithdrawals(): Promise<WithdrawalRequest[]> {
  try {
    const rows = await db.select().from(walletWithdrawals).orderBy(desc(walletWithdrawals.timestamp));
    return rows.map((r) => ({
      id: r.id,
      referenceId: r.referenceId,
      amount: Number(r.amount),
      fee: Number(r.fee ?? 0),
      netAmount: Number(r.netAmount),
      method: (r.method as any) || 'crypto',
      status: (r.status as any) || 'Completed',
      timestamp: r.timestamp,
      cryptoNetwork: (r.cryptoNetwork as any) || undefined,
      cryptoAddress: r.cryptoAddress || undefined,
      txHash: r.txHash || undefined,
      memo: r.memo || undefined,
      easypaisaTitle: r.easypaisaTitle || undefined,
      easypaisaPhone: r.easypaisaPhone || undefined,
      easypaisaCnic: r.easypaisaCnic || undefined,
      amountPkr: r.amountPkr ? Number(r.amountPkr) : undefined,
      exchangeRatePkr: r.exchangeRatePkr ? Number(r.exchangeRatePkr) : undefined,
      note: r.note || undefined,
    }));
  } catch (err) {
    console.error('getDbWithdrawals error:', err);
    return [];
  }
}

export async function createDbWithdrawal(w: WithdrawalRequest): Promise<WithdrawalRequest> {
  try {
    await db.insert(walletWithdrawals).values({
      id: w.id,
      referenceId: w.referenceId,
      amount: w.amount,
      fee: w.fee ?? 0,
      netAmount: w.netAmount,
      method: w.method,
      status: w.status,
      cryptoNetwork: null,
      cryptoAddress: null,
      txHash: null,
      memo: w.memo || null,
      easypaisaTitle: w.easypaisaTitle || null,
      easypaisaPhone: w.easypaisaPhone || null,
      easypaisaCnic: w.easypaisaCnic || null,
      amountPkr: w.amountPkr || null,
      exchangeRatePkr: w.exchangeRatePkr || null,
      note: w.note || null,
      timestamp: w.timestamp,
    }).onConflictDoNothing();
  } catch (err) {
    console.error('createDbWithdrawal error:', err);
  }
  return w;
}

export async function getDbWalletTransactions(): Promise<WalletTransaction[]> {
  try {
    const rows = await db.select().from(walletTransactions).orderBy(desc(walletTransactions.timestamp));
    return rows.map((r) => ({
      id: r.id,
      referenceId: r.referenceId,
      type: (r.type as any),
      direction: (r.direction as any),
      amount: Number(r.amount),
      currency: 'USD',
      status: (r.status as any) || 'Completed',
      description: r.description,
      orderId: r.orderId || undefined,
      withdrawalId: r.withdrawalId || undefined,
      recipient: r.recipient || undefined,
      details: (r.details as any) || undefined,
      timestamp: r.timestamp,
    }));
  } catch (err) {
    console.error('getDbWalletTransactions error:', err);
    return [];
  }
}

export async function createDbWalletTransaction(t: WalletTransaction): Promise<WalletTransaction> {
  try {
    await db.insert(walletTransactions).values({
      id: t.id,
      referenceId: t.referenceId,
      type: t.type,
      direction: t.direction,
      amount: t.amount,
      currency: 'USD',
      status: t.status,
      description: t.description,
      orderId: t.orderId || null,
      withdrawalId: t.withdrawalId || null,
      recipient: t.recipient || null,
      details: t.details || null,
      timestamp: t.timestamp,
    }).onConflictDoNothing();
  } catch (err) {
    console.error('createDbWalletTransaction error:', err);
  }
  return t;
}

export async function recordCustomerOrderWalletCredit(
  orderId: string,
  amount: number,
  customerEmail?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const currentWallet = await getDbWallet();
    const updated = {
      availableBalance: Number((currentWallet.availableBalance + amount).toFixed(2)),
      totalEarnings: Number((currentWallet.totalEarnings + amount).toFixed(2)),
    };
    await updateDbWallet(updated);

    const methodLabel = details?.method || 'Storefront Checkout';
    const pkrText = details?.amountPkr ? ` (Rs. ${Number(details.amountPkr).toLocaleString()} PKR)` : '';
    const senderText = details?.senderMobile ? ` from ${details.senderMobile}` : '';
    const trxText = details?.trxId ? ` [TRX: ${details.trxId}]` : '';

    const txn: WalletTransaction = {
      id: `TXN-ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      referenceId: details?.trxId ? `TRX-${details.trxId}` : `REF-${orderId}`,
      type: 'ORDER_PAYMENT',
      direction: 'credit',
      amount,
      currency: 'USD',
      status: 'Completed',
      description: `Customer payment received via ${methodLabel}${pkrText}${senderText}${trxText} for Order #${orderId}${customerEmail ? ` (${customerEmail})` : ''}`,
      orderId,
      recipient: 'Seller Central Master Wallet',
      details: details || null,
      timestamp: new Date().toISOString(),
    };
    await createDbWalletTransaction(txn);
  } catch (err) {
    console.error('recordCustomerOrderWalletCredit error:', err);
  }
}

