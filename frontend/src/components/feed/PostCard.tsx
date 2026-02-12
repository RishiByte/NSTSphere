"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
    vote_score: number;
    _count: {
        comments: number;
    };
    created_at: string;
}

import VoteControl from '../common/VoteControl';

export default function PostCard({ post }: { post: Post }) {
    const { user } = useAuth();

    // Truncate content for preview - rudimentary HTML strip
    const previewContent = post.content.replace(/<[^>]+>/g, '').substring(0, 200) + '...';

    return (
        <div className="card hover:border-gray-300 transition-colors cursor-pointer block">
            <div className="flex">
                {/* Vote Column */}
                <div className="p-2 border-r border-gray-100 flex flex-col items-center justify-start pt-4">
                    <VoteControl
                        id={post.id}
                        type="post"
                        initialScore={post.vote_score}
                    // We don't have user's vote status in the post object yet for listing. 
                    // Assuming 0 for now or we need to fetch it.
                    // Ideal implementation requires backend to return `user_vote` field.
                    />
                </div>

                {/* Content Column */}
                <div className="flex-1 p-3 sm:p-4">
                    {/* Header */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Link href={`/profile/${post.author.id}`} className="flex items-center gap-2 hover:bg-gray-100 p-1 -ml-1 rounded-lg transition-colors">
                            <img
                                src={post.author.avatar_url || `https://ui-avatars.com/api/?name=${post.author.name}&background=random`}
                                alt={post.author.name}
                                className="w-5 h-5 rounded-full"
                            />
                            <span className="font-semibold text-gray-900">{post.author.name}</span>
                        </Link>
                        <span>•</span>
                        <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                            {post.subject.name}
                        </span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                    </div>

                    {/* Title & Body */}
                    <Link href={`/posts/${post.id}`}>
                        <h2 className="text-lg font-bold text-gray-900 mb-2 hover:underline">{post.title}</h2>
                        <p className="text-sm text-gray-600 mb-4">{previewContent}</p>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-4 text-gray-500 text-sm font-bold">
                        <Link href={`/posts/${post.id}`} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            {post._count.comments} Comments
                        </Link>
                        <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button className="hover:bg-gray-100 p-2 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
