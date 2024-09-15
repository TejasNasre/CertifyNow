"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-stone-300 border-t border-stone-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Award className="h-6 w-6 text-stone-400" />
              <span className="text-xl font-bold font-serif text-stone-200">
                Certify Now
              </span>
            </Link>
            <p className="text-sm mb-4">
              Certify Now is your go-to platform for creating professional
              certificates quickly and easily. Streamline your certification
              process and elevate your brand.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-stone-400 hover:text-stone-200" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-stone-400 hover:text-stone-200" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-stone-400 hover:text-stone-200" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-stone-400 hover:text-stone-200" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-200">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/templates" className="hover:text-stone-100">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-stone-100">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-stone-100">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-stone-100">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-stone-100">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-stone-200">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-stone-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-stone-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-stone-100">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 border-t border-stone-800 pt-8">
          <h3 className="text-lg font-semibold mb-4 text-stone-200">
            Subscribe to Our Newsletter
          </h3>
          <form className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-stone-800 border-stone-700 text-stone-300 placeholder-stone-500 focus:border-stone-600"
            />
            <Button
              type="submit"
              variant="outline"
              className="bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700"
            >
              Subscribe
            </Button>
          </form>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-sm">
          <p>© {new Date().getFullYear()} Certify Now. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
