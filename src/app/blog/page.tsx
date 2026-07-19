export const dynamic = "force-dynamic";

import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: {
      type: 'STANDARD',
      publishedAt: { not: null }
    },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Publications</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our latest news, announcements, and deep dives.
          </p>
        </div>
      </section>

      {/* Blog Feed */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
               <Calendar size={64} className="mx-auto text-gray-200 mb-4" />
               <h3 className="text-xl font-bold text-gray-900">No blog articles yet</h3>
               <p className="text-gray-500">Check back later for our latest stories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col h-full overflow-hidden border-none shadow-sm bg-gray-50 rounded-2xl">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex items-center text-xs text-blue-600 font-bold uppercase tracking-wide mb-3">
                      <span className="bg-white px-2 py-1 rounded border border-blue-200">Article</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-blue-800 cursor-pointer transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 py-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {post.body.length > 150 ? post.body.substring(0, 150) + '...' : post.body}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto p-6 pt-0">
                    <Button variant="link" className="px-0 flex items-center text-blue-600" asChild>
                      <Link href={`/blog/${post.slug}`}>Read more <ChevronRight className="h-4 w-4 ml-1" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
