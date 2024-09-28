 <template>
    <div>
        <!-- Add button to open trainers to choose from, also display current team and trainer -->
        <Trainers @select="selectTrainer" v-if="userData && userData.trainer == '' " />\
        <!-- add popup message saying you chose -trainer-  -->
    </div>
</template>

<script>
import Trainers from './Trainer/AllTrainers.vue';
import { getUserData } from '@/utils/auth';
import {updateUserData} from '@/utils/crud';

export default {
    components: {
        Trainers,
    },
    data(){
        return{
            userData:null,
            message:null,
    }
    },
    methods:{
        selectTrainer(trainer) {
            updateUserData({'trainer':trainer.name},this);
            getUserData(this);
        },
    },
    created(){
        getUserData(this).then(isValid => {
            if (!isValid) {
                this.$router.push('/login');
            }else{
                console.log('show the shit');
            }
        });
    },
    mounted(){
    }
}
</script>

<style scoped>
/* Add your styles here */
</style>