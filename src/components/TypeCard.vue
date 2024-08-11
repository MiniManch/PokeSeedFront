<template >
    <div class="TypeCard">
        <div class="title">
            <h1>{{PokeType.name}}</h1>
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
    }
}
</script>
<style scoped>
    .TypeCard{
        display: flex;
        flex-direction: Row;

        width:30vw;
        height:40vh;
    }

</style>