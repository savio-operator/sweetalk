import { groq } from "next-sanity";

// All published posts — listing page
export const postsQuery = groq`
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    tags
  }
`;

// Single post by slug — dynamic route
export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    tags,
    body
  }
`;

// Posts filtered by tag — used for related posts + tag filter
export const postsByTagQuery = groq`
  *[_type == "post" && $tag in tags && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    tags
  }
`;

// All published slugs — generateStaticParams
export const allSlugsQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(publishedAt)] {
    "slug": slug.current
  }
`;

// All unique tags — for the tag filter bar
export const allTagsQuery = groq`
  array::unique(
    *[_type == "post" && defined(publishedAt)]
    .tags[]
  )
`;
