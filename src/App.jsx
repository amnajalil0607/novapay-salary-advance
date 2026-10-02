import { useEffect, useState } from "react";
import {
  AppBar,
  Card,
  ListRow,
  Button,
  AmountText,
} from "./novakit";

const ELIGIBLE_LIMIT = 10000;
const ELIGIBLE_AMOUNTS = [5000, 10000];
const ABOVE_LIMIT_AMOUNT = 15000;
const REPAYMENT_DATE = "28 October 2026";
const FEE_RATE = 0.03;
const BASE_AVAILABLE_BALANCE = 4250;
const RECENT_ACTIVITY = [
  {
    icon: "↑",
    title: "Sent to Ahmed K.",
    subtitle: "Today, 2:14 PM",
    amount: 1500,
    type: "debit",
  },
  {
    icon: "↓",
    title: "Salary credited",
    subtitle: "28 Jun",
    amount: 68000,
    type: "credit",
  },
  {
    icon: "↑",
    title: "Mobile top-up",
    subtitle: "27 Jun",
    amount: 500,
    type: "debit",
  },
];
const TRANSACTION_AMOUNT_COLORS = {
  credit: "#237A45",
  debit: "#B13F4A",
};

export default function App() {
  const [splashState, setSplashState] = useState("visible");
  const [screen, setScreen] = useState("home");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [activeAdvance, setActiveAdvance] = useState(null);
  const [showLimitExplanation, setShowLimitExplanation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fee = selectedAmount ? selectedAmount * FEE_RATE : 0;
  const totalRepayment = selectedAmount ? selectedAmount + fee : 0;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fadeTimer = prefersReducedMotion
      ? null
      : window.setTimeout(() => {
          setSplashState("exiting");
        }, 1400);
    const hideTimer = window.setTimeout(() => {
      setSplashState("hidden");
    }, 1700);

    return () => {
      if (fadeTimer) window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  function handleAccept() {
    if (!selectedAmount || isProcessing) return;

    setIsProcessing(true);
    window.setTimeout(() => {
      setActiveAdvance({
        amount: selectedAmount,
        totalRepayment,
        repaymentDate: REPAYMENT_DATE,
      });
      setIsProcessing(false);
      setScreen("confirmation");
    }, 1700);
  }

  function handleReturnHome() {
    setScreen("home");
    setSelectedAmount(null);
    setShowLimitExplanation(false);
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-neutral-200 sm:px-4 sm:py-6">
      <div className="relative h-screen w-full max-w-[390px] bg-white shadow-xl overflow-clip sm:h-[820px] sm:rounded-[28px] sm:border sm:border-neutral-300">
        <div
          className="h-full"
          aria-hidden={splashState !== "hidden" ? "true" : undefined}
        >
          {screen === "home" ? (
            <HomeScreen
              activeAdvance={activeAdvance}
              onAdvanceAction={() =>
                setScreen(activeAdvance ? "confirmation" : "offer")
              }
            />
          ) : null}

          {screen === "offer" ? (
            <OfferScreen
              selectedAmount={selectedAmount}
              showLimitExplanation={showLimitExplanation}
              onSelectAmount={setSelectedAmount}
              onToggleLimitExplanation={() =>
                setShowLimitExplanation((current) => !current)
              }
              onBack={() => setScreen("home")}
              onReview={() => setScreen("review")}
            />
          ) : null}

          {screen === "review" ? (
            <ReviewScreen
              amount={selectedAmount}
              fee={fee}
              totalRepayment={totalRepayment}
              isProcessing={isProcessing}
              onBack={() => setScreen("offer")}
              onAccept={handleAccept}
            />
          ) : null}

          {screen === "confirmation" ? (
            <ConfirmationScreen
              amount={activeAdvance?.amount ?? selectedAmount}
              totalRepayment={
                activeAdvance?.totalRepayment ?? totalRepayment
              }
              onDone={handleReturnHome}
            />
          ) : null}
        </div>

        {splashState !== "hidden" ? (
          <SplashScreen exiting={splashState === "exiting"} />
        ) : null}
      </div>
    </div>
  );
}

function SplashScreen({ exiting }) {
  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-brand-800 via-brand to-brand-400 text-white transition-opacity duration-300 motion-reduce:transition-none ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="NovaPay is opening"
    >
      <div className="flex flex-col items-center gap-4">
        <span
          className="flex h-[72px] w-[72px] items-center justify-center rounded-lg border border-white/20 bg-white/15 text-[32px] font-bold leading-none text-white"
          aria-hidden="true"
        >
          N
        </span>
        <span className="text-[30px] font-bold leading-none tracking-[-0.03em] text-white">
          NovaPay
        </span>
      </div>
    </div>
  );
}

function ScreenLayout({ title, onBack, children, actions, busy = false }) {
  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <StatusBar />
      <AppBar title={title} onBack={onBack} />
      <main
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 space-y-5"
        aria-busy={busy}
      >
        {children}
      </main>
      {actions ? <BottomActions>{actions}</BottomActions> : null}
    </div>
  );
}

function BottomActions({ children }) {
  return (
    <div className="relative z-10 flex-none border-t border-neutral-100 bg-white/95 px-4 pb-5 pt-4 shadow-action backdrop-blur-sm">
      {children}
    </div>
  );
}

function StatusIcons() {
  return (
    <div
      className="flex items-center gap-2 text-neutral-900"
      role="img"
      aria-label="Strong signal, Wi-Fi connected, battery 86 percent"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" className="h-3.5 w-[18px] fill-current">
        <rect x="1" y="9" width="3" height="4" rx="1" />
        <rect x="6" y="6" width="3" height="7" rx="1" />
        <rect x="11" y="3" width="3" height="10" rx="1" />
        <rect x="16" width="2" height="13" rx="1" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 20 15" className="h-3.5 w-5 fill-none stroke-current stroke-2">
        <path d="M2 5.5a12 12 0 0 1 16 0" strokeLinecap="round" />
        <path d="M5 9a7.5 7.5 0 0 1 10 0" strokeLinecap="round" />
        <path d="M8.5 12.2a2.4 2.4 0 0 1 3 0" strokeLinecap="round" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 27 13" className="h-3.5 w-7 fill-none stroke-current">
        <rect x="1" y="1" width="22" height="11" rx="3" />
        <path d="M25 4.5v4" strokeLinecap="round" />
        <rect x="3" y="3" width="17" height="7" rx="1.5" className="fill-current stroke-none" />
      </svg>
    </div>
  );
}

function StatusBar({ transparent = false }) {
  return (
    <div
      className={`flex h-10 flex-none items-center justify-between px-5 pt-3 text-caption font-semibold text-neutral-900 ${
        transparent ? "bg-transparent" : "bg-white"
      }`}
    >
      <span>9:41</span>
      <StatusIcons />
    </div>
  );
}

function NotificationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 5 2 5.5 2 6.5h-15c0-1 2-1.5 2-6.5Z" strokeLinejoin="round" />
      <path d="M10 19h4" strokeLinecap="round" />
    </svg>
  );
}

function HomeScreen({ activeAdvance, onAdvanceAction }) {
  const availableBalance =
    BASE_AVAILABLE_BALANCE + (activeAdvance?.amount ?? 0);

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <section className="flex-none rounded-b-[28px] border-b border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-100/80 pb-6">
        <StatusBar transparent />

        <div className="mt-5 flex items-center gap-3 px-5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white bg-brand-100 text-caption font-semibold text-brand-800"
            aria-hidden="true"
          >
            AJ
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-caption text-neutral-500">Good morning</p>
            <p className="text-body font-semibold text-neutral-900">
              Amna Jalil
            </p>
          </div>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-white/80 text-neutral-900"
            role="img"
            aria-label="Notifications"
          >
            <NotificationIcon />
          </div>
        </div>

        <div className="mt-6 px-5 text-center">
          <AmountText amount={availableBalance} size="display" />
          <p className="mt-1 text-caption text-neutral-700">
            Available balance
          </p>
        </div>
      </section>

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-4">
        <Card className="!border-brand-100 bg-gradient-to-br from-white to-brand-50/70 p-5 shadow-none">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-caption font-semibold text-brand-800">
                {activeAdvance ? "Current salary advance" : "Salary advance"}
              </p>
              <h2 className="text-lg font-medium leading-6 text-neutral-900">
                {activeAdvance
                  ? `Rs ${activeAdvance.amount.toLocaleString("en-PK")} received`
                  : "Need cash before payday?"}
              </h2>
            </div>

            <p className="max-w-[290px] text-body text-neutral-700">
              {activeAdvance
                ? (
                    <>
                      <strong>Repayment</strong>
                      <br />
                      Rs {activeAdvance.totalRepayment.toLocaleString("en-PK")} on{" "}
                      {activeAdvance.repaymentDate}
                      <span className="mt-2 block text-caption text-neutral-500">
                        New offers will be available after this advance is repaid.
                      </span>
                    </>
                  )
                : "You may qualify for a NovaPay salary advance."}
            </p>

            <Button size="md" onClick={onAdvanceAction}>
              {activeAdvance ? "View details" : "See your offer"}
            </Button>
          </div>
        </Card>

        <section aria-labelledby="recent-activity-title">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2
              id="recent-activity-title"
              className="text-body font-semibold text-neutral-900"
            >
              Recent activity
            </h2>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white px-4">
            {RECENT_ACTIVITY.map((transaction) => (
              <ListRow
                key={`${transaction.title}-${transaction.subtitle}`}
                icon={transaction.icon}
                title={transaction.title}
                subtitle={transaction.subtitle}
                trailing={
                  <AmountText
                    amount={transaction.amount}
                    size="body"
                    style={{
                      color: TRANSACTION_AMOUNT_COLORS[transaction.type],
                    }}
                  />
                }
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function OfferScreen({
  selectedAmount,
  showLimitExplanation,
  onSelectAmount,
  onToggleLimitExplanation,
  onBack,
  onReview,
}) {
  return (
    <ScreenLayout
      title="Choose amount"
      onBack={onBack}
      actions={
        <Button size="lg" disabled={!selectedAmount} onClick={onReview}>
          {selectedAmount ? "Review advance" : "Select an amount"}
        </Button>
      }
    >
      <section className="px-1" aria-labelledby="current-limit-label">
        <p
          id="current-limit-label"
          className="text-caption font-semibold text-neutral-500"
        >
          CURRENT ELIGIBILITY
        </p>
        <p className="mt-1 text-body text-neutral-700">
          Your current limit is{" "}
          <AmountText
            amount={ELIGIBLE_LIMIT}
            size="body"
            className="font-semibold"
          />
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="available-amounts-title">
        <h2
          id="available-amounts-title"
          className="px-1 text-body font-semibold text-neutral-900"
        >
          Available amounts
        </h2>

        <div
          className="space-y-3"
          role="radiogroup"
          aria-label="Available advance amounts"
        >
          {ELIGIBLE_AMOUNTS.map((amount) => (
            <ListRow
              key={amount}
              interaction="selectable"
              selected={selectedAmount === amount}
              onClick={() => onSelectAmount(amount)}
              className="min-h-[72px]"
              title={<AmountText amount={amount} size="title" />}
            />
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <ListRow
            interaction="informational"
            expanded={showLimitExplanation}
            controls="above-limit-explanation"
            onClick={onToggleLimitExplanation}
            className="!rounded-none !border-0 !bg-transparent focus-visible:ring-inset"
            title={<AmountText amount={ABOVE_LIMIT_AMOUNT} size="title" />}
            subtitle="Above your current limit"
            trailing={
              <span className="text-caption font-semibold text-brand-800">
                {showLimitExplanation ? "Hide" : "Why unavailable?"}
              </span>
            }
          />

          {showLimitExplanation ? (
            <div
              id="above-limit-explanation"
              role="status"
              className="border-t border-neutral-200 bg-neutral-50 px-4 py-3"
            >
              <p className="mt-1 text-body text-neutral-700">
                Your current limit is Rs 10,000. You can choose Rs 5,000 or Rs
                10,000 to continue.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="px-1">
        <p className="text-body font-semibold text-neutral-900">
          One-time fee: 3%
        </p>
        <p className="mt-1 text-caption text-neutral-700">
          You’ll see the exact fee and total before accepting.
        </p>
      </div>
    </ScreenLayout>
  );
}

function ReviewScreen({
  amount,
  fee,
  totalRepayment,
  isProcessing,
  onBack,
  onAccept,
}) {
  return (
    <ScreenLayout
      title="Review advance"
      onBack={isProcessing ? null : onBack}
      busy={isProcessing}
      actions={
        <div className="space-y-3">
          <Button
            size="lg"
            disabled={isProcessing}
            aria-busy={isProcessing}
            aria-live="polite"
            onClick={onAccept}
          >
            {isProcessing
              ? "Processing your advance…"
              : `Accept Rs ${amount.toLocaleString("en-PK")} advance`}
          </Button>
          <Button variant="secondary" disabled={isProcessing} onClick={onBack}>
            Change amount
          </Button>
        </div>
      }
    >
      <p className="px-1 text-body text-neutral-700">
        Check the full cost and repayment date before you accept.
      </p>

      <Card className="!border-neutral-200 p-5 shadow-none">
        <div className="flex items-center justify-between gap-4">
          <p className="text-body text-neutral-700">Advance amount</p>
          <AmountText amount={amount} size="body" className="font-semibold" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-body text-neutral-700">One-time fee (3%)</p>
          <AmountText amount={fee} size="body" className="font-semibold" />
        </div>

        <div className="mt-4 flex items-start justify-between gap-4 border-t border-neutral-200 pt-4">
          <p className="text-body text-neutral-700">Repayment date</p>
          <p className="text-body font-semibold text-neutral-900 text-right">
            {REPAYMENT_DATE}
          </p>
        </div>

        <div className="mt-5 border-t border-neutral-200 pt-5">
          <p className="text-caption font-semibold text-neutral-500">
            TOTAL REPAYMENT
          </p>
          <div className="mt-1">
            <AmountText amount={totalRepayment} size="display" />
          </div>
        </div>
      </Card>
    </ScreenLayout>
  );
}

function ConfirmationScreen({ amount, totalRepayment, onDone }) {
  return (
    <ScreenLayout
      title="Salary advance"
      actions={
        <Button size="lg" onClick={onDone}>
          Back to home
        </Button>
      }
    >
      <section className="rounded-lg border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-100 px-6 pb-7 pt-8 text-center">
        <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-caption font-semibold text-brand-800">
          Confirmed
        </span>
        <h2 className="mt-4 text-title text-neutral-900">Advance accepted</h2>
        <div className="mt-6">
          <p className="text-caption font-semibold text-brand-800">
            ADVANCE AMOUNT
          </p>
          <div className="mt-1">
            <AmountText amount={amount} size="display" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white px-5 py-5" aria-label="Repayment summary">
        <p className="text-caption font-semibold text-neutral-500">
          REPAYMENT SUMMARY
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-caption text-neutral-500">Total repayment</p>
            <div className="mt-1">
              <AmountText
                amount={totalRepayment}
                size="body"
                className="font-semibold"
              />
            </div>
          </div>
          <div className="border-l border-neutral-200 pl-4">
            <p className="text-caption text-neutral-500">Repayment date</p>
            <p className="mt-1 text-body font-semibold text-neutral-900">
              {REPAYMENT_DATE}
            </p>
          </div>
        </div>
      </section>
    </ScreenLayout>
  );
}
