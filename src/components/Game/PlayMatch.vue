<template >
    <div>
        
    </div>
</template>
<script>
import { getUserData } from '@/utils/auth';
import { getTrainerData } from '@/utils/crud';

export default {
    data(){
        return{
            userData:JSON.parse(localStorage.getItem("PokeSeed_userData")),
            tournamentTree:JSON.parse(localStorage.getItem("PokeSeed_tournamentTree")),
            opponent:null,
            match:null,
        }
    },
    methods:{
        async findGame(){
            let games = []
            for(const match of this.tournamentTree.matches){
                for(const player of match.players){
                    if (player === this.userData.trainer){
                        games.push(match)
                    }
                }
            }
            this.match = games.reduce((max, obj) => 
                obj.matchNumber > max.matchNumber ? obj : max
            );
            for (const player of this.match.players){
                if (player != this.userData.trainer){
                    this.opponent = await getTrainerData(this,player);
                }
            }
        }
    },
    async mounted(){
        await getUserData(this);
        this.findGame()
    }
}
</script>
<style >
    
</style>