'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Section6 = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        const blogs = data.data || data;
        // Sort by date and get latest 3
        const latestBlogs = blogs
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
          .slice(0, 3)
          .map(blog => ({
            date: new Date(blog.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            title: blog.title,
            description: blog.summary || blog.excerpt || '',
            image: blog.cover_image_url,
            link: `/blog/${blog.slug}`
          }));
        setArticles(latestBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Fallback to empty array if fetch fails
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  return (
    <section className="bg-[#efe4da] py-16 px-2 md:px-14">
      {/* Section Heading */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Latest Updates From{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#014d98] to-[#3ab7b1]">
            QABA
          </span>
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Stay informed with the latest trends, offers, and updates from BUY HOMES. Discover new
          property listings, expert tips, and exclusive deals tailored just for you.
        </p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        speed={1000}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[Pagination, Autoplay]}
      >
        {loading ? (
          // Loading placeholders
          [...Array(3)].map((_, index) => (
            <SwiperSlide key={index} className="transition-all duration-700 ease-in-out animate-pulse">
              <div className="flex flex-col px-2">
                <div className="relative w-full h-80 bg-gray-200 rounded-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 w-1/4 rounded mb-3 mt-3"></div>
                  <div className="h-6 bg-gray-200 w-3/4 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 w-full rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 w-1/4 rounded mt-2"></div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <SwiperSlide
              key={index}
              className="transition-all duration-700 ease-in-out animate-fadeIn"
            >
              <div className="flex flex-col px-2">
                <div className="relative w-full h-80">
                  <Image
                    src={article.image}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL={`${article.image}?w=10&h=10&q=10`}
                    className="rounded-lg"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-3 mt-3">{article.date}</p>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{article.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{article.description}</p>
                  <Link
                    href={article.link}
                    className="font-medium hover:underline block mt-2 text-[#014d98]"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          // No articles fallback
          <SwiperSlide className="transition-all duration-700 ease-in-out">
            <div className="flex flex-col px-2">
              <div className="p-4 text-center text-gray-500">
                No articles available at the moment.
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </section>
  );
};

export default Section6;
