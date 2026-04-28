'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createProgram } from './actions';

export default function AddProgramForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all">
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold flex items-center gap-2">
          {isOpen ? <X size={20} className="text-red-500" /> : <Plus size={20} className="text-green-500" />}
          {isOpen ? 'Cancel New Programme' : 'Add New Programme'}
        </h2>
        {!isOpen && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
            Create New
          </button>
        )}
      </div>

      {isOpen && (
        <div className="p-6 border-t border-gray-100">
          <form
            action={async (formData) => {
              await createProgram(formData);
              setIsOpen(false);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  placeholder="e.g. WESAP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                  <option value="Economic Empowerment">Economic Empowerment</option>
                  <option value="Child Welfare">Child Welfare</option>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                placeholder="Describe the programme's goals and impact..."
              ></textarea>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center">
                  <input name="status" type="radio" value="live" defaultChecked className="h-4 w-4 text-blue-600" />
                  <label className="ml-2 block text-sm text-gray-700">Live</label>
               </div>
               <div className="flex items-center">
                  <input name="status" type="radio" value="archived" className="h-4 w-4 text-blue-600" />
                  <label className="ml-2 block text-sm text-gray-700">Archived</label>
               </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold"
                >
                  Save Programme
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
