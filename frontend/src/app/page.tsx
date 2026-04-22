'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import type { Course } from '@/lib/types';
import { Search, Sparkles, TrendingUp, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/course?limit=3');
        setCourses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-8">
              <Sparkles className="w-4 h-4" />
              Over 1,000+ Students Joined
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
              Master New Skills <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Anywhere, Anytime
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
              Unlock your potential with our expert-led courses. From web development to digital marketing, start your journey today.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="What do you want to learn today?"
                className="block w-full pl-16 pr-32 py-5 bg-white border-2 border-gray-100 rounded-3xl shadow-xl focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Featured Courses</h2>
              <p className="text-gray-500 font-medium">Handpicked courses by our top instructors</p>
            </div>
            <Link href="/courses" className="text-indigo-600 font-bold hover:underline">
              View all courses &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[450px] bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
              {courses.length === 0 && (
                <div className="col-span-3 text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No courses found yet. Stay tuned!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accelerate Your Career</h3>
              <p className="text-gray-500 leading-relaxed">Gain the skills you need to land your dream job or start your own business.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 transform group-hover:-rotate-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Certificates</h3>
              <p className="text-gray-500 leading-relaxed">Earn a certificate for every course you complete to show off your achievements.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learn from Experts</h3>
              <p className="text-gray-500 leading-relaxed">Learn from industry professionals who are passionate about teaching.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
