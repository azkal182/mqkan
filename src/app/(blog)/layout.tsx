import type { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'MQK Amtsilati se Nusantara',
  description: 'MQK Amtsilati se Nusantara'
};

export default async function BlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
