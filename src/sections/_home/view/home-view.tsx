// src/sections/_home/view/home-view.tsx
import { useScroll } from 'framer-motion';

import MainLayout from 'src/layouts/main';
import Footer from 'src/layouts/main/footer';


import ScrollProgress from 'src/components/scroll-progress';

import NewsLandingHero from 'src/sections/_elearning/landing/news-landing-hero';

import NewsLatestPosts from '../../blog/news/news-latest-posts';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <NewsLandingHero/>


      <NewsLatestPosts />


      <Footer />














    </MainLayout>
  );
}
