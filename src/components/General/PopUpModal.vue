<template>
    <div class="modal-overlay ">
      <div class="Modal" :class="['Modal framed', type == 'error' ? 'danger': 'primary']">
        <div class="'modal-header">
          <h2>{{ title }}</h2>
        </div>
        <div class="modal-body">
          <h3>{{ message }}</h3>   
            <button @click="closeModal" >Ok</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
      },
      message: {
        type: String,
      },
      type: {
        type: String,
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
    }
  };
  </script>
<style scoped>
*{
    font-family: Pokemon GB;
}
  .modal-overlay {
    position: fixed;
    z-index: 6;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .Modal{
    position: absolute;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 30vw;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .modal-header h2 {
    margin: 0;
  }
  
  .modal-header button {
    border: none;
    background: none;
    font-size: 20px;
    cursor: pointer;
  }
  
  .modal-body {
    padding: 10px 0;
  }
  
  .modal-body h3 {
    margin: 0;
  }
  
  .modal-body button {
    margin-top: 10px;
  }
  .modal-body{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
  }
  .modal-body button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: black;
    border-radius: 5px;
    cursor: pointer;
  }
  
  
  h3{
    line-height: 1.4em;
  }
  </style>
  