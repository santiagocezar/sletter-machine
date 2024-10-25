<script>
import { base } from '$app/paths';
import logo from '$lib/assets/logo.svg?url'
</script>

<svelte:head>
    <title>eduACTIVO</title>
</svelte:head>


<main>
    <img class="logo" src={logo} alt="Eduactive logo" height="112" />
    <h1>Experiencias educativas interactivas</h1>
    <br>
    <div class="cards">
        <a href="{base}/games/color-slots">
            <h2>Máquina tragacolores</h2>
            <p>Selecciona de un trio de colores aleatorios, cada uno con valores de rojo, verde y azul más complejos que el anterior</p>
        </a>
        <a href="{base}/games/letter-slots">
            <h2>Máquina tragaletras</h2>
            <p>Selecciona de tres letras aleatorias, donde la forma de cada una es más dificil de dibujar que la anterior</p>
        </a>
        <a href="{base}/games/rgb">
            <h2>Componentes de la luz (RGB)</h2>
            <p>Permite formar distintos colores cambiando las cantidades de rojo, verde y azul. Muestra la mezcla aditiva de los colores de la luz.</p>
        </a>
        <a href="{base}/games/rgb-check">
            <h2>Comparar valores RGB</h2>
            <p>Permite comparar dos colores distintos a un color seleccionado de forma aleatoria, ¡y definir cual está más cerca! </p>
        </a>
        <a href="{base}/games/diff-robot">
            <h2>Transmisión diferencial</h2>
            <p>Simular un robot con motores de transmisión diferencial</p>
        </a>
    </div>
</main>

<style lang="less">
@import "$lib/style/card.less";

.logo {
    height: 2.5rem;
}

main {
    background-color: white;
    padding: 1rem 2rem;
    max-width: 80rem;
    height: 100%;
    margin: 0 auto;
    box-shadow: 0 0 4rem #ddd;
}

hr {
    border-top: 1px gray dashed;
}

h1 {
    font-size: large;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    grid-template-rows: repeat(auto-fill, auto 1fr);
    gap: .5rem;

    a {
        .card();
        --color: #f8f8ff;
        display: grid;
        grid-template-rows: subgrid;
        padding: 1rem 1rem;
        text-decoration: none;
        grid-row: span 2;
        h2 {
            color: #4156fd;
            font-weight: 700;
            line-height: 1;
            font-size: 1.5rem;
            align-self: center;
            text-wrap: balance;
            text-transform: uppercase;
        }
        p {
        }

    }
}

</style>
