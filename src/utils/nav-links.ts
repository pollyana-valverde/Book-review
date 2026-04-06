import {
  LayoutDashboardIcon,
  LibraryBigIcon,
  PlusCircleIcon,
  FolderOpenIcon,
} from "lucide-react";

const NAVLINKS = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Resenhas",
    href: "/books-review",
    icon: LibraryBigIcon,
  },
  {
    label: "Nova Resenha",
    href: "/new-review",
    icon: PlusCircleIcon,
  },
  {
    label: "Albums",
    href: "/albums",
    icon: FolderOpenIcon,
  },
];

export { NAVLINKS };
