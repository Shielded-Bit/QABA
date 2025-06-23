"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

// Enhanced blog data with additional fields
const blogPosts = [
	{
		id: 1,
		title: "Real Estate in Southeastern Nigeria: Challenges, Opportunities, and How QARBA is Changing the Game",
		content: `The real estate landscape in Southeastern Nigeria is evolving rapidly. With growing urban centers like Abakaliki, Enugu, Owerri, Aba, and Awka, there's a rising demand for quality housing, commercial spaces, and investment opportunities.

The challenges in this region are multifaceted. Traditional property search methods often lead to frustration, with potential buyers and renters spending countless hours visiting unsuitable properties. The lack of centralized, reliable information makes it difficult for both property seekers and owners to connect effectively.

QARBA is at the forefront of this transformation, providing innovative solutions for buyers, sellers, and investors. Our platform ensures transparency, security, and ease of transaction, making real estate accessible to everyone.

Our comprehensive approach includes verified property listings, detailed property information, high-quality images, and direct communication channels between all parties. We understand that buying or renting property is one of life's biggest decisions, and we're committed to making this process as smooth and transparent as possible.

Whether you're looking to invest, buy, or sell, QARBA offers the tools and support you need to succeed in this dynamic market. From first-time homebuyers to seasoned investors, our platform caters to all segments of the market with tailored solutions and expert guidance.`,
		author: "NELSON MGBADA",
		date: "20th May 2024",
		category: "Featured News",
		image: "https://res.cloudinary.com/dqbbm0guw/image/upload/v1737723125/Rectangle_133_2_sblujb.png",
		readTime: "5 min read",
		tags: ["Real Estate", "Nigeria", "PropTech", "Investment"]
	},
	{
		id: 2,
		title: "SOMETHING BIG IS COMING: WHY SOUTHEASTERN NIGERIA NEEDS A REAL ESTATE REVOLUTION",
		content: `If you've ever tried renting an apartment in Enugu, buying land in Abakaliki, or even connecting with a trustworthy agent in Awka, then you already know real estate in Southeastern Nigeria isn't easy.

The current system is fragmented, with information scattered across multiple platforms, word-of-mouth recommendations, and outdated advertising methods. This creates inefficiencies that hurt both property seekers and property owners.

QARBA is building a platform to solve these challenges, connecting you with verified agents, listings, and resources. Our mission is to revolutionize how real estate transactions happen in this region.

We're developing cutting-edge technology that will streamline the entire process, from property discovery to final transaction. Our platform will feature advanced search capabilities, virtual property tours, secure payment systems, and comprehensive legal support.

The revolution is coming, and it will transform how people buy, sell, and rent properties across Southeastern Nigeria. Stay tuned for more updates as we prepare to launch this game-changing platform!`,
		author: "NELSON MGBADA",
		date: "20th May 2024",
		category: "Market Trends",
		image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
		readTime: "3 min read",
		tags: ["Revolution", "PropTech", "Innovation", "Nigeria"]
	},
	{
		id: 3,
		title: "INTRODUCING QARBA: A SMARTER WAY TO FIND, LIST, AND CONNECT IN REAL ESTATE",
		content: `Whether you're a landlord with vacant property, an agent managing multiple listings, a home seeker tired of endless inspections, or a first-time buyer looking for verified options, QARBA was built for you.

Our platform streamlines the process, offering smart search, secure transactions, and real support every step of the way. We understand that the traditional real estate process can be overwhelming and time-consuming.

QARBA's intelligent matching system uses advanced algorithms to connect property seekers with their ideal homes based on their specific requirements, budget, and preferences. No more wasting time on properties that don't match your criteria.

For property owners and agents, our platform provides powerful listing management tools, analytics to track property performance, and direct communication channels with serious buyers and renters.

We're not just another property listing site – we're your complete real estate partner, committed to making property transactions transparent, efficient, and successful for everyone involved.`,
		author: "NELSON MGBADA",
		date: "20th May 2024",
		category: "Product Update",
		image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
		readTime: "4 min read",
		tags: ["QARBA", "Platform", "Innovation", "Technology"]
	},
	{
		id: 4,
		title: "The Future of Real Estate: How Technology is Shaping the Market",
		content: `Technology is no longer a nice-to-have in real estate; it's a necessity. From virtual tours to blockchain transactions, tech is streamlining processes and opening new avenues for buyers and sellers alike.

At QARBA, we're leveraging the latest technology to offer you a seamless, secure, and efficient real estate experience. Join us as we explore the future of real estate.`,
		author: "NELSON MGBADA",
		date: "21st May 2024",
		category: "Technology",
		image: "https://images.unsplash.com/photo-1564869733680-6b8f8f8f8f8f?w=800&h=600&fit=crop",
		readTime: "6 min read",
		tags: ["Technology", "Future", "Innovation", "PropTech"]
	},
	{
		id: 5,
		title: "Investing in Southeastern Nigeria: A Guide for Foreign Investors",
		content: `Southeastern Nigeria is a land of opportunities, but navigating the real estate market can be challenging for foreign investors.

This guide provides you with the essential information and tips you need to invest wisely and successfully in Southeastern Nigeria's real estate market.`,
		author: "NELSON MGBADA",
		date: "22nd May 2024",
		category: "Investment",
		image: "https://images.unsplash.com/photo-1564869733680-6b8f8f8f8f8f?w=800&h=600&fit=crop",
		readTime: "8 min read",
		tags: ["Investment", "Foreign", "Guide", "Nigeria"]
	},
];

export default function BlogDetailPage({ params }) {
	const id = Number(params?.id);
	const post = blogPosts.find((p) => p.id === id);

	if (!post) {
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

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Image Section - Full Width */}
			<div className="relative w-full h-[70vh] overflow-hidden">
				<Image
					src={post.image}
					alt={post.title}
					fill
					className="object-cover"
					priority
				/>
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
								{post.readTime}
							</span>
						</div>
						<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4">
							{post.title}
						</h1>
						<div className="flex items-center gap-4 text-lg">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full flex items-center justify-center text-white font-bold">
									{post.author.split(' ').map(n => n[0]).join('')}
								</div>
								<div>
									<p className="font-semibold">{post.author}</p>
									<p className="text-white/80 text-base">{post.date}</p>
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
					{post.tags?.map((tag, index) => (
						<span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
							#{tag}
						</span>
					))}
				</div>

				{/* Article Content */}
				<div className="prose prose-lg max-w-none">
					<div className="text-gray-700 text-lg leading-relaxed space-y-6">
						{post.content.split('\n\n').map((paragraph, index) => (
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
							{post.author.split(' ').map(n => n[0]).join('')}
						</div>
						<div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
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
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent mb-4">
							Related Articles
						</h2>
						<p className="text-gray-600 text-lg">Discover more insights and expert analysis</p>
						<div className="w-20 h-1 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-full mx-auto mt-4" />
					</div>
					
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
							<Link href={`/blog/${related.id}`} key={related.id} className="group block">
								<div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
									<div className="relative h-48 overflow-hidden">
										<Image
											src={related.image}
											alt={related.title}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
										<div className="absolute top-4 left-4">
											<span className={`bg-gradient-to-r ${getCategoryColor(related.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
												{related.category}
											</span>
										</div>
									</div>
									<div className="p-6">
										<h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-[#014d98] transition-colors duration-300">
											{related.title}
										</h3>
										<p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
											{related.content.split('\n')[0]}
										</p>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2 text-xs text-gray-500">
												<span className="font-medium text-gray-700">{related.author}</span>
												<span>•</span>
												<span>{related.date}</span>
											</div>
											<div className="flex items-center gap-1 text-[#014d98] hover:text-[#3ab7b1] font-medium text-sm transition-colors duration-300">
												<span>Read</span>
												<svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</div>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>

					{/* CTA Section */}
					<div className="mt-16 text-center">
						<div className="bg-gradient-to-r from-[#014d98] to-[#3ab7b1] rounded-2xl p-8 text-white">
							<h3 className="text-2xl font-bold mb-4">Stay Updated with QARBA</h3>
							<p className="text-lg mb-6 opacity-90">Get the latest real estate insights and market trends delivered to your inbox</p>
							<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
								<input 
									type="email" 
									placeholder="Enter your email" 
									className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
								/>
								<button className="bg-white text-[#014d98] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
									Subscribe
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}