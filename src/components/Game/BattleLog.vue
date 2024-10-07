<template>
    <div class="battle-log framed">
        <p v-for="(log, index) in logs" :key="index">{{ log }}</p>
   
    </div>
  </template>
  
  <script>
  export default {
    props: {
      logs: {
        type: Array,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .battle-log {
    background-color: white;
    padding: 10px;
    max-height: 50vh;
    overflow-y: auto;
    width: 30vw;
    height:20vh;
    font-size: 1.5em;
  }
  </style>
  