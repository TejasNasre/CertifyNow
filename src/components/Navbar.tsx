"use client";

import {useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/store";

export default function Navbar() {
  const router = useRouter();
  // const { user } = useUserStore() as { user: any };
  const setUser = useUserStore((state: any) => state.setUser);

  const [isOpen, setIsOpen] = useState(false);
  // const [isSignedIn, setIsSignedIn] = useState(false);

  // useEffect(() => {
  //   async function fetchSession() {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     if (session) {
  //       setIsSignedIn(true);
  //     }
  //   }

  //   fetchSession();
  // });

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error.message);
    } else {
      setUser(false);
      // setIsSignedIn(false);
      router.push("/sign-in");
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Generate Certificate", href: "/generate-certificate" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-400 bg-black text-stone-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-medium font-serif text-white">
              Certify Now
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-stone-100"
            >
              {item.name}
            </Link>
          ))}
          {setUser ? (
            <Button
              variant="outline"
              className="text-stone-300 border-stone-600 hover:bg-stone-800 hover:text-stone-100"
              onClick={() => logout()}
            >
              Logout
            </Button>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="text-stone-300 border-stone-600 hover:bg-stone-800 hover:text-stone-100"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="outline"
                  className="text-stone-300 border-stone-600 hover:bg-stone-800 hover:text-stone-100"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="px-0 text-stone-300 hover:text-stone-100 md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] bg-black text-stone-300 border-l border-stone-700"
          >
            <nav className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium transition-colors hover:text-stone-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {setUser ? null : (
                <>
                  <Link href="/sign-in">
                    <Button
                      variant="outline"
                      className="text-stone-300 border-stone-600 hover:bg-stone-800 hover:text-stone-100"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      variant="outline"
                      className="text-stone-300 border-stone-600 hover:bg-stone-800 hover:text-stone-100"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
