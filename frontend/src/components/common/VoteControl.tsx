"use client";

import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

interface VoteControlProps {
    id: string;
    type: 'post' | 'comment';
    initialScore: number;
    initialVote?: number; // 1, -1, or 0/undefined
    orientation?: 'vertical' | 'horizontal';
}

export default function VoteControl({ id, type, initialScore, initialVote = 0, orientation = 'vertical' }: VoteControlProps) {
    const { user } = useAuth();
    const [score, setScore] = useState(initialScore);
    const [userVote, setUserVote] = useState(initialVote); // 0 = none, 1 = up, -1 = down
    const [isLoading, setIsLoading] = useState(false);

    const handleVote = async (newVote: 1 | -1) => {
        if (!user) {
            toast.error('Please log in to vote');
            return;
        }
        if (isLoading) return;

        // Optimistic Update
        const previousVote = userVote;
        const previousScore = score;
        let newScore = score;

        if (userVote === newVote) {
            // Toggle off
            setUserVote(0);
            newScore -= newVote;
        } else {
            // Change vote
            setUserVote(newVote);
            if (userVote === 0) {
                newScore += newVote;
            } else {
                newScore += (newVote * 2);
            }
        }
        setScore(newScore);

        // API Call
        setIsLoading(true);
        try {
            await api.post(`/vote/${type}/${id}`, { type: newVote });
        } catch (error) {
            // Revert
            setUserVote(previousVote);
            setScore(previousScore);
            toast.error('Failed to vote');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={clsx("flex items-center gap-1 bg-gray-50 rounded-xl p-1", orientation === 'vertical' ? 'flex-col' : 'flex-row')}>
            <button
                onClick={() => handleVote(1)}
                disabled={isLoading}
                className={clsx("p-1 rounded transition-colors", userVote === 1 ? "text-orange-500 bg-orange-100" : "text-gray-400 hover:text-orange-500 hover:bg-orange-50")}
            >
                <ArrowBigUp className={clsx("w-6 h-6", orientation === 'horizontal' && 'w-5 h-5')} fill={userVote === 1 ? "currentColor" : "none"} />
            </button>

            <span className={clsx("font-bold text-gray-700", orientation === 'horizontal' && 'min-w-[1.5rem] text-center text-sm')}>
                {score}
            </span>

            <button
                onClick={() => handleVote(-1)}
                disabled={isLoading}
                className={clsx("p-1 rounded transition-colors", userVote === -1 ? "text-blue-500 bg-blue-100" : "text-gray-400 hover:text-blue-500 hover:bg-blue-50")}
            >
                <ArrowBigDown className={clsx("w-6 h-6", orientation === 'horizontal' && 'w-5 h-5')} fill={userVote === -1 ? "currentColor" : "none"} />
            </button>
        </div>
    );
}
