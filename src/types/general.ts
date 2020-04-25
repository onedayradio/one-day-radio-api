export interface AppService {
  loadByIds: (ids: string[]) => Promise<any[]>
}
