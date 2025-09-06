<script lang="ts">
	import type { PageProps } from './$types';
  import { Button } from '$lib/components/ui/button/index';
  import { Input } from '$lib/components/ui/input/index';
  import { Label } from '$lib/components/ui/label/index.js';
  import * as Card from '$lib/components/ui/card/index';
  import BusyIcon from '$lib/components/busy-icon.svelte';

	let { data }: PageProps = $props();

  let isBusy = $state(false);
</script>

<div class="flex w-full items-center justify-center px-4">
  <Card.Root class="mx-auto w-full max-w-md mt-16">
    <Card.Header>
      <Card.Title class="text-2xl">Register</Card.Title>
    </Card.Header>
    <Card.Content>
      <form method="POST" id="form-register" >
        <fieldset disabled={isBusy}>
          <div class="flex flex-col gap-6">
            <div class="grid gap-2">
              <Label for="employeeId">Employee ID</Label>
              <Input
                name="employeeId"
                id="employeeId"
                type="alphanumeric"
                placeholder="123456"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input name="password" id="password" type="password" required />
            </div>
          </div>
        </fieldset>
      </form>
    </Card.Content>
    <Card.Footer class="flex-col">
      <Button form="form-register" type="submit" class="w-full" disabled={isBusy}>
        <BusyIcon>
          Register
        </BusyIcon>
      </Button>
    </Card.Footer>
  </Card.Root>
</div>