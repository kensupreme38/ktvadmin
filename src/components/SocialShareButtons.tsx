interface SocialShareButtonsProps {
  url?: string;
  title?: string;
}

export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  return (
    <div className="flex gap-2">
      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
        Share
      </button>
    </div>
  );
}
