<template>
  <div style="padding: 0 15px;" @click="handleLogout">
    <item icon="el-icon-switch-button" class="logout-menu" />
  </div>
</template>

<script>
import Item from './Item'
export default {
  name: 'SignOut',
  components: { Item },
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleLogout() {
      this.$emit('handleLogout')
    }
  }
}
</script>

<style lang="scss" scoped>
.logout-menu{
    font-size: 14px;
    color: #ffffff;
    transition: 0.25s;
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;

    &:hover{
      cursor: pointer;
      color: #fff !important;
      background-color: #253E57 !important;
    }

    &:focus{
      @extend .logout-menu;
    }
  }
</style>
