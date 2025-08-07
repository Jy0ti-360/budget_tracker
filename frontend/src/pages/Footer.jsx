import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-10 text-center py-6 text-sm text-gray-600">
      <div className="max-w-screen-lg mx-auto px-4">
        <p className="mb-4 text-sm sm:text-base">
          © {new Date().getFullYear()} Budget Tracker. All rights reserved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <a
            href="https://github.com/Jy0ti-360"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-500 transition"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/jyotiprakash-jena"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-500 transition"
          >
            LinkedIn
          </a>
          <a
            href="mailto:jpjenaofficial@gmail.com"
            className="hover:underline hover:text-blue-500 transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;