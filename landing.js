// landing.js

// Clear body and set base styles
document.body.style.margin = "0";
document.body.style.fontFamily = "'Inter', sans-serif";
document.body.style.background = "#f5f6fa";
document.body.style.color = "#2d3436";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.alignItems = "center";

// Helper to create elements
function create(tag, parent, innerText, styles = {}, className = "") {
    const el = document.createElement(tag);
    if (innerText) el.innerText = innerText;
    Object.assign(el.style, styles);
    if (className) el.className = className;
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

// INPUT AREA
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

// SPINNER
const spinner = create("div", document.body, "Analyzing...", {
    display: "none",
    fontSize: "1.2rem",
    color: "#0984e3",
    fontWeight: "600",
    marginBottom: "20px"
});

// OUTPUT AREA CONTAINER
const outputContainer = create("div", document.body, null, {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "50px"
});

// Function to create AI output cards
function createCard(title, content) {
    const card = create("div", outputContainer, null, {
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        position: "relative"
    });
    create("h3", card, title, { color: "#0984e3", marginBottom: "10px" });
    const textEl = create("pre", card, content, {
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: "1rem"
    });

    // Copy button
    const copyBtn = create("button", card, "Copy", {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#0984e3",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "0.9rem"
    });
    copyBtn.onmouseover = () => copyBtn.style.backgroundColor = "#74b9ff";
    copyBtn.onmouseout = () => copyBtn.style.backgroundColor = "#0984e3";
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(content);
        copyBtn.innerText = "Copied!";
        setTimeout(() => copyBtn.innerText = "Copy", 1000);
    };
}

// ANALYZE BUTTON CLICK
analyzeBtn.onclick = async () => {
    const text = inputBox.value.trim();
    if (!text) return alert("Please paste tender text!");

    analyzeBtn.disabled = true;
    spinner.style.display = "block";
    outputContainer.innerHTML = "";

    try {
        const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error("API request failed");
        const data = await res.json();

        // Split AI response by sections if it has keywords
        const analysisText = data.analysis || "";
        const sections = ["Summary", "Requirements", "Deadlines"];
        let hasSections = false;
        sections.forEach(section => {
            const regex = new RegExp(`${section}:([\\s\\S]*?)(?=(Summary|Requirements|Deadlines|$))`, "i");
            const match = analysisText.match(regex);
            if (match && match[1]) {
                createCard(section, match[1].trim());
                hasSections = true;
            }
        });

        // If AI response doesn't match sections, show full text
        if (!hasSections) createCard("Analysis", analysisText);

    } catch (err) {
        createCard("Error", err.message);
    }

    spinner.style.display = "none";
    analyzeBtn.disabled = false;
};
