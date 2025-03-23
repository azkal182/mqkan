import type { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'MQK Amtsilati Nusantara',
  description: 'MQK Amtsilati Nusantara'
};

export default async function BlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
