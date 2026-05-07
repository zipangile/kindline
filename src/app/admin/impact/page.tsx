export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import {
  createImpactStat,
  deleteImpactStat,
  createImpactStory,
  deleteImpactStory,
} from "./actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { checkAdmin } from "@/lib/auth-utils";
import { ImpactStat, ImpactStory } from "@prisma/client";

export default async function AdminImpactPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  await checkAdmin("CONTENT_EDITOR");

  let stats: ImpactStat[] = [];
  let stories: ImpactStory[] = [];

  try {
    const [s, st] = await Promise.all([
      prisma.impactStat.findMany({ orderBy: { order: "asc" } }),
      prisma.impactStory.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    stats = s;
    stories = st;
  } catch (error) {
    console.error("[AdminImpactPage] Error fetching impact data:", error);
  }

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold text-gray-900">Manage Impact</h1>

      {/* Stats Management */}
      <section>
        <h2 className="text-xl font-bold mb-6">Impact Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Add New Stat</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createImpactStat} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Label</label>
                  <input
                    name="label"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Children in School"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Value</label>
                  <input
                    name="value"
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g. 1,200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <input
                    name="description"
                    className="w-full p-2 border rounded"
                    placeholder="Short description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Icon (Lucide name)
                  </label>
                  <select name="icon" className="w-full p-2 border rounded">
                    <option value="Users">Users</option>
                    <option value="GraduationCap">GraduationCap</option>
                    <option value="Briefcase">Briefcase</option>
                    <option value="Droplets">Droplets</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Add Stat
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat) => (
              <Card key={stat.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-3xl font-bold text-blue-600">
                        {stat.value}
                      </p>
                      <p className="font-bold text-gray-900">{stat.label}</p>
                      <p className="text-sm text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                    <form action={deleteImpactStat.bind(null, stat.id)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Management */}
      <section>
        <h2 className="text-xl font-bold mb-6">
          Impact Stories / Testimonials
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Add New Story</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createImpactStory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    name="title"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Author Name
                  </label>
                  <input
                    name="author"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Author Role/Category
                  </label>
                  <input
                    name="authorRole"
                    className="w-full p-2 border rounded"
                    placeholder="e.g. WESAP Beneficiary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    name="category"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Content</label>
                  <textarea
                    name="content"
                    required
                    className="w-full p-2 border rounded h-32"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Story
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {stories.map((story) => (
              <Card key={story.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">{story.title}</h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {story.category} - {story.author}
                      </p>
                      <p className="mt-2 text-gray-700 italic">
                        &quot;{story.content.substring(0, 150)}...&quot;
                      </p>
                    </div>
                    <form action={deleteImpactStory.bind(null, story.id)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
