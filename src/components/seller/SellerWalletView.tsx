import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  ArrowUpRight,
  ArrowRight,
  ArrowDownLeft,
  Coins,
  Smartphone,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Download,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Copy,
  Receipt,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Globe,
} from 'lucide-react';
import { SellerWallet, WithdrawalRequest, WalletTransaction } from '../../types';
import { fetchSellerWallet, triggerTestPaymentCredit } from '../../lib/walletApi';
import { WithdrawModal } from './WithdrawModal';

interface SellerWalletViewProps {
  onAddSecurityLog?: (action: string, category: string, severity: 'info' | 'warning' | 'critical') => void;
}

const USD_TO_PKR = 280.0;

export const SellerWalletView: React.FC<SellerWalletViewProps> = ({ onAddSecurityLog }) => {
  const [wallet, setWallet] = useState<SellerWallet>({
    availableBalance: 0.00,
    pendingBalance: 0.00,
    totalEarnings: 0.00,
    totalWithdrawn: 0.00,
    currency: 'USD',
    updatedAt: new Date().toISOString(),
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(USD_TO_PKR);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState<boolean>(false);

  // Filters & Search
  const [activeLedgerTab, setActiveLedgerTab] = useState<'all' | 'credits' | 'withdrawals'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTxnForReceipt, setSelectedTxnForReceipt] = useState<WalletTransaction | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadWalletData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await fetchSellerWallet();
      if (data.success && data.wallet) {
        setWallet(data.wallet);
        if (data.withdrawals) setWithdrawals(data.withdrawals);
        if (data.transactions) setTransactions(data.transactions);
        if (data.exchangeRatePkr) setExchangeRate(data.exchangeRatePkr);
      }
    } catch (err) {
      console.warn('Wallet load error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleWithdrawSuccess = (newWd: WithdrawalRequest, newBal: number) => {
    setWallet((prev) => ({
      ...prev,
      availableBalance: newBal,
      totalWithdrawn: Number((prev.totalWithdrawn + newWd.amount).toFixed(2)),
      lastPayoutDate: newWd.timestamp,
      lastPayoutAmount: newWd.amount,
      lastPayoutMethod: newWd.method,
    }));
    setWithdrawals((prev) => [newWd, ...prev]);

    const newTxn: WalletTransaction = {
      id: `TXN-WD-${Date.now()}`,
      referenceId: newWd.referenceId,
      type: newWd.method === 'payoneer'
        ? 'WITHDRAWAL_PAYONEER'
        : newWd.method === 'easypaisa' 
        ? 'WITHDRAWAL_EASYPAISA' 
        : 'WITHDRAWAL_JAZZCASH',
      direction: 'debit',
      amount: newWd.amount,
      currency: 'USD',
      status: 'Completed',
      description: newWd.method === 'payoneer'
        ? `Withdrawal of $${newWd.amount.toFixed(2)} USD to Payoneer Account (${newWd.payoneerEmail || 'axe426622@gmail.com'}) for Visa/Mastercard cashout`
        : newWd.method === 'easypaisa'
        ? `Withdrawal of $${newWd.amount.toFixed(2)} USD (Rs. ${newWd.amountPkr?.toLocaleString()} PKR) to Easypaisa (${newWd.easypaisaPhone})`
        : `Withdrawal of $${newWd.amount.toFixed(2)} USD (Rs. ${newWd.amountPkr?.toLocaleString()} PKR) to JazzCash (${newWd.jazzcashPhone})`,
      withdrawalId: newWd.id,
      recipient: newWd.method === 'payoneer'
        ? `Payoneer: ${newWd.payoneerEmail || 'axe426622@gmail.com'}`
        : newWd.method === 'easypaisa'
        ? newWd.easypaisaPhone
        : newWd.jazzcashPhone,
      timestamp: newWd.timestamp,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    if (onAddSecurityLog) {
      onAddSecurityLog(
        `Seller Central Payout Processed: $${newWd.amount.toFixed(2)} USD via ${newWd.method.toUpperCase()} [Ref: ${newWd.referenceId}]`,
        'Order',
        'info'
      );
    }
  };

  const handleSimulateReceivePayment = async () => {
    setIsSimulatingPayment(true);
    try {
      const randomOrderAmount = Math.floor(180 + Math.random() * 300);
      const res = await triggerTestPaymentCredit(randomOrderAmount);
      if (res.wallet) {
        setWallet(res.wallet);
        if (res.transactions) setTransactions(res.transactions);
      }
      if (onAddSecurityLog) {
        onAddSecurityLog(
          `Customer Payment Received into Wallet: +$${randomOrderAmount}.00 USD (Payoneer Card Checkout Settlement)`,
          'Order',
          'info'
        );
      }
      await loadWalletData(true);
    } catch (err) {
      console.warn('Simulation error:', err);
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (activeLedgerTab === 'credits' && t.direction !== 'credit') return false;
    if (activeLedgerTab === 'withdrawals' && t.direction !== 'debit') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchRef = t.referenceId?.toLowerCase().includes(q);
      const matchRec = t.recipient?.toLowerCase().includes(q);
      return matchDesc || matchRef || matchRec;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-white tracking-tight">Seller Central Wallet</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Ledger
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Receive incoming payments from customer orders & cash out instantly to Payoneer (Visa/Mastercard) or Pakistani Mobile Accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Balance */}
          <button
            onClick={() => loadWalletData(true)}
            disabled={isRefreshing}
            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh latest balance"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Simulate Payment Test */}
          <button
            onClick={handleSimulateReceivePayment}
            disabled={isSimulatingPayment}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Test receiving a new customer checkout payment directly into wallet"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSimulatingPayment ? 'Crediting...' : 'Test Receive Customer Payment'}</span>
          </button>

          {/* Primary Withdraw CTA */}
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw Funds</span>
          </button>
        </div>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Balance */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-amber-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-mono text-3xl font-extrabold text-white tracking-tight">
              ${wallet.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-sans text-neutral-400 font-normal ml-1">USD</span>
            </p>
            <p className="font-mono text-xs font-semibold text-emerald-400 mt-1">
              ≈ Rs. {Math.round(wallet.availableBalance * exchangeRate).toLocaleString()} PKR
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Instant Payout Ready
            </span>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Cashout</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Pending Clearance / Escrow */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Pending Clearance</span>
            <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-mono text-3xl font-extrabold text-neutral-200 tracking-tight">
              ${wallet.pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-sans text-neutral-400 font-normal ml-1">USD</span>
            </p>
            <p className="font-mono text-xs font-semibold text-neutral-400 mt-1">
              ≈ Rs. {Math.round(wallet.pendingBalance * exchangeRate).toLocaleString()} PKR
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800">
            <p className="text-[11px] text-neutral-400">
              Auto-settles upon delivery confirmation
            </p>
          </div>
        </div>

        {/* Card 3: Total Received Customer Payments */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Customer Payments</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-mono text-3xl font-extrabold text-emerald-400 tracking-tight">
              ${wallet.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-sans text-neutral-400 font-normal ml-1">USD</span>
            </p>
            <p className="font-mono text-xs font-semibold text-neutral-400 mt-1">
              Lifetime Storefront Revenue
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800">
            <p className="text-[11px] text-neutral-400">
              Received directly from customer purchases
            </p>
          </div>
        </div>

        {/* Card 4: Total Withdrawn */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Withdrawn</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-mono text-3xl font-extrabold text-white tracking-tight">
              ${wallet.totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-sans text-neutral-400 font-normal ml-1">USD</span>
            </p>
            <p className="font-mono text-xs font-semibold text-neutral-400 mt-1">
              ≈ Rs. {Math.round(wallet.totalWithdrawn * exchangeRate).toLocaleString()} PKR
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800">
            <p className="text-[11px] text-neutral-400">
              {wallet.lastPayoutDate ? `Last payout: ${new Date(wallet.lastPayoutDate).toLocaleDateString()}` : 'Cashed out to Payoneer & Easypaisa'}
            </p>
          </div>
        </div>
      </div>

      {/* Three Payout Channels Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Channel 1: Easypaisa Pakistan */}
        <div className="bg-neutral-900/80 border border-emerald-500/20 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm">Easypaisa</h3>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded-full">0% FEE</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">Telenor Microfinance Bank (PKR)</p>
              </div>
            </div>

            <div className="mt-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3 space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Number:</span>
                <span className="text-white font-bold">03157338694</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Title:</span>
                <span className="text-white font-bold">Gauhar Axe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Rate:</span>
                <span className="text-emerald-400 font-bold">$1 = Rs. 280 PKR</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">&lt; 5 mins settlement</span>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Withdraw</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Channel 2: JazzCash Pakistan */}
        <div className="bg-neutral-900/80 border border-rose-500/20 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm">JazzCash</h3>
                  <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 text-[9px] font-bold rounded-full">0% FEE</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">Mobilink Microfinance Bank (PKR)</p>
              </div>
            </div>

            <div className="mt-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3 space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Number:</span>
                <span className="text-white font-bold">03157338694</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Title:</span>
                <span className="text-white font-bold">Gauhar Axe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Rate:</span>
                <span className="text-rose-400 font-bold">$1 = Rs. 280 PKR</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">Instant TID clearing</span>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Withdraw</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Channel 3: Payoneer (Visa & Mastercard) */}
        <div className="bg-neutral-900/80 border border-amber-500/20 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm">Payoneer Account</h3>
                  <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-bold rounded-full">VISA / MC</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">International Debit/Credit Cards</p>
              </div>
            </div>

            <div className="mt-3.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3 space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Payoneer ID:</span>
                <span className="text-amber-400 font-bold truncate max-w-[140px]">axe426622@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Payout Fee:</span>
                <span className="text-emerald-400 font-bold">Free ($0.00 USD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-sans text-[11px]">Settlement:</span>
                <span className="text-neutral-300">USD &bull; Visa / Mastercard</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">Direct USD cashout</span>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Withdraw</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions & Ledger Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Wallet Financial Ledger</h3>
            <p className="text-xs text-neutral-400">
              Real-time audit log of customer payments received and withdrawals
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 w-44 sm:w-56"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-xl text-xs">
              <button
                onClick={() => setActiveLedgerTab('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeLedgerTab === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveLedgerTab('credits')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeLedgerTab === 'credits' ? 'bg-emerald-500/20 text-emerald-300' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Payments In
              </button>
              <button
                onClick={() => setActiveLedgerTab('withdrawals')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeLedgerTab === 'withdrawals' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Withdrawals
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="p-3.5">Type & Reference</th>
                  <th className="p-3.5">Description / Source</th>
                  <th className="p-3.5">Destination / Account</th>
                  <th className="p-3.5">Amount (USD)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-500">
                      No wallet transactions recorded yet. Click "Test Receive Customer Payment" or place an order to see live credits!
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => {
                    const isCredit = txn.direction === 'credit';
                    return (
                      <tr key={txn.id} className="hover:bg-neutral-950/50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{isCredit ? 'Customer Payment' : 'Withdrawal'}</p>
                              <p className="text-[10px] font-mono text-neutral-400">{txn.referenceId || txn.id.slice(0, 16)}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-neutral-300 max-w-xs truncate">
                          {txn.description}
                        </td>

                        <td className="p-3.5 font-mono text-neutral-400 text-[11px]">
                          {txn.recipient || (isCredit ? 'Storefront Wallet' : 'External Account')}
                        </td>

                        <td className="p-3.5 font-mono">
                          <span className={`font-bold text-sm ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isCredit ? '+' : '-'}${txn.amount.toFixed(2)}
                          </span>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            {txn.details?.amountPkr ? `Rs. ${Number(txn.details.amountPkr).toLocaleString()} PKR` : `≈ Rs. ${Math.round(txn.amount * exchangeRate).toLocaleString()} PKR`}
                          </p>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {txn.status || 'Completed'}
                          </span>
                        </td>

                        <td className="p-3.5 text-right font-mono text-[11px] text-neutral-400">
                          {txn.timestamp ? new Date(txn.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Just now'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Modal */}
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          availableBalance={wallet.availableBalance}
          onWithdrawSuccess={handleWithdrawSuccess}
        />
      </div>
    </div>
  );
};
