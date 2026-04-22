'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import type { Course } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async (query = '', pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/course?search=${encodeURIComponent(query)}&page=${pageNum}&limit=9`);
      setCourses(response.data.data || []);
      setTotalPages(response.data.pages ?? 1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses(search, page);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Explore Courses</h1>
            <p className="text-gray-500 font-medium">Discover your next passion from our curated list.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all shadow-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[450px] bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <button
                  onClick={() => setSearch('')}
                  className="mt-6 text-indigo-600 font-bold hover:underline"
                >
                  Clear all search
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16 gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${
                      page === i + 1
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
