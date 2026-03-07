import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Crystal Valley Auto Detail blog - car care tips, detailing guides and industry insights from Dhaka.",
  openGraph: {
    title: "Blog - Crystal Valley Auto Detail",
    description: "Car care tips, detailing guides and industry insights.",
    url: "https://crystalvalley.autos/blog",
  },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  cover_image: string | null;
  published_at: string;
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, author, cover_image, published_at"
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });
    return (data as BlogPost[]) ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gold-400 sm:text-4xl">Blog</h1>
      <p className="mt-2 text-slate-400">
        Car care tips, detailing guides and industry insights.
      </p>

      {posts.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-slate-400">
            No blog posts yet. Check back soon!
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-gold-400 px-8 py-3 font-semibold text-black transition hover:bg-gold-300"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-gold-400/30 hover:bg-white/[0.07]"
            >
              {post.cover_image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-bold text-white group-hover:text-gold-400 transition">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span>{post.author}</span>
                  <span>·</span>
                  <time>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
