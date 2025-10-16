// src/pages/api/news.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { db } from 'src/libs/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const NEWS_API_KEY = process.env.NEWS_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Fetch real news
    const newsRes = await fetch(
      `https://newsapi.org/v2/everything?q=technology&sortBy=publishedAt&language=en&pageSize=1&apiKey=${NEWS_API_KEY}`
    );

    const { articles } = await newsRes.json();
    if (!articles?.length) throw new Error('No articles found');
    const article = articles[0];

    // 2️⃣ Rewrite with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content:
            'Reescribe este artículo con tus propias palabras como una noticia atractiva y detallada (400–600 palabras). Agrega un título llamativo, un párrafo resumen, hechos clave y un tono periodístico natural. Nunca copies el texto directamente..',
        },
        {
          role: 'user',
          content: `
Title: ${article.title}
Description: ${article.description || ''}
Content: ${article.content || ''}
URL: ${article.url}

Reescribe todo en un artículo completo de 400–600 palabras con titular, introducción y secciones desarrolladas.
Si hay poco contenido, amplíalo de forma natural según el contexto del título y la descripción.
`,
        },
      ],
    });

    const result = completion.choices[0].message?.content ?? '';
    const [titleLine, ...contentLines] = result.split('\n');
    const title = titleLine.replace(/^# /, '').trim();
    const content = contentLines.join('\n').trim();

    // 3️⃣ Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    // 4️⃣ Save to Firestore
    const fallbackImage = '/assets/background/placeholder.jpg';
    const imageUrl =
      article.urlToImage && article.urlToImage.startsWith('http')
        ? article.urlToImage
        : fallbackImage;

// 5️⃣ Save to Firestore
    await addDoc(collection(db, 'noticiasPosts'), {
      title,
      slug,
      content,
      originalSource: article.url,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    res.status(200).json({ success: true, title, slug });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
