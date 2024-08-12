<script>
import logo from '$lib/assets/logo.svg'
</script>

<div class="root">
<header>
    <a href="/">
        <img src={logo} alt="Eduactive logo" />
    </a>
    Hola
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
    height: 1.5rem;
}
img {
    height: 100%;
}

header {
    display: flex;
    gap: 1rem;
    padding: .25rem 1rem;
    align-items: center;
}

</style>
