import React from "react";
import Navigation from "./navigation";

const Header: React.FC = () => {
  return (
    <div className="flex items-center gap-12">
      <Navigation />
    </div>
  );
};

export default Header;
