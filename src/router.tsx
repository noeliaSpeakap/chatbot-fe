import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import KBaseConfig from "./pages/k-base-config";
import Chatbot from "./pages/chatbot";
import Layout from "./layout";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="kBaseConfig" element={<KBaseConfig />} />
        <Route path="chatbot" element={<Chatbot />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
