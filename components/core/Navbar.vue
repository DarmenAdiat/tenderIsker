<template>
  <nav>
    <v-app-bar app>
      <span class="hidden-md-and-up">
        <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
      </span>
      <div class="headline text-uppercase ml-0">
          <nuxt-link
            v-if="$auth.loggedIn"
            :to="{ name: 'index' }"
            :style="styleLink"
          >
            {{ appTitle }}
          </nuxt-link>
          <nuxt-link
            v-else
            :to="{ name: 'login' }"
            :style="styleLink"
          >
            {{ appTitle }}
          </nuxt-link>
      </div>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          v-for="(item, index) in menuItems"
          :key="index"
          :to="{ name: item.link }"
          text
          exact
          :class="['hidden-sm-and-down', item.class]"
        >
          <v-icon>{{ item.icon }}</v-icon>
          &nbsp;{{ item.title }}
        </v-btn>

        <v-btn
          v-if="$auth.loggedIn" offset-y
          href='http://45.86.80.37:8000/admin'
          target="_blank"
          text
          exact
          :class="['hidden-sm-and-down',]"
        >
          <v-icon>mdi-lock</v-icon>
          &nbsp;АДМИНКА
        </v-btn>

        <v-list-item class="hidden-sm-and-down">
          <v-icon>mdi-weather-sunny</v-icon>
          <v-list-item-action>
            <v-switch v-model="isDark" inset></v-switch>
          </v-list-item-action>
          <v-icon class="pl-2">mdi-weather-night</v-icon>
        </v-list-item>

        <v-menu v-if="$auth.loggedIn" offset-y>
          <template #activator="{ on }">
            <v-btn text class="btnAdmin hidden-sm-and-down" v-on="on" >
              <v-icon>mdi-account</v-icon>
              &nbsp;{{ user.email }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in accountItems"
              :key="index"
              :to="{ name: item.link }"
              exact
              :class="[item.class]"
            >
              <v-list-item-icon class="mr-3">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>


            <v-list-item v-if="$auth.loggedIn" @click="userLogout">
              <v-list-item-icon class="mr-3">
                <v-icon>mdi-exit-to-app</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Выйти
              </v-list-item-title>
            </v-list-item>


          </v-list>
        </v-menu>


        <LocaleChanger/>

      </v-toolbar-items>
    </v-app-bar>
    <v-navigation-drawer v-model="sidebar" app absolute disable-resize-watcher>
      <v-list>
        <v-list-item>
          <v-list-item-content>{{ appTitle }}</v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click.stop="sidebar = !sidebar">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :to="{ name: item.link }"
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>


        <v-list-group v-if="$auth.loggedIn" prepend-icon="mdi-lock" no-action>
          <v-list-item slot="activator" class="pl-0">
            <v-list-item-content>АККАУНТ</v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(item, index) in accountItems"
            :key="index"
            :to="{ name: item.link }"
            exact
          >
            <v-list-item-icon class="mr-3">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="$auth.loggedIn" @click="userLogout">
            <v-list-item-icon class="mr-3">
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Выйти
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item
          href='http://45.86.80.37:8000/admin'
          target="_blank"
          exact
        >
          <v-list-item-action>
            <v-icon>mdi-lock</v-icon>
          </v-list-item-action>
          <v-list-item-content>АДМИНКА</v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action></v-list-item-action>
          <v-icon>mdi-weather-sunny</v-icon>
          <v-list-item-action class="ml-2">
            <v-switch id="themeSwitcher" v-model="isDark"></v-switch>
          </v-list-item-action>
          <v-icon>mdi-weather-night</v-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import LocaleChanger from '@/components/core/LocaleChanger'

export default {
  name: 'Navbar',
  components: {
    LocaleChanger
  },
  data: () => ({
    isDark: false,
    sidebar: false,
    appTitle: 'ISKER Group',
    styleLink: {
      color: '#fff',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    link: '',
  }),
  computed: {
    user() {
      return this.$auth.user
    },
    admin() {
      return !!this.$auth.loggedIn;
    },
    accountItems() {
      if (this.$auth.loggedIn) {
        return [
          {
            title: 'Уведомления',
            link: 'profile-notifications',
            icon: 'mdi-bell',
            class: 'btnProfile'
          },
          {
            title: 'Избранное',
            link: 'profile-favorites',
            icon: 'mdi-bookmark',
            class: 'btnProfile'
          },
          {
            title: 'Профиль',
            link: 'profile',
            icon: 'mdi-account-details',
            class: 'btnProfile'
          },
          {
            title: 'Настройки',
            link: 'profile-settings',
            icon: 'mdi-account-cog',
            class: 'btnProfileSettings'
          }
        ]
      } else {
        return []
      }
    },
    adminItems() {
      if (this.$auth.loggedIn) {
        return [
          {
            title: 'Тендеры',
            link: 'admin-tenders',
            icon: 'mdi-city',
            class: 'btnAdminTenders'
          },
          {
            title: 'Пользователи',
            link: 'admin-users',
            icon: 'mdi-account-supervisor',
            class: 'btnAdminUsers'
          }
        ]
      }
      else {
        return []
      }
    },
    menuItems() {
      if (this.$auth.loggedIn) {
        return [
          {
            title: 'ГЛАВНАЯ',
            link: 'index',
            icon: 'mdi-home',
            class: 'btnHome'
          },
          // {
          //   title: 'FAQ',
          //   link: 'inspire',
          //   icon: 'mdi-help-circle-outline',
          //   class: 'btnFaq'
          // }
        ]
      }
      return [
        {
          title: 'ГЛАВНАЯ',
          link: 'index',
          icon: 'mdi-home'
        },
        // {
        //   title: 'FAQ',
        //   link: 'inspire',
        //   icon: 'mdi-help-circle-outline',
        //   class: 'btnAbout'
        // },
        {
          title: 'ЛОГИН',
          link: 'login',
          icon: 'mdi-lock',
          class: 'btnLogin'
        }
      ]
    },
    // isDark(){
    //   const dark = localStorage.getItem('dark')
    //   const dark2 =  dark ? JSON.parse(dark) : false
    //   return dark2
    // },
  },


  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark
      localStorage.setItem('dark', this.isDark)
      this.styleLink.color = this.$vuetify.theme.currentTheme.accent
    },
  },

  mounted() {
    const dark = localStorage.getItem('dark')
    this.isDark = dark ? JSON.parse(dark) : false
    this.styleLink.color = this.$vuetify.theme.currentTheme.accent
    this.overlay = false
    this.isLight = this.isDark === true;
  },

  methods: {
    async userLogout() {
      const logoutData = { 'refresh': this.$auth.strategy.refreshToken.get() }
      await this.$auth.logout({ data: logoutData })
      await this.$router.push('/login') // перенаправление после логаута
    },
  },

}
</script>

<style scoped>

</style>
