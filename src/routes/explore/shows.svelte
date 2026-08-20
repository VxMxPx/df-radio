<script lang="ts">
  import { APP_NAME } from '$root/constants'
  import { Input, Select } from '$root/lib/components/ui'
</script>

<div class="flex flex-col gap-20">
  <div class="filters">
    <Input type="text" placeholder="Search shows..." class="grow" />
    <Select
      options={[
        { value: 'all', label: 'All' },
        { value: 'darkforest', label: APP_NAME },
        { value: 'external', label: 'External' },
      ]}
    />
  </div>

  <div class="list">
    <p>List of shows...</p>
  </div>
</div>

<style>
  .filters {
    display: flex;
    gap: var(--gap-10);
  }
</style>
