"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogDetailPage({ params }) {
	const { id: slug } = React.use(params);
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [relatedBlogs, setRelatedBlogs] = useState([]);

	useEffect(() => {
		const fetchBlogAndRelated = async () => {
			setLoading(true);
			setError(null);
			try {
				// Fetch the current blog
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/${slug}`);
				if (!res.ok) throw new Error("Blog not found");
				const data = await res.json();
				const blog = data.data || data;
				setPost(blog);

				// Fetch all blogs for related
				const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/`);
				if (!allRes.ok) throw new Error("Failed to fetch related blogs");
				const allData = await allRes.json();
				let blogs = allData.data || allData;

				// Get tags as array of strings
				const blogTags = (blog.tags || []).map(tag => typeof tag === 'string' ? tag : (tag.name || tag.slug || tag.id || ''));

				// Filter related blogs by shared tags, exclude current blog
				const related = blogs.filter(b => {
					if (b.slug === blog.slug) return false;
					const bTags = (b.tags || []).map(tag => typeof tag === 'string' ? tag : (tag.name || tag.slug || tag.id || ''));
					return bTags.some(tag => blogTags.includes(tag));
				}).slice(0, 3);
				setRelatedBlogs(related);
			} catch (err) {
				setError(err.message || "Failed to load blog post");
			} finally {
				setLoading(false);
			}
		};
		if (slug) fetchBlogAndRelated();
	}, [slug]);

	const getCategoryColor = (category) => {
		const colors = {
			'Featured News': 'from-[#014d98] to-[#3ab7b1]',
			'Market Trends': 'from-purple-500 to-pink-500',
			'Product Update': 'from-green-500 to-teal-500',
			'Investment': 'from-orange-500 to-red-500',
			'Technology': 'from-blue-500 to-indigo-500',
			'Legal': 'from-gray-600 to-gray-800'
		};
		return colors[category] || 'from-[#014d98] to-[#3ab7b1]';
	};

	function ensureHttps(url) {
		if (typeof url === 'string' && url.startsWith('http://')) {
			return url.replace('http://', 'https://');
		}
		return url;
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="animate-pulse w-full max-w-2xl mx-auto p-8">
					<div className="h-10 w-1/3 bg-gray-200 rounded mb-4" />
					<div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />
					<div className="h-6 w-1/4 bg-gray-200 rounded mb-4" />
					<div className="h-96 w-full bg-gray-200 rounded-xl mb-8" />
					<div className="h-32 w-full bg-gray-100 rounded mb-8" />
				</div>
			</div>
		);
	}
	if (error || !post) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
				<div className="text-center p-8">
					<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center">
						<svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m8 0a2 2 0 012 2v6.388a2 2 0 01-2 2H7a2 2 0 01-2-2V7.306a2 2 0 012-2z" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
					<p className="text-gray-600 mb-8 text-lg">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
					<Link href="/blog" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Blog
					</Link>
				</div>
			</div>
		);
	}

	// Use API fields
	const writer = post?.writers_name || 'Unknown';
	const abbreviation = writer.split(' ').map(n => n[0]).join('').toUpperCase();
	const imageUrl = ensureHttps(post?.cover_image_url || '');
	const publishedDate = post?.published_at ? new Date(post.published_at).toLocaleDateString() : '';

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Image Section - Full Width */}
			<div className="relative w-full h-[70vh] overflow-hidden">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={post.title}
						fill
						className="object-cover"
						priority
					/>
				) : (
					<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
				{/* Back Button */}
				<div className="absolute top-8 left-8 z-10">
					<Link href="/blog" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium hover:bg-white/20 transition-all duration-300">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Blog
					</Link>
				</div>
				{/* Article Info Overlay */}
				<div className="absolute bottom-0 left-0 right-0 p-8 text-white">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-center gap-4 mb-4">
							<span className={`bg-gradient-to-r ${getCategoryColor(post.category)} px-4 py-2 rounded-full text-sm font-semibold`}>
								{post.category}
							</span>
							<span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
								{post.reading_time ? `${post.reading_time} min read` : ''}
							</span>
						</div>
						<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4">
							{post.title}
						</h1>
						<div className="flex items-center gap-4 text-lg">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center text-white font-bold">
									{abbreviation}
								</div>
								<div>
									<p className="font-semibold">{writer}</p>
									<p className="text-white/80 text-base">{publishedDate}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Article Content */}
			<div className="max-w-4xl mx-auto px-6 py-16">
				{/* Tags */}
				<div className="flex flex-wrap gap-2 mb-8">
					{post.tags?.map((tag, index) => {
						const tagLabel = typeof tag === 'string' ? tag : (tag.name || tag.slug || tag.id || '');
						return (
							<span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
								#{tagLabel}
							</span>
						);
					})}
				</div>
				{/* Article Content */}
				<div className="prose prose-lg max-w-none">
					<div className="text-gray-700 text-lg leading-relaxed space-y-6">
						{post.content?.split('\n\n').map((paragraph, index) => (
							<p key={index} className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-[#014d98] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
								{paragraph}
							</p>
						))}
					</div>
				</div>
				{/* Share Section */}
				<div className="mt-12 pt-8 border-t border-gray-200">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<span className="text-gray-600 font-medium">Share this article:</span>
							<div className="flex gap-3">
								<button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
									</svg>
								</button>
								<button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
									</svg>
								</button>
								<button className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
									</svg>
								</button>
							</div>
						</div>
						<div className="flex items-center gap-2 text-gray-500">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
							<span className="text-sm">125 likes</span>
						</div>
					</div>
				</div>
				{/* Author Bio */}
				<div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
					<div className="flex items-start gap-4">
						<div className="w-16 h-16 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
							{abbreviation}
						</div>
						<div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">{writer}</h3>
							<p className="text-gray-600 mb-3">
								Real Estate Expert & Content Writer at QARBA. Passionate about transforming the Nigerian real estate landscape through technology and innovation.
							</p>
							<div className="flex gap-3">
								<button className="text-[#014d98] hover:text-[#3ab7b1] transition-colors">
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
									</svg>
								</button>
								<button className="text-[#014d98] hover:text-[#3ab7b1] transition-colors">
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Related Articles Section */}
			{relatedBlogs.length > 0 && (
				<div className="max-w-4xl mx-auto px-6 pb-16">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
					<div className="grid md:grid-cols-3 gap-8">
						{relatedBlogs.map((rel) => {
							const relImage = ensureHttps(rel.cover_image_url || rel.image || '');
							const relWriter = rel.writers_name || rel.author || 'Unknown';
							const relPublished = rel.published_at ? new Date(rel.published_at).toLocaleDateString() : '';
							const relTags = Array.isArray(rel.tags) ? rel.tags : [];
							return (
								<Link href={`/blog/${rel.slug}`} key={rel.slug} className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
									<div className="relative h-48">
										{relImage ? (
											<Image src={relImage} alt={rel.title} fill className="object-cover" />
										) : (
											<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
										)}
										{/* Tags: vertical stack, top-left */}
										{relTags.length > 0 && (
											<div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
												{relTags.map((tag, idx) => {
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
									<div className="p-4">
										<div className="flex items-center gap-3 mb-2">
											<div className="w-8 h-8 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center text-white font-semibold text-xs">
												{relWriter.split(' ').map(n => n[0]).join('').toUpperCase()}
											</div>
											<div>
												<p className="text-sm font-medium text-gray-900">{relWriter}</p>
												<p className="text-xs text-gray-500">{relPublished}</p>
											</div>
										</div>
										<h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{rel.title}</h3>
										<p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">{rel.summary || rel.excerpt || ''}</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}