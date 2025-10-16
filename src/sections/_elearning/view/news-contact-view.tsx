'use client';

import NewsNewsletter from '../news-newsletter';
import ElearningContactInfo from '../contact/elearning-contact-info';
import ElearningContactForm from '../contact/elearning-contact-form';

// ----------------------------------------------------------------------

export default function NewsContactView() {
  return (
    <>
      <ElearningContactInfo />

      <ElearningContactForm />

      <NewsNewsletter />
    </>
  );
}
