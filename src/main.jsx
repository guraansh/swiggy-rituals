import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Check,
  Clock3,
  ConciergeBell,
  Flame,
  IndianRupee,
  MapPin,
  MessageSquareText,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import "./styles.css";

const meals = [
  {
    id: "protein-bowl",
    name: "Paneer protein bowl",
    restaurant: "Green Theory Express",
    price: 286,
    eta: "22 min",
    score: 94,
    reason: "High protein, low oil, fits your weekday budget.",
    tags: ["42g protein", "No onion", "Office friendly"],
  },
  {
    id: "thali",
    name: "Mini millet thali",
    restaurant: "Sattvam Daily",
    price: 248,
    eta: "28 min",
    score: 89,
    reason: "Balanced carbs and fiber without the afternoon crash.",
    tags: ["Millet", "Light spice", "Filling"],
  },
  {
    id: "wrap",
    name: "Grilled chicken wrap",
    restaurant: "Lean Lane",
    price: 299,
    eta: "19 min",
    score: 87,
    reason: "Fastest option with enough protein for training days.",
    tags: ["Lean", "Fastest", "No mayo"],
  },
];

const timeline = [
  "Parse intent",
  "Match preferences",
  "Search Swiggy Food",
  "Stage safe checkout",
];

const mcpTrace = [
  { tool: "search_restaurants", result: "18 nearby matches", delay: 520 },
  { tool: "search_menu", result: "42 healthy lunch items", delay: 960 },
  { tool: "update_food_cart", result: "Best option staged", delay: 1380 },
  { tool: "get_food_cart", result: "Ready for user approval", delay: 1780 },
];

const rituals = [
  {
    id: "weekday-lunch",
    icon: Utensils,
    name: "Weekday Lunch",
    surface: "Food",
    status: "Live demo",
    description: "Healthy office lunch under Rs. 300 with approval before every order.",
  },
  {
    id: "sunday-restock",
    icon: PackageCheck,
    name: "Sunday Restock",
    surface: "Instamart",
    status: "Next",
    description: "Eggs, curd, bananas, and snacks rebuilt into a weekly pantry cart.",
  },
  {
    id: "friday-table",
    icon: ConciergeBell,
    name: "Friday Table",
    surface: "Dineout",
    status: "Next",
    description: "Quiet dinner spots matched to budget, cuisine, timing, and party size.",
  },
];

function App() {
  const [step, setStep] = useState("brief");
  const [prompt, setPrompt] = useState(
    "I want healthy weekday lunches under Rs. 300 near office.",
  );
  const [selectedId, setSelectedId] = useState("protein-bowl");
  const [runState, setRunState] = useState("idle");
  const [activeStage, setActiveStage] = useState(0);
  const [visibleTrace, setVisibleTrace] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const selectedMeal = useMemo(
    () => meals.find((meal) => meal.id === selectedId),
    [selectedId],
  );

  function generateRitual() {
    setRunState("running");
    setActiveStage(0);
    setVisibleTrace([]);
    setConfirmed(false);
  }

  function resetFlow() {
    setStep("brief");
    setRunState("idle");
    setActiveStage(0);
    setVisibleTrace([]);
    setSelectedId("protein-bowl");
    setConfirmed(false);
  }

  useEffect(() => {
    if (runState !== "running") {
      return undefined;
    }

    const stageTimers = timeline.map((_, index) =>
      window.setTimeout(() => setActiveStage(index), index * 420),
    );
    const traceTimers = mcpTrace.map((item, index) =>
      window.setTimeout(() => {
        setVisibleTrace((current) => [...current, item]);
        setActiveStage(Math.min(index + 1, timeline.length - 1));
      }, item.delay),
    );
    const doneTimer = window.setTimeout(() => {
      setStep("ritual");
      setRunState("done");
      setActiveStage(timeline.length - 1);
    }, 2200);

    return () => {
      [...stageTimers, ...traceTimers, doneTimer].forEach(window.clearTimeout);
    };
  }, [runState]);

  return (
    <main className="app-shell">
      <section className="workspace">
        <aside className="brand-panel" aria-label="Product overview">
          <nav className="topline">
            <span className="logo-mark">SR</span>
            <span>Swiggy Rituals</span>
          </nav>

          <div className="hero-copy">
            <p className="eyebrow">Permission-first commerce agent</p>
            <h1>Turn daily food decisions into one-tap rituals.</h1>
            <p>
              A focused Swiggy MCP demo that converts a vague lunch goal into a
              ready-to-confirm weekday order.
            </p>
          </div>

          <div className="signal-list">
            <Signal icon={Utensils} label="Food MCP" value="Menu search, cart, order" />
            <Signal icon={ShieldCheck} label="Safe by design" value="Always asks before spend" />
            <Signal icon={CalendarCheck} label="Repeatable" value="Saved as a weekday ritual" />
          </div>
        </aside>

        <section className="flow-panel" aria-label="Ritual builder">
          <header className="flow-header">
            <div>
              <p className="eyebrow">Live demo flow</p>
              <h2>Weekday Lunch Ritual</h2>
            </div>
            <button className="ghost-button" type="button" onClick={resetFlow}>
              <RotateCcw size={16} />
              Reset
            </button>
          </header>

          {step === "brief" ? (
            <BriefState
              activeStage={activeStage}
              prompt={prompt}
              runState={runState}
              visibleTrace={visibleTrace}
              onGenerate={generateRitual}
              onPromptChange={setPrompt}
            />
          ) : (
            <RitualState
              selectedMeal={selectedMeal}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              visibleTrace={visibleTrace}
            />
          )}
        </section>
      </section>
    </main>
  );
}

function BriefState({
  activeStage,
  prompt,
  runState,
  visibleTrace,
  onGenerate,
  onPromptChange,
}) {
  const isRunning = runState === "running";

  return (
    <div className="brief-layout">
      <div className="prompt-box">
        <div className="prompt-icon">
          <MessageSquareText size={20} />
        </div>
        <div className="prompt-content">
          <p className="prompt-label">User request</p>
          <textarea
            aria-label="Ritual request"
            className="prompt-input"
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
          />
        </div>
      </div>

      <div className="intake-grid">
        <Intake label="Budget" value="Rs. 300 max" />
        <Intake label="Diet" value="High protein, light spice" />
        <Intake label="Location" value="Indiranagar office" />
        <Intake label="Timing" value="Mon-Fri, 1:15 PM" />
      </div>

      {isRunning ? (
        <AgentRun activeStage={activeStage} visibleTrace={visibleTrace} />
      ) : (
        <button
          className="primary-button"
          type="button"
          onClick={onGenerate}
          disabled={!prompt.trim()}
        >
          Build lunch ritual
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}

function RitualState({
  selectedMeal,
  selectedId,
  setSelectedId,
  confirmed,
  setConfirmed,
  visibleTrace,
}) {
  return (
    <div className="ritual-layout">
      <div className="agent-strip">
        {timeline.map((item, index) => (
          <div className="agent-step is-complete" key={item}>
            <span>{index + 1}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>

      <section className="trace-panel" aria-label="MCP action trace">
        <div>
          <p className="eyebrow">MCP trace</p>
          <h3>Food tools used</h3>
        </div>
        <div className="trace-list">
          {visibleTrace.map((item) => (
            <div className="trace-row" key={item.tool}>
              <code>{item.tool}</code>
              <span>{item.result}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="recommendations" aria-label="Meal recommendations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Best matches</p>
            <h3>Today's shortlist</h3>
          </div>
          <span className="status-pill">
            <Sparkles size={15} />
            Optimized
          </span>
        </div>

        <div className="meal-list">
          {meals.map((meal) => (
            <button
              className={`meal-row ${meal.id === selectedId ? "is-selected" : ""}`}
              key={meal.id}
              type="button"
              onClick={() => setSelectedId(meal.id)}
            >
              <span className="score">{meal.score}</span>
              <span className="meal-main">
                <strong>{meal.name}</strong>
                <small>{meal.restaurant}</small>
              </span>
              <span className="meal-meta">
                <small>
                  <IndianRupee size={13} />
                  {meal.price}
                </small>
                <small>
                  <Clock3 size={13} />
                  {meal.eta}
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="confirmation-panel" aria-label="Order confirmation">
        <div>
          <p className="eyebrow">Ready to confirm</p>
          <h3>{selectedMeal.name}</h3>
          <p>{selectedMeal.reason}</p>
        </div>

        <div className="tag-row">
          {selectedMeal.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="order-summary">
          <Summary icon={MapPin} label="Deliver to" value="Indiranagar office" />
          <Summary icon={Clock3} label="Arrives in" value={selectedMeal.eta} />
          <Summary icon={CalendarCheck} label="Ritual" value="Weekdays at 1:15 PM" />
        </div>

        {confirmed ? (
          <div className="success-state">
            <Check size={20} />
            Ritual saved. Today's order is waiting for Swiggy checkout.
          </div>
        ) : (
          <button
            className="primary-button wide"
            type="button"
            onClick={() => setConfirmed(true)}
          >
            Confirm today's order
            <ArrowRight size={18} />
          </button>
        )}
      </section>

      <section className="library-panel" aria-label="Ritual library">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ritual library</p>
            <h3>One agent, three Swiggy surfaces</h3>
          </div>
          <span className="status-pill">
            <ShieldCheck size={15} />
            Permission-first
          </span>
        </div>
        <div className="ritual-cards">
          {rituals.map((ritual) => {
            const Icon = ritual.icon;

            return (
              <div className="ritual-card" key={ritual.id}>
                <div className="ritual-card-top">
                  <Icon size={19} />
                  <span>{ritual.status}</span>
                </div>
                <strong>{ritual.name}</strong>
                <small>{ritual.surface}</small>
                <p>{ritual.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AgentRun({ activeStage, visibleTrace }) {
  return (
    <section className="agent-run" aria-live="polite">
      <div className="agent-run-header">
        <span>
          <Bot size={17} />
          Agent run
        </span>
        <strong>{timeline[activeStage]}</strong>
      </div>
      <div className="run-progress">
        {timeline.map((item, index) => (
          <span
            className={index <= activeStage ? "is-active" : ""}
            key={item}
            style={{ "--index": index }}
          />
        ))}
      </div>
      <div className="mini-trace">
        {visibleTrace.length === 0 ? (
          <div className="trace-placeholder">
            <Flame size={16} />
            Preparing Swiggy Food tool calls
          </div>
        ) : (
          visibleTrace.map((item) => (
            <div className="trace-row" key={item.tool}>
              <code>{item.tool}</code>
              <span>{item.result}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Signal({ icon: Icon, label, value }) {
  return (
    <div className="signal">
      <Icon size={18} />
      <span>
        <strong>{label}</strong>
        <small>{value}</small>
      </span>
    </div>
  );
}

function Intake({ label, value }) {
  return (
    <div className="intake">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Summary({ icon: Icon, label, value }) {
  return (
    <div className="summary-row">
      <Icon size={17} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
