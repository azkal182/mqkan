'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  Menu,
  NavigationIcon,
  PhoneIcon,
  Send,
  Trophy,
  X,
  YoutubeIcon
} from 'lucide-react';
import logoPic from '../../../public/images/logo.png';
import amtsilatiPic from '../../../public/images/amtsilati.jpg';
import CompetitionSection from './competition-section';
import PrizeSection from './prize-section';
import ContactSection from './contact-section';
import ScheduleSection from './schedule-section';
import LatarBelakangSection from './latar-belakang-section';
import AboutSection from './about-section';
import Link from 'next/link';
import RequirementsSection from './requirement-section';
import { GoogleAnalytics } from '@next/third-parties/google';

const listMenu = [
  { title: 'Home', link: '#home' },
  { title: 'Tentang', link: '#about' },
  { title: 'Latar Belakang', link: '#latar-belakang' },
  { title: 'Cabang Lomba', link: '#competition-section' },
  { title: 'Jadwal', link: '#schedule' },
  { title: 'Persyaratan', link: '#requirement-section' },
  { title: 'Pendaftaran', link: '/registration' },
  { title: 'Kontak', link: '/contact' }
];

const sections = [
  { Component: AboutSection },
  { Component: LatarBelakangSection },
  { Component: ScheduleSection },
  { Component: CompetitionSection },
  { Component: PrizeSection },
  { Component: RequirementsSection },
  { Component: ContactSection }
];

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Variants untuk animasi header dan mobile menu
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  // Variants untuk section
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  // Variants untuk item dalam grid
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.header
        className='bg-primary fixed z-50 w-full shadow-sm'
        initial='hidden'
        animate='visible'
        variants={headerVariants}
      >
        <div className='container mx-auto px-4'>
          <nav className='flex h-20 items-center justify-between'>
            <Link href={'/'} className='flex items-center gap-3'>
              <Image src={logoPic} alt='Picture of the logo' height={42} />
            </Link>
            <div className='hidden items-center gap-8 lg:flex'>
              {listMenu.map((item) => (
                <motion.a
                  key={item.title}
                  href={item.link}
                  className='text-[#d7bd9c] hover:border-b'
                  whileHover={{ scale: 1.1, color: '#0C713D' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </motion.a>
              ))}
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-[#d7bd9c] lg:hidden'
            >
              <Menu />
            </button>
          </nav>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id='mobile-menu'
              className='fixed inset-0 z-50 bg-white lg:hidden'
              initial='hidden'
              animate='visible'
              exit='exit'
              variants={menuVariants}
            >
              <div className='flex h-full flex-col items-center justify-center space-y-6 text-lg'>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className='absolute top-5 right-5 text-2xl text-[#0C713D]'
                >
                  <X />
                </button>
                {listMenu.map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.link}
                    className='text-gray-600 hover:text-[#0C713D]'
                    whileHover={{ scale: 1.1, color: '#0C713D' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        id='home'
        className='relative h-dvh overflow-hidden pt-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className='absolute inset-0 z-0'>
          <Image
            className='h-full w-full object-cover'
            src={amtsilatiPic}
            alt='islamic students reading classical books'
          />
          <div className='absolute inset-0 bg-black/50' />
        </div>
        <div className='relative z-10 container mx-auto flex h-full items-center px-4'>
          <motion.div
            className='max-w-3xl text-white'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className='mb-6 text-3xl font-bold md:text-5xl'>
              Menjaga Tradisi Keilmuan Islam Melalui Musabaqah Qira’atil Kutub
              Amtsilati se Nusantara
            </h1>
            <p className='mb-8 text-xl text-gray-200'>
              Mari ikut serta bersama kami dalam merayakan dan melestarikan
              tradisi kitab kuning dalam ajang Musabaqah Qira’atil Kutub dengan
              menggunakan metode Amtsilati yang diikuti oleh seluruh pengguna
              Metode Amtsilati se Nusantara.
            </p>
            <div className='flex flex-col gap-4 md:flex-row'>
              <motion.a
                href='/registration'
                className='bg-primary text-primary-foreground rounded-lg px-8 py-4 text-center font-semibold hover:bg-[#0C713D]/90'
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Daftar Sekarang
              </motion.a>
              <motion.a
                href='#about'
                className='hover:text-primary rounded-lg border-2 border-white px-8 py-4 text-center font-semibold text-white hover:bg-white'
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Pelajari Lebih Lanjut
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {sections.map(({ Component }, index) => (
        <Component key={index} even={index % 2 === 0} />
      ))}

      {/* Footer */}
      <motion.footer
        className='bg-primary py-12 text-white'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className='container mx-auto px-4'>
          <div className='mb-8 grid gap-8 md:grid-cols-3'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className='mb-4 flex items-center gap-3'>
                <Image src={logoPic} alt={'logo'} height={36} />
              </div>
              <p className='text-gray-200'>
                Mari ikut serta bersama kami dalam merayakan dan melestarikan
                tradisi kitab kuning dalam ajang Musabaqah Qira’atil Kutub
                dengan menggunakan metode Amtsilati yang diikuti oleh seluruh
                pengguna Metode Amtsilati se Nusantara.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className='mb-4 font-semibold'>Quick Links</h4>
              <ul className='space-y-2 text-gray-200'>
                {['about', 'schedule', 'registration', 'contact'].map(
                  (link, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a href={`#${link}`}>
                        {link.charAt(0).toUpperCase() + link.slice(1)}
                      </a>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className='mb-4 font-semibold'>Resources</h4>
              <ul className='space-y-2 text-gray-200'>
                {['FAQ', 'Terms & Conditions', 'Privacy Policy', 'Support'].map(
                  (resource, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className='cursor-pointer'>{resource}</span>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div> */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 className='mb-4 font-semibold'>Newsletter</h4>
              <p className='mb-4 text-gray-200'>
                Subscribe to get updates about the competition
              </p>
              <div className='flex gap-2'>
                <input
                  type='email'
                  placeholder='Your email'
                  className='w-full rounded-l-lg border-2 px-4 py-2'
                />
                <motion.button
                  className='rounded-r-lg bg-white px-4 text-[#0C713D]'
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Send />
                </motion.button>
              </div>
            </motion.div>
          </div>
          <motion.div
            className='border-t border-white/20 pt-8 text-center text-gray-200'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p>© 2025 Musabaqah Qira&apos;atul Kutub. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
      <GoogleAnalytics gaId='G-MDC4BXS5P1' />
    </div>
  );
};

export default Page;
