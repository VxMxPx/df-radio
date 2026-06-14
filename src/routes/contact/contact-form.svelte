<script lang="ts">
  import { api } from '@app/api'
  import type { ContactMetadata } from '@app/api'
  import {
    Button,
    Form,
    Input,
    Select,
    Textarea,
    Message,
  } from '@app/components'
  import type { FormValues } from '@app/components/form/form.svelte'
  import type { FormState } from '@app/components/form/message.svelte'

  let formState = $state<FormState>('inactive')
  let formMessage = $state('')

  type NavigatorWithUserAgentData = Navigator & {
    userAgentData?: {
      brands?: { brand: string; version: string }[]
      mobile?: boolean
      platform?: string
    }
  }

  const getBrowser = (userAgent: string) => {
    if (/edg\//i.test(userAgent)) return 'Edge'
    if (/opr\//i.test(userAgent)) return 'Opera'
    if (/firefox\//i.test(userAgent)) return 'Firefox'
    if (/chrome\//i.test(userAgent)) return 'Chrome'
    if (/safari\//i.test(userAgent)) return 'Safari'

    return 'Unknown'
  }

  const getDevice = (
    userAgent: string,
    userAgentData: NavigatorWithUserAgentData['userAgentData'],
  ) => {
    if (userAgentData?.mobile) return 'Mobile'
    if (/tablet|ipad/i.test(userAgent)) return 'Tablet'
    if (/mobi|android|iphone|ipod/i.test(userAgent)) return 'Mobile'

    return 'Desktop'
  }

  const getContactMetadata = (): ContactMetadata => {
    const navigatorData = navigator as NavigatorWithUserAgentData
    const userAgent = navigator.userAgent

    return {
      browser: getBrowser(userAgent),
      device: getDevice(userAgent, navigatorData.userAgentData),
      language: navigator.language,
      platform: navigatorData.userAgentData?.platform || navigator.platform,
      screen: `${window.screen.width}x${window.screen.height} @ ${window.devicePixelRatio}x`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    }
  }

  const submit = async (data: FormValues, event: SubmitEvent) => {
    const form = event.currentTarget as HTMLFormElement

    formState = 'working'
    formMessage = 'Submitting your message...'

    try {
      await api.contact({
        ...data,
        metadata: getContactMetadata(),
      })
      formState = 'success'
      formMessage = 'Message sent. Thank you!'
      form.reset()
    } catch (error) {
      formState = 'error'
      formMessage =
        error instanceof Error ? error.message : 'Something went wrong.'
    }
  }
</script>

<Form class="request-form" onsubmit={submit}>
  <Select label="Reason" name="reason">
    <option id="hello">Say Hello</option>
    <option id="co-op">Cooperation</option>
    <option id="recom">Recommendations</option>
    <option id="remov">Request Removal</option>
    <option id="teche">Technical Problem</option>
  </Select>
  <Input
    required
    label="Your name"
    name="name"
    placeholder="How are you called" />
  <Input
    required
    label="How can we reach you?"
    name="email"
    placeholder="Your email" />
  <Textarea
    required
    label="Message"
    name="message"
    placeholder="Your message..." />
  <Button type="submit">Submit</Button>
  <Message
    state={formState}
    text={formMessage}
    onDismiss={() => (formState = 'inactive')} />
</Form>
