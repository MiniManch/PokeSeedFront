<template >
    <div class="SelectPokemon">
        <div class="container">
            <PokeTypes :choose="true"/>
        </div>
    </div>
</template>
<script>
import PokeTypes from '../Poke/PokeTypes.vue';
import { checkTokenValidity } from '@/utils/auth';
import {fetchAllTypes, fetchAllPokemon} from '@/utils/crud';

export default {
    components: {
        PokeTypes,
    },
    data(){
        return{
            Pokemon:null,
            PokeTypes:null,
        }
    },
    created() {
        checkTokenValidity().then(isValid => {
            if (!isValid) {
                this.$router.push('/login');
            }else{
                fetchAllPokemon(this);
                fetchAllTypes(this);
            }
        });
    }
};
</script>

<style scoped>
.SelectPokemon{
    display: flex;
    justify-content: center;
    align-items: center;
}

.container{
    display: flex;
    align-items: center;
    min-height: 100vh;
}
</style>
