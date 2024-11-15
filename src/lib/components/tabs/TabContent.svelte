<script lang="ts">
    import { getContext, type Snippet } from "svelte";

    const ctx: { selected: number, tabContentIndex: number } = getContext('tab-view')
    
    const id = ctx.tabContentIndex++
    
    interface Props {
        class?: string
        children: Snippet
    }
    let { class: className, children }: Props = $props()
</script>

<div class={className} role="tabpanel" aria-labelledby="tab-item-{id}" aria-hidden={ctx.selected != id}>
    {@render children()}
</div>

<style>
[role="tabpanel"][aria-hidden="true"] {
    display: none;
}
</style>
