<template>
  <div class="app-container">
    <div class="err-image">
      <img class="pic-400__child left" src="@/assets/400_images/question-mark.png" alt="400">
      <img class="pic-400__child mid" src="@/assets/400_images/question-mark.png" alt="400">
      <img class="pic-400__child right" src="@/assets/400_images/question-mark.png" alt="400">
    </div>
    <div class="error-container">
      <div class="error-code">400</div>
      <div class="error-title">Uh oh...</div>
      <div class="error-info">Your browser sent something we don't understand</div>
      <el-button class="button-custom primary" @click="back">Back</el-button>
    </div>
    <svg class="wave-top" viewBox="0 0 475 226" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.05176e-05 226V0H475C381.944 140.73 176.303 81.399 3.05176e-05 226Z" fill="#DDFFBB"/>
    </svg>
    <svg class="wave-bottom" viewBox="0 0 684 326" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M684 0V326H0C134 123 430.123 208.584 684 0Z" fill="#0089C4"/>
    </svg>
  </div>
</template>

<script>

export default {
  name: 'Page401',
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.err-image {
  position: relative;
  .pic-400__child{
    position: absolute;
    &.left {
      width: 40px;
      top:100px;
      left: 30px;
      opacity: 0;
      animation-name: markLeft;
      animation-duration: 2s;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      animation-delay: 1s;
    }
    &.mid {
      width: 20px;
      top:150px;
      left: 160px;
      opacity: 0;
      animation-name: markMid;
      animation-duration: 2s;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      animation-delay: 1s;
    }
    &.right {
      width: 50px;
      top: 120px;
      left: 310px;
      opacity: 0;
      animation-name: markRight;
      animation-duration: 2s;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      animation-delay: 1s;
    }   
  }
}

.error-container{
  width: 400px;
  text-align: center;
  animation: appear 0.5s;
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
  opacity: 0;
  .error{
    &-code{
      font-size: 144px;
      color: #393939;
      font-weight: 500;
    }
    &-title{
      font-size: 36px;
      color: #0089C4;
      font-weight: 500;
      margin-bottom: 10px;
    }
    &-info{
      color: #9C9C9C;
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0.02em;
    }
  }
}

.wave{
  &-top{
    width: 475px; 
    height: 226px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1
  } 
  
  &-bottom{
    width: 475px; 
    height: 226px;
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: -1
  }
}

// Media Responsive
@media(max-width:1400px){
  .wave-top, .wave-bottom{
    width: 300px; 
    height: 142.73px;
  }
}

@media(max-width:1000px){
  .wave-top, .wave-bottom{
    width: 150px;
    height: 71.365px;
  }
}

@media(max-width:600px){
  .err-image {
    display: none;
  }  
  .error-container{
    .error{
      &-code{
        font-size: 100px;
      }
      &-title{
        font-size: 24px;
      }
      &-info{
        font-size: 12px;
      }
    }
  }
  .wave-top, .wave-bottom{
    display: none;
  }
}


// Keyframes
@keyframes appear {
  0%{
    opacity: 0;
    transform: scale(0)
  }
  85%{
    opacity: 1;
    transform: scale(1.2);
  }

  100%{
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes markLeft {
  0% {
  opacity: 0;
  top: 100px;
  }
  40% {
  opacity: 1;
  top: 40px;
  }
  70% {
  opacity: 1;
  top: 10px;
  }
  100% {
  opacity: 0;
  top: -10px;
  }
}
@keyframes markMid {
  0% {
  opacity: 0;
  top: 150px;

  }
  40% {
  opacity: 1;
  top: 100px;

  }
  100% {
  opacity: 0;
  top: 30px;
  }
}
@keyframes markRight {
  0% {
  opacity: 0;
  top: 120px;

  }
  30% {
  opacity: 1;
  top: 80px;

  }
  70% {
  opacity: 1;
  top: 40px;

  }
  100% {
  opacity: 0;
  top: 10px;
  }
}
    
</style>
