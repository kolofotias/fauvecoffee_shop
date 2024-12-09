// src/pages/About.js
import React from 'react';

function About() {
  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light mb-12">About Us</h1>
        
        <img 
          src="/placeholder.jpg"
          alt="Founder"
          className="w-full mb-12"
        />
        
        <div className="space-y-6 opacity-70">
          <p>
            Founded in 2022 by Sarah Weber, Fauve Coffee began as a passion project 
            in a small corner of Prenzlauer Berg. After years of experience in 
            specialty coffee shops across Melbourne and Berlin, Sarah decided to 
            bring her unique perspective on coffee to the streets of Berlin.
          </p>
          
          <p>
            The name "Fauve" draws inspiration from the early 20th-century art 
            movement known for its bold, unconventional use of color - much like 
            our approach to coffee roasting and brewing.
          </p>

          <p>
            Our commitment to quality extends beyond just coffee. We believe in 
            building a sustainable coffee ecosystem, working directly with farmers 
            and paying above fair-trade prices for our beans. Every cup we serve 
            from our mobile coffee van and every bag of beans we roast carries 
            this commitment to excellence and sustainability.
          </p>

          <p>
            Today, you can find our coffee van at various locations throughout Berlin,
            serving carefully crafted beverages to coffee enthusiasts. Our roastery
            in Prenzlauer Berg continues to push boundaries, experimenting with new
            roasting profiles and sourcing unique beans from around the world.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;