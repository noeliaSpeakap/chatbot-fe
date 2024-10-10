// src/navigation.tsx
import React from "react";
import { Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const NavigationBar: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center fixed top-0 left-0  z-10">
      <NavigationMenu className="w-full max-w-3xl flex justify-center">
        <NavigationMenuList className="flex justify-center gap-4 text-xl">
          <NavigationMenuItem>
            <Link to="/" className="px-6 py-2">
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/chatbot" className="px-6 py-2">
              Chatbot
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/kBaseConfig" className="px-6 py-2">
              Knowledge Base Configuration
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavigationBar;

<nav className="w-full flex justify-center items-center fixed top-0 left-0 bg-white shadow-md z-10">
  <NavigationMenu className="w-full max-w-3xl">
    <NavigationMenuList className="flex justify-center gap-4 text-xl">
      <NavigationMenuItem>
        <Link to="/" className="px-6 py-2">
          Home
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link to="/chatbot" className="px-6 py-2">
          Chatbot
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link to="/kBaseConfig" className="px-6 py-2">
          Knowledge Base Configuration
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</nav>;
