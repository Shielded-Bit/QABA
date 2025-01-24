'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules'; // Include Autoplay for smooth transitions
import 'swiper/css';
import 'swiper/css/pagination';

const Section6 = () => {
  const articles = [
    {
      date: 'August 6, 2024',
      title: 'Technological Advancements In Farming?',
      description:
        'Discover the latest in farming technology, including precision agriculture, vertical farming, and smart farming, leading the way to a sustainable and efficient...',
      image:
        'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734115764/What_Are_The_Latest_Technological_Advancements_In_Farming__1_s9rwge.png',
      link: '#',
    },
    {
      date: 'August 6, 2024',
      title: 'Technician Farmer Use WIFI Computer Control Agriculture',
      description:
        'Photo about Technician farmer use wifi computer control agriculture drone fly to sprayed fertilizer on the corn fields...',
      image:
        'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734115758/Technician_Farmer_Use_Wifi_Computer_Control_Agriculture_Drone_Stock_Photo_-_Image_of_engineer_flying__100275932_1_poddox.png',
      link: '#',
    },
    {
      date: 'August 6, 2024',
      title: 'Tractor spray fertilize field with insecticide herbicide chemicals',
      description:
        'Tractor spray fertilize field with insecticide herbicide chemicals in agriculture field...',
      image:
        'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734115758/Technician_Farmer_Use_Wifi_Computer_Control_Agriculture_Drone_Stock_Photo_-_Image_of_engineer_flying__100275932_1_poddox.png',
      link: '#',
    },
  ];

  return (
    <section className="bg-[#efe4da] py-16 px-6 md:px-12">
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
        speed={1000} // Smooth slide transition in milliseconds
        autoplay={{
          delay: 4000, // Adjust autoplay delay to 4 seconds
          disableOnInteraction: false, // Keeps autoplay running after interaction
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
        modules={[Pagination, Autoplay]} // Include Autoplay module
      >
        {articles.map((article, index) => (
          <SwiperSlide
            key={index}
            className="transition-all duration-700 ease-in-out animate-fadeIn"
          >
            {/* Article Card */}
            <div className="flex flex-col">
              {/* Image */}
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

              {/* Article Content */}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-3 mt-3">{article.date}</p>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{article.title}</h3>
                <p className="text-gray-600 line-clamp-2">{article.description}</p>
                <a
                  href={article.link}
                  className="font-medium hover:underline block mt-2"
                >
                  Read More
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Section6;
