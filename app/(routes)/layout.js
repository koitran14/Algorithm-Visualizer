import { NavBar } from "@/components/navbar.jsx";

export default function GeneralLayout({ children }) {
  return (
    <main className="flex h-full w-full relative">
      <div className="top-0 absolute right-0 h-fit w-full bg-black">
        <NavBar />
      </div>
      <div className="pt-24 w-full h-full px-20">
        {children}
      </div>
    </main>
  );
}
