// src/pages/news/index.tsx
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
} from 'firebase/firestore';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { useResponsive } from 'src/hooks/use-responsive';

import { db } from 'src/libs/firebase';

import PostItem from 'src/sections/blog/news/news-post-item';
import PostItemMobile from 'src/sections/blog/common/post-item-mobile';

// ----------------------------------------------------------------------

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = parseInt((context.query.page as string) || '1', 10);
  const pageSize = 16;

  const allSnap = await getDocs(
    query(collection(db, 'newsPosts'), orderBy('createdAt', 'desc'))
  );
  const total = allSnap.docs.length;
  const totalPages = Math.ceil(total / pageSize);

  const offset = (page - 1) * pageSize;

  let startAfterDoc: any = null;
  if (offset > 0 && offset < total) {
    startAfterDoc = allSnap.docs[offset - 1];
  }

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
  const posts = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      ...d,
      createdAt: d.createdAt?.toDate
        ? d.createdAt.toDate().toISOString()
        : '',
    };
  });

  // ✅ You forgot this return
  return {
    props: {
      posts,
      totalPages,
      currentPage: page,
    },
  };
};


// ----------------------------------------------------------------------

export default function NewsPage({ posts, totalPages, currentPage }: any) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');

  const handlePageChange = (_: any, value: number) => {
    router.push(`/news?page=${value}`);
  };

  return (
    <Container sx={{ py: { xs: 7, md: 7, lg: 7 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={{ xs: 'center', md: 'space-between' }}
        sx={{ mb: { xs: 8, md: 6 } }}
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
        {posts.map((post: any) =>
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
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Stack>
    </Container>
  );
}
