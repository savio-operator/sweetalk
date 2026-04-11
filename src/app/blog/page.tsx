import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60; // ISR fallback

export const metadata = {
  title: "Blog — Dessert Stories & Updates from Sweetalks, Kochi",
  description:
    "Stories, recipes, and behind-the-scenes from Sweetalks — Thrikkakara's artisan dessert cafe. Pistachio kunafa, Belgium brownies, and more.",
  alternates: { canonical: "https://sweettalks.in/blog" },
  openGraph: {
    title: "Sweetalks Blog — Dessert Stories from Kochi",
    description:
      "Stories, recipes, and updates from Sweetalks — Thrikkakara's artisan dessert cafe.",
    url: "https://sweettalks.in/blog",
    images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "Sweetalks Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sweetalks Blog — Dessert Stories from Kochi",
    description: "Stories, recipes, and updates from Sweetalks — Thrikkakara's artisan dessert cafe.",
    images: ["/images/logo.png"],
  },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const posts = await client.fetch(postsQuery, {}, { next: { tags: ["posts"] } });
  
  const sp = await searchParams;
  const currentTag = typeof sp.tag === "string" ? sp.tag : null;

  // Derive unique tags
  const tagsSet = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts.forEach((p: any) => p.tags?.forEach((t: string) => tagsSet.add(t)));
  const allTags = Array.from(tagsSet);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredPosts = currentTag ? posts.filter((p: any) => p.tags?.includes(currentTag)) : posts;

  return (
    <main className="min-h-screen bg-brand-near-white pt-32 pb-24 px-8 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <p className="section-label mb-4">OUR SWEET TALKS</p>
          <h1 className="font-charlotte text-brand-deep-red text-4xl md:text-5xl mb-6">Stories & updates</h1>
          
          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-8">
              <Link 
                href="/blog"
                className={`px-4 py-2 rounded-full font-jost text-xs tracking-widest uppercase transition-colors ${!currentTag ? 'bg-brand-crimson text-white' : 'bg-brand-off-white text-brand-light-teal hover:bg-brand-off-white/80'}`}
              >
                All Posts
              </Link>
              {allTags.map(tag => (
                <Link 
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={`px-4 py-2 rounded-full font-jost text-xs tracking-widest uppercase transition-colors ${currentTag === tag ? 'bg-brand-crimson text-white' : 'bg-brand-off-white text-brand-light-teal hover:bg-brand-off-white/80'}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {filteredPosts.length === 0 ? (
           <p className="font-lora italic text-brand-light-teal text-center py-20">No posts yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {filteredPosts.map((post: any) => (
              <Link href={`/blog/${post.slug.current}`} key={post._id} className="card-base group block">
                <div className="relative aspect-video w-full overflow-hidden bg-brand-off-white">
                  {post.coverImage && (
                    <Image 
                      src={urlFor(post.coverImage).width(600).height(338).url()} 
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                   <div className="flex flex-wrap gap-2 mb-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {post.tags?.map((tag: any) => (
                      <span key={tag} className="bg-brand-off-white text-brand-teal font-jost text-[0.55rem] uppercase tracking-[2px] rounded-full px-3 py-1">
                        {tag}
                      </span>
                    ))}
                   </div>
                   <h2 className="font-charlotte text-brand-deep-red text-xl mb-2">{post.title}</h2>
                   <p className="font-lora italic text-brand-crimson/65 text-sm line-height-[1.7] mb-4 line-clamp-2">
                     {post.excerpt}
                   </p>
                   {post.publishedAt && (
                      <p className="font-jost text-brand-light-teal text-[0.6rem] tracking-[2px] uppercase">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                   )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
