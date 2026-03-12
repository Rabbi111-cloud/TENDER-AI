export default async function handler(req, res) {

const { text } = req.body;

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
content: "You analyze tender documents."
},
{
role: "user",
content: "Summarize this tender:\n" + text
}
]
})
});

const data = await response.json();

res.status(200).json(data);

}
