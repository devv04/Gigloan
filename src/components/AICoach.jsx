import { useState, useRef, useEffect } from "react";
import API_BASE_URL from '../config/api';
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

const buildSystemPrompt = (w) => `
You are GigScore AI — a friendly, smart financial coach specifically for Indian gig workers.
You are currently advising ${w.name} who works as a gig worker on ${w.platform}.

Their current financial snapshot:
- GigScore: ${w.gigScore} out of 850
- Risk Level: ${w.riskLabel}
- Average Monthly Income: ₹${w.avgMonthlyIncome?.toLocaleString('en-IN')}
- Platform Tenure: ${w.tenure} months
- Expense Ratio: ${w.expenseRatio}% of income
- Auto Tax Saved: ₹${w.taxSaved?.toLocaleString('en-IN')}
- Loan Eligibility: ₹${w.loanEligibility?.toLocaleString('en-IN')}
- Income Trend: ${w.incomeTrend > 0 ? '+' : ''}${w.incomeTrend}% over 3 months
- Highest Expense Category: ${w.topExpenseCategory}
- Monthly Income: ₹${w.monthlyIncome?.[0]?.toLocaleString('en-IN')} → ₹${w.monthlyIncome?.[1]?.toLocaleString('en-IN')} → ₹${w.monthlyIncome?.[2]?.toLocaleString('en-IN')}

YOUR PERSONALITY AND RULES:
1. Always be warm, encouraging, and specific — never generic
2. Always reference their ACTUAL numbers, never hypothetical ones
3. Keep responses concise — max 4-5 sentences per reply
4. Use simple language — this worker may not be finance-savvy
5. Occasionally use Hinglish naturally (bhai, ek kaam karo, sahi hai)
6. When giving advice, always tie it back to improving their GigScore
7. If they ask about loans, always calculate actual EMI for them
8. Never say "I don't know" — use the data you have to give the best possible answer
9. End each response with one specific actionable tip
10. Use ₹ symbol for all amounts, Indian number formatting

EXAMPLE GOOD RESPONSE:
"Raju bhai, your GigScore of 712 is solid! Your ₹18,500 loan eligibility looks good — at 1.5%/month, your EMI would be around ₹3,200, which is only 16% of your monthly income. That's very manageable. Ek kaam karo — reduce fuel expenses by ₹500/month and your score will cross 730 within 6 weeks."
`;

const QUICK_QUESTIONS = [
  "How can I improve my score?",
  "Should I take the loan now?",
  "How much tax will I owe?",
  "What's my biggest money leak?",
];

export default function AICoach({ workerData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const systemPromptRef = useRef("");

  // Initialize / reset on worker change
  useEffect(() => {
    if (!workerData) return;
    systemPromptRef.current = buildSystemPrompt(workerData);
    setMessages([
      {
        role: "assistant",
        text: `Namaste ${workerData.name?.split(" ")[0]}! 👋\nI'm your GigScore AI Coach. Your current score is ${workerData.gigScore} and you're eligible for a ₹${workerData.loanEligibility?.toLocaleString("en-IN")} loan. What would you like to know?`,
        timestamp: new Date(),
      },
    ]);
  }, [workerData]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (overrideText) => {
    const text = (overrideText || inputText).trim();
    if (!text || isLoading) return;
    setInputText("");

    const userMsg = { role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation history (skip the welcome message)
      const history = messages
        .slice(1) // skip welcome
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch(`${API_BASE_URL}/api/ai-coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: systemPromptRef.current,
          history,
          message: text,
        }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.reply, timestamp: new Date() },
        ]);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("AI Coach error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, kuch technical issue aa gaya. Please try again in a few seconds!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fmtTime = (d) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  if (!workerData) return null;

  return (
    <>
      {/* ── Floating Action Button ── */}
      <button
        id="ai-coach-fab"
        onClick={() => setIsOpen((o) => !o)}
        className="ai-fab"
        aria-label="Open AI Coach"
      >
        <span className="ai-fab__ring" />
        <MessageCircle size={26} />
        <span className="ai-fab__badge">AI</span>
      </button>

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div className="ai-panel" role="dialog" aria-label="AI Coach Chat">
          {/* Header */}
          <div className="ai-panel__header">
            <div className="ai-panel__header-left">
              <Sparkles size={16} className="ai-panel__sparkle" />
              <div>
                <span className="ai-panel__title">GigScore AI</span>
                <span className="ai-panel__subtitle">
                  Advising {workerData.name} • Score: {workerData.gigScore}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="ai-panel__close">
              <X size={18} />
            </button>
            <span className="ai-panel__live">● Live</span>
          </div>

          {/* Messages */}
          <div className="ai-panel__messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ai-msg--${m.role}`}>
                <div className={`ai-msg__bubble ai-msg__bubble--${m.role}`}>
                  {m.text}
                </div>
                <span className="ai-msg__time">{fmtTime(m.timestamp)}</span>
              </div>
            ))}

            {/* Quick Chips (only after welcome) */}
            {messages.length === 1 && !isLoading && (
              <div className="ai-chips">
                {QUICK_QUESTIONS.map((q) => (
                  <button key={q} className="ai-chip" onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && (
              <div className="ai-msg ai-msg--assistant">
                <div className="ai-msg__bubble ai-msg__bubble--assistant ai-typing">
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                  <span className="ai-dot" />
                  <span className="ai-typing__label">GigScore AI is thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-panel__input-bar">
            <input
              ref={inputRef}
              className="ai-panel__input"
              type="text"
              placeholder="Ask me anything about your finances..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKey}
              disabled={isLoading}
            />
            <button
              className="ai-panel__send"
              onClick={() => sendMessage()}
              disabled={isLoading || !inputText.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="ai-panel__footer">Powered by Google Gemini AI 🤖</p>
        </div>
      )}

      {/* ── Scoped Styles ── */}
      <style>{`
        /* ── FAB ── */
        .ai-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6, #6366F1);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(59,130,246,.45);
          transition: transform .2s, box-shadow .2s;
        }
        .ai-fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(59,130,246,.55); }

        .ai-fab__ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(59,130,246,.5);
          animation: ai-pulse 2s ease-in-out infinite;
        }
        @keyframes ai-pulse {
          0%,100% { transform: scale(1); opacity: .6; }
          50%     { transform: scale(1.18); opacity: 0; }
        }

        .ai-fab__badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #EF4444;
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 5px;
          border-radius: 8px;
          line-height: 1;
          letter-spacing: .5px;
        }

        /* ── Panel ── */
        .ai-panel {
          position: fixed;
          bottom: 96px;
          right: 24px;
          z-index: 9998;
          width: 380px;
          height: 520px;
          background: #1E293B;
          border: 1px solid #334155;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,.5);
          animation: ai-slideIn .25s ease-out;
          font-family: 'Inter', system-ui, sans-serif;
        }
        @keyframes ai-slideIn {
          from { opacity: 0; transform: translateY(20px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Header */
        .ai-panel__header {
          background: #0F172A;
          padding: 14px 16px 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          position: relative;
          border-bottom: 1px solid #1E293B;
        }
        .ai-panel__header-left { display: flex; align-items: center; gap: 10px; }
        .ai-panel__sparkle { color: #FBBF24; }
        .ai-panel__title { display: block; font-size: 14px; font-weight: 700; color: #fff; }
        .ai-panel__subtitle { display: block; font-size: 11px; color: #3B82F6; margin-top: 1px; }
        .ai-panel__close {
          background: transparent; border: none; color: #94A3B8; cursor: pointer;
          padding: 4px; border-radius: 6px; display: flex; align-items: center;
        }
        .ai-panel__close:hover { color: #fff; background: rgba(255,255,255,.06); }
        .ai-panel__live {
          width: 100%;
          display: block;
          font-size: 10px;
          color: #10B981;
          margin-top: 6px;
          font-weight: 600;
          letter-spacing: .3px;
        }

        /* Messages */
        .ai-panel__messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px 14px 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ai-panel__messages::-webkit-scrollbar { width: 4px; }
        .ai-panel__messages::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }

        .ai-msg { display: flex; flex-direction: column; max-width: 85%; }
        .ai-msg--user  { align-self: flex-end; align-items: flex-end; }
        .ai-msg--assistant { align-self: flex-start; align-items: flex-start; }

        .ai-msg__bubble {
          padding: 10px 14px;
          font-size: 13px;
          line-height: 1.55;
          color: #F1F5F9;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .ai-msg__bubble--user {
          background: #3B82F6;
          border-radius: 14px 14px 4px 14px;
        }
        .ai-msg__bubble--assistant {
          background: #334155;
          border-radius: 14px 14px 14px 4px;
        }
        .ai-msg__time {
          font-size: 10px;
          color: #64748B;
          margin-top: 3px;
          padding: 0 4px;
        }

        /* Quick chips */
        .ai-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 4px 0 8px;
        }
        .ai-chip {
          background: transparent;
          border: 1px solid #3B82F680;
          color: #60A5FA;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: background .15s, color .15s;
          font-family: inherit;
        }
        .ai-chip:hover { background: #3B82F620; color: #93C5FD; }

        /* Typing dots */
        .ai-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 12px 16px;
        }
        .ai-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #60A5FA;
          animation: ai-bounce .6s ease-in-out infinite alternate;
        }
        .ai-dot:nth-child(2) { animation-delay: .15s; }
        .ai-dot:nth-child(3) { animation-delay: .3s; }
        @keyframes ai-bounce {
          to { transform: translateY(-6px); opacity: .4; }
        }
        .ai-typing__label {
          font-size: 11px;
          color: #94A3B8;
          margin-left: 4px;
        }

        /* Input bar */
        .ai-panel__input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-top: 1px solid #334155;
          background: #1E293B;
        }
        .ai-panel__input {
          flex: 1;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 24px;
          padding: 10px 16px;
          color: #F1F5F9;
          font-size: 13px;
          outline: none;
          font-family: inherit;
          transition: border-color .15s;
        }
        .ai-panel__input::placeholder { color: #64748B; }
        .ai-panel__input:focus { border-color: #3B82F6; }
        .ai-panel__input:disabled { opacity: .5; }
        .ai-panel__send {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: #3B82F6;
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background .15s, opacity .15s;
        }
        .ai-panel__send:hover { background: #2563EB; }
        .ai-panel__send:disabled { opacity: .4; cursor: default; }

        .ai-panel__footer {
          text-align: center;
          font-size: 10px;
          color: #475569;
          padding: 4px 0 8px;
          margin: 0;
        }

        /* mobile */
        @media (max-width: 440px) {
          .ai-panel { width: calc(100vw - 32px); right: 16px; bottom: 88px; height: 460px; }
          .ai-fab { bottom: 16px; right: 16px; }
        }
      `}</style>
    </>
  );
}
