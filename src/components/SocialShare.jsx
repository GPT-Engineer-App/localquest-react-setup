import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const SocialShare = ({ url, title }) => {
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnInstagram = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied! Open Instagram and paste the link in your story or post.');
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={shareOnFacebook} variant="outline">
        <Facebook className="w-4 h-4 mr-2" />
        Share on Facebook
      </Button>
      <Button onClick={shareOnTwitter} variant="outline">
        <Twitter className="w-4 h-4 mr-2" />
        Share on Twitter
      </Button>
      <Button onClick={shareOnInstagram} variant="outline">
        <Instagram className="w-4 h-4 mr-2" />
        Share on Instagram
      </Button>
    </div>
  );
};

export default SocialShare;