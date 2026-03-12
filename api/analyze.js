export default async function handler(req, res) {

if (req.method !== "POST") {
  return res.status(405).json({ error: "Only POST allowed" });
}

try {

const { text } = req.body;

if (!text) {
  return res.status(400).json({ error: "No tender text provided" });
}

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
"Content-Type": "application/json"
},
body: JSON.stringify({
model: "deepseek/deepseek-chat",
messages: [
{
role: "system",
content: "You are an expert procurement analyst."
},
{
role: "user",
content: `
Analyze the tender document and extract:

1. Project summary
2. Key requirements
3. Important deadlines
4. Evaluation criteria

Tender:
${text}
`
}
]
})
});

const data = await response.json();

res.status(200).json({
analysis: data.choices[0].message.content
});

} catch (error) {

res.status(500).json({
error: "AI analysis failed",
details: error.message
});

}

}
