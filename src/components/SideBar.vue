<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar-title style="font-weight: bold" class="ma-3">
        工作栏
      </v-toolbar-title>
      <v-divider color="primary"></v-divider>
      <div class="d-flex flex-column">
      <v-btn variant="text" width="100%" color="primary" style="font-size:20px" class="ma-2 mt-4 ml-0 d-flex justify-start" @click="this.$router.push('/')">
        <v-icon class="mr-2">mdi-login</v-icon>
          登录
      </v-btn>
      <v-btn variant="text" width="100%" color="primary" style="font-size:20px" class="ma-2 mt-4 ml-0 d-flex justify-start" @click="this.$router.push('/student')">
        <v-icon class="mr-2">mdi-account-school</v-icon>
        学生管理
      </v-btn>
        <v-btn variant="text" width="100%" color="primary" style="font-size:20px" class="ma-2 mt-4 ml-0 d-flex justify-start" @click="this.$router.push('/grade')">
          <v-icon class="mr-2">mdi-function-variant</v-icon>
          成绩查询
        </v-btn>
        <v-btn variant="text" width="100%" color="primary" style="font-size:20px" class="ma-2 mt-4 ml-0 d-flex justify-start" @click="clearToken">
          <v-icon class="mr-2">mdi-book</v-icon>
          退出登录
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    axios,
    clearToken () {
      window.sessionStorage.clear()
      this.$router.push('/')
    }
  },
  data () {
    return {
    }
  }
}
</script>
