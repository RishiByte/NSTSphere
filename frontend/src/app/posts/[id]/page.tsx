"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useParams } from 'next/navigation';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import dynamic from 'next/dynamic';

import VoteControl from '@/components/common/VoteControl';

// Simple comment component placeholder for now
const CommentSection = dynamic(() => import('@/components/feed/CommentSection'), {
    loading: () => <p>Loading comments...</p>
});

async function fetchPost(id: string) {
    const { data } = await api.get(`/posts/${id}`);
    return data;
}

export default function PostDetailPage() {
    const params = useParams();
    const postId = params.id as string;

    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPost(postId),
        enabled: !!postId,
    });

    if (isLoading) return <div className="p-8 text-center">Loading post...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading post</div>;
    if (!post) return <div className="p-8 text-center">Post not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Post Content */}
            <div className="card overflow-hidden">
                <div className="flex">
                    {/* Vote Sidebar */}
                    <div className="p-4 bg-gray-50 border-r border-gray-100 flex flex-col items-center gap-2">
                        <VoteControl id={post.id} type="post" initialScore={post.vote_score} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                            <img
                                src={post.author.avatar_url || `https://ui-avatars.com/api/?name=${post.author.name}`}
                                alt={post.author.name}
                                className="w-6 h-6 rounded-full"
                            />
                            <span className="font-medium text-gray-900">{post.author.name}</span>
                            <span>in</span>
                            <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                                {post.subject.name}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(post.created_at))} ago
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

                        {/* HTML Content */}
                        <div
                            className="prose max-w-none mb-8 text-gray-800"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Footer Actions */}
                        <div className="flex items-center gap-6 text-gray-500 font-medium border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                {post._count?.comments || 0} Comments
                            </div>
                            <button className="flex items-center gap-2 hover:text-gray-900">
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>
                            <button className="flex items-center gap-2 hover:text-gray-900">
                                <MoreHorizontal className="w-5 h-5" />
                                More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comment Section */}
            <div className="mt-8">
                <CommentSection postId={postId} />
            </div>
        </div>
    );
}
