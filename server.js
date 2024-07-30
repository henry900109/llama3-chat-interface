const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
// ���� express-session�A�]���L�A�Ⱦ����Ҥ�����|��
// const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ���� session ������
// app.use(session({...}));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // �ϥ������ܶq
});

// �����n���M�n�X���ѡA�]���ڭ̤��A�ϥη|��
// app.post('/login', ...);
// app.post('/logout', ...);

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: '�A�O�@�Ӧ����U��AI�U��C�Шϥ��c�餤��^���C' },
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

// ���F Vercel ���L�A�Ⱦ����ҡA�ڭ̻ݭn�ɥX app
module.exports = app;

// �p�G���O�b Vercel ���Ҥ��A�h�ҰʪA�Ⱦ�
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}