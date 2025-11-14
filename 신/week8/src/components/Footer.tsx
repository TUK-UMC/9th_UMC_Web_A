import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] px-6 py-4 relative z-50">
      <div className="container mx-auto text-center text-gray-600">
        <p>&copy;{new Date().getFullYear()} LP판. All rights reserved.</p>
        <div className="flext justify-center space-x-4 mt-4">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
          <Link to="#">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
