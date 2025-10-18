// src/sections/_home/view/casa-view.tsx
import { useScroll } from 'framer-motion';

import MainLayout from 'src/layouts/main';
import Pieser from 'src/layouts/main/pieser';


import ScrollProgress from 'src/components/scroll-progress';

import NoticiasLandingHero from 'src/sections/_elearning/landing/noticias-landing-hero';

import NoticiasLatestPosts from '../../blog/noticias/noticias-latest-posts';

// ----------------------------------------------------------------------

export default function CasaView() {
  const { scrollYProgress } = useScroll();

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <NoticiasLandingHero />


      <NoticiasLatestPosts />


      <Pieser />














    </MainLayout>
  );
}
