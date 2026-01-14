"use client";
import React, { useEffect, useState } from "react";
import MobileNavbar from "./mobile-navbar";
import DesktopNavbar from "./desktop-navbar";

export default function Navbar() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile ? <MobileNavbar /> : <DesktopNavbar />;
}
