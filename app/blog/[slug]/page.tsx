import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string;
  cover_image: string | null;
  published_at: string;
  meta_title: string | null;
  meta_description: string | null;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    return data as BlogPost | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.meta_title || post.title,
    description:
      post.meta_description || post.excerpt || `Read ${post.title} on Crystal Valley Auto Detail blog.`,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/blog"
        className="text-sm text-slate-400 transition hover:text-gold-400"
      >
        ← Back to Blog
      </Link>

      {post.cover_image && (
        <div className="mt-6 overflow-hidden rounded-2xl">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      )}

      <header className="mt-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
          <span>{post.author}</span>
          <span>·</span>
          <time>
            {new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      <div
        className="prose prose-invert prose-lg mt-10 max-w-none prose-headings:text-white prose-a:text-gold-400 prose-strong:text-white prose-blockquote:border-gold-400/50 prose-code:text-gold-300"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
