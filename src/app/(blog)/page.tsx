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
  X,
  YoutubeIcon
} from 'lucide-react';
import logoPic from '../../../public/images/logo.png';
import amtsilatiPic from '../../../public/images/amtsilati.jpg';

const listMenu = [
  'home',
  'about',
  'Jadwal Pelaksanaan',
  'Pendafatarn',
  'Kontak'
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
    <ScrollArea className='h-dvh'>
      {/* Header */}
      <motion.header
        className='fixed z-50 w-full bg-white shadow-sm'
        initial='hidden'
        animate='visible'
        variants={headerVariants}
      >
        <div className='container mx-auto px-4'>
          <nav className='flex h-20 items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Image src={logoPic} alt='Picture of the logo' height={42} />
            </div>
            <div className='hidden items-center gap-8 lg:flex'>
              {listMenu.map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  className='text-gray-600 hover:text-[#0C713D]'
                  whileHover={{ scale: 1.1, color: '#0C713D' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </motion.a>
              ))}
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-[#0C713D] lg:hidden'
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
                    key={item}
                    href={`#${item}`}
                    className='text-gray-600 hover:text-[#0C713D]'
                    whileHover={{ scale: 1.1, color: '#0C713D' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        id='hero'
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
              Menghidupkan Kembali Tradisi Keilmuan Islam Melalui Qira&apos;atul
              Kutub
            </h1>
            <p className='mb-8 text-xl text-gray-200'>
              Bergabunglah bersama kami dalam merayakan dan melestarikan tradisi
              yang kaya dari kompetisi membaca Kitab Kuning.
            </p>
            <div className='flex flex-col gap-4 md:flex-row'>
              <motion.a
                href='#registration'
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

      {/* About Section */}
      <motion.section
        id='about'
        className='flex min-h-[calc(100dvh-52px)] items-center bg-white py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className='container mx-auto px-4'>
          <motion.div className='mb-16 text-center' variants={sectionVariants}>
            <h2 className='mb-4 text-3xl font-bold text-gray-800'>
              Tentang Event Musabaqah Qira&apos;atul Kutub
            </h2>
            <p className='mx-auto max-w-2xl text-gray-600'>
              Musabaqah Qira&apos;atul Kutub adalah kompetisi bergengsi yang
              merayakan penguasaan teks-teks Islam klasik, membina beasiswa dan
              melestarikan warisan intelektual kita yang kaya.
            </p>
          </motion.div>
          <div className='mb-16 grid gap-8 md:grid-cols-3'>
            {[
              {
                icon: 'fa-users-between-lines',
                number: '150+',
                text: 'Total Contingents'
              },
              {
                icon: 'fa-user-graduate',
                number: '500+',
                text: 'Total Participants'
              },
              { icon: 'fa-book', number: '25+', text: 'Perlombaan Kitab' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className='rounded-xl bg-[#f8f6f1] p-8 text-center'
                variants={itemVariants}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <i
                  className={`fa-solid ${item.icon} mb-4 text-4xl text-[#0C713D]`}
                />
                <h3 className='mb-2 text-4xl font-bold text-gray-800'>
                  {item.number}
                </h3>
                <p className='text-gray-600'>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/*latar belakang*/}
      <motion.section
        id='latar-belakang'
        className='flex min-h-[calc(100dvh-52px)] items-center bg-[#f8f6f1] py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className='container mx-auto px-4'>
          <motion.h2
            className='mb-16 text-center text-3xl font-bold text-gray-800'
            variants={sectionVariants}
          >
            Latar Belakang
          </motion.h2>
          <motion.div
            className='rounded-xl bg-white p-8 shadow-sm'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className='leading-relaxed text-gray-700'>
              Pesantren merupakan lembaga pendidikan tradisional yang berperan
              penting dalam mencetak sumber daya manusia yang kompeten di bidang
              agama, khususnya dalam memahami kitab kuning. Salah satu inovasi
              dalam pendidikan kitab kuning adalah metode Amtsilati, yang
              dikembangkan oleh KH Taufiqul Hakim, pengasuh Pondok Pesantren
              Darul Falah. Metode ini dirancang untuk mempermudah santri dalam
              memahami dan menghafal kitab kuning secara sistematis dan efektif.
            </p>
            <p className='mt-4 leading-relaxed text-gray-700'>
              Keberhasilan metode Amtsilati terlihat dari banyaknya pesantren
              yang mengadopsinya, menunjukkan bahwa pendekatan ini relevan
              dengan kebutuhan pendidikan modern. Dalam rangka memperingati hari
              kelahiran KH Taufiqul Hakim pada 7 Juni 2025 serta menghargai
              kontribusinya, diusulkan penyelenggaraan MQK Amtsilati Nusantara.
              Acara ini bertujuan sebagai ajang silaturahmi dan penguatan
              komitmen dalam melestarikan serta mengembangkan metode Amtsilati
              di pesantren-pesantren di Indonesia.
            </p>
          </motion.div>
        </div>
      </motion.section>
      {/* Schedule Section */}
      <motion.section
        id='schedule'
        className='flex min-h-[calc(100dvh-52px)] items-center bg-white py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className='container mx-auto px-4'>
          <motion.h2
            className='mb-16 text-center text-3xl font-bold text-gray-800'
            variants={sectionVariants}
          >
            Jadwal Pelaksanaan
          </motion.h2>
          <div className='grid gap-8 md:grid-cols-2'>
            <motion.div
              className='rounded-xl bg-[#f8f6f1] p-8 shadow-sm'
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h3 className='mb-6 text-xl font-semibold'>
                Competition Categories
              </h3>
              <div className='space-y-4'>
                {[
                  { title: 'Junior Category', desc: 'Ages 12-15' },
                  { title: 'Senior Category', desc: 'Ages 16-20' },
                  { title: 'Advanced Category', desc: 'Ages 21+' }
                ].map((cat, index) => (
                  <motion.div
                    key={index}
                    className='flex items-center gap-4 rounded-lg border border-gray-300 p-4'
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <i className='fa-solid fa-star text-[#0C713D]' />
                    <div>
                      <h4 className='font-semibold'>{cat.title}</h4>
                      <p className='text-sm text-gray-600'>{cat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className='rounded-xl bg-[#f8f6f1] p-8 shadow-sm'
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h3 className='mb-6 text-xl font-semibold'>Tanggal Penting</h3>
              <div className='space-y-4'>
                {[
                  { title: 'Pembukaan Pendaftaran', date: 'January 15, 2025' },
                  { title: 'Penutupan Pendaftaran', date: 'February 28, 2025' },
                  { title: 'Pelaksanaan', date: 'March 15-20, 2025' }
                ].map((event, index) => (
                  <motion.div
                    key={index}
                    className='flex items-center gap-4 rounded-lg border border-gray-300 p-4'
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <i className='fa-regular fa-calendar text-[#0C713D]' />
                    <div>
                      <h4 className='font-semibold'>{event.title}</h4>
                      <p className='text-sm text-gray-600'>{event.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Prizes Section */}
      <motion.section
        id='prizes'
        className='bg-[#f8f6f1] py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className='container mx-auto px-4'>
          <motion.h2
            className='mb-16 text-center text-3xl font-bold text-gray-800'
            variants={sectionVariants}
          >
            Prizes & Benefits
          </motion.h2>
          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                icon: 'fa-trophy',
                color: '#FFD700',
                title: 'Juara Umum',
                prize: 'Rp 15.000.000',
                benefits: [
                  'Piala & Sertifikat',
                  'Study Tour ke Timur Tengah',
                  'Complete Set of Islamic Books'
                ]
              },
              {
                icon: 'fa-medal',
                color: '#C0C0C0',
                title: 'Second Prize',
                prize: 'Rp 10.000.000',
                benefits: [
                  'Piala & Sertifikat',
                  'Complete Set of Islamic Books',
                  'Educational Scholarship'
                ]
              },
              {
                icon: 'fa-award',
                color: '#CD7F32',
                title: 'Third Prize',
                prize: 'Rp 7.500.000',
                benefits: [
                  'Piala & Sertifikat',
                  'Selected Islamic Books',
                  'Educational Scholarship'
                ]
              }
            ].map((prize, index) => (
              <motion.div
                key={index}
                className='group relative overflow-hidden rounded-xl bg-white p-8 text-center transition-all hover:shadow-lg'
                variants={itemVariants}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className='absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-[#0C713D]/10' />
                <i
                  className={`fa-solid ${prize.icon} mb-6 text-6xl`}
                  style={{ color: prize.color }}
                />
                <h3 className='mb-2 text-2xl font-bold'>{prize.title}</h3>
                <p className='mb-4 text-3xl font-bold text-[#0C713D]'>
                  {prize.prize}
                </p>
                <ul className='space-y-2 text-gray-600'>
                  {prize.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Registration Section */}
      <motion.section
        id='registration'
        className='bg-white py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className='container mx-auto px-4'>
          <motion.h2
            className='mb-16 text-center text-3xl font-bold text-gray-800'
            variants={sectionVariants}
          >
            Daftar Sekarang
          </motion.h2>
          <motion.div
            className='mx-auto max-w-2xl rounded-xl bg-[#f8f6f1] p-8'
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <form className='space-y-6'>
              <div className='grid gap-6 md:grid-cols-2'>
                {['Nama Lengkap', 'Email Address'].map((label, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label className='mb-2 block text-sm font-medium text-gray-700'>
                      {label}
                    </label>
                    <input
                      type={label === 'Email Address' ? 'email' : 'text'}
                      className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0C713D]'
                    />
                  </motion.div>
                ))}
              </div>
              <div className='grid gap-6 md:grid-cols-2'>
                {['Phone Number', 'Institution'].map((label, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label className='mb-2 block text-sm font-medium text-gray-700'>
                      {label}
                    </label>
                    <input
                      type={label === 'Phone Number' ? 'tel' : 'text'}
                      className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0C713D]'
                    />
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Competition Category
                </label>
                <select className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0C713D]'>
                  <option>Select Category</option>
                  <option>Junior Category</option>
                  <option>Senior Category</option>
                  <option>Advanced Category</option>
                </select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Upload Documents
                </label>
                <div className='rounded-lg border-2 border-dashed border-gray-300 p-6 text-center'>
                  <i className='fa-solid fa-cloud-arrow-up mb-2 text-3xl text-gray-400' />
                  <p className='text-sm text-gray-600'>
                    Drag and drop your files here or click to browse
                  </p>
                </div>
              </motion.div>
              <motion.button
                type='submit'
                className='bg-primary w-full rounded-lg py-3 font-semibold text-white hover:bg-[#0C713D]/90'
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Submit Registration
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id='contact'
        className='bg-[#f8f6f1] py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className='container mx-auto px-4'>
          <motion.h2
            className='mb-16 text-center text-3xl font-bold text-gray-800'
            variants={sectionVariants}
          >
            Hubungi Kami
          </motion.h2>
          <div className='grid gap-8 md:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className='mb-8 rounded-xl bg-white p-8'>
                <h3 className='mb-6 text-xl font-semibold'>Hubungi Kami</h3>
                <div className='space-y-4'>
                  {[
                    {
                      icon: <NavigationIcon className={'w-8'} />,
                      text: 'Dk, Gg. Kenanga II, RT.03/RW.12, Krsak, Sidorejo, Kec. Bangsri, Kabupaten Jepara, Jawa Tengah 59453'
                    },
                    {
                      icon: <PhoneIcon className={'w-8'} />,
                      text: '081392275877'
                    },
                    {
                      icon: <GlobeIcon className={'w-8'} />,
                      text: 'www.amtsilatipusat.net',
                      href: 'https://www.amtsilatipusat.net'
                    }
                  ].map((contact, index) => (
                    <motion.div
                      key={index}
                      className='flex items-center gap-4'
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {contact.icon}
                      {contact.href ? (
                        <a href={contact.href} className='text-gray-600'>
                          {contact.text}
                        </a>
                      ) : (
                        <p className='text-gray-600'>{contact.text}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className='flex gap-4'>
                {[
                  <FacebookIcon key={'123'} />,
                  <InstagramIcon key={'134'} />,
                  <YoutubeIcon key={'145'} />,
                  <FacebookIcon key={'878'} />
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href='#'
                    className='bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white hover:bg-[#0C713D]/90'
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            <motion.div
              className='h-[400px] overflow-hidden rounded-xl bg-white'
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.991256201908!2d110.7605315!3d-6.5227862000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7123acd05acbdf%3A0xcbfd3224fb340da6!2sPondok%20Pesantren%20Darul%20Falah%20Amtsilati!5e0!3m2!1sen!2sid!4v1741556648799!5m2!1sen!2sid'
                width='100%'
                height='100%'
                frameBorder={0}
                style={{ border: 0 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className='bg-primary py-12 text-white'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className='container mx-auto px-4'>
          <div className='mb-8 grid gap-8 md:grid-cols-4'>
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
                Bergabunglah bersama kami dalam merayakan dan melestarikan
                tradisi yang kaya dari kompetisi membaca Kitab Kuning.
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
            <motion.div
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
            </motion.div>
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
                  <i className='fa-solid fa-paper-plane' />
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
    </ScrollArea>
  );
};

export default Page;
