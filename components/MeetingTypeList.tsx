'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import pt from 'date-fns/locale/pt';
import { Input } from './ui/input'

const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isIstantMeeting' | undefined >()
    const router = useRouter()
    const { user } = useUser()
    const client = useStreamVideoClient()
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })

    const [callDetails, setCallDetails] = useState<Call>();
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

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard
            img='/icons/add-meeting.svg'
            title="Nova Reunião"
            description="Ininicar uma reunião agora"
            handleClick={() => setMeetingState ('isIstantMeeting')}
            className='bg-orange-1'
        />
        <HomeCard
            img='/icons/schedule.svg'
            title="Agendar Reunião"
            description="Agende sua reunião"
            handleClick={() => setMeetingState('isScheduleMeeting')}
            className='bg-blue-1'
        />
        <HomeCard
            img='/icons/recordings.svg'
            title="Ver gravações"
            description="Veja suas gravações"
            handleClick={() => router.push('/recordings')}
            className='bg-purple-1'
        />
        <HomeCard
            img='/icons/join-meeting.svg'
            title="Entrar na Reunião"
            description="Via link de convite"
            handleClick={() => setMeetingState('isJoiningMeeting')}
            className='bg-yellow-1'
        />

        {!callDetails ? (
            <MeetingModal 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title = "Agendar Reunião"
            handleClick={createMeeting}
        >
            <div className='flex flex-col gap-2.5'>
                <label className='text-sky-1 text-base text-normal leading-[22px]'>
                    Adicione uma descrição</label>
                    <Textarea className='border-none bg-dark-3 focus-visible:right-0 focus-visible:ring-offset-0'
                        onChange={(e) => {
                            setValues({...values, description: e.target.value})
                        }}/>
            </div>
            <div className='flex w-full flex-col gap-2.5'>
                <label className='text-sky-1 text-base text-normal leading-[22px]'>
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
                        className='w-full rounded bg-dark-3 p-2 focus:outline-none'
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
                toast({ title: 'Link Copidado'})
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
                className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                onChange={(e) => setValues({...values, link: e.target.value})}
            />
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
