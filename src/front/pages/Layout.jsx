import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                {/* El contenedor principal con padding superior e inferior para que respire */}
                <main className="flex-grow-1 py-4">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    );
};