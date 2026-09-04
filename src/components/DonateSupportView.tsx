import React from "react";
import {
  Heart,
  ShieldCheck,
  Zap,
  Globe,
  Coins,
  CreditCard,
  Building,
  CheckCircle,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Gift,
} from "lucide-react";

export const DonateSupportView: React.FC = () => {
  const [selectedTier, setSelectedTier] = React.useState<"patron" | "lab" | "angel">(
    "patron",
  );
  const [customAmount, setCustomAmount] = React.useState<number>(25);
  const [paymentMethod, setPaymentMethod] = React.useState<
    "card" | "crypto" | "collective"
  >("card");
  const [copiedCrypto, setCopiedCrypto] = React.useState<string | null>(null);

  const copyAddress = (addr: string, coin: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedCrypto(coin);
    setTimeout(() => setCopiedCrypto(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12231b] via-[#0f2a24] to-[#071714] border border-[#1b4a3a] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>100% Free & Non-Profit Public Education Fund</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Support Free Education for Humanity
          </h1>
          <p className="text-sm md:text-base text-[#8bbdae] leading-relaxed">
            Zalamati LMDpro is dedicated to breaking down financial barriers in
            higher education. Every dollar directly funds high-performance GPU
            compute, free server hosting, and open-source research grants for
            students worldwide.
          </p>
        </div>
      </div>

      {/* Transparent Treasury Ledger */}
      <div className="p-6 rounded-2xl bg-[#10222b] border border-[#1c3c4b] space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          Transparent Treasury & Fund Allocation
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "GPU & AI Inference Compute",
              percent: "60%",
              color: "text-cyan-400",
              desc: "Powers Gemini 3.1 & Edge AI model inference for students.",
            },
            {
              label: "Free Hosting & Infrastructure",
              percent: "20%",
              color: "text-cyan-400",
              desc: "Cloud Run containers, PostgreSQL DB, and CDN distribution.",
            },
            {
              label: "Open Research Grants",
              percent: "15%",
              color: "text-cyan-400",
              desc: "Direct scholarships for underprivileged scholars.",
            },
            {
              label: "Operational Reserve",
              percent: "5%",
              color: "text-cyan-400",
              desc: "Legal compliance and security auditing.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#0b1820] border border-[#1a3847] space-y-1.5"
            >
              <div
                className={`text-2xl font-extrabold font-mono ${item.color}`}
              >
                {item.percent}
              </div>
              <div className="text-xs font-bold text-white">{item.label}</div>
              <p className="text-[11px] text-[#6e91a1]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Donation Tiers */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: "patron",
            title: "Individual Scholar Patron",
            price: "$5 / mo",
            desc: "Sponsors 100 hours of AI Socratic Tutoring for a student in need.",
            badge: "Community Favorite",
          },
          {
            id: "lab",
            title: "University & Lab Sponsor",
            price: "$50 / mo",
            desc: "Sponsors 1 full Degree Program module and GPU RAG crawling capacity.",
            badge: "Academic Grant",
          },
          {
            id: "angel",
            title: "Enterprise Non-Profit Angel",
            price: "$500 / mo",
            desc: "Funds an entire regional academic node and 50 student scholarships.",
            badge: "Global Impact",
          },
        ].map((tier) => (
          <div
            key={tier.id}
            onClick={() => setSelectedTier(tier.id as any)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              selectedTier === tier.id
                ? "bg-[#122e28] border-cyan-500/60 shadow-xl shadow-cyan-950/40"
                : "bg-[#10222b] border-[#1c3c4b] hover:border-cyan-500/30"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {tier.badge}
                </span>
                {selectedTier === tier.id && (
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white">{tier.title}</h3>
              <div className="text-2xl font-extrabold text-cyan-300 font-mono">
                {tier.price}
              </div>
              <p className="text-xs text-[#7e9fb0] leading-relaxed">
                {tier.desc}
              </p>
            </div>

            <button
              className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                selectedTier === tier.id
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-md"
                  : "bg-[#142a35] hover:bg-[#1a3543] text-white"
              }`}
            >
              Select Tier
            </button>
          </div>
        ))}
      </div>

      {/* Payment Options */}
      <div className="p-6 rounded-2xl bg-[#10222b] border border-[#1c3c4b] space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-cyan-400" />
          Choose Donation Gateway
        </h2>

        <div className="flex flex-wrap gap-3 border-b border-[#1b3846] pb-4">
          {[
            { id: "card", label: "Credit / Debit Card", icon: CreditCard },
            {
              id: "crypto",
              label: "Cryptocurrency (BTC / ETH / SOL)",
              icon: Coins,
            },
            {
              id: "collective",
              label: "Open Collective / GitHub",
              icon: Globe,
            },
          ].map((m) => {
            const Icon = m.icon;
            const active = paymentMethod === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#163848] text-cyan-300 border border-cyan-500/40 shadow-md"
                    : "bg-[#0b171f] text-[#608394] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#83a5b5]">
                Custom Donation Amount ($ USD):
              </label>
              <div className="flex items-center gap-2">
                {[10, 25, 50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCustomAmount(amt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      customAmount === amt
                        ? "bg-cyan-500 text-black font-extrabold"
                        : "bg-[#0d1a21] text-[#6e91a1] border border-[#1a3847] hover:text-white"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  `Thank you for supporting non-profit education with a $${customAmount} donation!`,
                )
              }
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>Donate ${customAmount} Now</span>
            </button>
          </div>
        )}

        {paymentMethod === "crypto" && (
          <div className="space-y-3">
            {[
              {
                coin: "Bitcoin (BTC)",
                addr: "bc1q9x3f8a27d110b244c98d701a2b3c4d5e6f7g8",
              },
              {
                coin: "Ethereum / USDC (ETH)",
                addr: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
              },
              {
                coin: "Solana (SOL)",
                addr: "Sol9z8x7c6v5b4n3m2a1s0d9f8g7h6j5k4l3p2o1",
              },
            ].map((c) => (
              <div
                key={c.coin}
                className="p-3 rounded-xl bg-[#08131a] border border-[#1c3d4c] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{c.coin}</div>
                  <div className="text-[11px] font-mono text-cyan-300 truncate max-w-xs md:max-w-md">
                    {c.addr}
                  </div>
                </div>
                <button
                  onClick={() => copyAddress(c.addr, c.coin)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#112a36] text-xs font-semibold text-cyan-300 border border-[#204456]"
                >
                  {copiedCrypto === c.coin ? (
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedCrypto === c.coin ? "Copied" : "Copy"}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {paymentMethod === "collective" && (
          <div className="p-4 rounded-xl bg-[#0d1a21] border border-[#1a3847] space-y-2">
            <h3 className="text-sm font-bold text-white">
              Open Collective Non-Profit Gateway
            </h3>
            <p className="text-xs text-[#7d9fbe]">
              Tax-deductible sponsorship via 501(c)(3) fiscal sponsors. Tax
              receipts automatically generated for corporate sponsors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
