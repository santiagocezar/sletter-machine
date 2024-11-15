<script lang="ts">
    import { getContext, type Snippet } from "svelte";

    const ctx: { selected: number } = getContext('tab-view')
    
    interface Props {
        children: Snippet
    }
    let { children }: Props = $props()
    
</script>

<div role="tablist">
    {@render children()}
</div>

<style>
[role="tablist"] {
    display: flex;
    padding-top: .25rem;
}
</style>
