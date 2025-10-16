'use client';

import { _members, _coursePosts, _brandsColor, _testimonials } from 'src/_mock';

import ElearningAbout from '../about/elearning-about';
import NewsNewsletter from '../news-newsletter';
import NewsOurClients from '../news-our-clients';
import TeamElearningAbout from '../team/elearning-team-about';
import ElearningAboutHero from '../about/elearning-about-hero';
import ElearningTestimonial from '../testimonial/elearning-testimonial';
import ElearningAboutCoreValues from '../about/elearning-about-core-values';
import NewsLatestPosts from '../../blog/news/news-latest-posts';

// ----------------------------------------------------------------------

export default function NewsAboutView() {
  return (
    <>
      <ElearningAboutHero />

      <ElearningAbout />

      <ElearningAboutCoreValues />

      <TeamElearningAbout members={_members} />

      <NewsOurClients brands={_brandsColor} />

      <ElearningTestimonial testimonials={_testimonials} />

      <NewsLatestPosts posts={_coursePosts.slice(0, 4)} />

      <NewsNewsletter />
    </>
  );
}
