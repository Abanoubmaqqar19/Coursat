'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getInstructorId } from '@/lib/course';
import { getApiErrorMessage } from '@/lib/errors';
import type { Course } from '@/lib/types';
import {
  PlayCircle,
  Users,
  ShieldCheck,
  Globe,
  Loader2,
  CheckCircle2,
  Award,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<unknown[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/course/${id}`),
          api.get(`/course/${id}/lessons`),
        ]);
        const c = courseRes.data.data as Course;
        setCourse(c);
        setLessons(lessonsRes.data.data || []);

        if (!user) {
          setIsEnrolled(false);
          return;
        }

        const ownerId = getInstructorId(c);
        if (ownerId && ownerId === user.id) {
          setIsEnrolled(true);
          return;
        }

        if (user.role === 'student') {
          try {
            const enrollRes = await api.get('/enrollments/my-courses');
            const enrolled = enrollRes.data.data?.some(
              (row: { course?: { _id?: string } }) =>
                row.course && String(row.course._id) === String(id),
            );
            setIsEnrolled(Boolean(enrolled));
          } catch {
            setIsEnrolled(false);
          }
        } else {
          setIsEnrolled(false);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id, user]);

  const handleUnenroll = async () => {
    if (!id || typeof id !== 'string' || !course || user?.role !== 'student') return;
    if (getInstructorId(course) === user.id) return;
    if (!isEnrolled) return;
    if (!confirm('Leave this course? You can enroll again later.')) return;
    setEnrollError('');
    setUnenrolling(true);
    try {
      await api.delete(`/enrollments/${id}`);
      setIsEnrolled(false);
    } catch (error) {
      setEnrollError(getApiErrorMessage(error, 'Could not leave course'));
    } finally {
      setUnenrolling(false);
    }
  };

  const handleEnroll = async () => {
    setEnrollError('');
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/courses/${id}`)}`);
      return;
    }
    if (user.role !== 'student') {
      setEnrollError('Only student accounts can enroll in courses.');
      return;
    }
    setEnrolling(true);
    try {
      await api.post(`/enrollments/${id}`);
      setIsEnrolled(true);
    } catch (error) {
      setEnrollError(getApiErrorMessage(error, 'Enrollment failed'));
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-semibold text-gray-800">Course not found</p>
        <button
          type="button"
          onClick={() => router.push('/courses')}
          className="text-indigo-600 font-bold hover:underline"
        >
          Back to catalog
        </button>
      </div>
    );
  }

  const isCourseOwner = Boolean(user && getInstructorId(course) === user.id);
  const canUnenrollAsStudent =
    user?.role === 'student' && isEnrolled && !isCourseOwner;

  const instructorName =
    typeof course.instructor === 'object' && course.instructor?.name
      ? course.instructor.name
      : 'Instructor';

  const firstLessonId = (lessons[0] as { _id?: string } | undefined)?._id;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {course.category && (
                  <span className="px-3 py-1 bg-indigo-600 rounded-lg text-xs font-bold tracking-wider uppercase">
                    {course.category}
                  </span>
                )}
                <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                  <PlayCircle className="w-4 h-4 fill-current" />
                  <span>{lessons.length} Lessons</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
                {course.description || 'No description provided.'}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-300">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white uppercase shrink-0">
                    {instructorName.charAt(0)}
                  </div>
                  <span className="truncate">
                    Created by <span className="text-white font-bold">{instructorName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>Open enrollment</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white text-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100"
            >
              <div className="flex items-end gap-2 mb-8">
                <span className="text-4xl font-black">${Number(course.price ?? 0).toFixed(2)}</span>
                <span className="text-gray-500 mb-1.5 font-medium text-sm">one-time</span>
              </div>

              {enrollError && (
                <p className="text-sm text-red-600 font-medium mb-4">{enrollError}</p>
              )}

              {isEnrolled ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      firstLessonId
                        ? router.push(`/courses/${id}/lessons/${firstLessonId}`)
                        : undefined
                    }
                    disabled={!firstLessonId}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    <PlayCircle className="w-6 h-6" />
                    {firstLessonId ? 'Continue learning' : 'No lessons yet'}
                  </button>
                  {canUnenrollAsStudent && (
                    <button
                      type="button"
                      onClick={() => void handleUnenroll()}
                      disabled={unenrolling}
                      className="w-full py-3 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {unenrolling ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      Leave course
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-70"
                >
                  {enrolling ? <Loader2 className="animate-spin" /> : 'Enroll now'}
                </button>
              )}

              <div className="mt-8 space-y-4 pt-8 border-t">
                <p className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
                  This course includes
                </p>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Lifetime access to course material</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <Award className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>Structured lessons</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Learn on any device</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-black mb-8 text-gray-900">What you&apos;ll learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 bg-gray-50 p-6 sm:p-8 rounded-3xl">
            {[
              'Practical skills you can apply immediately',
              'Clear explanations and examples',
              'Structured path from basics onward',
              'Community discussion on each lesson',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mb-8 text-gray-900">Course content</h2>
          <div className="space-y-4">
            {(lessons as { _id: string; title: string }[]).map((lesson, index: number) => (
              <div
                key={lesson._id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isEnrolled) router.push(`/courses/${id}/lessons/${lesson._id}`);
                  }
                }}
                className="flex items-center justify-between p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors group cursor-pointer"
                onClick={() => isEnrolled && router.push(`/courses/${id}/lessons/${lesson._id}`)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium">Lesson</p>
                  </div>
                </div>
                {!isEnrolled ? (
                  <ShieldCheck className="w-5 h-5 text-gray-300 shrink-0" />
                ) : (
                  <PlayCircle className="w-6 h-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </div>
            ))}
            {lessons.length === 0 && (
              <p className="text-gray-400 font-medium italic">No lessons have been added to this course yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
