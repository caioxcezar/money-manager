"use client";
import React from "react";
import Page from "@/components/page";
import dynamic from "next/dynamic";
const Pie = dynamic(() => import("@/modules/pie"), { ssr: false });
const Home = () => {
  return (
    <Page>
      <Pie />
    </Page>
  );
};
export default Home;
