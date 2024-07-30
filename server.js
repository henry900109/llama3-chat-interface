const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
// 移除 express-session，因為無服務器環境不支持會話
// const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 移除 session 中間件
// app.use(session({...}));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // 使用環境變量
});

// 移除登錄和登出路由，因為我們不再使用會話
// app.post('/login', ...);
// app.post('/logout', ...);

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一個有幫助的AI助手。請使用繁體中文回答。' },
        ...messages
      ],
      model: 'llama3-70b',
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content || 'No response' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// 為了 Vercel 的無服務器環境，我們需要導出 app
module.exports = app;

// 如果不是在 Vercel 環境中，則啟動服務器
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}