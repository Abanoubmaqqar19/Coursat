'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/context/AuthContext';
import type { Course, EnrollmentRow } from '@/lib/types';
import { BookOpen, PlayCircle, Clock, Search } from 'lucide-react';

function MyCoursesContent() {
  const { user } = useAuth();
  const [rows, setRows] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get('/enrollments/my-courses');
        setRows(response.data.data || []);
      } catch (error) {
        console.error('Error fetching my courses:', error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) void fetchMyCourses();
  }, [user]);

  const courses: Course[] = rows
    .map((r) => r.course)
    .filter((c): c is Course => Boolean(c && c._id));

  const handleLeave = async (courseId: string) => {
    if (!confirm('Leave this course? You can enroll again from the catalog.')) return;
    setLeavingId(courseId);
    try {
      await api.delete(`/enrollments/${courseId}`);
      setRows((prev) => prev.filter((r) => r.course && String(r.course._id) !== courseId));
    } catch (error) {
      console.error('Unenroll failed:', error);
    } finally {
      setLeavingId(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">My learning</h1>
          <p className="text-gray-500 font-medium">Continue where you left off.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Enrolled</p>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{courses.length} courses</h3>
            </div>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
              <PlayCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active</p>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                {courses.length ? Math.max(1, Math.ceil(courses.length * 0.6)) : 0}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Learning</p>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">Your pace</h3>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onLeaveCourse={() => handleLeave(course._id)}
                leaveCourseLoading={leavingId === course._id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 sm:py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200 px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No enrollments yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Explore the catalog and enroll in a course to see it here.
            </p>
            <Link
              href="/courses"
              className="inline-block bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Browse courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  return (
    <RoleGuard roles={['student']}>
      <MyCoursesContent />
    </RoleGuard>
  );
}
