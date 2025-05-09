<script>
import { base } from '$app/paths';
import logo from '$lib/assets/logo.svg'
</script>

<div class="root">
<header>
    <a href="/">
        <img src={logo} alt="Eduactive logo" />
    </a>
    <a href="https://santiago.cez.ar">© Santiago Cézar</a>

</header>

<slot></slot>
</div>

<style>

.root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 2rem 1fr;
    width: 100%;
    height: 100%;
}

a {
    display: block;
    flex-shrink: 0;
    height: 100%;
}
img {
    height: 100%;
    max-width: unset;
}

header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: .25rem 1rem;
}

</style>
