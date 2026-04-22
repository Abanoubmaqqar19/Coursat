'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getInstructorId } from '@/lib/course';
import { getApiErrorMessage } from '@/lib/errors';
import type { Course } from '@/lib/types';
import {
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  PlayCircle,
  CheckCircle,
  Loader2,
  Send,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Lesson = {
  _id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order?: number;
};

type CommentRow = {
  _id: string;
  text: string;
  createdAt?: string;
  student?: { _id?: string; name?: string; email?: string } | string;
};

export default function LessonPlayerPage() {
  const { id, lessonId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    if (!id || !lessonId || typeof id !== 'string' || typeof lessonId !== 'string') return;

    const run = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const [courseRes, lessonRes, lessonsRes, commentsRes] = await Promise.all([
          api.get(`/course/${id}`),
          api.get(`/course/${id}/lessons/${lessonId}`),
          api.get(`/course/${id}/lessons`),
          api.get(`/comments/${lessonId}`),
        ]);

        setCourse(courseRes.data.data);
        setLesson(lessonRes.data.data);
        setLessons(lessonsRes.data.data || []);
        setComments(commentsRes.data.data || []);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [id, lessonId]);

  useEffect(() => {
    if (authLoading || loading || loadError || !course || !lesson) return;
    if (typeof id !== 'string' || typeof lessonId !== 'string') return;

    let cancelled = false;

    void (async () => {
      await Promise.resolve();

      if (cancelled) return;

      if (!user) {
        router.replace(`/login?next=${encodeURIComponent(`/courses/${id}/lessons/${lessonId}`)}`);
        return;
      }

      const owner = getInstructorId(course) === user.id;
      if (owner) {
        setAccessDenied(false);
        return;
      }

      if (user.role === 'instructor') {
        setAccessDenied(true);
        return;
      }

      try {
        const r = await api.get('/enrollments/my-courses');
        if (cancelled) return;
        const ok = r.data.data?.some(
          (e: { course?: { _id?: string } }) => e.course && String(e.course._id) === String(id),
        );
        setAccessDenied(!ok);
      } catch {
        if (!cancelled) setAccessDenied(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, loading, loadError, course, lesson, user, id, lessonId, router]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || typeof lessonId !== 'string') return;

    setCommenting(true);
    try {
      const response = await api.post(`/comments/${lessonId}`, { text: newComment.trim() });
      setComments([response.data.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', getApiErrorMessage(error));
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', getApiErrorMessage(error));
    }
  };

  const studentId = (c: CommentRow) => {
    const s = c.student;
    if (typeof s === 'object' && s && '_id' in s && s._id) return String(s._id);
    if (typeof s === 'string') return s;
    return '';
  };

  const studentName = (c: CommentRow) => {
    const s = c.student;
    if (typeof s === 'object' && s && 'name' in s && s.name) return s.name;
    return 'Student';
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (loadError || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-700 font-semibold">We couldn&apos;t load this lesson.</p>
        <button
          type="button"
          onClick={() => router.push(`/courses/${id}`)}
          className="text-indigo-600 font-bold hover:underline"
        >
          Back to course
        </button>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold text-gray-800 max-w-md">
          You need to enroll in this course to view lessons.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/courses/${id}`)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700"
        >
          View course
        </button>
      </div>
    );
  }

  const currentIndex = lessons.findIndex((l) => l._id === lessonId);
  const embedUrl = lesson.videoUrl
    ? lesson.videoUrl.includes('youtube.com/watch')
      ? lesson.videoUrl.replace('watch?v=', 'embed/')
      : lesson.videoUrl.includes('youtu.be/')
        ? `https://www.youtube.com/embed/${lesson.videoUrl.split('youtu.be/')[1]?.split('?')[0] ?? ''}`
        : lesson.videoUrl
    : '';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="flex-grow flex flex-col min-w-0">
        <div className="bg-black aspect-video w-full relative group">
          {embedUrl ? (
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <PlayCircle className="w-20 h-20 opacity-20" />
              <p className="font-bold text-xl">Video not available</p>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-12">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">
              <span>{course?.category || 'Course'}</span>
              <ChevronRight className="w-4 h-4" />
              <span>
                Lesson {currentIndex >= 0 ? currentIndex + 1 : '—'} / {lessons.length}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">{lesson.title}</h1>
            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed text-lg">
              {lesson.content || 'No detailed notes for this lesson.'}
            </div>
          </div>

          <hr className="mb-12 border-gray-200" />

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
                Comments ({comments.length})
              </h2>
            </div>

            <form onSubmit={handleAddComment} className="relative group">
              <textarea
                placeholder="Ask a question or share a thought…"
                className="w-full p-5 bg-white border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-800 placeholder-gray-400 min-h-[120px] shadow-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="absolute bottom-4 right-4 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
              >
                {commenting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Post
              </button>
            </form>

            <div className="space-y-6">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-lg shrink-0">
                        {studentName(comment).charAt(0)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <h4 className="font-bold text-gray-900 truncate">{studentName(comment)}</h4>
                          <span className="text-xs text-gray-400 font-medium shrink-0">
                            {comment.createdAt
                              ? new Date(comment.createdAt).toLocaleDateString()
                              : ''}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed break-words">{comment.text}</p>
                      </div>

                      {user && studentId(comment) === user.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all shrink-0"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {comments.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-medium italic">No comments yet. Start the discussion.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[min(100%,400px)] bg-white border-t lg:border-t-0 lg:border-l border-gray-200 lg:h-[100dvh] lg:sticky lg:top-0 overflow-y-auto">
        <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => router.push(`/courses/${id}`)}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
              aria-label="Back to course"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="font-black text-gray-900 line-clamp-2">{course?.title}</h3>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all"
              style={{
                width: `${lessons.length ? ((currentIndex + 1) / lessons.length) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">
            {lessons.length
              ? `Lesson ${currentIndex + 1} of ${lessons.length}`
              : 'No lessons'}
          </p>
        </div>

        <div className="p-4 space-y-2">
          {lessons.map((l, index) => (
            <button
              key={l._id}
              type="button"
              onClick={() => router.push(`/courses/${id}/lessons/${l._id}`)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                l._id === lessonId
                  ? 'bg-indigo-50 border border-indigo-100 shadow-sm'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  l._id === lessonId ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <div className="flex-grow min-w-0">
                <h4
                  className={`font-bold text-sm truncate ${
                    l._id === lessonId ? 'text-indigo-900' : 'text-gray-700'
                  }`}
                >
                  {l.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <PlayCircle
                    className={`w-3 h-3 shrink-0 ${l._id === lessonId ? 'text-indigo-500' : 'text-gray-400'}`}
                  />
                  <span className="text-[10px] font-bold uppercase text-gray-400">Video</span>
                </div>
              </div>
              {index < currentIndex && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
