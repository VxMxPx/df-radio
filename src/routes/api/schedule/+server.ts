import schedule from '@app/data/schedule.json'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = () => {
  return json(schedule)
}
