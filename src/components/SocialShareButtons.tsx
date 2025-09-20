'use client'

import { Button } from './ui/button';
import { Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const [fullUrl, setFullUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    // This runs only on the client, ensuring `window.location.origin` is available
    setFullUrl(`${window.location.origin}${url}`);
  }, [url]);

  const copyToClipboard = () => {
    if (fullUrl) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopied(true);
        toast({ title: "Copied to clipboard!" });
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex gap-2">
      <Button asChild variant="outline" size="icon">
        <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
          <span className="sr-only">Share on Facebook</span>
        </a>
      </Button>
      <Button asChild variant="outline" size="icon">
        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
          <span className="sr-only">Share on Twitter</span>
        </a>
      </Button>
      <Button variant="outline" size="icon" onClick={copyToClipboard}>
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  );
}
