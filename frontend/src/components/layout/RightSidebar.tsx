import Link from 'next/link';
import SubjectFilter from '../feed/SubjectFilter';

export default function RightSidebar() {
    return (
        <aside className="hidden xl:block w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-6 space-y-6">

            {/* Post Action */}
            <Link href="/create-post" className="block w-full py-3 px-4 bg-blue-600 text-white text-center font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-transform transform hover:-translate-y-0.5">
                Post a Solution
            </Link>

            {/* Subject Filter */}
            <SubjectFilter />

            {/* Top Contributors */}
            <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Top Contributors</h3>
                    <span className="text-xs text-gray-500">This Week</span>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    U{i}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">User Name</p>
                                    <p className="text-xs text-gray-500">Rank #{i}</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-yellow-600">{1000 - i * 50} XP</span>
                        </div>
                    ))}
                </div>
                <Link href="/leaderboard" className="block mt-4 text-center text-sm text-blue-600 font-medium hover:underline">
                    View Leaderboard
                </Link>
            </div>

            {/* Daily Challenge */}
            <div className="card p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded uppercase">Live</span>
                    <span className="text-xs font-semibold text-blue-700">Ends in 5h 23m</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">First Occurrence Tracker</h3>
                <p className="text-xs text-gray-600 mb-3">227 people have attempted</p>
                <button className="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Solve Now →
                </button>
            </div>
        </aside>
    );
}
