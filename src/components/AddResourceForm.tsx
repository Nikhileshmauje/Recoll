import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Plus, X, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { getLinkPreview } from '../utils/linkPreview';

interface AddResourceFormProps {
  onSuccess?: () => void;
}

export const AddResourceForm: React.FC<AddResourceFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resourceType, setResourceType] = useState<'file' | 'link'>('file');

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      if (!title) {
        setTitle(acceptedFiles[0].name.split('.')[0]);
      }
      setResourceType('file');
      setLink('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
    setResourceType('link');
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    if (resourceType === 'link' && !link) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to add resources');
        return;
      }

      let url = '';
      let preview = null;
      
      if (resourceType === 'file' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('resources')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('resources')
            .getPublicUrl(fileName);
          
          url = publicUrl;
        }
      } else if (resourceType === 'link') {
        url = link;
        preview = await getLinkPreview(link);
      }

      const { data, error } = await supabase
        .from('resources')
        .insert([
          {
            title,
            tags,
            type: resourceType,
            url,
            preview,
            user_id: user.id
          },
        ])
        .select();

      if (error) throw error;

      toast.success('Resource added successfully!');
      setTitle('');
      setTags([]);
      setFile(null);
      setLink('');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to add resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="glass-input w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter resource title"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setResourceType('file')}
          className={`flex-1 glass-button rounded-lg py-3 flex items-center justify-center gap-2 ${
            resourceType === 'file' ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          <Upload className="w-5 h-5" />
          File Upload
        </button>
        <button
          type="button"
          onClick={() => setResourceType('link')}
          className={`flex-1 glass-button rounded-lg py-3 flex items-center justify-center gap-2 ${
            resourceType === 'link' ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          <LinkIcon className="w-5 h-5" />
          Web Link
        </button>
      </div>

      {resourceType === 'link' ? (
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-text-primary mb-2">
            URL
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={handleLinkChange}
            className="glass-input w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter URL (e.g., YouTube video, website)"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Upload File</label>
          <div
            {...getRootProps()}
            className={`glass-button rounded-lg p-6 text-center cursor-pointer ${
              isDragActive ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-white opacity-70" />
            <p className="mt-2 text-sm text-white opacity-70">
              {file
                ? `Selected: ${file.name}`
                : 'Drag & drop a file here, or click to select'}
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="glass-button rounded-full px-3 py-1 text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-white opacity-70 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="glass-input flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="glass-button rounded-lg px-4 flex items-center justify-center"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full glass-button rounded-lg py-3 text-white font-medium ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-30'
        }`}
      >
        {isSubmitting ? 'Adding Resource...' : 'Add Resource'}
      </button>
    </form>
  );
};