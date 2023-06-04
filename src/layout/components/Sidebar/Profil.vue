<template>
  <router-link to="#">
    <div class="profil">
      <!-- <div v-if="name !== ''" class="profil-avatar" :class="{'collapse':collapse}">{{ name | initialFormat }}</div> -->
      <span class="profil-name" :class="{'collapse':collapse}">{{ name }}</span>
    </div>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  filters: {
    initialFormat: function(name) {
      const nameString = name.split(' ')
      const initials = nameString.shift().charAt(0) + nameString.pop().charAt(0)
      return initials.toUpperCase()
    }
  },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.profil{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px 0 10px;
  height: auto;
  background: #e83328;
  border-radius: 37px;
  &-avatar{
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    // background: #1B354E;
    border: 2px solid #990002;
    color: #990002;
    font-size: 26px;
    font-weight: 700;
    transition: 0.25s;

    &.collapse{
      width: 35px;
      height: 35px;
      background: none;
      font-size: 20px;
    }

  }

  &-name{
    display: block;
    font-weight: bold;
    color: #d6d6f2;
    line-height: 22px;
    margin: 10px;
    transition: 0.25s;

    &.collapse{
      display: none;
    }
  }

  &:hover{
    .profil-name, .profil-avatar.collapse{
      color: #FFF;
    }
  }
}
</style>
