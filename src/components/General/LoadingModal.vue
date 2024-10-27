<template>
    <div v-if="isLoading" class="loading-modal">
      <div class="modal-content">
        <p>Loading<span class="dot1">.</span><span class="dot2">.</span><span class="dot3">.</span></p>
        <div class="spinner">
          <img src="../../../public/Images/gifs/pikachu-running.gif" alt="Pikachu running">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isLoading: {
        type: Boolean,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .loading-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    font-family: Pokemon GB;
    color: white;
    font-size: 2em;
  }
  
  .modal-content {
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  
  .dot1, .dot2, .dot3 {
    animation: blink 1s infinite;
  }
  
  .dot2 {
    animation-delay: 0.3s;
  }
  
  .dot3 {
    animation-delay: 0.6s;
  }
  
  @keyframes blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  
  .spinner {
    margin-top: 20px;
  }
  </style>
  