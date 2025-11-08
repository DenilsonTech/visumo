import CallList from '@/components/CallList'

const Recordings = () => {
  return (
    <section className='space-y-6 text-slate-900 dark:text-white'>
      <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>Gravações</h1>
        <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
          Assista e compartilhe reuniões gravadas. Perfecto para rever decisões e alinhar a equipa.
        </p>
      </div>

      <CallList type='recordings'/>
    </section>
  )
}

export default Recordings
