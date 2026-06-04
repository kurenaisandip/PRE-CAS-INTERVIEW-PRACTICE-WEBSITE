import { useState, useEffect, useRef } from "react";
import {
  Play,
  SkipForward,
  ArrowRight,
  Pause,
  RotateCcw,
  RefreshCw,
  X,
  Volume2,
  VolumeX,
  Mic,
  Lightbulb,
  Check,
} from "lucide-react";
 
const HIGH = "high";
const NORMAL = "normal";

type Priority = typeof HIGH | typeof NORMAL;

type Question = { text: string; priority: Priority };

type Result = {
  text: string;
  priority: Priority;
  seconds: number;
  skipped: boolean;
};

const QUESTIONS: Question[] = [
  // ---- HIGH PRIORITY ----
  { text: "How did the reputation of UK universities influence your choice to study there?", priority: HIGH },
  { text: "How does this University's reputation and ranking influence your decision to study here?", priority: HIGH },
  { text: "What unique features or strengths of other universities caught your attention?", priority: HIGH },
  { text: "What is the main focus of your course and what do you aim to achieve by studying it? How does your chosen course align with your previous studies and interests?", priority: HIGH },
  { text: "Did you consider living with roommates, and why did you choose or reject this option?", priority: HIGH },
  { text: "Do you know how many hours you are allowed to work as a student in the UK?", priority: HIGH },
  { text: "Have you researched the UKVI financial requirements for international students? If so, how have you ensured you meet these requirements?", priority: HIGH },
  { text: "Discuss the primary sources of funding you will use to support your studies and living expenses.", priority: HIGH },
  { text: "How do you plan to balance your studies and a part-time job?", priority: HIGH },
  { text: "Are you planning to bring any family members with you to the UK? If yes, please describe what they will be doing while you study.", priority: HIGH },
  // ---- NORMAL PRIORITY ----
  { text: "Describe yourself in three (3) words.", priority: NORMAL },
  { text: "How would you like to introduce yourself?", priority: NORMAL },
  { text: "What do you think will be the three biggest benefits of studying and living in the UK?", priority: NORMAL },
  { text: "Why do you want to study the course?", priority: NORMAL },
  { text: "Where will you stay? Describe your accommodation, rent, distance to the university, travel details, etc.", priority: NORMAL },
  { text: "Have you researched the UKVI financial requirements for international students?", priority: NORMAL },
  { text: "Can you describe your short-term and long-term goals after completing your degree at our university?", priority: NORMAL },
  { text: "When was your last education qualification completed and what have you been doing professionally since?", priority: NORMAL },
  { text: "Have you ever received a visa refusal? If so, please explain why?", priority: NORMAL },
  { text: "Do you have any known health conditions that may affect your ability to study with us?", priority: NORMAL },
  { text: "What three items would you take to a desert island, and why?", priority: NORMAL },
  { text: "If you could be someone else for a day, who would it be and why?", priority: NORMAL },
  { text: "Do you have a plan for unexpected financial emergencies in the UK?", priority: NORMAL },
  { text: "What are the good things about having a degree that's known all over the world, and how will this help your career?", priority: NORMAL },
];
 
const THINK_OPTIONS = [10, 15, 20, 30];
 
const TIPS = [
  "Take a breath. Outline 2–3 key points before you start.",
  "Answer the question directly first, then add a personal reason.",
  "Use a real example or number where you can — it sounds credible.",
  "Keep it natural and conversational, not memorised.",
];
 
function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Module-scope helpers keep impure randomness out of the component render path
// (required by the React Compiler purity rules).
function shuffled<T>(arr: T[]): T[] {
  const list = [...arr];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function randomTip() {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}
 
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
 
.cas-root * { box-sizing: border-box; }
.cas-root {
  --paper:#FAF6EF; --paper-2:#F1E9DC; --card:#FFFDF9;
  --ink:#221C15; --ink-soft:#5B5247; --ink-faint:#8C8275; --line:#E7DDCD;
  --accent:#15635B; --accent-deep:#0E4A43; --accent-soft:#DCEAE6;
  --warn:#BC4E2C; --warn-soft:#F4E1D7;
  font-family:'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
  color:var(--ink);
  min-height:100%; width:100%;
  display:flex; align-items:center; justify-content:center;
  padding:28px 16px; position:relative; -webkit-font-smoothing:antialiased;
  background:
    radial-gradient(60% 55% at 12% -5%, rgba(21,99,91,0.08), transparent 65%),
    radial-gradient(55% 55% at 105% 105%, rgba(188,78,44,0.07), transparent 65%),
    var(--paper);
}
.cas-root::before{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:0.45; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}
.cas-card{
  position:relative; z-index:1; width:100%; max-width:680px;
  background:var(--card); border:1px solid var(--line); border-radius:22px; padding:30px;
  box-shadow:0 1px 0 rgba(255,255,255,0.8) inset, 0 22px 48px -28px rgba(34,28,21,0.4), 0 5px 14px -10px rgba(34,28,21,0.22);
}
@media (min-width:640px){ .cas-card{ padding:42px; } }
 
.eyebrow{ font-size:11.5px; letter-spacing:0.2em; text-transform:uppercase; color:var(--accent-deep); font-weight:700; }
.display{ font-family:'Fraunces', Georgia, serif; font-weight:600; line-height:1.07; letter-spacing:-0.015em; }
.qtext{ font-family:'Fraunces', Georgia, serif; font-weight:500; line-height:1.2; letter-spacing:-0.01em; }
.mono{ font-family:'JetBrains Mono', ui-monospace, monospace; font-variant-numeric:tabular-nums; }
.muted{ color:var(--ink-soft); }
.faint{ color:var(--ink-faint); }
 
.btn{ font-family:inherit; font-weight:600; font-size:15px; border:none; cursor:pointer; border-radius:999px;
  padding:13px 24px; display:inline-flex; align-items:center; justify-content:center; gap:8px;
  transition:transform .12s ease, background .18s ease, box-shadow .18s ease, color .18s ease; }
.btn:active{ transform:translateY(1px) scale(0.992); }
.btn-primary{ background:var(--accent); color:#FBFCF9; box-shadow:0 9px 20px -11px rgba(21,99,91,0.85); }
.btn-primary:hover{ background:var(--accent-deep); }
.btn-ghost{ background:transparent; color:var(--ink-soft); box-shadow:inset 0 0 0 1.5px var(--line); }
.btn-ghost:hover{ color:var(--ink); box-shadow:inset 0 0 0 1.5px var(--ink-faint); background:rgba(0,0,0,0.018); }
.btn-lg{ padding:16px 30px; font-size:16px; }
.btn-block{ width:100%; }
 
.icon-btn{ width:40px; height:40px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center;
  background:transparent; border:none; cursor:pointer; color:var(--ink-soft); transition:background .15s ease, color .15s ease; }
.icon-btn:hover{ background:rgba(0,0,0,0.05); color:var(--ink); }
 
.seg{ display:inline-flex; background:var(--paper-2); border:1px solid var(--line); border-radius:999px; padding:4px; gap:2px; flex-wrap:wrap; }
.seg-item{ font-family:inherit; font-size:14px; font-weight:600; border:none; background:transparent; color:var(--ink-soft);
  padding:9px 15px; border-radius:999px; cursor:pointer; transition:all .15s ease; white-space:nowrap; }
.seg-item:hover{ color:var(--ink); }
.seg-item.active{ background:var(--card); color:var(--ink); box-shadow:0 1px 3px rgba(34,28,21,0.14); }
.seg-count{ font-weight:500; opacity:.6; }
 
.badge{ display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; letter-spacing:0.09em;
  text-transform:uppercase; padding:5px 11px; border-radius:999px; }
.badge-high{ background:var(--warn-soft); color:var(--warn); }
.badge-normal{ background:var(--accent-soft); color:var(--accent-deep); }
.dot{ width:7px; height:7px; border-radius:999px; display:inline-block; }
 
.track{ height:5px; border-radius:999px; background:var(--paper-2); overflow:hidden; }
.track-fill{ height:100%; background:var(--accent); border-radius:999px; transition:width .45s ease; }
 
.stat{ background:var(--paper-2); border:1px solid var(--line); border-radius:15px; padding:16px 12px; text-align:center; }
.stat-num{ font-family:'Fraunces', serif; font-weight:600; font-size:26px; line-height:1; }
.stat-label{ font-size:12px; color:var(--ink-faint); margin-top:7px; }
 
.rev-row{ display:flex; align-items:center; gap:12px; padding:12px 2px; border-bottom:1px solid var(--line); }
.rev-row:last-child{ border-bottom:none; }
 
.pill{ display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; color:var(--warn);
  background:var(--warn-soft); padding:6px 12px; border-radius:999px; }
 
@keyframes riseIn{ from{ opacity:0; transform:translateY(12px);} to{ opacity:1; transform:none; } }
.rise{ animation:riseIn .5s cubic-bezier(.2,.75,.2,1) both; }
@keyframes pulseDot{ 0%,100%{ transform:scale(1); opacity:1;} 50%{ transform:scale(1.55); opacity:.4;} }
.rec-dot{ width:10px; height:10px; border-radius:999px; background:var(--warn); animation:pulseDot 1.4s ease-in-out infinite; }
`;

function App() {
  const [screen, setScreen] = useState<"setup" | "interview" | "done">("setup");
  const [setFilter, setSetFilter] = useState<"all" | Priority>("all");
  const [shuffle, setShuffle] = useState(false);
  const [thinkSeconds, setThinkSeconds] = useState(15);
  const [soundOn, setSoundOn] = useState(true);

  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"thinking" | "answering">("thinking");
  const [thinkLeft, setThinkLeft] = useState(15);
  const [answerElapsed, setAnswerElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [tip, setTip] = useState(TIPS[0]);

  const audioRef = useRef<AudioContext | null>(null);
 
  const highCount = QUESTIONS.filter((q) => q.priority === HIGH).length;
  const normalCount = QUESTIONS.filter((q) => q.priority === NORMAL).length;
 
  function initAudio() {
    try {
      if (!audioRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (Ctx) audioRef.current = new Ctx();
      }
      if (audioRef.current && audioRef.current.state === "suspended") {
        audioRef.current.resume();
      }
    } catch {
      /* audio optional */
    }
  }

  function beep(freq: number, duration: number, volume: number) {
    if (!soundOn) return;
    try {
      const ctx = audioRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);
      osc.start(now);
      osc.stop(now + duration / 1000 + 0.02);
    } catch {
      /* ignore */
    }
  }

  function buildQueue() {
    const list = QUESTIONS.filter((q) =>
      setFilter === "all" ? true : q.priority === setFilter
    );
    return shuffle ? shuffled(list) : list;
  }
 
  function startInterview() {
    const list = buildQueue();
    if (list.length === 0) return;
    initAudio();
    setQueue(list);
    setIndex(0);
    setPhase("thinking");
    setThinkLeft(thinkSeconds);
    setAnswerElapsed(0);
    setPaused(false);
    setResults([]);
    setTip(randomTip());
    setScreen("interview");
  }
 
  function startAnswering() {
    setPhase("answering");
    setThinkLeft(0);
    beep(760, 230, 0.08);
  }
 
  function goNext() {
    setResults((r) => [
      ...r,
      {
        text: queue[index].text,
        priority: queue[index].priority,
        seconds: phase === "answering" ? answerElapsed : 0,
        skipped: phase === "thinking",
      },
    ]);
    if (index + 1 >= queue.length) {
      setScreen("done");
    } else {
      setIndex((i) => i + 1);
      setPhase("thinking");
      setThinkLeft(thinkSeconds);
      setAnswerElapsed(0);
      setPaused(false);
      setTip(randomTip());
    }
  }
 
  function endSession() {
    setScreen("done");
  }
 
  // main tick — counts the thinking countdown down and the answer timer up, and
  // transitions thinking -> answering the moment the countdown runs out. The state
  // updates live in the timeout callback (not the effect body), so they don't trigger
  // cascading renders.
  useEffect(() => {
    if (screen !== "interview" || paused) return;
    if (phase === "thinking") {
      const id = setTimeout(() => {
        if (thinkLeft <= 1) {
          setThinkLeft(0);
          setPhase("answering");
          beep(760, 230, 0.08);
        } else {
          setThinkLeft(thinkLeft - 1);
        }
      }, 1000);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setAnswerElapsed(answerElapsed + 1), 1000);
    return () => clearTimeout(id);
  }, [screen, paused, phase, thinkLeft, answerElapsed]); // eslint-disable-line react-hooks/exhaustive-deps
 
  // soft countdown ticks in the last 3 seconds
  useEffect(() => {
    if (
      screen === "interview" &&
      phase === "thinking" &&
      !paused &&
      thinkLeft > 0 &&
      thinkLeft <= 3
    ) {
      beep(430, 95, 0.05);
    }
  }, [thinkLeft, phase, screen, paused]); // eslint-disable-line
 
  /* ---------------- SETUP ---------------- */
  function renderSetup() {
    // Count only — avoid calling buildQueue() here, since shuffling during render
    // would re-randomise on every keystroke (and violates render purity).
    const total = QUESTIONS.filter((q) =>
      setFilter === "all" ? true : q.priority === setFilter
    ).length;
    return (
      <div className="cas-card rise">
        <div className="eyebrow">Pre-CAS · UK Student Visa</div>
        <h1 className="display" style={{ fontSize: 36, marginTop: 10 }}>
          Credibility Interview Practice
        </h1>
        <p className="muted" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5, maxWidth: 520 }}>
          You get a few seconds to plan, then answer out loud as if you're in the real
          interview. End any question whenever you're done and move to the next.
        </p>
 
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <div className="faint" style={{ fontSize: 13, fontWeight: 600, marginBottom: 9 }}>
              Which questions?
            </div>
            <div className="seg">
              <button className={`seg-item ${setFilter === "all" ? "active" : ""}`} onClick={() => setSetFilter("all")}>
                All <span className="seg-count">{QUESTIONS.length}</span>
              </button>
              <button className={`seg-item ${setFilter === HIGH ? "active" : ""}`} onClick={() => setSetFilter(HIGH)}>
                High priority <span className="seg-count">{highCount}</span>
              </button>
              <button className={`seg-item ${setFilter === NORMAL ? "active" : ""}`} onClick={() => setSetFilter(NORMAL)}>
                Normal <span className="seg-count">{normalCount}</span>
              </button>
            </div>
          </div>
 
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            <div>
              <div className="faint" style={{ fontSize: 13, fontWeight: 600, marginBottom: 9 }}>
                Thinking time
              </div>
              <div className="seg">
                {THINK_OPTIONS.map((s) => (
                  <button key={s} className={`seg-item ${thinkSeconds === s ? "active" : ""}`} onClick={() => setThinkSeconds(s)}>
                    {s}s
                  </button>
                ))}
              </div>
            </div>
 
            <div>
              <div className="faint" style={{ fontSize: 13, fontWeight: 600, marginBottom: 9 }}>
                Order
              </div>
              <div className="seg">
                <button className={`seg-item ${!shuffle ? "active" : ""}`} onClick={() => setShuffle(false)}>
                  As listed
                </button>
                <button className={`seg-item ${shuffle ? "active" : ""}`} onClick={() => setShuffle(true)}>
                  Shuffle
                </button>
              </div>
            </div>
          </div>
 
          <button className="icon-btn" onClick={() => setSoundOn((v) => !v)} style={{ width: "auto", padding: "8px 12px", gap: 8, alignSelf: "flex-start", fontSize: 14, fontWeight: 600, color: "var(--ink-soft)" }}>
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            Sound cues {soundOn ? "on" : "off"}
          </button>
        </div>
 
        <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 30 }} onClick={startInterview}>
          <Play size={19} fill="currentColor" /> Begin practice · {total} question{total === 1 ? "" : "s"}
        </button>
      </div>
    );
  }
 
  /* ---------------- INTERVIEW ---------------- */
  function renderInterview() {
    const q = queue[index];
    const isHigh = q.priority === HIGH;
    const progress = ((index) / queue.length) * 100;
 
    const R = 56;
    const CIRC = 2 * Math.PI * R;
    const frac = thinkSeconds > 0 ? thinkLeft / thinkSeconds : 0;
    const dashoffset = CIRC * (1 - frac);
    const ringColor = thinkLeft <= 3 ? "var(--warn)" : "var(--accent)";
    const ringTransition = thinkLeft >= thinkSeconds ? "none" : "stroke-dashoffset 1s linear, stroke .3s ease";
 
    return (
      <div className="cas-card">
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="mono faint" style={{ fontSize: 13, fontWeight: 700 }}>
              {String(index + 1).padStart(2, "0")} / {String(queue.length).padStart(2, "0")}
            </span>
            <span className={`badge ${isHigh ? "badge-high" : "badge-normal"}`}>
              <span className="dot" style={{ background: isHigh ? "var(--warn)" : "var(--accent)" }} />
              {isHigh ? "High priority" : "Normal"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button className="icon-btn" title={soundOn ? "Mute" : "Unmute"} onClick={() => setSoundOn((v) => !v)}>
              {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
            </button>
            <button className="icon-btn" title={paused ? "Resume" : "Pause"} onClick={() => setPaused((p) => !p)}>
              {paused ? <Play size={19} /> : <Pause size={19} />}
            </button>
            <button className="icon-btn" title="End session" onClick={endSession}>
              <X size={20} />
            </button>
          </div>
        </div>
 
        <div className="track" style={{ marginTop: 16 }}>
          <div className="track-fill" style={{ width: `${progress}%` }} />
        </div>
 
        {/* question */}
        <div key={index} className="rise" style={{ marginTop: 30, minHeight: 96 }}>
          <h2 className="qtext" style={{ fontSize: 27 }}>{q.text}</h2>
        </div>
 
        {/* timer zone */}
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {phase === "thinking" ? (
            <>
              <div style={{ position: "relative", width: 148, height: 148 }}>
                <svg width="148" height="148" viewBox="0 0 148 148">
                  <circle cx="74" cy="74" r={R} fill="none" stroke="var(--paper-2)" strokeWidth="9" />
                  <circle
                    cx="74" cy="74" r={R} fill="none" stroke={ringColor} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={CIRC} strokeDashoffset={dashoffset}
                    transform="rotate(-90 74 74)" style={{ transition: ringTransition }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span className="mono" style={{ fontSize: 44, fontWeight: 700, color: thinkLeft <= 3 ? "var(--warn)" : "var(--ink)", lineHeight: 1 }}>
                    {thinkLeft}
                  </span>
                  <span className="faint" style={{ fontSize: 12, marginTop: 2 }}>seconds</span>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{paused ? "Paused" : "Thinking time"}</div>
                <div className="muted" style={{ fontSize: 14, marginTop: 6, display: "inline-flex", alignItems: "center", gap: 7, maxWidth: 440 }}>
                  <Lightbulb size={15} style={{ color: "var(--accent)", flexShrink: 0 }} /> {tip}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {!paused && <span className="rec-dot" />}
                <span className="mono" style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {formatTime(answerElapsed)}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <Mic size={16} style={{ color: "var(--warn)" }} /> {paused ? "Paused" : "Answering — speak aloud"}
                </div>
                <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>
                  Press <strong>Next question</strong> when you've finished your answer.
                </div>
              </div>
            </>
          )}
        </div>
 
        {/* controls */}
        <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
          {phase === "thinking" ? (
            <>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={startAnswering}>
                <Mic size={18} /> Start answering
              </button>
              <button className="btn btn-ghost" onClick={goNext}>
                <SkipForward size={17} /> Skip
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-block" onClick={goNext}>
              {index + 1 >= queue.length ? <Check size={18} /> : <ArrowRight size={18} />}
              {index + 1 >= queue.length ? "Finish session" : "Next question"}
            </button>
          )}
        </div>
      </div>
    );
  }
 
  /* ---------------- DONE ---------------- */
  function renderDone() {
    const answered = results.filter((r) => !r.skipped);
    const totalSeconds = answered.reduce((acc, r) => acc + r.seconds, 0);
    const avg = answered.length ? Math.round(totalSeconds / answered.length) : 0;
 
    return (
      <div className="cas-card rise">
        <div className="eyebrow">Session complete</div>
        <h1 className="display" style={{ fontSize: 32, marginTop: 10 }}>Nicely done.</h1>
        <p className="muted" style={{ marginTop: 10, fontSize: 15.5 }}>
          Here's how this round went. The more you rehearse aloud, the more natural these answers become.
        </p>
 
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div className="stat">
            <div className="stat-num">{answered.length}</div>
            <div className="stat-label">Answered</div>
          </div>
          <div className="stat">
            <div className="stat-num mono">{formatTime(totalSeconds)}</div>
            <div className="stat-label">Total speaking</div>
          </div>
          <div className="stat">
            <div className="stat-num mono">{formatTime(avg)}</div>
            <div className="stat-label">Avg / answer</div>
          </div>
        </div>
 
        {results.length > 0 && (
          <div style={{ marginTop: 26 }}>
            <div className="faint" style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Review</div>
            <div style={{ maxHeight: 260, overflowY: "auto", marginRight: -6, paddingRight: 6 }}>
              {results.map((r, i) => (
                <div className="rev-row" key={i}>
                  <span className="dot" style={{ flexShrink: 0, background: r.priority === HIGH ? "var(--warn)" : "var(--accent)" }} />
                  <span style={{ flex: 1, fontSize: 14.5, lineHeight: 1.35 }}>{r.text}</span>
                  <span className="mono faint" style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {r.skipped ? "skipped" : formatTime(r.seconds)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
 
        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ flex: 1, minWidth: 200 }} onClick={startInterview}>
            <RefreshCw size={18} /> Practice this set again
          </button>
          <button className="btn btn-ghost" onClick={() => setScreen("setup")}>
            <RotateCcw size={17} /> Change settings
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="cas-root">
      <style>{STYLES}</style>
      {screen === "setup" && renderSetup()}
      {screen === "interview" && renderInterview()}
      {screen === "done" && renderDone()}
    </div>
  );
}

export default App
