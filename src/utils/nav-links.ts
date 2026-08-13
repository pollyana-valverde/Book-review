import {
  LayoutDashboardIcon,
  BookOpenIcon,
  PlusCircleIcon,
  FolderOpenIcon,
} from "lucide-react";

const NAVLINKS = [
  {
    label: "Painel",
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
    label: "Coleções",
    href: "/collections",
    icon: FolderOpenIcon,
  },
];

export { NAVLINKS };
