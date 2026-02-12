"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import PostCard from '@/components/feed/PostCard';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';

async function fetchPosts() {
  const { data } = await api.get('/posts');
  return data;
}

export default function Home() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solutions Hub</h1>
          <p className="text-gray-500 text-sm">Share and upvote assignment solutions</p>
        </div>
        <Link href="/create-post" className="btn-primary flex items-center gap-2 sm:hidden">
          <Plus className="w-4 h-4" /> Post
        </Link>
      </div>

      {/* Filters (Visual only for now) */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4 overflow-x-auto">
        <button className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          Hot
        </button>
        <button className="px-3 py-1 text-gray-500 hover:bg-gray-50 rounded-full text-sm font-medium whitespace-nowrap">
          New
        </button>
        <button className="px-3 py-1 text-gray-500 hover:bg-gray-50 rounded-full text-sm font-medium whitespace-nowrap">
          Top
        </button>
        <div className="flex-1"></div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-lg">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 h-40 animate-pulse bg-gray-100"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl">
            Error loading posts. Please try again later.
          </div>
        ) : posts?.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            <p className="text-lg font-medium mb-2">No posts yet</p>
            <p className="mb-6">Be the first to share a solution!</p>
            <Link href="/create-post" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Post
            </Link>
          </div>
        ) : (
          posts?.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
