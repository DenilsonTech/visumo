import type { LucideIcon } from "lucide-react";
import {
    AlarmClockCheck,
    CalendarCheck,
    House,
    Inbox,
    NotebookTabs,
} from "lucide-react";

export type SidebarLink = {
    label: string;
    route: string;
    icon: LucideIcon;
    accent: string;
};

export const sidebarLinks: SidebarLink[] = [
    {
        label: "Home",
        route: '/',
        icon: House,
        accent: 'border-transparent bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200',
    },
    {
        label: "Upcoming",
        route: '/upcoming',
        icon: CalendarCheck,
        accent: 'border-transparent bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-200',
    },
    {
        label: "History",
        route: '/previous',
        icon: AlarmClockCheck,
        accent: 'border-transparent bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-200',
    },
    {
        label: "Recordings",
        route: '/recordings',
        icon: Inbox,
        accent: 'border-transparent bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200',
    },
    {
        label: "Personal Room",
        route: '/personal-room',
        icon: NotebookTabs,
        accent: 'border-transparent bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-200',
    },
]

export const avatarImages =  [
    '/images/avatar-1.jpeg',
    '/images/avatar-2.jpeg',
    '/images/avatar-3.png',
    '/images/avatar-4.png',
    '/images/avatar-5.png',
]
