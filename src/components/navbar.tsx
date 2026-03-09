import Link from "next/link";
import { LibraryBigIcon } from "lucide-react";

import { NavLinks } from "./ui/nav-links";
import { Text } from "./ui/text";

function Navbar() {
  return (
    <nav className="flex items-center bg-gray-900 text-white py-2 px-8 m-2 rounded-2xl">
      <Link href="/" className="flex-1 flex items-center gap-2">
        <LibraryBigIcon className="w-5.5 h-5.5" />
        <Text variant="heading-2">BookReview</Text>
      </Link>

      <NavLinks />
    </nav>
  );
}

export { Navbar };
