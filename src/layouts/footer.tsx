import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { footerInfo, order, ourPolicies, shop } from "@/shared/constants/footer";
import { socialIcon } from "@/shared/constants/images";

import Container from "@/shared/components/container";

const linkColumns = [
    { title: "Shop", links: shop },
    { title: "Company", links: footerInfo },
    { title: "Policies", links: ourPolicies },
    { title: "Your Account", links: order },
];

const socials = [
    { label: "Facebook", href: "https://facebook.com", icon: socialIcon.facebook },
    { label: "Twitter", href: "https://twitter.com", icon: socialIcon.twitter },
    { label: "Instagram", href: "https://instagram.com", icon: socialIcon.instagram },
    { label: "YouTube", href: "https://youtube.com", icon: socialIcon.youtube },
];

export default function Footer() {
    return (
        <footer className="mt-16 bg-slate-950 text-slate-300">
            {/* Newsletter band */}
            <div className="border-b border-white/10">
                <Container className="flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-md space-y-1">
                        <h2 className="text-xl font-semibold text-white">
                            Get the latest drops first
                        </h2>
                        <p className="text-sm text-slate-400">
                            New arrivals, store launches and deals from across
                            the marketplace — straight to your inbox.
                        </p>
                    </div>

                    <div className="w-full max-w-md space-y-2">
                        <div className="flex items-center gap-x-3 rounded-full bg-white/5 px-4 ring-1 ring-white/15 transition focus-within:ring-primary-400">
                            <Mail
                                className="size-4 shrink-0 text-slate-400"
                                aria-hidden="true"
                            />
                            {/* No submit or API behind this yet (FE-38) — but a
                                field is still announced, so it needs a name. */}
                            <input
                                type="email"
                                aria-label="Email address for the newsletter"
                                autoComplete="email"
                                placeholder="Enter your e-mail"
                                className="h-11 w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                            />
                        </div>
                        <p className="px-4 text-xs text-slate-500">
                            By entering your email, you agree to our{" "}
                            <Link
                                href="/terms-and-conditions"
                                className="underline underline-offset-2 hover:text-slate-300"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy-policy"
                                className="underline underline-offset-2 hover:text-slate-300"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </Container>
            </div>

            {/* Brand + links */}
            <Container className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-12">
                <div className="space-y-5 lg:col-span-4">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/logo.png"
                            width={140}
                            height={48}
                            alt="Trendora home"
                            className="h-12 w-auto rounded-md"
                        />
                    </Link>
                    <p className="max-w-xs text-sm leading-relaxed text-slate-400">
                        One checkout, many independent stores. Discover fashion
                        and footwear from sellers you&apos;ll love.
                    </p>

                    <ul className="space-y-3 text-sm">
                        <li className="flex gap-3">
                            <MapPin
                                className="mt-0.5 size-4 shrink-0 text-primary-400"
                                aria-hidden="true"
                            />
                            <span>
                                2548 Broaddus Maple Court Avenue, Madisonville
                                KY 4783, USA
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone
                                className="size-4 shrink-0 text-primary-400"
                                aria-hidden="true"
                            />
                            <a
                                href="tel:+12345678901"
                                className="font-medium text-white hover:text-primary-300"
                            >
                                1–234–5678901
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Clock
                                className="size-4 shrink-0 text-primary-400"
                                aria-hidden="true"
                            />
                            <span>Mon–Sun: 9:00am – 9:00pm</span>
                        </li>
                    </ul>
                </div>

                <nav
                    aria-label="Footer"
                    className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8"
                >
                    {linkColumns.map((column) => (
                        <div key={column.title} className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                                {column.title}
                            </h3>
                            <ul className="space-y-2.5 text-sm">
                                {column.links.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            href={link.path}
                                            className="text-slate-400 transition-colors hover:text-primary-300"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </Container>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <Container className="flex flex-col-reverse items-center gap-4 py-6 text-sm text-slate-500 sm:flex-row sm:justify-between">
                    <p>
                        &copy; {new Date().getFullYear()} Trendora. All rights
                        reserved.
                    </p>
                    <ul className="flex items-center gap-2">
                        {socials.map((social) => (
                            <li key={social.label}>
                                <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Trendora on ${social.label}`}
                                    className="flex size-9 items-center justify-center rounded-full bg-white/90 transition hover:bg-primary-200"
                                >
                                    <Image
                                        src={social.icon}
                                        width={16}
                                        height={16}
                                        alt=""
                                        className="size-3.5"
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                </Container>
            </div>
        </footer>
    );
}
