'use client';

import { colors } from '@/lib/colors';

interface ActionButtonsProps {
  showReport?: boolean;
  showShare?: boolean;
}

export function ActionButtons({
  showReport = true,
  showShare = true,
}: ActionButtonsProps) {
  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Report clicked');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GamesToShare Listing',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex-shrink-0 flex flex-row gap-3">
      {/* Report Button */}
      {showReport && (
        <button
          onClick={handleReport}
          className="p-3.5 transition-all hover:bg-opacity-80 hover:cursor-pointer"
          style={{ backgroundColor: colors.red }}
          title="Report"
        >
          <img src="/Report.svg" alt="Report" width="20" height="20" />
        </button>
      )}

      {/* Share Button */}
      {showShare && (
        <button
          onClick={handleShare}
          className="p-3.5 transition-all hover:bg-opacity-80 hover:cursor-pointer"
          style={{ backgroundColor: colors.blue1 }}
          title="Share"
        >
          <img src="/Share.svg" alt="Share" width="20" height="20" />
        </button>
      )}
    </div>
  );
}
