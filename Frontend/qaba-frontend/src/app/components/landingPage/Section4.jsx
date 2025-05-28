'use client';

import { useState } from 'react';
import Button from '../shared/Button';

const FAQs = [
	{
		question: 'How can I list my property for sale or rent?',
		answer: 'You can list your property by signing up on our platform and filling out the property details on the "List a Property" page.',
	},
	{
		question: 'What types of homes do you offer?',
		answer: 'We offer a wide variety of homes, including apartments, villas, townhouses, and more.',
	},
	{
		question: 'Are the properties verified before being listed?',
		answer: 'Yes, every property is verified by our team to ensure the accuracy of the information provided.',
	},
	{
		question: 'What financing options are available?',
		answer: 'When buying a home, you have the option to pay in full upfront or finance the purchase by making a down payment and borrowing the remaining balance through a mortgage or other financing options.',
	},
];

const Section4 = () => {
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="w-full mx-auto my-16 px-6 sm:px-14">
			<h2 className="text-4xl font-extrabold text-left mb-12 bg-gradient-to-r from-[#014d98] to-[#3ab7b1] bg-clip-text text-transparent leading-tight">
				Frequently Asked Questions (FAQs)
			</h2>
			<div className="space-y-6">
				{FAQs.map((faq, index) => (
					<div
						key={index}
						className={`border rounded-xl shadow-lg ${
							openIndex === index ? 'bg-gray-100' : 'bg-white'
						}`}
					>
						<button
							className="w-full flex items-center justify-between px-8 py-6 text-left text-gray-600 font-medium text-2xl focus:outline-none"
							onClick={() => toggleFAQ(index)}
						>
							<span>{faq.question}</span>
							<span className="text-3xl">
								{openIndex === index ? '−' : '+'}
							</span>
						</button>
						{openIndex === index && (
							<div className="px-8 pb-6 text-gray-700 text-lg">
								{faq.answer}
							</div>
						)}
					</div>
				))}

				<div className="mb-16 text-center">
					<h2 className="text-3xl font-bold mb-4 mt-20">
						Still have questions?
					</h2>
					<p className="text-gray-600 mb-6">
						We&apos;re here to assist you with anything you need.
					</p>
					<Button
						label="Contact"
						bgColor="white" // White background
						className="w-28 h-12 "
					/>
				</div>
			</div>
		</section>
	);
};

export default Section4;