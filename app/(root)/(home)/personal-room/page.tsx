"use client"

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900'>
    <p className='text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500'>{label}</p>
    <p className='mt-2 truncate text-base font-semibold text-slate-900 dark:text-white'>{value}</p>
  </div>
)

const PersonalRoom = () => {
  const {user} = useUser()
  const meetingId = user?.id;
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const router = useRouter()

  const meetingLink = meetingId ? `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true` : ''

  const { call } = useGetCallById(meetingId || '');

  const startRoom = async () => {
    if(!client || !user || !meetingId) return
    
    if (!call) {
      const newCall = client.call('default', meetingId)

      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        }
      })
    }

    router.push(`/meeting/${meetingId}?personal=true`)
  }

  return (
    <section className='space-y-6 text-slate-900 dark:text-white'>
      <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>Sala pessoal</h1>
        <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
          Use seu link privado para encontros rápidos ou sessões one-to-one. Compartilhe com segurança e comece em segundos.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:max-w-4xl'>
    	  <InfoRow label='Tópico' value={`Sala de ${user?.username || user?.firstName || 'você'}`}/>
    	  <InfoRow label='ID da reunião' value={meetingId || '—'}/>
    	  <InfoRow label='Link de convite' value={meetingLink}/>
    	  <InfoRow label='Status' value={call ? 'Pronta para iniciar' : 'Aguardando criação'}/>
      </div>

      <div className='flex flex-wrap gap-4'>
        <Button className='rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500' onClick={startRoom}>
          Iniciar reunião
        </Button>
        <Button className='rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200' onClick={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({
                  title: "Link Copiado",
                });
              }}>
                Copiar convite
        </Button>
      </div>
    </section>
  )
}

export default PersonalRoom
