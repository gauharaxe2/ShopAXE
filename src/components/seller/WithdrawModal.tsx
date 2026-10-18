import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Wallet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Coins,
  Smartphone,
  CreditCard,
  Info,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { WithdrawalMethod, WithdrawalRequest } from '../../types';
import { submitSellerWithdrawal, WithdrawPayload } from '../../lib/walletApi';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onWithdrawSuccess: (withdrawal: WithdrawalRequest, newBalance: number) => void;
}

const USD_TO_PKR_RATE = 280.0;

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onWithdrawSuccess,
}) => {
  const [method, setMethod] = useState<WithdrawalMethod>('easypaisa');
  const [amountInput, setAmountInput] = useState<string>('100');
  
  // Payoneer fields
  const [payoneerEmail, setPayoneerEmail] = useState<string>('axe426622@gmail.com');
  const [payoneerAccountTitle, setPayoneerAccountTitle] = useState<string>('Muhammad Gohar Nadeem');
  const [payoneerCustomerId, setPayoneerCustomerId] = useState<string>('');
  
  // Easypaisa fields
  const [easypaisaPhone, setEasypaisaPhone] = useState<string>('03157338694');
  const [easypaisaTitle, setEasypaisaTitle] = useState<string>('Gauhar Axe');
  const [easypaisaCnic, setEasypaisaCnic] = useState<string>('');

  // JazzCash fields
  const [jazzcashPhone, setJazzcashPhone] = useState<string>('03157338694');
  const [jazzcashTitle, setJazzcashTitle] = useState<string>('Gauhar Axe');
  const [jazzcashCnic, setJazzcashCnic] = useState<string>('');
  const [note, setNote] = useState<string>('Seller profit withdrawal');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedWithdrawal, setCompletedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const numAmount = parseFloat(amountInput) || 0;
  const networkFee: number = 0; // 0% platform fee on all payouts
  const netAmountUsd = Math.max(0, numAmount - networkFee);
  const amountPkr = Math.round(netAmountUsd * USD_TO_PKR_RATE);

  const isAmountValid = numAmount > 0 && numAmount <= availableBalance;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePresetAmount = (val: number | 'max') => {
    if (val === 'max') {
      setAmountInput(availableBalance.toFixed(2));
    } else {
      setAmountInput(Math.min(val, availableBalance).toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numAmount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount.');
      return;
    }

    if (numAmount > availableBalance) {
      setErrorMessage(`Insufficient funds. Your available balance is $${availableBalance.toFixed(2)} USD.`);
      return;
    }

    if (method === 'payoneer') {
      if (!payoneerEmail.trim() || !payoneerEmail.includes('@')) {
        setErrorMessage('Please provide a valid registered Payoneer email address.');
        return;
      }
      if (!payoneerAccountTitle.trim()) {
        setErrorMessage('Beneficiary Name (Account Title registered on Payoneer) is required.');
        return;
      }
    } else if (method === 'easypaisa') {
      const cleanPhone = easypaisaPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 12) {
        setErrorMessage('Please enter a valid 11-digit Pakistani Easypaisa mobile number (e.g. 03157338694).');
        return;
      }
      if (!easypaisaTitle.trim()) {
        setErrorMessage('Account Title (Beneficiary Name registered on Easypaisa) is required.');
        return;
      }
    } else if (method === 'jazzcash') {
      const cleanPhone = jazzcashPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 12) {
        setErrorMessage('Please enter a valid 11-digit Pakistani JazzCash mobile number (e.g. 03157338694).');
        return;
      }
      if (!jazzcashTitle.trim()) {
        setErrorMessage('Account Title (Beneficiary Name registered on JazzCash) is required.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: WithdrawPayload = {
        amount: numAmount,
        method,
        payoneerEmail: method === 'payoneer' ? payoneerEmail.trim() : undefined,
        payoneerAccountTitle: method === 'payoneer' ? payoneerAccountTitle.trim() : undefined,
        payoneerCustomerId: method === 'payoneer' && payoneerCustomerId.trim() ? payoneerCustomerId.trim() : undefined,
        easypaisaPhone: method === 'easypaisa' ? easypaisaPhone.trim() : undefined,
        easypaisaTitle: method === 'easypaisa' ? easypaisaTitle.trim() : undefined,
        easypaisaCnic: method === 'easypaisa' && easypaisaCnic.trim() ? easypaisaCnic.trim() : undefined,
        jazzcashPhone: method === 'jazzcash' ? jazzcashPhone.trim() : undefined,
        jazzcashTitle: method === 'jazzcash' ? jazzcashTitle.trim() : undefined,
        jazzcashCnic: method === 'jazzcash' && jazzcashCnic.trim() ? jazzcashCnic.trim() : undefined,
        note: note.trim() || undefined,
      };

      const result = await submitSellerWithdrawal(payload);

      if (!result.success || !result.withdrawal) {
        throw new Error(result.error || 'Failed to process withdrawal.');
      }

      setCompletedWithdrawal(result.withdrawal);
      const remaining = Math.max(0, availableBalance - numAmount);
      onWithdrawSuccess(result.withdrawal, remaining);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during withdrawal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setCompletedWithdrawal(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">Withdraw Seller Funds</h2>
                <p className="text-xs text-neutral-400">Instant cashout to Payoneer (Visa/Mastercard) or Mobile Accounts</p>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Screen */}
          {completedWithdrawal ? (
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">Withdrawal Processed Successfully!</h3>
                <p className="text-xs text-neutral-400">
                  Your funds have been dispatched from your Seller Central balance.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <span className="text-neutral-400">Reference ID</span>
                  <div className="flex items-center gap-1 text-white font-bold">
                    <span>{completedWithdrawal.referenceId}</span>
                    <button
                      onClick={() => handleCopy(completedWithdrawal.referenceId, 'ref')}
                      className="text-neutral-400 hover:text-amber-400 ml-1"
                      title="Copy Reference ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedKey === 'ref' && <span className="text-[10px] text-emerald-400 font-sans">Copied!</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Payout Method</span>
                  <span className="text-white font-bold capitalize">
                    {completedWithdrawal.method === 'payoneer'
                      ? `Payoneer Account (${completedWithdrawal.payoneerEmail || 'axe426622@gmail.com'})`
                      : completedWithdrawal.method === 'jazzcash'
                      ? 'JazzCash Mobile Account'
                      : 'Easypaisa Mobile Account'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Gross Amount</span>
                  <span className="text-white">${completedWithdrawal.amount.toFixed(2)} USD</span>
                </div>

                {completedWithdrawal.fee > 0 && (
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Network Fee</span>
                    <span>-${completedWithdrawal.fee.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-sm">
                  <span className="text-amber-400 font-bold">Net Transferred</span>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold">${completedWithdrawal.netAmount.toFixed(2)} USD</p>
                    {completedWithdrawal.amountPkr && (
                      <p className="text-[11px] text-neutral-400">Rs. {completedWithdrawal.amountPkr.toLocaleString()} PKR</p>
                    )}
                  </div>
                </div>

                {completedWithdrawal.method === 'easypaisa' && (
                  <div className="pt-2 border-t border-neutral-800 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Easypaisa Number:</span>
                      <span className="text-white">{completedWithdrawal.easypaisaPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Account Title:</span>
                      <span className="text-white">{completedWithdrawal.easypaisaTitle}</span>
                    </div>
                  </div>
                )}

                {completedWithdrawal.method === 'jazzcash' && (
                  <div className="pt-2 border-t border-neutral-800 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">JazzCash Number:</span>
                      <span className="text-white">{completedWithdrawal.jazzcashPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Account Title:</span>
                      <span className="text-white">{completedWithdrawal.jazzcashTitle}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Available Balance Banner */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Available for Withdrawal</p>
                  <p className="text-2xl font-bold font-mono text-white mt-0.5">${availableBalance.toFixed(2)} <span className="text-xs text-neutral-400 font-normal">USD</span></p>
                  <p className="text-xs text-amber-400/90 font-mono mt-0.5">≈ Rs. {Math.round(availableBalance * USD_TO_PKR_RATE).toLocaleString()} PKR</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Instant Clearance
                  </span>
                </div>
              </div>

              {/* Payout Method Toggle */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Select Payout Destination
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setMethod('easypaisa'); setErrorMessage(null); }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      method === 'easypaisa'
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      method === 'easypaisa' ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-white">Easypaisa</span>
                        <span className="px-1 py-0.2 bg-emerald-500/20 text-emerald-300 text-[8px] rounded font-mono font-bold">0% FEE</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Mobile (PKR)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMethod('jazzcash'); setErrorMessage(null); }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      method === 'jazzcash'
                        ? 'bg-rose-500/10 border-rose-500/50 shadow-lg shadow-rose-500/5'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      method === 'jazzcash' ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-white">JazzCash</span>
                        <span className="px-1 py-0.2 bg-rose-500/20 text-rose-300 text-[8px] rounded font-mono font-bold">0% FEE</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Mobile (PKR)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setMethod('payoneer'); setErrorMessage(null); }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      method === 'payoneer'
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      method === 'payoneer' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-white">Payoneer</span>
                        <span className="px-1 py-0.2 bg-amber-500/20 text-amber-300 text-[8px] rounded font-mono font-bold">CARD/USD</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Visa / Mastercard</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Input & Presets */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Withdrawal Amount (USD)
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Rate: $1 = Rs. {USD_TO_PKR_RATE} PKR
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-mono font-bold text-neutral-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={availableBalance}
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-24 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handlePresetAmount('max')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    MAX
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2 mt-2">
                  {[25, 50, 100, 250, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetAmount(preset)}
                      disabled={preset > availableBalance}
                      className="flex-1 py-1 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 disabled:opacity-30 text-neutral-300 text-[11px] font-mono rounded-lg transition-colors cursor-pointer"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payoneer Configuration Fields */}
              {method === 'payoneer' && (
                <div className="space-y-3 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>Payouts sent to your Payoneer USD balance, accessible instantly via your International Visa/Mastercard debit card or linked local bank account.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Payoneer Registered Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={payoneerEmail}
                      onChange={(e) => setPayoneerEmail(e.target.value)}
                      placeholder="e.g. axe426622@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Account Title / Beneficiary Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={payoneerAccountTitle}
                      onChange={(e) => setPayoneerAccountTitle(e.target.value)}
                      placeholder="e.g. Muhammad Gohar Nadeem"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      Payoneer Customer ID / Receiving Account # <span className="text-[10px] text-neutral-500">(Optional for direct reference)</span>
                    </label>
                    <input
                      type="text"
                      value={payoneerCustomerId}
                      onChange={(e) => setPayoneerCustomerId(e.target.value)}
                      placeholder="e.g. 102938475"
                      className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* Easypaisa Configuration Fields */}
              {method === 'easypaisa' && (
                <div className="space-y-3 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Registered Easypaisa Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-neutral-400">🇵🇰 +92</span>
                      <input
                        type="text"
                        value={easypaisaPhone}
                        onChange={(e) => setEasypaisaPhone(e.target.value)}
                        placeholder="03157338694"
                        className="w-full pl-20 pr-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Account Title (Account Holder Name)
                    </label>
                    <input
                      type="text"
                      value={easypaisaTitle}
                      onChange={(e) => setEasypaisaTitle(e.target.value)}
                      placeholder="e.g. Gauhar Axe"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      National CNIC Number <span className="text-[10px] text-neutral-500">(Optional for secondary verification)</span>
                    </label>
                    <input
                      type="text"
                      value={easypaisaCnic}
                      onChange={(e) => setEasypaisaCnic(e.target.value)}
                      placeholder="e.g. 35201-1234567-1"
                      className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              )}

              {/* JazzCash Configuration Fields */}
              {method === 'jazzcash' && (
                <div className="space-y-3 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Registered JazzCash Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-neutral-400">🇵🇰 +92</span>
                      <input
                        type="text"
                        value={jazzcashPhone}
                        onChange={(e) => setJazzcashPhone(e.target.value)}
                        placeholder="03001234567"
                        className="w-full pl-20 pr-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Account Title (Account Holder Name)
                    </label>
                    <input
                      type="text"
                      value={jazzcashTitle}
                      onChange={(e) => setJazzcashTitle(e.target.value)}
                      placeholder="e.g. Gauhar Axe"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      National CNIC Number <span className="text-[10px] text-neutral-500">(Optional for secondary verification)</span>
                    </label>
                    <input
                      type="text"
                      value={jazzcashCnic}
                      onChange={(e) => setJazzcashCnic(e.target.value)}
                      placeholder="e.g. 35201-1234567-1"
                      className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              )}

              {/* Net Payout Summary */}
              <div className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Gross Payout</span>
                  <span className="font-mono text-white">${numAmount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Processing & Network Fee</span>
                  <span className="font-mono text-neutral-300">
                    {networkFee === 0 ? <span className="text-emerald-400 font-bold">Free ($0.00)</span> : `$${networkFee.toFixed(2)} USD`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-800 text-sm">
                  <span className="font-bold text-white">Net You Receive</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">${netAmountUsd.toFixed(2)} USD</span>
                    {(method === 'easypaisa' || method === 'jazzcash') && (
                      <p className="text-xs text-neutral-300 font-mono font-semibold">
                        Rs. {amountPkr.toLocaleString()} PKR
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !isAmountValid}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Payout...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Withdraw ${netAmountUsd.toFixed(2)} USD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Secured with bank-grade 256-bit SSL &amp; ledger verification</span>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
