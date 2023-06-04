<template>
  <div class="app-container">
    <div class="err-image">
      <img src="@/assets/401_images/401.png">
    </div>
    <div class="text-container">
      <h3 class="err-title">Sorry...</h3>
      <div class="err-info">but you can not go any further using unauthorized account</div>
    </div>
    <el-button class="button-custom primary" @click="relogin">Login Page</el-button>
  </div>
</template>

<script>

export default {
  name: 'Page401',
  methods: {
    async relogin() {
      await this.$store.dispatch('user/resetToken')
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;

    .err-image {
      img{
         width: 350px;
         opacity: 0;
         animation-name: slide;
         animation-duration: 1s;
         animation-fill-mode: forwards;
      }
    }

    .text-container {
      text-align: center;
      width: 350px;

      .err{
        &-title {
          font-size: 35px;
          color: #5375a6;
          margin: 10px;
        }

        &-info {
          font-size: 18px;
          color: #8a8a8a;
          margin: 20px 10px;
        }
      }
    }
  }

  // Media Responsive
  @media(max-width:600px),(max-height:600px){
    .app-container {
      .err-image {
        img {
          width: 200px;
        }
      }
      .text-container {
        padding: 0 1rem;

        .err-info{
          font-size: 14px;
        }
      }
    }
  }

  // Keyframes
  @keyframes slide {
      0% {
        transform: translateX(60px);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
</style>
