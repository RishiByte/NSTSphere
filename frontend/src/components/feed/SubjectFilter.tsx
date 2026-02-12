"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Hash } from 'lucide-react';

interface Subject {
    id: string;
    name: string;
    slug: string;
}

export default function SubjectFilter() {
    const searchParams = useSearchParams();
    const currentSubject = searchParams.get('subject');

    const { data: subjects, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: async () => {
            const { data } = await api.get('/subjects');
            return data as Subject[];
        }
    });

    return (
        <div className="card p-4">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-gray-500" />
                Subjects
            </h3>

            <div className="flex flex-col gap-1">
                <Link
                    href="/"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!currentSubject
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    All Subjects
                </Link>

                {isLoading ? (
                    <div className="p-4 text-center text-xs text-gray-400">Loading...</div>
                ) : (
                    subjects?.map(subject => (
                        <Link
                            key={subject.id}
                            href={`/?subject=${subject.slug}`}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentSubject === subject.slug
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {subject.name}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
