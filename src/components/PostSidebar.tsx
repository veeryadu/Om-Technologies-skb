import React, { useState, useEffect } from 'react';
import { Smile, Image as ImageIcon, Sticker, Send, Heart, CheckCircle2, LogIn } from 'lucide-react';
import { ProjectRoadmap } from './ProjectRoadmap';
import { useAuth } from '../AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  timeAgo: string;
  text: string;
  likes: number;
  liked?: boolean;
}

export const PostSidebar: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultComments: Comment[] = [
    {
      id: 'c1',
      author: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
      role: 'Product Designer',
      timeAgo: '2h ago',
      text: 'The crimson red atmospheric glow around that 3D particle globe is exceptional! Perfect aesthetic balance.',
      likes: 14,
    },
    {
      id: 'c2',
      author: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces',
      role: 'Frontend Architect',
      timeAgo: '4h ago',
      text: 'Love the four corner glass cards flanking the planetary model. The subtle border highlights give it so much depth.',
      likes: 9,
    },
    {
      id: 'c3',
      author: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
      role: 'Founder @ SynthHQ',
      timeAgo: '1d ago',
      text: 'Saved this for our Q3 marketing revamp! Bookmarking this aesthetic.',
      likes: 22,
    },
  ];

  const [comments, setComments] = useState<Comment[]>(defaultComments);

  // Sync with Firestore comments
  useEffect(() => {
    const commentsQuery = query(
      collection(db, 'comments'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const liveComments: Comment[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              author: data.author || 'Anonymous Designer',
              avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
              role: data.role || 'Member',
              timeAgo: 'Recently',
              text: data.text || '',
              likes: data.likes || 0,
            };
          });
          setComments([...liveComments, ...defaultComments]);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'comments');
      }
    );

    return () => unsubscribe();
  }, []);

  const quickEmojis = ['🔥', '❤️', '👏', '🚀', '😍', '✨', '💯', '🙌'];

  const handlePostComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    if (!user) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    const text = commentText.trim();
    try {
      await addDoc(collection(db, 'comments'), {
        authorId: user?.uid || 'guest',
        author: user?.displayName || 'Guest Designer',
        avatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
        role: 'Community Member',
        text: text,
        likes: 1,
        createdAt: serverTimestamp(),
      });
      setCommentText('');
      setShowEmojiPicker(false);
    } catch (err) {
      console.warn('Could not post comment to Firestore:', err);
      // Fallback in-memory
      const newComment: Comment = {
        id: `c_${Date.now()}`,
        author: user?.displayName || 'Guest Designer',
        avatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
        role: 'Community Member',
        timeAgo: 'Just now',
        text: text,
        likes: 1,
        liked: true,
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      setShowEmojiPicker(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCommentLike = async (id: string) => {
    const target = comments.find((c) => c.id === id);
    if (!target) return;

    const nextLiked = !target.liked;
    const nextLikes = nextLiked ? target.likes + 1 : Math.max(0, target.likes - 1);

    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, liked: nextLiked, likes: nextLikes } : c))
    );

    // If it's a Firestore document ID, try updating
    if (!id.startsWith('c')) {
      try {
        const commentRef = doc(db, 'comments', id);
        await updateDoc(commentRef, { likes: nextLikes });
      } catch (err) {
        console.warn('Could not update comment like in Firestore:', err);
      }
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full pl-0 lg:pl-6 pt-6 lg:pt-0">
      {/* Top Details Area */}
      <div className="flex flex-col">
        {/* Post Title matching screenshot */}
        <h2 className="text-xl sm:text-2xl lg:text-[27px] font-extrabold text-neutral-950 tracking-tight leading-[1.2] mb-5">
          AI Landing Page Design Inspiration for Modern SaaS Websites
        </h2>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="font-bold text-sm sm:text-base text-neutral-900 mb-2">Description</h3>

          <div className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed">
            <span>
              A modern AI landing page featuring a premium dark UI, bold typography, interactive 3D visuals, and a clean
              SaaS layout. Designed for startups, AI products, automation platforms, and
            </span>
            {!isExpanded ? (
              <span>
                ...{' '}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="font-bold text-neutral-900 hover:underline cursor-pointer inline-block ml-0.5"
                >
                  See more
                </button>
              </span>
            ) : (
              <div className="mt-2 space-y-3 animate-in fade-in duration-200">
                <span>
                  {' '}
                  enterprise infrastructure teams seeking a high-converting, forward-looking aesthetic.
                </span>

                <div className="pt-3 mt-3 border-t border-neutral-100">
                  <h4 className="font-semibold text-xs text-neutral-800 uppercase tracking-wider mb-2">
                    Design Highlights:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span><strong>Obsidian & Crimson Palette:</strong> Deep carbon blacks paired with intense scarlet glowing accents</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span><strong>Dynamic 3D Centerpiece:</strong> Interactive particle sphere with dual orbital data rings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span><strong>Bento Glass Cards:</strong> Frosted translucent acrylic containers with responsive directional hover triggers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span><strong>Metrics Strip:</strong> High-trust quantifiable proof points (99.9% Uptime, 10K+ Users)</span>
                    </li>
                  </ul>
                </div>

                {/* Project Roadmap Component under Feature Highlights */}
                <ProjectRoadmap />

                <button
                  onClick={() => setIsExpanded(false)}
                  className="font-bold text-xs text-neutral-900 hover:underline cursor-pointer pt-1 inline-block"
                >
                  See less
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Community Feedback / Comments List */}
        <div className="border-t border-neutral-200/80 pt-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs sm:text-sm text-neutral-800">
              Community Discussion ({comments.length})
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">Most Relevant</span>
          </div>

          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5 items-start text-xs group">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-7 h-7 rounded-full object-cover mt-0.5 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 bg-neutral-50 rounded-2xl p-2.5 border border-neutral-100 hover:border-neutral-200 transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-neutral-900">{comment.author}</span>
                    <span className="text-[10px] text-neutral-400">{comment.timeAgo}</span>
                  </div>
                  <p className="text-neutral-700 leading-snug">{comment.text}</p>
                  <div className="flex items-center gap-3 mt-1.5 pt-1 text-[10.5px] text-neutral-500">
                    <button
                      onClick={() => handleToggleCommentLike(comment.id)}
                      className={`flex items-center gap-1 hover:text-red-500 transition cursor-pointer ${
                        comment.liked ? 'text-red-500 font-semibold' : ''
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${comment.liked ? 'fill-red-500' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="hover:text-neutral-900 transition cursor-pointer">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Comment Input Bar matching screenshot */}
      <div className="relative pt-3 border-t border-neutral-200/70">
        {/* Emoji quick bar popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 left-0 right-0 p-2 bg-white rounded-2xl shadow-xl border border-neutral-200 z-30 flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 flex-wrap">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setCommentText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1 text-base hover:scale-125 transition cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handlePostComment}
          className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-full border border-neutral-300 bg-white hover:border-neutral-400 focus-within:border-neutral-500 focus-within:ring-2 focus-within:ring-neutral-200 shadow-sm transition-all"
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment to share your thoughts"
            className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none"
          />

          <div className="flex items-center gap-1 text-neutral-700 shrink-0">
            {/* Smiley emoji icon */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              aria-label="Add emoji"
              className="p-1 hover:text-neutral-950 transition cursor-pointer"
            >
              <Smile className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Sticker / GIF icon */}
            <button
              type="button"
              onClick={() => {
                setCommentText((prev) => (prev ? prev + ' [GIF]' : '[GIF]'));
              }}
              aria-label="Add sticker"
              className="p-1 hover:text-neutral-950 transition cursor-pointer"
            >
              <Sticker className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Photo / image attachment icon */}
            <button
              type="button"
              onClick={() => {
                alert('Attach screenshot or mockups directly from your clipboard or files.');
              }}
              aria-label="Attach photo"
              className="p-1 hover:text-neutral-950 transition cursor-pointer"
            >
              <ImageIcon className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Send button when typing */}
            {commentText.trim() && (
              <button
                type="submit"
                className="ml-1 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition cursor-pointer animate-in zoom-in-75 duration-150"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
