<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <profil :collapse="isCollapse" />
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        <!-- <el-menu-item class="logout-menu" @click.native="handleLogout">
          <item icon="el-icon-switch-button" title="Sign Out" />
        </el-menu-item> -->
      </el-menu>
    </el-scrollbar>

    <!-- DIALOG -->
    <el-dialog :visible.sync="dialogProfil" class="dialog-small">
      test
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import Profil from './Profil'
import SidebarItem from './SidebarItem'
import Item from './Item'
import { MessageBox } from 'element-ui'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo, Profil, Item },
  data() {
    return {
      dialogProfil: false
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    handleLogout() {
      MessageBox.confirm('Are you sure you want to log out?', 'Sign out Confirmation', {
        confirmButtonText: 'Log Out',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.logout()
      }).catch(() => {})
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
  .logout-menu{
    font-size: 14px;
    color: #b7b7b7;
    transition: 0.25s;

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
