<script>
import logo from '$lib/assets/logo-on-purple.svg'
</script>

<div class="root">
<header>
    <img src={logo} alt="Eduactive logo" height="28" />
    <a class="btn">
        Otros juegos
    </a>
</header>

<slot></slot>
</div>

<style>

.root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 48px 1fr;
    width: 100%;
    height: 100%;
}

header {
    display: flex;
    gap: 1rem;
    padding: 0 1rem;
    align-items: center;
    background-color: #654ac6;
    background-image: linear-gradient(to bottom, transparent, #0004 95%, #000a 100%);
}

</style>
