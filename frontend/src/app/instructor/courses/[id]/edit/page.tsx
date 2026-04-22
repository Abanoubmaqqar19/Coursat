'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import RoleGuard from '@/components/RoleGuard';
import { getInstructorId } from '@/lib/course';
import { getApiErrorMessage } from '@/lib/errors';
import type { Course } from '@/lib/types';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  Video,
  FileText,
  GripVertical,
  CheckCircle2,
  Layout,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Lesson = {
  _id?: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order?: number;
};

function EditCourseContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [courseMeta, setCourseMeta] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
  });

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    title: '',
    content: '',
    videoUrl: '',
    order: 1,
  });
  const [isEditingLesson, setIsEditingLesson] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/course/${id}`),
          api.get(`/course/${id}/lessons`),
        ]);

        const c = courseRes.data.data as Course;
        setCourseMeta(c);
        setFormData({
          title: c.title || '',
          description: c.description || '',
          category: c.category || '',
          price: c.price !== undefined && c.price !== null ? String(c.price) : '',
        });
        setLessons(lessonsRes.data.data || []);
      } catch {
        setError('Failed to load course.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id]);

  useEffect(() => {
    if (!courseMeta || !user) return;
    if (user.role !== 'instructor' || getInstructorId(courseMeta) !== user.id) {
      router.replace('/instructor/dashboard');
    }
  }, [courseMeta, user, router]);

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof id !== 'string') return;
    setSaving(true);
    setError('');
    try {
      await api.put(`/course/${id}`, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category || undefined,
        price: formData.price === '' ? 0 : Number(formData.price),
      });
      router.push('/instructor/dashboard');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to update course.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLesson = async () => {
    if (typeof id !== 'string') return;
    const payload = {
      title: currentLesson.title.trim(),
      content: currentLesson.content?.trim() || undefined,
      order: Number(currentLesson.order) || lessons.length + 1,
      videoUrl: currentLesson.videoUrl?.trim() || undefined,
    };

    if (payload.title.length < 3) {
      return;
    }

    try {
      if (isEditingLesson && currentLesson._id) {
        await api.put(`/course/${id}/lessons/${currentLesson._id}`, payload);
      } else {
        await api.post(`/course/${id}/lessons`, payload);
      }

      const res = await api.get(`/course/${id}/lessons`);
      const list: Lesson[] = res.data.data || [];
      setLessons(list);
      setShowLessonModal(false);
      setCurrentLesson({ title: '', content: '', videoUrl: '', order: list.length + 1 });
      setIsEditingLesson(false);
    } catch (err: unknown) {
      console.error(getApiErrorMessage(err, 'Lesson save failed'));
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (typeof id !== 'string') return;
    if (!confirm('Delete this lesson?')) return;
    try {
      await api.delete(`/course/${id}/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
    } catch (err: unknown) {
      console.error(getApiErrorMessage(err, 'Delete failed'));
    }
  };

  const openEditLesson = (lesson: Lesson) => {
    setCurrentLesson({
      ...lesson,
      order: lesson.order ?? 1,
    });
    setIsEditingLesson(true);
    setShowLessonModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Edit course</h1>
          </div>
          <button
            form="course-form"
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 self-start"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save
          </button>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <form
              id="course-form"
              onSubmit={handleUpdateCourse}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Course information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 focus:bg-white transition-all font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 focus:bg-white transition-all min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Category
                    </label>
                    <select
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 focus:bg-white transition-all font-bold"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 focus:bg-white transition-all font-bold"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-600" />
                  Curriculum
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentLesson({
                      title: '',
                      content: '',
                      videoUrl: '',
                      order: lessons.length + 1,
                    });
                    setIsEditingLesson(false);
                    setShowLessonModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add lesson
                </button>
              </div>

              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson._id || index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group border-2 border-transparent hover:border-indigo-100 transition-all"
                  >
                    <GripVertical className="w-5 h-5 text-gray-300 shrink-0" />
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-xs text-gray-400">
                      {index + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{lesson.title}</h4>
                      <p className="text-xs text-gray-400 font-medium">Lesson</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => lesson._id && openEditLesson(lesson)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => lesson._id && handleDeleteLesson(lesson._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {lessons.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium italic">No lessons yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
              <h3 className="text-xl font-black mb-4">Tips</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Use clear lesson titles, add a video URL (YouTube works well), and optional notes in the content field.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLessonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">
                  {isEditingLesson ? 'Edit lesson' : 'New lesson'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="p-2 hover:bg-gray-50 rounded-full text-gray-400"
                  aria-label="Close"
                >
                  <ArrowLeft className="rotate-90 w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 focus:bg-white transition-all font-bold"
                    placeholder="Introduction"
                    value={currentLesson.title}
                    onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Video URL
                  </label>
                  <div className="relative">
                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 focus:bg-white transition-all font-medium"
                      placeholder="https://www.youtube.com/watch?v=…"
                      value={currentLesson.videoUrl || ''}
                      onChange={(e) => setCurrentLesson({ ...currentLesson, videoUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Content / notes
                  </label>
                  <textarea
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 focus:bg-white transition-all min-h-[150px]"
                    placeholder="Lesson notes…"
                    value={currentLesson.content || ''}
                    onChange={(e) => setCurrentLesson({ ...currentLesson, content: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-indigo-600 focus:bg-white transition-all font-bold"
                    value={currentLesson.order ?? 0}
                    onChange={(e) =>
                      setCurrentLesson({ ...currentLesson, order: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="p-8 bg-gray-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleSaveLesson()}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isEditingLesson ? 'Update' : 'Add'} lesson
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EditCoursePage() {
  return (
    <RoleGuard roles={['instructor']}>
      <EditCourseContent />
    </RoleGuard>
  );
}
