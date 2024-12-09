import React from 'react';
import { Instagram } from 'lucide-react';

function InstagramFeed() {
  // Mock Instagram posts - replace images with your actual content
  const instagramPosts = [
    {
      id: 1,
      image: "/placeholder.jpg",
      likes: 124,
      caption: "Morning brew perfection ☕️ #FauveCoffee #BerlinCoffee"
    },
    {
      id: 2,
      image: "/placeholder.jpg",
      likes: 89,
      caption: "Our coffee van spotted at Mauerpark today! 🚐 #CoffeeVan"
    },
    {
      id: 3,
      image: "/placeholder.jpg",
      likes: 156,
      caption: "Fresh roast day! 🌱 #SpecialtyCoffee #FreshRoasted"
    },
    {
      id: 4,
      image: "/placeholder.jpg",
      likes: 201,
      caption: "Latte art of the day 🎨 #LatteArt #BaristaLife"
    }
  ];

  return (
    <div className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-4">Follow Us on Instagram</h2>
          <a 
            href="https://www.instagram.com/fauvecoffee/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-lg opacity-70 hover:opacity-100 transition-opacity"
          >
            <Instagram className="h-5 w-5" />
            <span>@fauvecoffee</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map(post => (
            <a
              key={post.id}
              href="https://www.instagram.com/fauvecoffee/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden"
            >
              <img 
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                  <p className="text-sm mb-2">{post.caption}</p>
                  <div className="flex items-center justify-center space-x-1">
                    <span>❤️</span>
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/fauvecoffee/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-current hover:opacity-70 transition-opacity text-sm tracking-wider uppercase"
          >
            View More on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

export default InstagramFeed;