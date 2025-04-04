import React, { useState, useEffect } from 'react';
import { Search, Plus, X, LogOut } from 'lucide-react';
import { AddResourceForm } from './components/AddResourceForm';
import { ResourceCard } from './components/ResourceCard';
import { FilterChips } from './components/FilterChips';
import { AuthModal } from './components/AuthModal';
import { supabase } from './lib/supabase';
import { ResourceType, detectResourceType } from './utils/resourceTypes';
import toast, { Toaster } from 'react-hot-toast';
import type { User } from './lib/supabase';

interface Resource {
  id: string;
  title: string;
  tags: string[];
  type: 'file' | 'link';
  url?: string;
  preview?: any;
}

function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchResources();
    } else {
      setResources([]);
    }
  }, [user]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      setResources(data || []);
      
      const tags = data?.reduce((acc: string[], resource: Resource) => {
        return [...acc, ...resource.tags.filter(tag => !acc.includes(tag))];
      }, []);
      setAllTags(tags || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => resource.tags.includes(tag));

    const matchesType = !selectedType ||
      (resource.url && detectResourceType(resource.url) === selectedType);

    return matchesSearch && matchesTags && matchesType;
  });

  return (
    <div className="min-h-screen bg-neutral">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="navbar fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <h1 className="app-title text-2xl font-bold text-primary">ReColl</h1>
            
            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-primary opacity-70 hidden sm:block">{user.email}</span>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="glass-button rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:block">Add Resource</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="glass-button rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:block">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="glass-button rounded-lg px-6 py-2"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        {user ? (
          <>
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary opacity-70 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              {/* Resource Type Filter */}
              <FilterChips
                selectedType={selectedType}
                onTypeSelect={setSelectedType}
              />

              {/* Tags Filter */}
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(
                        selectedTags.includes(tag)
                          ? selectedTags.filter(t => t !== tag)
                          : [...selectedTags, tag]
                      );
                    }}
                    className={`glass-button rounded-full px-4 py-2 text-sm flex items-center gap-1 ${
                      selectedTags.includes(tag)
                        ? 'ring-2 ring-secondary'
                        : ''
                    }`}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="bento-grid">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  tags={resource.tags}
                  type={resource.type}
                  url={resource.url}
                  preview={resource.preview}
                  onDelete={fetchResources}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-16">
            <div className="flex-1 text-left">
              <h2 className="app-title text-5xl font-bold text-primary mb-6">
                Organize Your Digital Resources
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-xl">
                ReColl helps you collect, organize, and access all your important resources in one place. 
                Save articles, documents, videos, and links with powerful tagging and instant search.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="glass-button rounded-xl px-8 py-3 text-lg font-medium"
              >
                Get Started
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 hero-pattern rounded-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=800"
                alt="Organized desk with laptop and notes"
                className="rounded-3xl shadow-xl relative z-10"
              />
            </div>
          </div>
        )}

        {/* Add Resource Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary">Add New Resource</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-primary opacity-70 hover:opacity-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <AddResourceForm onSuccess={() => {
                setShowAddForm(false);
                fetchResources();
              }} />
            </div>
          </div>
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </main>
    </div>
  );
}

export default App;