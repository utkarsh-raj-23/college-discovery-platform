'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCompareStore } from '@/store/compareStore';
import {
  BookOpen,
  BarChart2,
  Zap,
  MessageCircle,
  Bookmark,
  LogOut,
  LogIn,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { ids } = useCompareStore();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 font-bold text-xl"
          >
            <BookOpen size={24} />
            CollegeHub
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link
              href="/colleges"
              className="hover:text-blue-600 transition-colors"
            >
              Colleges
            </Link>
            <Link
              href="/compare"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <BarChart2 size={16} />
              Compare
              {ids.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {ids.length}
                </span>
              )}
            </Link>
            <Link
              href="/predict"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <Zap size={16} />
              Predict
            </Link>
            <Link
              href="/qa"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <MessageCircle size={16} />
              Q&A
            </Link>
            {user ? (
              <>
                <Link
                  href="/saved"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Bookmark size={16} />
                  Saved
                </Link>
                <span className="text-gray-400 text-sm">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <LogIn size={16} />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}