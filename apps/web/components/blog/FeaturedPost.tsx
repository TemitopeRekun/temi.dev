"use client";

import Image from "next/image";
import Link from "next/link";
import { Container, RevealOnScroll, Section, Button } from "@temi/ui";
import { AnimatedText } from "../common/AnimatedText";
import type { BlogPost } from "../../lib/blog";

type Props = {
  post: BlogPost;
};

export function FeaturedPost({ post }: Props) {
  return (
    <Section className="pb-10 pt-32 md:pb-20 md:pt-40">
      <Container>
        <RevealOnScroll>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-(--border)/20 shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-3 text-sm font-medium tracking-wide text-(--accent)">
                <span className="bg-(--accent)/10 px-3 py-1 rounded-full">
                  {post.tag}
                </span>
                <span className="text-(--muted)">{post.readTime} min read</span>
              </div>
              <AnimatedText
                phrase={post.title}
                className="text-3xl font-bold leading-tight text-(--text) md:text-5xl lg:text-6xl"
              />
              <p className="text-lg leading-relaxed text-(--muted) md:text-xl">
                {post.excerpt}
              </p>
              <div>
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="outline" className="mt-2">
                    Read Article
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
