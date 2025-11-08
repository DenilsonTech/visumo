"use client"

import { SignedIn, UserButton } from '@clerk/nextjs'
import { Bell, Search } from 'lucide-react'
import React from 'react'
import MobileNav from './MobileNav'
import { ModeToggle } from './ui/theme-toggle'

const Navbar = () => {
  return (
    <header className='sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80'>
      <div className='flex flex-1 items-center gap-3'>
        <div className='sm:hidden'>
          <MobileNav />
        </div>
        <div className='relative hidden w-full max-w-md items-center sm:flex'>
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            placeholder='Search any meeting'
            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <ModeToggle/>
        <button className='relative rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
          <Bell size={20} />
          <span className='absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500'></span>
        </button>
        <SignedIn>
          <UserButton appearance={{ elements: { userButtonAvatarBox: 'h-9 w-9' } }} />
        </SignedIn>
      </div>
    </header>
  )
}

export default Navbar
