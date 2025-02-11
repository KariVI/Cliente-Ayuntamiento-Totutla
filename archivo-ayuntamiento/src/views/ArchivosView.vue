<template >


  <div class="container">
    <div class="row p-2">
      <div class="d-flex justify-content-center align-items-center">
        <img src="../images/Logo.jpeg" alt="logo" class="logo" /> 
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <h3>Registro histórico de archivo municipal</h3>
      </div>
      <div class="d-flex justify-content-center">
      <RouterLink :to="{ name: 'agregar-editar-archivo', params: { id: '0' } }" class="btn btn-success mb-3">
        <i class="fa-solid fa-plus"></i>&nbsp;
        Agregar archivo
      </RouterLink>
    </div>

    </div>
    <div class="row">
      <div class="col-12">
        <v-card class="elevation-2">
  <template v-if="loading">
    <v-progress-linear indeterminate color="primary" class="mb-4"></v-progress-linear>
  </template>

  <template v-else>
    <v-data-table
      :headers="headers"
      :items="filterFiles"
      :sort-by="[{key:'ejecucionFiscal', order: 'desc'}]"
      class="custom-table"
    >
      <template v-slot:headers="{columns, isSorted, getSortIcon, toggleSort}">
        <template v-for="(column, index) in columns" :key="column.key">
          <td class="header-cell">
            <div class="d-flex align-center">
              <span
                class="cursor-pointer font-weight-medium"
                @click="() => toggleSort(column)"
              >
                {{ column.title }}
              </span>

              <div class="ml-2 d-flex align-center">
                <template v-if="isSorted(column)">
                  <v-icon
                    :icon="getSortIcon(column)"
                    size="small"
                    color="grey-lighten-1"
                  ></v-icon>
                </template>

                <template v-if="column.filterable">
                  <v-menu :key="column.key" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        v-bind="props"
                        class="secondary-color"
                      >
                        <v-icon size="small">mdi-filter-variant</v-icon>
                      </v-btn>
                    </template>

                    <v-card style="width: 300px">
                      <v-card-title class="text-subtitle-1 py-2 px-4 bg-grey-lighten-4">
                        <v-icon
                          icon="mdi-filter-variant"
                          class="mr-2"
                          size="small"
                        ></v-icon>
                        Seleccione los filtros
                      </v-card-title>

                      <v-card-text class="pa-4">
                        <v-list class="pa-0">
                          <v-list-item class="px-0">
                            <v-autocomplete
                              multiple
                              density="compact"
                              auto-select-first
                              clearable
                              chips
                              attach
                              class="filter-autocomplete"
                              variant="outlined"
                              bg-color="white"
                              color="primary"
                              :items="columnValueList(column.key)"
                              v-model="filters[column.key]"
                              :label="
                                filters[column.key]?.length
                                  ? `Filtrar por: ${column.title}`
                                  : 'Seleccionar valores'
                              "
                              hide-details
                            >
                              <template v-slot:selection="{ item, index }">
                                <v-chip
                                  size="small"
                                  variant="flat"
                                  color="primary"
                                  class="font-weight-medium"
                                  v-if="index < 5"
                                >
                                  <span>{{ item }}</span>
                                </v-chip>
                                <span
                                  v-if="index === 5"
                                  class="text-grey text-caption ml-2"
                                >
                                  (+{{ filters[column.key].length - 5 }} otros)
                                </span>
                              </template>
                            </v-autocomplete>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </div>
            </div>
          </td>
        </template>
      </template>

      <template v-slot:item.idCategoria="{ item }">
        <td>
          {{ getCategoryName(item.idCategoria) }}
        </td>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center justify-center gap-2">
          <v-tooltip text="Editar archivo" location="top">
            <template v-slot:activator="{ props }">
              <RouterLink
                :to="{ name: 'agregar-editar-archivo', params: { id: item.id } }"
                v-bind="props"
                style="display: inline-flex; text-decoration: none;"
              >
                <v-btn icon size="small" variant="text" color="warning">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </RouterLink>
            </template>
          </v-tooltip>

          <v-tooltip text="Eliminar archivo" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                size="small"
                variant="text"
                color="error"
                v-bind="props"
                @click="openDeleteDialog(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="d-flex align-center justify-center pa-4">
          <v-icon
            icon="mdi-alert-circle-outline"
            class="mr-2"
            color="grey-darken-1"
          ></v-icon>
          <span class="text-grey-darken-1">No hay archivos para mostrar</span>
        </div>
      </template>
    </v-data-table>
  </template>
</v-card>

      
      </div>
    </div>



 <div
      class="modal fade"
      :class="{ show: showDeleteDialog }"
      tabindex="-1"
      :style="{ display: showDeleteDialog ? 'block' : 'none' }"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar eliminación</h5>
            <button
              type="button"
              class="btn btn-close text-white"
              @click="closeDeleteDialog"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea eliminar este archivo?</p>
            <p class="text-muted" v-if="fileToDelete">
              Expediente: {{ fileToDelete.numExpediente }}
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary text-white"
              @click="closeDeleteDialog"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger text-white"
              @click="confirmDelete"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Overlay para el fondo oscuro cuando el modal está activo -->
    <div 
      class="modal-backdrop fade" 
      :class="{ show: showDeleteDialog }"
      v-if="showDeleteDialog"
    ></div>
  </div>
  
 
 

</template>

<script setup lang="js">
import { onMounted, ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from '../services/apiClient';

const loading = ref(true);
const files = ref([]);
const categories = ref([]);
const filters = ref({
  seccion: [],
  anaquel: [],
  nivel: [],
  descripcion: [],
  ejecucionFiscal: [],
  numExpediente: [],
  idCategoria: []
});

//ESTRUCTURA DE LA TABLA 

const headers = ref([
  { title: 'No. de Expediente', key: 'numExpediente', value: 'numExpediente', sortable: true, filterable: true },
  { title: 'Sección', key: 'seccion', value: 'seccion', sortable: true, filterable: true },
  { title: 'Anaquel', key: 'anaquel', value: 'anaquel', sortable: true, filterable: true },
  { title: 'Nivel', key: 'nivel', value: 'nivel', sortable: true, filterable: true },
  { title: 'Descripción', key: 'descripcion', value: 'descripcion', sortable: true,   filterable: true },
  { title: 'Ejercicio Fiscal', key: 'ejecucionFiscal', value: 'ejecucionFiscal', sortable: true, filterable: true },
  { title: 'Área responsable', key: 'idCategoria', value: 'descripcion', sortable: true, filterable: true },
  { title: 'Acciones', key: 'actions', value: 'actions', sortable: false, filterable: false }
]);

const filterFiles = computed(() => {
  return files.value.filter((file) => {
    return Object.keys(filters.value).every((filterKey) => {
      return filters.value[filterKey].length < 1 || filters.value[filterKey].includes(file[filterKey]);
    });
  });
});

const columnValueList = (column) => {
  if(column === 'idCategoria') {
    return categories.value.map((category) => category.descripcion);
  }
  return [...new Set(files.value.map((file) => file[column]))];
};

const fetchFiles = async () => {
  try {
    files.value = (await apiService.get('archivos')).data;
  } catch (error) {
    console.error('Error al obtener archivos:', error);
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    categories.value = (await apiService.get('categorias')).data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
  }
};


const showDeleteDialog = ref(false);
const fileToDelete = ref(null);

const openDeleteDialog = (file) => {
  fileToDelete.value = file;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  fileToDelete.value = null;
};

const confirmDelete = async () => {
  if (fileToDelete.value) {
    await deleteFile(fileToDelete.value.id);
    closeDeleteDialog();
  }
};

const deleteFile = async (fileId) => {
  await apiService.delete('archivos', fileId);
  files.value = files.value.filter(file => file.id !== fileId);
};



const activeFilters = ref({});

const toggleFilter = (key) => {
  activeFilters.value[key] = !activeFilters.value[key];
};

const isFilterActive = (key) => {
  return !!activeFilters.value[key];
};

const getCategoryName =  (id) => {
  return categories.value.find(category => category.id === id)?.descripcion || 'Sin categoría';
};



onMounted(async () => {

  await fetchFiles();
  await fetchCategories();
});


</script>



<style scoped>
i {
  font-size: 1.2rem;
}

.secondary-color {
  color: #A4343A;
}

.filter-autocomplete :deep(.v-field__input) {
  padding-top: 5px;
}

.filter-autocomplete :deep(.v-select__selection) {
  margin-top: 2px;
}

.filter-autocomplete :deep(.v-chip) {
  margin-top: 2px;
  margin-bottom: 2px;
}

.custom-table {
  /* Estilo para la tabla */
  --v-table-header-height: 48px;
}

.custom-table :deep(.v-data-table-header) {
  background-color: rgb(250, 250, 250);
}

.custom-table :deep(.v-data-table-header th) {
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  white-space: nowrap;
}



.header-cell {
  padding: 0 16px;
  height: var(--v-table-header-height);
  background-color: rgb(250, 250, 250);
}

.filter-autocomplete :deep(.v-field__input) {
  padding-top: 5px;
}

.filter-autocomplete :deep(.v-select__selection) {
  margin-top: 2px;
}

.filter-autocomplete :deep(.v-chip) {
  margin-top: 2px;
  margin-bottom: 2px;
}
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal.show {
  display: block;
}

.modal-backdrop.show {
  opacity: 0.5;
}

.logo {
  width: 200px; 
  height: auto; 

}


</style>
