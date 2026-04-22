'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import RoleGuard from '@/components/RoleGuard';
import { getApiErrorMessage } from '@/lib/errors';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Type,
  Tag,
  DollarSign,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';

function NewCourseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/course', {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category || undefined,
        price: formData.price === '' ? 0 : Number(formData.price),
      });
      router.push('/instructor/dashboard');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to create course.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Create course</h1>
          <p className="text-gray-500 font-medium">Add a title, description, and pricing.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Title
              </label>
              <input
                type="text"
                required
                minLength={3}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-gray-900 font-bold text-lg"
                placeholder="e.g. Node.js fundamentals"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                required
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-gray-900 font-medium min-h-[150px]"
                placeholder="What will students learn?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </label>
                <select
                  required
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-gray-900 font-bold appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select…</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Business">Business</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price (USD)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  required
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-gray-900 font-bold"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.99 }}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Publish
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewCoursePage() {
  return (
    <RoleGuard roles={['instructor']}>
      <NewCourseForm />
    </RoleGuard>
  );
}
