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
    label: "Albums",
    href: "/albums",
    icon: <FolderOpenIcon className="w-4 h-4" />,
  },
];

function MobileNavbar() {
  return (
    <nav
      className={`
    md:hidden 
    fixed bottom-0 left-0 right-0
    flex gap-2 items-center justify-around
    bg-gray-900 text-white rounded-xl
    py-2 px-5 m-2 mx-auto w-[99%] 
    `}
    >
      {links.map((link, index) => (
        <NavLink key={index} href={link.href} className="flex-col text-center">
          <span className="mb-1">{link.icon}</span>
          <Text variant="content-2">{link.label}</Text>
        </NavLink>
      ))}
    </nav>
  );
}

export { MobileNavbar };
