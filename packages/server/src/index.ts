import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message
  });

    res.json({ response: response.text });
  } catch (error) {
    console.error('Error calling AI API:', (error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});