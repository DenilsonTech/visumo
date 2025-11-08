import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import Image from "next/image";
  

import React, { ReactNode } from 'react'
import { Button } from "./ui/button";

interface MeetingModalProps {
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    className?: string; 
    children?: ReactNode; 
    handleClick?: () => void;
    buttonText?: string; 
    image?: string; 
    buttonIcon?: string;
}

const MeetingModal = ({ isOpen, onClose, title, className, children, handleClick, buttonText, image, buttonIcon }: MeetingModalProps) => {
  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-8 py-9 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-white">
              <div className="flex flex-col gap-4 text-center">
                {image && (
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                        <Image src={image} alt="image" width={48} height={48}/>
                    </div>
                )}
                <h1 className={cn('text-2xl font-bold leading-tight text-slate-900 dark:text-white', className)}>{title}</h1>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                {children}
              </div>
              <Button className="rounded-2xl bg-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 focus-visible:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500" onClick={handleClick}>
                {buttonIcon && (
                    <Image src={buttonIcon} alt="button icon" width={13} height={13}/>
                )} &nbsp;
                {buttonText || 'Agendar Reunião'}
              </Button>
          </DialogContent>
      </Dialog>
  )
}

export default MeetingModal
