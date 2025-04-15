"use client";

import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer" className="bg-white">
      <hr className="w-11/12 mx-auto border-white/30" />
      <section className="container mx-auto flex flex-col items-center justify-center gap-5 text-[13px] py-7">
        <p className="text-black/70">
          © 2024 Apex Capital. All rights reserved.
        </p>

        <div className="flex justify-center gap-3">
          <a
            href="https://www.facebook.com/ApexCapitalMN"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://twitter.com/apexcapitalmn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/apexcapitalllc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://www.instagram.com/apexcapitalmn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.youtube.com/ApexCapitalLLC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black"
          >
            <FaYoutube size={24} />
          </a>
        </div>
      </section>
    </footer>
  );
}
