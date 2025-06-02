require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. API 라우트 먼저!
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

// 2. 정적 파일 서빙
app.use(express.static(path.join(__dirname, '../client/dist')));

// 3. SPA 라우트는 맨 마지막!
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
}); 