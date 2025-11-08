"use client";

import Image from "next/image";

import { Button } from "./ui/button";

import { useToast } from "./ui/use-toast";
import { avatarImages } from "./constants";
import { CalendarDays, Users } from "lucide-react";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText = "Entrar",
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="flex w-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <article className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Image src={icon} alt="meeting type" width={24} height={24} />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <CalendarDays size={16} />
              {date}
            </p>
          </div>
        </div>
      </article>

      <article className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center">
          <div className="flex min-w-[160px]">
            {avatarImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt="attendees"
                width={36}
                height={36}
                className="rounded-full border-2 border-white shadow-sm dark:border-slate-900 -ml-3 first:ml-0"
              />
            ))}
          </div>
          <span className="ml-6 flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <Users size={14} />
            +5 participantes
          </span>
        </div>

        {!isPreviousMeeting && (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleClick}
              className="rounded-2xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-blue-500/30 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={18} height={18} className="mr-1" />
              )}
              {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copiado",
                });
              }}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Copiar link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
