"use client"

import React from 'react'
import { sidebarLinks } from './constants'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Video } from 'lucide-react'

const Sidebar = () => {
    const pathname = usePathname();

  return (
    <aside className='sticky top-0 hidden h-screen w-72 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white/90 p-6 text-slate-600 shadow-sm backdrop-blur max-xl:w-64 lg:flex dark:bg-slate-950/60 dark:border-slate-800'>
      <div>
        <div className='mb-8 flex items-center gap-3 px-2'>
          <div className='rounded-2xl bg-blue-500 p-2 text-white'>
            <Video size={22} />
          </div>
          <div>
            <p className='text-lg font-bold text-slate-900 dark:text-white'>Meetingerz</p>
            <p className='text-xs text-slate-400'>Meeting App Dashboard</p>
          </div>
        </div>

        <nav className='space-y-1'>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
            const Icon = link.icon;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg border text-slate-500', isActive ? 'border-blue-100 bg-white' : 'border-transparent bg-slate-100 dark:bg-slate-900/60')}>
                  <Icon size={18} />
                </span>
                <div className='flex flex-col'>
                  <span>{link.label}</span>
                  {link.description && (
                    <span className='text-xs font-normal text-slate-400 dark:text-slate-500'>
                      {link.description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-center dark:border-blue-500/30 dark:bg-blue-500/10'>
        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-500 shadow-sm dark:bg-slate-900'>
          <Video size={24} />
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
