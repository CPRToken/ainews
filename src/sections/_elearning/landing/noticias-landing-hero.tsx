// src/sections/_elearning/landing/noticias-landing-hero.tsx
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { fShortenNumber } from 'src/utils/format-number';


import { bgGradient } from 'src/theme/css';



import FeaturedNoticas from 'src/sections/blog/noticias/featured-noticias';

// ----------------------------------------------------------------------

const SUMMARY = [
  { value: 14000, label: 'Suscriptores', color: 'warning' },
  { value: 1050, label: 'Fuentes', color: 'error' },
  { value: 59000, label: 'Artículos', color: 'success' },
] as const;

// ----------------------------------------------------------------------

export default function NoticiasLandingHero() {
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
          py: { xs: 3, md: 5 },
        }}
      >
        <Container
          sx={{
            pt: { xs: 0, md: 1 },   // ✅ adds space from top navbar
            pb: { xs: 0, md: 0 },
          }}
        >
          <Grid container spacing={6} alignItems="center">
            {/* LEFT SIDE */}
            <Grid xs={12} md={6} lg={5}>
              <Stack spacing={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h2">
                  NOTICIAS DE IA PARA EMPRESAS

                </Typography>

                <Typography sx={{ color: 'text.secondary' }}>
                  Las últimas noticias de IA en el mundo empresarial
                </Typography>






                <Divider sx={{ borderStyle: 'dashed', my: 0 }} />



              </Stack>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid xs={12} md={6} lg={7}>
              <Box
                sx={{
                  maxWidth: 520,
                  width: '100%',
                  mx: 'auto',
                  mt: { xs: 0, md: 0 }, // small top margin for mobile
                }}
              >
                <FeaturedNoticas />
              </Box>
            </Grid>


          </Grid>
        </Container>
      </Box>


    </>
  );
}
