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
            console.log(icon)
            return icon.image;
        }
    }
}

</script>

<style scoped>
    img{
        width:2vw;
    }
</style>