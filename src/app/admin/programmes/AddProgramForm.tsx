"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import ProgramForm from "./ProgramForm";

export default function AddProgramForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all">
      <div
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold flex items-center gap-2">
          {isOpen ? (
            <X size={20} className="text-red-500" />
          ) : (
            <Plus size={20} className="text-green-500" />
          )}
          {isOpen ? "Cancel New Programme" : "Add New Programme"}
        </h2>
        {!isOpen && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
            Create New
          </button>
        )}
      </div>

      {isOpen && (
        <div className="p-6 border-t border-gray-100">
          <ProgramForm onComplete={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
