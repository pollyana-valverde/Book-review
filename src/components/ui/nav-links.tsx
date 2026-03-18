"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import Link from "next/link";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

function NavLink({ href, children, className, ...props }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "hover:underline flex items-center rounded-xl px-3 py-1.5 transition-colors duration-200",
        pathname === href && "bg-white text-gray-900 hover:no-underline",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export { NavLink };
