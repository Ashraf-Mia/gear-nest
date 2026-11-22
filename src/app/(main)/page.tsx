import Banner from "@/components/home/banner";
import Categories from "@/components/home/categories";
import FeaturedEquipment from "@/components/home/featured-equipment";
import HowItWorks from "@/components/home/how-it-works";
import Reviews from "@/components/home/reviews";
import WhyChooseUs from "@/components/home/why-choose-us";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <FeaturedEquipment />
      <Categories />
      <HowItWorks />
      <WhyChooseUs />
      <Reviews />
    </div>
  );
};

export default HomePage;
