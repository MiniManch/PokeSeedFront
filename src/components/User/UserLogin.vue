<template>
    <div class="LogInContainer">
        <div class="container">
        <form @submit.prevent="loginUser" class="framed">
        <h1> Log In</h1>
            <div >
                <label for="username">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    v-model="username" 
                    required
                />
            </div>
            <div>
                <label for="password">Password</label>
                <input 
                    type="password"
                    id="password"
                    v-model="password"
                    required 
                />
            </div>
            <ul class="framed buttons ">
                <li><button class='button' type="submit"> submit</button></li>
              </ul>
        </form>
        </div>
    </div>
    <PopUpModal
      v-if="errorMessage || successMessage"
      :title="messageType"
      :message="errorMessage || successMessage"
      :type="messageType"
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
      async loginUser() {
        try {
          const response = await axios.post('/api/users/login', {
            username: this.username,
            password: this.password,
          });
          localStorage.setItem('PokeSeed_token', response.data.token);
          this.successMessage = 'Logged In Successfully.',
          this.messageType = 'Success!';
        // Need to setup router and redirect to dashboard or smth.
        //   setTimeout(() => {
        //     this.$router.push('')
        //   },1500)
        } catch (error) {
          this.errorMessage = error.response.data.message || 'Error logging in';
          this.messageType = 'error';
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
  .LogInContainer{
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
  button.button{
    padding-right:1em;
  }
  </style>