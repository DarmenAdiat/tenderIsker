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

          <h2 style='padding: 10px;'>Тендеры ISKER Group</h2>
          <h4 style='padding: 10px;margin-top: 0;padding-top: 0'>Вы вошли как: {{ user.full_name }}</h4>
<!--          <v-btn-->
<!--            @click='tryCards'-->
<!--          >-->
<!--            TRY CARDS-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            @click='updateViewed'-->
<!--          >-->
<!--            TRY VIEWED-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            @click='try1C'-->
<!--          >-->
<!--            TRY 1C-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            @click='try1Cusers'-->
<!--          >-->
<!--            TRY 1C users-->
<!--          </v-btn>-->
          <v-container fluid>
            <v-row dense>
              <v-col>
                <v-card
                  outlined
                  style='margin-bottom: 30px;'
                >
                  <v-row style='margin: 0'>
                  <v-col
                    cols='8'
                    sm='8'
                    md='8'
                    lg='8'
                  >
                    <v-text-field
                      v-model="search"
                      label='Поиск'
                      placeholder="Поиск тендера по номеру RFQ или описанию"
                      prepend-icon='mdi-magnify'
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols='4'
                    sm='4'
                    md='4'
                    lg='4'
                  >
                    <v-btn-toggle
                      v-model="filterCards"
                      style='margin: 10px auto;'
                      mandatory
                    >
                      <v-btn
                        width='145px'
                        :disabled='loaded_active'
                      >
                        Активные
                      </v-btn>

                      <v-btn
                        width='165px'
                        :disabled='loaded_overdue'
                      >
                        Завершенные
                      </v-btn>
                      <v-btn
                        width='65px'
                        :disabled='loaded_all'
                      >
                        Все
                      </v-btn>
                    </v-btn-toggle>
                  </v-col>
                  </v-row>
                </v-card>

                <v-card
                  v-for="(item, i) in items"
                  :key="i"
                  outlined
                  style='margin-bottom: 30px;'
                  :disabled='item.state === "Declined"'
                >
                  <v-row style='margin: 5px'>
                  <v-col cols='10' sm='10' md='10' lg='10'>

                    <v-row style='margin: 0'>
                      <v-card-title style='padding-top: 0;padding-bottom: 0'>
                        {{ item.rfq }}
                      </v-card-title>
                    </v-row>
                    <v-row style='margin: 0'>
                      <v-card-subtitle align='left'>
                        {{ item.title }}
                      </v-card-subtitle>
                    </v-row>

                    <v-row style='margin: 0'>

                          <v-col cols='4' style='padding: 0'>
                            <v-card-text align='left' style='padding: 7px 15px'>Дата начала: {{item.started_at }}</v-card-text>
                          </v-col>
                          <v-col cols='4' style='padding: 0'>
                            <v-card-text align='right' style='padding: 7px 15px'>Дата окончания: {{ item.closed_at }}</v-card-text>
                          </v-col>
                          <v-col cols='4' style='padding: 0'>
                            <v-chip
                              v-if='item.viewed'
                              style='margin: 2px auto;align-items: center;width:130px;'
                              color="gray"
                              label
                              outlined
                            >
                              Просмотрен
                            </v-chip>
                            <v-chip
                              v-else
                              style='margin: 2px auto;align-items: center;width:130px;'
                              color="blue"
                              label
                              outlined
                            >
                              Не просмотрен
                            </v-chip>

                            <v-chip
                              v-if="item.state === 'Accepted'"
                              style='margin: 2px auto;width:130px;'
                              color="orange"
                              label
                              outlined
                            >
                              Принят
                            </v-chip>
                            <v-chip
                              v-if="item.state === 'Declined'"
                              style='margin: 2px auto;width:130px;'
                              color="red"
                              label
                              outlined
                            >
                              Отклонен
                            </v-chip>
                            <v-chip
                              v-if="item.state === 'Ignored'"
                              style='margin: 2px auto;width:130px;'
                              color="gray"
                              label
                              outlined
                            >
                              Без ответа
                            </v-chip>
                            <v-chip
                              v-if="item.state === 'Sent'"
                              style='margin: 2px auto;width:130px;'
                              color="green"
                              label
                              outlined
                            >
                              КП отправлено
                            </v-chip>
                          </v-col>

                    </v-row>

                  </v-col>
                  <v-col cols='2' sm='2' md='2' lg='2' style='padding: 0; justify-content: center;display: flex;'>

                        <v-row style='margin: 0; align-items: flex-start'>
                          <v-card-actions v-if='item.is_overdue'>
                            <v-chip
                              style='margin: 2px 10px;width:100%;min-width: 143px;'
                              color="gray"
                              label
                            >Статус: Завершен</v-chip>
                            <v-btn icon title='Добавить в избранное' style='margin: 0 10px;'>
                              <v-icon>mdi-bookmark</v-icon>
                            </v-btn>
                          </v-card-actions>
                          <v-card-actions v-if='!item.is_overdue'>
                            <v-chip
                              v-if='item.status === "Активный"'
                              style='margin: 2px 10px;width:100%;min-width: 143px;'
                              color="green"
                              label
                            >Статус: Активный</v-chip>
                            <v-chip
                              v-if='item.status === "Черновик"'
                              style='margin: 2px 10px;width:100%;min-width: 143px;'
                              color="blue"
                              label
                            >Статус: Черновик</v-chip>
                          <v-btn icon title='Добавить в избранное' style='margin: 0 10px;'>
                            <v-icon>mdi-bookmark</v-icon>
                          </v-btn>
                          </v-card-actions>
                        </v-row>

                        <v-row style='margin: 0; width:190px; position: absolute; bottom: 10px; right: 15px;'>
                          <v-card-actions style='width: 100%; padding: 8px 0'>
                          <v-btn
                            style='width: 100%'
                            :to="`/card/${item.id}`"
                          >
                            Открыть
                          </v-btn>
                          </v-card-actions>
                        </v-row>




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
import moment from 'moment';

export default {
  name: 'Main',
  middleware: 'auth',
  data() {
    return {
      search: '',
      filterCards: 0, // 0 => active; 1 => overdue; 2 => all
      loading: true,
      items: [],
      itemsLoaded: [],
      refreshUser: [],
      loaded_active: false,
      loaded_overdue: false,
      loaded_all: false,
      link: '',
    }
  },
  head: {
    title: 'Главная страница',
  },

  computed:{
    user() {
      return this.$auth.user
    },
  },
  watch:{
    filterCards(){
      this.getAccessedCards()
      // console.log(this.filterCards) - отфильтрованные карточки тендеров
    },
    search(){
      this.searchByTitle(this.search)
    },
  },

  mounted() {
    this.getAccessedCards()
    this.getLink()
  },
  created() {
    // this.getLink()
  },
  methods:{
    searchByTitle(value){
      if (value){
        this.items = this.itemsLoaded.filter(function(item){
          return item.rfq.toLowerCase().includes(value.toLowerCase()) || item.title.toLowerCase().includes(value.toLowerCase())
        })
      } else {
        this.items = this.itemsLoaded
      }

    },

    async getAccessedCards(){
      this.search = ''
      this.items = []
      this.itemsLoaded = []

      await this.refreshAccessedAndViewed() // обновляем состояние тендеров
      const states = await this.getState() // Список состояний тендеров rfq(id) / state
      const rfq = this.refreshUser.user.received // список идентификаторов доступных RFQ
      const viewedRFQ = this.refreshUser.user.viewed // список идентификаторов просмотренных RFQ

      for (let i = 0; i < rfq.length; i++) {

        const receivedCard = await this.getCards(rfq[i])

        if (this.filterCards === 0) {
          // this.loaded_overdue = true
          // this.loaded_all = true

          if (receivedCard.status === 'Активный') {
            receivedCard.viewed = viewedRFQ.includes(receivedCard.id)
            // Добавляем в массив имеющиеся состояния тендеров
            for (let j = 0; j < states.length; j++) {
              if (states[j].rfq === receivedCard.id) {
                receivedCard.state = states[j].state
              }
            }

            this.items.push(receivedCard)
          }
          // setTimeout(() => {
          //   this.loaded_all = false
          //   this.loaded_overdue = false
          // }, 500)

        }
        else if (this.filterCards === 1) {
          // this.loaded_active = true
          // this.loaded_all = true

          if (receivedCard.status === 'Завершен') {
            receivedCard.viewed = viewedRFQ.includes(receivedCard.id)
            // Добавляем в массив имеющиеся состояния тендеров
            for (let j = 0; j < states.length; j++) {
              if (states[j].rfq === receivedCard.id) {
                receivedCard.state = states[j].state
              }
            }

            this.items.push(receivedCard)
          }
          // setTimeout(() => {
          //   this.loaded_active = false
          //   this.loaded_all = false
          // }, 500)

        }
        else {
          // this.loaded_active = true
          // this.loaded_overdue = true

          receivedCard.viewed = viewedRFQ.includes(receivedCard.id)
          // Добавляем в массив имеющиеся состояния тендеров
          for (let j = 0; j < states.length; j++) {
            if (states[j].rfq === receivedCard.id) {
              receivedCard.state = states[j].state
            }
          }

          this.items.push(receivedCard)

          // setTimeout(() => {
          //   this.loaded_active = false
          //   this.loaded_overdue = false
          // }, 500)

        }
      }
      this.itemsLoaded = this.items
    },

    async getCards(rfq) {
      this.loading = true
      this.errored = false
      let data = []
      try {
        data = await this.$axios.$get('/api/v1/catalog/'+ rfq + '/')
      } catch (e) {
        console.log(e)
      }
      if (data) {
        if (data.started_at === null) {
          data.started_at = 'Нет данных'
        } else {
          data.started_at =  moment(data.started_at).format('HH:mm - DD.MM.yyyy')
        }
        if (data.closed_at === null) {
          data.closed_at = 'Нет данных'
        } else {
          data.closed_at =  moment(data.closed_at).format('HH:mm - DD.MM.yyyy')
        }

        if ((data.is_overdue) && (data.status !== 'Завершен')) {
          await this.$axios.$patch('/api/v1/card/' + rfq + '/', {
            status: 'Завершен'
          })
          await this.getCards(rfq)
        }
      }
      return data
    },

    async getState(){
      // Сделать выборку по идентификатору пользователя
      const data  = await this.$axios.$get('/api/v1/tender_state/')
        .catch((e) => {
          console.log(e)
          this.errored = true
        })
        .finally(() => {

        })
      if (!data) return
      return data
    },

    async refreshAccessedAndViewed(){
      const refresh = await this.$axios.$get('/api/v1/profile/')
      this.refreshUser = refresh
    },

    updateViewed() {
      // const thisViewed = [2]
      // await this.$axios.$patch('/api/v1/viewed/' + this.user.id + '/',{
      //   viewed: thisViewed
      // })
      alert('CHECK')
    },

    async try1C(){
      const data = await this.$axios.$get(
        this.link + 'GetCurrencyList',
        {
          credentials: true,
          auth: {
            username: 'web',
            password: 'web'
          },
        }
      )
      alert(data[0].fullname)

    },

    // Загружаем сюда пользователей
    async try1Cusers(){
      const data = await this.$axios.$get(
        this.link + 'GetUserList',
        {
          credentials: true,
          auth: {
            username: 'web',
            password: 'web'
          },
        }
      )

      for (let i = 0; i < data.length; i++) {
        const newUser = await this.$axios.$post('api/v1/profiles/',{
          username: data[i].email, // эл. почта
          name: data[i].name, // сокращенное наименование контрагента
          full_name: data[i].fullname, // Полное наименование контрагента
          email: data[i].email, // эл. почта
          uid: data[i].uid, // uid контрагента
          password: "TrialPassword", // рандомный пароль
          iin: data[i].iin, // БИН контрагента

          agent_status: data[i].agent_status, // Статус поставщика - текстовое поле
          actual_address: data[i].actual_address, // Фактический адрес - текстовое поле
          legal_address: data[i].legal_address, // Юридический адрес - текстовое поле
          web_site: data[i].web_site, // Веб-сайт - текстовое поле
          general_manager: data[i].general_manager, // Основной менеджер - текстовое поле
          bank_details: data[i].bank_details, // Банковские счета (в виде строки)
          contracts: data[i].contracts, // Договоры (в виде строки)
          contacts: data[i].contacts, // Контактные лица (в виде строки)
          // categories: data[i].categories, // Здесь будут позже категории на след итерации

          // ПРИМЕРЫ (как в КП отправляю details - номенклатуры)
          // Банковские счета (в виде строки)
          // [{"name":"6376 в АО 'ForteBank'(KZT)","currency":"KZT","acc_number":"KZ186010131000046376","bank_name":"АО 'ForteBank'","bik":"IRTYKZKA"}]
          // Договоры (в виде строки)
          // [{"num":"№HI-2021/002", "name":"ДОГОВОР ОКАЗАНИЯ УСЛУГ по поиску и подбору персонала №HI-2021/002","state":"Действует","start_date":"07.07.2021","end_date":"07.07.2031","currency":"KZT"}]
          // Контактные лица (в виде строки)
          // [{"name":"Алтын Шонгараева","position":"Консультант-рекрутер"},{"name":"Кристина Кравцова","position":"Директор"}]


        })
        console.log(newUser)
      }
    },
    async tryCards(){
      const newUser = await this.$axios.$get('api/v1/getcards/',{
        params:{
          status: 1
        }
      })
      console.log(newUser)
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
