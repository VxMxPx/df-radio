<script lang="ts">
  import { onMount } from 'svelte'
  import { api, type ScheduleData, type ScheduleItem } from '@app/api'
  import { Button, Divider, Page } from '@app/components'

  type ProgramDay = {
    label: string
    timestamp: number
  }

  type ScheduleSlot = ScheduleItem & {
    startTimestamp: number
    end: number
    endTimestamp: number
    length: number
  }

  const hour = 60 * 60 * 1000

  const weekdayFormatter = new Intl.DateTimeFormat('en', {
    weekday: 'short',
  })

  const getDayTimestamp = (offset: number) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + offset)

    return date.getTime()
  }

  const buttons: ProgramDay[] = Array.from({ length: 7 }, (_, index) => {
    const timestamp = getDayTimestamp(index)

    return {
      index,
      label: weekdayFormatter.format(new Date(timestamp)),
      timestamp,
    }
  })

  let selectedTimestamp = $state(buttons[0]?.timestamp)

  let schedule = $state<ScheduleData>({})
  const fallbackSchedule: ScheduleItem[] = [
    {
      start: 0,
      name: 'No schedule. Continuous Music Broadcast',
    },
  ]

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

  const getDayId = (timestamp: number) => {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}${month}${day}`
  }

  const getScheduleSlots = (
    timestamp: number,
    items: ScheduleItem[],
  ): ScheduleSlot[] => {
    return items.map((item, index) => {
      const end = items[index + 1]?.start ?? 24
      const length = end - item.start

      return {
        ...item,
        end,
        length,
        startTimestamp: timestamp + item.start * hour,
        endTimestamp: timestamp + end * hour,
      }
    })
  }

  const scheduleItems = $derived(
    schedule[getDayId(selectedTimestamp)] ?? fallbackSchedule,
  )
  const scheduleSlots = $derived(
    getScheduleSlots(selectedTimestamp, scheduleItems),
  )

  onMount(async () => {
    try {
      schedule = await api.schedule()
    } catch {
      schedule = {}
    }
  })
</script>

<Page title="Program" elements={{ lines: true, stars: true }}>
  <h2>Program</h2>
  <Divider />
  <div class="columns">
    <p>
      The program is a map of the broadcast as it moves through the day:
      scheduled transmissions, recurring segments, and open stretches of music
      when the signal is left to wander.
    </p>
    <p>
      The program is still being assembled, so some days will remain vague for
      now: loose stretches of sound, experiments, and music moving through the
      day as it finds its shape.
    </p>
  </div>
  <Divider short />
  <div class="day-selector">
    {#each buttons as item}
      <Button
        class="day-selector__button"
        variant={selectedTimestamp === item.timestamp ? 'pressed' : 'default'}
        aria-pressed={selectedTimestamp === item.timestamp}
        onclick={() => (selectedTimestamp = item.timestamp)}>
        {item.label}
      </Button>
    {/each}
  </div>
  <div class="schedule">
    {#each scheduleSlots as item, index}
      <div class={`schedule-item schedule-item-${index}`}>
        <span
          >{formatTime(item.startTimestamp)}-{formatTime(
            item.endTimestamp,
          )}</span>
        <strong>{item.name}</strong>
      </div>
    {/each}
  </div>
</Page>

<style>
  .schedule-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.125rem;
    background: #00000022;
  }

  .schedule-item span {
    flex-shrink: 0;
    opacity: 0.75;
  }

  .schedule-item strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .schedule-item:nth-child(even) {
    background: #00000010;
  }

  .day-selector,
  .schedule {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  :global(.day-selector__button) {
    min-width: 3.5rem;
  }
</style>
