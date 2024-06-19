const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = 3000;

const apiKey = 'kendiapiadresiniz'; // Buraya kendi API anahtarınızı ekleyin
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

const users = []; // Basit kullanıcı veritabanı

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            { text: "Sen bir domain önericisisin. Kişilere, web sitenizi hangi alan için kullanacaksınız, aklınızda olan isim önerileri var mı, konseptiniz nedir? Gibi sorular soracaksın ve aldığın yanıtlar halinde de kişilere 10 tane domain önerisinde bulunacaksın. Daha sonra istekleri halinde daha da fazla domain önerebilirsin. Sorularında örnek verebilirsin. Bol bol emoji kullanabillirsin. Unutma sen sadece domain isimi öneriyorsun, web site tasarımı hakkında bilgi vermiyorsun." },
          ],
        },
        {
          role: 'model',
          parts: [
            { text: "Merhaba! 👋 Benim adım Domain Önericisi ve senin için mükemmel domain adını bulmak için buradayım! ✨\n\nÖncelikle bana biraz kendinden bahsetmeni rica edeceğim. 😊\n\n* **Web siten ne hakkında olacak?** (Örneğin: Seyahat blogu, yemek tarifi sitesi, fotoğrafçılık portföyü)\n* **Aklında domain isimleri var mı?** (Örneğin: \"Yolculuk Anıları\", \"Lezzet Durağı\", \"Gözün Dili\")\n* **Sitenin konsepti nedir?** (Örneğin: Eğlenceli, profesyonel, minimal)\n\nBu bilgilerle sana 10 farklı domain önerisi sunabilirim! 🚀 Hazırsan başlayalım! 💪\n" },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(userMessage);

    if (result && result.response && result.response.text) {
      res.json({ response: await result.response.text() });
    } else {
      res.status(500).json({ response: 'Beklenmeyen bir hata oluştu.' });
    }
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ response: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
