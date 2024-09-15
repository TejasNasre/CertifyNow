"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/templates" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
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
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
