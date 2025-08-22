<script lang="ts">
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  let { isBusy = $bindable(false), children } = $props();
</script>

{#if isBusy}
  <LoaderCircle class="animate-spin" />
{:else}
  {@render children?.()}
{/if}
