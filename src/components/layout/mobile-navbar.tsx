import { NavLink } from "../ui/nav-links";
import { Text } from "../ui/text";

import { NAVLINKS } from "@/utils/nav-links";

function MobileNavbar() {
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
            {link.label === "Dashboard" ? "Home" : link.label.split(" ")[0]}
          </Text>
        </NavLink>
      ))}
    </nav>
  );
}

export { MobileNavbar };
