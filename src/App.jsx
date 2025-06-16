import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/Layout";
import { routes } from "@/config/routes";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
        progressStyle={{
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
        }}
      />
    </BrowserRouter>
  );
}

export default App;