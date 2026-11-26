import { useEffect, useState } from 'react'

/**
 * The time somewhere, ticking every second, as "14:32:07". Starts as a
 * placeholder so the first render is the same everywhere (and in tests).
 */
export function useClock(timeZone: string): string {
  const [now, setNow] = useState<string>('--:--:--')

  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => setNow(format.format(new Date()))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [timeZone])

  return now
}
