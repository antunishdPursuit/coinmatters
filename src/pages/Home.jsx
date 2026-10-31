import React from 'react'
import { Link } from "react-router-dom";

import FeatureCard from '../components/featureCard/FeatureCard';
import featureCard1 from '../components/featureCard/featurecard1.jpg';
import featureCard2 from '../components/featureCard/featurecard2.jpg';
import featureCard3 from '../components/featureCard/featurecard3.jpg';
import { AuthData } from "../context/GetUser";
import './Home.css';

function Home() {
  const { loggedIn } = AuthData();

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-card">
          <span className="hero-stores">Compare CTown, Target and Walmart</span>
          <h1>Save time. Save money. Shop smart.</h1>
          <p>Build your grocery list, enter your ZIP code and see which nearby store is cheapest.</p>
          <div className="hero-actions">
            <Link className="button-primary" to="/search">Start saving</Link>
            {!loggedIn && <Link className="button-outline" to="/register">Create an account</Link>}
          </div>
        </div>
      </section>
      <section className="landing-features" aria-label="What CoinMatters does">
        <FeatureCard
          imgUrl={featureCard1}
          imgAlt="Row of shopping carts"
          title='Find the best deals'
          text='Look up groceries by ZIP code across stores near you.'
        />
        <FeatureCard
          imgUrl={featureCard2}
          imgAlt="Fresh vegetables"
          title='Maximize your savings'
          text='Compare product prices across stores, with product details and availability.'
        />
        <FeatureCard
          imgUrl={featureCard3}
          imgAlt="Shopper taking an item off a store shelf"
          title='Personalize your shopping'
          text='Save the lists you buy most, ready to reuse anytime.'
        />
      </section>
    </div>
  )
}

export default Home
