const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate-site', async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Ты генератор HTML-сайтов. Возвращай только готовый HTML-код без комментариев.' },
        { role: 'user', content: `Сгенерируй одностраничный сайт по описанию: ${prompt}` }
      ],
      max_tokens: 1500
    });

    const html = completion.data.choices[0].message.content;
    res.json({ html });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка генерации сайта' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
