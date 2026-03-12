// landing.js

// Clear body and set styles
document.body.style.margin = "0";
document.body.style.fontFamily = "'Inter', sans-serif";
document.body.style.background = "#f5f6fa";
document.body.style.color = "#2d3436";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.alignItems = "center";

// Helper function to create elements
function create(tag, parent, innerText, styles = {}) {
  const el = document.createElement(tag);
  if (innerText) el.innerText = innerText;
  Object.assign(el.style, styles);
  if (parent) parent.appendChild(el);
  return el;
}

// HEADER
const header = create("header", document.body, null, {
  backgroundColor: "#2d3436",
  color: "#fff",
  textAlign: "center",
  padding: "50px 20px",
  width: "100%"
});
create("h1", header, "Tender AI", { fontSize: "3rem", marginBottom: "10px" });
create("p", header, "Paste tender text and get instant AI analysis", { fontSize: "1.2rem", color: "#dfe6e9" });

// FEATURES
const featuresSection = create("section", document.body, null, { padding: "40px 20px", maxWidth: "900px", textAlign: "center" });
create("h2", featuresSection, "How It Works", { fontSize: "2rem", marginBottom: "20px" });
create("p", featuresSection, "1️⃣ Paste your tender text in the box below");
create("p", featuresSection, "2️⃣ Click 'Analyze Tender'");
create("p", featuresSection, "3️⃣ Get a structured summary, requirements, and deadlines");

// INPUT BOX
const inputBox = create("textarea", document.body, null, {
  width: "80%",
  height: "150px",
  padding: "15px",
  fontSize: "1rem",
  margin: "20px 0",
  borderRadius: "8px",
  border: "1px solid #ccc",
  resize: "vertical"
});
inputBox.placeholder = "Paste tender text here...";

// ANALYZE BUTTON
const analyzeBtn = create("button", document.body, "Analyze Tender", {
  backgroundColor: "#0984e3",
  color: "#fff",
  padding: "15px 30px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  marginBottom: "20px"
});
analyzeBtn.onmouseover = () => analyzeBtn.style.backgroundColor = "#74b9ff";
analyzeBtn.onmouseout = () => analyzeBtn.style.backgroundColor = "#0984e3";

// OUTPUT AREA
const outputDiv = create("div", document.body, null, {
  width: "80%",
  minHeight: "100px",
  padding: "20px",
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  whiteSpace: "pre-wrap",
  fontSize: "1rem",
  marginBottom: "50px"
});

// ANALYZE BUTTON CLICK
analyzeBtn.onclick = async () => {
  const text = inputBox.value.trim();
  if (!text) return alert("Please paste tender text!");

  analyzeBtn.disabled = true;
  analyzeBtn.innerText = "Analyzing...";
  outputDiv.innerText = "";

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!res.ok) throw new Error("API request failed");

    const data = await res.json();
    outputDiv.innerText = data.analysis || "No analysis returned.";

  } catch (err) {
    outputDiv.innerText = "Error: " + err.message;
  }

  analyzeBtn.disabled = false;
  analyzeBtn.innerText = "Analyze Tender";
};
