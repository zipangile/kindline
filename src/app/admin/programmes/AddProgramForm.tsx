'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import ProgramForm from './ProgramForm';

export default function AddProgramForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="new-programme-form"
        className="w-full p-4 flex flex-wrap gap-3 justify-between items-center text-left cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold flex items-center gap-2">
          {isOpen ? <X size={20} className="text-red-500" /> : <Plus size={20} className="text-green-500" />}
          {isOpen ? 'Cancel New Programme' : 'Add New Programme'}
        </span>
        {!isOpen && (
          <span className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Create New
          </span>
        )}
      </button>

      {isOpen && (
        <div id="new-programme-form" className="p-4 sm:p-6 border-t border-gray-100">
          <ProgramForm onComplete={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
