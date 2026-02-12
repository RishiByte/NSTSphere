"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, MessageSquare, Award, BookOpen } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';

interface UserProfile {
    id: string;
    name: string;
    avatar_url?: string;
    xp_points: number;
    role: string;
    created_at: string;
    _count: {
        posts: number;
        comments: number;
    };
}

interface Post {
    id: string;
    title: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatar_url?: string;
    };
    subject: {
        name: string;
        slug: string;
    };
    _count: {
        comments: number;
    };
    vote_score: number;
    created_at: string;
}

export default function ProfilePage() {
    const params = useParams();
    const userId = params.id as string;

    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const { data } = await api.get(`/users/${userId}`);
            return data as UserProfile;
        }
    });

    const { data: posts, isLoading: isLoadingPosts } = useQuery({
        queryKey: ['posts', 'user', userId],
        queryFn: async () => {
            const { data } = await api.get(`/posts?author=${userId}`);
            return data as Post[];
        }
    });

    if (isLoadingUser) return <div className="p-8 text-center">Loading profile...</div>;
    if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="card p-6 bg-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}`}
                        alt={user.name}
                        className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg"
                    />
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-500 capitalize">{user.role}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {format(new Date(user.created_at), 'MMM yyyy')}</span>
                            <span className="flex items-center gap-1"><Award className="w-4 h-4 text-orange-500" /> {user.xp_points} XP</span>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg min-w-[80px]">
                            <div className="text-xl font-bold text-blue-600">{user._count.posts}</div>
                            <div className="text-xs text-gray-500 font-semibold">Posts</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg min-w-[80px]">
                            <div className="text-xl font-bold text-purple-600">{user._count.comments}</div>
                            <div className="text-xs text-gray-500 font-semibold">Comments</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Sidebar (Badges/Info? - Placeholder) */}
                <div className="space-y-6">
                    <div className="card p-4">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-500" /> Achievements
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="badge bg-yellow-100 text-yellow-800">Has joined</span>
                            {user.xp_points > 100 && <span className="badge bg-green-100 text-green-800">Rising Star</span>}
                            {user._count.posts > 5 && <span className="badge bg-blue-100 text-blue-800">Contributor</span>}
                        </div>
                    </div>
                </div>

                {/* Main Content - Posts */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> Recent Posts
                    </h3>

                    {isLoadingPosts ? (
                        <div className="text-center py-4">Loading posts...</div>
                    ) : posts?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100">
                            No posts yet.
                        </div>
                    ) : (
                        posts?.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
