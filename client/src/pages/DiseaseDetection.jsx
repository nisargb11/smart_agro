import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import "./DiseaseDetection.css";
import { useTranslation } from "react-i18next";

const DISEASE_INFO = {
  "Tomato Early Blight": {
    treatment: "Apply copper-based fungicide every 7–10 days. Remove infected leaves immediately and destroy them.",
    prevention: "Rotate crops yearly. Avoid overhead watering. Mulch around plants to prevent soil splash."
  },
  "Tomato Bacterial spot": {
    treatment:
      "Apply copper-based bactericide sprays every 7–10 days during warm, wet weather. Remove and destroy heavily infected leaves. Avoid working in the garden when plants are wet.",
    prevention:
      "Use certified disease-free seeds and transplants. Avoid overhead watering. Rotate tomatoes with non-solanaceous crops each year. Disinfect tools between plants.",
  },
  "Tomato Late Blight": {
    treatment: "Apply chlorothalonil or mancozeb fungicide. Remove and destroy all infected plant parts.",
    prevention: "Improve air circulation. Avoid wetting foliage. Destroy infected debris after harvest."
  },
  "Tomato Leaf mold": {
    treatment:
      "Apply fungicide containing chlorothalonil, mancozeb, or copper every 7–10 days. Remove infected leaves. Increase ventilation in greenhouses immediately.",
    prevention:
      "Maintain greenhouse humidity below 85%. Prune lower leaves to improve airflow. Avoid overhead watering. Use resistant tomato varieties in high-humidity environments.",
  },
  "Tomato Septoria leaf spot": {
    treatment:
      "Apply copper-based or chlorothalonil fungicide every 7–10 days from first symptom appearance. Remove all infected leaves and destroy them — do not compost.",
    prevention:
      "Rotate crops every 2–3 years. Mulch around plants to prevent soil splash. Avoid overhead irrigation. Remove and destroy all plant debris at end of season.",
  },
  "Tomato Spider mites Two-spotted spider mite": {
    treatment:
      "Spray plants thoroughly with insecticidal soap, neem oil, or miticide (abamectin or bifenazate) targeting the underside of leaves where mites feed. Repeat every 5–7 days for 2–3 applications. Remove heavily infested leaves.",
    prevention:
      "Keep plants well-watered — water-stressed plants are more susceptible. Avoid dusty conditions around plants. Introduce predatory mites (Phytoseiulus persimilis) for biological control in greenhouses. Avoid broad-spectrum insecticides that kill natural predators.",
  },
  "Tomato Target spot": {
    treatment:
      "Apply fungicide containing azoxystrobin, chlorothalonil, or mancozeb every 7–14 days when disease is first detected. Remove infected lower leaves to slow spread.",
    prevention:
      "Avoid overhead irrigation. Maintain good plant spacing for air circulation. Remove and destroy all crop debris at end of season. Rotate tomatoes with non-solanaceous crops.",
  },
  "Tomato Tomato mosaic virus": {
    treatment:
      "There is no cure for mosaic virus. Remove and destroy infected plants immediately to prevent spread. Wash hands and disinfect all tools thoroughly after handling infected plants.",
    prevention:
      "Use certified virus-free seeds and transplants. Control aphid populations with insecticidal soap as aphids spread the virus. Avoid tobacco products near plants — tobacco mosaic virus can spread from tobacco to tomatoes. Plant resistant varieties.",
  },
  "Tomato Tomato Yellow Leaf Curl Virus": {
    treatment:
      "There is no cure. Remove and destroy infected plants immediately. Apply systemic insecticide to control whitefly populations which transmit the virus to remaining healthy plants.",
    prevention:
      "Use yellow sticky traps to monitor and reduce whitefly populations. Apply reflective mulch to deter whiteflies. Plant TYLCV-resistant tomato varieties. Use insect-proof netting in nurseries and early crop stages.",
  },
  "Potato Late Blight": {
    treatment: "Apply systemic fungicide (metalaxyl). Remove and destroy infected plants immediately.",
    prevention: "Use certified disease-free seed potatoes. Avoid overhead irrigation."
  },
  "Potato Early Blight":{
    treatment:"Water only at the base of the plant; avoid overhead watering because wet leaves help the fungus spread.Apply a fungicide such as Mancozeb, Chlorothalonil, or a copper fungicide every 7–10 days if weather is warm and humid. Begin spraying as soon as you notice the first spots.",
    prevention:"Rotate potatoes and other nightshade crops away from the same area for at least 2–3 years.Use disease-free seed potatoes.Add straw mulch to reduce soil splash onto leaves.Avoid nutrient stress; plants low in nitrogen or phosphorus are more likely to develop early blight.Remove all old potato debris after harvest because the fungus survives in dead leaves and stems over winter."
  },
  "Healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention: "Maintain regular watering schedule, balanced fertilization, and routine monitoring."
  },
  "Strawberry Leaf Scorch":{
    treatment:"Remove and destroy all infected leaves immediately. Do not compost them.\n Thin crowded plants to improve airflow.\n Water only at the base of the plant; avoid wetting the leaves.\nIf the infection is severe, spray a fungicide labeled for strawberries such as captan, chlorothalonil, copper fungicide, or thiophanate-methyl. Apply every 10–14 days during wet weather, following the product label carefully. Fungicides work best when started early.",
    prevention:"Use drip irrigation instead of overhead watering.Space plants properly so leaves dry quickly.Remove dead leaves and old plant debris regularly because the fungus survives there over winter.Mulch with straw to keep soil and fungal spores from splashing onto leaves.Avoid too much nitrogen fertilizer, which produces dense, wet foliage.Rotate or replace strawberry beds every 2–3 years, since older beds are more likely to develop the disease.Plant resistant varieties when possible, such as Allstar strawberry, Honeoye, and Earliglow."
  },
  "Grape Leaf Blight":{
    treatment:"Remove and destroy infected leaves and fallen debris.Prune the vine to improve air circulation and sunlight.Avoid overhead watering; water only at the base.Spray a fungicide such as mancozeb, chlorothalonil, copper fungicide, or thiophanate-methyl every 7–14 days during humid or rainy periods. Begin spraying as soon as you notice the first spots.For mild cases, sulfur or copper sprays are often effective and commonly recommended by grape growers.",
    prevention:"Space and prune vines so air can move freely through the canopy.Keep the area under the vine clean and free of fallen leaves.Mulch around the plant to reduce soil splash.Do not wet the foliage while watering.Avoid excess nitrogen fertilizer because it creates dense, moist growth that encourages disease.Start preventive fungicide sprays before the rainy season if leaf blight has occurred before. Wet, rainy conditions strongly favor the disease and its spread by wind and splashing water."
  },
  "Corn (maize) Northern Leaf Blight":{
    treatment:"Avoid overhead irrigation; water at the base if possible.Apply a foliar fungicide such as chlorothalonil, mancozeb, azoxystrobin, pyraclostrobin, or propiconazole when the disease first appears, especially before or around silking. Reapply according to the label if humid weather continues.Fungicide is most useful when lesions appear on the ear leaf or higher before grain filling is complete.",
    prevention:"Plant resistant or moderately resistant corn hybrids whenever possible. This is the most effective long-term control.Rotate corn with non-corn crops for 1–2 years.Remove or plow under old corn residue because the fungus survives through winter in infected leaves and stalks.The disease spreads fastest when temperatures stay between 18–27°C with leaves wet for 6–18 hours from rain, dew, or humidity, so extra monitoring is important during humid weather."
  },
  "Corn (maize) Cercospora leaf spot Gray leaf spot":{
    treatment:"Avoid overhead irrigation; keep leaves as dry as possible.Apply a fungicide when the disease first appears, especially from tasseling to silking. Effective fungicides include azoxystrobin, pyraclostrobin, propiconazole, chlorothalonil, or mancozeb. Fungicide is most useful if symptoms are present on the lower leaves before tasseling and humid weather is expected to continue.",
    prevention:"Plant resistant corn hybrids whenever possible; this is the most effective long-term control.Remove, bury, or plow under old corn residue because the fungus survives on infected leaves and stalks for up to two years.Avoid continuous corn planting and no-till fields if the disease has been severe before, because these conditions increase the amount of surviving fungusMonitor fields carefully during warm weather around 27°C with humidity above 90%, since these conditions strongly favor outbreaks."
  },
  "Corn (maize) Common Rust":{
    treatment:"Avoid overhead irrigation because wet leaves encourage the disease.Apply a fungicide if rust appears before tasseling or becomes severe. Effective options include azoxystrobin, pyraclostrobin, propiconazole, mancozeb, or chlorothalonil. Spray according to the label and repeat if wet, cool weather continues.Fungicide is most beneficial when pustules are spreading onto the ear leaf and upper leaves before grain fill.",
    prevention:"Remove old crop debris after harvest.Monitor fields during cool, humid weather, especially when temperatures stay around 16–25°C with frequent dew or rain, because these conditions strongly favor common rust.Maintain balanced fertilizer levels because stressed plants are more vulnerable."
  },
  "Pepper, bell bacterial spot":{
    treatment:"Do not touch healthy plants after handling infected ones unless you wash your hands and tools.Avoid overhead watering; water only at the base of the plant.Spray copper-based bactericides such as copper hydroxide or copper + mancozeb every 7–10 days during warm, humid weather. These sprays help slow the disease but usually do not cure heavily infected plants.Some growers also use biological controls such as Bacillus subtilis or Bacillus velezensis products to reduce spread.",
    prevention:"Use certified disease-free seeds and transplants because the bacteria often spread through infected seed.Keep plants spaced well apart for better airflow.Mulch around the plants to reduce soil splash.Avoid working with pepper plants when the leaves are wet, since the bacteria spread easily through water and handling."
  },
  "Apple scab": {
    treatment:
      "Apply fungicides containing myclobutanil, captan, or thiophanate-methyl at 7–10 day intervals during wet spring weather. Remove and destroy all fallen infected leaves and fruit.",
    prevention:
      "Rake and destroy fallen leaves in autumn to reduce overwintering spores. Plant scab-resistant apple varieties. Prune trees to improve air circulation and light penetration.",
  },
  "Apple Black rot": {
    treatment:
      "Prune out all cankers, mummified fruits, and dead wood at least 15 cm beyond visible infection. Apply captan or thiophanate-methyl fungicide from pink bud stage through harvest.",
    prevention:
      "Remove all mummified fruits from the tree and ground. Avoid wounding trees during pruning. Maintain tree vigor with proper fertilization. Destroy pruned infected material — do not leave it near the orchard.",
  },
  "Apple Cedar apple rust": {
    treatment:
      "Apply myclobutanil or propiconazole fungicide from pink bud through petal fall, every 7–10 days during wet weather. Both the apple and nearby juniper/cedar hosts need to be managed.",
    prevention:
      "Remove nearby eastern red cedar or juniper trees if possible, as they are the alternate host. Plant rust-resistant apple varieties. Apply preventive fungicide sprays before orange spore masses appear on cedars in spring.",
  },
  "Apple healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention:
      "Maintain regular watering, balanced fertilization, and annual pruning. Monitor regularly for early signs of scab, rust, or rot.",
  },
  "Blueberry healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention:
      "Maintain soil pH between 4.5–5.5. Mulch with pine bark or wood chips. Water consistently and monitor for mummy berry and botrytis.",
  },
  "Cherry (including sour)  healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention:
      "Prune annually for good air circulation. Avoid overhead irrigation. Monitor for leaf spot and brown rot during wet seasons.",
  },
  "Cherry (including sour)  Powdery mildew": {
    treatment:
      "Apply sulfur-based or potassium bicarbonate fungicide as soon as white powdery patches appear. Repeat every 7–14 days. Remove heavily infected shoots.",
    prevention:
      "Prune trees to improve airflow and reduce humidity around foliage. Avoid excess nitrogen fertilizer which produces dense succulent growth. Plant resistant varieties where available.",
  },
  "Grape Black rot": {
    treatment:
      "Apply myclobutanil, mancozeb, or captan fungicide beginning at bud break and continuing every 7–14 days through veraison. Remove and destroy all mummified berries and infected shoots.",
    prevention:
      "Remove all mummified fruit from vines and ground before bud break. Prune to improve air circulation. Avoid wetting foliage with irrigation. Start preventive sprays early in the season before infection occurs.",
  },
  "Grape Esca (Black Measles)": {
    treatment:
      "There is no curative treatment. Remove and destroy severely infected vines. Prune out affected wood well below visible discoloration. Protect pruning wounds immediately with fungicide paste or wound sealant.",
    prevention:
      "Make pruning cuts during dry weather to reduce infection risk. Seal all large pruning wounds immediately. Avoid water stress on vines. Do not replant vines in soil where Esca-infected vines were removed without fumigation.",
  },
  "Grape healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention:
      "Prune annually to open up the canopy. Use drip irrigation to keep foliage dry. Monitor for downy mildew, powdery mildew, and black rot during humid periods.",
  },
  "Orange Haunglongbing (Citrus greening)": {
    treatment:
      "There is no cure for HLB. Remove and destroy infected trees immediately to prevent spread to healthy trees. Treat remaining trees with systemic insecticides to control the Asian citrus psyllid vector.",
    prevention:
      "Use certified HLB-free nursery stock only. Apply systemic insecticides regularly to control psyllid populations. Inspect trees frequently for psyllid infestations and yellowing symptoms. Quarantine and report suspected infections to local agricultural authorities immediately.",
  },
  "Peach Bacterial spot": {
    treatment:
      "Apply copper-based bactericide sprays at petal fall and every 10–14 days during wet weather. Remove severely infected twigs during pruning. Avoid overhead irrigation to reduce leaf wetness.",
    prevention:
      "Plant resistant peach varieties where available. Make pruning cuts during dry weather. Maintain tree vigor to improve natural resistance. Apply copper sprays preventively before wet weather periods.",
  },
  "Peach healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention:
      "Prune annually for good air circulation. Apply preventive copper sprays before rain events. Monitor for bacterial spot and brown rot during wet periods.",
  },
  "Pepper, bell healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention:
      "Use disease-free certified seeds. Avoid overhead watering. Rotate peppers with non-solanaceous crops each season.",
  },
  "Raspberry healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention:
      "Remove and destroy old canes after harvest. Maintain good air circulation by thinning canes. Avoid overhead irrigation. Monitor for gray mold and cane blight.",
  },
  "Soybean healthy": {
    treatment: "No treatment needed. Plant looks healthy!",
    prevention:
      "Rotate soybeans with non-legume crops. Use certified disease-free seed. Monitor for sudden death syndrome and frogeye leaf spot during humid weather.",
  },
  "Squash Powdery mildew": {
    treatment:
      "Apply potassium bicarbonate, sulfur, or neem oil spray as soon as white powdery patches appear. Repeat every 7–10 days. Remove heavily infected leaves to slow spread.",
    prevention:
      "Plant resistant varieties where available. Space plants widely for good air circulation. Avoid excess nitrogen fertilizer. Water at the base of plants — keep foliage dry.",
  },

};

const getInfo = (plant, disease) => {
  const fullName = `${plant} ${disease}`;
  for (const key of Object.keys(DISEASE_INFO)) {
    if (fullName.toLowerCase().includes(key.toLowerCase())) return DISEASE_INFO[key];
  }
  for (const key of Object.keys(DISEASE_INFO)) {
    if (disease.toLowerCase().includes(key.toLowerCase())) return DISEASE_INFO[key];
  }
  return {
    treatment: "Consult a local agricultural expert for targeted treatment options.",
    prevention: "Practice crop rotation, good sanitation, and regular field monitoring."
  };
};

const getSeverityColor = (confidence) => {
  if (confidence >= 80) return "#e74c3c";
  if (confidence >= 50) return "#f39c12";
  return "#27ae60";
};

const getStatusEmoji = (disease) => {
  if (disease.toLowerCase().includes("healthy")) return "✅";
  return "⚠️";
};

export default function DiseaseDetection() {
  const { t } = useTranslation();

  const [image, setImage]             = useState(null);
  const [preview, setPreview]         = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [dragging, setDragging]       = useState(false);
  const [expanded, setExpanded]       = useState(null);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setPredictions([]);
    setError(null);
    setExpanded(null);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleDetect = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setPredictions([]);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("http://localhost:3000/api/disease", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Detection failed");
      setPredictions(data.predictions);
        setPlantInfo({
        plant: data.detected_plant,
        confidence: data.plant_confidence
});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setPredictions([]);
    setError(null);
    setExpanded(null);
    setPlantInfo(null);
  };

  return (
    <div>
      <Header />
      <div className="page">
        <div className="header">
          <span className="headerIcon">🔬</span>
          <div>
            <h1>{t("title")}</h1>
            <p className="subtitle">{t("Upload image")}</p>
          </div>
        </div>
      </div>

      <div className="layout">
        <div className="uploadPanel">
          <div
            className={`dropzone ${dragging ? "dragging" : ""} ${preview ? "hasImage" : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !preview && inputRef.current.click()}
          >
            {preview ? (
              <div className="previewWrapper">
                <img src={preview} alt="Leaf preview" className="previewImage" />
                <div className="previewOverlay">
                  <button
                    className="changeBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current.click();
                    }}
                  >
                    🔄 Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="dropContent">
                <div className="dropIcon">🌿</div>
                <p className="dropText">Drag & drop a leaf image here</p>
                <p className="dropSub">or click to browse</p>
                <p className="dropHint">Supports JPG, PNG, WEBP • Max 5MB</p>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          <div className="btnRow">
            <button
              className="detectBtn"
              onClick={handleDetect}
              disabled={!image || loading}
            >
              {loading ? (
                <><span className="spinner" /> Analyzing...</>
              ) : (
                <>{t("detect")}</>
              )}
            </button>

            {(image || predictions.length > 0) && (
              <button className="resetBtn" onClick={handleReset}>
                {t("reset")}
              </button>
            )}
          </div>

          {error && <div className="errorBox">⚠️ {error}</div>}
        </div>

        <div className="resultsPanel">
          {predictions.length === 0 && !loading && (
            <div className="emptyState">
              <span className="emptyIcon">🌱</span>
              <p>
                {t("result1")} <strong>{t("result2")}</strong> {t("result3")}
              </p>
            </div>
          )}

          {loading && (
            <div className="loadingState">
              <div className="pulseRing" />
              <p>{t("analyze")}</p>
              <span>{t("buffer")}</span>
            </div>
          )}

        {predictions.length > 0 && (
        <>
           <h2 className="resultsTitle">Detection Results</h2>

             {plantInfo && (
             <div className="plantBanner">
             <span className="plantBannerIcon">🌿</span>
            <div>
             <p className="plantBannerTitle">Plant Identified</p>
             <p className="plantBannerName">{plantInfo.plant}</p>
            </div>
            <div className="plantBannerConfidence">
            {plantInfo.confidence}%
        </div>
      </div>
    )}
              <div className="predictionsList">
                {predictions.map((pred, idx) => {
                  const info = getInfo(pred.plant, pred.disease);
                  const isTop = idx === 0;
                  const isExpanded = expanded === idx;
                  const color = getSeverityColor(pred.confidence);
                  const isHealthy = pred.disease.toLowerCase().includes("healthy");

                  return (
                    <div
                      key={idx}
                      className={`predCard ${isTop ? "topCard" : ""}`}
                    >
                      {isTop && <span className="topBadge">🏆 Top Match</span>}

                      <div className="predHeader">
                        <div>
                          <p className="plantName">
                            🌿 {pred.plant}
                          </p>
                          <h3 className="diseaseName">
                            {getStatusEmoji(pred.disease)} {pred.disease}
                          </h3>
                          <span className="confidenceLabel">
                            Confidence: <strong>{pred.confidence}%</strong>
                          </span>
                        </div>

                        <div
                          className="confidenceCircle"
                          style={{ borderColor: color }}
                        >
                          <span style={{ color }}>{pred.confidence}%</span>
                        </div>
                      </div>

                      <div className="barTrack">
                        <div
                          className="barFill"
                          style={{
                            width: `${pred.confidence}%`,
                            background: color,
                          }}
                        />
                      </div>

                      {!isHealthy && (
                        <button
                          className="toggleBtn"
                          onClick={() => setExpanded(isExpanded ? null : idx)}
                        >
                          {isExpanded ? "▲ Hide Details" : "▼ Treatment & Prevention"}
                        </button>
                      )}

                      {isExpanded && !isHealthy && (
                        <div className="infoGrid">
                          <div className="infoCard">
                            <h4>{t("treat")}</h4>
                            <p>{info.treatment}</p>
                          </div>
                          <div className="infoCard">
                            <h4>{t("prevent")}</h4>
                            <p>{info.prevention}</p>
                          </div>
                        </div>
                      )}

                      {isHealthy && (
                        <div className="infoCard" style={{ marginTop: "10px" }}>
                          <p>✅ {info.treatment}</p>
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
    </div>
  );
}