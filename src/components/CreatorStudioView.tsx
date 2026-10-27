import React, { useState } from 'react';
import { User } from '../types';
import {
  Sparkles,
  Coins,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  CreditCard,
  Check,
  ShieldCheck,
  ArrowUpRight,
  Gift,
  Zap,
} from 'lucide-react';

interface CreatorStudioViewProps {
  currentUser: User;
  onTopUpCoins: (amount: number) => void;
  onWithdrawEarnings: (amount: number) => void;
}

export const CreatorStudioView: React.FC<CreatorStudioViewProps> = ({
  currentUser,
  onTopUpCoins,
  onWithdrawEarnings,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('450');
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const coinPackages = [
    { coins: 250, price: 3.99, popular: false },
    { coins: 650, price: 8.99, popular: true, bonus: '+50 Bonus' },
    { coins: 1500, price: 19.99, popular: false, bonus: '+200 Bonus' },
    { coins: 4000, price: 49.99, popular: false, bonus: '+800 Bonus' },
  ];

  const creatorTiers = [
    {
      name: 'Silver Supporter',
      price: '$4.99 / mo',
      members: 140,
      perks: ['Exclusive badge in live streams', 'Supporter-only posts', 'Monthly Q&A AMA'],
    },
    {
      name: 'Gold VIP Insider',
      price: '$9.99 / mo',
      members: 200,
      perks: [
        'Direct 1-on-1 messaging priority',
        'Early access to audio stems & presets',
        'VIP backstage pass on livestreams',
        'Custom UsWorld profile border',
      ],
    },
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(payoutAmount);
    if (!val || val <= 0) return;
    onWithdrawEarnings(val);
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 2500);
  };

  const handleBuyCoins = (coins: number) => {
    onTopUpCoins(coins);
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Creator Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-indigo-900/60">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>UsWorld Creator Monetization Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight mt-1">
            Creator Studio & Revenue
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Keep 92% of all subscriber revenue, live stream tips, and direct marketplace sales.
            Withdraw instantly via PayFast, Direct Bank EFT, or PayPal.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shrink-0">
          <p className="text-xs text-slate-300">Available Creator Balance</p>
          <p className="text-2xl font-bold font-display text-emerald-400 tabular-nums">$1,842.50</p>
          <span className="text-[10px] text-slate-300">+$340.00 this week</span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Monthly Subscriptions</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">340</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            +18% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Virtual Gifts Tipped</span>
            <Gift className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">14,250</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            $855 equivalent
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Stream Watch Time</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">2,840 hrs</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            Top 5% live rank
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Coin Balance</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
            {currentUser.coinsBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            Ready to tip
          </p>
        </div>
      </div>

      {/* Main Grid: Subscriptions, Tipping, and Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creator Subscription Tiers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Your Active Creator Tiers</span>
            </h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              340 Active Supporters
            </span>
          </div>

          <div className="space-y-3">
            {creatorTiers.map((tier) => (
              <div
                key={tier.name}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {tier.name}
                  </h4>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {tier.price}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {tier.members} creators enrolled
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Payout & Coin Top Up */}
        <div className="space-y-6">
          {/* Request Payout */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Request Payout</span>
            </h3>

            {payoutSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>
                  Payout request for ${payoutAmount} submitted successfully via PayFast / Bank wire!
                </span>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Withdrawal Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      max={1842}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full pl-7 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 tabular-nums"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Destination: PayFast / Standard Bank ZA</span>
                  <span className="text-indigo-600 hover:underline cursor-pointer">Edit</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Withdraw to Bank Account
                </button>
              </form>
            )}
          </div>

          {/* Top Up Virtual Coins Store */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span>Buy Virtual Coins</span>
              </h3>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
                {currentUser.coinsBalance} Coins in Wallet
              </span>
            </div>

            {topUpSuccess && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Coins added to your wallet! Ready to gift during live streams.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              {coinPackages.map((pkg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBuyCoins(pkg.coins)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 text-left transition-all group bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white tabular-nums flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      {pkg.coins} Coins
                    </span>
                    {pkg.popular && (
                      <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                      ${pkg.price}
                    </span>
                    {pkg.bonus && <span className="text-emerald-500 font-medium">{pkg.bonus}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
