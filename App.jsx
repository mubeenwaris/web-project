import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./Components/MyNavbar";
import Login from "./Components/Pages/Login";
import Signup from "./Components/Pages/Signup";
import FAQ from "./Components/Pages/FAQ";
import AboutUs from "./Components/Pages/AboutUs";
import Search from "./Components/Search";
import RawMaterialList from "./Components/RawMaterialList";
import Footer from "./Components/Pages/Footer";
import AddPost from "./Components/Pages/AddPost";
import VendorDashboard from "./Components/Pages/VendorDashboard";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  const [searchFilters, setSearchFilters] = useState(null);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  return (
    <Router>
      <MyNavbar />
      <Routes>
        {/* Homepage route: Search component and RawMaterialList below it */}
        <Route
          path="/"
          element={
            <>
              {/* Search component */}
              <Search onSearch={handleSearch} />

              {/* Raw Material List component */}
              <RawMaterialList searchFilters={searchFilters} />
              <Footer/>
            </>
          }
        />

        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected vendor routes */}
        <Route
          path="/vendor-dashboard"
          element={
            <PrivateRoute>
              <VendorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-post"
          element={
            <PrivateRoute>
              <AddPost />
            </PrivateRoute>
          }
        />

        {/* Other routes */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/AboutUs" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
