<script>
import logo from '$lib/assets/logo.svg?url'
</script>

<svelte:head>
    <title>eduACTIVO</title>
</svelte:head>

<header>
    <img src={logo} alt="Eduactive logo" height="112" />
</header>

<main>
    <h1>Juegos educativos</h1>
    <div class="cards">
        <a href="/games/color-slots">Colores al azar</a>
        <a href="/games/letter-slots">Letras al azar</a>
        <a href="/games/rgb">Colores primarios de la luz (RGB)</a>
        <a href="/games/rgb-check">Comparar valores en RGB</a>
    </div>
</main>

<style lang="less">
@import "$lib/style/card.less";

header {
    display: grid;
    place-items: center;
    height: 4rem;
    width: 100%;

    img {
        height: 100%;
    }
}

.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    a {
        .card();
        --color: #4156fd;
        padding: .25em 1em;
        font-size: 2em;
        color: white;
        text-decoration: none;
        flex: 1 1 10rem;
    }
}

</style>
