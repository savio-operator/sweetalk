---
name: sweetalks-sanity-cms
description: Sanity CMS integration for Sweetalks blog — schemas, GROQ queries, image URL builder, ISR revalidation.
---

# Sanity CMS Integration — Sweetalks

## Overview

- **Studio:** sweetalks.sanity.studio
- **Packages:** `next-sanity`, `@sanity/image-url`, `@portabletext/react`
- **Revalidation:** ISR (60s fallback) + on-demand webhook

---

## Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=    # Safe to expose
NEXT_PUBLIC_SANITY_DATASET=production  # Safe to expose
SANITY_API_TOKEN=                 # Server-side only (for previews)
REVALIDATION_SECRET=              # Server-side only (webhook auth)
```

---

## Schema: Blog Post (`src/sanity/schemas/post.ts`)

```typescript
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      date: 'publishedAt',
    },
  },
});
```

---

## Client (`src/sanity/lib/client.ts`)

```typescript
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

---

## GROQ Queries (`src/sanity/lib/queries.ts`)

```typescript
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
```

---

## Image URL Builder (`src/sanity/lib/image.ts`)

```typescript
import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

Usage:
```tsx
<img src={urlFor(post.coverImage).width(800).height(450).url()} alt={post.title} />
```

---

## On-Demand Revalidation (`src/app/api/revalidate/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    revalidatePath('/blog');
    revalidateTag('posts');

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
```

---

## Blog Page Patterns

### Listing (`/blog`) — ISR

```typescript
// In page.tsx
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await client.fetch(postsQuery, {}, { next: { tags: ['posts'] } });
  // ... render grid
}
```

### Single Post (`/blog/[slug]`)

```typescript
export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ slug }`);
  return posts.map((post: any) => ({ slug: post.slug.current }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await client.fetch(postQuery, { slug: params.slug });
  return {
    title: `${post.title} — Sweetalks Blog`,
    description: post.excerpt,
    openGraph: {
      images: [urlFor(post.coverImage).width(1200).height(630).url()],
    },
  };
}
```

---

## Portable Text Components

```typescript
import { PortableText } from '@portabletext/react';

const components = {
  types: {
    image: ({ value }: any) => (
      <figure className="my-8">
        <img src={urlFor(value).width(800).url()} alt={value.caption || ''} className="rounded-2xl w-full" />
        {value.caption && <figcaption className="text-center mt-2 text-xs text-light-teal">{value.caption}</figcaption>}
      </figure>
    ),
  },
  block: {
    h2: ({ children }: any) => <h2 className="font-pacifico text-3xl text-deep-red mt-12 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-jost text-base text-crimson tracking-widest uppercase mt-8 mb-3">{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className="border-l-[3px] border-crimson pl-6 italic text-light-teal my-6">{children}</blockquote>,
  },
};
```

---

## Design Requirements for Blog UI

**Listing page:**
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Card: white bg, 1rem radius, border `#EDE5E5`, hover translateY(-4px)
- Cover image: 16/9 aspect ratio, 1rem radius, hotspot-aware
- Tag chips: Jost 0.55rem, uppercase, `#EDE5E5` bg, `#2BA8B2` text, pill shape
- Title: Pacifico 1.2rem, `#991001`
- Excerpt: Lora italic 0.82rem, `#BA1C0A` at 65%
- Date: Jost 0.6rem, `#74C0C6`

**Single post:**
- Hero: full-bleed cover image, 60vh, gradient overlay
- Body: max-width 680px, centered
- Paragraph: Lora 1rem, line-height 1.9
