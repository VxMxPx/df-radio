<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLFormAttributes } from 'svelte/elements'

  export type FormValues = Record<
    string,
    FormDataEntryValue | FormDataEntryValue[]
  >

  type FormProps = Omit<
    HTMLFormAttributes,
    'onsubmit' | 'on:submit' | 'oninput' | 'on:input' | 'onchange' | 'on:change'
  > & {
    children?: Snippet
    onsubmit?: (data: FormValues, event: SubmitEvent) => void
    oninput?: (event: Event) => void
    onchange?: (event: Event) => void
  }

  const {
    children,
    class: classes = '',
    onsubmit,
    oninput,
    onchange,
    ...props
  }: FormProps = $props()

  const getFormValues = (form: HTMLFormElement) => {
    const formData = new FormData(form)
    const data: FormValues = {}

    for (const [name, value] of formData.entries()) {
      const currentValue = data[name]

      if (Array.isArray(currentValue)) {
        currentValue.push(value)
      } else if (currentValue) {
        data[name] = [currentValue, value]
      } else {
        data[name] = value
      }
    }

    return data
  }

  const hasValue = (
    control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  ) => {
    if (control instanceof HTMLInputElement) {
      if (control.type === 'checkbox' || control.type === 'radio') {
        return control.checked
      }
    }

    return control.value.trim() !== ''
  }

  const validate = (form: HTMLFormElement) => {
    let valid = true

    for (const field of form.querySelectorAll<HTMLElement>('[data-required]')) {
      const control = field.lastElementChild

      if (
        !(
          control instanceof HTMLInputElement ||
          control instanceof HTMLSelectElement ||
          control instanceof HTMLTextAreaElement
        ) ||
        hasValue(control)
      ) {
        continue
      }

      valid = false
      field.dataset.error = 'This field is required'
      control.setAttribute('aria-invalid', 'true')
    }

    return valid
  }

  const clearFieldError = (event: Event) => {
    const control = event.target

    if (
      !(
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement
      )
    ) {
      return
    }

    const field = control.parentElement

    if (!field?.dataset.error || !hasValue(control)) {
      return
    }

    delete field.dataset.error
    control.removeAttribute('aria-invalid')
  }

  const input = (event: Event) => {
    clearFieldError(event)
    oninput?.(event)
  }

  const change = (event: Event) => {
    clearFieldError(event)
    onchange?.(event)
  }

  const submit = (event: SubmitEvent) => {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement

    if (!validate(form)) {
      return
    }

    onsubmit?.(getFormValues(form), event)
  }
</script>

<form
  class={`ui Form flex flex-col gap-5 ${classes}`}
  novalidate
  oninput={input}
  onchange={change}
  onsubmit={submit}
  {...props}>
  {@render children?.()}
</form>

<style>
  .ui.Form {
    position: relative;
  }
</style>
