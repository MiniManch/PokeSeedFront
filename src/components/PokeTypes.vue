<template lang="">
    <div>
        <TypeCard :PokeType="testType" v-if="testType"/>
    </div>
</template>

<script>
import TypeCard from './TypeCard.vue';

export default {
    data(){
        return{
            testType:{name: 'Bug', image: '/TypeIcons/Bug.svg'}
        }
    },
    mounted(){
        console.log(this.testType)
    },
    components:{
        TypeCard,
    }
}
</script>
<style lang="">
    
</style>