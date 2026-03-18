import { NavLink } from "../ui/nav-links";

import { NAVLINKS } from "@/utils/nav-links";

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
      {NAVLINKS.map((link, index) => (
        <NavLink key={index} href={link.href} className="flex-col text-center">
          <link.icon className="mb-1 w-4 h-4" />
        </NavLink>
      ))}
    </nav>
  );
}

export { MobileNavbar };
