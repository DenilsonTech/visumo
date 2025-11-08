"use client"

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addMinutes,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { pt } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from 'react-datepicker';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { avatarImages } from '@/components/constants';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Mail,
  Plus,
} from 'lucide-react';
import Loader from '@/components/Loader';

const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const Upcoming = () => {
  const router = useRouter();
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { upcomingCalls = [], isLoading, refetchCalls } = useGetCalls();

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState<Date>(new Date());
  const [invitees, setInvitees] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isScheduleOpen) {
      setMeetingDate(selectedDate);
    }
  }, [isScheduleOpen, selectedDate]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const meetingsByDate = useMemo(() => {
    const map: Record<string, Call[]> = {};

    upcomingCalls.forEach((call) => {
      const start = call.state?.startsAt ? new Date(call.state.startsAt) : null;
      if (!start) return;

      const key = format(start, 'yyyy-MM-dd');
      map[key] = map[key] ? [...map[key], call] : [call];
    });

    return map;
  }, [upcomingCalls]);

  const selectedKey = format(selectedDate, 'yyyy-MM-dd');
  const meetingsForSelectedDay = useMemo(() => {
    const meetings = meetingsByDate[selectedKey] || [];
    return [...meetings].sort((a, b) => {
      const startA = a.state?.startsAt ? new Date(a.state.startsAt).getTime() : 0;
      const startB = b.state?.startsAt ? new Date(b.state.startsAt).getTime() : 0;
      return startA - startB;
    });
  }, [meetingsByDate, selectedKey]);

  const handleCreateMeeting = useCallback(async () => {
    if (!client || !user) {
      toast({
        title: 'Inicie sessão para agendar',
        description: 'É necessário estar autenticado para criar reuniões.',
        variant: 'destructive',
      });
      return;
    }

    if (!meetingTitle.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Dê um nome para a reunião.',
        variant: 'destructive',
      });
      return;
    }

    if (!meetingDate) {
      toast({
        title: 'Selecione data e hora',
        description: 'Escolha quando a reunião vai acontecer.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            title: meetingTitle,
            description: meetingDescription,
            guestEmails: invitees
              .split(',')
              .map((email) => email.trim())
              .filter(Boolean),
          },
        },
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const meetingLink = `${baseUrl}/meeting/${id}`;

      navigator.clipboard.writeText(meetingLink).catch(() => null);

      toast({
        title: 'Reunião agendada',
        description: 'Link copiado para sua área de transferência.',
      });

      setIsScheduleOpen(false);
      setMeetingTitle('');
      setMeetingDescription('');
      setInvitees('');
      setSelectedDate(meetingDate);
      await refetchCalls();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao criar reunião',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    client,
    user,
    meetingTitle,
    meetingDescription,
    meetingDate,
    invitees,
    toast,
    refetchCalls,
  ]);

  const renderCalendarDay = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    const hasMeetings = (meetingsByDate[key] || []).length > 0;
    const isSelected = isSameDay(day, selectedDate);
    const isCurrent = isSameMonth(day, currentMonth);

    return (
      <button
        key={day.toISOString()}
        onClick={() => setSelectedDate(day)}
        className={cn(
          'relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition',
          isSelected
            ? 'bg-blue-500 text-white'
            : isCurrent
              ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              : 'text-slate-400'
        )}
      >
        {format(day, 'd')}
        {hasMeetings && (
          <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-300" />
        )}
      </button>
    );
  };

  const formatMeetingTime = (call: Call) => {
    const start = call.state?.startsAt ? new Date(call.state.startsAt) : null;
    if (!start) return 'Sem horário';
    const end = addMinutes(start, 30);
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  return (
    <section className="space-y-6 text-slate-900 dark:text-white">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Agenda</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendário</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Visualize rapidamente as próximas reuniões e agende novos encontros.
          </p>
        </div>
        <Button
          className="flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-5 text-sm font-semibold text-white shadow-blue-500/30 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          onClick={() => setIsScheduleOpen(true)}
        >
          <Plus size={18} />
          Criar reunião
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              >
                <ChevronLeft />
              </Button>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {format(currentMonth, "MMMM yyyy", { locale: pt })}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
              {dayLabels.map((label, index) => (
                <span key={`${label}-${index}`}>{label}</span>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {calendarDays.map((day) => renderCalendarDay(day))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Reuniões em {format(selectedDate, "dd 'de' MMMM", { locale: pt })}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Clique em um dia no calendário para filtrar.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader />
              </div>
            ) : meetingsForSelectedDay.length ? (
              meetingsForSelectedDay.map((meeting) => {
                const title =
                  meeting.state?.custom?.title ||
                  meeting.state?.custom?.description ||
                  'Reunião';
                const actionLabel = isSameDay(
                  meeting.state?.startsAt ? new Date(meeting.state.startsAt) : new Date(),
                  new Date()
                )
                  ? 'Entrar'
                  : 'Ver detalhes';

                return (
                  <div
                    key={meeting.id}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-200">
                      <CalendarDays size={22} />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-base font-semibold text-slate-900 dark:text-white">{title}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Clock3 size={14} />
                        {formatMeetingTime(meeting)}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {avatarImages.slice(0, 3).map((img, index) => (
                            <Image
                              key={`${meeting.id}-avatar-${index}`}
                              src={img}
                              alt="Participante"
                              width={28}
                              height={28}
                              className="h-7 w-7 rounded-full border-2 border-white object-cover dark:border-slate-900"
                            />
                          ))}
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                            +2
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/meeting/${meeting.id}`)}
                          className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-300"
                        >
                          {actionLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                <CalendarDays className="mb-3 h-6 w-6" />
                <p className="text-sm font-semibold">Nenhuma reunião neste dia</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Clique em “Criar reunião” para agendar algo para esta data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-slate-800 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Agendar nova reunião
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Nome da reunião
              </label>
              <Input
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Ex: Revisão de Sprint"
                className="mt-2 border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Descrição
              </label>
              <Textarea
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                placeholder="Notas, pauta ou contexto para o encontro"
                className="mt-2 border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Data e hora
              </label>
              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900">
                <ReactDatePicker
                  selected={meetingDate}
                  onChange={(date) => setMeetingDate(date!)}
                  showTimeSelect
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  locale={pt}
                  minDate={new Date()}
                  className="w-full bg-transparent text-slate-900 focus:outline-none dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Mail size={16} />
                Convidados (separe por vírgula)
              </label>
              <Textarea
                value={invitees}
                onChange={(e) => setInvitees(e.target.value)}
                placeholder="ana@email.com, joao@email.com"
                className="mt-2 border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Avisaremos os participantes com o link da reunião.
              </p>
            </div>
            <Button
              className="w-full rounded-2xl bg-blue-500 py-3 text-sm font-semibold text-white shadow-blue-500/30 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
              onClick={handleCreateMeeting}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Agendando...
                </span>
              ) : (
                'Agendar reunião'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Upcoming;
