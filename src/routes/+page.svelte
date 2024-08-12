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
        <a href="/games/color-slots">
            <h2>Colores al azar</h2>
            <p>Selector de un trio de colores de complejidad creciente, respecto a los valores de Rojo, Verde y Azul</p>
        </a>
        <a href="/games/letter-slots">
            <h2>Letras al azar</h2>
        </a>
        <a href="/games/rgb">
            <h2>Colores primarios de la luz (RGB)</h2>
        </a>
        <a href="/games/rgb-check">
            <h2>Comparar valores en RGB</h2>
        </a>
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1rem;

    a {
        .card();
        --color: #4156fd;
        padding: .25em 1em;
        font-size: 1.5em;
        color: white;
        text-decoration: none;
    }
}

</style>
