<!--suppress ALL -->
<template>
  <v-container style='max-width: 1280px;'>
    <v-row>
      <v-col
        cols='12'
        sm='12'
      >
        <v-sheet
          min-height='70vh'
          rounded='lg'
          align='center'
        >
          <!--  -->

          <h2 style='padding: 10px;'>Тендер {{ items.rfq }}</h2>
<!--          <v-btn-->
<!--            @click='tryIgnored'-->
<!--          >-->
<!--            TRY IGNORED-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            @click='submitOffer'-->
<!--          >-->
<!--            TRY SEND-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            @click='getCurrency'-->
<!--          >-->
<!--            GET CURRENCY-->
<!--          </v-btn>-->


          <v-container fluid>
            <v-row dense>
              <v-col>
                <v-card
                  outlined
                  style='margin-bottom: 30px;'
                >

                  <v-row style='margin: 5px'>
                    <v-col cols='9' lg='9' md='9' sm='9'>
                      <v-simple-table
                        class='elevation-1 tender_card_table'
                      >
                        <template #default>
                          <tbody>
                          <tr>
                            <td><strong>№ RFQ заявки:</strong></td>
                            <td>{{ items.rfq }}</td>
                          </tr>
                          <tr>
                            <td><strong>Краткое описание тендера:</strong></td>
                            <td>{{ items.title }}</td>
                          </tr>
                          <tr>
                            <td><strong>Дата RFQ заявки:</strong></td>
                            <td>{{ items.started_at }}</td>
                          </tr>
                          <tr>
                            <td><strong>Организация:</strong></td>
                            <td>{{ items.company }}</td>
                          </tr>
                          <tr>
                            <td><strong>Статус Тендера:</strong></td>
                            <td>{{ items.status }}</td>
                          </tr>
                          <tr>
                            <td><strong>Период проведения Тендера:</strong></td>
                            <td style='text-align: left'>
                              <strong>Начало:</strong> {{ items.started_at }}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <strong>Окончание:</strong> {{ items.closed_at }}
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Условия и адрес поставки:</strong></td>
                            <td>{{ items.delivery }}</td>
                          </tr>
                          <tr>
                            <td><strong>Условия оплаты:</strong></td>
                            <td>{{ items.payment }}</td>
                          </tr>
                          <tr>
                            <td><strong>Комментарий:</strong></td>
                            <td>{{ items.comment }}</td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                    <v-col cols='3' lg='3' md='3' sm='3'>
                      <v-row style='margin: 0; height:50%;'>
                        <v-container
                          v-if='items.is_overdue === false || state === "Sent"'
                          style='margin-top: 0;margin-bottom: 0;padding: 0'
                        >
                          <v-btn
                            v-if='state === "Ignored"'
                            class='success'
                            style='width:100%;margin: 0;height:50px;'
                            @click='dialog_accept = true'
                          >Принять участие
                          </v-btn>
                          <v-btn
                            v-if='state === "Ignored"'
                            class='error'
                            style='width:100%;margin: 20px 0 0 0;height:50px;'
                            @click='dialog_decline = true'
                          >Отказаться
                          </v-btn>

                          <v-btn
                            v-if='state === "Accepted"'
                            class='orange'
                            style='width:100%;margin: 0;height:50px;'
                          >Тендер принят
                          </v-btn>
                          <v-btn
                            v-if='state === "Declined"'
                            class='red'
                            style='width:100%;margin: 0;height:50px;'
                          >Тендер отклонен
                          </v-btn>
                          <v-btn
                            v-if='state === "Sent"'
                            class='green'
                            style='width:100%;margin: 0;height:50px;'
                          >КП отправлено
                          </v-btn>

                        </v-container>
                      </v-row>
                      <v-row style='margin: 0; height:50%;'>
                        <v-container style='margin-top: auto;margin-bottom: 0;padding: 0'>
                          <v-btn
                            v-if='state !== "Declined"'
                            class='info'
                            style='width:100%;margin: auto 0 0 0;height:50px;'
                            :href='items.document_rfq'
                            target='_blank'
                          >Печатная форма RFQ
                          </v-btn>
                          <v-btn
                            v-if='state !== "Declined"'
                            class='info'
                            style='width:100%;margin: 20px 0 0 0;height:50px;'
                            @click='dialog_attach = true'
                          >
                            Вложения RFQ
                          </v-btn>
                        </v-container>

                      </v-row>


                    </v-col>
                  </v-row>
                  <v-row style='margin: 25px 5px 5px 5px'>
                    <!-- Таблица номенклатур Если просмотрено -->
                    <v-data-table
                      v-if='state === "Ignored"'
                      :headers='headersTenderDetail'
                      :items='tenderInfo'
                      class='elevation-1 tenderInfoBorders offerTable'
                      style='font-size: 10px;cursor: pointer'
                      disable-sort
                      hide-default-footer
                      :items-per-page='-1'
                      :loading='loadTenderTable'
                      loading-text='Загрузка данных'
                    >
                      <template #[`item.index`]='{ item }'>
                        {{ tenderInfo.indexOf(item) + 1 }}
                      </template>
                      <template #no-data>
                        <v-alert :value='true' color='error' icon='warning' style='margin:10px;'>
                          Ошибка получения данных, попробуйте перезагрузить таблицу!
                        </v-alert>
                        <v-btn
                          color='primary'
                          style='margin:10px 10px 20px 10px;padding: 0 20px'
                          @click='initialize'
                        >
                          <v-icon>refresh</v-icon>
                          &nbsp;Перезагрузить таблицу
                        </v-btn>
                      </template>
                    </v-data-table>
                    <!-- Таблица номенклатур Если принято, но завершено -->
                    <v-data-table
                      v-if='state === "Accepted" && items.is_overdue === true'
                      :headers='headersTenderDetail'
                      :items='tenderInfo'
                      class='elevation-1 tenderInfoBorders offerTable'
                      style='font-size: 10px;cursor: pointer'
                      disable-sort
                      hide-default-footer
                      :items-per-page='-1'
                      :loading='loadTenderTable'
                      loading-text='Загрузка данных'
                    >
                      <template #[`item.index`]='{ item }'>
                        {{ tenderInfo.indexOf(item) + 1 }}
                      </template>
                      <template #no-data>
                        <v-alert :value='true' color='error' icon='warning' style='margin:10px;'>
                          Ошибка получения данных, попробуйте перезагрузить таблицу!
                        </v-alert>
                        <v-btn
                          color='primary'
                          style='margin:10px 10px 20px 10px;padding: 0 20px'
                          @click='initialize'
                        >
                          <v-icon>refresh</v-icon>
                          &nbsp;Перезагрузить таблицу
                        </v-btn>
                      </template>
                    </v-data-table>
                    <!-- Таблица номенклатур Если принято и Активно -->
                    <v-data-table
                      v-if='state === "Accepted" && items.is_overdue === false'
                      :headers='headersTenderDetail'
                      :items='offerInfo'
                      :item-class='itemRowBackground'
                      class='elevation-1 tenderInfoBorders offerTable'
                      style='font-size: 10px;cursor: pointer;'
                      disable-sort
                      hide-default-footer
                      :items-per-page='-1'
                      :loading='loadTenderTable'
                      loading-text='Загрузка данных'
                    >
                      <template #top>
                        <v-toolbar
                          flat
                        >
                          <v-toolbar-title>Номенклатуры</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-btn
                            color='success black--text'
                            dark
                            @click='saveOffer'
                          >
                            Сохранить
                          </v-btn>


                          <v-dialog
                            v-model='dialogAlter'
                            max-width='800px'
                          >
                            <v-card
                              id='editDialog'
                            >
                              <v-card-title>
                                <span class='text-h5'>{{ editedItem.name }}</span>
                              </v-card-title>

                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col
                                      cols='4'
                                      sm='4'
                                      md='4'
                                      lg='4'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.amount'
                                        label='Требуемое количество'
                                        outlined
                                        readonly
                                        dense
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      cols='4'
                                      sm='4'
                                      md='4'
                                      lg='4'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.measure'
                                        label='Ед.изм'
                                        outlined
                                        readonly
                                        dense
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      cols='4'
                                      sm='4'
                                      md='4'
                                      lg='4'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.required_term'
                                        label='Требуемый срок поставки'
                                        outlined
                                        readonly
                                        dense
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <!-- price + currency + total field -->
                                  <v-row>
                                    <!-- price field -->
                                    <v-col
                                      cols='6'
                                      sm='6'
                                      md='6'
                                      lg='6'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model.number='editedItem.price'
                                        :error-messages='priceErrors'
                                        type='number'
                                        label='Цена за ед. без НДС'
                                        placeholder='0.00'
                                        outlined
                                        dense

                                        @change='checkTotal'
                                        @keyup.enter='$event.target.blur()'
                                      ></v-text-field>
                                    </v-col>
                                    <!-- currency field -->
                                    <!-- total field -->
                                    <v-col
                                      cols='6'
                                      sm='6'
                                      md='6'
                                      lg='6'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.total'
                                        label='Сумма без НДС'
                                        type='number'
                                        outlined
                                        readonly
                                        disabled
                                        dense
                                      ></v-text-field>
                                    </v-col>

                                  </v-row>
                                  <!-- selected_term field -->
                                  <v-row>

                                    <v-col
                                      cols='12'
                                      sm='12'
                                      md='12'
                                      lg='12'
                                      style='padding: 5px'
                                    >
                                      <v-textarea
                                        v-model='editedItem.selected_term'
                                        :error-messages='termsErrors'
                                        label='Укажите Ваш срок поставки'
                                        placeholder='Напишите срок поставки'
                                        type='text'
                                        outlined
                                        auto-grow
                                        rows='1'
                                        row-height='30'
                                        :rules='[rules.length(500),]'
                                      ></v-textarea>
                                    </v-col>

                                  </v-row>
                                  <!-- amount_new + dms fields -->
                                  <v-row>
                                    <!-- amount_new field -->
                                    <v-col
                                      cols='6'
                                      sm='6'
                                      md='6'
                                      lg='6'
                                      style='padding: 5px'
                                    >
                                      <h5
                                        style='text-align: center;margin-bottom: 15px;'
                                      >Измените количество, если отличается от требуемого:</h5>
                                      <v-text-field
                                        v-model='editedItem.amount_new'
                                        label='Количество'
                                        placeholder='0.000'
                                        type='number'
                                        :suffix="editedItem.measure"
                                        outlined
                                        dense
                                        @blur='checkTotal'
                                        @keyup.enter='$event.target.blur()'
                                      ></v-text-field>
                                    </v-col>
                                    <!-- dms field -->
                                    <v-col
                                      cols='6'
                                      sm='6'
                                      md='6'
                                      lg='6'
                                      style='padding: 5px'
                                    >
                                      <h5
                                        style='text-align: center;margin-bottom: 15px;'
                                      >Доля местного содержания, если имеется:</h5>
                                      <v-text-field
                                        v-model.number='editedItem.dms'
                                        label='% ДМС'
                                        placeholder='0.00%'
                                        type='number'
                                        suffix="%"
                                        min='0'
                                        step='any'
                                        max='100'
                                        :rules='dmsRule'
                                        outlined
                                        dense
                                        @blur='dmsRound'
                                        @keyup.enter='$event.target.blur()'
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <!-- alter field -->
                                  <v-row>

                                    <v-col
                                      cols='12'
                                      sm='12'
                                      md='12'
                                      lg='12'
                                      style='padding: 5px'
                                    >
                                      <v-textarea
                                        v-model='editedItem.alter'
                                        label='Отклонения от требования (альтерантива) / Нет отклонения'
                                        placeholder='Напишите отклонения от требования, если имеются'
                                        type='text'
                                        rows='2'
                                        row-height='30'
                                        outlined
                                        auto-grow
                                        :rules='[rules.length(500),]'
                                      >
                                      </v-textarea>
                                    </v-col>

                                  </v-row>
                                </v-container>
                              </v-card-text>

                              <v-card-actions>
                                <v-btn
                                  color='red darken-1'
                                  text
                                  @click='resetAlter'
                                >
                                  Сбросить
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color='blue darken-1'
                                  text
                                  @click='closeAlter'
                                >
                                  Отменить
                                </v-btn>
                                <v-btn
                                  color='green darken-1'
                                  text
                                  @click='saveAlter'
                                >
                                  Сохранить
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>


                        </v-toolbar>
                      </template>
                      <template #[`item.alter`]='{ item }'>
                        <v-chip
                          v-if='item.alter !== ""'
                          color='warning black--text'
                          style='font-size: 10px;'
                          label
                        >Есть
                        </v-chip>
                        <v-chip
                          v-else
                          style='font-size: 10px;'
                          label
                        >Нет
                        </v-chip>
                      </template>
                      <template #[`item.selected_term`]='{ item }'>
                        <v-chip
                          v-if='item.selected_term !== ""'
                          style='font-size: 10px;'
                          color='warning black--text'
                          label
                        >Указан
                        </v-chip>
                        <v-chip
                          v-else
                          label
                          style='font-size: 10px;'
                        >Нет
                        </v-chip>
                      </template>
                      <template #[`item.amount`]='{ item }'>
                        <v-chip
                          v-if='parseFloat(item.amount_new).toFixed(3) !== parseFloat(item.amount).toFixed(3)'
                          style='font-size: 10px;'
                          color='warning black--text'
                          label
                        >{{ item.amount_new | format }}
                        </v-chip>
                        <h4
                          v-else
                        >{{ item.amount.toFixed(3) | format }}</h4>
                      </template>
                      <template #[`item.price`]='{ item }'>
                        <h4>{{ item.price | format }}</h4>
                      </template>
                      <template #[`item.total`]='{ item }'>
                        <h4>{{ item.total | format }}</h4>
                      </template>
                      <template #[`item.actions`]='{ item }'>
                        <v-btn
                          title='Добавить в КП'
                          small
                          style='font-size: 10px;padding: 2px;text-transform: unset'
                          @click='editItemAlter(item)'
                        >
                          <v-icon
                            style='font-size: 10px;height: 10px;width: 12px'
                          >
                            mdi-pencil
                          </v-icon>
                          Edit
                        </v-btn>


                      </template>
                      <template #[`item.index`]='{ item }'>
                        {{ offerInfo.indexOf(item) + 1 }}
                      </template>
                      <template #no-data>
                        <v-alert :value='true' color='error' icon='warning' style='margin:10px;'>
                          Ошибка получения данных, попробуйте перезагрузить таблицу!
                        </v-alert>
                        <v-btn
                          color='primary'
                          style='margin:10px 10px 20px 10px;padding: 0 20px'
                          @click='initialize'
                        >
                          <v-icon>refresh</v-icon>
                          &nbsp;Перезагрузить таблицу
                        </v-btn>
                      </template>
                    </v-data-table>
                    <!-- Таблица номенклатур Если КП отправлено -->
                    <v-data-table
                      v-if='state === "Sent"'
                      :headers='headersTenderDetail'
                      :items='offerInfo'
                      class='elevation-1 tenderInfoBorders offerTable'
                      style='font-size: 10px;cursor: pointer'
                      disable-sort
                      hide-default-footer
                      :items-per-page='-1'
                      :loading='loadTenderTable'
                      loading-text='Загрузка данных'
                    >
                      <template #top>
                        <v-toolbar
                          flat
                        >
                          <v-toolbar-title>Номенклатуры</v-toolbar-title>
                          <v-divider
                            class='mx-4'
                            inset
                            vertical
                          ></v-divider>
                          <v-toolbar-title>Дата отправки КП: {{ offerDate }}</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-dialog
                            v-model='dialogAlter'
                            max-width='800px'
                          >
                            <v-card
                              id='editDialog'
                            >
                              <v-card-title>
                                <span class='text-h5'>{{ editedItem.name }}</span>
                              </v-card-title>

                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col
                                      cols='4'
                                      sm='4'
                                      md='4'
                                      lg='4'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.amount'
                                        label='Требуемое количество'
                                        outlined
                                        readonly
                                        dense
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      cols='4'
                                      sm='4'
                                      md='4'
                                      lg='4'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.measure'
                                        label='Ед.изм'
                                        outlined
                                        readonly
                                        dense
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      cols='4'
                                      sm='4'
                                      md='4'
                                      lg='4'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.required_term'
                                        label='Требуемый срок поставки'
                                        outlined
                                        readonly
                                        dense
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <v-row>
                                    <v-col
                                      cols='6'
                                      sm='6'
                                      md='6'
                                      lg='6'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.price'
                                        label='Цена за ед. без НДС'
                                        type='number'
                                        outlined
                                        dense
                                        readonly
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      cols='6'
                                      sm='6'
                                      md='6'
                                      lg='6'
                                      style='padding: 5px'
                                    >
                                      <v-text-field
                                        v-model='editedItem.total'
                                        label='Сумма без НДС'
                                        type='number'
                                        outlined
                                        readonly
                                        disabled
                                        dense
                                      ></v-text-field>
                                    </v-col>

                                  </v-row>

                                  <v-row>

                                    <v-col
                                      cols='12'
                                      sm='12'
                                      md='12'
                                      lg='12'
                                      style='padding: 5px'
                                    >
                                      <v-textarea
                                        v-model='editedItem.selected_term'
                                        label='Срок поставки'
                                        type='text'
                                        readonly
                                        outlined
                                        auto-grow
                                        rows='1'
                                        row-height='30'
                                        :rules='[rules.length(500),]'
                                      ></v-textarea>
                                    </v-col>

                                  </v-row>

                                  <v-row>
                                    <v-col
                                      cols='6'
                                      sm='6'
                                      md='6'
                                      lg='6'
                                      style='padding: 5px'
                                    >
                                      <h5
                                        style='text-align: center;margin-bottom: 15px;'
                                      >Предложенное количество:</h5>
                                      <v-text-field
                                        v-model.number='editedItem.amount_new'
                                        label='Количество'
                                        type='number'
                                        :suffix="editedItem.measure"
                                        readonly
                                        outlined
                                        dense
                                      ></v-text-field>
                                    </v-col>
                                    <v-col
                                      cols='6'
                                      sm='6'
                                      md='6'
                                      lg='6'
                                      style='padding: 5px'
                                    >
                                      <h5
                                        style='text-align: center;margin-bottom: 15px;'
                                      >Доля местного содержания, если имеется:</h5>
                                      <v-text-field
                                        v-model.number='editedItem.dms'
                                        label='% ДМС'
                                        type='number'
                                        suffix="%"
                                        min='0'
                                        step='any'
                                        max='100'
                                        readonly
                                        :rules='dmsRule'
                                        outlined
                                        dense
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>

                                  <v-row>

                                    <v-col
                                      cols='12'
                                      sm='12'
                                      md='12'
                                      lg='12'
                                      style='padding: 5px'
                                    >
                                      <v-textarea
                                        v-model='editedItem.alter'
                                        label='Отклонения от требования (альтерантива) / Нет отклонения'
                                        type='text'
                                        rows='2'
                                        row-height='30'
                                        outlined
                                        auto-grow
                                        readonly
                                      >
                                      </v-textarea>
                                    </v-col>

                                  </v-row>
                                </v-container>
                              </v-card-text>

                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color='blue darken-1'
                                  text
                                  @click='closeAlter'
                                >
                                  Закрыть
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>


                        </v-toolbar>
                      </template>
                      <template #[`item.alter`]='{ item }'>
                        <v-chip
                          v-if='item.alter !== ""'
                          color='warning black--text'
                          style='font-size: 10px;'
                          label
                        >Есть
                        </v-chip>
                        <v-chip
                          v-else
                          style='font-size: 10px;'
                          label
                        >Нет
                        </v-chip>
                      </template>
                      <template #[`item.selected_term`]='{ item }'>
                        <v-chip
                          v-if='item.selected_term !== ""'
                          style='font-size: 10px;'
                          color='warning black--text'
                          label
                        >Указан
                        </v-chip>
                        <v-chip
                          v-else
                          label
                          style='font-size: 10px;'
                        >Нет
                        </v-chip>
                      </template>
                      <template #[`item.amount`]='{ item }'>
                        <v-chip
                          v-if='parseFloat(item.amount_new).toFixed(3) !== parseFloat(item.amount).toFixed(3)'
                          style='font-size: 10px;'
                          color='warning black--text'
                          label
                        >{{ item.amount_new | format }}
                        </v-chip>
                        <h4
                          v-else
                        >{{ item.amount.toFixed(3) | format }}</h4>
                      </template>
                      <template #[`item.price`]='{ item }'>
                        <h4>{{ item.price | format }}</h4>
                      </template>
                      <template #[`item.total`]='{ item }'>
                        <h4>{{ item.total | format }}</h4>
                      </template>
                      <template #[`item.actions`]='{ item }'>
                        <v-btn
                          title='Посмотреть'
                          small
                          style='font-size: 10px;padding: 2px;text-transform: unset'
                          @click='editItemAlter(item)'
                        >
                          <v-icon
                            style='font-size: 10px;height: 10px;width: 12px'
                          >
                            mdi-eye
                          </v-icon>
                          View
                        </v-btn>
                      </template>
                      <template #[`item.index`]='{ item }'>
                        {{ offerInfo.indexOf(item) + 1 }}
                      </template>
                      <template #no-data>
                        <v-alert :value='true' color='error' icon='warning' style='margin:10px;'>
                          Ошибка получения данных, попробуйте перезагрузить таблицу!
                        </v-alert>
                        <v-btn
                          color='primary'
                          style='margin:10px 10px 20px 10px;padding: 0 20px'
                          @click='initialize'
                        >
                          <v-icon>refresh</v-icon>
                          &nbsp;Перезагрузить таблицу
                        </v-btn>
                      </template>
                    </v-data-table>
                    <!-- ------------------------------------------------------------ -->
                    <!-- Номер КП и таблица сумм в тг. Если КП Принято или Отправлено -->
                    <v-row
                      v-if='(state === "Accepted" && items.is_overdue === false) || (state === "Sent")'
                      style='margin: 0 20px;margin-top: 40px;width: 100%'
                    >
                      <v-col
                        cols='6'
                        lg='6'
                        md='6'
                        sm='6'
                        style='padding: 12px 12px 0 0'
                      >
                        <v-textarea
                          v-if='state === "Accepted"'
                          v-model='offerNumber'
                          :error-messages="offerNumberErrors"
                          label='Номер Коммерческого предложения'
                          placeholder='Напишите номер Вашего Коммерческого предложения'
                          type='text'
                          outlined
                          auto-grow
                          rows='1'
                          row-height='30'
                          :rules='[rules.length(200),]'
                          required
                        ></v-textarea>
                        <v-textarea
                          v-if='state === "Sent"'
                          v-model='offerNumber'
                          label='Номер Коммерческого предложения'
                          placeholder='Номер Вашего Коммерческого предложения'
                          type='text'
                          outlined
                          auto-grow
                          rows='1'
                          row-height='30'
                          readonly
                          :rules='[rules.length(200),]'
                        ></v-textarea>
                      </v-col>
                      <v-col
                        cols='3'
                        lg='3'
                        md='3'
                        sm='3'
                        style='padding: 12px 24px 12px 12px'
                      >
                        <v-select
                          v-if='state === "Accepted"'
                          v-model='currency'
                          :items='itemsCurrency'
                          item-text='name'
                          return-object
                          label='Выберите валюту'
                          :error-messages='selectErrors'
                          :menu-props="{ offsetY: true }"
                          outlined
                        ></v-select>
                        <v-select
                          v-if='state === "Sent"'
                          v-model='currency'
                          :items='itemsCurrency'
                          item-text='name'
                          return-object
                          label='Выберите валюту'
                          :error-messages='selectErrors'
                          :menu-props="{ offsetY: true }"
                          readonly
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col
                        cols='3'
                        lg='3'
                        md='3'
                        sm='3'
                        style='padding: 12px 0 0 0'
                      >
                        <v-simple-table
                          class='elevation-1'
                          style='border: 1px solid darkgray;box-shadow: none!important;'
                        >
                          <template #default>
                            <tbody>
                            <tr style='height: 54px'>
                              <td style='width:115px;padding:5px;text-align: right'><strong>Итого без НДС:</strong></td>
                              <td style='text-align: center;padding: 5px'>{{ sumNoNDS | format }}<small> {{ currency.name }}</small></td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                    <!-- --------------------------------------------------- -->
                    <!-- Условия поставки и оплаты кастомные Если принято -->
                    <v-row
                      v-if='state === "Accepted" && items.is_overdue === false'
                      style='margin: 0 20px;width: 100%'
                    >
                      <v-row
                        style='margin: 0;width: 100%'
                      >
                          <v-textarea
                            v-model='offerTermsOfPayment'
                            label='Свои условия оплаты'
                            placeholder='Напишите Ваши условия оплаты, если отличаются от требуемых'
                            type='text'
                            outlined
                            auto-grow
                            rows='2'
                            row-height='30'
                            :rules='[rules.length(500),]'
                          ></v-textarea>
                      </v-row>
                    </v-row>
                    <!-- Данные представителя - КП принято, обязательные к заполнению -->
                    <v-row
                      v-if='state === "Accepted" && items.is_overdue === false'
                      style='margin: 0 20px;width: 100%'
                    >
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                        style='padding-left: 0'
                      >
                        <v-textarea
                          v-model='agentName'
                          label='ФИО представителя'
                          placeholder='Напишите Ваше ФИО'
                          type='text'
                          outlined
                          auto-grow
                          rows='1'
                          row-height='30'
                          :error-messages='agentNameErrors'
                          :rules='[rules.length(300),]'
                        ></v-textarea>
                      </v-col>
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                      >
                        <v-textarea
                          v-model='agentPosition'
                          label='Должность представителя'
                          placeholder='Напишите Вашу должность'
                          type='text'
                          outlined
                          auto-grow
                          rows='1'
                          row-height='30'
                          :error-messages='agentPositionErrors'
                          :rules='[rules.length(300),]'
                        ></v-textarea>
                      </v-col>
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                        style='padding-right: 0'
                      >
                        <v-textarea
                          v-model='agentPhone'
                          type='tel'
                          label='Номер телефона представителя'
                          placeholder='Напишите Ваш номер мобильного телефона'
                          outlined
                          auto-grow
                          rows='1'
                          row-height='30'
                          :error-messages='agentPhoneErrors'
                          :rules='[rules.length(50)]'
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <!-- --------------------------------------------------- -->
                    <!-- Условия поставки и оплаты кастомные Если отправлено -->
                    <v-row
                      v-if='state === "Sent"'
                      style='margin: 0 20px;width: 100%'
                    >
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                        style='padding-left: 0'
                      >
                        <v-textarea
                          v-model='offerTermsOfDelivery'
                          label='Свои условия поставки'
                          placeholder='Напишите Ваши условия поставки, если отличаются от требуемых'
                          type='text'
                          outlined
                          auto-grow
                          rows='2'
                          row-height='30'
                          readonly
                          :rules='[rules.length(500),]'
                        ></v-textarea>
                      </v-col>
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                      >
                        <v-textarea
                          v-model='offerAddressOfDelivery'
                          label='Свой адрес поставки'
                          placeholder='Напишите Ваш адрес поставки, если отличается от требуемого'
                          type='text'
                          outlined
                          auto-grow
                          rows='2'
                          row-height='30'
                          readonly
                          :rules='[rules.length(500),]'
                        ></v-textarea>
                      </v-col>
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                        style='padding-right: 0'
                      >
                        <v-textarea
                          v-model='offerTermsOfPayment'
                          label='Свои условия оплаты'
                          placeholder='Напишите Ваши условия оплаты, если отличаются от требуемых'
                          type='text'
                          outlined
                          auto-grow
                          rows='2'
                          row-height='30'
                          readonly
                          :rules='[rules.length(500),]'
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <!-- Данные представителя - КП отправлено, обязательные к заполнению -->
                    <v-row
                      v-if='state === "Sent"'
                      style='margin: 0 20px;width: 100%'
                    >
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                        style='padding-left: 0'
                      >
                        <v-textarea
                          v-model='agentName'
                          label='ФИО представителя'
                          placeholder='Напишите Ваше ФИО'
                          type='text'
                          outlined
                          auto-grow
                          rows='1'
                          row-height='30'
                          readonly
                          :error-messages='agentNameErrors'
                          :rules='[rules.length(300),]'
                        ></v-textarea>
                      </v-col>
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                      >
                        <v-textarea
                          v-model='agentPosition'
                          label='Должность представителя'
                          placeholder='Напишите Вашу должность'
                          type='text'
                          outlined
                          auto-grow
                          rows='1'
                          row-height='30'
                          readonly
                          :error-messages='agentPositionErrors'
                          :rules='[rules.length(300),]'
                        ></v-textarea>
                      </v-col>
                      <v-col
                        cols='4'
                        sm='4'
                        md='4'
                        lg='4'
                        style='padding-right: 0'
                      >
                        <v-textarea
                          v-model='agentPhone'
                          label='Номер телефона представителя'
                          placeholder='Напишите Ваш номер мобильного телефона'
                          type='text'
                          outlined
                          auto-grow
                          rows='1'
                          row-height='30'
                          readonly
                          :error-messages='agentPhoneErrors'
                          :rules='[rules.length(50),]'
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <!-- --------------------------------------------------- -->
                    <!-- Добавление файлов если КП принято -->
                    <v-row
                      v-if='state === "Accepted" && items.is_overdue === false'
                      style='margin: 10px 20px;width: 100%'
                    >
                      <v-row
                        v-for='(input, key) in inputsAddFile'
                        :key='key'
                        style='margin: 0;width: 100%'
                      >
                        <v-file-input
                          v-model='files[key]'
                          :rules='fileRules'
                          style='cursor: pointer'
                          accept='image/*,.pdf,.xlsx,.xls, .doc, .docx'
                          color='primary'
                          :label='input.label'
                          prepend-icon='mdi-paperclip'
                          dense
                          outlined
                          :show-size='1000'
                        >
                          <template #selection='{ index, text }'>
                            <v-chip
                              v-if='index < 3'
                              color='primary'
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>
                          </template>
                        </v-file-input>
                        <v-btn
                          v-if='key > 0'
                          class='error'
                          style='margin:0 0 0 10px;height: 40px;'
                          @click='deleteInput(key)'
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-row>
                      <v-row style='margin: 0;width: 100%'>
                        <v-btn
                          width='100%'
                          class='primary'
                          @click='pushInput'
                        >
                          <v-icon>mdi-plus-circle</v-icon>
                          &nbsp;Добавить еще файл
                        </v-btn>
                      </v-row>
                    </v-row>
                    <!-- --------------------------------------------------- -->
                    <!-- Комментарий контрагента Если принято -->
                    <v-row
                      v-if='state === "Accepted" && items.is_overdue === false'
                      style='margin: 10px 20px;margin-top: 40px;'
                    >
                      <v-row
                        style='margin: 0;width: 100%'
                      >
                        <v-textarea
                          v-model='offerComment'
                          label='Комментарий'
                          placeholder='Напишите комментарий к Вашему КП'
                          type='text'
                          outlined
                          auto-grow
                          rows='2'
                          row-height='30'
                          :rules='[rules.length(500),]'
                        ></v-textarea>
                      </v-row>

                      <v-row
                        style='margin: 0;width: 100%'
                      >
                        <v-btn
                          width='100%'
                          height='60'
                          class='info'
                          @click='preSendOffer'
                        >
                          Отправить Коммерческое Предложение &nbsp;
                          <v-icon>mdi-send</v-icon>
                        </v-btn>
                      </v-row>

                    </v-row>
                    <!-- Комментарий контрагента Если отправлено -->
                    <v-row
                      v-if='state === "Sent"'
                      style='margin: 10px 20px;margin-top: 0;'
                    >
                      <v-row
                        style='margin: 0;width: 100%'
                      >
                        <v-textarea
                          v-model='offerComment'
                          label='Комментарий'
                          type='text'
                          outlined
                          auto-grow
                          readonly
                          rows='2'
                          row-height='30'
                        ></v-textarea>
                      </v-row>
                    </v-row>

                  </v-row>


                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <!-- Диалоговое окно Принятия тендера -->
          <v-dialog
            v-model='dialog_accept'
            max-width='500'
          >
            <v-card
              color='warning'
              dark
            >
              <v-card-text style='text-align:center;padding: 24px 20px;color: black'>
                <h2 style='margin:5px 5px 20px 5px;'>Подтвердите участие в Тендере:</h2>
                <h3 style='margin:5px 10px;'><u>ПРЕДУПРЕЖДЕНИЕ!</u></h3>

                <h3 style='margin:5px 10px;'>
                  После того, как Вы приняли тендер, Вам необходимо отправить КП до окончания периода проведения
                  тендера.
                  Отменить решение будет невозможно!
                </h3>
                <h3 style='margin:20px 10px;'>
                  Вы действительно хотите принять участие в выбранном Тендере?
                </h3>
                <v-btn
                  width='130px'
                  style='margin-right: 50px;'
                  title='Отменить'
                  color='error'
                  @click='dialog_accept = false'
                >
                  <v-icon>mdi-close</v-icon>
                  &nbsp;Отмена
                </v-btn>
                <v-btn
                  width='250px'
                  color='success black--text'
                  @click='acceptTender'
                >
                  Подтвердить участие&nbsp;
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- Диалоговое окно Отказа от тендера -->
          <v-dialog
            v-model='dialog_decline'
            max-width='500'
          >
            <v-card
              color='error'
              dark
            >
              <v-card-text style='text-align:center;padding: 24px 20px;color: white'>
                <h2 style='margin:5px 5px 20px 5px;'>Подтвердите ОТКАЗ от участия в Тендере:</h2>
                <h3 style='margin:5px 10px;'><u>ПРЕДУПРЕЖДЕНИЕ!</u></h3>

                <h3 style='margin:5px 10px;'>
                  После того, как Вы отклонили тендер, Вы больше не сможете принять в нем участие.
                  Отменить решение будет невозможно!
                </h3>
                <h3 style='margin:20px 10px;'>
                  Вы действительно хотите отказаться от участия в выбранном Тендере?
                </h3>
                <v-btn
                  width='130px'
                  style='margin-right: 50px;'
                  title='Отменить'
                  color='primary'
                  @click='dialog_decline = false'
                >
                  <v-icon>mdi-close</v-icon>
                  &nbsp;Отмена
                </v-btn>
                <v-btn
                  width='250px'
                  color='warning black--text'
                  @click='declineTender'
                >
                  Подтвердить отказ&nbsp;
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- Диалоговое окно Вложений RFQ тендера -->
          <v-dialog
            v-model='dialog_attach'
            max-width='800'
          >
            <v-card
              class='mx-auto'
              tile
            >
              <v-card-text style='text-align:center;padding: 24px 20px;'>
                <h2>ВЛОЖЕНИЯ RFQ</h2>

                <v-list>
                  <v-list-item-group
                    color='primary'
                  >
                    <v-list-item
                      v-for='(item, i) in attachmentsRFQ'
                      :key='i'
                      :href='item.attachments'
                      target='_blank'
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-file</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          style='text-align: left'
                          v-text='item.filename'
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
              <v-card-actions class='justify-end'>
                <v-btn
                  text
                  @click='dialog_attach = false'
                >Закрыть
                </v-btn>
              </v-card-actions>
            </v-card>


          </v-dialog>

          <v-dialog
            v-model='dialog_send'
            max-width='500'
          >
            <v-card
              color='warning'
              dark
            >
              <v-card-text style='text-align:center;padding: 24px 20px;color: black'>
                <h2 style='margin:5px 5px 20px 5px;'>Подтвердите отправку<br>Коммерческого предложения:</h2>
                <h3 style='margin:5px 10px;'><u>ПРЕДУПРЕЖДЕНИЕ!</u></h3>

                <h3 style='margin:5px 10px;'>
                  После подтверждения Вы больше не сможете вносить изменения в Вашем КП.<br>
                  Отменить отправку будет невозможно!
                </h3>
                <h3 style='margin:20px 10px;'>
                  Вы действительно хотите отправить<br>Коммерческое предложение к текущему Тендеру?
                </h3>
                <v-btn
                  width='130px'
                  style='margin-right: 50px;'
                  title='Отменить'
                  color='error'
                  @click='dialog_send = false'
                >
                  <v-icon>mdi-close</v-icon>
                  &nbsp;Отмена
                </v-btn>
                <v-btn
                  width='250px'
                  color='success black--text'
                  @click='sendOffer'
                >
                  Подтвердить отправку&nbsp;
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>


          <v-dialog
            v-model='dialog_success'
            hide-overlay
            persistent
            width='400'
          >
            <v-card
              color='success'
              dark
            >
              <v-card-text style='text-align:center;padding: 24px 10px;'>
                <h2 style='margin:10px;color: black;'>Ваше Коммерческое предложение<br>отправляется...</h2>
                <v-progress-linear
                  indeterminate
                  color='black'
                  style='margin: 20px 5px 20px 5px; height:10px; width: auto;'
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>


          <v-overlay

            :value='overlay'
          >
            <v-dialog
              v-model='dialog_error'
              hide-overlay
              persistent
              width='400'
            >
              <v-card
                color='error'
                dark
              >
                <v-card-text style='text-align:center;padding: 24px 20px;color: white;'>
                  <h2 style='margin:5px;'>Ошибка!</h2>
                  <h3 style='margin:5px;'>Ваше Коммерческое предложение<br>НЕ ОТПРАВЛЕНО!</h3>
                  <h3 style='margin:10px 10px 20px 10px;'>Попробуйте отправить еще раз<br>или обратитесь в службу
                    поддержки!</h3>
                  <v-btn
                    width='100%'
                    depressed
                    color='warning black--text'
                    @click='refresh'
                  >
                    Перезагрузить страницу
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-overlay>

          <v-overlay
            :value='overlay2'
          >
            <v-dialog
              v-model='dialog_validate'
              hide-overlay
              persistent
              width='400'
            >
              <v-card
                color='error'
                dark
              >
                <v-card-text style='text-align:center;padding: 24px 20px;color: white;'>
                  <h2 style='margin:5px;'>Ошибка!</h2>
                  <h3 style='margin:5px;'>Ваше Коммерческое предложение<br>НЕ ОТПРАВЛЕНО!</h3>
                  <h3 style='margin:10px 10px 20px 10px;'>Чтобы отправить Ваше КП, необходимо<br>заполнить данные хотя бы<br>одной номенклатуры</h3>
                  <v-btn
                    width='100%'
                    depressed
                    color='warning black--text'
                    @click='overlay2 = false'
                  >
                    Продолжить
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-overlay>

          <!-- СнэкБар на действия по КП -->
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
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Card',
  filters: {
    // format: val => `${val}`.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 '),
    format(val){
      return !val ? '' : `${val}`.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ')
    }
  },
  middleware: 'auth',
  data() {
    return {
      search: '',
      absolute: true,
      overlay: false,
      overlay2: false,
      snack: false,
      snackColor: '',
      snackText: '',
      dialog_accept: false,
      dialog_decline: false,
      dialog_attach: false,
      dialog_send: false,
      dialog_validate: false,
      errored: false,
      loading: true,
      loadTenderTable: true,
      rqf_number: '',
      attachmentsRFQ: [],
      headersTenderDetail: [
        { text: '№', value: 'index', class: 'table_header_Class table_cell_padding10', cellClass: 'table_body_Class' },
        {
          text: 'Номенклатура',
          value: 'name',
          class: 'table_header_Class table_cell_width240',
          cellClass: 'table_body_Class table_cell_width240',
        },
        {
          text: '',
          value: 'actions',
          class: 'table_header_Class padding5',
          cellClass: 'padding5',
          width: '61px'
        },
        {
          text: 'Отклонения от требования',
          value: 'alter',
          class: 'table_header_Class table_cell_no_padding',
          cellClass: 'table_body_Class',
          width: '90px'
        },
        {
          text: 'Кол-во',
          value: 'amount',
          class: 'table_header_Class nowrap_Class',
          cellClass: 'table_body_Class',
          width: '100px'
        },
        {
          text: 'Ед. изм.',
          value: 'measure',
          class: 'table_header_Class nowrap_Class',
          cellClass: 'table_body_Class',
          width: '90px'
        },
        {
          text: 'Требуемый срок поставки',
          value: 'required_term',
          class: 'table_header_Class',
          format: 'YYYY-MM-DD',
          cellClass: 'table_body_Class',
          width: '80px'
        },
        {
          text: 'Срок поставки',
          value: 'selected_term',
          class: 'table_header_Class nowrap_Class',
          cellClass: 'table_body_Class',
          width: '90px'
        },
        {
          text: 'Цена за ед. без НДС',
          value: 'price',
          class: 'table_header_Class',
          cellClass: 'table_body_Class nowrap_Class',
          width: '110px'
        },
        {
          text: 'Сумма без НДС',
          value: 'total',
          class: 'table_header_Class table_cell_width65',
          cellClass: 'table_body_Class table_cell_width65 nowrap_Class',
          width: '113px'
        },
        {
          text: 'Сертификаты качества',
          value: 'quality_certificate',
          class: 'table_header_Class nowrap_Class',
          cellClass: 'table_body_Class padding5'
        },
        {
          text: 'Сертификаты РК',
          value: 'rk_certificate',
          class: 'table_header_Class nowrap_Class',
          cellClass: 'table_body_Class padding5'
        },
      ],
      items: [], // данные о тендере из модели Catalog
      itemsCurrency: [],
      itemsAlter: ['Нет', 'Да'],
      tenderInfo: [],
      offerInfo: [], // details из сохраненного предложения
      offerComment: '', // comment из сохраненного предложения
      offerTermsOfPayment: '', // Свои Условия оплаты контрагента - payment
      offerTermsOfDelivery: '', // Свои Условия поставки контрагента - delivery
      offerAddressOfDelivery: '', // Свой Адресс поставки контрагента - address
      categories: [], // итоговый список категорий номенклатур (без дубликатов)
      state: '',
      menu: false,
      date: null,
      files: [],
      fileRules: [
        value => !value || value.size < 15000000 || 'Максимальный размер файла 15МБ'
      ],
      rules: {
        length: len => v => v.length <= len || `Максимум ${len} символов`,
        required: v => !!v || 'Это поле обязательно к заполнению'
      },
      dmsRule: [
        value => !value || value >= 0 && value <= 100 || 'Введите значение от 0 до 100'
      ],
      inputsAddFile: [
        { label: 'Прикрепить файл' }
      ],
      editedIndex: -1,
      defaultItem: {
        id: '',
        name: '',
        amount: 0,
        measure: '',
        required_term: '',
        selected_term: '',
        price: 0.00,
        total: 0.00,
        dms: 0,
        amount_new: 0,
        alter: '',
        quality_certificate: '',
        rk_certificate: '',
        category: []
      },
      editedItem: {
        id: '',
        name: '',
        amount: 0,
        measure: '',
        required_term: '',
        selected_term: '',
        price: 0.00,
        total: 0.00,
        dms: 0,
        amount_new: 0,
        alter: '',
        quality_certificate: '',
        rk_certificate: '',
        category: []
      },
      dialogAlter: false,
      dialog_success: false, // окно прогресса отправки КП
      dialog_error: false, // окно ошибки отправки КП
      temp_file: [],
      sumNoNDS: 0.00,
      offerDate: '',
      offerNumber: '',
      selectErrors: '',
      offerNumberErrors: '',
      priceErrors: '',
      termsErrors: '',
      currency: [],
      selectedCurrency: '',
      agentName: '',
      agentPosition: '',
      agentPhone: '',
      agentNameErrors: '',
      agentPositionErrors: '',
      agentPhoneErrors: '',
      link: '',
    }
  },

  head: {
    title: 'Страница тендера'
  },
  computed: {
    user() {
      return this.$auth.user
    },
  },
  watch:{
    // currency(){
    //   console.log(this.currency)
    // }
  },
  mounted() {
    this.getState() // Получить состояние тендера
    this.loadPage() // Загрузка функций страницы
  },
  created() {
    // this.loadPage()
  },

  methods: {
    // Округление ДМС
    dmsRound(){
      this.editedItem.dms = this.editedItem.dms.toFixed(2)
      // console.log(this.editedItem.amount_new)
    },
    // Подсчет Итоговых сумм в тенге
    sumCash(){
      let sum = 0
      if (this.state === "Sent") {
        sum = this.sumNoNDS
      }
      else if (this.state === "Accepted") {
          for (let i = 0; i < this.offerInfo.length; i++) {
            sum += parseFloat(this.offerInfo[i].total)
            if (this.offerInfo[i].amount_new === 0) {
              this.offerInfo[i].amount_new = this.offerInfo[i].amount
            } else if (this.offerInfo[i].amount_new === '') {
              this.offerInfo[i].amount_new = 0
            }

          }
          this.sumNoNDS = parseFloat(sum).toFixed(2)
      }

      this.sumNoNDS = this.sumNoNDS.toString()
    },

    // Добавить еще инпут для файла
    pushInput() {
      if (this.files.length === this.inputsAddFile.length) {
        this.inputsAddFile.push({
          label: 'Прикрепить файл'
        })
      }
      // console.log(this.files)
    },
    // Удалить инпут с файлом
    deleteInput(key) {
      if (key > 0) {
        console.log('selected: ' + this.inputsAddFile[key].label)
        this.inputsAddFile.splice(key, 1)
        this.files.splice(key, 1)
        console.log('deleted: ' + this.inputsAddFile)
      }
    },

    // Функция загрузки страницы и всех данных
    async loadPage() {
      await this.getLink()
      await this.getCards() // получить общие данные о тендере
      await this.getCurrency() // получаем текущий список доступных валют
      await this.initialize() // Получить данные тендера + Номенклатуры или черновик
      await this.updateViewed() // Отметить просмотр тендера юзером
      await this.getFiles() // получить список файлов
    },

    // получить общие данные о тендере
    async getCards() {
      this.loading = true
      this.errored = false
      try {
        const data = await this.$axios.$get('/api/v1/card/' + this.$route.params.id + '/')
          .catch((e) => {
            console.log(e)
            this.errored = true
          })
          .finally(() => {
            this.loading = false
          })
        if (!data) return

        if (data.started_at === null) {
          data.started_at = 'Нет данных'
        } else {
          data.started_at = moment(data.started_at).format('HH:mm - DD.MM.yyyy')
        }
        if (data.closed_at === null) {
          data.closed_at = 'Нет данных'
        } else {
          data.closed_at = moment(data.closed_at).format('HH:mm - DD.MM.yyyy')
        }

        this.rqf_number = data.rfq
        this.items = data
        // Проверка на просрочку
        if ((this.items.is_overdue) && (this.items.status !== 'Завершен')) {
          await this.$axios.$patch('/api/v1/card/' + this.items.id + '/', {
            status: 'Завершен'
          })
          this.items.status = 'Завершен'
        }
        console.log('Card initialized')
      } catch (e) {
        console.log('Card NOT initialized')
      }
    },

    // Получить данные тендера + Номенклатуры или черновик
    async initialize() {
      this.loadTenderTable = true // включение лоадера таблицы
      if ((this.state === 'Accepted') || (this.state === 'Sent')) {
        try {
          const offer = await this.$axios.$get('/api/v1/offer_show/' + this.rqf_number + '/')
          if (offer.length !== 0) {
            this.offerInfo = JSON.parse(offer[0].detail)
            this.offerComment = offer[0].comment
            this.offerTermsOfDelivery = offer[0].delivery
            this.offerTermsOfPayment = offer[0].payment
            this.sumNoNDS = parseFloat(offer[0].sumNoNDS).toFixed(2)
            if (offer[0].currency) { this.currency = JSON.parse(offer[0].currency) }
            else { this.currency = '' }
            this.offerDate = moment(offer[0].updated_at).format('HH:mm - DD.MM.yyyy')
            this.offerNumber = offer[0].offerNumber
            this.offerAddressOfDelivery = offer[0].address
            this.agentName = offer[0].agent_name
            this.agentPosition = offer[0].agent_position
            this.agentPhone = offer[0].agent_phone
            this.sumCash()
          }
        } catch (e) {
          console.log(e)
        }
      }
      try {
        const response = await this.$axios.$get('/api/v1/tender_detail/' + this.rqf_number + '/')
          .catch((e) => {
            console.log('log' + e)
            this.errored = true
          })
          .finally(() => {
            this.loadTenderTable = false // выключение лоадера таблицы
          })

        if (!response) return
        this.tenderInfo = JSON.parse(response[0].detail)
        console.log('Data initialized')
      } catch (e) {
        this.errored = true
        console.log('Data NOT initialized')
      }

    },

    // Отметить просмотр тендера юзером
    async updateViewed() {
      const refresh = await this.$axios.$get('/api/v1/profile/')
      this.refreshUser = refresh
      const viewedRFQ = this.refreshUser.user.viewed
      if (!viewedRFQ.includes(this.items.id)) {
        const thisViewed = []
        thisViewed.push(this.items.id)
        // console.log('YO ' + thisViewed)

        // send request to 1C = изменить статус для текущего юзера
        await this.changeTenderStatus(0)

        await this.$axios.$patch('/api/v1/viewed/' + this.user.id + '/', {
          viewed: thisViewed
        })

      } else {
        console.log('Already viewed')
      }

    },

    // Получить состояние тендера
    async getState() {
      console.log('get state')
      try {
        // Сделать выборку по идентификатору пользователя
        const data = await this.$axios.$get('/api/v1/tender_state/', {
          params: {
            rfq: this.$route.params.id
          }
        })
          .catch((e) => {
            console.log(e)
            this.errored = true
          })
          .finally(() => {
          })
        if (!data) return
        this.state = data[0].state
        console.log('Check' + this.state)
        if (this.state === 'Declined') {
          console.log('redirect')
          this.$router.push('/')
        }
        return data[0].state
      } catch (e) {
        console.log('no state')
        await this.$axios.$post('/api/v1/tender_state/', {
          rfq: this.$route.params.id,
          user: this.user.id,
          state: 'Ignored'
        })
        this.state = 'Ignored'
      }


    },

    // Принятие/Отказ тендера
    async acceptTender() {

      // send request to 1C = изменить статус для текущего юзера
      await this.changeTenderStatus(1)

      // Обернуть в ТРАЙ / Кетч
      await this.$axios.$patch('/api/v1/updatestate/' + this.items.id + '/', {
        state: 'Accepted'
      })
      const detailString = JSON.stringify(this.tenderInfo)

      // проверить есть ли уже запись - пробуем искать в офферах, если есть данные то ничего не делаем, если нет записи то POST

      const offer = await this.$axios.$get('/api/v1/offer_show/' + this.rqf_number + '/')

      if (offer.length === 0) {
        await this.$axios.$post('/api/v1/offer_create/', {
          name: this.rqf_number,
          detail: detailString
        })
      } else {
        this.offerInfo = JSON.parse(offer[0].detail)
        console.log('if offer - true')
      }

      console.log('WE ALREADY HAVE DATA')
      this.dialog_accept = false
      this.$router.go()
    },
    async declineTender() {

      // send request to 1C = изменить статус для текущего юзера
      await this.changeTenderStatus(3)

      await this.$axios.$patch('/api/v1/updatestate/' + this.items.id + '/', {
        state: 'Declined'
      })
      this.dialog_decline = false
      this.$router.go()
    },

    // Функция на время разработки - откат до состояния -Без ответа-
    async tryIgnored() {
      await this.$axios.$patch('/api/v1/updatestate/' + this.items.id + '/', {
        state: 'Ignored'
      })
      this.$router.go()
    },

    // Функция на время разработки - изменение состояния на -КП Отправлено-
    async submitOffer() {
      await this.$axios.$patch('/api/v1/updatestate/' + this.items.id + '/', {
        state: 'Sent'
      })
      this.$router.go()
    },

    // получить список файлов
    async getFiles() {
      try {
        // Сделать выборку по идентификатору пользователя
        const data = await this.$axios.$get('/api/v1/get_tender_files/' + this.items.rfq + '/', {})
          .catch((e) => {
            console.log(e)
            this.errored = true
          })
          .finally(() => {
          })
        if (!data) return
        this.attachmentsRFQ = data
        return this.attachmentsRFQ
      } catch (e) {
        console.log('no files')
      }
    },

    // Подсветка строки, если все неоходимые данные указаны
    itemRowBackground(item) {
      if ((item.price > 0) && (item.selected_term !== '')) {
        return 'info'
      } else {
        return ''
      }
    },

    // Проверяем цену и сумму на правильность ввода
    checkTotal() {
      if ((isNaN(this.editedItem.price)) || (this.editedItem.price < 0) || (this.editedItem.price === '')) {
        this.editedItem.price = 0
        this.editedItem.price = this.editedItem.price.toFixed(2)
        this.editedItem.total = 0
        this.editedItem.total = this.editedItem.total.toFixed(2)
      } else {
        if (this.editedItem.price === '') { this.editedItem.price = 0 }
        this.editedItem.price = parseFloat(this.editedItem.price)
        this.editedItem.price = this.editedItem.price.toFixed(2)
        this.editedItem.amount_new = parseFloat(this.editedItem.amount_new)

        if (this.editedItem.amount_new > 0) {
          this.editedItem.total = this.editedItem.amount_new * this.editedItem.price
          this.editedItem.total = this.editedItem.total.toFixed(2)
          this.editedItem.amount_new = this.editedItem.amount_new.toFixed(3)
        } else {
          this.editedItem.amount_new = this.editedItem.amount.toFixed(3)
          this.editedItem.total = this.editedItem.amount * this.editedItem.price
          this.editedItem.total = this.editedItem.total.toFixed(2)
        }
      }
    },

    // Назначаем значения для ввода/редактирования/сохранения
    editItemAlter(item) {
      this.editedIndex = this.offerInfo.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogAlter = true
    },
    // Сохраняем введенные значения
    async saveAlter() {
      this.selectErrors = ''
      if (this.editedItem.alter.match(/^[ ]+$/)) { // В значении только пробелы
        this.editedItem.alter = ''
      }
      if (this.editedItem.selected_term.match(/^[ ]+$/)) { // В значении только пробелы
        this.editedItem.selected_term = ''
      }

      if ((this.editedItem.price === 0) || (this.editedItem.price === 0.00) || (this.editedItem.price === '0.00')){
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Необходимо указать цену!'
        this.priceErrors = 'Необходимо указать цену!'
        return
      } else {
        this.priceErrors = ''
      }

      if (this.editedItem.selected_term === '') {
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Необходимо указать срок поставки!'
        this.termsErrors = 'Необходимо указать срок поставки!'
        return
      } else {
        this.termsErrors = ''
      }

      Object.assign(this.offerInfo[this.editedIndex], this.editedItem)
      // console.log(this.offerInfo) // save array here and use axios patch datail with json to string

      this.sumCash()

      this.closeAlter()
      await this.saveOffer()
    },
    // Закрытие окна и сброс дефолтных значений
    closeAlter() {
      this.dialogAlter = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async resetAlter(){
      this.editedItem.price = 0
      this.editedItem.total = 0
      this.editedItem.selected_term = ''
      this.editedItem.alter = ''
      this.editedItem.amount_new = 0
      this.editedItem.dms = 0
      this.checkTotal()
      Object.assign(this.offerInfo[this.editedIndex], this.editedItem)
      this.sumCash()
      this.dialogAlter = false
      await this.saveOffer()
    },
    // Сохранение черновика КП
    async saveOffer() {
      try {
        const saveDetail = JSON.stringify(this.offerInfo)
        const saveCurrency = JSON.stringify(this.currency)

        await this.$axios.$patch('/api/v1/offer_show/' + this.rqf_number + '/', {
          detail: saveDetail,
          comment: this.offerComment,
          delivery: this.offerTermsOfDelivery,
          payment: this.offerTermsOfPayment,
          address: this.offerAddressOfDelivery,
          agent_name: this.agentName,
          agent_position: this.agentPosition,
          agent_phone: this.agentPhone,
          currency: saveCurrency,
          offerNumber: this.offerNumber
        })
        this.snack = true
        this.snackColor = 'success black--text'
        this.snackText = 'Cохранено!'
        console.log('saved')
      } catch (e) {
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Ошибка сохранения! Попробуйте еще раз!'
        console.log('saving error')
      }
    },


    // Валидация файлов и Номера КП перед отправкой КП
    preSendOffer() {
      let validFile = true
      let validOfferNumber = false
      let validCurrency = false
      let validAgentName = false
      let validAgentPos = false
      let validAgentPhone = false


      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].size > 15 * 1024 * 1024) {
          validFile = false
        }
      }

      if (validFile === false) {
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Максимальный размер файла 15Мб'
      }
      if (this.agentPhone === '') {
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Укажите Телефон представителя'
        this.agentPhoneErrors = 'Укажите Телефон представителя'
      } else {
        validAgentPhone = true
        this.agentPhoneErrors = ''
      }
      if (this.agentPosition === '') {
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Укажите Должность представителя'
        this.agentPositionErrors = 'Укажите Должность представителя'
      } else {
        validAgentPos = true
        this.agentPositionErrors = ''
      }
      if (this.agentName === '') {
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Укажите ФИО представителя'
        this.agentNameErrors = 'Укажите ФИО представителя'
      } else {
        validAgentName = true
        this.agentNameErrors = ''
      }
      if (this.currency === '') {
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Укажите валюту КП'
        this.selectErrors = 'Укажите валюту КП'
      } else {
        validCurrency = true
        this.selectErrors = ''
      }
      if (this.offerNumber !== '') {
        validOfferNumber = true
        this.offerNumberErrors = ''
      } else {
        validOfferNumber = false
        this.snack = true
        this.snackColor = 'error black--text'
        this.snackText = 'Заполните номер КП'
        this.offerNumberErrors = 'Заполните номер КП'
      }

      if ((validOfferNumber) && (validFile) && (validCurrency) && (validAgentName) && (validAgentPos) && (validAgentPhone)) {
        this.dialog_send = true // Открытие окна подтверждения
      }
    },


    async sendOffer() {
      this.dialog_send = false

      let out = []
      for (let i = 0; i < this.offerInfo.length; i++) {
        if ((this.offerInfo[i].selected_term !== '') && (this.offerInfo[i].price !== '') && (this.currency.name !== ''))
          out.push(this.offerInfo[i])
      }
      if (out.length < 1) {
        this.overlay2 = true
        this.dialog_validate = true
        console.log('Чтобы отправить Ваше КП, необхоимо заполнить данные для хотя бы одной номенклатуры')
        return
      }

      out = JSON.stringify(out)

      const filesArray = []

      for (let i = 0; i < this.files.length; i++) {
        this.temp_file = {}
        const filename = this.files[i].name
        const filebase64 = await this.getBase64(this.files[i])

        this.temp_file = { name: filename, file: filebase64 }

        filesArray.push(this.temp_file)
      }

      console.log(filesArray)
      try {
        this.dialog_success = true
        // в продакшне раскомментировать, закрыл для тестирования
        await this.$axios.$post(this.link + 'updoffer',
          {
            rfq_id: this.items.rfq_id,
            user: this.user.uid,
            detail: out,
            comment: this.offerComment,
            delivery: this.offerTermsOfDelivery,
            payment: this.offerTermsOfPayment,
            address: this.offerAddressOfDelivery,
            agent_name: this.agentName,
            agent_position: this.agentPosition,
            agent_phone: this.agentPhone,
            offerNumber: this.offerNumber,
            currency: JSON.stringify(this.currency),
            files: filesArray
          },
          {
            // headers,
            credentials: true,
            auth: {
              username: 'web',
              password: 'web'
            },
          })

        await this.$axios.$patch('/api/v1/offer_show/' + this.rqf_number + '/', {
          detail: out,
          comment: this.offerComment,
          delivery: this.offerTermsOfDelivery,
          payment: this.offerTermsOfPayment,
          sumNoNDS: this.sumNoNDS,
          offerNumber: this.offerNumber,
          currency: JSON.stringify(this.currency),
          address: this.offerAddressOfDelivery,
          agent_name: this.agentName,
          agent_position: this.agentPosition,
          agent_phone: this.agentPhone,
        })

        await this.$axios.$patch('/api/v1/updatestate/' + this.items.id + '/', {
          state: 'Sent'
        })

        this.snack = true
        this.snackColor = 'success black--text'
        this.snackText = 'Коммерческое предложение отправлено!'
        await new Promise(resolve => setTimeout(() => {
          (this.dialog_success = false);
          (this.$router.go())
        }, 2500))
      } catch (e) {
        this.dialog_success = false
        this.overlay = true
        this.dialog_error = true
      }

      console.log('sent')
    },

    refresh() {
      window.location.reload()
    },

    async changeTenderStatus(variable){
      if (this.items.is_overdue === false) {
      await this.$axios.$post(this.link + 'UpdateStatusOffer', {
          user: this.user.uid, // uid пользователя
          rfq_id: this.items.rfq_id, // uid текущей заявки RFQ
          status: variable // статус (прочитан = 0, отклонен = 3, принят = 1)
        },
        {
      credentials: true,
      auth: {
        username: 'web',
          password: 'web'
      },
        })
      console.log(variable)
      }
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },

    async getCurrency(){
      try{
        const response = await this.$axios.get(this.link + 'GetCurrencyList',{
          credentials: true,
          auth: {
            username: 'web',
            password: 'web'
          },
        })
        this.itemsCurrency = []
        // for (let i = 0; i < response.data.length; i++) {
        //   this.itemsCurrency.push(response.data[i])
        // }
        this.itemsCurrency = response.data
      } catch (e) {
        console.log(e)
      }
    },

    async getLink(){
      // this.link +
      const ERP = await this.$axios.$get('api/v1/link/')
      this.link = ERP[0].link
    },
  }

}
</script>

<style scoped>

</style>
