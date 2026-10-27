import React, { useState } from 'react';
import { MarketplaceItem, User } from '../types';
import {
  ShoppingBag,
  Search,
  Filter,
  PlusCircle,
  Tag,
  MapPin,
  CheckCircle2,
  CreditCard,
  X,
  MessageSquare,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface MarketplaceViewProps {
  items: MarketplaceItem[];
  currentUser: User;
  onContactSeller: (seller: User) => void;
  onAddItem: (item: Partial<MarketplaceItem>) => void;
  onViewProfile: (user: User) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items,
  currentUser,
  onContactSeller,
  onAddItem,
  onViewProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showListItemModal, setShowListItemModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'payfast' | 'paypal' | 'bank'>('payfast');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // New item form state
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Cameras & Optics');
  const [newItemCondition, setNewItemCondition] = useState('Like New');
  const [newItemDescription, setNewItemDescription] = useState('');

  const categories = [
    'All',
    'Cameras & Optics',
    'Handmade Accessories',
    'Tech & Electronics',
    'Art & Creative',
    'Audio Gear',
  ];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setShowCheckoutModal(false);
      setSelectedItem(null);
    }, 2000);
  };

  const handleListItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !newItemPrice) return;

    onAddItem({
      title: newItemTitle.trim(),
      price: parseFloat(newItemPrice) || 50,
      currency: 'USD',
      category: newItemCategory,
      location: currentUser.location || 'Global Delivery',
      image: '/src/assets/images/usworld_market_camera_1793123387074.jpg',
      condition: newItemCondition,
      description: newItemDescription || 'Authentic verified listing on UsWorld Social.',
      inStock: true,
      seller: currentUser,
    });

    setNewItemTitle('');
    setNewItemPrice('');
    setNewItemDescription('');
    setShowListItemModal(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Marketplace Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            UsWorld Commerce & Peer-to-Peer
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight mt-1">
            Creator Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Buy and sell cameras, artisanal handmade goods, and audio gear directly with fellow creators.
            Zero middleman markup, instant escrow protection.
          </p>
        </div>

        <button
          onClick={() => setShowListItemModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Item for Sale</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search products, gear, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            {/* Image Preview */}
            <div
              onClick={() => setSelectedItem(item)}
              className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                {item.condition}
              </span>
            </div>

            {/* Details */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {item.category}
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    ${item.price.toLocaleString()} {item.currency}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedItem(item)}
                  className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              {/* Seller & Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onViewProfile(item.seller)}
                  className="flex items-center gap-2 text-left group/seller"
                >
                  <img
                    src={item.seller.avatar}
                    alt={item.seller.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium group-hover/seller:underline truncate max-w-[120px]">
                    {item.seller.name}
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onContactSeller(item.seller)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Message Seller"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowCheckoutModal(true);
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Details Lightbox Modal */}
      {selectedItem && !showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 aspect-square md:aspect-auto bg-slate-100 dark:bg-slate-800 relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedItem.category}
                  </span>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {selectedItem.title}
                </h2>

                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  ${selectedItem.price.toLocaleString()} {selectedItem.currency}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedItem.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>Condition: {selectedItem.condition}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedItem.seller.avatar}
                      alt={selectedItem.seller.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {selectedItem.seller.name}
                      </p>
                      <p className="text-[10px] text-slate-400">Verified Seller</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onContactSeller(selectedItem.seller);
                      setSelectedItem(null);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Contact
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal (PayFast, PayPal, Bank Account) */}
      {showCheckoutModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base font-display flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>UsWorld Secure Checkout</span>
              </h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {purchaseSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Confirmed!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Receipt and shipping details dispatched to your verified email. Seller has been notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 my-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <p className="text-xs text-slate-400">Order Summary</p>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {selectedItem.title}
                  </p>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    ${selectedItem.price.toLocaleString()} {selectedItem.currency}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('payfast')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'payfast'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <p className="text-xs">PayFast</p>
                      <span className="text-[10px] text-slate-400">South Africa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <p className="text-xs">PayPal</p>
                      <span className="text-[10px] text-slate-400">Global</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'bank'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <p className="text-xs">Bank EFT</p>
                      <span className="text-[10px] text-slate-400">Direct Wire</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/30">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>UsWorld Escrow Guarantee: Funds released only after delivery confirmation.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
                >
                  Confirm & Pay ${selectedItem.price.toLocaleString()} via{' '}
                  {paymentMethod === 'payfast' ? 'PayFast' : paymentMethod === 'paypal' ? 'PayPal' : 'Bank EFT'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* List an Item for Sale Modal */}
      {showListItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base font-display">List an Item on Marketplace</h3>
              <button
                onClick={() => setShowListItemModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleListItemSubmit} className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vintage 35mm Rangefinder Camera"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="350"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Condition
                  </label>
                  <select
                    value={newItemCondition}
                    onChange={(e) => setNewItemCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option>Brand New (Handmade)</option>
                    <option>Like New (Mint)</option>
                    <option>Excellent</option>
                    <option>Good</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option>Cameras & Optics</option>
                  <option>Handmade Accessories</option>
                  <option>Tech & Electronics</option>
                  <option>Audio Gear</option>
                  <option>Art & Creative</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail condition, included accessories, and shipping specifics..."
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-colors"
              >
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
