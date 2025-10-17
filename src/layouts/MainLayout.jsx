import React from "react";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default MainLayout;
