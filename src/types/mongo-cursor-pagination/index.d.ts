declare module 'mongo-cursor-pagination' {
  export function aggregate<T>(
    collection: any,
    options: any,
  ): { previous: string; hasPrevious: boolean; next: string; hasNext: boolean; results: T }
}
