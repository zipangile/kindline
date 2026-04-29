'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createNewsPost, updateNewsPost } from './actions';
import { uploadImage } from '../images/actions';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface NewsPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  image: string | null;
  published: boolean;
}

export default function NewsForm({ post }: { post?: NewsPost }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(post?.image || '');
  const [slug, setSlug] = useState(post?.slug || '');

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const url = await uploadImage(formData);
      setImage(url);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to upload image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as string,
      image,
      published: formData.get('published') === 'on',
    };

    try {
      if (post?.id) {
        await updateNewsPost(post.id, data);
      } else {
        await createNewsPost(data);
      }
    } catch (error) {
      // Server-side redirects in Next.js result in an error on the client side
      // with a specific digest or message. If it's a redirect, we don't want to alert error.
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          return;
      }
      console.error(error);
      alert('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
          <input
            name="title"
            defaultValue={post?.title}
            required
            className="w-full p-3 border rounded-xl"
            onChange={(e) => {
               if (!post?.id) {
                 setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
               }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full p-3 border rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
          <select name="category" defaultValue={post?.category || 'Field Update'} className="w-full p-3 border rounded-xl">
            <option value="Field Update">Field Update</option>
            <option value="Announcement">Announcement</option>
            <option value="Event">Event</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Published</label>
          <div className="flex items-center h-12">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published}
              className="w-6 h-6 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Visible on public website</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt</label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt || ''}
          rows={2}
          className="w-full p-3 border rounded-xl"
          placeholder="Brief summary for list view"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
        <textarea
          name="content"
          defaultValue={post?.content}
          required
          rows={10}
          className="w-full p-3 border rounded-xl font-mono"
          placeholder="Markdown or plain text content"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Featured Image</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {uploading && <Loader2 className="animate-spin text-blue-600" size={20} />}
        </div>
        {image && (
          <div className="mt-4 h-48 w-full max-w-md relative rounded-xl overflow-hidden border">
            <Image src={image} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setImage('')}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="pt-4 border-t flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading && <Loader2 className="animate-spin mr-2" size={18} />}
          {post?.id ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}
