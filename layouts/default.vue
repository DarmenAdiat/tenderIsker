<template>
  <v-app>
    <Navbar />
    <v-main class='ma-4'>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";


export default {
  components: { Navbar, Footer },
}
</script>
