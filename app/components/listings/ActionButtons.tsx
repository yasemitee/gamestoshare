'use client';

import toast, { Toaster } from 'react-hot-toast';
import { colors } from '@/lib/colors';

interface ActionButtonsProps {
  showReport?: boolean;
  showShare?: boolean;
  /** Path or URL to share; defaults to the current page. */
  shareUrl?: string;
}

export function ActionButtons({
  showReport = true,
  showShare = true,
  shareUrl,
}: ActionButtonsProps) {
  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Report clicked');
  };

  const handleShare = async () => {
    const url = new URL(shareUrl ?? window.location.href, window.location.origin)
      .href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GamesToShare Listing',
          url,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!', {
        duration: 3000,
        style: {
          background: colors.gray3,
          color: colors.white,
          borderRadius: '0',
          fontSize: '12px',
          textTransform: 'none',
        },
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex-shrink-0 flex flex-row gap-3">
        {/* Report Button */}
        {showReport && (
          <button
            onClick={handleReport}
            className="press p-3.5 transition-opacity hover:opacity-80 hover:cursor-pointer"
            style={{ backgroundColor: colors.red }}
            title="Report"
          >
            <img src="/Report.svg" alt="Report" width="20" height="20" />
          </button>
        )}

        {/* Share Button */}
        {showShare && (
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this listing"
            className="glow-hover press p-3.5 hover:cursor-pointer"
            style={{ backgroundColor: colors.gray3 }}
            title="Share"
          >
            <img src="/Share.svg" alt="Share" width="20" height="20" />
          </button>
        )}
      </div>
    </>
  );
}
