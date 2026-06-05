<script lang="ts">
  import {
    Button,
    Form,
    Input,
    Select,
    Textarea,
    Message,
  } from '@app/components'
  import type { FormValues } from '@app/components/form/Form.svelte'
  import type { FormState } from '@app/components/form/Message.svelte'

  let formState = $state<FormState>('inactive')
  let formMessage = $state('')

  const submit = (data: FormValues, event: SubmitEvent) => {
    console.log(data)
    formState = 'working'
    formMessage = 'Submitting your message...'
    setTimeout(() => {
      formState = 'success'
      formMessage = 'Success!'
    }, 4000)
    setTimeout(() => {
      formState = 'error'
      formMessage = 'Something went wrong!'
    }, 4000 * 2)
    setTimeout(() => {
      formState = 'inactive'
      formMessage = '...'
    }, 4000 * 3)
  }
</script>

<Form class="request-form" onsubmit={submit}>
  <Select label="Reason" name="reason">
    <option>Say hello</option>
    <option>Recommend song / band</option>
    <option>Request song removal</option>
    <option>Cooperation</option>
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
