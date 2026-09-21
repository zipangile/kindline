'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createProgram, updateProgram } from './actions';
import { uploadImage } from '../images/actions';
import { Loader2, X } from 'lucide-react';
import { Program } from '@prisma/client';
import Image from 'next/image';
import { IMAGE_ACCEPT } from '@/lib/image-validation';

export default function ProgramForm({ program, onComplete }: { program?: Program, onComplete?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(program?.image || '');
  const [imageStatus, setImageStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadBusy = useRef(false);
  const clearFile = () => { setSelectedFile(undefined); if (fileInput.current) fileInput.current.value = ''; };

  const handleImageUpload = async (file: File) => {
    if (uploadBusy.current || loading) return;
    uploadBusy.current = true;
    try {
      setUploading(true);
      setImageStatus('Uploading…');
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadImage(formData);
      if (!result.ok) { setImageStatus(result.message); return; }
      setImage(result.url);
      clearFile();
      setImageStatus('Image uploaded. Save or Update Programme to publish it.');
    } catch {
      setImageStatus('The upload could not be confirmed. Check your sign-in and contact the site administrator before retrying.');
    } finally {
      setUploading(false);
      uploadBusy.current = false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || uploadBusy.current) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (image) formData.append('image', image);

    try {
      if (program?.id) {
        await updateProgram(program.id, formData);
      } else {
        await createProgram(formData);
      }
      if (onComplete) onComplete();
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          if (onComplete) onComplete();
          return;
      }
      console.error(error);
      alert('Failed to save programme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={program?.title}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="e.g. WESAP"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            defaultValue={program?.category || "Economic Empowerment"}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="Economic Empowerment">Economic Empowerment</option>
            <option value="Child Wellbeing">Child Wellbeing</option>
            <option value="Sustainable Impact">Sustainable Impact</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={program?.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          placeholder="Describe the programme's goals and impact..."
        ></textarea>
      </div>

      <div>
        <label htmlFor="programme-image" className="block text-sm font-medium text-gray-700 mb-2">Programme Image</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInput}
            id="programme-image"
            accept={IMAGE_ACCEPT}
            disabled={loading || uploading}
            aria-describedby="programme-image-status programme-image-help"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedFile(file);
              if (file) handleImageUpload(file);
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {uploading && <Loader2 className="animate-spin text-blue-600" size={20} />}
        </div>
        <p id="programme-image-status" role="status" className="text-sm text-gray-700">{imageStatus}</p>
        <p id="programme-image-help" className="text-sm text-gray-600">Non-animated JPG, PNG, WEBP or GIF; up to 5 MiB, 8192 pixels per side and 24 megapixels.</p>
        {selectedFile && !uploading && <Button type="button" variant="outline" disabled={loading} onClick={() => handleImageUpload(selectedFile)}>Retry selected image</Button>}
        {image && (
          <div className="mt-4 h-32 w-full max-w-xs relative rounded-xl overflow-hidden border">
            <Image src={image} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              aria-label="Remove programme image"
              disabled={loading || uploading}
              onClick={() => { setImage(''); clearFile(); setImageStatus('Image removed from this draft. Save or Update Programme to publish the change.'); }}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-[10px]"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
         <div className="flex items-center">
            <input name="status" type="radio" value="live" defaultChecked={program?.status !== 'archived'} className="h-4 w-4 text-blue-600" />
            <label className="ml-2 block text-sm text-gray-700">Live</label>
         </div>
         <div className="flex items-center">
            <input name="status" type="radio" value="archived" defaultChecked={program?.status === 'archived'} className="h-4 w-4 text-blue-600" />
            <label className="ml-2 block text-sm text-gray-700">Archived</label>
         </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
          {program?.id && (
            <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
          )}
          <Button type="submit" disabled={loading || uploading}>
            {loading && <Loader2 className="animate-spin mr-2" size={18} />}
            {program?.id ? 'Update Programme' : 'Save Programme'}
          </Button>
      </div>
    </form>
  );
}
