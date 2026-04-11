import { client } from "@/sanity/lib/client";
import { postQuery, postsSlugsQuery, postsByTagQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // ISR fallback

export async function generateStaticParams() {
  const posts = await client.fetch(postsSlugsQuery);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return posts.map((post: any) => ({ slug: post.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postQuery, { slug });
  if (!post) {
    return { title: 'Post Not Found' };
  }
  const ogImage = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : "/images/logo.png";
  return {
    title: `${post.title} — Sweetalks Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://sweettalks.in/blog/${slug}` },
    openGraph: {
      title: `${post.title} — Sweetalks Blog`,
      description: post.excerpt,
      url: `https://sweettalks.in/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — Sweetalks Blog`,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

const portableTextComponents = {
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: any) => (
      <figure className="my-8">
        <Image 
          src={urlFor(value).width(800).url()} 
          alt={value.caption || ''} 
          width={800}
          height={500}
          className="rounded-2xl w-full object-cover" 
        />
        {value.caption && <figcaption className="text-center mt-2 font-jost text-[0.65rem] text-brand-light-teal">{value.caption}</figcaption>}
      </figure>
    ),
  },
  block: {
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: ({ children }: any) => <h2 className="font-charlotte text-brand-deep-red text-3xl mt-12 mb-4">{children}</h2>,
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: ({ children }: any) => <h3 className="font-jost text-base text-brand-crimson tracking-[2px] uppercase mt-8 mb-3">{children}</h3>,
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote: ({ children }: any) => <blockquote className="border-l-[3px] border-brand-crimson pl-6 font-lora italic text-brand-light-teal my-6">{children}</blockquote>,
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normal: ({ children }: any) => <p className="font-lora text-brand-dark text-base leading-[1.9] mb-6">{children}</p>
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postQuery, { slug });

  if (!post) {
    notFound();
  }

  let relatedPosts = [];
  if (post.tags && post.tags.length > 0) {
     relatedPosts = await client.fetch(postsByTagQuery, { tag: post.tags[0] });
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     relatedPosts = relatedPosts.filter((p: any) => p._id !== post._id).slice(0, 3);
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sweettalks.in" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://sweettalks.in/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://sweettalks.in/blog/${post.slug.current}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? urlFor(post.coverImage).width(1200).height(630).url() : undefined,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Sweetalks",
      url: "https://sweettalks.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Sweetalks",
      logo: { "@type": "ImageObject", url: "https://sweettalks.in/images/logo.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://sweettalks.in/blog/${post.slug.current}` },
  };

  return (
    <article className="min-h-screen bg-brand-white pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {/* Hero */}
      <div className="relative h-[60vh] w-full bg-brand-dark flex items-end">
        {post.coverImage && (
           <Image
             src={urlFor(post.coverImage).width(1920).height(1080).url()}
             alt={post.title}
             fill
             className="object-cover absolute inset-0 opacity-80"
             priority
           />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-red via-brand-deep-red/40 to-transparent" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-12">
            <h1 className="font-charlotte text-brand-near-white text-4xl md:text-5xl lg:text-6xl max-w-3xl leading-[1.1]">
              {post.title}
            </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
         {/* Meta row */}
         <div className="flex flex-wrap items-center gap-4 mb-12 pb-8 border-b border-brand-off-white font-jost text-[0.65rem] text-brand-light-teal tracking-[2px] uppercase">
            {post.publishedAt && (
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
            {post.readingTime && <span>• {post.readingTime} MIN READ</span>}
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="opacity-50">•</span>
                <div className="flex gap-2">
                  {post.tags.map((tag: string) => <span key={tag}>{tag}</span>)}
                </div>
              </>
            )}
         </div>

         {/* Body */}
         <div className="max-w-[680px] mx-auto">
           <PortableText value={post.body} components={portableTextComponents} />
         </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 pt-20 border-t border-brand-off-white">
           <p className="font-jost text-brand-light-teal text-[0.6rem] tracking-[4px] uppercase text-center mb-10">
             MORE FROM SWEETALKS
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {relatedPosts.map((rPost: any) => (
               <Link href={`/blog/${rPost.slug.current}`} key={rPost._id} className="card-base group block">
                <div className="relative aspect-video w-full overflow-hidden bg-brand-off-white">
                  {rPost.coverImage && (
                    <Image 
                      src={urlFor(rPost.coverImage).width(600).height(338).url()} 
                      alt={rPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                   <h2 className="font-charlotte text-brand-deep-red text-xl mb-2">{rPost.title}</h2>
                   <p className="font-lora italic text-brand-crimson/65 text-sm line-height-[1.7] mb-4 line-clamp-2">
                     {rPost.excerpt}
                   </p>
                </div>
               </Link>
             ))}
           </div>
        </div>
      )}
    </article>
  );
}
