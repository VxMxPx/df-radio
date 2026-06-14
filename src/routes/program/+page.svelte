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

<Page title="Program" elements={{ lines: true }}>
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
  <Divider class="max-w-[15%]" />
  <div class="flex flex-wrap gap-2">
    {#each buttons as item}
      <Button
        class="min-w-14"
        variant={selectedTimestamp === item.timestamp ? 'pressed' : 'default'}
        aria-pressed={selectedTimestamp === item.timestamp}
        onclick={() => (selectedTimestamp = item.timestamp)}>
        {item.label}
      </Button>
    {/each}
  </div>
  <div class="schedule flex flex-wrap gap-2">
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
  @reference 'tailwindcss';

  .schedule-item {
    @apply flex items-center gap-2 rounded-sm px-3 py-2;
    background: #ffffff22;
  }

  .schedule-item span {
    @apply shrink-0 opacity-75;
  }

  .schedule-item strong {
    @apply min-w-0 truncate;
  }

  .schedule-item:nth-child(even) {
    background: #ffffff10;
  }
</style>
