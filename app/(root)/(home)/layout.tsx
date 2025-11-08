import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "VISUMO",
  description: "Aplicatico de vídeo chamada",
  icons: {
    icon: '/icons/logo.svg'
  }
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950'>
      <Sidebar />

      <section className='flex min-h-screen flex-1 flex-col'>
        <Navbar />
        <div className='flex-1 overflow-y-auto px-4 py-6 sm:px-10 lg:px-14'>
          <div className='mx-auto w-full max-w-7xl'>
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomeLayout
