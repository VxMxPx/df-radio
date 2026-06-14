import { contact } from './contact'
import { schedule } from './schedule'

export const api = {
  contact,
  schedule,
}

export type { ContactData, ContactMetadata } from './contact'
export type { ScheduleData, ScheduleItem } from './schedule'
