"use client";
import React, { useState } from "react";
import Page from "@/components/page";
import dynamic from "next/dynamic";
import Dropdown from "@/components/dropdown";
import Total from "@/components/total";
const Pie = dynamic(() => import("@/components/pie"), { ssr: false });

const Home = () => {
  const [option, setOption] = useState("monthly");
  return (
    <Page>
      <Dropdown
        className="mb-2"
        options={[
          { id: 1, value: "monthly" },
          { id: 2, value: "yearly" },
        ]}
        value={option}
        onChange={(value) => setOption(value == 1 ? "monthly" : "yearly")}
      />
      <Total period={option} />
      <Pie period={option} />
    </Page>
  );
};
export default Home;
