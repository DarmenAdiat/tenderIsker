<template>
  <v-container style='max-width: 1280px;'>
    <v-row >
      <v-col
        cols="12"
        sm="12"
      >
        <v-sheet
          min-height="70vh"
          rounded="lg"
          align='center'
        >
          <!--  -->
          <v-container fluid>
            <v-row dense>
              <v-col>
                <v-card
                  outlined
                  style='margin-bottom: 20px;min-height: 200px;'
                >
                  <v-row style='margin: 20px;'>
                    <v-col
                      cols='6'
                      sm='6'
                      md='6'
                      lg='6'
                      style='text-align: left;padding: 0 10px'
                    >
                      <h2>Личный кабинет / PROFILE</h2>
                    </v-col>
                    <v-col
                      cols='6'
                      sm='6'
                      md='6'
                      lg='6'
                      style='text-align: right;padding: 0 10px'
                    >
                      <h3>Статус:
                        <span
                          v-if='userInfo.agent_status === "APPROVED"'
                          style='color: green'
                        >
                          Подтвержденный
                        </span>
                        <span
                          v-else
                          style='color: green'
                        >
                          Непроверенный
                        </span>
                      </h3>
                    </v-col>
                  </v-row>
                  <v-row style='margin: 10px 20px;text-align: left;padding: 0 10px;'>
                    <h2>{{ userInfo.full_name }}</h2>
                  </v-row>
                  <v-row style='margin: 0 20px;padding: 0 10px'>
                    <h4 style='color: gray'>БИН:{{ userInfo.iin }}</h4>
                  </v-row>
                  <v-row style='margin: 10px 20px;padding: 10px'>
                      <h4 style='width: 100%;text-align: left'>Элекстронная почта: {{ userInfo.email }}</h4>
                      <h4 style='width: 100%;text-align: left'>Номер телефона: {{ userInfo.phone }}</h4>
                      <h4 style='width: 100%;text-align: left'>Веб-сайт: {{ userInfo.web_site }}</h4>
                      <h4 style='width: 100%;text-align: left'>Фактический адрес: {{ userInfo.actual_address }}</h4>
                      <h4 style='width: 100%;text-align: left'>Юридический адрес: {{ userInfo.legal_address }}</h4>
                      <h4 style='width: 100%;text-align: left'>Основной менеджер: {{ userInfo.general_manager }}</h4>
                  </v-row>
                  <v-row style='margin: 20px;padding: 10px'>
                    <v-data-table
                      :headers='bank_details_headers'
                      :items='bank_details'
                      class='elevation-1'
                      style='width: 100%'
                      disable-sort
                      hide-default-footer
                      :items-per-page='-1'
                    >
                      <template #[`item.index`]='{ item }'>
                        {{ bank_details.indexOf(item) + 1 }}
                      </template>
                    </v-data-table>
                  </v-row>
                  <v-row style='margin: 20px;padding: 10px'>
                    <v-data-table
                      :headers='contracts_headers'
                      :items='contracts'
                      class='elevation-1'
                      style='width: 100%'
                      disable-sort
                      hide-default-footer
                      :items-per-page='-1'
                    >
                      <template #[`item.index`]='{ item }'>
                        {{ contracts.indexOf(item) + 1 }}
                      </template>
                    </v-data-table>
                  </v-row>
                  <v-row style='margin: 20px;padding: 10px'>
                    <v-data-table
                      :headers='contacts_headers'
                      :items='contacts'
                      class='elevation-1'
                      style='width: 100%'
                      disable-sort
                      hide-default-footer
                      :items-per-page='-1'
                    >
                      <template #[`item.index`]='{ item }'>
                        {{ contacts.indexOf(item) + 1 }}
                      </template>
                    </v-data-table>
                  </v-row>
                </v-card>

                <v-card
                  v-if='access_categories'
                  outlined
                  style='margin-bottom: 30px;min-height: 200px;'
                >
                  <v-row style='margin: 20px;'>
                    <v-col
                      cols='4'
                      sm='4'
                      md='4'
                      lg='4'
                      style='text-align: center;padding: 0 10px'
                    >
                      <h2><u>Доступные категории:</u></h2>
                      <p style='color: gray;margin-top: 20px;' align='justify'>Список доступных категорий товаров
                        для Вашего аккаунта. Если список
                        неполный, вы можете оформить
                        заявку на добавление Категории,
                        которой нет в данном списке. Для
                        этого Вас необходимо нажать на
                        кнопку «Добавить категорию».
                        Откроется окно со списком всех
                        имеющихся категорий товаров.
                        Необходимо выбрать категорию,
                        которую нужно добавить к вашему
                        аккаунту и прикрепить необходимые
                        подтверждающие документы. Ваша
                        заявка будет рассмотрена и как только
                        категория будет одобрена, вы получите
                        уведомление</p>
                    </v-col>
                    <v-col
                      cols='8'
                      sm='8'
                      md='8'
                      lg='8'
                      style='text-align: left;padding: 0 10px'
                    >
                      <v-card
                        outlined
                        style='padding: 10px 10px 20px;margin-bottom: 20px;'
                      >
                        <h3 style='margin: 10px;'>◉ Категория 1</h3>
                        <h4 style='margin-left: 50px;'>- Наименование подкатегроии 1 - 1</h4>
                        <h4 style='margin-left: 50px;'>- Наименование подкатегроии 1 - 2</h4>
                        <h4 style='margin-left: 50px;'>- Наименование подкатегроии 1 - 3</h4>
                      </v-card>
                      <v-card
                        outlined
                        style='padding: 10px 10px 20px;'
                      >
                        <h3 style='margin: 10px;'>◉ Категория 2</h3>
                        <h4 style='margin-left: 50px;'>- Наименование подкатегроии 2 - 1</h4>
                        <h4 style='margin-left: 50px;'>- Наименование подкатегроии 2 - 2</h4>
                        <h4 style='margin-left: 50px;'>- Наименование подкатегроии 2 - 3</h4>
                      </v-card>
                      <v-btn
                        class='primary'
                        style='margin: 30px 0; width: 100%'
                        @click='addCategory'
                      >
                        <v-icon>mdi-plus</v-icon>
                        &nbsp;Добавить категорию</v-btn>
                    </v-col>
                  </v-row>
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
// import users from '~/pages/admin/users'

export default {
  name: 'Profile',
  data() {
    return {
      access_categories: false,
      groupsCurrent: [],
      userInfo: [],
      bank_details_headers: [
        { text: '#', value: 'index', class: '', cellClass: '' },
        { text: 'Наименование', value: 'name', class: '', cellClass: '' },
        { text: 'Валюта', value: 'currency', class: '', cellClass: '' },
        { text: 'Номер счета', value: 'acc_number', class: '', cellClass: '' },
        { text: 'Наименование банка', value: 'bank_name', class: '', cellClass: '' },
        { text: 'БИК', value: 'bik', class: '', cellClass: '' },
      ],
      contracts_headers: [
        { text: '#', value: 'index', class: '', cellClass: '' },
        { text: 'Номер', value: 'num', class: '', cellClass: '' },
        { text: 'Рабочее наименование', value: 'name', class: '', cellClass: '' },
        { text: 'Текущее состояние', value: 'state', class: '', cellClass: '' },
        { text: 'Действует с', value: 'start_date', class: '', cellClass: '' },
        { text: 'Действует по', value: 'end_date', class: '', cellClass: '' },
        { text: 'Валюта взаиморасчетов', value: 'currency', class: '', cellClass: '' },
      ],
      contacts_headers: [
        { text: '#', value: 'index', class: '', cellClass: '' },
        { text: 'ФИО', value: 'name', class: '', cellClass: '' },
        { text: 'Должность по визитке', value: 'position', class: '', cellClass: '' },
      ],
      bank_details: [],
      contracts: [],
      contacts: [],
      link: '',
    }
  },
  head: {
    title: 'Profile'
  },
  computed: {
    user() {
      return this.$auth.user
    }
  },
  mounted() {
    this.loadGroups() // Загрузка функций страницы
    this.loadUserInfo()
  },
  methods:{
    addCategory() {
      alert('MODAL OPEN')
    },

    // Загрузка всех имеющихся категорий для контрагента
    async loadGroups(){
      // const getGroups = await this.$axios.get(this.link + 'GetPositionGroupList', {
      //   credentials: true,
      //   auth: {
      //     username: 'web',
      //     password: 'web'
      //   },
      // })
      // const mainGroups = 0
      // console.log(mainGroups)
      // console.log(getGroups)
    },

    // Получаем информацию о контрагенте по отдельному адресу
    async loadUserInfo(){
      try {
        const data = await this.$axios.$get('/api/v1/user_info')
        this.userInfo = data[0]

        this.bank_details = JSON.parse(this.userInfo.bank_details)
        this.contracts = JSON.parse(this.userInfo.contracts)
        this.contacts = JSON.parse(this.userInfo.contacts)


        console.log(this.userInfo.agent_status)
      } catch (e) {
        console.log(e)
      }
      // api/v1/user_info/jumperfox2@mail.ru/

      console.log('user information received')
    },
    async getLink(){
      // this.link +
      const ERP = await this.$axios.$get('api/v1/link/')
      this.link = ERP[0].link
    },

  },
}
</script>

<style scoped>

</style>
