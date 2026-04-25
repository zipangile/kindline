'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

export default function NewsPage() {
  const posts = [
    {
      title: "Community Outreach: Clean Water for Lusaka Suburbs",
      date: "May 15, 2024",
      excerpt: "Our team successfully commissioned two new boreholes in the outskirts of Lusaka, providing clean water to over 200 families.",
      category: "Field Update"
    },
    {
      title: "Announcing the 2024 Scholarship Recipients",
      date: "April 28, 2024",
      excerpt: "We are proud to announce that 50 more vulnerable children have been added to our full-tuition scholarship program this year.",
      category: "Announcement"
    },
    {
      title: "Widows Graduation Ceremony",
      date: "April 10, 2024",
      excerpt: "Celebrating the success of 25 women who have completed their vocational training in tailoring and entrepreneurship.",
      category: "Event"
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Card key={index} className="flex flex-col h-full overflow-hidden border-none shadow-sm bg-gray-50">
                <div className="h-48 bg-gray-200 flex items-center justify-center italic text-gray-400">
                  [Post Image]
                </div>
                <CardHeader>
                  <div className="flex items-center text-xs text-blue-600 font-bold uppercase tracking-wide mb-3">
                    <span className="bg-white px-2 py-1 rounded border border-blue-200">{post.category}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {post.date}</span>
                  </div>
                  <CardTitle className="text-xl leading-tight hover:text-blue-800 cursor-pointer transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-0">
                  <Button variant="link" className="px-0 flex items-center text-blue-600" asChild>
                    <Link href="/news">Read more <ChevronRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline">Load More Posts</Button>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-16 bg-blue-50 border-t border-blue-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Never miss an update</h2>
          <p className="text-gray-600 mb-8">
            Get the latest stories of impact and project updates delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
