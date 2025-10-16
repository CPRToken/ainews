// src/sections/_elearning/landing/news-landing-hero.tsx
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { fShortenNumber } from 'src/utils/format-number';

import { bgGradient } from 'src/theme/css';

import { PlayerDialog } from 'src/components/player';

import FeaturedNews from 'src/sections/blog/news/featured-news';

// ----------------------------------------------------------------------

const SUMMARY = [
  { value: 14000, label: 'Subscribers', color: 'warning' },
  { value: 1050, label: 'Sources', color: 'error' },
  { value: 59000, label: 'Articles', color: 'success' },
] as const;

// ----------------------------------------------------------------------

export default function NewsLandingHero() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const videoOpen = useBoolean();

  return (
    <>
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.9),
            imgUrl: '/assets/background/overlay_1.jpg',
          }),
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container
          sx={{
            pt: { xs: 3, md: 5 },   // ✅ adds space from top navbar
            pb: { xs: 2, md: 1 },
          }}
        >
          <Grid container spacing={6} alignItems="center">
            {/* LEFT SIDE */}
            <Grid xs={12} md={6} lg={5}>
              <Stack spacing={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h2">
                  Business AI News

                </Typography>

                <Typography sx={{ color: 'text.secondary' }}>
                  The latest tech and AI news
                </Typography>







                <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

                <Stack
                  direction="row"
                  spacing={{ xs: 3, sm: 10 }}
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  {SUMMARY.map((item) => (
                    <Stack key={item.value} spacing={0.5} sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          top: 8,
                          left: -4,
                          width: 24,
                          height: 24,
                          opacity: 0.24,
                          borderRadius: '50%',
                          position: 'absolute',
                          bgcolor: `${item.color}.main`,
                        }}
                      />
                      <Typography variant="h3">{fShortenNumber(item.value)}+</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Grid>

            {/* RIGHT SIDE */}
            {mdUp && (
              <Grid xs={12} md={6} lg={7}>
                <Box
                  sx={{
                    maxWidth: 520,
                    width: '100%',
                    mx: 'auto',
                  }}
                >
                  <FeaturedNews />
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      <PlayerDialog
        open={videoOpen.value}
        onClose={videoOpen.onFalse}
        videoPath="/assets/videos/demo.mp4"
      />
    </>
  );
}
