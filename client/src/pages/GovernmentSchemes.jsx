import { useState, useEffect } from "react";
import Header from "@/components/Header";

export default function GovernmentSchemes() {
  const [schemes, setSchemes]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [expanded, setExpanded]     = useState(null);

  const fetchSchemes = async (category = "all", searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (searchTerm)         params.append("search", searchTerm);

      const res  = await fetch(`http://localhost:3000/api/schemes?${params}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error);
      setSchemes(data.schemes);
      setCategories(data.categories);
    } catch (e) {
      setError("Could not load schemes. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setExpanded(null);
    fetchSchemes(cat, search);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchSchemes(activeCategory, val);
  };

  const toggleExpand = (id) => {
    setExpanded(prev => prev === id ? null : id);
  };

  const CATEGORY_COLORS = {
    financial:      { bg: "#fff8e1", border: "#f9a825", badge: "#f57f17" },
    insurance:      { bg: "#e8f5e9", border: "#66bb6a", badge: "#2e7d32" },
    credit:         { bg: "#e3f2fd", border: "#42a5f5", badge: "#1565c0" },
    irrigation:     { bg: "#e0f7fa", border: "#26c6da", badge: "#00838f" },
    soil:           { bg: "#f1f8e9", border: "#9ccc65", badge: "#558b2f" },
    organic:        { bg: "#f0f4c3", border: "#d4e157", badge: "#827717" },
    market:         { bg: "#fce4ec", border: "#f48fb1", badge: "#880e4f" },
    infrastructure: { bg: "#ede7f6", border: "#9575cd", badge: "#4527a0" },
    development:    { bg: "#fff3e0", border: "#ffa726", badge: "#e65100" },
    pension:        { bg: "#fafafa", border: "#bdbdbd", badge: "#424242" },
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

        .schemes-root {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
        }

        .bg-texture {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(107,143,94,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 90% 80%, rgba(201,124,46,0.08) 0%, transparent 60%);
        }

        .wrapper {
          position: relative; z-index: 1;
          max-width: 960px; margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* HEADER */
        .schemes-header { text-align: center; margin-bottom: 48px; }
        .header-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--moss); color: var(--mint);
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; padding: 6px 16px;
          border-radius: 40px; margin-bottom: 20px;
        }
        .schemes-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900;
          color: var(--soil); line-height: 1.1; margin-bottom: 14px;
        }
        .schemes-header h1 em { font-style: normal; color: var(--amber); }
        .schemes-header p {
          color: var(--earth); font-size: 15px;
          max-width: 500px; margin: 0 auto; line-height: 1.6;
        }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 0 auto 40px; max-width: 300px;
        }
        .divider-line { flex: 1; height: 1px; background: var(--border); }
        .divider-icon { color: var(--sage); font-size: 18px; }

        /* SEARCH */
        .search-wrap {
          position: relative; margin-bottom: 24px;
        }
        .search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); font-size: 16px;
          pointer-events: none;
        }
        .search-input {
          width: 100%; padding: 14px 16px 14px 44px;
          border: 1.5px solid var(--border); border-radius: 14px;
          background: var(--card-bg); font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: var(--soil); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          border-color: var(--sage);
          box-shadow: 0 0 0 3px rgba(107,143,94,0.15);
        }
        .search-input::placeholder { color: #b8a898; }

        /* CATEGORY FILTERS */
        .category-scroll {
          display: flex; gap: 8px; overflow-x: auto;
          padding-bottom: 8px; margin-bottom: 32px;
          scrollbar-width: none;
        }
        .category-scroll::-webkit-scrollbar { display: none; }
        .cat-btn {
          padding: 8px 16px; border-radius: 40px; white-space: nowrap;
          border: 1.5px solid var(--border); background: var(--card-bg);
          color: var(--earth); font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; gap: 6px;
        }
        .cat-btn:hover { border-color: var(--sage); color: var(--moss); }
        .cat-btn.active {
          background: var(--moss); color: var(--mint);
          border-color: var(--moss);
        }

        /* RESULTS COUNT */
        .results-count {
          font-size: 13px; color: var(--sage);
          margin-bottom: 16px; font-weight: 500;
        }

        /* SCHEME CARDS */
        .schemes-list {
          display: flex; flex-direction: column; gap: 16px;
        }

        .scheme-card {
          background: var(--card-bg);
          border: 1.5px solid var(--border);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 2px 12px rgba(44,26,14,0.04);
          animation: fadeIn 0.3s ease both;
          transition: box-shadow 0.2s;
        }
        .scheme-card:hover { box-shadow: 0 4px 24px rgba(44,26,14,0.1); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .scheme-header {
          padding: 20px 24px;
          display: flex; align-items: center; gap: 16px;
          cursor: pointer; user-select: none;
        }

        .scheme-emoji {
          font-size: 32px; flex-shrink: 0;
          width: 56px; height: 56px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 14px; background: var(--cream);
        }

        .scheme-info { flex: 1; min-width: 0; }
        .scheme-name {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700;
          color: var(--soil); margin-bottom: 4px; line-height: 1.3;
        }
        .scheme-desc {
          font-size: 13px; color: var(--earth);
          line-height: 1.5; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scheme-right {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 8px; flex-shrink: 0;
        }
        .scheme-badge {
          padding: 4px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
          color: white;
        }
        .expand-btn {
          font-size: 12px; color: var(--sage);
          transition: transform 0.3s;
        }
        .expand-btn.open { transform: rotate(180deg); }

        /* SCHEME BODY */
        .scheme-body {
          padding: 0 24px 24px;
          border-top: 1px solid var(--border);
        }

        .scheme-section { margin-top: 16px; }
        .scheme-section-title {
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: var(--sage);
          margin-bottom: 8px;
        }

        .benefits-list {
          display: flex; flex-direction: column; gap: 6px;
        }
        .benefit-item {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 13px; color: var(--soil); line-height: 1.5;
        }
        .benefit-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--moss); flex-shrink: 0; margin-top: 6px;
        }

        .tags-list {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .tag {
          padding: 4px 10px; border-radius: 20px;
          background: var(--wheat); color: var(--earth);
          font-size: 12px; font-weight: 500;
          border: 1px solid var(--border);
        }

        .docs-grid {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .doc-tag {
          padding: 4px 10px; border-radius: 8px;
          background: #e3f2fd; color: #1565c0;
          font-size: 12px; font-weight: 500;
          border: 1px solid #90caf9;
        }

        .eligibility-list {
          display: flex; flex-direction: column; gap: 4px;
        }
        .eligibility-item {
          font-size: 13px; color: var(--soil);
          display: flex; align-items: flex-start; gap: 6px;
        }

        .apply-box {
          margin-top: 16px; padding: 14px 16px;
          background: linear-gradient(135deg, #f0f7ec, #e8f5e9);
          border: 1px solid var(--sage); border-radius: 12px;
          display: flex; align-items: flex-start; gap: 10px;
        }
        .apply-text { font-size: 13px; color: var(--soil); line-height: 1.5; }
        .apply-text strong { color: var(--moss); }

        .official-link {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 12px; padding: 10px 20px;
          background: var(--moss); color: var(--mint);
          border-radius: 10px; font-size: 13px; font-weight: 600;
          text-decoration: none; transition: all 0.2s;
        }
        .official-link:hover { background: var(--soil); }

        /* LOADING & ERROR */
        .loading-state {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px; padding: 60px;
          color: var(--earth);
        }
        .spinner {
          width: 32px; height: 32px; border-radius: 50%;
          border: 3px solid var(--wheat);
          border-top-color: var(--moss);
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state {
          text-align: center; padding: 60px;
          color: var(--earth);
        }
        .empty-state .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-state p { font-size: 15px; }

        .error-box {
          background: #fdf3f2; border: 1px solid #e8b4b0;
          border-radius: 12px; padding: 16px;
          color: #8b2020; font-size: 14px; text-align: center;
        }

        @media (max-width: 600px) {
          .scheme-header { flex-wrap: wrap; gap: 12px; }
          .scheme-right { flex-direction: row; align-items: center; }
        }
      `}</style>

      <div className="schemes-root">
        <Header />
        <div className="bg-texture" />
        <div className="wrapper">

          {/* Page Header */}
          <header className="schemes-header">
            <div className="header-badge"><span>🏛️</span> Government Support</div>
            <h1>Agricultural <em>Schemes</em><br />& Subsidies</h1>
            <p>Explore government schemes, subsidies, and support programs available for Indian farmers.</p>
          </header>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-icon">✦</div>
            <div className="divider-line" />
          </div>

          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search schemes by name, benefit, or keyword..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          {/* Category Filters */}
          <div className="category-scroll">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => handleCategory(cat.id)}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {!loading && !error && (
            <p className="results-count">
              Showing {schemes.length} scheme{schemes.length !== 1 ? "s" : ""}
              {activeCategory !== "all" ? ` in selected category` : ""}
              {search ? ` for "${search}"` : ""}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading schemes...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-box">⚠️ {error}</div>
          )}

          {/* Schemes List */}
          {!loading && !error && (
            <div className="schemes-list">
              {schemes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔎</div>
                  <p>No schemes found. Try a different search or category.</p>
                </div>
              ) : (
                schemes.map((scheme, idx) => {
                  const colors  = CATEGORY_COLORS[scheme.category] || CATEGORY_COLORS.financial;
                  const isOpen  = expanded === scheme.id;

                  return (
                    <div
                      key={scheme.id}
                      className="scheme-card"
                      style={{
                        borderColor: isOpen ? colors.border : undefined,
                        animationDelay: `${idx * 0.05}s`
                      }}
                    >
                      {/* Card Header */}
                      <div
                        className="scheme-header"
                        onClick={() => toggleExpand(scheme.id)}
                      >
                        <div
                          className="scheme-emoji"
                          style={{ background: colors.bg }}
                        >
                          {scheme.emoji}
                        </div>

                        <div className="scheme-info">
                          <div className="scheme-name">{scheme.name}</div>
                          <div className="scheme-desc">{scheme.description}</div>
                        </div>

                        <div className="scheme-right">
                          <div
                            className="scheme-badge"
                            style={{ background: colors.badge }}
                          >
                            {scheme.category}
                          </div>
                          <span className={`expand-btn ${isOpen ? "open" : ""}`}>▼</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      {isOpen && (
                        <div
                          className="scheme-body"
                          style={{ borderTopColor: colors.border }}
                        >
                          {/* Benefits */}
                          <div className="scheme-section">
                            <div className="scheme-section-title">✅ Key Benefits</div>
                            <div className="benefits-list">
                              {scheme.benefits.map((b, i) => (
                                <div className="benefit-item" key={i}>
                                  <div className="benefit-dot" />
                                  {b}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Eligibility */}
                          <div className="scheme-section">
                            <div className="scheme-section-title">👤 Eligibility</div>
                            <div className="eligibility-list">
                              {scheme.eligibility.map((e, i) => (
                                <div className="eligibility-item" key={i}>
                                  <span>•</span> {e}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="scheme-section">
                            <div className="scheme-section-title">📄 Required Documents</div>
                            <div className="docs-grid">
                              {scheme.documents.map((d, i) => (
                                <span className="doc-tag" key={i}>{d}</span>
                              ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="scheme-section">
                            <div className="scheme-section-title">🏷️ Tags</div>
                            <div className="tags-list">
                              {scheme.tags.map((t, i) => (
                                <span className="tag" key={i}>#{t}</span>
                              ))}
                            </div>
                          </div>

                          {/* How to Apply */}
                          <div className="apply-box">
                            <span style={{ fontSize: 20 }}>📝</span>
                            <div className="apply-text">
                              <strong>How to Apply: </strong>{scheme.how_to_apply}
                            </div>
                          </div>

                          {/* Official Link */}
                          <a href={scheme.official_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="official-link"
                          >
                            {"🌐 Visit Official Website →"}
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}