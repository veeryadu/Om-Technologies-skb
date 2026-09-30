import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Upload, MoreHorizontal, Check, Copy, Share2, Download, Code } from 'lucide-react';

interface PostHeaderProps {
  onBack?: () => void;
  onCommentClick?: () => void;
  onSaveToggle?: (saved: boolean) => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  onBack,
  onCommentClick,
  onSaveToggle,
}) => {
  const [likes, setLikes] = useState(7);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    onSaveToggle?.(nextSaved);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between w-full mb-5 select-none">
      {/* Left: Back button */}
      <div>
        <button
          onClick={onBack}
          aria-label="Go back"
          className="p-2.5 rounded-full hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-neutral-900 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
      </div>

      {/* Right: Actions cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 cursor-pointer ${
            isLiked
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : 'text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200'
          }`}
          aria-label="Like post"
        >
          <Heart
            className={`w-5 h-5 transition-transform duration-200 ${
              isLiked ? 'fill-red-600 scale-110' : 'stroke-[2.2]'
            }`}
          />
          <span className="font-semibold text-sm sm:text-base tabular-nums">{likes}</span>
        </button>

        {/* Comment jump button */}
        <button
          onClick={onCommentClick}
          aria-label="Comments"
          className="p-2.5 rounded-full hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-neutral-900 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Share Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            aria-label="Share post"
            className="p-2.5 rounded-full hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-neutral-900 cursor-pointer"
          >
            <Upload className="w-5 h-5 stroke-[2.2]" />
          </button>

          {showShareMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowShareMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-white rounded-2xl shadow-xl border border-neutral-200 z-40 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-100 rounded-xl transition cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                    {copied ? 'Link Copied!' : 'Copy Link'}
                  </span>
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out this stunning AI Landing Page design inspiration by Arpan Dubey!&url=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-100 rounded-xl transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-neutral-500" />
                  Share on X (Twitter)
                </a>
              </div>
            </>
          )}
        </div>

        {/* More options button with menu */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            aria-label="More options"
            className="p-2.5 rounded-full hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-neutral-900 cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
          </button>

          {showMoreMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowMoreMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-white rounded-2xl shadow-xl border border-neutral-200 z-40 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    handleCopyLink();
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-100 rounded-xl transition text-left cursor-pointer"
                >
                  <Code className="w-4 h-4 text-neutral-500" />
                  Copy Embed Code
                </button>
                <button
                  onClick={() => {
                    alert('Exporting design specs & assets bundle...');
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-100 rounded-xl transition text-left cursor-pointer"
                >
                  <Download className="w-4 h-4 text-neutral-500" />
                  Download High-Res Assets
                </button>
              </div>
            </>
          )}
        </div>

        {/* Red Save Button */}
        <button
          onClick={handleSave}
          className={`ml-1 px-5 py-2.5 rounded-full font-bold text-[15px] transition-all duration-200 shadow-sm cursor-pointer ${
            isSaved
              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
              : 'bg-[#E60023] hover:bg-[#b8001c] active:bg-[#990017] text-white'
          }`}
        >
          {isSaved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  );
};
