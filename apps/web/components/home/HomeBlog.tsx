"use client";

import { useRef } from "react";
import { Container, Section, MagneticWrapper } from "@temi/ui";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TextReveal } from "../common/TextReveal";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export function HomeBlog() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: posts = [] } = useQuery({
    queryKey: ["public-blog-home"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl()}/api/blog?take=6`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.items || !Array.isArray(data.items)) return [];
      return data.items.map((item: any) => ({
        slug: item.slug,
        title: item.title,
        tag: item.tags?.[0] || "Tech",
        excerpt: item.excerpt || "No excerpt available.",
        image:
          item.coverImage ||
          item.image ||
          `https://picsum.photos/1200/800?seed=${item.slug}`,
        readTime: Math.ceil((item.content?.length || 1000) / 1000),
      }));
    },
  });

  const scrollLeft = () => {
    if (scrollRef.current) {
      // Get width of the first card + gap (approx 350px equivalent)
      const firstCard = scrollRef.current.children[0] as HTMLElement;
      const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 350;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.children[0] as HTMLElement;
      const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Section className="overflow-hidden bg-(--bg) py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
          {/* Left Content */}
          <div className="flex shrink-0 flex-col justify-center lg:w-1/3">
            <div className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
              <TextReveal text="Latest Insight" type="chars" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-(--text) sm:text-4xl">
              <TextReveal text="Blog" type="chars" delay={0.2} />
            </h2>
            <p className="mt-4 text-lg text-(--muted)">
              Stay updated with the latest articles, tips, and insights from my
              engineering journey.
            </p>

            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-(--text) underline-offset-4 hover:text-(--accent) hover:underline"
            >
              View More <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-12 flex items-center gap-4">
              <div className="h-px w-1/2 bg-(--accent)" />
              <div className="flex gap-4">
                <MagneticWrapper>
                  <button
                    onClick={scrollLeft}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-(--border) text-(--muted) transition-colors hover:border-(--accent) hover:bg-(--accent) hover:text-white"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </MagneticWrapper>
                <MagneticWrapper>
                  <button
                    onClick={scrollRight}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-(--border) text-(--muted) transition-colors hover:border-(--accent) hover:bg-(--accent) hover:text-white"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </MagneticWrapper>
              </div>
            </div>
          </div>

          {/* Right Content (Carousel) */}
          <div className="min-w-0 lg:mr-[calc(50%-50vw)] lg:w-auto lg:flex-1">
            <div
              ref={scrollRef}
              className="flex flex-nowrap gap-6 overflow-x-auto py-8 pr-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
            >
              {posts.length === 0 && (
                <div className="min-w-[260px] shrink-0 snap-start sm:min-w-[300px] md:min-w-[350px]">
                  <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-(--border)/40 bg-(--surface) p-6 text-center">
                    <div className="mb-3 text-2xl">🍳</div>
                    <p className="text-sm text-(--text)">
                      Fresh posts are on the way.
                    </p>
                    <p className="mt-1 text-xs text-(--muted)">
                      Check back soon for new insights.
                    </p>
                  </div>
                </div>
              )}
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="min-w-[260px] shrink-0 snap-start sm:min-w-[300px] md:min-w-[350px]"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block h-full"
                    onMouseEnter={() => router.prefetch(`/blog/${post.slug}`)}
                  >
                    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-(--surface) border border-(--border)/50 transition-transform hover:-translate-y-2 hover:shadow-xl">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-(--muted)">
                          <span className="text-(--accent) bg-(--accent)/10 px-2 py-1 rounded-md">
                            {post.tag}
                          </span>
                          <span>•</span>
                          <span>{post.readTime} min read</span>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold text-(--text) group-hover:text-(--accent) transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="line-clamp-3 text-sm text-(--muted)">
                          {post.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
