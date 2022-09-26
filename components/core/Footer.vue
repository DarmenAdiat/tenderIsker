<template>
  <v-footer
    padless
    app
  >
    <v-btn
      style='position:absolute;bottom: 100px;right: 10px;'
      @click='connectUs = true'
    >
      Обратная связь с ISKER
    </v-btn>
    <v-btn
      style='position:absolute;bottom: 50px;right: 10px;'
      @click='openInstructions'
    >
      Инструкции Тендерного портала
    </v-btn>
    <v-card class="flex" flat tile :elevation="10">
      <v-card-text class="py-2 text-center">
        &copy; ISKER Group {{ new Date().getFullYear() }}. All rights reserved. <u>Privacy Policy</u>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model='connectUs'
      max-width='600'
    >
      <v-card
      >
        <v-card-text style='text-align:center;padding: 24px 20px;color: black'>
          <h2 style='margin:5px 5px 20px 5px;'>Здесь Вы можете отправить свой вопрос<br>менеджеру компании ISKER</h2>
          <v-form
            ref='form'
            v-model='valid'
            @submit.prevent="sendConnectUs"
          >
          <h3 style='margin:5px 10px; text-align: left'>
            Ваш e-mail:
          </h3>
          <v-text-field
            v-model='guest_email'
            :rules='emailRules'
            style='margin: 0 10px;'
            label='Email'
            placeholder='Укажите почту для связи с Вами'
            type='email'
            autocomplete='email'
            autofocus
            outlined
            dense
          ></v-text-field>
            <h3 style='margin:0 10px 10px 10px; text-align: left'>
              Ваши ФИО:
            </h3>
            <v-text-field
              v-model='guest_names'
              :rules='subjectRules'
              style='margin: 0 10px'
              label='ФИО'
              placeholder='Укажите Ваши ФИО'
              type='text'
              outlined
              dense
            ></v-text-field>
            <h3 style='margin:0 10px 10px 10px; text-align: left'>
              Ваши номер телефона:
            </h3>
            <v-text-field
              v-model='guest_phone'
              :rules='subjectRules'
              style='margin: 0 10px'
              label='Телефон'
              placeholder='Укажите Ваш номер телефона для связи'
              type='text'
              outlined
              dense
            ></v-text-field>

          <h3 style='margin:0 10px 10px 10px; text-align: left'>
            Тема Вашего письма / Номер RFQ:
          </h3>
          <v-text-field
            v-model='guest_subject'
            :rules='subjectRules'
            style='margin: 0 10px'
            label='Тема письма'
            placeholder='Напишите здесь тему Вашего письма или Номер RFQ'
            type='text'
            outlined
            dense
          ></v-text-field>

          <h3 style='margin:0 10px 10px 10px; text-align: left'>
            Текст Вашего письма:
          </h3>
          <v-textarea
            v-model='guest_text'
            :rules='textRules'
            style='margin: 0 10px'
            label='Текст письма'
            placeholder='Напишите здесь текст Вашего письма'
            type='text'
            outlined
            auto-grow
            rows='4'
          ></v-textarea>


          <v-btn
            width='150px'
            style='margin-right: 135px;'
            title='Отменить'
            color='error'
            @click='connectUs = false'
          >
            <v-icon>mdi-close</v-icon>
            &nbsp;Отмена
          </v-btn>
          <v-btn
            width='250px'
            color='success black--text'
            type='submit'
          >
            Отправить
            <v-icon>mdi-check</v-icon>
          </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model='snack'
      :timeout='3000'
      :color='snackColor'
    >
      {{ snackText }}
      <template #action='{ attrs }'>
        <v-btn
          v-bind='attrs'
          class='black--text'
          text
          @click='snack = false'
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model='instructions'
      max-width='800'
    >
      <v-card
        class='mx-auto'
        tile
      >
        <v-card-text style='text-align:center;padding: 24px 20px;'>
          <h2>Инструкции Тендерного портала</h2>

          <v-list>
            <v-list-item-group
              color='primary'
            >
              <v-list-item
                v-for='(item, i) in instructionList'
                :key='i'
                :href='item.file'
                target='_blank'
              >
                <v-list-item-icon>
                  <v-icon>mdi-file</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    style='text-align: left'
                    v-text='item.name'
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions class='justify-end'>
          <v-btn
            text
            @click='instructions = false'
          >Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      valid: false,
      connectUs: false, // форма обратной связи
      instructions: false, // окно с инструкциями
      guest_email: '',
      guest_subject: '',
      guest_text: '',

      guest_names: '',
      guest_phone: '',

      instructionList: [],
      emailRules: [
        v => !!v || 'Введите Вашу почту',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Вы неправильно ввели почту',
      ],
      subjectRules: [
        v => !!v || 'Это поле не может быть пустым',
        v => v && v.length <= 150 || "Максимум 150 символов",
      ],
      textRules: [
        v => !!v || 'Это поле не может быть пустым',
        v => v && v.length <= 1000 || "Максимум 1000 символов",
      ],
      snack: false,
      snackColor: '',
      snackText: '',
    }},

  methods: {
    async sendConnectUs(){
      if (this.$refs.form.validate()) {
        try {
          await this.$axios.$post('/api/v1/contact_us/', {
            email: this.guest_email,
            subject: this.guest_subject,
            text: this.guest_text,
            names: this.guest_names,
            phone: this.guest_phone,
          })
          this.connectUs = false
          this.snack = true
          this.snackColor = 'success black--text'
          this.snackText = 'Ваше письмо отправлено'
          this.$refs.form.reset()
        } catch (e) {
          this.connectUs = false
          this.snack = true
          this.snackColor = 'error black--text'
          this.snackText = 'Ошибка! Письмо не отправлено'
        }
      }
    },

    async openInstructions(){
      const itemList = await this.$axios.$get('/api/v1/instructions/')
      if (itemList) {
        console.log(itemList)
        this.instructionList = itemList
        this.instructions = true
      }
    },
  },
}
</script>

<style scoped>

</style>
