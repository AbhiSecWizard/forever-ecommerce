import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import { Route, Routes } from "react-router-dom";

import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";

import { useEffect, useState } from "react";
import Login from "./components/Login";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const currency = '$'
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">

      <ToastContainer />

      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          {/* Navbar */}
          <Navbar setToken={setToken} />

          <hr />

          {/* Sidebar + Main Content */}
          <div className="flex w-full">

            {/* Sidebar */}
            <Sidebar />

            {/* Page Content */}
            <div className="flex-1 px-6 py-8 text-gray-600">

              <Routes>

                <Route
                  path="/add"
                  element={<Add token={token} />}
                />

                <Route
                  path="/list"
                  element={<List token={token} />}
                />

                <Route
                  path="/orders"
                  element={<Orders token={token} />}
                />

              </Routes>

            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default App;