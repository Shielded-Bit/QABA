"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const BlogPage = () => {
  const [loadedPosts, setLoadedPosts] = useState(3);

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Real Estate in Southeastern Nigeria: Challenges, Opportunities, and How QARBA is Changing the Game",
      excerpt: "The real estate landscape in Southeastern Nigeria is evolving rapidly. With growing urban centers like Abakaliki, Enugu, Owerri, Aba, and Awka, there's a rising demand for quality housing, commercial spaces, and investment opportunities.",
      author: "NELSON MGBADA",
      date: "20th May 2024",
      category: "Featured News",
      image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png",
      featured: true
    },
    {
      id: 2,
      title: "SOMETHING BIG IS COMING: WHY SOUTHEASTERN NIGERIA NEEDS A REAL ESTATE REVOLUTION",
      excerpt: "If you've ever tried renting an apartment in Enugu, buying land in Abakaliki, or even connecting with a trustworthy agent in Awka, then you already know real estate in Southeastern Nigeria isn't easy.",
      author: "NELSON MGBADA",
      date: "20th May 2024",
      category: "Market Trends",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "INTRODUCING QARBA: A SMARTER WAY TO FIND, LIST, AND CONNECT IN REAL ESTATE",
      excerpt: "Whether you're a landlord with vacant property, an agent managing multiple listings, a home seeker tired of endless inspections, or a first-time buyer looking for verified options, QARBA was built for you.",
      author: "NELSON MGBADA",
      date: "20th May 2024",
      category: "Product Update",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      featured: false
    },
    {
      id: 4,
      title: "Investment Opportunities in Enugu Real Estate Market",
      excerpt: "Exploring the growing investment potential in Enugu's real estate sector, from residential developments to commercial properties.",
      author: "NELSON MGBADA",
      date: "15th May 2024",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "The Future of PropTech in Nigeria",
      excerpt: "How technology is transforming the real estate landscape in Nigeria and what it means for buyers, sellers, and agents.",
      author: "NELSON MGBADA",
      date: "10th May 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      featured: false
    },
    {
      id: 6,
      title: "Understanding Property Laws in Southeast Nigeria",
      excerpt: "A comprehensive guide to property acquisition, documentation, and legal requirements in Southeastern Nigeria.",
      author: "NELSON MGBADA",
      date: "5th May 2024",
      category: "Legal",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      featured: false
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const recentPosts = blogPosts.filter(post => !post.featured);

  const handleLoadMore = () => {
    setLoadedPosts(prev => Math.min(prev + 3, recentPosts.length));
  };

  const BlogCard = ({ post, featured = false }) => (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${featured ? 'lg:flex lg:items-center lg:gap-8' : ''}`}>
      <div className={`relative ${featured ? 'lg:w-1/2 h-64 lg:h-80' : 'h-48'}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className={`p-6 ${featured ? 'lg:w-1/2' : ''}`}>
        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${featured ? 'text-2xl lg:text-3xl' : 'text-lg'}`}>
          {post.title}
        </h3>
        
        <p className={`text-gray-600 mb-4 line-clamp-3 ${featured ? 'text-base' : 'text-sm'}`}>
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-teal-600">{post.author}</span>
            <span className="mx-2">•</span>
            <span>{post.date}</span>
          </div>
          <button className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1">
            Read more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="mb-4">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wide">
              Blog
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover our latest news
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore expert insights, market trends, and helpful tips to guide your real estate journey.
          </p>
        </div>
      </div>

      {/* Featured Article */}
      {featuredPost && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <BlogCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Recent Blogs Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Our recent blogs
          </h2>
          <p className="text-gray-600">
            Stay informed with our latest insight
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recentPosts.slice(0, loadedPosts).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Button */}
        {loadedPosts < recentPosts.length && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPage;