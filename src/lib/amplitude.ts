import amplitude from 'amplitude-js'

export default function initAmplitude() {
  const instance = amplitude.getInstance()
  instance.init('3c47ede7eb3704829edd2d0b536eac3f') // initializes default instance of Amplitude client

  instance.logEvent('EVENT_NAME_HERE')
  return instance
}
