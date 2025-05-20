import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

const AboutSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      className="w-full bg-white pt-[74px] flex items-center justify-center min-h-screen"
      ref={ref}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Hero section with large text and image */}
        <div className="relative mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Large text on the left */}
            <div className="lg:col-span-7 z-10">
              <h1
                className="text-[64px] md:text-[80px] lg:text-[100px] font-black text-black leading-none"
                style={{ letterSpacing: "-0.02em" }}
              >
                БОГИНО ХУГАЦААТ
                <br />
                БОНД
              </h1>
            </div>

            {/* Image on the right */}
            <div className="lg:col-span-5 lg:absolute lg:right-0 lg:top-0 lg:h-full">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/coin.png"
                  alt="Portrait image"
                  width={600}
                  height={800}
                  className="md:w-full md:h-full w-[358px] h-[200px]  object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
          {/* Social links */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <Link
                target="_blank"
                href="https://www.instagram.com/coach_lab_mongolia/"
                className="flex items-center justify-between border-b border-gray-200 pb-3 group"
              >
                <span className="text-lg">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform transition-transform group-hover:translate-x-1"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </Link>
              <Link
                target="_blank"
                href="https://www.facebook.com/profile.php?id=61552641916299"
                className="flex items-center justify-between border-b border-gray-200 pb-3 group"
              >
                <span className="text-lg">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transform transition-transform group-hover:translate-x-1"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-4">
            <div className="flex items-start">
              <span className="text-6xl font-serif mr-4">А</span>
              <p className="text-gray-700 mt-4">
                лбан байгууллагууд болон хувь хүмүүс харилцах дансандаа хүүгүй
                байршиж буй мөнгөн хөрөнгөө хугацаагүй бондод байршуулснаар
                мөнгөн хөрөнгөө үр өгөөжтэйгээр оновчтой удирдах шийдэл юм.
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="lg:col-span-5">
            <div className="pl-6 border-l border-gray-200">
              <p className="text-gray-800 text-lg mb-6">
                "Санхүүгийн хэрэглээндээ тохируулан богино хугацаанд уян хатан
                бондод хөрөнгө оруулах боломж. "
              </p>
              <Link href="/detail">
                <Button className="mt-6 bg-white hover:bg-[#1365b1] hover:text-white text-black border-[1px] border-black px-8 py-3 rounded-xl text-lg font-medium transition-all duration-300">
                  Дэлгэрэнгүй
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
