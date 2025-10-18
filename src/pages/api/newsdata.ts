// src/pages/api/newsdata.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { db } from 'src/libs/firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Fetch real news
    const newsRes = await fetch(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&q=AI+OR+crypto+OR+business&language=en&category=business,technology`
    );


    const { results } = await newsRes.json();
    if (!results?.length) {
      return res.status(404).json({ error: 'No articles found' });
    }
    const article = results[0];


    // Normalize image URL (remove tracking/query strings)
    const cleanImage =
      article.image_url?.split('?')[0].trim() || '/assets/background/placeholder.jpg';

    // 2️⃣ Rewrite with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content:
            'Rewrite this article in your own words as an engaging, detailed news article (400–600 words). Add a catchy title, a summary paragraph, key facts, and a natural, journalistic tone. Never copy text directly.',
        },
        {
          role: 'user',
          content: `
Title: ${article.title}
Description: ${article.description || ''}
Content: ${article.content || ''}
URL: ${article.link}

Rewrite this into a complete 400–600 word article with a headline, intro, and detailed sections.
If there’s little content, expand naturally based on context from the title and description.
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
        collection(db, 'featuredPosts'),
        where('slug', '==', slug)
      )
    );

    if (!duplicates.empty) {
      console.log('⏩ Skipped duplicate slug:', slug);
      return res.status(200).json({ message: 'Skipped duplicate slug' });
    }

    const duplicatesByImage = await getDocs(
      query(
        collection(db, 'featuredPosts'),
        where('imageUrl', '==', cleanImage)
      )
    );

    if (!duplicatesByImage.empty) {
      console.log('⏩ Skipped duplicate image:', cleanImage);
      return res.status(200).json({ message: 'Skipped duplicate image' });
    }

    // 5️⃣ Save to Firestore
    await addDoc(collection(db, 'featuredPosts'), {
      title,
      slug,
      content,
      originalSource: article.link,
      imageUrl: cleanImage,
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({ success: true, title, slug });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
