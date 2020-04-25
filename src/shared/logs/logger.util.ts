import bunyan from 'bunyan'
import consoleStream from 'bunyan-console-stream'

const streamOptions = {
  stderrThreshold: 40, // log warning, error and fatal messages on STDERR
}

export const logger = bunyan.createLogger({
  name: 'onedayradio-logs',
  streams: [
    {
      path: '/tmp/app-logs.log',
    },
    {
      type: 'raw',
      stream: consoleStream.createStream(streamOptions),
    },
  ],
})
