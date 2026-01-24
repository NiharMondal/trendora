"use client";
import { useIsDesktop } from "@/hooks/use-mobile";
import { useAppSelector } from "@/redux/redux.hooks";
import { selectCartQuantity } from "@/redux/slice/cartSlice";
import DesktopNavbar from "./desktop-navbar";
import MobileNavbar from "./mobile-navbar";

export default function Navbar() {
    const cartQuantity = useAppSelector(selectCartQuantity);
    const isDesktop = useIsDesktop();

    return isDesktop ? (
        <DesktopNavbar cartQuantity={cartQuantity} />
    ) : (
        <MobileNavbar cartQuantity={cartQuantity} />
    );
}
