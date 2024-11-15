<script lang="ts">
    import { setContext, type Snippet } from "svelte";

    interface Props {
        selected?: number,
        children: Snippet
    }
    
    let { selected = $bindable(0), children }: Props = $props()

    let ctx = $state({ selected, tabItemIndex: 0, tabContentIndex: 0 })
    
    setContext('tab-view', ctx)
</script>

{@render children()}
