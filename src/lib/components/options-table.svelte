<script lang="ts">
  import type {AppPages, OptionsBaseTable} from "$lib/app-types"
  import * as Table from "$ui/table/index";
  import {Button} from "$ui/button/index";
  import {Pencil} from "@lucide/svelte/icons"

  interface OptionsTableProps {
    options: AppPages;
    data: OptionsBaseTable[];
  }
  let {data = [], options}: OptionsTableProps = $props();
</script>

<Table.Root>
  <Table.Caption>List of {options.title} option.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Id</Table.Head>
      <Table.Head>Code</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Description</Table.Head>
      <Table.Head class="text-center">Active</Table.Head>
      <Table.Head class="text-center">Action</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data as row}
      <Table.Row>
        <Table.Cell>{row.id}</Table.Cell>
        <Table.Cell>{row.code}</Table.Cell>
        <Table.Cell>{row.name}</Table.Cell>
        <Table.Cell>{row.description}</Table.Cell>
        <Table.Cell class="text-center">{row.active ? "Yes" : "No"}</Table.Cell>
        <Table.Cell class="text-center">
          <Button variant="outline" size="sm">
            <Pencil size="16"/>
          </Button>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>