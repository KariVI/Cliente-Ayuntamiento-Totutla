<template>
    <div class="container bg-white elevation-2 p-4 rounded mt-5">
        <h2 class="text-center mb-4">
            {{ archivoId == '0' ? 'Agregar Archivo' : 'Editar Archivo' }}
        </h2>
        <ArchivoFormulario v-if="file && categories" :categories="categories" :file="file" />
    </div>
</template>

<script setup >
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import FileService from '../services/FileService';
import ArchivoFormulario from '../components/ArchivoFormulario.vue';
import apiService from '../services/apiClient';


const route = useRoute();


const archivoId = route.params.id ;
let file = ref(undefined);

let categories = ref([]);

const startFile = () => ({
    seccion: 1,
    anaquel: 1,
    nivel: '',
    descripcion: '',
    ejecucionFiscal: new Date().getFullYear(),
    numExpediente: '',
    idCategoria: 1
});

onMounted(async () => {
    try {
        
        categories.value = (await apiService.get('categorias')).data;
        if (archivoId != '0') {
            await apiService.get(`archivos/${archivoId}`).then(response => {
                file.value = response.data;
            });
        } else {
            file.value = startFile();
        }
    } catch (error) {
        
    }


});

</script>

<style scoped>

</style>