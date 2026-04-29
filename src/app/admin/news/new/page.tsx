import NewsForm from '../NewsForm';

export default function NewNewsPostPage() {
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
