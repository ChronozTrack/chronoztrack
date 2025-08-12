<script lang="ts">
	import { Input } from '$ui/input/index'
	import {Button} from '$ui/button/index';

	let ref: HTMLFormElement

	function onSubmit() {
		ref.requestSubmit();
	}
</script>

<section class="flex justify-center">
	<Button onclick={onSubmit}>Submit</Button>
	<form method="POST" bind:this={ref}>
		<Input name="name" type="text" required class="h-8 border-none"/>
	</form>
</section>
