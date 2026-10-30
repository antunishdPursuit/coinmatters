import React from 'react'
import { Link } from "react-router-dom";

import FeatureCard from '../components/featureCard/FeatureCard';
import featureCard1 from '../components/featureCard/featurecard1.jpg';
import featureCard2 from '../components/featureCard/featurecard2.jpg';
import featureCard3 from '../components/featureCard/featurecard3.jpg';
import './Home.css';

function Home() {
  return (
    <div className="landing">
      <div className="hero-image">
        <div className='landing-headline-box'>
          <p className="landing-headline">Save Time. Save Money. Shop Smart.</p>
        </div>
        <div className="landing-cta">
          <Link className="landing-cta-button" to="/search">Start Saving</Link>
        </div>
      </div>
      <div className="landing-features">
        <FeatureCard 
          imgUrl={featureCard1}
          title='Find the best deals'
          text='Use our search tool to look up grocery items using your zip code to find groceries near you'
          buttonText='Best Deals'
        />
        <FeatureCard
          imgUrl={featureCard2}
          title='Maximize your savings'
          text='Compare product prices across stores.  Like product information, store location, and product availability.'
          buttonText='Maximize Savings'
        />
        <FeatureCard 
          imgUrl={featureCard3}
          title='Personalize your shopping'
          text='Create and save lists of your most sought out items. Ready to be repurchased whenever you need.'
          buttonText='Ready to Save'
        />
      </div>
    </div>
  )
}

export default Home