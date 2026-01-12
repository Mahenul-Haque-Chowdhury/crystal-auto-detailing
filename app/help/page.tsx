'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/animations';

export default function HelpPage() {
  return (
    <PageWrapper className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <motion.h1 
        className="text-3xl font-bold text-radiant-gold sm:text-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Help Center
      </motion.h1>
      <motion.p 
        className="mt-4 max-w-md text-lg text-slate-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        This page is currently under construction. Please check back later.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-polish-gold px-8 py-3 font-semibold text-black transition hover:brightness-110"
        >
          Back to Home
        </Link>
      </motion.div>
    </PageWrapper>
  );
}
