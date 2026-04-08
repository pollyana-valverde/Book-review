import {
  LayoutDashboardIcon,
  BookOpenIcon,
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
    icon: BookOpenIcon,
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
