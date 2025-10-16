import { useEffect, useState, useCallback } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from 'src/libs/firebase';

import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useResponsive } from 'src/hooks/use-responsive';
import { fDate } from 'src/utils/format-time';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import NewsNewsletter from '../news-newsletter';
import PostAuthor from '../../blog/common/post-author';
import NewsLatestPosts from '../../blog/news/news-latest-posts';
import PostSocialsShare from '../../blog/common/post-socials-share';

// ----------------------------------------------------------------------

export default function NewsPostView() {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  const [posts, setPosts] = useState<any[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [open, setOpen] = useState<HTMLElement | null>(null);

  // ✅ define all hooks first — not conditionally
  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  const handleChangeFavorite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFavorite(event.target.checked);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'newsPosts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date(),
        };
      });
      setPosts(data);
    };
    fetchPosts();
  }, []);

  if (!posts.length) return null;

  const post = posts[0];

  return (
    <>
      <Divider />

      <Container sx={{ overflow: 'hidden' }}>
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: paths.news.posts },
            { name: post.title },
          ]}
          sx={{ my: 5 }}
        />

        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}
        >
          <Fab
            color="primary"
            sx={{
              zIndex: 9,
              position: 'absolute',
            }}
          >
            <Iconify icon="carbon:play" width={24} />
          </Fab>

          <Image
            alt="hero"
            src={post.heroUrl || post.imageUrl || '/assets/background/placeholder.jpg'}
            ratio={mdUp ? '21/9' : '16/9'}
            overlay={`linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0)} 0%, ${
              theme.palette.common.black
            } 75%)`}
          />
        </Stack>

        <Grid container spacing={3} justifyContent={{ md: 'center' }}>
          <Grid xs={12} md={8}>
            <Stack
              spacing={3}
              sx={{
                pb: 6,
                textAlign: 'center',
                pt: { xs: 6, md: 10 },
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                {post.duration || '2 min read'}
              </Typography>

              <Typography variant="h2" component="h1">
                {post.title}
              </Typography>

              <Typography variant="h5">{post.description}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" spacing={1.5} sx={{ py: 3 }}>
              <Avatar src={post.author?.avatarUrl} sx={{ width: 48, height: 48 }} />

              <Stack spacing={0.5} flexGrow={1}>
                <Typography variant="subtitle2">{post.author?.name || 'Unknown Author'}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {fDate(post.createdAt, 'dd/MM/yyyy p')}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center">
                <IconButton onClick={handleOpen} color={open ? 'primary' : 'default'}>
                  <Iconify icon="carbon:share" />
                </IconButton>

                <Checkbox
                  color="error"
                  checked={favorite}
                  onChange={handleChangeFavorite}
                  icon={<Iconify icon="carbon:favorite" />}
                  checkedIcon={<Iconify icon="carbon:favorite-filled" />}
                />
              </Stack>
            </Stack>

            <Divider sx={{ mb: 6 }} />

            <Markdown content={post.content || ''} firstLetter />

            <PostSocialsShare />

            <Divider sx={{ mt: 8 }} />

            <PostAuthor author={post.author || { name: 'Guest', avatarUrl: '' }} />

            <Divider />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      <NewsLatestPosts />

      <NewsNewsletter />

      <Popover
        open={!!open}
        onClose={handleClose}
        anchorEl={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: { width: 220 },
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <Iconify icon="mdi:share" width={24} sx={{ mr: 1 }} />
          Share
        </MenuItem>
      </Popover>
    </>
  );
}
