import NewsForm from "../NewsForm";
import { checkAdmin } from "@/lib/auth-utils";

export default async function NewNewsPostPage(props: {
  params: Promise<Record<string, string | string[] | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await props.params;
  await props.searchParams;
  await checkAdmin("CONTENT_EDITOR");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-500">Share a new update with the community.</p>
      </div>
      <NewsForm />
    </div>
  );
}
