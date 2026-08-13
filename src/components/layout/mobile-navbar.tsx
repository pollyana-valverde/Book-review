import { NavLink } from "../ui/nav-links";
import { Text } from "../ui/text";
import { SignOutButton } from "@/features/auth";

import { NAVLINKS } from "@/utils/nav-links";

function MobileNavbar({ user }: { user: { name: string } }) {
  return (
    <nav
      className={`
    md:hidden
    fixed bottom-0 left-0 right-0
    flex gap-2 items-center justify-around
    bg-white text-muted-foreground border-t border-separate
    py-2 px-1 mx-auto w-full
    `}
    >
      {NAVLINKS.map((link, index) => (
        <NavLink key={index} href={link.href} className="flex-col text-center">
          <link.icon className="mb-1 w-4 h-4" />
          <Text variant="content-2">
            {link.label === "Painel" ? "Início" : link.label.split(" ")[0]}
          </Text>
        </NavLink>
      ))}
      <SignOutButton
        title={user.name}
        className="flex-col h-auto gap-0 px-3 py-1.5 text-muted-foreground [&_svg]:mb-1 [&_svg]:w-4 [&_svg]:h-4"
      />
    </nav>
  );
}

export { MobileNavbar };
