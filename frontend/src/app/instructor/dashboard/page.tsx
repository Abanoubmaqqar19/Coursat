'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import RoleGuard from '@/components/RoleGuard';
import { getInstructorId } from '@/lib/course';
import type { Course } from '@/lib/types';
import {
  Plus,
  Users,
  DollarSign,
  BookOpen,
  Edit3,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

function InstructorDashboardContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const response = await api.get('/course?limit=100');
        const list = (response.data.data || []) as Course[];
        const mine = list.filter((c) => getInstructorId(c) === user?.id);
        setCourses(mine);
      } catch (error) {
        console.error('Error fetching instructor courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) void fetchInstructorCourses();
  }, [user?.id]);

  const handleDelete = async (courseId: string) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    try {
      await api.delete(`/course/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const totalRevenueEstimate = courses.reduce((sum, c) => sum + Number(c.price || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Instructor dashboard</h1>
            <p className="text-gray-500 font-medium">Create and manage your courses.</p>
          </div>
          <Link
            href="/instructor/courses/new"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-center"
          >
            <Plus className="w-5 h-5" />
            New course
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Courses live</p>
            <h3 className="text-3xl font-black text-gray-900">{courses.length}</h3>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Listed value (sum)</p>
            <h3 className="text-3xl font-black text-gray-900">${totalRevenueEstimate.toFixed(0)}</h3>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Catalog</p>
            <h3 className="text-3xl font-black text-gray-900">Coursat</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-50">
            <h2 className="text-2xl font-black text-gray-900">My courses</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 sm:px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Course
                  </th>
                  <th className="px-6 sm:px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 sm:px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Price
                  </th>
                  <th className="px-6 sm:px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                      <p className="text-gray-400 font-medium">Loading…</p>
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 sm:px-8 py-6">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 shrink-0 uppercase">
                            {(course.category || 'C').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 line-clamp-1">{course.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 sm:px-8 py-6 font-medium text-gray-600">
                        {course.category || '—'}
                      </td>
                      <td className="px-6 sm:px-8 py-6 font-black text-gray-900">
                        ${Number(course.price ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 sm:px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/courses/${course._id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="View"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/instructor/courses/${course._id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-5 h-5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(course._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && courses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">
                      You haven&apos;t created any courses yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstructorDashboard() {
  return (
    <RoleGuard roles={['instructor']}>
      <InstructorDashboardContent />
    </RoleGuard>
  );
}
