<template >
    <div>
        <!-- Show selected trainer, team and stats of user -->
    </div>
</template>
<script>
export default {
    data(){
        return{
            user:null,
            trainer:localStorage.getItem('gameTrainer'),
            team: localStorage.getItem('gameTeam'),
        }
    },
   
}
</script>
<style scoped>
    
</style>