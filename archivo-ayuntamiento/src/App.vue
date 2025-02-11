<template>
  <HeaderBar />
  <router-view></router-view>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue';
import { jsonDatabase } from './services/jsonDatabase';
import ArchivosView from './views/ArchivosView.vue';

export default {
  components: {
    HeaderBar,
    ArchivosView
  },
  methods: {
    async addUser() {
      const nuevoUsuario = {
        id: 1,
        nombre: "Juan",
        apellidos: "Pérez",
        email: "juan@example.com",
        password: "hashed_password"
      };

      try {
        await jsonDatabase.addUsuario(nuevoUsuario);
      } catch (error) {
      }
    }
  }
};
</script>
