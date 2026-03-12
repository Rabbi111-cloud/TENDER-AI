export default async function handler(req, res) {

const { text } = req.body;

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
"Content-Type": "application/json",
"HTTP-Referer": "https://yourproject.vercel.app",
"X-Title": "Tender AI"
},
body: JSON.stringify({
model: "deepseek/deepseek-chat",
messages: [
{
role: "system",
content: "You are an expert tender analyst that extracts requirements, deadlines and summaries."
},
{
role: "user",
content: "Analyze this tender document and summarize it:\n" + text
}
]
})
});

const data = await response.json();

res.status(200).json(data);

}
