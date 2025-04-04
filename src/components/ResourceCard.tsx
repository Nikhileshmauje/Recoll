import React, { useState } from 'react';
import { Tag, ExternalLink, Trash2, Play, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player/lazy';

interface ResourceCardProps {
  id: string;
  title: string;
  tags: string[];
  type: 'file' | 'link';
  url?: string;
  preview?: any;
  onDelete: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  id, 
  title, 
  tags, 
  type, 
  url, 
  onDelete 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be');

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (type === 'file' && url) {
        const fileName = url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('resources')
            .remove([fileName]);
          
          if (storageError) throw storageError;
        }
      }

      toast.success('Resource deleted successfully');
      onDelete();
    } catch (error: any) {
      console.error('Error deleting resource:', error);
      toast.error(error.message || 'Failed to delete resource');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Content Area */}
      <div className="relative">
        {isYouTube ? (
          <div className="relative aspect-video">
            {!isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-60 transition-opacity group"
              >
                <div className="p-4 rounded-full bg-white bg-opacity-90 group-hover:bg-opacity-100 transition-all">
                  <Play className="w-8 h-8 text-gray-900" />
                </div>
              </button>
            )}
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              light={!isPlaying}
              playing={isPlaying}
              controls={true}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              config={{
                youtube: {
                  playerVars: {
                    origin: window.location.origin,
                    modestbranding: 1,
                    rel: 0
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="h-48 bg-gray-900 flex items-center justify-center">
            <div className="text-white opacity-80">
              {type === 'file' ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center">
                    <LinkIcon className="w-8 h-8" />
                  </div>
                  <span className="text-sm">File Resource</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center">
                    <LinkIcon className="w-8 h-8" />
                  </div>
                  <span className="text-sm">Web Resource</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm"
              title="Open resource"
            >
              <ExternalLink className="w-4 h-4 text-gray-700" />
            </a>
          )}
          <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-white hover:bg-red-50 transition-colors shadow-sm group"
            title="Delete resource"
          >
            <Trash2 className="w-4 h-4 text-gray-700 group-hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};