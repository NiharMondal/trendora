import Link from "next/link";
import { Fragment } from "react";

import { cn } from "@/shared/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";

export type TBreadcrumbItem = {
    label: string;
    /** Omit for the current page, which renders as plain text. */
    href?: string;
};

type Props = {
    /** A falsy entry is skipped, so an optional crumb can be written inline. */
    items: (TBreadcrumbItem | false | null | undefined)[];
    /** Prepends a "Home" link to `/`. */
    withHome?: boolean;
    className?: string;
};

/**
 * Trail of links above a page, built from a flat list:
 *
 *   <PageBreadcrumb items={[
 *     { label: "Products", href: "/products" },
 *     { label: product.name },
 *   ]} />
 *
 * The last item is the current page (`aria-current="page"`) and is truncated
 * rather than wrapped, so a long product name cannot push the trail onto
 * several lines. A crumb whose data may be missing is written inline as
 * `category && { label: category.name, href: ... }` and dropped when falsy.
 */
export default function PageBreadcrumb({
    items,
    withHome = true,
    className,
}: Props) {
    const crumbs = items.filter((item): item is TBreadcrumbItem => !!item);
    const trail = withHome ? [{ label: "Home", href: "/" }, ...crumbs] : crumbs;
    if (trail.length === 0) return null;

    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {trail.map((item, index) => {
                    const isLast = index === trail.length - 1;
                    return (
                        <Fragment key={`${item.label}-${index}`}>
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem className={cn(isLast && "min-w-0")}>
                                {isLast || !item.href ? (
                                    <BreadcrumbPage className={cn(isLast && "truncate")}>
                                        {item.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href}>{item.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
