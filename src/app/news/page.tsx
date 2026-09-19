import prisma from '@/lib/prisma';
import Link from "next/link";
import Image from 'next/image';
import { Calendar, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NewsletterSubscribeForm } from "@/components/NewsletterSubscribeForm";
import { newsPostPath } from '@/lib/news-path';

export const dynamic = "force-dynamic";

export default async function NewsPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  const posts = await prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Stay informed about our latest activities, events, and announcements.
          </p>
        </div>
      </section>

      {/* Blog Feed */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
               <Calendar size={64} className="mx-auto text-gray-200 mb-4" />
               <h3 className="text-xl font-bold text-gray-900">No updates yet</h3>
               <p className="text-gray-500">Check back later for our latest news.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col h-full overflow-hidden border-none shadow-sm bg-gray-50">
                  <div className="h-48 relative bg-blue-100 overflow-hidden">
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar size={64} className="text-blue-200" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap gap-y-2 items-center text-xs text-blue-700 font-bold uppercase tracking-wide mb-3">
                      <span className="bg-white px-2 py-1 rounded border border-blue-200">{post.category}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-blue-800 cursor-pointer transition-colors">
                      <Link href={newsPostPath(post.slug)}>{post.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {post.excerpt || (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content)}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto pt-0">
                    <Button variant="link" className="px-0 flex items-center text-blue-600" asChild>
                      <Link href={newsPostPath(post.slug)}>Read more <ChevronRight className="h-4 w-4 ml-1" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-16 bg-blue-50 border-t border-blue-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Never miss an update</h2>
          <p className="text-gray-600 mb-8">
            Get the latest stories of impact and project updates delivered to your inbox.
          </p>
          <NewsletterSubscribeForm />
        </div>
      </section>
    </div>
  );
}
