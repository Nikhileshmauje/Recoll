export type ResourceType = 'video' | 'document' | 'web';

export interface ResourceTypeConfig {
  icon: string;
  label: string;
  aspectRatio: string;
  minHeight: string;
}

export const RESOURCE_TYPES: Record<ResourceType, ResourceTypeConfig> = {
  video: {
    icon: '🎥',
    label: 'Video',
    aspectRatio: '16/9',
    minHeight: '300px',
  },
  document: {
    icon: '📄',
    label: 'Document',
    aspectRatio: '1/1.414',
    minHeight: '400px',
  },
  web: {
    icon: '🌐',
    label: 'Web',
    aspectRatio: '1/1',
    minHeight: '250px',
  },
};

export function detectResourceType(url: string): ResourceType {
  const youtubePattern = /(youtube\.com|youtu\.be)/;
  const instagramPattern = /instagram\.com\/reel/;
  const documentPattern = /\.(pdf|docx?)$/;

  if (youtubePattern.test(url) || instagramPattern.test(url)) {
    return 'video';
  } else if (documentPattern.test(url)) {
    return 'document';
  }
  return 'web';
}

export function getYouTubeVideoId(url: string): string | null {
  const pattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

export function getInstagramReelId(url: string): string | null {
  const pattern = /instagram\.com\/reel\/([^/?]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return '';
  }
}