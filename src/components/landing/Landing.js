import React from "react"; 
import Banner from "./Home/Banner";
import Features from "./Home/Features"; 
import CallToAction from "./Home/CallToAction"; 
import Pricing from "./Home/Pricing"; 
import Counter from "./Home/Counter"; 
import Subscribe from "./Home/Subscribe"; 

function Landing() {
  return (
    <div className="page-wrapper">
      <Banner />
      <CallToAction />
      <Features />
      <Pricing />  
      <Counter /> 
      <Subscribe />
    </div>
  );
}

export default Landing;
