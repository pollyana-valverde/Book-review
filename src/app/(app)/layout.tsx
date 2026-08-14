import { Navbar, MobileNavbar } from "@/components/layout";
import { requireSession } from "@/server/auth/session";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await requireSession();

  return (
    <>
      <Navbar user={user} />
      <main
        className={`
          container mx-auto px-4 py-5
          mb-14 md:mb-0 md:mt-15`}
      >
        {children}
      </main>
      <MobileNavbar user={user} />
    </>
  );
}
