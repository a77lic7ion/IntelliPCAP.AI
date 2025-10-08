
import React from 'react';
import { LogoIcon } from './common/Icons';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-brand-dark border-b border-brand-gray-light">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div onClick={onLogoClick} className="flex items-center space-x-4 cursor-pointer">
          <LogoIcon className="h-6 w-6 text-brand-green" />
          <h1 className="text-xl font-bold text-white">IntelliPCAP.AI</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-brand-gray-text hover:text-white transition-colors">Analyze</a>
          <a href="#" className="text-brand-gray-text hover:text-white transition-colors">Pricing</a>
          <a href="#" className="text-brand-gray-text hover:text-white transition-colors">Contact</a>
        </nav>
        <button className="hidden md:block bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-80 transition-all">
          Enterprise Plan
        </button>
      </div>
    </header>
  );
};

export default Header;
