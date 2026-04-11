export const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  coverImage,
  excerpt,
  tags,
  publishedAt,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}`;

export const postQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  coverImage,
  excerpt,
  body,
  tags,
  publishedAt,
  author,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}`;

export const postsByTagQuery = `*[_type == "post" && $tag in tags] | order(publishedAt desc) {
  _id,
  title,
  slug,
  coverImage,
  excerpt,
  tags,
  publishedAt
}`;

export const postsSlugsQuery = `*[_type == "post"] { slug }`;
