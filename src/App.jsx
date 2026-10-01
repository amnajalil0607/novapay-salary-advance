import { useState } from "react";
import {
  AppBar,
  Card,
  Panel,
  ListRow,
  Button,
  AmountText,
} from "./novakit";

const ELIGIBLE_LIMIT = 10000;
const REPAYMENT_DATE = "28 October 2026";
const FEE_RATE = 0.03;

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showLimitExplanation, setShowLimitExplanation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fee = selectedAmount ? selectedAmount * FEE_RATE : 0;
  const totalRepayment = selectedAmount ? selectedAmount + fee : 0;

  function handleAccept() {
    if (!selectedAmount || isProcessing) return;

    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      setScreen("confirmation");
    }, 800);
  }

  function handleReturnHome() {
    setScreen("home");
    setSelectedAmount(null);
    setShowLimitExplanation(false);
  }

  return (
    <div className="min-h-screen w-full flex justify-center py-6">
      <div className="relative w-full max-w-[390px] min-h-[780px] bg-white rounded-[28px] shadow-xl overflow-hidden border border-neutral-300">
        {screen === "home" ? (
          <HomeScreen onSeeOffer={() => setScreen("offer")} />
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
            amount={selectedAmount}
            fee={fee}
            totalRepayment={totalRepayment}
            onDone={handleReturnHome}
          />
        ) : null}
      </div>
    </div>
  );
}

function HomeScreen({ onSeeOffer }) {
  return (
    <>
      <AppBar title="NovaPay" />

      <main className="p-4 space-y-4">
        <Card>
          <div className="text-caption text-neutral-500">Available balance</div>
          <div className="mt-1">
            <AmountText amount={4250} size="display" />
          </div>
        </Card>

        <Card className="space-y-3">
          <div>
            <h2 className="text-title text-neutral-900">Need cash before payday?</h2>
            <p className="text-body text-neutral-700 mt-1">
              You may qualify for a NovaPay salary advance.
            </p>
          </div>
          <Button size="lg" onClick={onSeeOffer}>
            See your offer
          </Button>
        </Card>

        <Card>
          <div className="text-caption text-neutral-500 mb-1">Recent activity</div>
          <ListRow
            icon="↑"
            title="Sent to Ahmed K."
            subtitle="Today, 2:14 PM"
            trailing={<AmountText amount={1500} size="body" />}
          />
          <ListRow
            icon="↓"
            title="Salary credited"
            subtitle="28 Jun"
            trailing={<AmountText amount={68000} size="body" />}
          />
          <ListRow
            icon="↑"
            title="Mobile top-up"
            subtitle="27 Jun"
            trailing={<AmountText amount={500} size="body" />}
          />
        </Card>
      </main>
    </>
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
    <>
      <AppBar title="Choose an advance amount" onBack={onBack} />

      <main className="p-4 space-y-4">
        <section aria-labelledby="eligible-limit-label">
          <p id="eligible-limit-label" className="text-body text-neutral-700">
            You can request up to
          </p>
          <div className="mt-1">
            <AmountText amount={ELIGIBLE_LIMIT} size="display" />
          </div>
          <p className="text-body text-neutral-700 mt-2">
            This is based on your current eligibility.
          </p>
        </section>

        <Card className="space-y-3">
          <h2 className="text-title text-neutral-900">Available amounts</h2>

          <div
            className="space-y-2"
            role="radiogroup"
            aria-label="Available advance amounts"
          >
            {[5000, 10000].map((amount) => {
              const isSelected = selectedAmount === amount;
              return (
                <ListRow
                  key={amount}
                  interaction="selectable"
                  selected={isSelected}
                  onClick={() => onSelectAmount(amount)}
                  title={<AmountText amount={amount} size="title" />}
                  subtitle="Available to request"
                  trailing={
                    <span className={`text-caption font-semibold ${isSelected ? "text-brand-800" : "text-neutral-700"}`}>
                      {isSelected ? "Selected" : "Choose"}
                    </span>
                  }
                />
              );
            })}
          </div>

          <ListRow
            interaction="informational"
            expanded={showLimitExplanation}
            controls="above-limit-explanation"
            onClick={onToggleLimitExplanation}
            title={<AmountText amount={15000} size="title" />}
            subtitle="Above your current limit"
            trailing={
              <span className="text-caption font-semibold text-brand-800">
                {showLimitExplanation ? "Hide" : "Learn why"}
              </span>
            }
          />

          {showLimitExplanation ? (
            <div id="above-limit-explanation" role="status">
              <Panel className="bg-brand-50 border-brand-200 shadow-none">
                <h3 className="text-body font-semibold text-neutral-900">
                  Rs 15,000 is above your current limit
                </h3>
                <p className="text-body text-neutral-700 mt-1">
                  Your current limit is Rs 10,000. You can choose Rs 5,000 or
                  Rs 10,000 to continue.
                </p>
              </Panel>
            </div>
          ) : null}
        </Card>

        <p className="text-body text-neutral-700">
          A one-time 3% fee will be added to the amount you choose. You’ll see
          the exact fee and total before accepting.
        </p>

        <Button size="lg" disabled={!selectedAmount} onClick={onReview}>
          {selectedAmount ? "Review advance" : "Select an amount"}
        </Button>
      </main>
    </>
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
    <>
      <AppBar title="Review your advance" onBack={isProcessing ? null : onBack} />

      <main className="p-4 space-y-4" aria-busy={isProcessing}>
        <p className="text-body text-neutral-700">
          Check the amount, one-time fee, total repayment, and repayment date
          before you accept.
        </p>

        <Card>
          <ListRow
            title="Advance amount"
            trailing={<AmountText amount={amount} size="body" />}
          />
          <ListRow
            title="One-time fee (3%)"
            trailing={<AmountText amount={fee} size="body" />}
          />
          <ListRow
            title={<span className="font-semibold">Total repayment</span>}
            trailing={<AmountText amount={totalRepayment} size="title" />}
          />
          <ListRow
            title="Repayment date"
            trailing={
              <span className="text-body font-semibold text-neutral-900">
                {REPAYMENT_DATE}
              </span>
            }
          />
        </Card>

        <Panel className="shadow-none">
          <p className="text-body text-neutral-700">
            Repayment will be pulled in full on your payday, {REPAYMENT_DATE}.
          </p>
        </Panel>

        <p className="text-body text-neutral-700">
          By accepting, you agree to repay Rs {totalRepayment.toLocaleString("en-PK")} in full on {REPAYMENT_DATE}.
        </p>

        <div className="space-y-3">
          <Button
            size="lg"
            disabled={isProcessing}
            aria-busy={isProcessing}
            onClick={onAccept}
          >
            {isProcessing
              ? "Processing…"
              : `Accept Rs ${amount.toLocaleString("en-PK")} advance`}
          </Button>
          <Button variant="secondary" disabled={isProcessing} onClick={onBack}>
            Change amount
          </Button>
        </div>
      </main>
    </>
  );
}

function ConfirmationScreen({ amount, fee, totalRepayment, onDone }) {
  return (
    <>
      <AppBar title="Advance accepted" />

      <main className="p-4 space-y-4">
        <p className="text-body text-neutral-700">
          Your Rs {amount.toLocaleString("en-PK")} salary advance is confirmed.
        </p>

        <Card>
          <ListRow
            title="Advance amount"
            trailing={<AmountText amount={amount} size="body" />}
          />
          <ListRow
            title="One-time fee (3%)"
            trailing={<AmountText amount={fee} size="body" />}
          />
          <ListRow
            title={<span className="font-semibold">Total repayment</span>}
            trailing={<AmountText amount={totalRepayment} size="title" />}
          />
          <ListRow
            title="Repayment date"
            trailing={
              <span className="text-body font-semibold text-neutral-900">
                {REPAYMENT_DATE}
              </span>
            }
          />
        </Card>

        <p className="text-body text-neutral-700">
          Repayment will be pulled in full on {REPAYMENT_DATE}.
        </p>

        <Button size="lg" onClick={onDone}>
          Back to home
        </Button>
      </main>
    </>
  );
}
