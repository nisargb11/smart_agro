import { useState } from "react";
import Header from "@/components/Header";

const fields = [
  { key: "nitrogen", label: "Nitrogen", unit: "mg/kg", icon: "N", min: 0, max: 140 },
  { key: "phosphorous", label: "Phosphorous", unit: "mg/kg", icon: "P", min: 5, max: 145 },
  { key: "potassium", label: "Potassium", unit: "mg/kg", icon: "K", min: 5, max: 205 },
  { key: "temperature", label: "Temperature", unit: "°C", icon: "🌡", min: 8, max: 45 },
  { key: "humidity", label: "Humidity", unit: "%", icon: "💧", min: 14, max: 100 },
  { key: "ph", label: "Soil pH", unit: "pH", icon: "⚗", min: 3.5, max: 9.5 },
  { key: "rainfall", label: "Rainfall", unit: "mm", icon: "🌧", min: 20, max: 300 },
];

const initialForm = fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});

export default function CropRecommendation() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [guide, setGuide] = useState(null);
  const [guideLoading, setGuideLoading] = useState(false);
  const [guideError, setGuideError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCropGuide = async (cropName) => {
    setGuideLoading(true);
    setGuideError(null);
    setGuide(null);
    setShowModal(true);
  
    try {
      const res = await fetch(
        `http://localhost:3000/api/cropguide/${encodeURIComponent(cropName.toLowerCase())}`
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setGuide(data.guide);
    } catch (err) {
      setGuideError(err.message);
    } finally {
      setGuideLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
    setError(null);
  };

  const validate = () => {
    for (const f of fields) {
      if (form[f.key] === "" || form[f.key] === null || form[f.key] === undefined) {
        return `Please fill in ${f.label}`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError({ message: validationError, details: [] });
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload = {};
      for (const f of fields) payload[f.key] = parseFloat(form[f.key]);

      const res = await fetch("http://localhost:3000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError({
          message: data.error || "Recommendation failed",
          details: data.details || []
        });
        return;
      }

      setResult(data.predictions || []);
    } catch (e) {
      setError({
        message: "Cannot reach server. Make sure the backend is running on port 3000.",
        details: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setError(null);
    setTouched({});
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
          --sky: #7bb3d4;
          --gold: #d4a843;
          --card-bg: #faf6f0;
          --border: rgba(92,61,30,0.15);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .agro-root {
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

        .header { text-align: center; margin-bottom: 48px; }
        .header-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--moss); color: var(--mint);
          font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          padding: 6px 16px; border-radius: 40px; margin-bottom: 20px;
        }
        .header-badge span { font-size: 14px; }
        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 900;
          color: var(--soil); line-height: 1.1; margin-bottom: 14px;
        }
        .header h1 em { font-style: normal; color: var(--amber); }
        .header p { color: var(--earth); font-size: 15px; max-width: 480px; margin: 0 auto; line-height: 1.6; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 0 auto 40px; max-width: 300px;
        }
        .divider-line { flex: 1; height: 1px; background: var(--border); }
        .divider-icon { color: var(--sage); font-size: 18px; }

        .form-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px;
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
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 8px;
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
        .field-unit { font-size: 10px; color: var(--sage); font-weight: 400; text-transform: none; letter-spacing: 0; }

        .field-input-wrap { position: relative; }
        .field-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          background: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: var(--soil);
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          appearance: none;
        }
        .field-input:focus {
          border-color: var(--sage);
          box-shadow: 0 0 0 3px rgba(107,143,94,0.15);
        }
        .field-input.error {
          border-color: #c0392b;
          box-shadow: 0 0 0 3px rgba(192,57,43,0.1);
        }
        .field-input::placeholder { color: #b8a898; }

        .field-hint { font-size: 10px; color: var(--sage); margin-top: 2px; }

        .error-box {
          background: #fdf3f2; border: 1px solid #e8b4b0;
          border-radius: 12px; padding: 12px 16px;
          color: #8b2020; font-size: 13px; font-weight: 500;
          margin-bottom: 20px;
        }

        .errorDetails {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 0;
          font-size: 13px;
          color: #c0392b;
        }
        .errorDetails li { padding: 2px 0; }

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
        .btn-submit:hover:not(:disabled) { background: var(--soil); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(44,26,14,0.3); }
        .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(184,212,168,0.3);
          border-top-color: var(--mint);
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .results-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px; overflow: hidden;
          box-shadow: 0 4px 40px rgba(44,26,14,0.06);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .results-header {
          background: var(--moss); padding: 24px 32px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .results-header-text h2 {
          font-family: 'Playfair Display', serif;
          color: var(--mint); font-size: 20px; margin-bottom: 2px;
        }
        .results-header-text p { color: rgba(184,212,168,0.7); font-size: 13px; }

        .results-body { padding: 32px; display: flex; flex-direction: column; gap: 16px; }

        .crop-card {
          background: white; border: 1.5px solid var(--border);
          border-radius: 16px; padding: 20px 24px;
          display: flex; align-items: center; gap: 20px;
          transition: box-shadow 0.2s, border-color 0.2s;
          animation: fadeIn 0.3s ease both;
        }
        .crop-card:nth-child(1) { animation-delay: 0.05s; }
        .crop-card:nth-child(2) { animation-delay: 0.12s; }
        .crop-card:nth-child(3) { animation-delay: 0.19s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

        .crop-card.primary {
          border-color: var(--sage);
          box-shadow: 0 4px 20px rgba(107,143,94,0.15);
        }
        .crop-card:hover { box-shadow: 0 4px 20px rgba(44,26,14,0.1); border-color: var(--sage); }

        .crop-rank {
          font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          color: var(--sage); min-width: 28px;
        }
        .crop-rank.primary-rank { color: var(--amber); }

        .crop-emoji-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--cream); display: flex; align-items: center;
          justify-content: center; font-size: 26px; flex-shrink: 0;
        }
        .crop-card.primary .crop-emoji-wrap { background: rgba(107,143,94,0.1); }

        .crop-info { flex: 1; min-width: 0; }
        .crop-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: var(--soil);
          text-transform: capitalize; margin-bottom: 4px;
        }
        .crop-sublabel { font-size: 12px; color: var(--sage); }

        .crop-conf { text-align: right; flex-shrink: 0; }
        .conf-value {
          font-size: 22px; font-weight: 700; color: var(--moss);
          font-variant-numeric: tabular-nums;
        }
        .conf-label { font-size: 10px; color: var(--sage); text-transform: uppercase; letter-spacing: 1px; }

        .conf-bar-wrap {
          width: 80px; height: 4px; border-radius: 4px;
          background: var(--wheat); margin-top: 6px; margin-left: auto;
        }
        .conf-bar {
          height: 100%; border-radius: 4px; background: var(--sage);
          transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .crop-card.primary .conf-bar { background: var(--amber); }

        .best-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; background: var(--amber);
          color: white; padding: 3px 10px; border-radius: 40px;
          margin-left: 10px; vertical-align: middle;
        }

        @media (max-width: 600px) {
          .form-card { padding: 24px 20px; }
          .fields-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
          .actions { flex-direction: column; }
          .btn-submit, .btn-reset { width: 100%; justify-content: center; }
          .results-body { padding: 20px; }
          .crop-card { padding: 16px; gap: 12px; }
          .conf-bar-wrap { width: 60px; }
        }

        .guide-btn {
  margin-top: 8px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--sage);
  background: white;
  color: var(--moss);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.guide-btn:hover { background: var(--moss); color: white; }

.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(44,26,14,0.5);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal-content {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 36px;
  max-width: 680px; width: 100%;
  max-height: 85vh; overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(44,26,14,0.3);
}
.modal-close {
  position: absolute; top: 16px; right: 16px;
  background: none; border: none;
  font-size: 18px; cursor: pointer; color: var(--earth);
}
.guide-header {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 12px;
}
.guide-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 22px; color: var(--soil);
}
.guide-source {
  font-size: 11px; font-weight: 600;
  background: var(--wheat); color: var(--earth);
  padding: 4px 10px; border-radius: 20px;
}
.guide-description {
  color: var(--earth); font-size: 14px;
  line-height: 1.6; margin-bottom: 24px;
  padding: 12px 16px;
  background: var(--cream);
  border-radius: 10px;
}
.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px; margin-bottom: 20px;
}
.guide-item {
  display: flex; align-items: flex-start; gap: 10px;
  background: white; border: 1px solid var(--border);
  border-radius: 12px; padding: 12px;
}
.guide-icon { font-size: 20px; flex-shrink: 0; }
.guide-label {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--sage); margin-bottom: 2px;
}
.guide-value { font-size: 13px; color: var(--soil); line-height: 1.4; }
.guide-tips {
  background: linear-gradient(135deg, #f0f7ec, #e8f5e9);
  border: 1px solid var(--sage);
  border-radius: 12px; padding: 16px;
}
.guide-tips h4 { color: var(--moss); margin-bottom: 8px; font-size: 14px; }
.guide-tips p { color: var(--earth); font-size: 13px; line-height: 1.6; }
.guide-loading {
  display: flex; flex-direction: column;
  align-items: center; gap: 12px; padding: 40px;
  color: var(--earth);
}
      `}</style>

      <div className="agro-root">
        <Header />
        <div className="bg-texture" />
        <div className="wrapper">

          <header className="header">
            <div className="header-badge"><span>🌱</span> Smart Agro Advisor</div>
            <h1>Find Your <em>Ideal Crop</em><br />For Any Soil</h1>
            <p>Enter your soil and climate parameters to get AI-powered crop recommendations tailored to your land.</p>
          </header>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-icon">✦</div>
            <div className="divider-line" />
          </div>

          <div className="form-card">
            <div className="form-section-title">Soil & Climate Parameters</div>

            <div className="fields-grid">
              {fields.map((f) => {
                const isError = touched[f.key] && (form[f.key] === "" || form[f.key] === null);
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
                    <div className="field-input-wrap">
                      <input
                        className={`field-input${isError ? " error" : ""}`}
                        type="number"
                        placeholder={`e.g. ${Math.round((f.min + f.max) / 2)}`}
                        value={form[f.key]}
                        min={f.min} max={f.max}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                      />
                    </div>
                    <span className="field-hint">Range: {f.min} – {f.max}</span>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="error-box">
                <p>⚠️ {error.message || error}</p>
                {error.details && error.details.length > 0 && (
                  <ul className="errorDetails">
                    {error.details.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="actions">
              <button className="btn-reset" onClick={handleReset}>Reset</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? <><div className="spinner" /> Analyzing…</> : <><span>🔍</span> Get Recommendations</>}
              </button>
            </div>
          </div>

          {result && result.length > 0 && (
            <div className="results-card">
              <div className="results-header">
                <div className="results-header-text">
                  <h2>Crop Recommendations</h2>
                  <p>Based on your soil & climate data</p>
                </div>
                <span style={{ fontSize: 32 }}>🌾</span>
              </div>
              <div className="results-body">
                {result.map((item, i) => (
                  <div key={i} className={`crop-card${i === 0 ? " primary" : ""}`}>
                    <div className={`crop-rank${i === 0 ? " primary-rank" : ""}`}>#{i + 1}</div>
                    <div className="crop-emoji-wrap">
                     <img
                      src={`/crops/${item.crop.toLowerCase()}.png`}
                      alt={item.crop}
                      className="crop-img"
                      onError={(e) => (e.target.src = "/crops/default.png")}
                     />
                    </div>
                    <div className="crop-info">
                      <div className="crop-name">
                        {item.crop}
                        {i === 0 && <span className="best-tag">Best Match</span>}
                      </div>
                      <div className="crop-sublabel">{i === 0 ? "Highest suitability for your conditions" : "Alternative recommendation"}</div>
                      <button
                        className="guide-btn"
                        onClick={() => fetchCropGuide(item.crop)}
                      >View Guide</button>
                    </div>
                    <div className="crop-conf">
                    <div className="conf-value">
                     {item.confidence < 1 ? item.confidence.toFixed(1) : Math.round(item.confidence)}%
                    </div>
                      <div className="conf-label">Match</div>
                      <div className="conf-bar-wrap">
                      <div className="conf-bar" style={{ width: `${Math.max(item.confidence, 2)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      {showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      
      <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>

      {guideLoading && (
        <div className="guide-loading">
          <div className="spinner" />
          <p>Fetching crop guide...</p>
        </div>
      )}

      {guideError && (
        <div className="error-box">
          <p>⚠️ {guideError}</p>
        </div>
      )}

      {guide && (
        <>
          <div className="guide-header">
            <h2>📋 {guide.name} Farming Guide</h2>
            <span className="guide-source">
              {guide.source === "openfarm" ? "🌐 OpenFarm" : "SOURCE : Our Developers😊"}
            </span>
          </div>

          {guide.description && (
            <p className="guide-description">{guide.description}</p>
          )}

          <div className="guide-grid">
            {[
              { icon: "🌱", label: "Sowing Method", value: guide.sowing_method },
              { icon: "📅", label: "Sowing Season", value: guide.sowing_season },
              { icon: "⏱", label: "Germination", value: guide.germination_days },
              { icon: "🌾", label: "Harvest In", value: guide.harvest_days },
              { icon: "💧", label: "Watering", value: guide.watering },
              { icon: "☀️", label: "Sunlight", value: guide.sunlight },
              { icon: "🌍", label: "Soil Type", value: guide.soil_type },
              { icon: "🧪", label: "Fertilizer", value: guide.fertilizer },
              { icon: "🐛", label: "Common Pests", value: guide.common_pests },
              { icon: "🌡", label: "Temperature", value: guide.temperature_range },
              { icon: "📏", label: "Spacing", value: guide.spacing },
              { icon: "📦", label: "Expected Yield", value: guide.yield },
            ]
              .filter(item => item.value)
              .map((item, i) => (
                <div key={i} className="guide-item">
                  <span className="guide-icon">{item.icon}</span>
                  <div>
                    <p className="guide-label">{item.label}</p>
                    <p className="guide-value">{item.value}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {guide.tips && (
            <div className="guide-tips">
              <h4>💡 Expert Tips</h4>
              <p>{guide.tips}</p>
            </div>
          )}
        </>
      )}
    </div>
  </div>
)}
    </>
  );
}