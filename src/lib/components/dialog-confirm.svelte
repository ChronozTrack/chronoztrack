<script lang="ts">
  import * as AlertDialog from '$ui/alert-dialog/index';

  type DialogProps = {
    open: boolean;
    description?: string;
    title?: string;
    action?: string;
    onConfirm: () => void;

  };

  let {
    open = $bindable(false),
    description = 'Are you sure you want to proceed?',
    title = 'Warning!',
    action = 'Continue',
    onConfirm,
    ...restProps
  }: DialogProps = $props();
</script>

<AlertDialog.Root bind:open {...restProps}>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title class="capitalized">{title}</AlertDialog.Title>
        <AlertDialog.Description>{@html description}</AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action onclick={onConfirm} class="capitalize">{action}</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
