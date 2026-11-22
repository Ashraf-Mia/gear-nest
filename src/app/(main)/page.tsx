import Banner from "@/components/home/banner";
import Categories from "@/components/home/categories";
import FeaturedEquipment from "@/components/home/featured-equipment";
import HowItWorks from "@/components/home/how-it-works";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <FeaturedEquipment />
      <Categories />
      <HowItWorks />
    </div>
  );
};

export default HomePage;
