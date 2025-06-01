require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GPT에게 질문을 전달하고 답변을 받는 엔드포인트
app.post('/api/ask', async (req, res) => {
  const { messages } = req.body; // [{role: 'user'|'assistant', content: '...'}]
  if (!messages) {
    return res.status(400).json({ error: 'messages가 필요합니다.' });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages,
      temperature: 0.7,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
}); 