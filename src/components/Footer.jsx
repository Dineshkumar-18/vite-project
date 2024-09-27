import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Company Info */}
          <div className="w-full md:w-1/3 mb-6">
            <h2 className="text-lg font-semibold mb-4">AeroFlex</h2>
            <p className="text-sm">
              At AeroFlex, we provide the best flight booking experience with flexible options and great customer service. Fly with ease and comfort with us.
            </p>
          </div>

          {/* Links */}
          <div className="w-full md:w-1/3 mb-6">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="text-sm">
              <li className="mb-2"><a href="/" className="hover:underline">Home</a></li>
              <li className="mb-2"><a href="/flights" className="hover:underline">Flights</a></li>
              <li className="mb-2"><a href="/contact" className="hover:underline">Contact Us</a></li>
              <li className="mb-2"><a href="/about" className="hover:underline">About Us</a></li>
              <li className="mb-2"><a href="/faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/3 mb-6">
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <ul className="text-sm">
              <li className="mb-2">Phone: +1 234 567 890</li>
              <li className="mb-2">Email: support@aeroflex.com</li>
              <li className="mb-2">Address: 123 Flight Street, SkyCity, CA</li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-6 border-t border-gray-700 pt-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
          <div className="flex justify-center space-x-6">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 text-white hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24h11.494V14.709h-3.146v-3.62h3.146V8.338c0-3.116 1.9-4.813 4.677-4.813 1.328 0 2.468.099 2.799.143v3.243h-1.922c-1.504 0-1.796.715-1.796 1.763v2.309h3.592l-.468 3.62h-3.124V24h6.129c.728 0 1.325-.597 1.325-1.324V1.325C24 .597 23.403 0 22.675 0z"/>
              </svg>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 text-white hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.843 9.843 0 0 1-2.828.775 4.933 4.933 0 0 0 2.165-2.724c-.951.555-2.004.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482 13.944 13.944 0 0 1-10.126-5.144 4.92 4.92 0 0 0 1.523 6.573A4.906 4.906 0 0 1 1.67 8.875v.062a4.923 4.923 0 0 0 3.946 4.828 4.93 4.93 0 0 1-2.22.085 4.928 4.928 0 0 0 4.6 3.417 9.873 9.873 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.067a13.945 13.945 0 0 0 7.548 2.211c9.057 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.637A10.012 10.012 0 0 0 24 4.557z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 text-white hover:text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.796.24 2.216.405.566.22.974.483 1.402.91.428.428.692.836.911 1.402.165.42.351 1.046.405 2.216.059 1.266.07 1.647.07 4.851 0 3.204-.012 3.584-.07 4.85-.054 1.17-.24 1.796-.405 2.216-.22.566-.483.974-.91 1.402-.428.428-.836.692-1.402.911-.42.165-1.046.351-2.216.405-1.266.059-1.647.07-4.851.07-3.204 0-3.584-.012-4.85-.07-1.17-.054-1.796-.24-2.216-.405a3.826 3.826 0 0 1-1.402-.91 3.826 3.826 0 0 1-.911-1.402c-.165-.42-.351-1.046-.405-2.216-.059-1.266-.07-1.647-.07-4.851 0-3.204.012-3.584.07-4.85.054-1.17.24-1.796.405-2.216a3.826 3.826 0 0 1 .91-1.402 3.826 3.826 0 0 1 1.402-.911c.42-.165 1.046-.351 2.216-.405 1.266-.059 1.647-.07 4.851-.07zm0-2.163C8.691 0 8.281.013 7.1.072 5.905.131 5.116.312 4.427.593c-.72.296-1.325.693-1.93 1.298a5.92 5.92 0 0 0-1.298 1.93C.312 4.116.131 4.905.072 6.1.013 7.281 0 7.691 0 12c0 4.309.013 4.719.072 5.9.059 1.195.24 1.984.593 2.673.296.72.693 1.325 1.298 1.93a5.92 5.92 0 0 0 1.93 1.298c.72.296 1.512.477 2.673.593 1.181.059 1.591.072 5.9.072 4.309 0 4.719-.013 5.9-.072 1.195-.059 1.984-.24 2.673-.593.72-.296 1.325-.693 1.93-1.298a5.92 5.92 0 0 0 1.298-1.93c.353-.689.534-1.478.593-2.673.059-1.181.072-1.591.072-5.9 0-4.309-.013-4.719-.072-5.9-.059-1.195-.24-1.984-.593-2.673a5.92 5.92 0 0 0-1.298-1.93A5.92 5.92 0 0 0 19.573.593c-.689-.353-1.478-.534-2.673-.593C16.281.013 15.871 0 12 0zM12 5.838a6.162 6.162 0 1 0 6.162 6.162A6.16 6.16 0 0 0 12 5.838zm0 10.162a4.001 4.001 0 1 1 4.001-4.001A4.001 4.001 0 0 1 12 16zm6.406-10.845a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm">
          &copy; {new Date().getFullYear()} AeroFlex. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
