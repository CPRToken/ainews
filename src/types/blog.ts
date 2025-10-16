import { IAuthorProps } from './author';
import { ISocialLinks } from './socials';

// ----------------------------------------------------------------------

export type IBlogCategoryProps = {
  label: string;
  path: string;
};

export type IBlogPostProps = {
  id: string;
  title: string;
  slug: string;
  heroUrl: string;
  createdAt: Date;
  category: string;
  coverUrl: string;
  duration: string;
  favorited: boolean;
  imageUrl: string;
  description: string;
  author: IAuthorProps;
  shareLinks?: ISocialLinks;
};
