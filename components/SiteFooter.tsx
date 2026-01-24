"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

import GlassSurface from "./GlassSurface";

const LOGO_SRC = "/ghora1.png?v=2026-01-12-update";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="relative mt-auto w-full safe-area-bottom"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={0}
        backgroundOpacity={0}
        saturation={1.1}
        tint="rgba(2, 6, 23, 0.20)"
        className="border-t border-gold-400/15"
        forceCssFallback={true}
      >
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-10 md:gap-10 md:py-12 lg:px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] lg:gap-x-16 lg:gap-y-10">
            {/* Brand & Social Section */}
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left md:gap-6">
              <Link
                href="/"
                className="flex items-center justify-center gap-1 font-semibold tracking-tight text-radiant-gold hover:text-radiant-gold transition-colors md:justify-start"
                aria-label="Crystal Valley Auto Detail"
              >
                <span className="relative h-20 w-28 shrink-0 md:h-24 md:w-32">
                  <Image
                    src={LOGO_SRC}
                    alt="Crystal Valley Auto Detail"
                    fill
                    className="object-contain"
                  />
                </span>
                <span className="text-xl font-bold leading-none md:text-2xl">
                  Crystal Valley
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-white/80 max-w-xs">
                Premium auto detailing services delivering showroom shines and lasting protection for your vehicle.
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center justify-center gap-4 md:justify-start">
                <SocialLink href="https://www.facebook.com/CrystalValleyAutodetail" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </SocialLink>
                <SocialLink href="https://www.instagram.com/crystalvalleyautodetail" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </SocialLink>
                <SocialLink href="https://www.linkedin.com/company/111493970/" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </SocialLink>
              </div>
            </div>

            {/* Mobile: Company & Legal side by side */}
            <div className="grid grid-cols-2 gap-4 md:hidden">
              {/* Company Section - Mobile */}
              <div className="flex flex-col items-center gap-3 text-center">
                <h3 className="text-base font-bold uppercase tracking-wider text-gold-400">Company</h3>
                <nav className="flex flex-col items-center gap-2">
                  <FooterLink href="/about">About Us</FooterLink>
                  <FooterLink href="/team">Our Team</FooterLink>
                  <FooterLink href="/blog">Blog</FooterLink>
                  <FooterLink href="/discounts" className="font-semibold text-gold-400 hover:text-gold-300">
                    Get Discount
                  </FooterLink>
                </nav>
              </div>

              {/* Legal Section - Mobile */}
              <div className="flex flex-col items-center gap-3 text-center">
                <h3 className="text-base font-bold uppercase tracking-wider text-gold-400">Legal</h3>
                <nav className="flex flex-col items-center gap-2">
                  <FooterLink href="/terms">Terms of Use</FooterLink>
                  <FooterLink href="/privacy">Privacy Policy</FooterLink>
                  <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
                  <FooterLink href="/refund-policy">Refund Policy</FooterLink>
                </nav>
              </div>
            </div>

            {/* Mobile: Support Section - Centered */}
            <div className="flex flex-col items-center gap-3 text-center md:hidden">
              <h3 className="text-base font-bold uppercase tracking-wider text-gold-400">Support</h3>
              <nav className="flex flex-col items-center gap-2">
                <FooterLink href="/help">Help Center</FooterLink>
                <FooterLink href="/faq">FAQs</FooterLink>
                
                <div className="mt-2 flex flex-col items-center gap-3">
                  <a href="mailto:riffattonmoy@crystalvalley.autos" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors group">
                    <Mail className="h-4 w-4 text-gold-400 group-hover:text-gold-300" />
                    <span>riffattonmoy@crystalvalley.autos</span>
                  </a>
                  <a href="tel:+8801841353850" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors group">
                    <Phone className="h-4 w-4 text-gold-400 group-hover:text-gold-300" />
                    <span>+8801841353850</span>
                  </a>
                </div>
              </nav>
            </div>

            {/* Desktop: Company Section */}
            <div className="hidden md:flex flex-col gap-5 lg:col-span-1">
              <h3 className="text-base font-bold uppercase tracking-wider text-gold-400">Company</h3>
              <nav className="flex flex-col gap-3">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/team">Our Team</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/discounts" className="font-semibold text-gold-400 hover:text-gold-300">
                  Get Discount
                </FooterLink>
              </nav>
            </div>

            {/* Desktop: Support Section */}
            <div className="hidden md:flex flex-col gap-5 lg:col-span-1">
              <h3 className="text-base font-bold uppercase tracking-wider text-gold-400">Support</h3>
              <nav className="flex flex-col gap-3">
                <FooterLink href="/help">Help Center</FooterLink>
                <FooterLink href="/faq">FAQs</FooterLink>
                
                <div className="mt-2 flex flex-col gap-3">
                    <a href="mailto:riffattonmoy@crystalvalley.autos" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors group">
                        <Mail className="h-4 w-4 text-gold-400 group-hover:text-gold-300" />
                      <span>riffattonmoy@crystalvalley.autos</span>
                    </a>
                    <a href="tel:+8801841353850" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors group">
                        <Phone className="h-4 w-4 text-gold-400 group-hover:text-gold-300" />
                      <span>+8801841353850</span>
                    </a>
                </div>
              </nav>
            </div>

            {/* Desktop: Legal Section */}
            <div className="hidden md:flex flex-col gap-5 lg:col-span-1">
              <h3 className="text-base font-bold uppercase tracking-wider text-gold-400">Legal</h3>
              <nav className="flex flex-col gap-3">
                <FooterLink href="/terms">Terms of Use</FooterLink>
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
                <FooterLink href="/refund-policy">Refund Policy</FooterLink>
              </nav>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gold-400/10 pt-8 text-xs text-white/40 md:flex-row">
            <p>&copy; {currentYear} Crystal Valley Auto Detail. All rights reserved.</p>
            <div className="flex items-center gap-6">
                 <span>
                   Designed & Built by{' '}
                   <a 
                     href="https://grayvally.tech" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-gold-400 hover:text-radiant-gold transition-colors font-medium"
                   >
                     GrayVally Software Solutions
                   </a>
                 </span>
            </div>
          </div>
        </div>
      </GlassSurface>
    </motion.footer>
  );
}

function FooterLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href} 
      className={`text-sm text-white/80 hover:text-white transition-all hover:translate-x-1 duration-200 inline-block ${className}`}
    >
      {children}
    </Link>
  );
}

function SocialLink({ href, children, "aria-label": ariaLabel }: { href: string; children: React.ReactNode; "aria-label": string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/10 text-radiant-gold transition-colors hover:bg-gold-400/20 hover:text-white"
      whileHover={{ scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}
