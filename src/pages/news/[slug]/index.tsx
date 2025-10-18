// src/pages/news/[slug]/index.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from 'src/libs/firebase';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function NewsPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPostBySlug = async () => {
      const q = query(collection(db, 'featuredPosts'), where('slug', '==', slug), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) setPost({ id: snap.docs[0].id, ...snap.docs[0].data() });
    };

    fetchPostBySlug();
  }, [slug]);

  if (!post) return null;

  return (
    <Container sx={{ py: 6 }}>
      {post.imageUrl && (
        <Box
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={{
            width: '100%',
            height: { xs: 260, md: 420 },
            borderRadius: 2,
            objectFit: 'cover',
            mb: 4,
          }}
        />
      )}

      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        {post.title}
      </Typography>

      {post.content
        ?.split(/\n+/)
        .filter(Boolean)
        .map((para: string, i: number) => (
          <Typography key={i} variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontSize: 17 }}>
            {para}
          </Typography>
        ))}
    </Container>
  );
}
