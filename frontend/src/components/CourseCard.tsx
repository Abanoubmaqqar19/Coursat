'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Users, Clock, ArrowRight, Loader2, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
  /** When set, show a secondary action to leave the course (student my-learning). */
  onLeaveCourse?: () => void | Promise<void>;
  leaveCourseLoading?: boolean;
}

export default function CourseCard({ course, onLeaveCourse, leaveCourseLoading }: CourseCardProps) {
  const instructorName =
    typeof course.instructor === 'object' && course.instructor?.name
      ? course.instructor.name
      : undefined;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
    >
      <div className="relative h-48 bg-indigo-50 flex items-center justify-center overflow-hidden">
        <span className="text-4xl font-bold text-indigo-200 uppercase tracking-widest select-none group-hover:scale-110 transition-transform duration-500">
          {course.category || 'Course'}
        </span>
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
            {course.category || 'General'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-1 text-yellow-400 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
          <span className="text-gray-400 text-xs ml-2 font-medium">(1.2k reviews)</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {course.description || 'Explore this course on Coursat.'}
        </p>

        <div className="flex items-center gap-4 text-gray-400 text-xs mb-6 font-medium flex-wrap">
          {instructorName && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{instructorName}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Self-paced</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
          {onLeaveCourse && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                void onLeaveCourse();
              }}
              disabled={leaveCourseLoading}
              className="w-full py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {leaveCourseLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Leave course
            </button>
          )}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-medium">Price</span>
              <span className="text-2xl font-black text-gray-900">
                ${Number(course.price ?? 0).toFixed(2)}
              </span>
            </div>
            <Link
              href={`/courses/${course._id}`}
              className="bg-gray-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg group-hover:scale-105"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
