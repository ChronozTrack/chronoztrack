<script lang="ts">
  import * as Table from "$ui/table/index";

  let {data = []} = $props();
</script>

<Table.Root>
  <Table.Caption>List of options</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Id</Table.Head>
      <Table.Head>Active</Table.Head>
      <Table.Head>Code</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Description</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data as row}
      <Table.Row></Table.Row>
    {/each}
  </Table.Body>
</Table.Root>