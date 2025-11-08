'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';

import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  
  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'Sem chamadas Anteriores';
      case 'upcoming':
        return 'Sem próximas Chamadas';
      case 'recordings':
        return 'Sem Gravações';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="w-full">
      {calls && calls.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {calls.map((meeting: Call | CallRecording) => (
            <MeetingCard
              key={(meeting as Call).id}
              icon={
                type === 'ended'
                  ? '/icons/previous.svg'
                  : type === 'upcoming'
                    ? '/icons/upcoming.svg'
                    : '/icons/recordings.svg'
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                'Sem Descrição'
              }
              date={
                (meeting as Call).state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording).start_time?.toLocaleString()
              }
              isPreviousMeeting={type === 'ended'}
              link={
                type === 'recordings'
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
              }
              buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
              buttonText={type === 'recordings' ? 'Assistir' : 'Entrar'}
              handleClick={
                type === 'recordings'
                  ? () => router.push(`${(meeting as CallRecording).url}`)
                  : () => router.push(`/meeting/${(meeting as Call).id}`)
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          <p className="text-lg font-semibold">{noCallsMessage}</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Assim que criar ou terminar reuniões elas aparecem aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default CallList;
