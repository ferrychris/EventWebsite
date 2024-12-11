import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Share2,
  Bookmark,
  BookmarkCheck,
  Copy,
  Facebook,
  Mail,
} from 'lucide-react';
import Button from '../../../../components/common/Button';
import type { RootState } from '../../../../store';
import type { EventActionsProps } from '../../../../types/venue';

export default function EventActions({
  eventId,
  eventTitle,
  eventDate,
  eventLink,
}: EventActionsProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Toggle save/bookmark status
  const toggleSave = () => {
    const savedEvents = JSON.parse(localStorage.getItem('savedEvents') || '[]');

    if (isSaved) {
      const newSavedEvents = savedEvents.filter((id: string) => id !== eventId);
      localStorage.setItem('savedEvents', JSON.stringify(newSavedEvents));
    } else {
      savedEvents.push(eventId);
      localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
    }

    setIsSaved(!isSaved);
  };

  // Copy event link to clipboard
  const copyLink = () => {
    const shareUrl = eventLink || window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Share via email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(eventTitle);
    const body = encodeURIComponent(
      `Check out this event: ${eventTitle}\n\nDate: ${new Date(
        eventDate
      ).toLocaleDateString()}\n\nLink: ${eventLink || window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setShowShareMenu(false);
  };

  // Share on Facebook
  const shareOnFacebook = () => {
    const shareUrl = encodeURIComponent(eventLink || window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      '_blank'
    );
    setShowShareMenu(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      <Button
        variant="outline"
        onClick={toggleSave}
        icon={isSaved ? BookmarkCheck : Bookmark}
        customColor={primaryColor}
        className={
          isSaved
            ? `border-2 border-[${primaryColor}] text-[${primaryColor}] bg-[${primaryColor}10]`
            : ''
        }
      >
        {isSaved ? 'Saved' : 'Save'}
      </Button>

      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowShareMenu(!showShareMenu)}
          icon={Share2}
          customColor={primaryColor}
          className={
            showShareMenu
              ? `border-2 border-[${primaryColor}] text-[${primaryColor}] bg-[${primaryColor}10]`
              : ''
          }
        >
          Share
        </Button>

        {showShareMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              <button
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Copy className="w-4 h-4" />
                {showCopied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={shareViaEmail}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                onClick={shareOnFacebook}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
            </div>
          </div>
        )}

        {showShareMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />
        )}
      </div>
    </div>
  );
}
