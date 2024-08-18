<template>
    <div class="SignUpContainer">
        <div class="container">
        <form @submit.prevent="registerUser" class="framed">
        <h1>Sign Up</h1>
            <div >
                <label for="username">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    v-model="username" 
                    @input="checkInput('username')" 
                    required
                />
            </div>
            <div>
                <label for="password">Password</label>
                <input 
                    type="password"
                    id="password"
                    v-model="password"
                    @input="checkInput('password')"
                    required 
                />
            </div>
            <ul class="framed buttons ">
                <li><button class='button' type="submit"> SignUp</button></li>
              </ul>
        </form>
        </div>
    </div>
    <PopUpModal
        v-if="errorMessage || successMessage"
        :title="messageType"
        :message="errorMessage || successMessage"
        @close="closePopUp()"
    />
  </template>
  
  <script>
  import axios from 'axios';
  import PopUpModal from '../General/PopUpModal.vue';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: null,
        successMessage: null,
        messageType:null
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post('/api/users/register', {
            username: this.username,
            password: this.password,
          });
          this.successMessage = response.data.message;
          this.messageType = 'success'
        // Need to setup router and redirect to Login page.
        //   setTimeout(() => {
        //     this.$router.push('')
        //   },1500)
          this.errorMessage = null;
        } catch (error) {
          this.errorMessage = error.response.data.message || 'Error registering user';
          this.messageType = 'error'
          this.successMessage = null;
        }
      },
      checkInput(inputName){
        if(inputName == 'username' && this.username.length > 10){
            console.log(this.username)
            this.username = this.username.slice(0,10);
            this.successMessage = 'Username length is limited to 10 characters';
            this.messageType = 'error'
        } 
      },
      closePopUp(){
        this.errorMessage= null,
        this.successMessage=  null,
        this.messageType= null
      }
    },
    components:{
        PopUpModal
    }
  };
  </script>
<style scoped>
*{
    font-family: Pokemon GB;
}
.SignUpContainer{
    height:60vh;
    width:100vw;

    display: flex;
    align-items: center;
    justify-content: center;
}
.container{
    height:100%;
    width:30vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1{
    font-size: 3em;
    margin-bottom: 1vw;
}
form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap:1vw;
    width:100%;
}

form > div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1vh;
    margin-bottom: 1vh
}

label{
    font-size: 1em;
}

input{
    width:15vw;
    height:4vh;
}

ul.framed{
    width:fit-content;
    margin-top:0;
}
</style>