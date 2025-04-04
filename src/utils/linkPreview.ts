export async function getLinkPreview(url: string) {
  try {
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    const isVimeo = url.includes('vimeo.com');

    if (isYouTube || isVimeo) {
      return {
        type: 'video',
        url
      };
    }

    return {
      type: 'link',
      url
    };
  } catch (error) {
    console.error('Error getting link preview:', error);
    return null;
  }
}