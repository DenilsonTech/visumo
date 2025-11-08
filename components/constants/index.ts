import type { LucideIcon } from "lucide-react";
import {
    CalendarDays,
    History,
    Home,
    PlayCircle,
    UserRound,
} from "lucide-react";

export type SidebarLink = {
    label: string;
    route: string;
    description?: string;
    icon: LucideIcon;
};

export const sidebarLinks: SidebarLink[] = [
    {
        label: "Home",
        route: '/',
        description: 'Dashboard overview',
        icon: Home,
    },
    {
        label: "Upcoming",
        route: '/upcoming',
        description: 'Próximas reuniões',
        icon: CalendarDays,
    },
    {
        label: "History",
        route: '/previous',
        description: 'Reuniões anteriores',
        icon: History,
    },
    {
        label: "Recordings",
        route: '/recordings',
        description: 'Reveja gravações',
        icon: PlayCircle,
    },
    {
        label: "Personal Room",
        route: '/personal-room',
        description: 'Sala pessoal',
        icon: UserRound,
    },
]

export const avatarImages =  [
    '/images/avatar-1.jpeg',
    '/images/avatar-2.jpeg',
    '/images/avatar-3.png',
    '/images/avatar-4.png',
    '/images/avatar-5.png',
]
