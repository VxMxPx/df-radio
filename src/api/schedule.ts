import { get, type ApiRequestOptions } from '@app/lib/api'

export type ScheduleItem = {
  start: number
  name: string
}

export type ScheduleData = Record<string, ScheduleItem[]>

export const schedule = (options?: ApiRequestOptions) =>
  get<ScheduleData>('/api/schedule', options)
