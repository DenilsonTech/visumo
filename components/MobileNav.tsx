"use client"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "./constants"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Video } from "lucide-react"
import Link from "next/link"


const MobileNav = () => {
    const pathname = usePathname();

    return (
        <div className='sm:hidden'>
            <Sheet>
                <SheetTrigger className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm">
                    <span className="sr-only">Abrir menu</span>
                    <Video size={20} />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-white px-0 py-10 text-slate-900 dark:bg-slate-950 dark:text-white">
                    <div className="px-6">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="rounded-2xl bg-blue-500 p-2 text-white">
                                <Video size={20} />
                            </div>
                            <div>
                                <p className="text-lg font-bold">Meetingerz</p>
                                <p className="text-xs text-slate-400">Meeting App Dashboard</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            {sidebarLinks.map((link) => {
                                const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
                                const Icon = link.icon;

                                return (
                                    <SheetClose asChild key={link.route}>
                                        <Link
                                            href={link.route}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold',
                                                isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            )}
                                        >
                                            <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl border', isActive ? 'border-blue-100 bg-white' : 'border-slate-200 bg-slate-50')}>
                                                <Icon size={18} />
                                            </span>
                                            <div className="flex flex-col">
                                                <span>{link.label}</span>
                                                {link.label && (
                                                    <span className="text-xs font-normal text-slate-400">
                                                        {link.label}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    </SheetClose>
                                );
                            })}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileNav
