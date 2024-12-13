<template>
  <v-app app>
    <v-col cols="12">
      <v-row rows="1">
        <TopBar></TopBar>
      </v-row>
     <v-row rows="8">
       <v-col cols="2" style="background-color:#dddddd; min-height: 800px">
         <SideBar></SideBar>
       </v-col>
       <v-col>
         <router-view></router-view>
       </v-col>
      </v-row>
      <v-row rows="2">
       <Footer></Footer>
      </v-row>
    </v-col>
  </v-app>
</template>

<script>
import TopBar from '../components/TopBar.vue'
import Footer from '../components/FootBar.vue'
import SideBar from '@/components/SideBar.vue'
export default {
  components: { SideBar, TopBar, Footer }
}
</script>

<style>
body{
  margin:0;
  padding:0;
}
</style>
