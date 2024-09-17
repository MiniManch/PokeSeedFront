<template >
    <div class="viewMoveContainer">
        <img :src="getIcon(move)" alt="">
        <p>{{move.name}}</p>
    </div>
</template>

<script>
import typeIcons from '@/assets/data/typeIcons.json';
export default {
    props:{
        move:{
            type:Object
        }
    },
    methods:{
        getIcon(move){
            const icon = typeIcons.filter(obj=>obj.name == move.type)[0];
            return icon.image;
        }
    }
}

</script>

<style scoped>
    .viewMoveContainer{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    img{
        width:2vw;
    }
</style>