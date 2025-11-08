"use client"

import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, CallRecording, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { pt } from 'date-fns/locale/pt';
import { Input } from './ui/input'
import {
    CalendarDays,
    Clock4,
    Link2,
    MoreHorizontal,
    PlayCircle,
    Sparkles,
    Upload,
    Video,
} from 'lucide-react'
import { useGetCalls } from '@/hooks/useGetCalls'

registerLocale('pt', pt);

const meetingNotes = [
    {
        id: 1,
        title: 'Digital Marketing Presentation',
        tag: 'Team Sync',
        schedule: 'April 02, 2025 • 10:00 – 11:30',
        summary: '80% das tarefas do sprint concluídas. Risco identificado no atraso de integração da API, mitigação em andamento com a equipa backend.',
    },
    {
        id: 2,
        title: 'Presentation Marketing Mix',
        tag: 'Team Sync',
        schedule: 'April 20, 2025 • 10:00 – 11:30',
        summary: 'Estratégia Q2 finalizada com ajuste de 15% no orçamento. Mapeados próximos passos para dashboard de performance.',
    },
];

const upcomingMeetings = [
    {
        id: 1,
        title: 'Presentation Final Project',
        date: 'Thursday, 4 April 2025',
        time: '09:00 AM',
        color: 'text-blue-600',
        actions: ['Remind set'],
    },
    {
        id: 2,
        title: 'Product Roadmap Discussion',
        date: 'April 20, 2025 • 10:00 – 12:00',
        time: '',
        color: 'text-slate-700',
        actions: ['Remind set'],
    },
    {
        id: 3,
        title: 'Presentation Marketing Mix',
        date: 'April 28, 2025 • 10:00 – 12:00',
        time: '',
        color: 'text-purple-600',
        actions: ['Remind set'],
    },
    {
        id: 4,
        title: 'Discussion with Developer',
        date: 'April 27, 2025 • 10:00 – 12:00',
        time: '',
        color: 'text-green-600',
        actions: ['Set reminder'],
    },
];

const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isIstantMeeting' | undefined >()
    const router = useRouter()
    const { user } = useUser()
    const client = useStreamVideoClient()
    const { callRecordings } = useGetCalls();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })

    const [callDetails, setCallDetails] = useState<Call>();
    const [latestRecordings, setLatestRecordings] = useState<CallRecording[]>([]);
    const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);
    const { toast } = useToast()

    const createMeeting = async () => {
         if(!client || !user ) return;

         try {
            if(!values.dateTime) {
                toast({ title: "Por favor selecione a data e a hora "})
                return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if(!call) throw new Error('Failed to create a call');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Reunião Estantânea';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description 
                    }
                }
            })

            setCallDetails(call);

            if(!values.description) {
                router.push(`/meeting/${call.id}`)
            }
            toast({ title: "Reunião Criada", })
         } catch (error) {
            console.log(error)
            toast({ title: "Erro ao criar uma Reunião", })
         }
    }

    useEffect(() => {
      const fetchLatestRecordings = async () => {
        if (!callRecordings || callRecordings.length === 0) {
          setLatestRecordings([]);
          return;
        }
        setIsLoadingRecordings(true);
        try {
          const recordingsResponses = await Promise.all(
            callRecordings.map((meeting) => meeting.queryRecordings())
          );

          const recordings = recordingsResponses
            .flatMap((response) => response.recordings)
            .sort((a, b) => {
              const dateA = a.start_time ? new Date(a.start_time).getTime() : 0;
              const dateB = b.start_time ? new Date(b.start_time).getTime() : 0;
              return dateB - dateA;
            })
            .slice(0, 3);

          setLatestRecordings(recordings);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingRecordings(false);
        }
      };

      fetchLatestRecordings();
    }, [callRecordings]);

    const greeting = useMemo(() => {
        if (user?.firstName) return `Welcome back, ${user.firstName}! 👋`;
        return 'Welcome back! 👋';
    }, [user?.firstName]);

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    const formatRecordingDate = (value?: string) => {
      if (!value) return 'Data indisponível';
      return new Date(value).toLocaleString('pt-PT', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    };

  return (
    <>
      <section className='space-y-8 text-slate-800'>
        <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>{greeting}</h1>
              <p className='mt-2 text-sm text-slate-500 dark:text-slate-300'>
                Here&apos;s what&apos;s on o seu calendário hoje. Continue produtivo e deixe a IA cuidar das anotações por você!
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => router.push('/recordings')}
                className='flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
              >
                <Upload size={18} />
                Export transcripts
              </button>
              <button
                onClick={() => setMeetingState('isScheduleMeeting')}
                className='flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-900/40 dark:text-blue-200'
              >
                <CalendarDays size={18} />
                Schedule meeting
              </button>
              <button
                onClick={() => setMeetingState('isIstantMeeting')}
                className='flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600'
              >
                <Video size={18} />
                Start new meeting
              </button>
            </div>
          </div>

          <div className='mt-6 grid gap-4 sm:grid-cols-3'>
            {[
              {
                title: 'View recordings',
                description: 'Revise conteúdos anteriores',
                action: () => router.push('/recordings'),
                icon: PlayCircle,
                color: 'text-blue-500',
              },
              {
                title: 'Join with link',
                description: 'Use um link de convite',
                action: () => setMeetingState('isJoiningMeeting'),
                icon: Link2,
                color: 'text-purple-500',
              },
              {
                title: 'Sala pessoal',
                description: 'Entre no seu espaço privado',
                action: () => router.push('/personal-room'),
                icon: Sparkles,
                color: 'text-amber-500',
              },
            ].map((card) => (
              <button
                key={card.title}
                onClick={card.action}
                className='flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
              >
                <span className={`rounded-2xl bg-slate-50 p-2 text-xl ${card.color} dark:bg-slate-800`}>
                  <card.icon size={22} />
                </span>
                <div>
                  <p className='text-sm font-semibold text-slate-900 dark:text-white'>{card.title}</p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>{card.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Latest Meeting & Recording</h3>
                  <p className='text-sm text-slate-500 dark:text-slate-300'>Acompanhe as sessões mais recentes.</p>
                </div>
                <button className='text-sm font-semibold text-blue-600 hover:underline'>See all</button>
              </div>
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {isLoadingRecordings ? (
                  <div className='col-span-full flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300'>
                    A carregar últimas gravações...
                  </div>
                ) : latestRecordings.length > 0 ? (
                  latestRecordings.map((recording) => (
                    <article key={recording.id || recording.filename} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                      <div className='relative mb-3 flex h-32 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900'>
                        <PlayCircle className='h-12 w-12 text-blue-500 dark:text-blue-300' />
                        <span className='absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white'>
                          Recording
                        </span>
                      </div>
                      <h4 className='text-sm font-semibold text-slate-900 dark:text-white line-clamp-2'>
                        {recording.filename || 'Recording'}
                      </h4>
                      <p className='mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400'>
                        <CalendarDays size={14} />
                        {formatRecordingDate(recording.start_time)}
                      </p>
                      <button
                        onClick={() => recording.url && window.open(recording.url, '_blank')}
                        className='mt-3 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-300'
                      >
                        <PlayCircle size={16} />
                        Assistir gravação
                      </button>
                    </article>
                  ))
                ) : (
                  <div className='col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300'>
                    Ainda não existem gravações. Assim que gravar as reuniões, elas aparecem aqui automaticamente.
                  </div>
                )}
              </div>
            </section>

            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Recent meeting notes</h3>
                <button className='text-sm font-semibold text-blue-600 hover:underline'>See all</button>
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                {meetingNotes.map((note) => (
                  <article key={note.id} className='flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-200'>{note.tag}</span>
                        <h4 className='mt-3 text-base font-semibold text-slate-900 dark:text-white'>{note.title}</h4>
                        <p className='mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
                          <Clock4 size={14} />
                          {note.schedule}
                        </p>
                      </div>
                      <button className='rounded-full p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'>
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                    <div className='mt-4 flex items-start gap-3 text-sm'>
                      <Sparkles className='mt-1 text-blue-500' size={18} />
                      <p className='text-slate-500 dark:text-slate-300 line-clamp-3'>{note.summary}</p>
                    </div>
                    <div className='mt-auto flex justify-end gap-4 text-xs font-semibold text-slate-500 dark:text-slate-300'>
                      <button className='flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-300'>
                        <PlayCircle size={14} />
                        View more
                      </button>
                      <button className='flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-300'>
                        <Sparkles size={14} />
                        Edit notes
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Upcoming meetings</h3>
              <button className='flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'>
                <CalendarDays size={14} />
                Today
              </button>
            </div>
            <div className='space-y-4'>
              {upcomingMeetings.map((meeting) => (
                <article key={meeting.id} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900'>
                  <div className={`mb-2 flex items-center gap-2 font-semibold ${meeting.color}`}>
                    <PlayCircle size={18} />
                    <h4>{meeting.title}</h4>
                  </div>
                  {meeting.time && (
                    <p className='text-3xl font-bold text-slate-900 dark:text-white'>{meeting.time}</p>
                  )}
                  <p className='text-xs text-slate-500 dark:text-slate-400'>{meeting.date}</p>
                  <div className='mt-3 flex flex-wrap gap-3 text-xs font-semibold'>
                    {meeting.actions.map((action) => (
                      <span key={action} className='flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                        <Sparkles size={14} />
                        {action}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className='mt-6 space-y-3'>
              <button
                onClick={() => setMeetingState('isScheduleMeeting')}
                className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
              >
                + Agendar novo evento
              </button>
              <button
                onClick={() => setMeetingState('isJoiningMeeting')}
                className='w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-200'
              >
                Inserir link e participar
              </button>
            </div>
          </section>
        </div>
      </section>

      {!callDetails ? (
        <MeetingModal 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title = "Agendar Reunião"
            handleClick={createMeeting}
        >
            <div className='flex flex-col gap-2.5'>
                <label className='text-base font-medium text-slate-700 dark:text-slate-200'>
                    Adicione uma descrição</label>
                    <Textarea className='border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                        onChange={(e) => {
                            setValues({...values, description: e.target.value})
                        }}/>
            </div>
            <div className='flex w-full flex-col gap-2.5'>
                <label className='text-base font-medium text-slate-700 dark:text-slate-200'>
                    Selecione a Data e Hora</label>
                    <ReactDatePicker
                        selected={values.dateTime}
                        onChange={(date) => setValues({...values, dateTime: date!})}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        timeCaption='time'
                        dateFormat="MMM d, yyyy h:mm aa"
                        locale="pt"
                        className='w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                    />
            </div>
        </MeetingModal>
        ): (
            <MeetingModal 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title = "Reunião Criada"
            className='text-center'
            handleClick={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({ title: 'Link Copiado'})
            }}
            image='/icons/checked.svg'
            buttonIcon='/icons/copy.svg'
            buttonText='Copiar Link da Reunião'
        />
        )}

        <MeetingModal 
            isOpen={meetingState === 'isIstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title = "Começar uma Reunião Agora"
            className='text-center'
            buttonText = "Começar Reunião"
            handleClick={createMeeting}
        />
        <MeetingModal 
            isOpen={meetingState === 'isJoiningMeeting'}
            onClose={() => setMeetingState(undefined)}
            title = "Insira o link aqui"
            className='text-center'
            buttonText = "Entrar na Reunião"
            handleClick={() => router.push(values.link)}
        >
            <Input 
                placeholder='Link da reunião' 
                className='border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                onChange={(e) => setValues({...values, link: e.target.value})}
            />
        </MeetingModal>
    </>
  )
}

export default MeetingTypeList
