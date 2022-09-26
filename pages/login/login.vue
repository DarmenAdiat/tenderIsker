<template>
  <v-container>
    <v-row
      justify="center"
    >
      <v-col
        sm="8"
        md="6"
        lg="5"
        style='text-align: center'
      >
        <h1 style='margin: 10px auto'>Авторизация</h1>

        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="login"
            :rules="loginRules"
            label="Имя пользователя"
            prepend-icon="mdi-account"
            autocomplete="username"
            counter
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            counter
            label="Пароль"
            autocomplete="password"
            required
            @click:append="show = !show"
          ></v-text-field>
          <v-row style='margin: 5px auto;padding: 0;min-height: 20px;'>
            <h5 v-if='checkLogin' class='error--text' style='text-align: center;margin: 0 auto'>Неправильный пароль, или аккаунт не
              <a href='/register'>зарегистрирован</a></h5>
          </v-row>
          <v-row style='margin: 10px 0 10px 0;text-align: center;width: 100%;padding: 0'>
            <v-btn
              class="primary"
              type="submit"
              style='width: 90%;height:40px;margin: auto;text-align: center;'
            >
              Войти
            </v-btn>
            <h5 style='margin: 20px auto'><a href='Reset' class='link_hover_red'>Забыли пароль?</a></h5>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    valid: false,
    checkLogin: false,
    login: '',
    password: '',
    show: false,
    loginRules: [
      v => !!v || 'Введите Имя пользователя',
      v => /.+@.+\..+/.test(v) || v==='jfox' || 'Вы неправильно ввели Имя пользователя',
    ],
    passwordRules: [
      v => !!v || 'Пароль обязательное поле',
    ],
  }),
  head: {
    title: 'Авторизация',
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.checkLogin = false
          const login = {
            'username': this.login,
            'password': this.password
          }
          await this.$auth.loginWith('local', {data: login})
          await this.$router.push('/')
        } catch (e) {
          // console.log(e)
          this.checkLogin = true
        }
      }
    },
    clear() {
      this.$refs.form.reset()
    },
  },
}
</script>

<style scoped>

</style>
