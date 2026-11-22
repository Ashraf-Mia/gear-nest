import Banner from "@/components/home/banner";
import Categories from "@/components/home/categories";
import FeaturedEquipment from "@/components/home/featured-equipment";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <FeaturedEquipment />
      <Categories />
      <h2>home page</h2>
    </div>
  );
};

export default HomePage;
