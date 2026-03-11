"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Text } from "./text";
import Link from "next/link";

const links = [
  {
    label: "Todos",
    href: "/books",
  },
  {
    label: "Albuns",
    href: "/albuns",
  },
];

function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 items-center">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={cn(
            "hover:underline rounded-md px-3 py-1.5 transition-colors duration-200",
            pathname === link.href &&
              "bg-white text-gray-900 hover:no-underline",
          )}
        >
          <Text>{link.label}</Text>
        </Link>
      ))}
    </div>
  );
}

export { NavLinks };
