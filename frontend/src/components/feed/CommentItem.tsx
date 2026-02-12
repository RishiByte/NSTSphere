"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Reply } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

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
    replies?: Comment[]; // For recursive rendering if we build tree in frontend
}

export default function CommentItem({ comment, postId, refreshComments, depth = 0 }: { comment: Comment, postId: string, refreshComments: () => void, depth?: number }) {
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        setIsSubmitting(true);
        try {
            await api.post(`/posts/${postId}/comments`, {
                content: replyContent,
                parent_comment_id: comment.id
            });
            toast.success('Reply added!');
            setIsReplying(false);
            setReplyContent("");
            refreshComments();
        } catch (error) {
            toast.error('Failed to reply');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (depth > 5) return null; // Prevent too deep nesting

    return (
        <div className={`flex gap-3 ${depth > 0 ? 'mt-4' : 'border-b border-gray-100 py-4 last:border-0'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                <img
                    src={comment.author.avatar_url || `https://ui-avatars.com/api/?name=${comment.author.name}`}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full"
                />
            </div>

            <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span className="font-bold text-gray-900">{comment.author.name}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(comment.created_at))} ago</span>
                </div>

                {/* Content */}
                <p className="text-gray-800 text-sm mb-2">{comment.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                        <button className="hover:text-orange-500 p-1"><ArrowBigUp className="w-4 h-4" /></button>
                        <span>{comment.vote_score}</span>
                        <button className="hover:text-blue-500 p-1"><ArrowBigDown className="w-4 h-4" /></button>
                    </div>

                    <button
                        className="flex items-center gap-1 hover:bg-gray-100 p-1.5 rounded transition-colors"
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        <MessageSquare className="w-4 h-4" /> Reply
                    </button>
                </div>

                {/* Reply Box */}
                {isReplying && (
                    <div className="mt-3">
                        <textarea
                            className="input-field text-sm min-h-[80px] mb-2"
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setIsReplying(false)} className="text-xs font-semibold px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                            <button
                                onClick={handleReply}
                                disabled={isSubmitting || !replyContent.trim()}
                                className="text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Replying...' : 'Reply'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && ( /* Assuming tree structure is passed or we filter flat list */
                    <div className="pl-4 border-l-2 border-gray-100 mt-2">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                refreshComments={refreshComments}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
