import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { InteractionService } from '../services/interaction.service';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Pagination from './Pagination';

interface Comment {
    id: string;
    content: string;
    user_id: string;
    user: {
        full_name: string;
        email: string;
    };
    created_at: string;
}

interface CommentSectionProps {
    uiId: string;
    isOpen?: boolean;
    onClose?: () => void;
    variant?: 'modal' | 'embedded';
    onCommentsChange?: (count: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
    uiId,
    isOpen = false,
    onClose,
    variant = 'modal',
    onCommentsChange
}) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if ((isOpen || variant === 'embedded') && uiId) {
            loadComments();

            // Set up polling (every 2 minutes)
            const interval = setInterval(() => {
                loadComments();
            }, 120000);

            return () => clearInterval(interval);
        }
    }, [isOpen, uiId, variant, page]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const response = await InteractionService.getComments(uiId, { page, limit: 5 });
            if (response.status) {
                setComments(response.data);
                const total = response.meta?.total || 0;
                setTotalPages(response.meta?.totalPages || 1);
                setTotalItems(total);
                if (onCommentsChange) onCommentsChange(total);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to comment");
            return;
        }
        if (!newComment.trim()) return;

        try {
            const addedComment = await InteractionService.addComment(uiId, newComment);
            // Optimistically add to list; socket event will also fire but deduplicates by id
            setComments(prev => {
                if (prev.some(c => c.id === addedComment.id)) return prev;
                return [addedComment, ...prev];
            });
            const newCount = totalItems + 1;
            setTotalItems(newCount);
            if (onCommentsChange) onCommentsChange(newCount);
            setNewComment('');
            toast.success("Comment added");
        } catch (error) {
            console.error(error);
            toast.error("Failed to post comment");
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Delete this comment?')) return;
        try {
            await InteractionService.deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
            const newCount = Math.max(0, totalItems - 1);
            setTotalItems(newCount);
            if (onCommentsChange) onCommentsChange(newCount);
            toast.success("Comment deleted");
        } catch (e) {
            console.error(e);
            toast.error("Failed to delete comment");
        }
    };

    if (variant === 'modal' && (!isOpen || !mounted)) return null;

    const content = (
        <div className={`flex flex-col bg-white transition-colors duration-500 w-full ${variant === 'modal' ? 'max-w-md h-full border-l border-gray-100 shadow-2xl' : ''}`}>
            {/* Header */}
            {variant === 'modal' && (
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Comments ({totalItems})</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {/* Comments List */}
            <div className={`flex-1 overflow-y-auto space-y-6 ${variant === 'embedded' ? 'py-6 w-full' : 'p-6'}`}>
                {loading ? (
                    <div className="text-center text-gray-500 py-10">Loading comments...</div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 group relative">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 border border-blue-200 shrink-0">
                                {comment.user.full_name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-gray-900">{comment.user.full_name || 'Unknown User'}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                                        {user && String(user.user_id) === String(comment.user_id) && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete comment"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10 flex flex-col items-center gap-2">
                        <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        No comments yet. Be the first!
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="px-6 py-2 border-t border-gray-100">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {/* Input Area */}
            <div className={`p-4 ${variant === 'modal' ? 'border-t border-gray-100 bg-gray-50' : 'px-6 pb-6'}`}>
                {user ? (
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder:text-gray-400 pr-12 transition-all shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-lg text-white disabled:opacity-50 disabled:bg-gray-200 transition-all hover:bg-blue-700 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-6 mt-4">
                        <p className="text-sm text-gray-500 mb-3">Please login to join the discussion</p>
                        <Link href="/login" className="inline-block px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-sm">
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );

    if (variant === 'embedded') return content;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-100 flex justify-end">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md h-full flex flex-col animate-in slide-in-from-right duration-300">
                {content}
            </div>
        </div>,
        document.body
    );
};

export default CommentSection;
