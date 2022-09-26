<template>
  <v-menu v-model="showMenu" offset-y>
    <template #activator="{ on }">
      <v-btn class="btnLocaleActivation" text v-on="on" >
        <v-icon>mdi-earth</v-icon>
        &nbsp;{{ displayLocale }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, i) in langs"
        :key="`Lang${i}`"
        :value="item.lang"
        :class="[item.class]"
        active-class="white--text"
        @click="switchLocale(item.lang)"
      >
        <country-flag :country="item.flag" size="small" />
        <v-list-item-title class="ml-3">{{
            item.lang.toUpperCase()
          }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  components: {
    CountryFlag
  },

  data() {
    return {
      showMenu: false,
      langs: [
        {
          lang: 'ru',
          flag: 'ru',
          class: 'btnRU'
        },
        {
          lang: 'en',
          flag: 'gb',
          class: 'btnEN'
        },
        {
          lang: 'kz',
          flag: 'kz',
          class: 'btnKZ'
        },
      ]
    }
  },
  computed: {
    displayLocale() {
      // return this.$i18n.locale
      return 'RU'
    }
  },
  methods: {
    switchLocale(lang) {
      this.$store.dispatch('setLocale', lang)
    }
  },

}
</script>

<style>
.flag {
  width: 118px !important;
}
</style>
