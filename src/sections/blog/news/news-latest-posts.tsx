// src/sections/blog/news/news-latest-posts.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  query,
  getDocs,
  orderBy,
  collection,
  limit,
  startAfter,
} from 'firebase/firestore';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { useResponsive } from 'src/hooks/use-responsive';
import { db } from 'src/libs/firebase';
import PostItem from './news-post-item';
import PostItemMobile from '../common/post-item-mobile';

// ----------------------------------------------------------------------

export default function NewsLatestPosts() {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');

  const [posts, setPosts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState<number>(1);
  const pageSize = 16;

  useEffect(() => {
    const currentPage = parseInt((router.query.page as string) || '1', 10);
    setPage(currentPage);
  }, [router.query.page]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch all IDs to calculate total pages
        const allSnap = await getDocs(
          query(collection(db, 'newsPosts'), orderBy('createdAt', 'desc'))
        );
        const total = allSnap.docs.length;
        setTotalPages(Math.ceil(total / pageSize));

        // Determine where to start
        const offset = (page - 1) * pageSize;
        let startAfterDoc = null;
        if (offset > 0 && offset < total) {
          // @ts-ignore
          startAfterDoc = allSnap.docs[offset - 1];
        }

        // Query for the current page
        let q = query(
          collection(db, 'newsPosts'),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );

        if (startAfterDoc) {
          q = query(
            collection(db, 'newsPosts'),
            orderBy('createdAt', 'desc'),
            startAfter(startAfterDoc),
            limit(pageSize)
          );
        }

        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : '',
          };
        });

        setPosts(data);
      } catch (err) {
        console.error('Error fetching news:', err);
      }
    };

    fetchPosts();
  }, [page]);

  const handlePageChange = (_: any, value: number) => {
    router.push(`/?page=${value}`);
  };

  return (
    <Container sx={{ py: { xs: 7, md: 4, lg: 1 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={{ xs: 'center', md: 'space-between' }}
        sx={{ mb: { xs: 8, md: 4 } }}
      >
        <Typography variant="h3">Latest News</Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 3, md: 4 },
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {posts.map((post) =>
          mdUp ? (
            <PostItem key={post.id} post={post} />
          ) : (
            <PostItemMobile key={post.id} post={post} />
          )
        )}
      </Box>

      <Stack alignItems="center" sx={{ mt: 6 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Stack>
    </Container>
  );
}
