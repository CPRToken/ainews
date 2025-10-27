// src/pages/api/news.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { db } from 'src/libs/firebase';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const NEWS_API_KEY = process.env.NEWS_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Fetch real news
    const newsRes = await fetch(
      `https://newsapi.org/v2/everything?q=technology&sortBy=publishedAt&language=en&pageSize=1&apiKey=${NEWS_API_KEY}`
    );

    const { articles } = await newsRes.json();
    if (!articles?.length) {
      return res.status(404).json({ error: 'No articles found' });
    }

    const article = articles[0];

    // Normalize image URL (remove tracking/query strings)
    const cleanImage =
      article.urlToImage?.split('?')[0].trim() || '/assets/background/placeholder.jpg';


    // 2️⃣ Rewrite with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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

    // 3️⃣ Create slug
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    // 4️⃣ Check for duplicates by both image and slug
    const duplicates = await getDocs(
      query(
        collection(db, 'noticiasPosts'),
        where('slug', '==', slug)
      )
    );

    if (!duplicates.empty) {
      console.log('⏩ Skipped duplicate slug:', slug);
      return res.status(200).json({ message: 'Skipped duplicate slug' });
    }

    const duplicatesByImage = await getDocs(
      query(
        collection(db, 'noticiasPosts'),
        where('imageUrl', '==', cleanImage)
      )
    );

    if (!duplicatesByImage.empty) {
      console.log('⏩ Skipped duplicate image:', cleanImage);
      return res.status(200).json({ message: 'Skipped duplicate image' });
    }

    // 5️⃣ Save to Firestore
    await addDoc(collection(db, 'noticiasPosts'), {
      title,
      slug,
      content,
      originalSource: article.url,
      imageUrl: cleanImage,
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({ success: true, title, slug });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
