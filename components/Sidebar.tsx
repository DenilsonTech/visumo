"use client"

import React from 'react'
import { sidebarLinks } from './constants'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'

const Sidebar = () => {
    const pathname = usePathname();

  return (
    <aside className='sticky top-0 hidden h-screen w-72 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white/90 p-6 text-slate-600 shadow-sm backdrop-blur max-xl:w-64 lg:flex dark:bg-slate-950/60 dark:border-slate-800'>
      <div>
        <div className='mb-10 flex items-center gap-3 px-2'>
          <div className='rounded-2xl bg-blue-500/10 p-2'>
            <Image src="/icons/logo.svg" alt="Visumo logo" width={32} height={32} />
          </div>
          <div>
            <p className='text-xl font-black text-slate-900 dark:text-white'>Visumo</p>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>Video workspace</p>
          </div>
        </div>

        <nav className='space-y-2'>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
            const Icon = link.icon;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={cn(
                  'group flex items-center gap-4 rounded-2xl border px-3 py-3 text-sm font-semibold transition-all',
                  isActive
                    ? 'border-blue-400/40 bg-blue-500/10 text-blue-600 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-100'
                    : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/80 dark:text-slate-300 dark:hover:bg-slate-900/40'
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-2xl border text-base transition-all',
                    isActive
                      ? 'border-transparent bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : link.accent
                  )}
                >
                  <Icon size={18} />
                </span>
                <span className='text-base font-semibold text-slate-900 dark:text-white'>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-center dark:border-blue-500/30 dark:bg-blue-500/10'>
        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-500 shadow-sm dark:bg-slate-900'>
          <Sparkles size={22} />
        </div>
        <h3 className='text-base font-semibold text-slate-900 dark:text-white'>Unlock More Features 🚀</h3>
        <p className='mt-1 text-xs text-slate-500 dark:text-slate-300'>
          Upgrade para o plano Pro e leve suas reuniões ao próximo nível.
        </p>
        <button className='mt-4 w-full rounded-xl bg-blue-500 py-2 text-sm font-semibold text-white shadow hover:bg-blue-600 transition'>
          Upgrade to Pro
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
