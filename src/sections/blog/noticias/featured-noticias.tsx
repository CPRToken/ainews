import { useState, useEffect } from 'react';
import { query, limit, orderBy, getDocs, collection } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { db } from 'src/libs/firebase';

export default function FeaturedNoticias() {
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      const q = query(collection(db, 'noticiasPosts'), orderBy('createdAt', 'desc'), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) setPost({ id: snap.docs[0].id, ...snap.docs[0].data() });
    };
    fetchFeatured();
  }, []);

  if (!post) return null;

  return (
    <Box
      sx={{
        width: 570,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: 5,
        bgcolor: 'background.paper',
      }}
    >
      {/* 🖼️ Image on top */}
      <Box
        component="img"
        src={post.imageUrl || '/assets/background/placeholder.jpg'}
        alt={post.title}
        sx={{
          width: '100%',
          height: 300,
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* 📄 Content below */}
      <Stack direction="row" spacing={3} sx={{ p: 3 }}>
        <Stack sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">{fDate(post.createdAt, 'MMM')}</Typography>
          <Divider sx={{ mt: 1, mb: 0.5 }} />
          <Typography variant="h3">{fDate(post.createdAt, 'dd')}</Typography>
        </Stack>

        <Stack spacing={1}>
          <Link
            component={RouterLink}
            href={`/es/${post.slug}`}
            color="inherit"
            underline="hover"
          >
            <Typography variant="h5" fontWeight={700}>
              {post.title}
            </Typography>
          </Link>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
            }}
          >
            {post.content}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
