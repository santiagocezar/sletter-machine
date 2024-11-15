<script lang="ts">
    import { getContext, type Snippet } from "svelte";

    const ctx: { selected: number, tabItemIndex: number } = getContext('tab-view')
    
    const id = ctx.tabItemIndex++
    
    function select() {
        ctx.selected = id
    }
    
    interface Props {
        children: Snippet
    }
    let { children }: Props = $props()
</script>

<button tabindex={id} role="tab" id="tab-item-{id}" aria-selected={ctx.selected == id} onclick={select}>
    {@render children()}
</button>

<style>
[role="tab"] {
    border-bottom: .25rem solid transparent;
    margin-left: -1px;
    border-radius: .5rem .5rem 0 0;
    padding: .25rem 1rem;
    cursor: pointer;
    font-weight: bold;
}
[role="tab"][aria-selected="true"] {
    border-bottom-color: royalblue;
    color: royalblue;
}
</style>
