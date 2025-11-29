'use client';

import { colors } from '@/lib/colors';

export function ActionButtons() {
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
      <button
        onClick={handleReport}
        className="p-3.5 transition-all hover:bg-opacity-80"
        style={{ backgroundColor: colors.red }}
        title="Report"
      >
        <img src="/Report.svg" alt="Report" width="20" height="20" />
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="p-3.5 transition-all hover:bg-opacity-80"
        style={{ backgroundColor: colors.blue1 }}
        title="Share"
      >
        <img src="/Share.svg" alt="Share" width="20" height="20" />
      </button>
    </div>
  );
}
