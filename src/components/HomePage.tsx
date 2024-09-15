"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {FileText, Zap, Users } from "lucide-react";

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-black text-white h-screen flex flex-col justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Create Professional Certificates in Minutes
            </h1>
            <p className="text-xl mb-8 text-stone-300">
              Streamline your certification process with Certify Now
            </p>
            <Button size="lg" asChild>
              <Link href="/templates">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="h-auto bg-stone-100 flex flex-col justify-center items-center py-40">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">
              Why Choose Certify Now?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <FileText className="w-10 h-20 mb-2 text-blue-600" />
                  <CardTitle>Professional Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Choose from a wide range of professionally designed
                    certificate templates for any occasion.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="w-10 h-20 mb-2 text-yellow-500" />
                  <CardTitle>Quick and Easy</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Generate certificates in just a few clicks. Save time and
                    increase productivity.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="w-10 h-20 mb-2 text-green-600" />
                  <CardTitle>Bulk Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Create multiple certificates at once by uploading a CSV file
                    with participant details.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="h-auto flex flex-col justify-center items-center bg-black py-40">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Choose a Template
                </h3>
                <p className="text-gray-600">
                  Select from our library of professional certificate designs.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Customize Content
                </h3>
                <p className="text-gray-600">
                  Add your text, logo, and recipient details to personalize the
                  certificate.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Generate & Share</h3>
                <p className="text-gray-600">
                  Download your certificates or share them directly with
                  recipients.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white h-auto flex flex-col justify-center items-center py-40">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Your First Certificate?
            </h2>
            <p className="text-xl mb-8 text-stone-300">
              Join thousands of organizations using Certify Now to streamline
              their certification process.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
              asChild
            >
              <Link href="/sign-up">Sign Up for Free</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
