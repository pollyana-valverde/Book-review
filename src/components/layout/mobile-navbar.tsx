import Link from "next/link";
import {
  LibraryBigIcon,
  FolderOpenIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
} from "lucide-react";

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
    label: "Nova",
    href: "/books-review/new",
    icon: <PlusCircleIcon className="w-4 h-4" />,
  },
  {
    label: "Albuns",
    href: "/albuns",
    icon: <FolderOpenIcon className="w-4 h-4" />,
  },
];

function MobileNavbar() {
  return (
    <nav className="flex items-center justify-center bg-gray-900 text-white py-2 px-5 m-2 mx-auto rounded-xl w-fit ">
      <div className="flex gap-2 items-center">
        {links.map((link, index) => (
          <NavLink
            key={index}
            href={link.href}
            className="flex-col text-center"
          >
            <span className="mb-1">{link.icon}</span>
            <Text variant="content-2">{link.label}</Text>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export { MobileNavbar };
