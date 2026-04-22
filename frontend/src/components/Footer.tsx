'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Coursat</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering learners worldwide with high-quality, expert-led courses. Join our community of 1M+ students today.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
              <li><Link href="/instructor/register" className="hover:text-white transition-colors">Become an Instructor</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Business Plans</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span>123 Learning Way, Digital City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-500" />
                <span>+1 (555) 000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-500" />
                <span>hello@coursat.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Coursat Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white">English (US)</a>
            <a href="#" className="hover:text-white">USD ($)</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
