"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import CommentItem from './CommentItem';

interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
        avatar_url?: string;
    };
    created_at: string;
    vote_score: number;
    parent_comment_id: string | null;
    replies?: Comment[];
}

export default function CommentSection({ postId }: { postId: string }) {
    const { user } = useAuth();
    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => {
            const { data } = await api.get(`/posts/${postId}/comments`);
            return data as Comment[];
        }
    });

    const createCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            return api.post(`/posts/${postId}/comments`, { content });
        },
        onSuccess: () => {
            toast.success('Comment posted!');
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            queryClient.invalidateQueries({ queryKey: ['post', postId] }); // Update comment count
        },
        onError: () => {
            toast.error('Failed to post comment');
        }
    });

    // Build Tree from flat list
    const commentTree = useMemo(() => {
        if (!comments) return [];

        const map = new Map<string, Comment>();
        const roots: Comment[] = [];

        // First pass: create map and initialize replies array
        comments.forEach(c => {
            map.set(c.id, { ...c, replies: [] });
        });

        // Second pass: link children to parents
        comments.forEach(c => {
            const comment = map.get(c.id)!;
            if (c.parent_comment_id) {
                const parent = map.get(c.parent_comment_id);
                if (parent) {
                    parent.replies?.push(comment);
                } else {
                    // Orphaned or parent not found, treat as root? Or ignore.
                    roots.push(comment);
                }
            } else {
                roots.push(comment);
            }
        });

        return roots;
    }, [comments]);


    return (
        <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Comments</h3>

            {/* Comment Box */}
            {user ? (
                <div className="mb-8">
                    <textarea
                        className="input-field min-h-[100px] mb-2"
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button
                            className="btn-primary"
                            disabled={!newComment.trim() || createCommentMutation.isPending}
                            onClick={() => createCommentMutation.mutate(newComment)}
                        >
                            {createCommentMutation.isPending ? 'Posting...' : 'Comment'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center mb-6 border border-gray-100">
                    <span className="font-semibold text-gray-700">Log in</span> to join the discussion.
                </div>
            )}

            {/* List */}
            <div>
                {isLoading ? (
                    <div className="text-center py-4">Loading comments...</div>
                ) : commentTree.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No comments yet.</div>
                ) : (
                    <div className="space-y-0">
                        {commentTree.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={postId}
                                refreshComments={() => queryClient.invalidateQueries({ queryKey: ['comments', postId] })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
