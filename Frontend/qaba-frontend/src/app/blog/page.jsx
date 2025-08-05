
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BlogPage = () => {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadedPosts, setLoadedPosts] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all blogs
        const blogsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/`);
        if (!blogsRes.ok) throw new Error('Failed to fetch blogs');
        const blogsData = await blogsRes.json();
        let blogs = blogsData.data || blogsData;
        // Sort blogs by published_at descending (latest first)
        blogs = blogs.slice().sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        // The latest blog is the featured post
        const featured = blogs[0] || null;
        setFeaturedPost(featured);
        // Remove featured from recent if present
        const recent = blogs.filter(post => post.slug !== (featured && featured.slug));
        setRecentPosts(recent);
      } catch (err) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleLoadMore = () => {
    setLoadedPosts(prev => Math.min(prev + 6, recentPosts.length));
  };

  // Helper to ensure image URLs are https
  function ensureHttps(url) {
    if (typeof url === 'string' && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Featured News': 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white',
      'Market Trends': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      'Product Update': 'bg-gradient-to-r from-green-500 to-teal-500 text-white',
      'Investment': 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      'Technology': 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
      'Legal': 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'
    };
    return colors[category] || 'bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric' 
    });
  };

  const FeaturedBlogCard = ({ post }) => {
    const imageUrl = ensureHttps(post.cover_image_url || '');
    const writer = post.writers_name || 'Unknown';
    
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 relative h-64 lg:h-80">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>
          <div className="lg:w-1/2 p-8 flex flex-col justify-center">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3">
              {post.summary}
            </p>
            {/* Tags row */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, idx) => {
                  const tagLabel = typeof tag === 'string' ? tag : (tag.name || tag.slug || tag.id || '');
                  return (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                      #{tagLabel}
                    </span>
                  );
                })}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center text-white font-semibold">
                  {writer.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{writer}</p>
                  <p className="text-sm text-gray-500">{formatDate(post.published_at)}</p>
                </div>
              </div>
              <div className="text-[#014d98] hover:text-[#3ab7b1] font-medium">
                <span className="flex items-center">
                  Read more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BlogCard = ({ post }) => {
    const imageUrl = ensureHttps(post.cover_image_url || post.image || '');
    const writer = post.writers_name || post.author || 'Unknown';
    const summary = post.summary || post.excerpt || '';
    const published = formatDate(post.published_at || post.date);
    const tags = Array.isArray(post.tags) ? post.tags : [];
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
          {/* Unique tags styling: vertical stack, top-left */}
          {tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {tags.map((tag, idx) => {
                const tagLabel = typeof tag === 'string' ? tag : (tag.name || tag.slug || tag.id || '');
                return (
                  <span key={idx} className="bg-[#014d98] text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-[#3ab7b1] transition-colors cursor-pointer">
                    #{tagLabel}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                {writer.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{writer}</p>
                <p className="text-xs text-gray-500">{published}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-[#014d98] hover:text-[#3ab7b1] font-medium text-sm">
              <span className="flex items-center">
                Read more
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            {post.reading_time && (
              <span className="text-xs text-gray-500">
                {post.reading_time} min read
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-16 text-center">
            <p className="text-[#014d98] font-medium text-sm uppercase tracking-wide mb-4">Blog</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover our <span className="text-blue-600">latest news</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore expert insights, market trends, and helpful tips to guide your real estate journey.
            </p>
          </div>
        </div>
        
        {/* Loading Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            {/* Featured skeleton */}
            <div className="bg-white rounded-lg mb-16 p-8">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 h-64 lg:h-80 bg-gray-200 rounded mb-4 lg:mb-0 lg:mr-8"></div>
                <div className="lg:w-1/2 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            
            {/* Grid skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Blogs</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!featuredPost && (!recentPosts || recentPosts.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Blogs Available</h2>
          <p className="text-gray-600">Check back later for new content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      {/* <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-[#014d98] font-medium text-sm uppercase tracking-wide mb-4">Blog</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover our <span className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent">latest news</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore expert insights, market trends, and helpful tips to guide your real estate journey.
          </p>
        </div>
      </div> */}

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Latest Blog Section */}
        {featuredPost && (
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Blog</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full" />
            </div>
            <Link href={`/blog/${featuredPost.slug}`}>
              <FeaturedBlogCard post={featuredPost} />
            </Link>
          </div>
        )}

        {/* All Blogs Section */}
        <div>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Blogs</h2>
            <p className="text-gray-600">Browse all our blog posts</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.slice(0, loadedPosts).map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.slug}>
                  <BlogCard post={post} />
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400 py-12">No more blogs yet.</div>
            )}
          </div>
          {recentPosts && loadedPosts < recentPosts.length && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:from-[#3ab7b1] hover:to-[#014d98] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;