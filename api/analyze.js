export default async function handler(req, res) {

const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
"Content-Type": "application/json"
},
body: JSON.stringify({
model: "gpt-4.1",
messages: [
{
role: "system",
content: "You are an expert tender analyst."
},
{
role: "user",
content: "Analyze this tender document and summarize it: " + req.body.text
}
]
})
});

const data = await response.json();

res.status(200).json(data);

}
