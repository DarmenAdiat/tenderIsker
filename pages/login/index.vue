<template>
  <v-container style='max-width: 1280px;'>
    <v-row>
      <v-col
        cols='12'
        sm='12'
      >
        <v-sheet
          rounded='lg'
          align='center'
          style='width: 670px;margin: auto'
        >
          <!--  -->
          <v-container fluid>
            <v-row dense>
              <v-col>
                <v-card
                  outlined
                  style='width:600px;margin: 20px;min-height: 100px;padding: 20px;'
                >
                  <h1 style='margin: 0 auto 10px'>Вход на сайт</h1>

                  <v-btn-toggle
                    v-model="wayToEnter"
                    style='margin-bottom: 20px;width: 100%'
                    mandatory
                  >
                    <v-btn
                      width='50%'
                    >
                      <v-icon>mdi-email</v-icon>
                      &nbsp;Вход по почте
                    </v-btn>

                    <v-btn
                      width='50%'
                    >
                      Вход по БИН&nbsp;
                      <v-icon>confirmation_num</v-icon>
                    </v-btn>
                  </v-btn-toggle>


                  <!-- Если пользователь НЕ существует -->
                  <v-form
                    v-if='exist === false && active === false && wayToEnter === 0'
                    ref='form'
                    v-model='valid'
                    @submit.prevent="checkUsername"
                  >
                    <v-text-field
                      v-model='login'
                      :rules='loginRules'
                      :error-messages="error_message_username"
                      label='Имя пользователя'
                      prepend-icon='mdi-account'
                      autocomplete='email'
                      required
                    ></v-text-field>
                    <v-btn
                       class='primary'
                       style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                       @click='checkUsername'
                     >
                       Далее
                     </v-btn>
                  </v-form>

                  <!-- Если пользователь существует, и Активен = Логиним -->
                  <v-form
                    v-if='exist === true && active === true && wayToEnter === 0'
                    ref='form'
                    v-model='valid'
                    @submit.prevent="submit"
                  >
                    <v-text-field
                      v-model='login'
                      :rules='loginRules'
                      label='Имя пользователя'
                      prepend-icon='mdi-account'
                      autocomplete='email'
                      disabled
                      required
                    ></v-text-field>
                    <v-text-field
                      v-if='!resetEmail'
                      v-model="password"
                      :rules="passwordRules"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      :error-messages="error_message_pass"
                      prepend-icon="mdi-lock"
                      autofocus
                      counter
                      label="Пароль"
                      autocomplete="password"
                      required
                      @click:append="show = !show"
                    ></v-text-field>

                    <v-btn
                      v-if='!resetEmail'
                      class='primary'
                      type="submit"
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                    >
                      Войти
                    </v-btn>

                    <h5
                      v-if='!resetEmail'
                      style='margin: 10px auto 0'
                    >
                      <a @click='resetByEmail'>Забыли пароль?</a>
                    </h5>

                    <v-btn
                      v-if='resetEmail'
                      class='primary'
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      @click='sendResetCode'
                    >
                      Восстановить пароль
                    </v-btn>

                    <v-text-field
                      v-if='codeSent'
                      v-model="emailCode"
                      v-mask="'######'"
                      :rules='codeRules'
                      :disabled='validCode'
                      :error-messages="error_message_code"
                      type='number'
                      style='width: 100%; margin-top: 20px'
                      label="Код подтверждения"
                      placeholder='Введите код подтверждения'
                      prepend-icon="mdi-lock"
                      reqiured
                    ></v-text-field>
                    <v-btn
                      v-if='codeSent'
                      :disabled='validCode'
                      :hidden='validCode'
                      class='primary'
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      @click='checkCode'
                    >Ввести код подтверждения</v-btn>

                    <h3
                      v-if='validCode'
                      style='margin: 10px;'
                    >Установите пароль для Вашего аккаунта</h3>
                    <v-text-field
                      v-if='validCode'
                      v-model="password"
                      :rules="passwordRules"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      :error-messages="error_message_new_pass"
                      prepend-icon="mdi-lock"
                      counter
                      label="Введите пароль"
                      required
                      @click:append="show2 = !show2"
                    ></v-text-field>
                    <v-text-field
                      v-if='validCode'
                      v-model="passwordRepeat"
                      :rules="[passwordConfirmationRule]"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      prepend-icon="mdi-lock"
                      counter
                      label="Повторите пароль"
                      required
                      @click:append="show = !show"
                    ></v-text-field>
                    <v-btn
                      v-if='validCode'
                      class="info"
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      @click="saveNewPassword"
                    >
                      Сохранить пароль и войти
                    </v-btn>

                  </v-form>

                  <!-- Если пользователь существует, но НЕактивен -->
                  <v-form
                    v-if='exist === true && active === false && wayToEnter === 0'
                    ref='form'
                    v-model='valid'
                    @submit.prevent=""
                  >
                    <v-text-field
                      v-model='login'
                      :rules='loginRules'
                      label='Имя пользователя'
                      prepend-icon='mdi-account'
                      autocomplete='email'
                      disabled
                      required
                    ></v-text-field>
                    <v-btn
                      class='primary'
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      :disabled='codeSent'
                      @click='sendCode'
                    >
                      Отправить код подтверждения на почту
                    </v-btn>

                    <v-text-field
                      v-if='codeSent'
                      v-model="emailCode"
                      v-mask="'######'"
                      :rules='codeRules'
                      :disabled='validCode'
                      :error-messages="error_message_code"
                      type='number'
                      style='width: 100%; margin-top: 20px'
                      label="Код подтверждения"
                      placeholder='Введите код подтверждения'
                      prepend-icon="mdi-lock"
                      reqiured
                    ></v-text-field>
                    <v-btn
                      v-if='codeSent'
                      :disabled='validCode'
                      :hidden='validCode'
                      class='primary'
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      @click='checkCode'
                    >Ввести код подтверждения</v-btn>

                    <h3
                      v-if='validCode'
                      style='margin: 10px;'
                    >Установите пароль для Вашего аккаунта</h3>
                    <v-text-field
                      v-if='validCode'
                      v-model="password"
                      :rules="passwordRules"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      :error-messages="error_message_new_pass"
                      prepend-icon="mdi-lock"
                      counter
                      label="Введите пароль"
                      required
                      @click:append="show2 = !show2"
                    ></v-text-field>
                    <v-text-field
                      v-if='validCode'
                      v-model="passwordRepeat"
                      :rules="[passwordConfirmationRule]"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      prepend-icon="mdi-lock"
                      counter
                      label="Повторите пароль"
                      required
                      @click:append="show = !show"
                    ></v-text-field>
                    <v-checkbox
                      v-if='validCode'
                      v-model="checkbox"
                      :rules="checkboxRules"
                    >
                      <template #label>
                        <div>
                          Даю свое
                          <v-tooltip bottom>
                            <template #activator="{ on }">
                              <a
                                target="_blank"
                                href="/privacy.docx"
                                @click.stop
                                v-on="on"
                              >
                                Согласие
                              </a>
                            </template>
                            Согласие на обработку персональных данных
                          </v-tooltip>
                          на обработку персональных данных
                        </div>
                      </template>
                    </v-checkbox>
                    <v-btn
                      v-if='validCode'
                      class="info"
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      @click="saveNewPassword"
                    >
                      Сохранить пароль и войти
                    </v-btn>
                  </v-form>
                  <!-- LOGIN BY BIN -->
                  <v-form
                    v-if='wayToEnter === 1'
                    id='login_bin'
                    ref='form'
                    v-model='valid'
                    @submit.prevent="submit_bin"
                  >
                    <v-text-field
                      v-model='login_bin'
                      :rules='login_binRules'
                      type='number'
                      label='БИН пользователя'
                      prepend-icon='mdi-account'
                      autocomplete='bin'
                      min='0'
                      :error-messages="error_message_username"
                      counter
                      autofocus
                      required
                    ></v-text-field>
                    <v-text-field
                      v-if='!resetBin'
                      v-model="password"
                      :rules="passwordRules"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      :error-messages="error_message_pass"
                      prepend-icon="mdi-lock"
                      counter
                      label="Пароль"
                      autocomplete="password"
                      required
                      @click:append="show = !show"
                    ></v-text-field>

                    <v-btn
                      v-if='!resetBin'
                      class='primary'
                      type="submit"
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                    >
                      Войти
                    </v-btn>
                    <h5
                      v-if='!resetBin'
                      style='margin: 10px auto 0'
                    >
                      <a @click='resetByBin'>Забыли пароль?</a>
                    </h5>
                    <v-btn
                      v-if='resetBin && !hideCheckBin'
                      class='primary'
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      @click='checkBin'
                    >
                      Ввести БИН
                    </v-btn>

                    <h3
                      v-if='codeSent'
                    >На вашу почту {{ resetBinMessage }} было отправлено письмо с кодом подтверждения</h3>


                    <v-text-field
                      v-if='codeSent'
                      v-model="emailCode"
                      v-mask="'######'"
                      :rules='codeRules'
                      :disabled='validCode'
                      :error-messages="error_message_code"
                      type='number'
                      style='width: 100%; margin-top: 20px'
                      label="Код подтверждения"
                      placeholder='Введите код подтверждения'
                      prepend-icon="mdi-lock"
                      reqiured
                    ></v-text-field>
                    <v-btn
                      v-if='codeSent'
                      :disabled='validCode'
                      :hidden='validCode'
                      class='primary'
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      @click='checkCode'
                    >Ввести код подтверждения</v-btn>

                    <h3
                      v-if='validCode'
                      style='margin: 10px;'
                    >Установите пароль для Вашего аккаунта</h3>
                    <v-text-field
                      v-if='validCode'
                      v-model="password"
                      :rules="passwordRules"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      :error-messages="error_message_new_pass"
                      prepend-icon="mdi-lock"
                      counter
                      label="Введите пароль"
                      required
                      @click:append="show2 = !show2"
                    ></v-text-field>
                    <v-text-field
                      v-if='validCode'
                      v-model="passwordRepeat"
                      :rules="[passwordConfirmationRule]"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      prepend-icon="mdi-lock"
                      counter
                      label="Повторите пароль"
                      required
                      @click:append="show = !show"
                    ></v-text-field>
                    <v-btn
                      v-if='validCode'
                      class="info"
                      style='width: 100%;height:40px;margin: 20px auto 10px;text-align: center;'
                      @click="saveNewPassword"
                    >
                      Сохранить пароль и войти
                    </v-btn>


                  </v-form>



                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VueMaskDirective } from 'v-mask'
import Vue from 'vue'
Vue.directive('mask', VueMaskDirective);

export default {
  name: 'Login',

  data: () => ({
    exist: false, // существует ли логин в базе
    active: false, // активирован ли пользователь

    wayToEnter: 0,

    resetEmail: false, // восстановить пароль по Email-у
    resetBin: false, // восстановить пароль по БИНу

    resetEmailCodeSent: false, // код подтверждения сброса отправлен

    resetBinMessage: '',
    hideCheckBin: false,

    codeSent: false, // отправлен ли код подтверждения - открываем инпут проверки кода
    // codeSent: true, // отправлен ли код подтверждения - открываем инпут проверки кода
    emailCode: '', // переменная введенного кода подтверждения
    validCode: false, // правильно ли введен код подтверждения - открываем ввод пароля
    // validCode: true, // правильно ли введен код подтверждения - открываем ввод пароля

    valid: false, // модель формы

    error_message_username: '',
    error_message_pass: '',
    error_message_code: '',
    error_message_new_pass: '',

    // checkLogin: false,
    login: '',
    login_bin: '',
    // password data
    password: '',
    passwordRepeat: '',
    show: false,
    show2: false,
    // Rules
    loginRules: [
      v => !!v || 'Введите Имя пользователя',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || v === 'jfox' || 'Вы неправильно ввели Имя пользователя',
    ],
    login_binRules: [
      v => !!v || 'Это поле не может быть пустым',
      v => v && v.length <= 50 || "Максимум 50 символов",
    ],
    passwordRules: [
      v => !!v || 'Пароль обязательное поле',
      v => v && v.length <= 100 || "Максимум 100 символов",
      // v => v && v.length >= 8 || "Минимум 8 символов",
      v => !v || /\d/.test(v) || 'Пароль должен содержать минимум одну цифру',
      // v => !v || /[a-z]/.test(v) || 'Пароль должен содержать минимум одну букву нижнего регистра',
      // v => !v || /[A-Z]/.test(v) || 'Пароль должен содержать минимум одну букву верхнего регистра',
    ],
    codeRules: [
      v => !!v || 'Введите код подтверждения',
      v => v && v.length === 6 || "Код подтверждения состоит из 6 цифр",
    ],
    checkbox: false,
    checkboxRules:[
      v => v === true || 'Подтвердите свое согласие',
    ],
  }),
  head: {
    title: 'Авторизация'
  },
  computed:{
    passwordConfirmationRule() {
      // check is repeated password is similar with first entered
      return () => (this.password === this.passwordRepeat) || 'Пароли не совпадают'
    },
  },
  watch:{
    wayToEnter(){
      // if (!this.wayToEnter) this.wayToEnter = 0
      console.log(this.wayToEnter)
    }
  },
  methods: {

    // функция логина
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          const login = {
            'username': this.login,
            'password': this.password
          }
          await this.$auth.loginWith('local', { data: login })
          // await this.$router.push('/')
        } catch (e) {
          console.log(e)
        }
        this.error_message_pass = 'Вы ввели неправильный пароль'
      }
    },
    async submit_bin(){
      if (this.$refs.form.validate()) {
        try {
          const login = {
            'username': this.login_bin,
            'password': this.password
          }
          await this.$auth.loginWith('local_bin', { data: login })
          // await this.$router.push('/')
        } catch (e) {
          console.log(e)
        }
        this.error_message_pass = 'Вы ввели неправильный пароль'
      }
    },

    // проверка имени пользователя
    async checkUsername() {
      if (this.$refs.form.validate()) {
        try {
          // this.checkLogin = false
          const username = this.login

          let checker = await this.$axios.$get('api/v1/is_active/' + username + '/')
          checker = checker[0]
          if (checker) {
            this.exist = true
            if (checker.is_active === true) {
              this.active = true
            } else {
              this.active = false
            }
          } else {
            this.exist = false
            this.error_message_username = 'Пользователя с таким именем не существует'
            // console.log(this.exist)
          }
        } catch (e) {
          console.log(e)
          // this.checkLogin = true
        }
      }
    },
    async checkBin(){
      try {
        const username = this.login_bin

        let checker = await this.$axios.$get('api/v1/check_bin/' + username + '/')
        checker = checker[0]
        if (checker) {
          this.error_message_username = ''
          this.resetBinMessage = checker.email // зашифрованная почта
          this.hideCheckBin = true
          await this.sendCode()
          console.log(this.resetBinMessage)
        } else {
          this.error_message_username = 'Пользователя с таким БИН не существует'
        }
      } catch (e) {
        console.log(e)
      }
    },

    // Отправить код подтверждения на почту
    async sendCode(){
    // sendCode(){
        try {
          let username = ''
          if (this.hideCheckBin) { username = this.login_bin }
          else { username = this.login }
          // отправляем запрос на сервер, там генерируем одноразовый пароль и отправляем на почту пользователя
          await this.$axios.$post('api/v1/verification/' + username + '/')
          this.codeSent = true
        } catch (e) {
          console.log(e)
        }
    },

    // проверить код подтверждения - совпадает ли
    async checkCode(){
      if (this.$refs.form.validate()) {
        try {
          let username = ''
          if (this.hideCheckBin) { username = this.login_bin }
          else { username = this.login }

          let check = await this.$axios.$get('api/v1/verification/' + username + '/')
          check = check[0].verification
          check = parseInt(check)
          // this.emailCode = parseInt(this.emailCode)

          if (check === parseInt(this.emailCode)){
            this.validCode = true // если код правильный
            // alert('CODE SUCCESS') // если код правильный
            // проверяем одноразовый пароль, если совпадает то даем возможность ввести новый пароль
          } else {
            // если НЕ совпадает то выводим `error-messages`
            this.validCode = false // если код НЕправильный
            this.error_message_code = 'Вы ввели неправильный код подтверждения'
          }
        } catch (e) {
          console.log(e)
        }
      }
      else {
        this.validCode = false
      }
    },

    // Сохранить новый пароль от аккаунта и при успехе перезагрузить страницу для логина
    async saveNewPassword(){
      if (this.$refs.form.validate()) {
        try {
          let username = ''
          if (this.hideCheckBin) { username = this.login_bin }
          else { username = this.login }

          await this.$axios.$patch('api/v1/activate/' + username + '/',{
            code: this.emailCode,
            new_password: this.password,
            new_password2: this.passwordRepeat,
          })
          // console.log(response)
          await new Promise(resolve => this.$router.go())
        } catch (e) {
          console.log(e)
          this.error_message_new_pass = e.response.data.new_password
        }
      } else {
        console.log('Not Valid')
      }
    },

    resetByEmail(){
      this.resetEmail = true
      console.log('reset by email')
    },
    resetByBin(){
      this.resetBin = true
      console.log('reset by BIN')
    },

    sendResetCode(){
      this.resetEmailCodeSent = true
      this.sendCode()

      console.log('reset code sent')
    },



  }
}
</script>

<style scoped>

</style>
