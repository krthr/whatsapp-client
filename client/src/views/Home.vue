<template>
  <v-container id="home" fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="11" md="9">
        <v-card tile height="80vh" max-height="80vh">
          <!-- -->
          <v-card-text
            v-if="state == 'QRCODE'"
            class="fill-height d-flex align-center justify-center"
          >
            <img
              src="https://store-images.s-microsoft.com/image/apps.33967.13510798887182917.246b0a3d-c3cc-46fc-9cea-021069d15c09.392bf5f5-ade4-4b36-aa63-bb15d5c3817a"
              style="width: 300px"
            />
          </v-card-text>
          <!-- -->

          <!-- -->
          <v-card-text v-else-if="state == 'LOGGED_IN'" class="fill-height">
            <v-row class="fill-height">
              <!-- Contact list -->
              <v-col cols="12" sm="5" lg="4">
                <v-list id="contact-list" three-line>
                  <template v-for="(item, index) in contacts">
                    <v-list-item :key="index" @click="() => null">
                      <v-list-item-avatar>
                        <v-img :src="item.avatar"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title v-html="item.title"></v-list-item-title>
                        <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-col>
              <!-- // Contact list -->

              <!-- Chat -->
              <v-col>
                <div no-gutters id="current-contact">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img :src="current.avatar"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-html="current.title"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
                <div id="messages-list" class="flex-column" style>
                  <div
                    v-for="(message, index) in messages"
                    :key="index"
                    class="message-bubble py-1"
                    :style="{
                      'text-align': message.me ? 'right' : 'left',
                    }"
                  >
                    <div
                      :class="
                        `pa-3 px-4 white--text message-text ${
                          message.me ? 'me' : ''
                        }`
                      "
                    >{{ message.text }}</div>
                  </div>
                </div>

                <div class="d-flex align-center" style="height: 70px">
                  <v-text-field
                    append-icon="mdi-send"
                    hide-details
                    label="Escribir mensaje..."
                    outlined
                    @click:append="() => {}"
                  ></v-text-field>
                </div>
              </v-col>
              <!-- // Chat -->
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const STATES = {
  QRCODE: "QRCODE",
  LOGGED_IN: "LOGGED_IN"
};

export default {
  name: "Home",

  data: () => ({
    state: STATES.LOGGED_IN,
    current: {
      avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
      title: 'Summer BBQ'
    },
    contacts: [
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle:
          "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "Oui oui",
        subtitle:
          "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Birthday gift",
        subtitle:
          "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Recipe to try",
        subtitle:
          "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle:
          "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "Oui oui",
        subtitle:
          "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Birthday gift",
        subtitle:
          "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Recipe to try",
        subtitle:
          "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
      }
    ],
    messages: [
      {
        me: false,
        text: "En sus sueños"
      },
      {
        me: false,
        text: "Cuando alguien cuando alguien extraño era notado"
      },
      {
        me: false,
        text: "Cuando modificaba mucho todo"
      },
      {
        me: false,
        text: "Era notado"
      },
      {
        me: true,
        text: "No creo que sea el principal, ni siquiera en mi vida"
      }
    ]
  })
};
</script>

<style scoped>
#home {
  height: 100vh;
}

#messages-list,
#contact-list {
  overflow-y: auto;
}

#messages-list::scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

#contact-list {
  height: calc(80vh - 56px);
  max-height: calc(80vh - 56px);
}

#messages-list {
  height: calc(80vh - 50px - 70px - 55px);
  max-height: calc(80vh - 50px - 70px - 55px);
}

#current-contact {
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.me.message-text {
  background: #262a50;
}

.message-text {
  background: #1a1919;
}

.message-bubble > div {
  display: inline-block;
  border-radius: 6px;
}
</style>
