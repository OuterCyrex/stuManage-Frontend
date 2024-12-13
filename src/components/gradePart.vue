<template>
  <v-col>
    <v-row rows="12">
      <div style="font-size:40px" class="ma-2">成绩查询模块</div>
    </v-row>
    <v-divider class="mt-5 mb-5"></v-divider>
    <v-row>
      <div v-if="this.role === 1" class="ma-4">
        <v-icon class="mr-2">mdi-human-male-board</v-icon>
        教师使用页面
      </div>
      <div v-if="this.role === 0" class="ma-4" style="font-size:25px">
        <v-icon class="mr-2">mdi-circle</v-icon>
        {{ this.studentInfo.name }} 同学，您的本学期成绩为：
      </div>
      <div style="width:200px" v-if="this.role === 1">
        <v-combobox
          label="请选择学生学号"
          v-model="this.sid"
          :items="this.studentList"
        ></v-combobox>
      </div>
      <v-btn v-if="this.role === 1" @click="this.getGrades(this.sid)" color="primary" class="ma-3">确定</v-btn>
      <v-data-table
        v-model:items-per-page="this.queryParam.size"
        v-if="this.role !== -1"
        :items="this.gradeList"
        :headers="this.headers"
      >
      </v-data-table>
      <div v-if="this.role === -1" class="ma-4">
        <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
        您尚未登录，请先登陆！
      </div>
    </v-row>
    <div v-if="this.role === 1">
      <v-divider></v-divider>
      <div style="font-size:30px" class="ma-4">增添课程成绩</div>
      <v-form class="d-flex justify-center align-center" ref="addFormRef">
        <v-text-field class="mr-4" v-model="newGrade.courseName" label="课程名" required>
        </v-text-field>
        <v-text-field class="mr-4" v-model="newGrade.credit" label="学分" required>
        </v-text-field>
        <v-text-field class="mr-4" v-model="newGrade.grade" label="成绩" required>
        </v-text-field>
        <v-row no-gutters>
          <v-btn @click="addGrade" class="ml-4 mr-5" density="default" color="primary">添加</v-btn>
          <v-btn density="default" color="error" @click="this.$refs.addFormRef.reset()">取消</v-btn>
        </v-row>
      </v-form>
    </div>
    <div v-if="this.role === 1">
      <v-divider></v-divider>
      <div style="font-size:30px" class="ma-4">更新成绩</div>
      <v-form class="d-flex justify-center align-center" ref="updateFormRef">
        <v-col>
          <v-text-field class="mr-4" v-model="this.updateID" label="成绩ID" required>
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field class="mr-4" v-model="this.updatedGrade" label="成绩" required>
          </v-text-field>
        </v-col>
        <v-row no-gutters>
          <v-btn @click="updateGrade" class="ml-4 mr-5" density="default" color="primary">更新</v-btn>
          <v-btn density="default" color="error" @click="this.$refs.updateFormRef.reset()">取消</v-btn>
        </v-row>
      </v-form>
    </div>
    <div v-if="this.role === 1">
      <v-divider></v-divider>
      <div style="font-size:30px" class="ma-4">删除成绩</div>
      <v-form class="d-flex justify-center align-center" ref="deleteFormRef">
        <v-col cols="1">
          <v-text-field class="mr-4" v-model="deleteID" label="ID" required>
          </v-text-field>
        </v-col>
        <v-row no-gutters>
          <v-btn @click="deleteGrade" class="ml-4 mr-5" density="default" color="primary">删除</v-btn>
          <v-btn density="default" color="error" @click="this.$refs.deleteFormRef.reset()">取消</v-btn>
        </v-row>
      </v-form>
    </div>
  </v-col>
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
      snackbar: {
        value: false,
        text: ''
      },
      headers: [
        { title: 'id', align: 'center', sortable: true, key: 'id' },
        { title: '课程名', align: 'center', sortable: false, key: 'courseName' },
        { title: '学分', align: 'center', sortable: false, key: 'credit' },
        { title: '成绩', align: 'center', sortable: true, key: 'grade' }
      ],
      role: -1,
      studentInfo: {
        name: '',
        id: 0
      },
      sid: 0,
      queryParam: {
        page: 0,
        size: 10
      },
      gradeList: [],
      studentList: [],
      newGrade: {
        courseName: '',
        credit: 0,
        grade: 0
      },
      updateID: 0,
      updatedGrade: 0,
      deleteID: 0
    }
  },
  mounted () {
    this.getRole().then(() => {
      if (this.role === 0) {
        this.getGrades(this.studentInfo.id)
      }
    })
    this.getAllStudent()
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
      this.studentInfo = response.data.data
      this.sid = this.studentInfo.id
    },
    async getGrades (id) {
      const response = await axios.get('student/grades', {
        params: {
          page: this.queryParam.page,
          size: this.queryParam.size,
          studentID: id
        }
      })
      this.gradeList = response.data.data
    },
    async getAllStudent () {
      const token = window.sessionStorage.getItem('token')
      const response = await axios.get('/student', {
        params: {
          page: this.queryParam.page,
          size: this.queryParam.size,
          token: token
        }
      })
      if (response.data.data) {
        response.data.data.forEach(student => {
          this.studentList.push(student.id)
        })
      }
    },
    async addGrade () {
      const token = window.sessionStorage.getItem('token')
      const gradeInfo = this.newGrade
      gradeInfo.studentID = this.sid
      const response = await axios.post('/student/addGrade', gradeInfo, {
        params: {
          token: token
        }
      })
      if (!response.data.success) {
        this.snackbar.value = true
        this.snackbar.text = '添加失败'
      } else {
        this.snackbar.value = true
        this.snackbar.text = '添加成功'
        this.$refs.addFormRef.reset()
        await this.getGrades(this.sid)
      }
    },
    async updateGrade () {
      const token = window.sessionStorage.getItem('token')
      const response = await axios.put('/student/grade/' + this.updateID, {
        grade: this.updatedGrade
      }, {
        params: {
          token: token
        }
      })
      if (!response.data.success) {
        this.snackbar.value = true
        this.snackbar.text = '更改失败'
      } else {
        this.snackbar.value = true
        this.snackbar.text = '更改成功'
        this.$refs.updateFormRef.reset()
        await this.getGrades(this.sid)
      }
    },
    async deleteGrade () {
      const token = window.sessionStorage.getItem('token')
      const response = await axios.delete('/student/grade/' + this.deleteID, {
        params: {
          token: token
        }
      })
      if (!response.data.success) {
        this.snackbar.value = true
        this.snackbar.text = '删除失败'
      } else {
        this.snackbar.value = true
        this.snackbar.text = '删除成功'
        this.$refs.deleteFormRef.reset()
        await this.getGrades(this.sid)
      }
    }
  }
}
</script>
