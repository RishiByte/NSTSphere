"use client";

import Link from 'next/link';
import { Home, BookOpen, Star, Clock, Trophy, Hash } from 'lucide-react';

const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'My Timeline', href: '/timeline', icon: Clock },
    { name: 'Bookmarks', href: '/bookmarks', icon: Star },
];

const subjects = [
    { name: 'Exams Sem 1', href: '/subject/exams-sem-1', color: 'bg-blue-500' },
    { name: 'Maths-I Infinity', href: '/subject/maths-1', color: 'bg-green-500' },
    { name: 'Physics Ramanujan', href: '/subject/physics', color: 'bg-purple-500' },
    { name: 'Prof Comm', href: '/subject/prof-comm', color: 'bg-orange-500' },
    { name: 'PSP Infinity', href: '/subject/psp', color: 'bg-red-500' },
];

export default function Sidebar() {
    return (
        <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-gray-200 bg-white pb-10">
            <div className="p-4 space-y-6">
                <div>
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Menu
                    </h3>
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Subjects
                    </h3>
                    <div className="space-y-1">
                        {subjects.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
