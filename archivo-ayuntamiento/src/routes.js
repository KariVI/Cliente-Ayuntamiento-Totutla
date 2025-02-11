import {createRouter, createWebHashHistory} from 'vue-router';
import ArchivosView from './views/ArchivosView.vue';
import ArchivoView from './views/ArchivoView.vue';
const routes = [
    {path: '/', name: 'principal', component: ArchivosView},
    {path: '/agregar-editar-archivo/:id', name: 'agregar-editar-archivo', component: ArchivoView, props: true,
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });
  
  export default router;