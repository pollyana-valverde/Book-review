import Link from "next/link";
import { LibraryBigIcon, FolderOpenIcon, LayoutDashboardIcon, PlusCircleIcon } from "lucide-react";

import { NavLink } from "../ui/nav-links";
import { Text } from "../ui/text";

const links = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboardIcon className="w-4 h-4" />,
  },
  {
    label: "Resenhas",
    href: "/books-review",
    icon: <LibraryBigIcon className="w-4 h-4" />,
  },
  {
    label: "Nova Resenha",
    href: "/books-review/new",
    icon: <PlusCircleIcon className="w-4 h-4" />,
  },
  {
    label: "Albuns",
    href: "/albuns",
    icon: <FolderOpenIcon className="w-4 h-4" />,
  },
];

function Navbar() {
  return (
    <nav className="flex items-center bg-gray-900 text-white py-2 px-5 mt-2 mb-4 mx-auto rounded-xl w-[70%] ">
      <Link href="/" className="flex-1 flex items-center gap-2">
        <LibraryBigIcon className="w-5.5 h-5.5" />
        <Text variant="heading-2">BookReview</Text>
      </Link>

      <div className="flex gap-2 items-center">
        {links.map((link, index) => (
          <NavLink key={index} href={link.href} label={link.label} icon={link.icon} />
        ))}
      </div>
    </nav>
  );
}

export { Navbar };
