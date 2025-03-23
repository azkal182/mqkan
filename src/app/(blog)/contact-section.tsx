'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  NavigationIcon,
  PhoneIcon,
  YoutubeIcon
} from 'lucide-react';

// Variants for section animations
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const ContactSection = ({ even }: { even: boolean }) => {
  return (
    <motion.section
      id='contact'
      className={`${even ? 'bg-white' : 'bg-[#f8f6f1]'} py-20`}
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
                    icon: (
                      <NavigationIcon className={'h-6 w-6 flex-shrink-0'} />
                    ),
                    text: 'Dk, Gg. Kenanga II, RT.03/RW.12, Krsak, Sidorejo, Kec. Bangsri, Kabupaten Jepara, Jawa Tengah 59453'
                  },
                  {
                    icon: (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        fill='currentColor'
                        viewBox='0 0 16 16'
                      >
                        <path d='M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232' />
                      </svg>
                    ),
                    text: '0822-9142-4341',
                    href: 'https://wa.me/6282291424341'
                  },
                  {
                    icon: <GlobeIcon className={'h-6 w-6 flex-shrink-0'} />,
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
                    {/* ikon ini menyusut yang menjadikan ukuran berbeda beda saat posisi mobile atau space tidak mencukupi */}
                    {contact.icon}
                    {contact.href ? (
                      <a
                        target='_blank'
                        href={contact.href}
                        className='text-gray-600'
                      >
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
                {
                  icon: <FacebookIcon key={'123'} />,
                  link: 'https://www.facebook.com/share/1EXPa5wAvp/?mibextid=LQQJ4d'
                },
                {
                  icon: <InstagramIcon key={'134'} />,
                  link: 'https://www.instagram.com/amtsilatipusat?igsh=eG91aGowdnI0ZTFk'
                },
                {
                  icon: <YoutubeIcon key={'145'} />,
                  link: 'https://www.youtube.com/@AmtsilatiPusat'
                },
                {
                  icon: (
                    <svg
                      width={24}
                      height={24}
                      viewBox='0 0 24 24'
                      fill={'#fff'}
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M12 2C12.6 7 15.5 9 19 9V12C16.4 11.9 14.5 10.7 13.2 9.2V15.8C13.2 18.6 11 21 8.2 21C5.4 21 3.2 18.8 3.2 16C3.2 13.2 5.4 11 8.2 11C8.6 11 9 11.1 9.4 11.2V14.3C9 14.1 8.6 14 8.2 14C7 14 6 15 6 16.2C6 17.4 7 18.4 8.2 18.4C9.4 18.4 10.4 17.4 10.4 16.2V2H12Z' />
                    </svg>
                  ),
                  link: 'https://www.tiktok.com/@amtsilatipusat'
                }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target='_blank'
                  className='bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white hover:bg-[#0C713D]/90'
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {social.icon}
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
  );
};

export default ContactSection;
