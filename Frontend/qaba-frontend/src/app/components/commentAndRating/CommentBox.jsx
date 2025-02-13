import { useState } from "react";

export default function CommentBox() {
  const [rating, setRating] = useState(0);
  const handleRating = (value) => setRating(value);

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-gray-900 mb-2">Your comment</h4>
      <div className="flex items-center gap-4">
        <textarea
          className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add a comment ..."
          rows="2"
        ></textarea>
        <button className="bg-gradient-to-r from-blue-700 to-teal-500 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:opacity-90">
          Save
        </button>
      </div>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => handleRating(star)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={star <= rating ? "url(#grad1)" : "none"}
            stroke="black"
            strokeWidth="2"
            className="w-6 h-6 cursor-pointer transition-all"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" style={{ stopColor: "#1e3a8a", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#14b8a6", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17.75l-4.03 2.39a.75.75 0 01-1.12-.79l.77-4.49-3.26-3.19a.75.75 0 01.41-1.28l4.51-.66 2.02-4.08a.75.75 0 011.34 0l2.02 4.08 4.51.66a.75.75 0 01.41 1.28l-3.26 3.19.77 4.49a.75.75 0 01-1.12.79L12 17.75z"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
