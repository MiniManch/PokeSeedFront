<template>
    <div @mouseenter="displayTitle" @mouseleave="hideTitle" :class="['TypeCard', PokeType.name.toLowerCase()]">
        <div :class="['title', { show: showTitle }]">
            <h1>{{ PokeType.name }}</h1>
        </div>
        <div class="imageContainer">
            <img :src="PokeType.image" alt="">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        PokeType: {
            type: Object,
            required: true
        },
    },
    data(){
        return{
            showTitle: false,
        }
    },
    methods:{
        displayTitle(){
            this.showTitle = true;
        },
        hideTitle(){
            this.showTitle = false;
        }
    }
}
</script>

<style scoped>
.TypeCard {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 10vw;
    height: 50%;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 0.5vw;
}

.imageContainer {
    width: 50%;
}

.imageContainer > img {
    width: 100%;
    height: 100%;
}

.title {
    position: absolute;
    bottom:1vh;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    font-family: HomeVideo;
    font-weight: 100;
    letter-spacing: 0.2rem;
}

.title.show {
    opacity: 1;
}

h1{
    margin-bottom: 0;
}

.fairy {
    background: linear-gradient(135deg, #EE99AC, #FFCCD4);
}

.rock {
    background: linear-gradient(135deg, #B8A038, #D1C07E);
}

.steel {
    background: linear-gradient(135deg, #B8B8D0, #D0D0E0);
}

.water {
    background: linear-gradient(135deg, #6890F0, #98A9F0);
}

.ghost {
    background: linear-gradient(135deg, #705898, #9B81B8);
}

.psychic {
    background: linear-gradient(135deg, #F85888, #FF9CA6);
}

.poison {
    background: linear-gradient(135deg, #A040A0, #B070B0);
}

.flying {
    background: linear-gradient(135deg, #A890F0, #C6B7F0);
}

.fire {
    background: linear-gradient(135deg, #F08030, #FFA068);
}

.normal {
    background: linear-gradient(135deg, #A8A878, #C6C69E);
}

.grass {
    background: linear-gradient(135deg, #78C850, #A0D870);
}

.ice {
    background: linear-gradient(135deg, #98D8D8, #C2EBEB);
}

.fighting {
    background: linear-gradient(135deg, #C03028, #D87070);
}

.electric {
    background: linear-gradient(135deg, #F8D030, #FFE670);
}

.dark {
    background: linear-gradient(135deg, #705848, #9B7E68);
}

.ground {
    background: linear-gradient(135deg, #E0C068, #F2DE98);
}

.bug {
    background: linear-gradient(135deg, #A8B820, #C6D030);
}
</style>
