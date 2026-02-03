'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface HeaderProps {
  variant?: 'light' | 'dark';
}

export default function Header({ variant = 'light' }: HeaderProps) {
  const pathname = usePathname();
  
  const isLight = variant === 'light';
  const bgColor = isLight ? 'bg-[#efefef]' : 'bg-[#000000]';
  const textColor = isLight ? 'text-[#363d43]' : 'text-[#efefef]';
  const logoSrc = isLight ? '/solo fin noir.png' : '/soloo fin blc.png';
  const borderColor = isLight ? 'border-[#363d43]/10' : 'border-[#efefef]/10';
  const accentTextColor = isLight ? 'text-[#acae9f]' : 'text-[#acae9f]';
  const hoverBgColor = isLight ? 'hover:bg-[#363d43]/5' : 'hover:bg-[#efefef]/5';

  const navItems = [
    { href: '/projets', label: 'Projets' },
    { href: '/nouveau-client', label: 'Nouveau Client' },
  ];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${bgColor} border-b ${borderColor} sticky top-0 z-50 backdrop-blur-md ${isLight ? '' : 'bg-opacity-90'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image 
                src={logoSrc}
                alt="PERMALE" 
                width={180} 
                height={45} 
                className="h-10 w-auto"
                priority
              />
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group"
                >
                  <motion.span
                    className={`
                      text-sm font-light tracking-[0.2em] uppercase transition-all duration-300
                      ${isActive ? accentTextColor : textColor}
                      ${isActive ? '' : 'group-hover:text-[#acae9f]'}
                    `}
                    style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-6 left-0 right-0 h-[2px] bg-[#acae9f]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover indicator */}
                  <motion.div
                    className="absolute -bottom-6 left-0 right-0 h-[2px] bg-[#acae9f] opacity-0 group-hover:opacity-100"
                    initial={false}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <Link
            href="/nouveau-client"
            className={`
              group relative inline-flex items-center
              px-8 py-3 
              border ${isLight ? 'border-[#363d43]' : 'border-[#acae9f]'}
              ${isLight ? 'bg-white' : 'bg-black'}
              overflow-hidden
              text-sm font-light tracking-[0.2em] uppercase
              transition-all duration-300
            `}
            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
          >
            <span className={`relative z-10 ${isLight ? 'text-[#363d43]' : 'text-[#efefef]'} group-hover:text-[#363d43] transition-colors duration-300`}>
              Créer un projet
            </span>
            <div className="absolute inset-0 bg-[#acae9f] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" aria-label="Menu">
            <svg className={`w-6 h-6 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}