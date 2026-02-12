"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Subject {
    id: string;
    name: string;
    slug: string;
}

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const router = useRouter();

    // Fetch real subjects
    const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
        queryKey: ['subjects'],
        queryFn: async () => {
            const { data } = await api.get('/subjects');
            return data as Subject[];
        }
    });

    const createPostMutation = useMutation({
        mutationFn: async (newPost: { title: string, content: string, subject_id: string }) => {
            return api.post('/posts', newPost);
        },
        onSuccess: () => {
            toast.success('Post created successfully!');
            router.push('/');
        },
        onError: (error) => {
            toast.error('Failed to create post');
            console.error(error);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjectId && subjects && subjects.length > 0) {
            toast.error('Please select a subject');
            return;
        }

        createPostMutation.mutate({
            title,
            content,
            subject_id: subjectId || (subjects && subjects[0]?.id) || '',
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Post a Solution</h1>

            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="e.g., Solution for Assignment 3, Question 5"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                        className="input-field"
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a subject</option>
                        {subjects?.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                        className="input-field h-64 font-sans resize-none"
                        placeholder="Write your solution or question details here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Tip: You can use plain text for now. Rich text editor is undergoing maintenance.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <button type="button" onClick={() => router.back()} className="btn-secondary">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={createPostMutation.isPending || isLoadingSubjects}
                    >
                        {createPostMutation.isPending ? 'Posting...' : 'Post Solution'}
                    </button>
                </div>
            </form>
        </div>
    );
}
