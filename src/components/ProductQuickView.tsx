import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Shield,
  Truck,
  RefreshCw,
  Check,
  Zap,
  Play,
  Video,
  Film,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  Clock,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Product, ProductColor, ToastNotification } from '../types';
import { CustomerReviews } from './CustomerReviews';
import { SocialShareButton } from './SocialShareButton';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: ProductColor, size?: string, quantity?: number) => void;
  onBuyNow?: (product: Product, color: ProductColor, size?: string, quantity?: number) => void;
  onUpdateProductRating?: (productId: string, newRating: number, newReviewCount: number) => void;
  onAddToast?: (toast: Omit<ToastNotification, 'id'>) => void;
}

// Helper to determine iframe or direct video format
function getEmbedVideoData(url?: string): { type: 'iframe' | 'video'; src: string } | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (ytMatch) {
    return { type: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0` };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/
  );
  if (vimeoMatch) {
    return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };
  }

  return { type: 'video', src: trimmed };
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onUpdateProductRating,
  onAddToast,
}) => {
  if (!product) return null;

  // Extract up to 5 images
  const galleryImages = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean).slice(0, 5);
    }
    const list: string[] = [product.image];
    if (product.secondaryImage) list.push(product.secondaryImage);
    return list.filter(Boolean).slice(0, 5);
  }, [product]);

  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Standard', hex: '#18181b' }
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping' | 'reviews'>('details');
  const [added, setAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    setActiveMediaIndex(0);
    setIsVideoActive(false);
    setSelectedColor(product.colors?.[0] || { name: 'Standard', hex: '#18181b' });
    setSelectedSize(product.sizes?.[0]);
    setQuantity(1);
    setAdded(false);
  }, [product.id]);

  const videoData = useMemo(() => getEmbedVideoData(product.videoUrl), [product.videoUrl]);

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product, selectedColor, selectedSize, quantity);
    } else {
      onAddToCart(product, selectedColor, selectedSize, quantity);
    }
    onClose();
  };

  const handleNextMedia = () => {
    setIsVideoActive(false);
    setActiveMediaIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevMedia = () => {
    setIsVideoActive(false);
    setActiveMediaIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Delivery estimation (e.g. 2-3 days from now)
  const estimatedDeliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }, []);

  const currentImage = galleryImages[activeMediaIndex] || product.image;
  const isDiscounted = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = isDiscounted
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/75 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <div className="flex min-h-full items-center justify-center p-3 sm:p-5 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden text-left border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 z-10 my-4 sm:my-8 max-h-[92vh] flex flex-col"
          >
            {/* Top Bar Floating Controls */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <SocialShareButton product={product} variant="icon" onAddToast={onAddToast} />
              <button
                onClick={onClose}
                className="p-2.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-white/90 dark:bg-neutral-800/90 hover:bg-stone-100 dark:hover:bg-neutral-700 rounded-full shadow-md border border-stone-200/80 dark:border-neutral-700/80 transition-colors backdrop-blur-xs"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
                
                {/* ================= LEFT COLUMN: MULTI-MEDIA SHOWCASE (5 IMAGES + VIDEO) ================= */}
                <div className="lg:col-span-6 bg-stone-100/90 dark:bg-neutral-950 p-5 sm:p-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-neutral-800">
                  <div className="space-y-4">
                    {/* Main High-Res Viewer */}
                    <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-md border border-stone-200/60 dark:border-neutral-800 group">
                      {isVideoActive && videoData ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          {videoData.type === 'iframe' ? (
                            <iframe
                              src={videoData.src}
                              title={`${product.name} Video Showcase`}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={videoData.src}
                              controls
                              autoPlay
                              className="w-full h-full object-contain"
                              playsInline
                            />
                          )}
                        </div>
                      ) : (
                        <div
                          className="w-full h-full overflow-hidden cursor-zoom-in"
                          onClick={() => setIsZoomed(!isZoomed)}
                        >
                          <img
                            src={currentImage}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              isZoomed ? 'scale-125 cursor-zoom-out' : 'group-hover:scale-105'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Top Floating Badges */}
                      <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 pointer-events-none z-10">
                        {product.isNew && (
                          <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                            New Arrival
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="bg-amber-500 text-neutral-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow flex items-center gap-1">
                            <Sparkles className="w-3 h-3 fill-neutral-950" />
                            <span>Bestseller</span>
                          </span>
                        )}
                        {isDiscounted && (
                          <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                            Save {discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Floating Media State Counter / Badge */}
                      <div className="absolute bottom-3.5 left-3.5 z-10">
                        <span className="bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full shadow border border-white/10 flex items-center gap-1.5 font-bold">
                          {isVideoActive ? (
                            <>
                              <Film className="w-3.5 h-3.5 text-amber-400" />
                              <span>Product Video</span>
                            </>
                          ) : (
                            <>
                              <Layers className="w-3.5 h-3.5 text-amber-400" />
                              <span>Photo {activeMediaIndex + 1} of {galleryImages.length}</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Navigation Arrows for Photos */}
                      {galleryImages.length > 1 && !isVideoActive && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevMedia();
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-white flex items-center justify-center shadow-lg border border-stone-200 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 cursor-pointer z-10"
                            aria-label="Previous photo"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextMedia();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-white flex items-center justify-center shadow-lg border border-stone-200 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 cursor-pointer z-10"
                            aria-label="Next photo"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Interactive Thumbnails Gallery (Up to 5 Images + Optional Video) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span className="font-semibold uppercase tracking-wider">
                          Media Views ({galleryImages.length} Photos {videoData ? '+ 1 Video' : ''})
                        </span>
                        <span className="text-[10px] text-neutral-400">Click to switch angle</span>
                      </div>

                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                        {galleryImages.map((img, idx) => {
                          const isSelected = !isVideoActive && activeMediaIndex === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setIsVideoActive(false);
                                setActiveMediaIndex(idx);
                              }}
                              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                isSelected
                                  ? 'border-neutral-900 dark:border-amber-400 ring-2 ring-amber-400/30 scale-102 shadow-md'
                                  : 'border-stone-200 dark:border-neutral-800 opacity-70 hover:opacity-100 hover:border-neutral-400'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Angle ${idx + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute bottom-0 inset-x-0 bg-neutral-950/75 text-[9px] font-mono text-center text-white py-0.5">
                                #{idx + 1}
                              </span>
                            </button>
                          );
                        })}

                        {/* Video Showcase Thumbnail Button */}
                        {videoData && (
                          <button
                            type="button"
                            onClick={() => setIsVideoActive(true)}
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-neutral-950 flex flex-col items-center justify-center cursor-pointer ${
                              isVideoActive
                                ? 'border-amber-400 ring-2 ring-amber-400/40 scale-102 shadow-md text-amber-400'
                                : 'border-stone-200 dark:border-neutral-800 text-neutral-400 hover:text-white opacity-85 hover:opacity-100'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-1">
                              <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-0.5" />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                              Video
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Assurance Guarantee Footer */}
                  <div className="pt-4 border-t border-stone-200/80 dark:border-neutral-800/80 grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>100% Guaranteed Authentic</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Arrives by {estimatedDeliveryDate}</span>
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT COLUMN: MERCHANDISING, SPECS & BUYING ACTION ================= */}
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-neutral-900">
                  <div className="space-y-6">
                    {/* Category & Rating Bar */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          {product.category}
                        </span>

                        <button
                          type="button"
                          onClick={() => setActiveTab('reviews')}
                          className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold hover:underline cursor-pointer transition-colors"
                          title="Jump to customer reviews"
                        >
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= Math.round(product.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-stone-300 dark:text-neutral-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-neutral-900 dark:text-white font-bold ml-1">{product.rating}</span>
                          <span className="text-neutral-400">({product.reviewCount} verified reviews)</span>
                        </button>
                      </div>

                      {/* Product Title */}
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight leading-snug">
                        {product.name}
                      </h2>

                      {/* SKU and Stock Urgency */}
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="font-mono text-neutral-400">SKU: {product.sku}</span>
                        <span className="text-neutral-300 dark:text-neutral-700">&bull;</span>
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>In Stock ({product.stockCount} available)</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Value Banner */}
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-neutral-850 border border-stone-200/80 dark:border-neutral-800">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
                          ${product.price}
                        </span>
                        {isDiscounted && (
                          <span className="text-base text-neutral-400 line-through font-mono">
                            ${product.originalPrice}
                          </span>
                        )}
                        {isDiscounted && (
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900">
                            Save ${product.originalPrice! - product.price} ({discountPercent}% OFF)
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2.5 border-t border-stone-200/60 dark:border-neutral-800">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Truck className="w-3.5 h-3.5" />
                          <span>
                            {product.deliveryCharges && product.deliveryCharges > 0
                              ? `$${product.deliveryCharges} Standard Shipping`
                              : 'FREE Express Delivery Included'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-400">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Dispatch within 24h</span>
                        </div>
                      </div>
                    </div>

                    {/* Color Swatches */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            Select Color: <strong className="text-neutral-900 dark:text-white font-bold">{selectedColor.name}</strong>
                          </span>
                          <span className="text-neutral-400 text-[11px]">{product.colors.length} options</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {product.colors.map((col) => {
                            const isColSelected = selectedColor.name === col.name;
                            return (
                              <button
                                key={col.name}
                                type="button"
                                onClick={() => setSelectedColor(col)}
                                className={`w-8 h-8 rounded-full border transition-all cursor-pointer ${
                                  isColSelected
                                    ? 'ring-2 ring-neutral-900 dark:ring-amber-400 ring-offset-2 dark:ring-offset-neutral-900 scale-110 shadow'
                                    : 'border-stone-300 dark:border-neutral-700 hover:scale-105'
                                }`}
                                style={{ backgroundColor: col.hex }}
                                title={col.name}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Size Selector */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            Select Size: <strong className="text-neutral-900 dark:text-white font-bold">{selectedSize || 'Select'}</strong>
                          </span>
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 underline cursor-pointer">
                            Standard Size Guide
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((sz) => {
                            const isSzSelected = selectedSize === sz;
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setSelectedSize(sz)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  isSzSelected
                                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white shadow-sm'
                                    : 'bg-stone-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-stone-200 dark:border-neutral-700 hover:bg-stone-100 dark:hover:bg-neutral-700'
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quantity & Stock Urgency Bar */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div className="flex items-center border border-stone-200 dark:border-neutral-700 rounded-2xl bg-stone-50 dark:bg-neutral-800 p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-stone-200/60 dark:hover:bg-neutral-700 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-9 text-center text-xs font-bold font-mono text-neutral-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-stone-200/60 dark:hover:bg-neutral-700 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs text-neutral-500 dark:text-neutral-400 text-right">
                        <span>Total: </span>
                        <strong className="text-base font-bold font-mono text-neutral-900 dark:text-white">
                          ${(product.price * quantity).toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* Primary Purchasing Action Buttons */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className={`flex-1 py-3.5 px-5 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all border flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                            added
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20'
                              : 'bg-stone-100 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-stone-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {added ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleBuyNow}
                          className="flex-1 py-3.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-amber-500 dark:text-neutral-950 dark:hover:bg-amber-400 text-white rounded-2xl text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Zap className="w-4 h-4 fill-amber-400 dark:fill-neutral-950 text-amber-400 dark:text-neutral-950" />
                          <span>Instant Checkout (${(product.price * quantity).toFixed(2)})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleWishlist(product)}
                          className={`p-3.5 rounded-2xl border transition-colors shrink-0 flex items-center justify-center cursor-pointer ${
                            isWishlisted
                              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-500'
                              : 'bg-stone-50 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-stone-100 dark:hover:bg-neutral-700'
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Direct Link & Social Sharing Bar */}
                      <SocialShareButton product={product} variant="expanded" onAddToast={onAddToast} />
                    </div>

                    {/* Tabbed Comprehensive Content Section */}
                    <div className="bg-stone-50 dark:bg-neutral-850 rounded-3xl p-4 sm:p-5 border border-stone-200/80 dark:border-neutral-800">
                      <div className="flex border-b border-stone-200 dark:border-neutral-800 pb-2.5 mb-3.5 gap-4 text-xs font-semibold overflow-x-auto scrollbar-none">
                        <button
                          type="button"
                          onClick={() => setActiveTab('details')}
                          className={`pb-1 flex-shrink-0 transition-colors cursor-pointer ${
                            activeTab === 'details'
                              ? 'text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-amber-400 font-bold'
                              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                          }`}
                        >
                          Story &amp; Craft
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('specs')}
                          className={`pb-1 flex-shrink-0 transition-colors cursor-pointer ${
                            activeTab === 'specs'
                              ? 'text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-amber-400 font-bold'
                              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                          }`}
                        >
                          Specifications
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('shipping')}
                          className={`pb-1 flex-shrink-0 transition-colors cursor-pointer ${
                            activeTab === 'shipping'
                              ? 'text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-amber-400 font-bold'
                              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                          }`}
                        >
                          Delivery &amp; Returns
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('reviews')}
                          className={`pb-1 flex-shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTab === 'reviews'
                              ? 'text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-amber-400 font-bold'
                              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                          }`}
                        >
                          <span>Reviews</span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono px-2 py-0.5 rounded-full font-bold">
                            {product.reviewCount}
                          </span>
                        </button>
                      </div>

                      {/* Tab Content Panes */}
                      <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed min-h-[90px]">
                        {activeTab === 'details' && (
                          <div className="space-y-2.5">
                            <p>{product.description}</p>
                            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                              <span className="flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span>Master Artisan Crafted</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Sustainable &amp; Fair-Trade</span>
                              </span>
                            </div>
                          </div>
                        )}

                        {activeTab === 'specs' && (
                          <div className="space-y-2">
                            <ul className="space-y-1.5">
                              {product.details.map((dt, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                  <span>{dt}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="pt-3 border-t border-stone-200 dark:border-neutral-800 grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400">
                              <span>SKU: {product.sku}</span>
                              <span>Category: {product.category}</span>
                            </div>
                          </div>
                        )}

                        {activeTab === 'shipping' && (
                          <div className="space-y-2.5">
                            <p>
                              Express insured shipping dispatched within 24 hours. Includes door-to-door courier tracking number.
                            </p>
                            <div className="p-3 bg-stone-100 dark:bg-neutral-800 rounded-2xl space-y-1">
                              <p className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                                <span>30-Day Zero-Hassle Returns</span>
                              </p>
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                If you are not completely satisfied, return within 30 days of delivery in original condition for a 100% full refund.
                              </p>
                            </div>
                          </div>
                        )}

                        {activeTab === 'reviews' && (
                          <div className="pt-1">
                            <CustomerReviews
                              product={product}
                              onUpdateProductRating={(newRating, newCount) => {
                                if (onUpdateProductRating) {
                                  onUpdateProductRating(product.id, newRating, newCount);
                                }
                              }}
                              onAddToast={onAddToast}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Trust Footer Bar */}
                  <div className="pt-4 mt-6 border-t border-stone-200/80 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>256-Bit SSL Encrypted Checkout</span>
                    </span>
                    <span>Visa &bull; Mastercard &bull; Payoneer &bull; Mobile</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
