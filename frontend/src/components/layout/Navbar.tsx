"use client";

import Link from 'next/link';
import { LogOut, Menu, X, BookOpen, User as UserIcon, PlusSquare, Search, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <span className="text-white font-bold text-lg">N</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 hidden sm:block">NSTSphere</span>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                            placeholder="Search assignments, tags, or authors..."
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link href="/create-post" className="hidden md:flex items-center gap-2 btn-primary">
                                    <PlusSquare className="w-4 h-4" />
                                    <span>Create Post</span>
                                </Link>
                                <Link href={`/profile/${user.id}`} className="hidden md:flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold">
                                    <UserIcon className="w-5 h-5" />
                                    <span>Me</span>
                                </Link>
                                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200">
                                    <span className="text-xs font-bold">⚡ {user.xp_points} XP</span>
                                </div>
                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                    <Bell className="w-5 h-5" />
                                </button>
                                <div className="relative group">
                                    <button className="flex items-center gap-2">
                                        <img
                                            src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}`}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full border border-gray-200"
                                        />
                                    </button>
                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign out</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
                                <Link href="/register" className="btn-primary">Sign up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
