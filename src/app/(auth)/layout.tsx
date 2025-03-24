import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import Head from 'next/head';
import OverflowHiddenFix from '../overflow-hidden-fix';

export const metadata: Metadata = {
  title: 'MQK Amtsilati se Nusantara',
  description: 'MQK Amtsilati se Nusantara'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OverflowHiddenFix></OverflowHiddenFix>
      <div>{children}</div>
    </>
  );
}
