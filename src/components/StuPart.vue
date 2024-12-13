<template>
  <v-col>
    <v-row rows="12">
      <div style="font-size:40px" class="ma-2">学生管理模块</div>
    </v-row>
    <v-divider class="mt-5 mb-5"></v-divider>
    <v-row>
        <v-data-table
          v-model:items-per-page="this.queryParam.size"
          v-if="this.role !== -1"
          :items="this.studentList"
          :headers="this.headers"
        >
        </v-data-table>
      <div v-if="this.role === -1" class="ma-4">
        <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
        您尚未登录或无权限查看当前界面
      </div>
    </v-row>
  </v-col>
  <div v-if="this.role === 1">
    <v-divider></v-divider>
    <div style="font-size:30px" class="ma-4">新增学生</div>
  <v-form class="d-flex justify-center align-center" ref="FormRef" v-model="vaild">
        <v-text-field class="mr-4" v-model="userInfo.email" :rules="emailRule" label="电子邮箱" required>
        </v-text-field>
        <v-text-field class="mr-4" v-model="userInfo.name" label="姓名" required>
        </v-text-field>
    <v-text-field class="mr-4" v-model="userInfo.age" label="年龄" required>
    </v-text-field>
      <v-row no-gutters>
        <v-btn @click="addStudent" class="ml-4 mr-5" density="default" color="primary">添加</v-btn>
        <v-btn density="default" color="error" @click="clearForm">取消</v-btn>
      </v-row>
  </v-form>
  </div>
  <div v-if="this.role === 1">
    <v-divider></v-divider>
    <div style="font-size:30px" class="ma-4">更新学生</div>
    <v-form class="d-flex justify-center align-center" ref="updateFormRef">
      <v-col cols="1">
        <v-text-field class="mr-4" v-model="updateStudentInfo.id" label="ID" required>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="mr-4" v-model="updateStudentInfo.email" label="email" required>
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="mr-4" v-model="updateStudentInfo.name" label="姓名" required>
        </v-text-field>
      </v-col>
      <v-row no-gutters>
        <v-btn @click="updateStudent" class="ml-4 mr-5" density="default" color="primary">更新</v-btn>
        <v-btn density="default" color="error" @click="clearUpdateForm">取消</v-btn>
      </v-row>
    </v-form>
  </div>
  <div v-if="this.role === 1">
    <v-divider></v-divider>
    <div style="font-size:30px" class="ma-4">删除学生</div>
    <v-form class="d-flex justify-center align-center" ref="deleteFormRef">
      <v-col cols="1">
      <v-text-field class="mr-4" v-model="deleteId" label="ID" required>
      </v-text-field>
      </v-col>
      <v-row no-gutters>
        <v-btn @click="deleteStudent" class="ml-4 mr-5" density="default" color="primary">删除</v-btn>
        <v-btn density="default" color="error" @click="clearDeleteForm">取消</v-btn>
      </v-row>
    </v-form>
  </div>
  <v-snackbar
    v-model="snackbar.value"
    :timeout="2000"
    location="top"
    style="color:white"
  >{{snackbar.text}}</v-snackbar>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      studentList: [],
      deleteId: 0,
      deleteVaild: false,
      queryParam: {
        page: 0,
        size: 10
      },
      snackbar: {
        value: false,
        text: ''
      },
      vaild: false,
      emailRule: [
        value => {
          if (value) return true
          return '请输入电子邮箱'
        }
      ],
      updateStudentInfo: {
        id: 0,
        email: '',
        name: ''
      },
      userInfo: {},
      isActive: false,
      role: -1,
      headers: [
        { title: 'id', align: 'start', sortable: true, key: 'id' },
        { title: '名称', align: 'center', sortable: false, key: 'name' },
        { title: '电子邮箱', align: 'center', sortable: false, key: 'email' },
        { title: '年龄', align: 'center', sortable: false, key: 'age' }
      ]
    }
  },
  created () {
    this.getRole()
  },
  mounted () {
    this.getStudent()
  },
  methods: {
    async getRole () {
      const token = window.sessionStorage.getItem('token')
      const response = await axios.get('/student/token', {
        params: {
          token: token
        }
      })
      if (!response.data.data) return
      this.role = response.data.data.role
    },
    async getStudent () {
      const token = window.sessionStorage.getItem('token')
      const response = await axios.get('/student', {
        params: {
          page: this.queryParam.page,
          size: this.queryParam.size,
          token: token
        }
      })
      if (!response.data.success) return
      this.studentList = response.data.data
    },
    async addStudent () {
      if (!this.vaild) {
        this.snackbar.text = '请正确输入信息'
        this.snackbar.value = true
        return
      }
      const token = window.sessionStorage.getItem('token')
      const response = await axios.post('/student/add', this.userInfo, {
        params: {
          token: token
        }
      })
      if (!response.data.success) {
        this.snackbar.text = response.data.errorMsg
        this.snackbar.value = true
        return
      }
      this.snackbar.text = '添加成功'
      this.snackbar.value = true
      await this.getStudent()
    },
    async updateStudent () {
      const token = window.sessionStorage.getItem('token')
      const response = await axios.put('/student/' + this.updateStudentInfo.id, this.updateStudentInfo, {
        params: {
          token: token
        }
      })
      if (!response.data.success) {
        this.snackbar.text = response.data.errorMsg
        this.snackbar.value = true
        return
      }
      this.snackbar.text = '添加成功'
      this.snackbar.value = true
      await this.getStudent()
    },
    async deleteStudent () {
      const token = window.sessionStorage.getItem('token')
      const response = await axios.delete('/student/' + this.deleteId, {
        params: {
          token: token
        }
      })
      if (!response.data.success) {
        this.snackbar.text = response.data.errorMsg
        this.snackbar.value = true
        return
      }
      this.snackbar.text = '删除成功'
      this.snackbar.value = true
      await this.getStudent()
    },
    clearForm () {
      this.$refs.FormRef.reset()
    },
    clearUpdateForm () {
      this.$refs.updateFormRef.reset()
      this.updateStudentInfo.id = 0
    },
    clearDeleteForm () {
      this.deleteId = 0
    }
  }
}
</script>
