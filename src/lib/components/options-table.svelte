<script lang="ts">
  import type { AppPages, OptionsBaseTable } from '$lib/app-types';
  import * as Table from '$ui/table/index';
  import { Button } from '$ui/button/index';
  import { Input } from '$ui/input/index';
  import { Switch } from '$ui/switch/index';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Trash from '@lucide/svelte/icons/trash'
  import PencilOff from '@lucide/svelte/icons/pencil-off'
  import Lock from '@lucide/svelte/icons/lock';
  import { DraftState } from '$lib/data-utils';

  interface OptionsTableProps {
    table: string;
    options: AppPages;
    data: OptionsBaseTable[];
    onDiscard: (refId: string | OptionsBaseTable) => void;
    onEdit: (data: OptionsBaseTable) => void;
    optionsDraft: DraftState<OptionsBaseTable>;
  }

  let {
    data = [],
    options,
    onDiscard,
    onEdit,
    optionsDraft,
  }: OptionsTableProps = $props();
</script>

<Table.Root>
  <Table.Caption>List of {options.title} option.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-1/10 text-center">Id</Table.Head>
      <Table.Head class="w-2/12">Code</Table.Head>
      <Table.Head class="w-3/12">Name</Table.Head>
      <Table.Head class="truncate">Description</Table.Head>
      <Table.Head class="w-1/10 text-center">Active</Table.Head>
      <Table.Head class="w-1/10 text-center">Action</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data as row (row.id)}
      {@const modifiedEntries = optionsDraft.modifiedEntries}
      {@const mapKey = optionsDraft.keyMaps(row)}
      {@const entry = modifiedEntries.get(mapKey)}
      <Table.Row
        class={[
          row.locked ? 'text-primary/75' : '',
          !row.active ? 'text-destructive' : '',
          entry ? 'bg-primary/10' : '',
          entry && !entry.active ? 'text-destructive' : ''
        ]}>
        <Table.Cell class="text-center">{row.id}</Table.Cell>
        {#if entry}
          <Table.Cell>
            <Input
              type="text"
              bind:value={entry.code}
              class="h-8 border-none"
              required />
          </Table.Cell>
          <Table.Cell>
            <Input
              type="text"
              bind:value={entry.name}
              class="h-8 border-none"
              required />
          </Table.Cell>
          <Table.Cell>
            <Input
              type="text"
              bind:value={entry.description}
              class="h-8 border-none" />
          </Table.Cell>
          <Table.Cell class="text-center">
            <Switch bind:checked={entry.active}/>
          </Table.Cell>
          <Table.Cell class="items-center text-center">
            <Button variant="ghost" size="sm" onclick={() => onDiscard(entry)}>
              <Trash class="text-destructive" />
            </Button>
          </Table.Cell>
        {:else}
          <Table.Cell>{row.code}</Table.Cell>
          <Table.Cell>{row.name}</Table.Cell>
          <Table.Cell class="truncate">{row.description}</Table.Cell>
          <Table.Cell class="text-center">{row.active ? 'Yes' : 'No'}</Table.Cell>
          <Table.Cell class="text-center">
            <Button
              variant="ghost"
              size="sm"
              disabled={optionsDraft.actionState === 'create' || row.locked}
              onclick={() => onEdit($state.snapshot(row))}>
              {#if row.locked}
                <Lock />
              {:else if optionsDraft.actionState === 'create'}
                <PencilOff />
              {:else}
                <Pencil />
              {/if}
            </Button>
          </Table.Cell>
        {/if}
      </Table.Row>
    {/each}

    {#if optionsDraft.actionState === 'create'}
      {#each optionsDraft.newEntries as [mapKey, item] (mapKey)}
        <Table.Row class="bg-primary/10">
          <Table.Cell class="text-center">-</Table.Cell>
          <Table.Cell>
            <Input
              type="text"
              placeholder="code"
              bind:value={item.code}
              class="h-8 border-none"
              required />
          </Table.Cell>
          <Table.Cell>
            <Input
              type="text"
              placeholder="name"
              bind:value={item.name}
              class="h-8 border-none"
              required />
          </Table.Cell>
          <Table.Cell>
            <Input
              type="text"
              placeholder="description"
              bind:value={item.description}
              class="h-8 border-none" />
          </Table.Cell>
          <Table.Cell class="text-center">
            <Switch bind:checked={item.active} />
          </Table.Cell>
          <Table.Cell class="items-center text-center">
            <Button variant="ghost" size="sm" onclick={() => onDiscard(item)}>
              <Trash />
            </Button>
          </Table.Cell>
        </Table.Row>
      {/each}
    {/if}
  </Table.Body>
</Table.Root>
