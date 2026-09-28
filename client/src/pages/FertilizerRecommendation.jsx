import { useState } from "react";
import Header from "@/components/Header";

const soilFields = [
  { key: "nitrogen",    label: "Nitrogen",    icon: "N", unit: "mg/kg", min: 0,   max: 140, hint: "Range: 0 – 140" },
  { key: "phosphorous", label: "Phosphorous", icon: "P", unit: "mg/kg", min: 5,   max: 145, hint: "Range: 5 – 145" },
  { key: "potassium",   label: "Potassium",   icon: "K", unit: "mg/kg", min: 5,   max: 205, hint: "Range: 5 – 205" },
  { key: "ph",          label: "Soil pH",     icon: "⚗", unit: "pH",    min: 3.5, max: 9.5, hint: "Range: 3.5 – 9.5" },
];

const initialForm = { nitrogen: "", phosphorous: "", potassium: "", ph: "" };

const SEVERITY_COLORS = {
  success: { bg: "#f0f7ec", border: "#6b8f5e", text: "#2e7d32", badge: "#3a5a2a" },
  warning: { bg: "#fff8e1", border: "#f9a825", text: "#e65100", badge: "#f57f17" },
  danger:  { bg: "#fdf3f2", border: "#e57373", text: "#8b2020", badge: "#c62828" },
};

const SEVERITY_EMOJI = {
  success: "✅",
  warning: "⚠️",
  danger:  "🚨",
};

const HEALTH_COLORS = {
  Excellent: "#3a5a2a",
  Good:      "#6b8f5e",
  Fair:      "#f57f17",
  Poor:      "#c62828",
};

const NUTRIENT_LABELS = {
  nitrogen:    { label: "Nitrogen (N)",    icon: "N" },
  phosphorous: { label: "Phosphorous (P)", icon: "P" },
  potassium:   { label: "Potassium (K)",   icon: "K" },
  ph:          { label: "Soil pH",         icon: "⚗" },
};

export default function FertilizerRecommendation() {
  const [form, setForm]         = useState(initialForm);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [touched, setTouched]   = useState({});
  const [expanded, setExpanded] = useState({});

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setTouched(prev => ({ ...prev, [key]: true }));
    setError(null);
  };

  const validate = () => {
    for (const f of soilFields) {
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
    setResult(null);
    setError(null);

    try {
      const payload = {};
      for (const f of soilFields) payload[f.key] = parseFloat(form[f.key]);

      const res = await fetch("http://localhost:3000/api/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError({ message: data.error || "Analysis failed" });
        return;
      }
      setResult(data);
    } catch (e) {
      setError({ message: "Cannot reach server. Make sure backend is running." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setError(null);
    setTouched({});
    setExpanded({});
  };

  const toggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
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
          --leaf: #8db87a;
          --mint: #b8d4a8;
          --cream: #f5efe6;
          --wheat: #e8d5b0;
          --amber: #c97c2e;
          --card-bg: #faf6f0;
          --border: rgba(92,61,30,0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .fert-root {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .bg-texture {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(107,143,94,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 90% 80%, rgba(201,124,46,0.08) 0%, transparent 60%);
        }

        .wrapper {
          position: relative; z-index: 1;
          max-width: 860px; margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* HEADER */
        .fert-header { text-align: center; margin-bottom: 48px; }
        .header-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--moss); color: var(--mint);
          font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          padding: 6px 16px; border-radius: 40px; margin-bottom: 20px;
        }
        .fert-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900;
          color: var(--soil); line-height: 1.1; margin-bottom: 14px;
        }
        .fert-header h1 em { font-style: normal; color: var(--amber); }
        .fert-header p { color: var(--earth); font-size: 15px; max-width: 500px; margin: 0 auto; line-height: 1.6; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 0 auto 40px; max-width: 300px;
        }
        .divider-line { flex: 1; height: 1px; background: var(--border); }
        .divider-icon { color: var(--sage); font-size: 18px; }

        /* FORM */
        .form-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
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
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px; margin-bottom: 8px;
        }

        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;
          color: var(--earth);
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
          font-size: 15px; color: var(--soil);
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        .field-input:focus {
          border-color: var(--sage);
          box-shadow: 0 0 0 3px rgba(107,143,94,0.15);
        }
        .field-input::placeholder { color: #b8a898; }
        .field-hint { font-size: 10px; color: var(--sage); margin-top: 2px; }

        /* ERROR */
        .error-box {
          background: #fdf3f2; border: 1px solid #e8b4b0;
          border-radius: 12px; padding: 12px 16px;
          color: #8b2020; font-size: 13px; font-weight: 500;
          margin-bottom: 20px;
        }

        /* ACTIONS */
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
          border: none; background: var(--moss);
          color: var(--mint); font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
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

        /* SOIL HEALTH BANNER */
        .health-banner {
          border-radius: 20px; padding: 24px 32px;
          margin-bottom: 24px;
          display: flex; align-items: center; gap: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(44,26,14,0.06);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .health-icon { font-size: 48px; }
        .health-text h2 {
          font-family: 'Playfair Display', serif;
          font-size: 22px; color: var(--soil); margin-bottom: 4px;
        }
        .health-text p { font-size: 14px; color: var(--earth); }
        .health-score {
          margin-left: auto; text-align: center;
        }
        .health-score-value {
          font-size: 36px; font-weight: 700;
          font-family: 'Playfair Display', serif;
        }
        .health-score-label {
          font-size: 11px; color: var(--sage);
          text-transform: uppercase; letter-spacing: 1px;
        }
        .health-bar-wrap {
          width: 100%; height: 6px; border-radius: 6px;
          background: var(--wheat); margin-top: 8px;
        }
        .health-bar {
          height: 100%; border-radius: 6px;
          transition: width 1s cubic-bezier(0.16,1,0.3,1);
        }

        /* NUTRIENT CARDS */
        .nutrients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 16px;
        }

        .nutrient-card {
          border-radius: 16px; overflow: hidden;
          border: 1.5px solid var(--border);
          background: var(--card-bg);
          box-shadow: 0 2px 12px rgba(44,26,14,0.04);
          animation: fadeIn 0.4s ease both;
        }
        .nutrient-card:nth-child(1) { animation-delay: 0.05s; }
        .nutrient-card:nth-child(2) { animation-delay: 0.1s; }
        .nutrient-card:nth-child(3) { animation-delay: 0.15s; }
        .nutrient-card:nth-child(4) { animation-delay: 0.2s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nutrient-header {
          padding: 16px 20px;
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; user-select: none;
        }
        .nutrient-icon-wrap {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: white;
          background: var(--moss); flex-shrink: 0;
        }
        .nutrient-title { flex: 1; }
        .nutrient-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 700; color: var(--soil);
          margin-bottom: 2px;
        }
        .nutrient-value {
          font-size: 12px; color: var(--earth);
        }
        .nutrient-badge {
          padding: 4px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
          color: white;
        }
        .expand-icon {
          font-size: 12px; color: var(--sage);
          transition: transform 0.3s;
          margin-left: 8px;
        }
        .expand-icon.open { transform: rotate(180deg); }

        .nutrient-body {
          padding: 0 20px 20px;
          border-top: 1px solid var(--border);
        }

        .symptom-box {
          padding: 10px 14px; border-radius: 10px;
          margin: 14px 0;
          font-size: 13px; line-height: 1.5;
        }

        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: var(--sage);
          margin: 12px 0 6px;
        }

        .tag-list {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-bottom: 4px;
        }
        .tag {
          padding: 4px 10px; border-radius: 20px;
          background: var(--wheat); color: var(--earth);
          font-size: 12px; font-weight: 500;
          border: 1px solid var(--border);
        }
        .tag.organic { background: #e8f5e9; color: #2e7d32; border-color: #a5d6a7; }

        .info-row {
          background: white; border: 1px solid var(--border);
          border-radius: 10px; padding: 10px 14px;
          margin-bottom: 8px; font-size: 13px;
          display: flex; gap: 8px;
        }
        .info-row-icon { flex-shrink: 0; }
        .info-row-text { color: var(--soil); line-height: 1.5; }
        .info-row-text strong { color: var(--moss); }

        .tip-box {
          background: linear-gradient(135deg, #f0f7ec, #e8f5e9);
          border: 1px solid var(--sage); border-radius: 10px;
          padding: 10px 14px; margin-top: 12px;
          font-size: 13px; color: var(--earth); line-height: 1.5;
        }
        .tip-box strong { color: var(--moss); }

        @media (max-width: 600px) {
          .form-card { padding: 24px 20px; }
          .fields-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
          .actions { flex-direction: column; }
          .btn-submit, .btn-reset { width: 100%; justify-content: center; }
          .nutrients-grid { grid-template-columns: 1fr; }
          .health-banner { flex-wrap: wrap; }
          .health-score { margin-left: 0; }
        }
      `}</style>

      <div className="fert-root">
        <Header />
        <div className="bg-texture" />
        <div className="wrapper">

          {/* Page Header */}
          <header className="fert-header">
            <div className="header-badge"><span>🧪</span> Soil Analysis</div>
            <h1>Fertilizer & <em>Nutrient</em><br />Recommendation</h1>
            <p>Enter your soil parameters to identify nutrient deficiencies and get targeted fertilizer recommendations.</p>
          </header>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-icon">✦</div>
            <div className="divider-line" />
          </div>

          {/* Input Form */}
          <div className="form-card">
            <div className="form-section-title">Soil Parameters</div>

            <div className="fields-grid">
              {soilFields.map((f) => {
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

            {error && (
              <div className="error-box">⚠️ {error.message}</div>
            )}

            <div className="actions">
              <button className="btn-reset" onClick={handleReset}>Reset</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading
                  ? <><div className="spinner" /> Analyzing…</>
                  : <><span>🧪</span> Analyze Soil</>
                }
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Soil Health Banner */}
              <div className="health-banner">
                <div className="health-icon">
                  {result.soilHealth.status === "Excellent" ? "🌱" :
                   result.soilHealth.status === "Good"      ? "🌿" :
                   result.soilHealth.status === "Fair"      ? "⚠️" : "🚨"}
                </div>
                <div className="health-text">
                  <h2>Soil Health: {result.soilHealth.status}</h2>
                  <p>Based on N, P, K and pH analysis of your soil sample</p>
                  <div className="health-bar-wrap">
                    <div
                      className="health-bar"
                      style={{
                        width: `${result.soilHealth.score}%`,
                        background: HEALTH_COLORS[result.soilHealth.status]
                      }}
                    />
                  </div>
                </div>
                <div className="health-score">
                  <div
                    className="health-score-value"
                    style={{ color: HEALTH_COLORS[result.soilHealth.status] }}
                  >
                    {result.soilHealth.score}
                  </div>
                  <div className="health-score-label">/ 100</div>
                </div>
              </div>

              {/* Nutrient Cards */}
              <div className="nutrients-grid">
                {Object.entries(result.results).map(([key, data]) => {
                  const colors  = SEVERITY_COLORS[data.severity];
                  const emoji   = SEVERITY_EMOJI[data.severity];
                  const meta    = NUTRIENT_LABELS[key];
                  const isOpen  = expanded[key];
                  const isPhKey = key === "ph";

                  return (
                    <div
                      className="nutrient-card"
                      key={key}
                      style={{ borderColor: colors.border }}
                    >
                      {/* Card Header */}
                      <div
                        className="nutrient-header"
                        style={{ background: colors.bg }}
                        onClick={() => toggleExpand(key)}
                      >
                        <div
                          className="nutrient-icon-wrap"
                          style={{ background: colors.badge }}
                        >
                          {meta.icon.length <= 2 && /[A-Z⚗]/.test(meta.icon)
                            ? meta.icon
                            : <span style={{ fontSize: 14 }}>{meta.icon}</span>
                          }
                        </div>
                        <div className="nutrient-title">
                          <div className="nutrient-name">{meta.label}</div>
                          <div className="nutrient-value">
                            Value: <strong>{data.value}</strong>
                            {isPhKey ? " pH" : " mg/kg"}
                          </div>
                        </div>
                        <div
                          className="nutrient-badge"
                          style={{ background: colors.badge }}
                        >
                          {emoji} {data.status}
                        </div>
                        <span className={`expand-icon ${isOpen ? "open" : ""}`}>▼</span>
                      </div>

                      {/* Card Body */}
                      {isOpen && (
                        <div className="nutrient-body">
                          {/* Symptoms */}
                          <div
                            className="symptom-box"
                            style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                          >
                            <strong style={{ color: colors.text }}>📋 Symptoms: </strong>
                            <span style={{ color: colors.text }}>{data.symptoms}</span>
                          </div>

                          {/* Chemical Fertilizers */}
                          {!isPhKey && data.fertilizers?.length > 0 && (
                            <>
                              <div className="section-label">⚗️ Chemical Fertilizers</div>
                              <div className="tag-list">
                                {data.fertilizers.map((f, i) => (
                                  <span className="tag" key={i}>{f}</span>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Organic Options */}
                          {!isPhKey && data.organic?.length > 0 && (
                            <>
                              <div className="section-label">🌿 Organic Alternatives</div>
                              <div className="tag-list">
                                {data.organic.map((o, i) => (
                                  <span className="tag organic" key={i}>{o}</span>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Soil Amendments for pH */}
                          {isPhKey && data.amendments?.length > 0 && (
                            <>
                              <div className="section-label">🪨 Soil Amendments</div>
                              <div className="tag-list">
                                {data.amendments.map((a, i) => (
                                  <span className="tag" key={i}>{a}</span>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Dosage */}
                          <div className="info-row">
                            <span className="info-row-icon">💊</span>
                            <div className="info-row-text">
                              <strong>Dosage: </strong>{data.dosage}
                            </div>
                          </div>

                          {/* Timing */}
                          <div className="info-row">
                            <span className="info-row-icon">📅</span>
                            <div className="info-row-text">
                              <strong>Timing: </strong>{data.timing}
                            </div>
                          </div>

                          {/* Expert Tip */}
                          <div className="tip-box">
                            💡 <strong>Expert Tip: </strong>{data.tip}
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