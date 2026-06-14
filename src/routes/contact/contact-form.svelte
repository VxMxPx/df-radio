<script lang="ts">
  import { Button, Form, Input, Select, Textarea, Message } from '@app/components'
  import type { FormValues } from '@app/components/form/form.svelte'
  import type { FormState } from '@app/components/form/message.svelte'

  let formState = $state<FormState>('inactive')
  let formMessage = $state('')

  const submit = async (data: FormValues, event: SubmitEvent) => {
    const form = event.currentTarget as HTMLFormElement

    formState = 'working'
    formMessage = 'Submitting your message...'

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = (await response.json()) as {
        error?: string
        ok?: boolean
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Something went wrong.')
      }

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
