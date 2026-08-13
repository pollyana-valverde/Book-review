import Link from "next/link";
import { LibraryBigIcon } from "lucide-react";

import { NavLink } from "../ui/nav-links";
import { Text } from "../ui/text";
import { SignOutButton } from "@/features/auth";

import { NAVLINKS } from "@/utils/nav-links";

function Navbar({ user }: { user: { name: string } }) {
  return (
    <nav
      className={`
    hidden
    fixed top-0 left-0 right-0
    md:flex items-center
    bg-white text-muted-foreground border-b border-separate
    py-2 px-5 mt-2 mb-4 mx-auto w-[99%]
    `}
    >
      <Link href="/" className="flex-1 flex items-center gap-2 text-foreground">
        <LibraryBigIcon className="w-5.5 h-5.5" />
        <Text variant="heading-2">BookReview</Text>
      </Link>

      <div className="flex gap-2 items-center">
        {NAVLINKS.map((link, index) => (
          <NavLink key={index} href={link.href}>
            <link.icon className="mr-1.5 w-4 h-4" />
            <Text>{link.label}</Text>
          </NavLink>
        ))}

        <div className="flex items-center gap-2 pl-3 ml-1 border-l">
          <Text variant="content-1" className="font-medium text-foreground">
            {user.name}
          </Text>
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}

export { Navbar };
