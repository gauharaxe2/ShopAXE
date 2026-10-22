import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Check,
  Sparkles,
  RefreshCw,
  DollarSign,
  Package,
  Tag,
  Layers,
  Eye,
  Sliders,
  Palette,
  Ruler,
  ListPlus,
  Zap,
  FileText,
  Percent,
  Copy,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  FolderPlus,
  Truck,
  Video,
  Film,
  Play,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { Product, ProductColor, Category } from '../../types';
import { ImageUploadInput } from './ImageUploadInput';
import { getAllCategories, saveCustomCategory, CATEGORY_IMAGE_PRESETS } from '../../utils/categoryStorage';
import { uploadProductImageServer } from '../../lib/productsApi';

interface ProductListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product | null;
  onCategoryCreated?: (newCategory: Category) => void;
}

// Preset Luxury Templates for 1-Click Fast Populating
const LISTING_TEMPLATES: Array<{
  name: string;
  category: Product['category'];
  data: Partial<Product> & { detailsList: string[] };
}> = [
  {
    name: 'Cashmere Knit Overshirt',
    category: 'Apparel',
    data: {
      name: 'Structured Cashmere Blend Overshirt',
      category: 'Apparel',
      price: 185,
      originalPrice: 220,
      stockCount: 30,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      secondaryImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
      colors: [
        { name: 'Onyx Black', hex: '#18181b' },
        { name: 'Off-White', hex: '#fafaf9' },
        { name: 'Camel Tan', hex: '#b45309' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      description: 'Crafted from an ultra-soft Italian cashmere and organic cotton blend, featuring horn buttons and structured minimalist silhouette.',
      detailsList: [
        '70% GOTS Organic Cotton, 30% Mongolian Cashmere',
        'Custom engraved horn button closures',
        'Double-needle topstitched reinforced seams',
        'Dry clean or delicate hand wash cold',
      ],
      isNew: true,
      isBestseller: false,
    },
  },
  {
    name: 'Italian Leather Chelsea Boot',
    category: 'Footwear',
    data: {
      name: 'Artisanal Italian Leather Chelsea Boot',
      category: 'Footwear',
      price: 245,
      originalPrice: 295,
      stockCount: 18,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
      secondaryImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      colors: [
        { name: 'Espresso Brown', hex: '#451a03' },
        { name: 'Onyx Black', hex: '#18181b' },
      ],
      sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
      description: 'Handcrafted in Tuscany with full-grain calfskin leather and Goodyear-welted Vibram lug soles for all-weather traction and timeless elegance.',
      detailsList: [
        '100% Full-grain Tuscan calfskin leather',
        'Goodyear-welted construction (resolable)',
        'Custom memory-foam cushioned insole',
        'Elasticized side gussets for effortless fit',
      ],
      isNew: false,
      isBestseller: true,
    },
  },
  {
    name: 'Studio Wireless Headphones',
    category: 'Audio & Tech',
    data: {
      name: 'Acoustic Precision Studio Headphones',
      category: 'Audio & Tech',
      price: 299,
      originalPrice: 350,
      stockCount: 22,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      secondaryImage: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800',
      colors: [
        { name: 'Space Gray', hex: '#374151' },
        { name: 'Matte Silver', hex: '#cbd5e1' },
        { name: 'Champagne Gold', hex: '#d97706' },
      ],
      sizes: ['Universal Fit'],
      description: 'High-fidelity 45mm beryllium neodymium acoustic drivers with hybrid active noise cancellation and 40-hour lossless battery life.',
      detailsList: [
        'Custom 45mm Beryllium Acoustic Neodymium Drivers',
        'Lossless Bluetooth 5.3 with aptX HD & AAC decoding',
        '40-Hour continuous playback on single charge',
        'Aircraft-grade machined aluminum and memory foam earcups',
      ],
      isNew: true,
      isBestseller: true,
    },
  },
  {
    name: 'Minimalist Chronograph Timepiece',
    category: 'Accessories',
    data: {
      name: 'Monolithic Sapphire Chronograph Watch',
      category: 'Accessories',
      price: 320,
      originalPrice: 380,
      stockCount: 15,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      secondaryImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800',
      colors: [
        { name: 'Brushed Steel', hex: '#94a3b8' },
        { name: 'Obsidian Black', hex: '#0f172a' },
      ],
      sizes: ['40mm Case', '42mm Case'],
      description: 'Architectural chronograph featuring a domed anti-reflective sapphire crystal, surgical 316L stainless steel, and Swiss Ronda movement.',
      detailsList: [
        'Scratch-resistant domed Sapphire crystal glass',
        '316L Surgical grade brushed stainless steel case',
        'Swiss-made Ronda 5030.D Quartz Chronograph movement',
        '5 ATM (50m) Water resistance rating',
      ],
      isNew: true,
      isBestseller: false,
    },
  },
  {
    name: 'Ceramic Stoneware Table Lamp',
    category: 'Home & Living',
    data: {
      name: 'Sculptural Textured Ceramic Table Lamp',
      category: 'Home & Living',
      price: 165,
      originalPrice: 195,
      stockCount: 14,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
      secondaryImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
      colors: [
        { name: 'Raw Sandstone', hex: '#e7e5e4' },
        { name: 'Terracotta Clay', hex: '#9a3412' },
      ],
      sizes: ['Standard Medium', 'Large Sculptural'],
      description: 'Hand-thrown unglazed stoneware lamp base with a textured woven linen drum shade, delivering warm diffused ambient illumination.',
      detailsList: [
        'Hand-thrown textured matte ceramic body',
        'Natural unbleached textured linen shade',
        'Integrated rotary dimmer switch with braided cord',
        'E26 warm amber LED bulb included (2700K)',
      ],
      isNew: false,
      isBestseller: false,
    },
  },
];

const PRESET_COLOR_SWATCHES: ProductColor[] = [
  { name: 'Onyx Black', hex: '#18181b' },
  { name: 'Off-White', hex: '#fafaf9' },
  { name: 'Heather Grey', hex: '#64748b' },
  { name: 'Camel Tan', hex: '#b45309' },
  { name: 'Olive Forest', hex: '#365314' },
  { name: 'Royal Navy', hex: '#1e3a8a' },
  { name: 'Espresso Brown', hex: '#451a03' },
  { name: 'Burgundy Wine', hex: '#881337' },
  { name: 'Sage Green', hex: '#4d7c0f' },
  { name: 'Rose Blush', hex: '#e11d48' },
  { name: 'Champagne Gold', hex: '#d97706' },
  { name: 'Charcoal Slate', hex: '#334155' },
];

const STANDARD_APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const STANDARD_FOOTWEAR_SIZES = ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'US 13'];
const STANDARD_TECH_HOME_SIZES = ['One Size', 'Universal Fit', 'Compact', 'Standard', 'Large'];

export const ProductListingFormModal: React.FC<ProductListingFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  onCategoryCreated,
}) => {
  const isEditing = Boolean(initialProduct);

  // Tabbed sections for organized workflow
  const [activeStep, setActiveStep] = useState<'basic' | 'pricing' | 'variants' | 'specs' | 'preview'>('basic');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Apparel');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(120);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(150);
  const [costPerItem, setCostPerItem] = useState<number | undefined>(45);
  const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
  const [stockCount, setStockCount] = useState<number>(25);
  const [inStock, setInStock] = useState<boolean>(true);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isBestseller, setIsBestseller] = useState<boolean>(false);
  const [image, setImage] = useState('');
  const [secondaryImage, setSecondaryImage] = useState('');
  // Media State: Up to 5 compulsory images + 1 optional video
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    '',
    '',
    '',
    '',
  ]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'video'>('images');
  const [activeImageSlot, setActiveImageSlot] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState<string[]>([
    '100% GOTS Organic Certified Material',
    'Handcrafted with reinforced structural seams',
    'Machine wash cold gentle cycle',
  ]);
  const [newDetailInput, setNewDetailInput] = useState('');

  // Category State & Creation Options
  const [categoriesList, setCategoriesList] = useState<Category[]>(() => getAllCategories());
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatImage, setNewCatImage] = useState<string>(CATEGORY_IMAGE_PRESETS[0].url);
  const [newCatDescription, setNewCatDescription] = useState('');
  const [categoryCreateSuccess, setCategoryCreateSuccess] = useState<string | null>(null);
  const [categoryCreateError, setCategoryCreateError] = useState<string | null>(null);

  // Colors & Sizes
  const [colors, setColors] = useState<ProductColor[]>([
    { name: 'Onyx Black', hex: '#18181b' },
    { name: 'Off-White', hex: '#fafaf9' },
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#2563eb');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [customSizeInput, setCustomSizeInput] = useState('');

  // SEO & Tags
  const [searchTags, setSearchTags] = useState('minimalist, luxury, organic, essential');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [copySkuSuccess, setCopySkuSuccess] = useState(false);

  // Initialize or reset form based on initialProduct
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setSku(initialProduct.sku || generateSku(initialProduct.category));
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice);
      setDeliveryCharges(initialProduct.deliveryCharges ?? 0);
      setStockCount(initialProduct.stockCount);
      setInStock(initialProduct.inStock);
      setIsNew(Boolean(initialProduct.isNew));
      setIsBestseller(Boolean(initialProduct.isBestseller));
      setImage(initialProduct.image);
      setSecondaryImage(initialProduct.secondaryImage || '');
      const initialImgs = Array.isArray(initialProduct.images) && initialProduct.images.length > 0
        ? initialProduct.images
        : [initialProduct.image, ...(initialProduct.secondaryImage ? [initialProduct.secondaryImage] : [])].filter(Boolean);
      const padded = [...initialImgs];
      while (padded.length < 5) padded.push('');
      setGalleryImages(padded.slice(0, 5));
      setVideoUrl(initialProduct.videoUrl || '');
      setActiveImageSlot(0);
      setDescription(initialProduct.description);
      setDetails(initialProduct.details && initialProduct.details.length > 0 ? initialProduct.details : [
        '100% Sustainable Organic Textile',
        'Handcrafted seams for long-lasting durability',
        'Machine wash cold gentle cycle',
      ]);
      setColors(initialProduct.colors && initialProduct.colors.length > 0 ? initialProduct.colors : [
        { name: 'Onyx Black', hex: '#18181b' },
        { name: 'Off-White', hex: '#fafaf9' },
      ]);
      setSizes(initialProduct.sizes || ['S', 'M', 'L', 'XL']);
    } else {
      resetForm();
    }
  }, [initialProduct, isOpen]);

  // Refresh categories when modal opens
  useEffect(() => {
    if (isOpen) {
      setCategoriesList(getAllCategories());
      setCategoryCreateError(null);
      setCategoryCreateSuccess(null);
    }
  }, [isOpen]);

  const generateSku = (cat: string = category) => {
    const cleanCat = (cat || 'ITM').replace(/[^a-zA-Z0-9]/g, '');
    const prefix = (cleanCat.slice(0, 3) || 'ITM').toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `AXE-${prefix}-${randomNum}`;
  };

  const handleCreateCategorySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed || trimmed.length < 2) {
      setCategoryCreateError('Category name must be at least 2 characters.');
      return;
    }

    // Check if category already exists
    const existing = categoriesList.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase() || c.id.toLowerCase() === trimmed.toLowerCase()
    );

    let targetCat: Category;

    if (existing) {
      targetCat = existing;
      setCategory(existing.name);
      if (!isEditing) setSku(generateSku(existing.name));
      setCategoryCreateSuccess(`Category "${existing.name}" already exists and was selected.`);
    } else {
      const generatedSlug = newCatSlug.trim() || trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      targetCat = {
        id: trimmed,
        name: trimmed,
        slug: generatedSlug,
        itemCount: 0,
        image: newCatImage || CATEGORY_IMAGE_PRESETS[0].url,
        description: newCatDescription.trim() || `${trimmed} Department Collection`,
      };

      const updated = saveCustomCategory(targetCat);
      setCategoriesList(updated);
      setCategory(targetCat.name);
      if (!isEditing) setSku(generateSku(targetCat.name));
      if (onCategoryCreated) onCategoryCreated(targetCat);
      setCategoryCreateSuccess(`Category "${targetCat.name}" created and applied to product!`);
    }

    setCategoryCreateError(null);
    setTimeout(() => {
      setIsCreateCategoryOpen(false);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDescription('');
      setCategoryCreateSuccess(null);
    }, 1200);
  };

  const resetForm = () => {
    setName('');
    setCategory('Apparel');
    setSku(generateSku('Apparel'));
    setPrice(120);
    setOriginalPrice(150);
    setCostPerItem(45);
    setDeliveryCharges(0);
    setStockCount(25);
    setInStock(true);
    setIsNew(true);
    setIsBestseller(false);
    setImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800');
    setSecondaryImage('');
    setGalleryImages([
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      '',
      '',
      '',
      '',
    ]);
    setVideoUrl('');
    setActiveImageSlot(0);
    setDescription('Premium handcrafted minimalist garment made with organic sustainable fabrics.');
    setDetails([
      '100% GOTS Organic Certified Material',
      'Handcrafted with reinforced structural seams',
      'Machine wash cold gentle cycle',
    ]);
    setColors([
      { name: 'Onyx Black', hex: '#18181b' },
      { name: 'Off-White', hex: '#fafaf9' },
    ]);
    setSizes(['S', 'M', 'L', 'XL']);
    setActiveStep('basic');
    setValidationErrors([]);
  };

  const handleApplyTemplate = (template: (typeof LISTING_TEMPLATES)[0]) => {
    setName(template.data.name || '');
    setCategory(template.category);
    setSku(generateSku(template.category));
    setPrice(template.data.price || 99);
    setOriginalPrice(template.data.originalPrice);
    setStockCount(template.data.stockCount || 20);
    setInStock(true);
    setImage(template.data.image || '');
    setSecondaryImage(template.data.secondaryImage || '');
    setGalleryImages([
      template.data.image || '',
      template.data.secondaryImage || '',
      '',
      '',
      '',
    ]);
    setVideoUrl('');
    setActiveImageSlot(0);
    setDescription(template.data.description || '');
    setDetails(template.data.detailsList || []);
    setColors(template.data.colors || [{ name: 'Onyx Black', hex: '#18181b' }]);
    setSizes(template.data.sizes || ['One Size']);
    setIsNew(Boolean(template.data.isNew));
    setIsBestseller(Boolean(template.data.isBestseller));
  };

  // Color actions
  const handleTogglePresetColor = (swatch: ProductColor) => {
    const exists = colors.some((c) => c.name.toLowerCase() === swatch.name.toLowerCase());
    if (exists) {
      if (colors.length > 1) {
        setColors(colors.filter((c) => c.name.toLowerCase() !== swatch.name.toLowerCase()));
      }
    } else {
      setColors([...colors, swatch]);
    }
  };

  const handleAddCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customColorName.trim()) return;
    const newColor: ProductColor = {
      name: customColorName.trim(),
      hex: customColorHex,
    };
    if (!colors.some((c) => c.name.toLowerCase() === newColor.name.toLowerCase())) {
      setColors([...colors, newColor]);
      setCustomColorName('');
    }
  };

  const handleRemoveColor = (indexToRemove: number) => {
    if (colors.length <= 1) return;
    setColors(colors.filter((_, idx) => idx !== indexToRemove));
  };

  // Size actions
  const handleToggleSize = (sizeOption: string) => {
    if (sizes.includes(sizeOption)) {
      setSizes(sizes.filter((s) => s !== sizeOption));
    } else {
      setSizes([...sizes, sizeOption]);
    }
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSizeInput.trim()) return;
    if (!sizes.includes(customSizeInput.trim())) {
      setSizes([...sizes, customSizeInput.trim()]);
      setCustomSizeInput('');
    }
  };

  // Details actions
  const handleAddDetail = () => {
    if (!newDetailInput.trim()) return;
    setDetails([...details, newDetailInput.trim()]);
    setNewDetailInput('');
  };

  const handleRemoveDetail = (indexToRemove: number) => {
    setDetails(details.filter((_, idx) => idx !== indexToRemove));
  };

  // Image Slot Helpers (Up to 5 images)
  const updateImageSlot = (slotIdx: number, url: string) => {
    const updated = [...galleryImages];
    updated[slotIdx] = url;
    setGalleryImages(updated);
    if (slotIdx === 0) setImage(url);
    if (slotIdx === 1) setSecondaryImage(url);
  };

  const removeImageSlot = (slotIdx: number) => {
    const updated = [...galleryImages];
    updated[slotIdx] = '';
    setGalleryImages(updated);
    if (slotIdx === 0) setImage(updated.find(Boolean) || '');
    if (slotIdx === 1) setSecondaryImage('');
  };

  // Quick populate 5 angles for current category
  const handleAutoPopulateCategoryAngles = () => {
    const anglePresets: Record<string, string[]> = {
      Apparel: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800',
      ],
      Footwear: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
      ],
      'Audio & Tech': [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800',
      ],
      Accessories: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800',
      ],
      'Home & Living': [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
      ],
    };

    const set = anglePresets[category] || anglePresets['Apparel'];
    setGalleryImages([...set]);
    setImage(set[0]);
    setSecondaryImage(set[1] || '');
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!name.trim()) errors.push('Product title is required.');
    if (!price || price <= 0) errors.push('Valid retail price is required.');
    const primaryImg = galleryImages[0]?.trim() || image.trim();
    if (!primaryImg && galleryImages.filter(Boolean).length === 0) {
      errors.push('Primary hero image (Slot 1) is required.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      if (!name.trim()) {
        setActiveStep('basic');
      } else if (!price || price <= 0) {
        setActiveStep('pricing');
      }
      return;
    }

    // Process gallery images and upload any raw base64 data URIs
    const rawGallery = galleryImages.map((img) => img.trim()).filter(Boolean);
    const sanitizedGallery: string[] = [];

    for (let i = 0; i < rawGallery.length; i++) {
      const img = rawGallery[i];
      if (img.startsWith('data:')) {
        try {
          const uploadedUrl = await uploadProductImageServer(img, `${name.trim() || 'product'}_slot_${i + 1}`);
          sanitizedGallery.push(uploadedUrl || img);
        } catch {
          sanitizedGallery.push(img);
        }
      } else {
        sanitizedGallery.push(img);
      }
    }

    let primaryImg = sanitizedGallery[0] || image.trim();
    if (primaryImg.startsWith('data:')) {
      try {
        const uploadedHero = await uploadProductImageServer(primaryImg, `${name.trim() || 'product'}_hero`);
        primaryImg = uploadedHero || primaryImg;
      } catch {}
    }
    if (!primaryImg) {
      primaryImg = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';
    }

    let secondaryImg = sanitizedGallery[1] || secondaryImage.trim() || undefined;
    if (secondaryImg && secondaryImg.startsWith('data:')) {
      try {
        const uploadedSec = await uploadProductImageServer(secondaryImg, `${name.trim() || 'product'}_sec`);
        secondaryImg = uploadedSec || secondaryImg;
      } catch {}
    }

    const safeColors = colors.length > 0 ? colors : [
      { name: 'Onyx Black', hex: '#18181b' },
      { name: 'Off-White', hex: '#fafaf9' },
    ];

    const finalProduct: Product = {
      id: initialProduct ? initialProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      category: category || 'Apparel',
      price: Number(price) || 99,
      originalPrice: originalPrice && originalPrice > price ? Number(originalPrice) : undefined,
      deliveryCharges: deliveryCharges !== undefined && deliveryCharges > 0 ? Number(deliveryCharges) : 0,
      rating: initialProduct ? initialProduct.rating : 5.0,
      reviewCount: initialProduct ? initialProduct.reviewCount : 1,
      image: primaryImg,
      secondaryImage: secondaryImg,
      images: sanitizedGallery.length > 0 ? sanitizedGallery : [primaryImg],
      videoUrl: videoUrl.trim() || undefined,
      colors: safeColors,
      sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
      description: description.trim() || 'Premium handcrafted minimalist essential designed for longevity.',
      details: details.length > 0 ? details : ['Handcrafted premium essential.', 'Dry clean or cold wash.'],
      isNew: isNew ?? true,
      isBestseller: isBestseller ?? false,
      inStock: stockCount > 0 && inStock,
      stockCount: Number(stockCount ?? 10),
      sku: (sku.trim() || generateSku(category)).toUpperCase(),
    };

    onSave(finalProduct);
    onClose();
  };

  if (!isOpen) return null;

  // Margin Calculation
  const estimatedMarginPercent = costPerItem && price > costPerItem
    ? Math.round(((price - costPerItem) / price) * 100)
    : null;
  const estimatedProfit = costPerItem && price > costPerItem
    ? (price - costPerItem).toFixed(2)
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Bar Header */}
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                    {isEditing ? 'Edit Product Listing' : 'List New Product to Catalog'}
                  </h2>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                    isEditing
                      ? 'bg-blue-950 text-blue-400 border-blue-800'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}>
                    {isEditing ? 'Editing SKU' : 'New Listing'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Comprehensive listing form with image uploads, pricing, variants, and live preview.
                </p>
              </div>
            </div>

            {/* Quick Template Picker & Close */}
            <div className="flex items-center gap-2">
              {!isEditing && (
                <div className="relative group">
                  <button
                    type="button"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs rounded-xl border border-neutral-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Fill Template</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-64 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-xl p-2 hidden group-hover:block z-30 space-y-1">
                    <p className="text-[10px] text-neutral-400 px-2 py-1 font-semibold uppercase tracking-wider">
                      Select Luxury Preset:
                    </p>
                    {LISTING_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-neutral-800 text-xs text-neutral-200 flex items-center justify-between transition-colors"
                      >
                        <span className="font-medium truncate">{tmpl.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">${tmpl.data.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Step Navigation Tabs */}
          <div className="px-6 py-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setActiveStep('basic')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeStep === 'basic'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Basic Info & Media</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('pricing')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeStep === 'pricing'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>2. Pricing & Stock</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('variants')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeStep === 'variants'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>3. Colors & Sizes ({colors.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('specs')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeStep === 'specs'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <ListPlus className="w-3.5 h-3.5" />
              <span>4. Details & Specs ({details.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep('preview')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeStep === 'preview'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>5. Live Preview</span>
            </button>
          </div>

          {/* Validation Banner if errors */}
          {validationErrors.length > 0 && (
            <div className="mx-6 mt-4 p-3.5 bg-rose-950/80 border border-rose-800 rounded-2xl flex items-start gap-3 text-xs text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-white">Please resolve the following before saving:</p>
                <ul className="list-disc list-inside text-[11px] text-rose-300">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Form Content Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* STEP 1: BASIC INFO & MEDIA */}
            {activeStep === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Text inputs */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-neutral-300 font-bold text-xs mb-1.5">
                        Product Title <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Minimalist Cashmere Overshirt"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Use a descriptive, distinct title for storefront searchability.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-neutral-300 font-bold text-xs">
                            Department Category <span className="text-rose-400">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreateCategoryOpen((prev) => !prev);
                              setCategoryCreateError(null);
                            }}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                            title="Create a new department category for your product"
                          >
                            <FolderPlus className="w-3 h-3" />
                            <span>{isCreateCategoryOpen ? 'Close Category Form' : '+ Create Category'}</span>
                          </button>
                        </div>
                        <select
                          value={category}
                          onChange={(e) => {
                            if (e.target.value === '__CREATE_NEW_CATEGORY__') {
                              setIsCreateCategoryOpen(true);
                              return;
                            }
                            const newCat = e.target.value;
                            setCategory(newCat);
                            if (!isEditing) setSku(generateSku(newCat));
                          }}
                          className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          {categoriesList.filter((c) => c.id !== 'all').map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name} {cat.itemCount > 0 ? `(${cat.itemCount} items)` : ''}
                            </option>
                          ))}
                          <option value="__CREATE_NEW_CATEGORY__" className="text-amber-400 font-bold bg-neutral-900">
                            + Create New Category...
                          </option>
                        </select>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400">
                          <span className="truncate">Selected: <strong className="text-white font-medium">{category}</strong></span>
                          {!['Apparel', 'Footwear', 'Accessories', 'Home & Living', 'Audio & Tech'].includes(category) && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                              Custom Category
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-neutral-300 font-bold text-xs">
                            SKU Code <span className="text-rose-400">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setSku(generateSku(category))}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Auto-Gen</span>
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={sku}
                            onChange={(e) => setSku(e.target.value.toUpperCase())}
                            placeholder="e.g. AXE-APP-4821"
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-white text-xs font-mono uppercase focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(sku);
                              setCopySkuSuccess(true);
                              setTimeout(() => setCopySkuSuccess(false), 2000);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                            title="Copy SKU"
                          >
                            {copySkuSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* INLINE CREATE CATEGORY DRAWER / CARD */}
                    <AnimatePresence>
                      {isCreateCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.98 }}
                          animate={{ opacity: 1, height: 'auto', scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.98 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 sm:p-5 bg-neutral-900/95 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 shadow-xl space-y-4 relative">
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                  <FolderPlus className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <span>Create New Product Category</span>
                                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono">Storefront Ready</span>
                                  </h4>
                                  <p className="text-[11px] text-neutral-400">
                                    Define a new department category. It will automatically be selected for this product and added to catalog filters.
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsCreateCategoryOpen(false)}
                                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                                    Category Name <span className="text-rose-400">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Fine Jewelry, Fragrances, Eyewear, Watches..."
                                    value={newCatName}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNewCatName(val);
                                      setNewCatSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleCreateCategorySubmit();
                                      }
                                    }}
                                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                                    autoFocus
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                                    URL Slug &amp; SKU Preview
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="e.g. fine-jewelry"
                                      value={newCatSlug}
                                      onChange={(e) => setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 text-xs font-mono focus:outline-none focus:border-amber-400"
                                    />
                                    {newCatName.trim() && (
                                      <span className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-amber-400 whitespace-nowrap">
                                        SKU: AXE-{(newCatName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3) || 'ITM').toUpperCase()}-XXXX
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Category Imagery Presets & Custom URL */}
                              <div>
                                <label className="block text-[11px] font-bold text-neutral-300 mb-1.5">
                                  Department Cover Image (Select luxury preset or enter URL)
                                </label>
                                
                                {/* Presets Horizontal Scroll */}
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                                  {CATEGORY_IMAGE_PRESETS.slice(0, 5).map((preset) => (
                                    <button
                                      key={preset.label}
                                      type="button"
                                      onClick={() => setNewCatImage(preset.url)}
                                      className={`relative rounded-xl overflow-hidden border p-1 text-left group transition-all cursor-pointer ${
                                        newCatImage === preset.url
                                          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-neutral-800/80'
                                          : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
                                      }`}
                                    >
                                      <div className="w-full h-12 rounded-lg overflow-hidden relative">
                                        <img
                                          src={preset.url}
                                          alt={preset.label}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                          referrerPolicy="no-referrer"
                                        />
                                        {newCatImage === preset.url && (
                                          <div className="absolute inset-0 bg-amber-500/40 backdrop-blur-[1px] flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5 text-white drop-shadow font-bold" />
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-[9px] font-medium text-neutral-300 truncate mt-1">
                                        {preset.label}
                                      </p>
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="url"
                                    placeholder="Or paste custom image URL (https://...)"
                                    value={newCatImage}
                                    onChange={(e) => setNewCatImage(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                                  />
                                  {newCatImage && (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-neutral-700 shrink-0">
                                      <img
                                        src={newCatImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Description (Optional) */}
                              <div>
                                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                                  Department Bio / Description <span className="text-neutral-500">(Optional)</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Artisanal jewelry crafted from recycled 18k gold and sustainably sourced gemstones"
                                  value={newCatDescription}
                                  onChange={(e) => setNewCatDescription(e.target.value)}
                                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                                />
                              </div>
                            </div>

                            {/* Error & Success States */}
                            {categoryCreateError && (
                              <p className="text-xs text-rose-400 flex items-center gap-1.5 font-medium bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>{categoryCreateError}</span>
                              </p>
                            )}

                            {categoryCreateSuccess && (
                              <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                                <Check className="w-3.5 h-3.5 shrink-0" />
                                <span>{categoryCreateSuccess}</span>
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                              <button
                                type="button"
                                onClick={() => setIsCreateCategoryOpen(false)}
                                className="px-3.5 py-1.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCreateCategorySubmit()}
                                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save &amp; Apply Category</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Direct Price & Warehouse Inventory Section */}
                    <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pricing &amp; Warehouse Inventory</span>
                        </label>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          stockCount > 0 && inStock
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {stockCount > 0 && inStock ? `${stockCount} In Stock` : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-neutral-400 font-semibold text-[11px] mb-1">
                            Retail Price ($) <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">$</span>
                            <input
                              type="number"
                              min="1"
                              step="0.01"
                              required
                              value={price}
                              onChange={(e) => setPrice(Number(e.target.value))}
                              className="w-full pl-7 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-400 font-semibold text-[11px] mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Truck className="w-3 h-3 text-amber-400" />
                              <span>Delivery Fee ($)</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold">
                              {deliveryCharges === 0 ? 'FREE' : `$${deliveryCharges.toFixed(2)}`}
                            </span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={deliveryCharges}
                              onChange={(e) => setDeliveryCharges(Math.max(0, Number(e.target.value)))}
                              placeholder="0.00"
                              className="w-full pl-7 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-400 font-semibold text-[11px] mb-1">
                            Stock Quantity <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              required
                              value={stockCount}
                              onChange={(e) => {
                                const val = Math.max(0, Math.floor(Number(e.target.value) || 0));
                                setStockCount(val);
                                if (val === 0) setInStock(false);
                                else setInStock(true);
                              }}
                              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-400 font-semibold text-[11px] mb-1">
                            Listing Status
                          </label>
                          <button
                            type="button"
                            onClick={() => setInStock(!inStock)}
                            className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              inStock && stockCount > 0
                                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                                : 'bg-rose-950/60 border-rose-800 text-rose-400'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${inStock && stockCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                            <span>{inStock && stockCount > 0 ? 'Active (In Stock)' : 'Inactive / Out'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Quick Delivery Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                        <span className="text-neutral-500 font-medium">Delivery Presets:</span>
                        <button
                          type="button"
                          onClick={() => setDeliveryCharges(0)}
                          className={`px-2 py-0.5 rounded-lg border font-bold transition-all cursor-pointer ${
                            deliveryCharges === 0
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          Free Delivery ($0)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryCharges(5)}
                          className={`px-2 py-0.5 rounded-lg border font-bold transition-all cursor-pointer ${
                            deliveryCharges === 5
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          $5.00 Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryCharges(10)}
                          className={`px-2 py-0.5 rounded-lg border font-bold transition-all cursor-pointer ${
                            deliveryCharges === 10
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          $10.00 Express
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryCharges(15)}
                          className={`px-2 py-0.5 rounded-lg border font-bold transition-all cursor-pointer ${
                            deliveryCharges === 15
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          $15.00 Heavy
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-bold text-xs mb-1.5">
                        Product Description <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detailed narrative describing craftsmanship, fabric weave, cut, and aesthetic..."
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Col: Product Media Studio (Up to 5 Images Compulsory + Video Optional) */}
                  <div className="space-y-4 bg-neutral-950/80 p-4 sm:p-5 rounded-3xl border border-neutral-800/90 shadow-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-amber-400" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            Product Media Studio
                          </h3>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Up to 5 images (Compulsory) &bull; Video (Optional)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {galleryImages.filter(Boolean).length}/5 Images
                        </span>
                        <button
                          type="button"
                          onClick={handleAutoPopulateCategoryAngles}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold px-2 py-1 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
                          title="Fill all 5 slots with sample angle shots for this category"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>5 Angles</span>
                        </button>
                      </div>
                    </div>

                    {/* Media Type Sub-Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('images')}
                        className={`flex-1 py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                          activeMediaTab === 'images'
                            ? 'bg-amber-500 text-neutral-950 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>5 Images (Compulsory)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('video')}
                        className={`flex-1 py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                          activeMediaTab === 'video'
                            ? 'bg-amber-500 text-neutral-950 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Showcase Video (Optional)</span>
                        {videoUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      </button>
                    </div>

                    {/* TAB 1: 5 IMAGES (COMPULSORY) */}
                    {activeMediaTab === 'images' && (
                      <div className="space-y-4">
                        {/* 5-Slot Thumbnails Selector Strip */}
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { idx: 0, title: 'Hero / Front', tag: 'Slot 1 (Hero - Compulsory ⚠️)' },
                            { idx: 1, title: 'Angle 2 / Back', tag: 'Slot 2 (Back - Compulsory)' },
                            { idx: 2, title: 'Angle 3 / Side', tag: 'Slot 3 (Side - Compulsory)' },
                            { idx: 3, title: 'Detail / Texture', tag: 'Slot 4 (Detail - Compulsory)' },
                            { idx: 4, title: 'Lifestyle / Scale', tag: 'Slot 5 (Lifestyle - Compulsory)' },
                          ].map((slot) => {
                            const isSlotFilled = Boolean(galleryImages[slot.idx]);
                            const isSelected = activeImageSlot === slot.idx;

                            return (
                              <button
                                key={slot.idx}
                                type="button"
                                onClick={() => setActiveImageSlot(slot.idx)}
                                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center ${
                                  isSelected
                                    ? 'border-amber-400 ring-2 ring-amber-400/30 scale-102 bg-neutral-900'
                                    : isSlotFilled
                                    ? 'border-neutral-700 hover:border-neutral-500 bg-neutral-900'
                                    : 'border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
                                }`}
                              >
                                {isSlotFilled ? (
                                  <>
                                    <img
                                      src={galleryImages[slot.idx]}
                                      alt={slot.title}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    <span className="absolute bottom-0 inset-x-0 bg-neutral-950/80 text-[9px] font-mono text-center py-0.5 text-neutral-300 font-bold truncate px-0.5">
                                      #{slot.idx + 1} {slot.idx === 0 ? 'Hero' : ''}
                                    </span>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center justify-center p-1 text-center">
                                    <Plus className="w-4 h-4 text-neutral-500 mb-0.5" />
                                    <span className="text-[9px] font-bold text-neutral-400">#{slot.idx + 1}</span>
                                    {slot.idx === 0 && (
                                      <span className="text-[7px] text-rose-400 uppercase font-bold">Req</span>
                                    )}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Active Slot Configuration Header */}
                        <div className="p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 text-xs font-bold flex items-center justify-center font-mono">
                                {activeImageSlot + 1}
                              </span>
                              <span className="text-xs font-bold text-white">
                                {[
                                  'Slot 1: Primary Hero Image (Compulsory / Required)',
                                  'Slot 2: Secondary / Back View (Compulsory)',
                                  'Slot 3: Side Profile / Angle View (Compulsory)',
                                  'Slot 4: Detail Texture / Craftsmanship (Compulsory)',
                                  'Slot 5: Context / In-Use / Lifestyle (Compulsory)',
                                ][activeImageSlot]}
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              {activeImageSlot === 0
                                ? 'Main photo seen across catalog cards, search results, and hero banner.'
                                : 'Multi-angle perspective allowing customers to examine the product in detail.'}
                            </p>
                          </div>

                          {galleryImages[activeImageSlot] && (
                            <button
                              type="button"
                              onClick={() => removeImageSlot(activeImageSlot)}
                              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 bg-rose-950/30 rounded-lg border border-rose-900/50 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Clear Slot</span>
                            </button>
                          )}
                        </div>

                        {/* Image Uploader & URL Input for Active Slot */}
                        <ImageUploadInput
                          value={galleryImages[activeImageSlot] || ''}
                          onChange={(imgUrl) => updateImageSlot(activeImageSlot, imgUrl)}
                          label={`Upload or Paste URL for Image Slot #${activeImageSlot + 1}`}
                        />

                        {/* Active Slot Direct URL Quick Edit */}
                        <div>
                          <label className="block text-neutral-400 font-semibold text-[11px] mb-1">
                            Direct Image URL for Slot #{activeImageSlot + 1}:
                          </label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or upload above"
                            value={galleryImages[activeImageSlot] || ''}
                            onChange={(e) => updateImageSlot(activeImageSlot, e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>

                        <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-2 text-[11px] text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Compulsory Multi-Image Standard:</strong> Providing 5 multi-angle images boosts buyer confidence and reduces return inquiries by up to 45%.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: SHOWCASE VIDEO (OPTIONAL) */}
                    {activeMediaTab === 'video' && (
                      <div className="space-y-4">
                        <div className="p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-amber-400" />
                            <h4 className="text-xs font-bold text-white">
                              Product Showcase Video (Optional)
                            </h4>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Add a short product demonstration or runway video (MP4 file, YouTube video, or Vimeo link).
                          </p>
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold text-xs mb-1.5">
                            Video URL (MP4 / YouTube / Vimeo)
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              placeholder="https://example.com/demo.mp4 or https://youtube.com/watch?v=..."
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                              className="w-full pl-3 pr-20 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                            />
                            {videoUrl && (
                              <button
                                type="button"
                                onClick={() => setVideoUrl('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] text-neutral-400 hover:text-rose-400 font-bold bg-neutral-900 rounded-md border border-neutral-800"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Quick Sample Video Buttons */}
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-neutral-500 font-semibold">Test Sample:</span>
                          <button
                            type="button"
                            onClick={() => setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')}
                            className="px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 rounded-md border border-neutral-800 transition-colors"
                          >
                            Demo Showcase (MP4)
                          </button>
                        </div>

                        {/* Live Video Player Preview */}
                        <div className="space-y-1.5">
                          <label className="block text-neutral-400 font-semibold text-[11px]">
                            Live Video Player Preview:
                          </label>
                          {videoUrl.trim() ? (
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-md flex items-center justify-center">
                              {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                                <iframe
                                  src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                  title="Product Video Preview"
                                  className="w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              ) : videoUrl.includes('vimeo.com') ? (
                                <iframe
                                  src={videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                                  title="Product Video Preview"
                                  className="w-full h-full border-0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowFullScreen
                                />
                              ) : (
                                <video
                                  src={videoUrl}
                                  controls
                                  className="w-full h-full object-contain"
                                  playsInline
                                />
                              )}
                            </div>
                          ) : (
                            <div className="aspect-video rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 flex flex-col items-center justify-center p-4 text-center">
                              <Film className="w-8 h-8 text-neutral-600 mb-2" />
                              <p className="text-xs font-semibold text-neutral-400">
                                No showcase video linked yet
                              </p>
                              <p className="text-[10px] text-neutral-500 max-w-xs mt-1">
                                Video is optional. When added, an interactive play button appears on the customer product page.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PRICING & INVENTORY */}
            {activeStep === 'pricing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Retail Price */}
                  <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-2">
                    <label className="block text-neutral-300 font-bold text-xs">
                      Retail Selling Price ($ USD) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500">Customer checkout price.</p>
                  </div>

                  {/* Delivery Charges (Shipping Fee) */}
                  <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-2">
                    <label className="block text-neutral-300 font-bold text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Delivery Charges</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {deliveryCharges === 0 ? 'FREE' : `$${deliveryCharges.toFixed(2)}`}
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={deliveryCharges}
                        onChange={(e) => setDeliveryCharges(Math.max(0, Number(e.target.value)))}
                        placeholder="0.00 (0 for Free)"
                        className="w-full pl-7 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      {deliveryCharges === 0 ? 'Free delivery on this product.' : 'Applied at checkout.'}
                    </p>
                  </div>

                  {/* Compare-at / Original Price */}
                  <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-2">
                    <label className="block text-neutral-300 font-bold text-xs">
                      Compare-at Price ($ USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={originalPrice || ''}
                        onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Leave blank if not on sale"
                        className="w-full pl-7 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    {originalPrice && originalPrice > price && (
                      <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        <span>{Math.round(((originalPrice - price) / originalPrice) * 100)}% Discount Badge</span>
                      </p>
                    )}
                  </div>

                  {/* Cost per Item (Internal Margin Estimator) */}
                  <div className="bg-neutral-950 p-4 rounded-3xl border border-neutral-800 space-y-2">
                    <label className="block text-neutral-300 font-bold text-xs">
                      Cost per Item (Private)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={costPerItem || ''}
                        onChange={(e) => setCostPerItem(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 45"
                        className="w-full pl-7 pr-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    {estimatedMarginPercent !== null && (
                      <p className="text-[10px] text-amber-400 font-bold">
                        Est. Margin: {estimatedMarginPercent}% (${estimatedProfit} profit)
                      </p>
                    )}
                  </div>
                </div>

                {/* Stock & Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Stock Quantity */}
                  <div className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-400" />
                      <span>Stock &amp; Inventory Management</span>
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-neutral-400 font-semibold text-xs mb-1">
                          Available Units in Warehouse <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={stockCount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setStockCount(val);
                            if (val === 0) setInStock(false);
                            else setInStock(true);
                          }}
                          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
                        <div>
                          <p className="text-xs font-bold text-white">In-Stock Listing Status</p>
                          <p className="text-[10px] text-neutral-400">Allow customers to add item to bag</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setInStock(!inStock)}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            inStock && stockCount > 0 ? 'bg-emerald-500' : 'bg-neutral-800'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-neutral-950 rounded-full transition-transform ${
                              inStock && stockCount > 0 ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Highlights & Badges */}
                  <div className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Storefront Promotion Badges</span>
                    </h4>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
                        <div>
                          <p className="text-xs font-bold text-white">Mark as &quot;New Arrival&quot;</p>
                          <p className="text-[10px] text-neutral-400">Shows gold &quot;New Arrival&quot; pill badge</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsNew(!isNew)}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            isNew ? 'bg-amber-500' : 'bg-neutral-800'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-neutral-950 rounded-full transition-transform ${
                              isNew ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
                        <div>
                          <p className="text-xs font-bold text-white">Mark as &quot;Bestseller&quot;</p>
                          <p className="text-[10px] text-neutral-400">Boosts position and shows popularity badge</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsBestseller(!isBestseller)}
                          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            isBestseller ? 'bg-amber-500' : 'bg-neutral-800'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-neutral-950 rounded-full transition-transform ${
                              isBestseller ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: VARIANTS (COLORS & SIZES) */}
            {activeStep === 'variants' && (
              <div className="space-y-6">
                {/* Colors Section */}
                <div className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Palette className="w-4 h-4 text-amber-400" />
                        <span>Color Options &amp; Swatches ({colors.length})</span>
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Click preset swatches or create custom bespoke color hex codes.
                      </p>
                    </div>
                  </div>

                  {/* Active Selected Colors */}
                  <div className="flex flex-wrap items-center gap-2.5 p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800">
                    {colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-950 rounded-xl border border-neutral-700 text-xs shadow-sm"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-neutral-600 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-bold text-white">{color.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{color.hex}</span>
                        {colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(idx)}
                            className="text-neutral-500 hover:text-rose-400 ml-1"
                            title="Remove Color"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Presets Palette Quick-Click */}
                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Curated Palette Presets:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {PRESET_COLOR_SWATCHES.map((swatch) => {
                        const isSelected = colors.some(
                          (c) => c.name.toLowerCase() === swatch.name.toLowerCase()
                        );
                        return (
                          <button
                            key={swatch.name}
                            type="button"
                            onClick={() => handleTogglePresetColor(swatch)}
                            className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-neutral-600 shrink-0"
                              style={{ backgroundColor: swatch.hex }}
                            />
                            <span className="text-[11px] font-medium truncate">{swatch.name}</span>
                            {isSelected && <Check className="w-3 h-3 text-amber-400 ml-auto shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Custom Color Row */}
                  <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="w-10 h-9 p-0.5 bg-neutral-900 border border-neutral-700 rounded-xl cursor-pointer"
                      title="Pick custom color"
                    />
                    <input
                      type="text"
                      placeholder="Custom Color Name (e.g. Midnight Teal)"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      disabled={!customColorName.trim()}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Color</span>
                    </button>
                  </div>
                </div>

                {/* Sizes Section */}
                <div className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-amber-400" />
                      <span>Size &amp; Fit Options</span>
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Toggle active size selections or add custom measurements.
                    </p>
                  </div>

                  {/* Standard Category Quick-Presets */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                        Apparel Sizes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {STANDARD_APPAREL_SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleToggleSize(s)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                              sizes.includes(s)
                                ? 'bg-amber-500 text-neutral-950 border-amber-500'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                        Footwear Sizes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {STANDARD_FOOTWEAR_SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleToggleSize(s)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                              sizes.includes(s)
                                ? 'bg-amber-500 text-neutral-950 border-amber-500'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                        Tech &amp; Home Sizes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {STANDARD_TECH_HOME_SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleToggleSize(s)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                              sizes.includes(s)
                                ? 'bg-amber-500 text-neutral-950 border-amber-500'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add Custom Size */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Custom Size (e.g. 42mm, 50ml, Queen)"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSize}
                      disabled={!customSizeInput.trim()}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Size</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DETAILS & SPECS */}
            {activeStep === 'specs' && (
              <div className="space-y-6">
                <div className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <ListPlus className="w-4 h-4 text-amber-400" />
                        <span>Key Specifications &amp; Feature Highlights</span>
                      </h3>
                      <p className="text-[11px] text-neutral-400">
                        Rendered as clean bullet points in the product modal and quick view drawer.
                      </p>
                    </div>
                  </div>

                  {/* Add Detail Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add feature bullet point (e.g. 100% GOTS Organic Cotton)..."
                      value={newDetailInput}
                      onChange={(e) => setNewDetailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDetail();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddDetail}
                      disabled={!newDetailInput.trim()}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Spec</span>
                    </button>
                  </div>

                  {/* List of Details */}
                  <div className="space-y-2">
                    {details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-neutral-200 font-medium truncate">{detail}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDetail(idx)}
                          className="p-1 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
                          title="Remove feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search Keywords / SEO */}
                <div className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>Search Discovery Tags (SEO)</span>
                  </h4>
                  <input
                    type="text"
                    value={searchTags}
                    onChange={(e) => setSearchTags(e.target.value)}
                    placeholder="e.g. minimalist, organic, oversized, winter 2026"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Comma-separated keywords matching customer search queries.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: LIVE STOREFRONT PREVIEW */}
            {activeStep === 'preview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Storefront Card Simulation */}
                  <div className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Storefront Product Card Preview
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                        Live Simulation
                      </span>
                    </div>

                    <div className="max-w-xs mx-auto bg-stone-100 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xl text-neutral-900 dark:text-white p-3 space-y-3">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-800">
                        <img
                          src={image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'}
                          alt={name || 'Product'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isNew && (
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-amber-500 text-neutral-950 text-[10px] font-bold uppercase rounded-full shadow">
                            New
                          </span>
                        )}
                        {originalPrice && originalPrice > price && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold uppercase rounded-full shadow">
                            Sale
                          </span>
                        )}
                        {videoUrl && (
                          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-neutral-900/90 text-amber-300 text-[10px] font-bold uppercase rounded-full shadow border border-neutral-700 flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-amber-300" />
                            <span>Video</span>
                          </span>
                        )}
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-neutral-900/90 text-neutral-300 text-[10px] font-mono font-bold rounded-full shadow border border-neutral-700">
                          {galleryImages.filter(Boolean).length}/5 Photos
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500">
                          <span>{category}</span>
                          <span className="font-mono text-[10px]">{sku || 'SKU-0000'}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm truncate">{name || 'Minimalist Product Title'}</h4>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="font-mono font-bold text-base text-neutral-900 dark:text-white">
                            ${price}
                          </span>
                          {originalPrice && originalPrice > price && (
                            <span className="font-mono text-xs text-neutral-400 line-through">
                              ${originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Color swatches preview */}
                        <div className="flex items-center gap-1 pt-2">
                          {colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-3 h-3 rounded-full border border-neutral-600"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-200 dark:border-neutral-800 flex items-center gap-2">
                        <div className="flex-1 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-center text-[11px] font-bold uppercase tracking-wider rounded-xl">
                          Buy Now
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Checklist */}
                  <div className="bg-neutral-950 p-5 rounded-3xl border border-neutral-800 space-y-4 text-xs">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Listing Summary &amp; Verification
                    </h3>

                    <div className="space-y-3">
                      <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
                        <p className="text-neutral-400 text-[11px]">Pricing &amp; Delivery Economics</p>
                        <p className="font-bold text-white text-sm font-mono">
                          ${price} USD {originalPrice && `(Was $${originalPrice})`}
                        </p>
                        <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Truck className="w-3 h-3 text-amber-400" />
                          <span>Delivery Charges: <strong>{deliveryCharges === 0 ? 'FREE DELIVERY ($0.00)' : `$${deliveryCharges.toFixed(2)} USD`}</strong></span>
                        </p>
                        {estimatedMarginPercent !== null && (
                          <p className="text-[11px] text-amber-400">
                            Profit Margin: <strong>{estimatedMarginPercent}%</strong> (${estimatedProfit}/item)
                          </p>
                        )}
                      </div>

                      <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
                        <p className="text-neutral-400 text-[11px]">Inventory &amp; SKU</p>
                        <p className="font-bold text-white">
                          {stockCount} Units in Stock • SKU: <span className="font-mono text-amber-400">{sku}</span>
                        </p>
                      </div>

                      <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
                        <p className="text-neutral-400 text-[11px]">Variants Configured</p>
                        <p className="text-white">
                          <strong>{colors.length}</strong> Colors ({colors.map(c => c.name).join(', ')})
                        </p>
                        {sizes.length > 0 && (
                          <p className="text-white">
                            <strong>{sizes.length}</strong> Sizes ({sizes.join(', ')})
                          </p>
                        )}
                      </div>

                      <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
                        <p className="text-neutral-400 text-[11px]">Media Studio Configuration</p>
                        <p className="text-white font-bold">
                          {galleryImages.filter(Boolean).length} of 5 Compulsory Photo Slots Filled
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          {videoUrl ? '• 1 Showcase Video Attached' : '• Video optional (not set)'}
                        </p>
                      </div>

                      <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
                        <p className="text-neutral-400 text-[11px]">Feature Specifications</p>
                        <p className="text-neutral-300">
                          {details.length} verified bullet points attached.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Bottom Footer Actions */}
          <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white font-bold text-xs rounded-xl transition-colors"
              >
                Reset Fields
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeStep !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 'pricing') setActiveStep('basic');
                    else if (activeStep === 'variants') setActiveStep('pricing');
                    else if (activeStep === 'specs') setActiveStep('variants');
                    else if (activeStep === 'preview') setActiveStep('specs');
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}

              {activeStep !== 'preview' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 'basic') setActiveStep('pricing');
                    else if (activeStep === 'pricing') setActiveStep('variants');
                    else if (activeStep === 'variants') setActiveStep('specs');
                    else if (activeStep === 'specs') setActiveStep('preview');
                  }}
                  className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 fill-neutral-950" />
                <span>{isEditing ? 'Save Changes' : 'Publish Product to Store'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
