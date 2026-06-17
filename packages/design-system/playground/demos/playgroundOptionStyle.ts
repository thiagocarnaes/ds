export function playgroundOptionStyle(active: boolean): Record<string, string> {
  return active
    ? { background: 'rgba(0,212,255,0.12)', color: '#00D4FF', borderLeft: '2px solid #00D4FF' }
    : { color: '#4D6A87' }
}
