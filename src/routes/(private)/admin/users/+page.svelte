<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    console.log(data.users)
</script>

{#if data.users}
  <h1>USERS</h1>
{/if}