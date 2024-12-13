<template>
  <v-row style="background-image: url('https://img.oulu.me/011%20Dusty%20Grass.png');height:800px">
    <v-col class="d-flex justify-center">
      <div class="d-flex justify-center" style="height:40vh; width:40vw">
        <v-card width="100%">
          <v-row rows="4" style="height:80px;background-color: #a2dbf1;color:white;font-size:20px" class="d-flex justify-center pa-6">
            <v-icon class="mr-2">mdi-home</v-icon>
            stumanage登录
          </v-row>
          <v-form class="d-flex justify-center align-center" ref="FormRef" v-model="vaild">
            <v-col cols="10">
            <v-row rows="12">
              <v-text-field class="mt-12" v-model="userInfo.email" :rules="emailRule" label="电子邮箱" required>
              </v-text-field>
            </v-row>
              <v-row>
              <v-text-field class="mt-6" v-model="userInfo.password" :rules="pwdRule" label="密码" required>
              </v-text-field>
            </v-row>
              <v-row class="d-flex justify-end" no-gutters>
                <v-btn class="mt-3 mr-2" @click="login" density="default" color="primary">登录</v-btn>
                <v-btn class="mt-3" density="default" color="error" @click="clearForm">取消</v-btn>
              </v-row>
            </v-col>
          </v-form>
        </v-card>
      </div>
    </v-col>
    <v-snackbar
      v-model="snackbar.value"
      :timeout="2000"
      location="top"
      style="color:white"
    >{{snackbar.text}}</v-snackbar>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      userInfo: {
        email: '',
        password: ''
      },
      vaild: false,
      emailRule: [
        value => {
          if (value) return true
          return '请输入电子邮箱'
        }
      ],
      pwdRule: [
        value => {
          if (value) return true
          return '请输入密码'
        }
      ],
      snackbar: {
        value: false,
        text: ''
      }
    }
  },
  methods: {
    async login () {
      const isVaild = await this.$refs.FormRef.validate()
      if (!isVaild) return

      const response = await axios.post('login', this.userInfo)
      if (!response.data.success) {
        this.snackbar.value = true
        this.snackbar.text = response.data.errorMsg
        return
      }
      window.sessionStorage.setItem('token', response.data.data)
      this.snackbar.value = true
      this.snackbar.text = '登陆成功'
    },
    clearForm () {
      this.$refs.FormRef.reset()
    }
  }
}
</script>
