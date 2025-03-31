<script lang="ts">
    import { Tween } from "svelte/motion"
    import { cubicInOut } from "svelte/easing"
    import type { Action } from "svelte/action";
    
    interface Props {
        value: number,
    }

    let { value = $bindable(0) }: Props = $props()

    let angle = {
        get value() {
            return (value * 2 - 1) * Math.PI
        },
        set value(angle: number) {
            value = (angle / Math.PI + 1) / 2
        }
    }

    const dial: Action = (base: HTMLElement) => {
        let originX = 0, originY = 0;
        let baseSize = 0;
        
        function mapClientPosition(clientX: number, clientY: number) {
            clientX = (clientX - originX) / baseSize * 2 - 1;
            clientY = (clientY - originY) / baseSize * 2 - 1;

            angle.value = Math.atan2(clientX, -clientY)
        }

        function stopMoving(ev: PointerEvent) {
            ev.preventDefault()
            removeDocumentListeners()
        }
        
        function startMoving(ev: PointerEvent) {
            ev.preventDefault()
        
            const rect = base.getBoundingClientRect();
            baseSize = rect.width;
            originX = rect.left;
            originY = rect.top;

            addDocumentListeners()
            mapClientPosition(ev.clientX, ev.clientY);
        }
        
        function keepMoving(ev: PointerEvent) {        
            ev.preventDefault()
            mapClientPosition(ev.clientX, ev.clientY)
        }
        
        function addDocumentListeners() {
            document.addEventListener("pointermove", keepMoving)
            document.addEventListener("pointerup", stopMoving)
        }
        function removeDocumentListeners() {
            document.removeEventListener("pointermove", keepMoving)
            document.removeEventListener("pointerup", stopMoving)
        }

        base.addEventListener("pointerdown", startMoving)

        return {
            destroy() {
                base.removeEventListener("pointerdown", startMoving)
                removeDocumentListeners()
            }
        }
    }
</script>

<div
    class="dial"
    role="none"
    use:dial
>
    <p>{Math.round(value * 100)}</p>
    <div class="base" style="--phi: {angle.value - Math.PI / 2}rad">
        <div class="ball">
        </div>
    </div>
</div>


<style lang="scss">
    .dial {
        position: relative;
        aspect-ratio: 1 / 1;
        width: 10rem;
        touch-action: none;
        border-radius: 100%;
        --gradient: 2%;
        background-color: var(--bg4); 
    
        & p {
            position: absolute;
            inset: 0;
            font-variant-numeric: tabular-nums;
            font-size: 2rem;
            text-align: center;
            place-content: center;
            z-index: 1;
        }
        & .base {
            position: absolute;
            /*background-image: radial-gradient(
                #ffff, #fffa
            );*/
            inset: 12%;
            display: block;
            place-content: center;
            border-radius: 100%;
            background-color: var(--bg1); 
            rotate: var(--phi);
        }
        & .ball {
            position: absolute;
            pointer-events: none;
            aspect-ratio: 1 / 1;
            width: 20%;
            border-radius: 100%;
            right: 0;
            translate: 50% -50%;
            background-color: var(--text);
            /*background-image: radial-gradient(
                #ff8, #ff8, #ff0
            );*/
    /*         border: 1px solid orange; */
        }
    }
    @media screen and (max-width: 60rem) {
        .dial {
            width: 8rem;
            .base p {
                font-size: 1.8rem;
            }
        }
    }
</style>
    

<!-- 
<svelte:document
    onpointermove={keepMoving}
    onpointerup={stopMoving}
/>
 -->
