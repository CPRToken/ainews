'use client';

import {
  _courses,

  _coursePosts,
  _brandsColor,

} from 'src/_mock';

import NewsNewsletter from '../news-newsletter';
import NewsOurClients from '../news-our-clients';
import NewsDownloadApp from '../news-download-app';
import NewsLandingHero from '../landing/news-landing-hero';
import NewsLatestPosts from '../../blog/news/news-latest-posts';
import NewsLandingIntroduce from '../landing/news-landing-introduce';
import NewsLandingFeaturedCourses from '../landing/news-landing-featured-courses';

// ----------------------------------------------------------------------

export default function NewsLandingView() {
  return (
    <>
      <NewsLandingHero />

      <NewsOurClients brands={_brandsColor} />

      <NewsLandingIntroduce />

      <NewsLandingFeaturedCourses courses={_courses} />







      <NewsLatestPosts />

      <NewsDownloadApp />

      <NewsNewsletter />
    </>
  );
}
