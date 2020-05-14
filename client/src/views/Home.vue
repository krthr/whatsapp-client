<template>
  <v-container id="home" fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="11" md="9">
        <v-card tile height="80vh" max-height="80vh">
          <v-card-text
            v-if="state == 'LOADING'"
            class="fill-height d-flex align-center justify-center"
          >
            <v-progress-circular indeterminate size="80"></v-progress-circular>
          </v-card-text>

          <!-- -->
          <v-card-text
            v-else-if="state == 'QRCODE'"
            class="fill-height d-flex align-center justify-center"
          >
            <img :src="qrCodeUrl" style="width: 300px" />
          </v-card-text>
          <!-- -->

          <!-- -->
          <v-card-text v-else-if="state == 'LOGGED_IN'" class="fill-height">
            <v-row class="fill-height">
              <!-- Contact list -->
              <v-col cols="12" sm="5" lg="4">
                <v-subheader>Chats</v-subheader>

                <v-list id="contact-list">
                  <template v-for="(item, index) in chat">
                    <v-list-item
                      :key="index"
                      @click="() => $store.commit('setActualChat', item)"
                    >
                      <!-- 
                      <v-list-item-avatar>
                        <v-img :src="item.avatar"></v-img>
                      </v-list-item-avatar>
                      -->

                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.name || item.vname || item.short }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.jid }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-col>
              <!-- // Contact list -->

              <!-- Chat -->
              <v-col v-if="actualChat">
                <div no-gutters id="current-contact">
                  <v-list-item>
                    <!-- <v-list-item-avatar>
                      <v-img :src="current.avatar"></v-img>
                    </v-list-item-avatar>
                    -->

                    <v-list-item-content>
                      <v-list-item-title>
                        {{
                          actualChat.name ||
                            actualChat.vname ||
                            actualChat.short
                        }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ actualChat.jid }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </div>
                <div id="messages-list" class="flex-column" style>
                  <div
                    v-for="(message, index) in actualChat.messages"
                    :key="index"
                    class="message-bubble py-1"
                    :style="{
                      'text-align': message.fromMe ? 'right' : 'left',
                    }"
                  >
                    <div
                      :class="
                        `pa-3 px-4 white--text message-text ${
                          message.fromMe ? 'me' : ''
                        }`
                      "
                    >
                      {{ message.conversation }}
                    </div>
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
          <!-- -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { onClose, onError, onMessage, onOpen, send } from "../services/ws";
import { generateQrCode } from "../services/qr";

export default {
  name: "Home",

  data: () => ({
    qrCodeUrl: null,
  }),

  computed: {
    ...mapGetters(["actualChat", "chat", "contacts", "state"]),
  },

  methods: {
    ...mapMutations(["parseMessage", "setMe", "setState"]),
  },

  mounted() {
    onClose(() => console.log("closed"));
    onError((error) => console.error(error));

    onMessage(async ({ c, d }) => {
      switch (c) {
        // Start whatsapp service
        case 0: {
          break;
        }

        // QRCode
        case 1: {
          this.setState("QRCODE");
          this.qrCodeUrl = await generateQrCode(d);

          break;
        }

        // Logged In
        case 2: {
          this.setMe(d);
          this.setState("LOGGED_IN");
          break;
        }

        // New message
        case 3: {
          this.parseMessage(d);
          break;
        }
      }
    });

    onOpen(() => send({ c: 0 }));
  },
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
  height: calc(80vh - 56px - 48px);
  max-height: calc(80vh - 56px - 48px);
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
