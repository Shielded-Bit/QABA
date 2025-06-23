"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      featured: true,
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "SOMETHING BIG IS COMING: WHY SOUTHEASTERN NIGERIA NEEDS A REAL ESTATE REVOLUTION",
      excerpt: "If you've ever tried renting an apartment in Enugu, buying land in Abakaliki, or even connecting with a trustworthy agent in Awka, then you already know real estate in Southeastern Nigeria isn't easy.",
      author: "NELSON MGBADA",
      date: "20th May 2024",
      category: "Market Trends",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      featured: false,
      readTime: "3 min read"
    },
    {
      id: 3,
      title: "INTRODUCING QARBA: A SMARTER WAY TO FIND, LIST, AND CONNECT IN REAL ESTATE",
      excerpt: "Whether you're a landlord with vacant property, an agent managing multiple listings, a home seeker tired of endless inspections, or a first-time buyer looking for verified options, QARBA was built for you.",
      author: "NELSON MGBADA",
      date: "20th May 2024",
      category: "Product Update",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      featured: false,
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "Investment Opportunities in Enugu Real Estate Market",
      excerpt: "Exploring the growing investment potential in Enugu's real estate sector, from residential developments to commercial properties.",
      author: "NELSON MGBADA",
      date: "15th May 2024",
      category: "Investment",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
      featured: false,
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "The Future of PropTech in Nigeria",
      excerpt: "How technology is transforming the real estate landscape in Nigeria and what it means for buyers, sellers, and agents.",
      author: "NELSON MGBADA",
      date: "10th May 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      featured: false,
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "Understanding Property Laws in Southeast Nigeria",
      excerpt: "A comprehensive guide to property acquisition, documentation, and legal requirements in Southeastern Nigeria.",
      author: "NELSON MGBADA",
      date: "5th May 2024",
      category: "Legal",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      featured: false,
      readTime: "8 min read"
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const recentPosts = blogPosts.filter(post => !post.featured);

  const handleLoadMore = () => {
    setLoadedPosts(prev => Math.min(prev + 3, recentPosts.length));
  };

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

  const BlogCard = ({ post, featured = false }) => (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${featured ? 'lg:flex lg:items-center lg:gap-0' : ''}`}>
      <div className={`relative overflow-hidden ${featured ? 'lg:w-3/5 h-64 lg:h-96' : 'h-56'}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-6 left-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {post.readTime}
            </span>
          </div>
        </div>
      </div>
      
      <div className={`p-8 ${featured ? 'lg:w-2/5' : ''}`}>
        <h3 className={`font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[#014d98] transition-colors duration-300 ${featured ? 'text-2xl lg:text-3xl leading-tight' : 'text-xl'}`}>
          {post.title}
        </h3>
        
        <p className={`text-gray-600 mb-6 line-clamp-3 leading-relaxed ${featured ? 'text-lg' : 'text-base'}`}>
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-8 h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-medium text-gray-700">{post.author}</p>
              <p className="text-xs">{post.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#014d98] hover:text-[#3ab7b1] font-medium text-sm transition-colors duration-300">
            <span>Read more</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section with Enhanced Styling */}
      <div className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#014d98]/5 to-[#3ab7b1]/5" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#014d98]/10 to-[#3ab7b1]/10 text-[#014d98] font-semibold text-sm uppercase tracking-wide rounded-full border border-[#014d98]/20">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              </svg>
              Blog
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-6 leading-tight">
            Discover Real Estate Insights
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Explore expert insights, market trends, and helpful tips to guide your real estate journey in Southeastern Nigeria.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Updated weekly</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Expert verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Article with Enhanced Styling */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Article</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full" />
          </div>
          <Link href={`/blog/${featuredPost.id}`} className="block">
            <BlogCard post={featuredPost} featured={true} />
          </Link>
        </section>
      )}

      {/* Recent Blogs Section with Grid Enhancement */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Latest Insights
          </h2>
          <p className="text-gray-600 text-lg">
            Stay informed with our latest real estate insights and market analysis
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full mt-4" />
        </div>

        {/* Enhanced Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recentPosts.slice(0, loadedPosts).map((post, index) => (
            <Link href={`/blog/${post.id}`} key={post.id} className="block">
              <div className={`${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <BlogCard post={post} />
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced Load More Button */}
        {loadedPosts < recentPosts.length && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] hover:from-[#3ab7b1] hover:to-[#014d98] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Load More Articles</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPage;