import React, { useState } from 'react';
import { X } from 'lucide-react';

function ImageGallery({ images }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="aspect-square">
        <img 
          src={mainImage} 
          alt="Product"
          className="w-full h-full object-cover animate-fade-in"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setMainImage(image)}
            className={`aspect-square ${
              mainImage === image ? 'ring-2 ring-offset-2' : 'opacity-70 hover:opacity-100'
            } transition-all`}
          >
            <img 
              src={image} 
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;