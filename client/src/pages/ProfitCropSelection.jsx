import { useState } from "react";
import Header from "@/components/Header";

const fields = [
  { key: "nitrogen",    label: "Nitrogen",    icon: "N", unit: "mg/kg", min: 0,   max: 140, hint: "Range: 0 – 140" },
  { key: "phosphorous", label: "Phosphorous", icon: "P", unit: "mg/kg", min: 5,   max: 145, hint: "Range: 5 – 145" },
  { key: "potassium",   label: "Potassium",   icon: "K", unit: "mg/kg", min: 5,   max: 205, hint: "Range: 5 – 205" },
  { key: "temperature", label: "Temperature", icon: "🌡", unit: "°C",   min: 8,   max: 45,  hint: "Range: 8 – 45"  },
  { key: "humidity",    label: "Humidity",    icon: "💧", unit: "%",    min: 14,  max: 100, hint: "Range: 14 – 100"},
  { key: "ph",          label: "Soil pH",     icon: "⚗", unit: "pH",   min: 3.5, max: 9.5, hint: "Range: 3.5 – 9.5"},
  { key: "rainfall",    label: "Rainfall",    icon: "🌧", unit: "mm",   min: 20,  max: 300, hint: "Range: 20 – 300"},
];

const initialForm = fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});

const formatCurrency = (val) =>
  val !== null ? `₹${val.toLocaleString("en-IN")}` : "N/A";

const PROFIT_COLORS = {
  high:     { bg: "#e8f5e9", border: "#66bb6a", badge: "#2e7d32", text: "#1b5e20" },
  moderate: { bg: "#fff8e1", border: "#ffd54f", badge: "#f57f17", text: "#e65100" },
  low:      { bg: "#fdf3f2", border: "#ef9a9a", badge: "#c62828", text: "#8b2020" },
};

const getProfitLevel = (profit) => {
  if (profit === null) return "low";
  if (profit > 30000)  return "high";
  if (profit > 15000)  return "moderate";
  return "low";
};

const RANK_STYLES = {
  1: { bg: "#fff8e1", border: "#ffd54f", label: "🏆 Best Choice",    color: "#f57f17" },
  2: { bg: "#f5f5f5", border: "#bdbdbd", label: "🥈 2nd Option",     color: "#616161" },
  3: { bg: "#fff3e0", border: "#ffcc80", label: "🥉 3rd Option",     color: "#e65100" },
};

export default function ProfitCropSelection() {
  const [form, setForm]       = useState(initialForm);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [touched, setTouched] = useState({});
  const [expanded, setExpanded] = useState(null);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setTouched(prev => ({ ...prev, [key]: true }));
    setError(null);
  };

  const validate = () => {
    for (const f of fields) {
      if (form[f.key] === "" || form[f.key] === null) {
        return `Please fill in ${f.label}`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError({ message: validationError });
      return;
    }

    setLoading(true);
    setResults([]);
    setError(null);
    setExpanded(null);

    try {
      const payload = {};
      for (const f of fields) payload[f.key] = parseFloat(form[f.key]);

      const res  = await fetch("http://localhost:3000/api/profit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError({ message: data.error || "Analysis failed" });
        return;
      }
      setResults(data.results);
    } catch (e) {
      setError({ message: "Cannot reach server. Make sure backend is running." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResults([]);
    setError(null);
    setTouched({});
    setExpanded(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --soil: #2c1a0e;
          --earth: #5c3d1e;
          --moss: #3a5a2a;
          --sage: #6b8f5e;
          --mint: #b8d4a8;
          --cream: #f5efe6;
          --wheat: #e8d5b0;
          --amber: #c97c2e;
          --card-bg: #faf6f0;
          --border: rgba(92,61,30,0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .profit-root {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow-x: hidden;
        }

        .bg-texture {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(107,143,94,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 90% 80%, rgba(201,124,46,0.08) 0%, transparent 60%);
        }

        .wrapper {
          position: relative; z-index: 1;
          max-width: 900px; margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* HEADER */
        .profit-header { text-align: center; margin-bottom: 48px; }
        .header-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--moss); color: var(--mint);
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; padding: 6px 16px;
          border-radius: 40px; margin-bottom: 20px;
        }
        .profit-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900;
          color: var(--soil); line-height: 1.1; margin-bottom: 14px;
        }
        .profit-header h1 em { font-style: normal; color: var(--amber); }
        .profit-header p {
          color: var(--earth); font-size: 15px;
          max-width: 500px; margin: 0 auto; line-height: 1.6;
        }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 0 auto 40px; max-width: 300px;
        }
        .divider-line { flex: 1; height: 1px; background: var(--border); }
        .divider-icon { color: var(--sage); font-size: 18px; }

        /* FORM */
        .form-card {
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 24px; padding: 40px;
          box-shadow: 0 4px 40px rgba(44,26,14,0.06);
          margin-bottom: 32px;
        }

        .form-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: var(--soil);
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 10px;
        }
        .form-section-title::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        .fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px; margin-bottom: 8px;
        }

        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
          text-transform: uppercase; color: var(--earth);
          display: flex; align-items: center; justify-content: space-between;
        }
        .field-label-left { display: flex; align-items: center; gap: 6px; }
        .field-icon {
          width: 22px; height: 22px; border-radius: 6px;
          background: var(--moss); color: white;
          font-size: 10px; font-weight: 700;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .field-unit { font-size: 10px; color: var(--sage); font-weight: 400; }
        .field-input {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid var(--border); border-radius: 12px;
          background: white; font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: var(--soil); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input:focus {
          border-color: var(--sage);
          box-shadow: 0 0 0 3px rgba(107,143,94,0.15);
        }
        .field-input::placeholder { color: #b8a898; }
        .field-hint { font-size: 10px; color: var(--sage); margin-top: 2px; }

        .error-box {
          background: #fdf3f2; border: 1px solid #e8b4b0;
          border-radius: 12px; padding: 12px 16px;
          color: #8b2020; font-size: 13px; margin-bottom: 20px;
        }

        .actions {
          display: flex; gap: 12px; margin-top: 32px;
          justify-content: flex-end;
        }
        .btn-reset {
          padding: 13px 24px; border-radius: 12px;
          border: 1.5px solid var(--border); background: white;
          color: var(--earth); font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-reset:hover { border-color: var(--sage); color: var(--moss); }
        .btn-submit {
          padding: 13px 32px; border-radius: 12px;
          border: none; background: var(--moss); color: var(--mint);
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(58,90,42,0.25);
        }
        .btn-submit:hover:not(:disabled) { background: var(--soil); transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }
        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(184,212,168,0.3);
          border-top-color: var(--mint);
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* RESULTS HEADER */
        .results-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: var(--soil);
          margin-bottom: 8px;
        }
        .results-subtitle {
          font-size: 13px; color: var(--sage); margin-bottom: 24px;
        }

        /* SCORE LEGEND */
        .legend {
          display: flex; gap: 16px; flex-wrap: wrap;
          margin-bottom: 24px; padding: 14px 18px;
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 12px;
        }
        .legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--earth);
        }
        .legend-dot {
          width: 10px; height: 10px; border-radius: 50%;
        }

        /* CROP RESULT CARDS */
        .results-list {
          display: flex; flex-direction: column; gap: 16px;
        }

        .result-card {
          border-radius: 20px; overflow: hidden;
          border: 2px solid var(--border);
          background: var(--card-bg);
          box-shadow: 0 2px 12px rgba(44,26,14,0.04);
          animation: slideUp 0.4s ease both;
          transition: box-shadow 0.2s;
        }
        .result-card:hover { box-shadow: 0 6px 24px rgba(44,26,14,0.1); }
        .result-card:nth-child(1) { animation-delay: 0.05s; }
        .result-card:nth-child(2) { animation-delay: 0.1s;  }
        .result-card:nth-child(3) { animation-delay: 0.15s; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .result-header {
          padding: 20px 24px;
          display: flex; align-items: center; gap: 16px;
          cursor: pointer; user-select: none;
        }

        .rank-badge {
          font-size: 28px; flex-shrink: 0;
          width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px;
        }

        .crop-emoji {
          font-size: 32px; flex-shrink: 0;
        }

        .result-info { flex: 1; min-width: 0; }
        .result-crop-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: var(--soil); text-transform: capitalize;
          margin-bottom: 4px;
        }
        .result-rank-label {
          font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
        }

        .result-scores {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 4px; flex-shrink: 0;
        }
        .combined-score {
          font-family: 'DM SANS', serif;
          font-size: 28px; font-weight: 900; color: var(--moss);
        }
        .combined-label {
          font-size: 10px; color: var(--sage);
          text-transform: uppercase; letter-spacing: 1px;
        }

        .expand-icon {
          font-size: 12px; color: var(--sage);
          transition: transform 0.3s; margin-left: 8px;
        }
        .expand-icon.open { transform: rotate(180deg); }

        /* RESULT BODY */
        .result-body {
          padding: 0 24px 24px;
          border-top: 1px solid var(--border);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px; margin-top: 20px;
        }

        .metric-card {
          background: white; border: 1px solid var(--border);
          border-radius: 12px; padding: 14px;
          text-align: center;
        }
        .metric-icon { font-size: 20px; margin-bottom: 6px; }
        .metric-value {
          font-family: 'DM SANS', serif;
          font-size: 18px; font-weight: 700; color: var(--soil);
          margin-bottom: 2px;
        }
        .metric-label {
          font-size: 10px; color: var(--sage);
          text-transform: uppercase; letter-spacing: 0.5px;
        }

        /* SCORE BARS */
        .score-bars { margin-top: 20px; }
        .score-bar-row {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 10px;
        }
        .score-bar-label {
          font-size: 12px; color: var(--earth);
          font-weight: 600; min-width: 110px;
        }
        .score-bar-track {
          flex: 1; height: 8px; border-radius: 8px;
          background: var(--wheat);
        }
        .score-bar-fill {
          height: 100%; border-radius: 8px;
          transition: width 1s cubic-bezier(0.16,1,0.3,1);
        }
        .score-bar-value {
          font-size: 12px; font-weight: 700;
          color: var(--soil); min-width: 36px;
          text-align: right;
        }

        /* PROFIT BADGE */
        .profit-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
          margin-top: 16px;
        }

        /* VERDICT */
        .verdict-box {
          margin-top: 16px; padding: 14px 16px;
          background: linear-gradient(135deg, #f0f7ec, #e8f5e9);
          border: 1px solid var(--sage); border-radius: 12px;
          font-size: 13px; color: var(--earth); line-height: 1.5;
        }
        .verdict-box strong { color: var(--moss); }

        @media (max-width: 600px) {
          .form-card { padding: 24px 20px; }
          .fields-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
          .actions { flex-direction: column; }
          .btn-submit, .btn-reset { width: 100%; justify-content: center; }
          .metrics-grid { grid-template-columns: 1fr 1fr; }
          .result-header { flex-wrap: wrap; }
        }
      `}</style>

      <div className="profit-root">
        <Header />
        <div className="bg-texture" />
        <div className="wrapper">

          {/* Page Header */}
          <header className="profit-header">
            <div className="header-badge"><span>📈</span> Profit Analysis</div>
            <h1>Crop Selection by<br /><em>Profit + Suitability</em></h1>
            <p>Enter your soil and climate parameters to find the most profitable and suitable crop for your land.</p>
          </header>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-icon">✦</div>
            <div className="divider-line" />
          </div>

          {/* Input Form */}
          <div className="form-card">
            <div className="form-section-title">Soil & Climate Parameters</div>
            <div className="fields-grid">
              {fields.map((f) => {
                const isErr = touched[f.key] && form[f.key] === "";
                return (
                  <div className="field-group" key={f.key}>
                    <label className="field-label">
                      <span className="field-label-left">
                        {f.icon.length <= 2 && /[A-Z]/.test(f.icon) ? (
                          <span className="field-icon">{f.icon}</span>
                        ) : (
                          <span style={{ fontSize: 14 }}>{f.icon}</span>
                        )}
                        {f.label}
                      </span>
                      <span className="field-unit">{f.unit}</span>
                    </label>
                    <input
                      className={`field-input${isErr ? " error" : ""}`}
                      type="number"
                      placeholder={`e.g. ${Math.round((f.min + f.max) / 2)}`}
                      value={form[f.key]}
                      min={f.min} max={f.max}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    />
                    <span className="field-hint">{f.hint}</span>
                  </div>
                );
              })}
            </div>

            {error && <div className="error-box">⚠️ {error.message}</div>}

            <div className="actions">
              <button className="btn-reset" onClick={handleReset}>Reset</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading
                  ? <><div className="spinner" /> Analyzing…</>
                  : <><span>📈</span> Analyze Profitability</>
                }
              </button>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <>
              <div className="results-title">Profitability Analysis Results</div>
              <div className="results-subtitle">
                Crops ranked by combined suitability (60%) + profit potential (40%)
              </div>

              {/* Legend */}
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "#2e7d32" }} />
                  High Profit (above ₹30,000/acre)
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "#f57f17" }} />
                  Moderate Profit (₹15,000–₹30,000/acre)
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: "#c62828" }} />
                  Low Profit (below ₹15,000/acre)
                </div>
              </div>

              <div className="results-list">
                {results.map((item) => {
                  const rankStyle   = RANK_STYLES[item.rank];
                  const profitLevel = getProfitLevel(item.profit_per_acre);
                  const profitColors = PROFIT_COLORS[profitLevel];
                  const isOpen      = expanded === item.rank;

                  return (
                    <div
                      key={item.rank}
                      className="result-card"
                      style={{ borderColor: rankStyle.border }}
                    >
                      {/* Card Header */}
                      <div
                        className="result-header"
                        style={{ background: rankStyle.bg }}
                        onClick={() => setExpanded(isOpen ? null : item.rank)}
                      >
                        <div
                          className="rank-badge"
                          style={{ background: rankStyle.bg, border: `2px solid ${rankStyle.border}` }}
                        >
                          {item.rank === 1 ? "🏆" : item.rank === 2 ? "🥈" : "🥉"}
                        </div>

                        <div className="crop-emoji">{item.emoji}</div>

                        <div className="result-info">
                          <div className="result-crop-name">{item.crop}</div>
                          <div
                            className="result-rank-label"
                            style={{ color: rankStyle.color }}
                          >
                            {rankStyle.label}
                          </div>
                        </div>

                        <div className="result-scores">
                          <div className="combined-score">{item.combined_score}</div>
                          <div className="combined-label">Combined Score</div>
                        </div>

                        <span className={`expand-icon ${isOpen ? "open" : ""}`}>▼</span>
                      </div>

                      {/* Card Body */}
                      {isOpen && (
                        <div className="result-body">

                          {/* Metrics Grid */}
                          <div className="metrics-grid">
                            <div className="metric-card">
                              <div className="metric-icon">💰</div>
                              <div className="metric-value">
                                {formatCurrency(item.revenue_per_acre)}
                              </div>
                              <div className="metric-label">Revenue/Acre</div>
                            </div>
                            <div className="metric-card">
                              <div className="metric-icon">🧾</div>
                              <div className="metric-value">
                                {formatCurrency(item.cost_per_acre)}
                              </div>
                              <div className="metric-label">Cost/Acre</div>
                            </div>
                            <div className="metric-card">
                              <div className="metric-icon">📊</div>
                              <div
                                className="metric-value"
                                style={{ color: profitColors.text }}
                              >
                                {formatCurrency(item.profit_per_acre)}
                              </div>
                              <div className="metric-label">Net Profit/Acre</div>
                            </div>
                            <div className="metric-card">
                              <div className="metric-icon">📈</div>
                              <div
                                className="metric-value"
                                style={{ color: profitColors.text }}
                              >
                                {item.roi_percent !== null ? `${item.roi_percent}%` : "N/A"}
                              </div>
                              <div className="metric-label">ROI</div>
                            </div>
                            <div className="metric-card">
                              <div className="metric-icon">📅</div>
                              <div className="metric-value">
                                {item.duration_days ?? "N/A"}
                              </div>
                              <div className="metric-label">Days to Harvest</div>
                            </div>
                            <div className="metric-card">
                              <div className="metric-icon">🌱</div>
                              <div className="metric-value">
                                {item.suitability_score}%
                              </div>
                              <div className="metric-label">ML Suitability</div>
                            </div>
                          </div>

                          {/* Score Bars */}
                          <div className="score-bars">
                            <div className="score-bar-row">
                              <div className="score-bar-label">🌱 Soil Suitability</div>
                              <div className="score-bar-track">
                                <div
                                  className="score-bar-fill"
                                  style={{
                                    width: `${item.suitability_score}%`,
                                    background: "#6b8f5e"
                                  }}
                                />
                              </div>
                              <div className="score-bar-value">{item.suitability_score}%</div>
                            </div>
                            <div className="score-bar-row">
                              <div className="score-bar-label">📈 Combined Score</div>
                              <div className="score-bar-track">
                                <div
                                  className="score-bar-fill"
                                  style={{
                                    width: `${item.combined_score}%`,
                                    background: "#c97c2e"
                                  }}
                                />
                              </div>
                              <div className="score-bar-value">{item.combined_score}</div>
                            </div>
                          </div>

                          {/* Profit Badge */}
                          <div
                            className="profit-badge"
                            style={{
                              background: profitColors.bg,
                              border: `1px solid ${profitColors.border}`,
                              color: profitColors.text
                            }}
                          >
                            {profitLevel === "high" ? "💰" : profitLevel === "moderate" ? "⚠️" : "📉"}
                            {item.recommendation}
                          </div>

                          {/* Verdict */}
                          <div className="verdict-box">
                            💡 <strong>Analysis: </strong>
                            {item.crop} has a soil suitability of{" "}
                            <strong>{item.suitability_score}%</strong> and an estimated
                            net profit of{" "}
                            <strong>{formatCurrency(item.profit_per_acre)} per acre</strong>
                            {item.roi_percent !== null && (
                              <> with a return on investment of <strong>{item.roi_percent}%</strong></>
                            )}
                            . Crop duration is approximately{" "}
                            <strong>{item.duration_days} days</strong>.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}