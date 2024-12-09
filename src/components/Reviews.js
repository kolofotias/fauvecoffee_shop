import React from 'react';
import { Star } from 'lucide-react';

function Reviews() {
  const reviews = [
    {
      id: 1,
      author: "Sarah K.",
      rating: 5,
      date: "March 15, 2024",
      content: "Absolutely love this coffee! The floral notes are perfect for my morning brew.",
    },
    {
      id: 2,
      author: "Michael R.",
      rating: 4,
      date: "March 10, 2024",
      content: "Great balance of flavors. Would definitely buy again.",
    },
    // Add more reviews as needed
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-current' : 'opacity-30'
        }`} 
      />
    ));
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-light mb-8">Customer Reviews</h2>
      <div className="space-y-8">
        {reviews.map(review => (
          <div key={review.id} className="animate-slide-up">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex">
                {renderStars(review.rating)}
              </div>
              <span className="opacity-70">•</span>
              <span className="opacity-70">{review.date}</span>
            </div>
            <p className="font-medium mb-2">{review.author}</p>
            <p className="opacity-70">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
