'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, LogOut, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Coursat</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Browse Courses
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'instructor' && (
                  <Link href="/instructor/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                {user.role === 'student' && (
                  <Link href="/my-courses" className="text-gray-600 hover:text-indigo-600 font-medium">
                    My Learning
                  </Link>
                )}
                <div className="h-6 w-px bg-gray-200 mx-2" />
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-1.5 rounded-full">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-gray-50 text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 hover:shadow-lg"
                >
                  Join for Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-xl px-4 py-6"
          >
            <div className="flex flex-col gap-4">
              <Link href="/courses" className="text-lg font-medium text-gray-600" onClick={() => setIsOpen(false)}>
                Browse Courses
              </Link>
              {user ? (
                <>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  {user.role === 'instructor' && (
                    <Link href="/instructor/dashboard" className="text-gray-600 font-medium" onClick={() => setIsOpen(false)}>
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link href="/my-courses" className="text-gray-600 font-medium" onClick={() => setIsOpen(false)}>
                      My Learning
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600 font-medium mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4 pt-4 border-t">
                  <Link href="/login" className="text-center py-3 font-medium text-gray-600" onClick={() => setIsOpen(false)}>
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="text-center py-3 bg-indigo-600 text-white rounded-xl font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Join for Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
