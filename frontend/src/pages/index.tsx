import React from 'react';
import Head from 'next/head';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <>
      <Head>
        <title>🚀 Super Slim AI Marketing Dashboard</title>
        <meta name="description" content="Autonoom AI Marketing Dashboard met lokale AI modellen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Dashboard />
      </main>
    </>
  );
}
