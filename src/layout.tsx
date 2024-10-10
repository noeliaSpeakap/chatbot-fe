import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/header";

const Layout: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="mt-16 flex flex-col items-center justify-center min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
