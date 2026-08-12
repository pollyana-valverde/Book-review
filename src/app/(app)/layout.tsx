import { Navbar, MobileNavbar } from "@/components/layout";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main
        className={`
          container mx-auto px-4 py-5 
          mb-14 md:mb-0 md:mt-15`}
      >
        {children}
      </main>
      <MobileNavbar />
    </>
  );
}
