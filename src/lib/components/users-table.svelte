<script lang="ts">
	import type { UsersData } from '$lib/app-types';
  import * as Table from '$ui/table/index';

  interface UsersTableProps {
    users: UsersData[]
  }

  let {users}: UsersTableProps = $props();
</script>

<Table.Root>
  <Table.Caption>List of Users</Table.Caption>
  <Table.Header>
    <Table.Cell>-</Table.Cell>
    <Table.Cell>Active</Table.Cell>
    <Table.Cell>ID</Table.Cell>
    <Table.Cell>Name</Table.Cell>
    <Table.Cell>Supervisor</Table.Cell>
    <Table.Cell>Department</Table.Cell>
    <Table.Cell>Job</Table.Cell>
  </Table.Header>
  <Table.Body>
    {#each users as user}
      <Table.Row>
        <Table.Cell>-</Table.Cell>
        <Table.Cell>{user.id ?? ''}</Table.Cell>
        
      </Table.Row>
    [/each]
  </Table.Body>
</Table.Root>