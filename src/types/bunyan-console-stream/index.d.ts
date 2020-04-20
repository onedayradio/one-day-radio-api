interface StreamOptions {
  stderrThreshold: number
}

declare module 'bunyan-console-stream' {
  export function createStream(options: StreamOptions): any
}
