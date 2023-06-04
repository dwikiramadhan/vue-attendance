<template>
  <div class="app-container">
    <div class="error-container">
      <div class="error-code">403</div>
      <div class="error-title">Where are you going?</div>
      <div class="error-info">ou do not have access to this area. Please click the button below to return to the homepage.</div>
      <router-link to="/">
        <el-button class="button-custom primary">Sure</el-button>
      </router-link>
    </div>
    <svg class="wave-top" viewBox="0 0 475 226" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.05176e-05 226V0H475C381.944 140.73 176.303 81.399 3.05176e-05 226Z" fill="#DDFFBB"/>
    </svg>
    <svg class="wave-bottom" viewBox="0 0 684 326" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M684 0V326H0C134 123 430.123 208.584 684 0Z" fill="#0089C4"/>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.app-container{
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>