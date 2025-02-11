<template>
    <Form @submit="saveFile" :validation-schema="schema" :initial-values="file" v-slot="{ errors }">


            <div class="mb-3">
                <label for="numExpediente">No. de Expediente</label>
                <Field as="input" name="numExpediente" id="numExpediente" class="form-control" :class="{ 'is-invalid': errors.numExpediente }" />
                <div class="invalid-feedback">{{ errors.numExpediente }}</div>
            </div>

            <div class="mb-3">
                <label for="seccion">Sección</label>
                <Field as="input" type="number" name="seccion" id="seccion" class="form-control" :class="{ 'is-invalid': errors.seccion }" />
                <div class="invalid-feedback">{{ errors.seccion }}</div>
            </div>

            <div class="mb-3">
                <label for="anaquel">Anaquel</label>
                <Field as="input" type="text" name="anaquel" id="anaquel" class="form-control" :class="{ 'is-invalid': errors.anaquel }" />
                <div class="invalid-feedback">{{ errors.anaquel }}</div>
            </div>

            <div class="mb-3">
                <label for="nivel">Nivel</label>
                <Field as="input" name="nivel" id="nivel" class="form-control" :class="{ 'is-invalid': errors.nivel }" />
                <div class="invalid-feedback">{{ errors.nivel }}</div>
            </div>

            <div class="mb-3">
                <label for="descripcion">Descripción</label>
                <Field as="textarea" name="descripcion" id="descripcion" class="form-control" :class="{ 'is-invalid': errors.descripcion }" />
                <div class="invalid-feedback">{{ errors.descripcion }}</div>
            </div>

            <div class="mb-3">
                <label for="ejecucionFiscal">Ejercicio Fiscal</label>
                <Field as="input" type="number" name="ejecucionFiscal" id="ejecucionFiscal" class="form-control" :class="{ 'is-invalid': errors.ejecucionFiscal }" />
                <div class="invalid-feedback">{{ errors.ejecucionFiscal }}</div>
            </div>

            <div class="mb-3">
                <label for="idCategoria">Categoría</label>
                <Field as="select" name="idCategoria" id="idCategoria" class="form-select" :class="{ 'is-invalid': errors.idCategoria }">
                    <option :value="0">--Seleccionar Categoría---</option>
                    <option v-for="categoria in categories" :key="categoria.id" :value="categoria.id">
                        {{ categoria.descripcion }}
                    </option>
                </Field>
                <div class="invalid-feedback">{{ errors.idCategoria }}</div>
            </div>

            <div class="d-flex justify-content-end">
                <RouterLink :to="{ name: 'principal' }" class="btn btn-secondary">Cancelar</RouterLink>
                <button type="submit" class="btn btn-success text-white ml-2">Guardar</button>
            </div>
    </Form>
</template>

<script setup>
import { onMounted } from 'vue';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { toRefs, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '../services/apiClient';
const props = defineProps(['categories', 'file']);
const { categories, file } = toRefs(props);
const route = useRoute();
const router = useRouter()
const toast = useToast();
const archivoId = route.params.id;

// Esquema de validación
const schema = Yup.object().shape({
    seccion: Yup.number().required('La sección es requerida').typeError('La sección debe ser un número'),
    anaquel: Yup.string().required('El anaquel es requerido').typeError('El anaquel es requerido'),
    nivel: Yup.string().required('El nivel es requerido').max(20, 'El nivel no debe exceder 20 caracteres'),
    descripcion: Yup.string().required('La descripción es requerida').max(500, 'La descripción no debe exceder 500 caracteres'),
    ejecucionFiscal: Yup.number().nullable().typeError('El ejercicio fiscal debe ser un número'),
    numExpediente: Yup.string().required('El número de expediente es requerido').max(20, 'Máximo 20 caracteres'),
    idCategoria: Yup.string().required('La categoría es requerida').typeError('La categoría es requerida')
});

// Guardar archivo
const saveFile = async (values) => {
    try {
        if (archivoId !='0') {
            await apiService.put(`archivos`, archivoId,values);
            toast.success('Archivo actualizado exitosamente!');
        } else {
            await apiService.post('archivos', values);
            toast.success('Archivo agregado exitosamente!');
        }
        router.push({ name: 'principal' });
    } catch (error) {
        console.error('Error al guardar el archivo:', error);
        toast.error('Error al guardar el archivo.');
    }
};

onMounted(async () => {
    // Opción de cargar datos del archivo si estás en modo de edición
});
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 8px;
}

h2 {
    color: #333;
}

.mb-3 {
    margin-bottom: 1rem;
}

.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    color: #dc3545;
}

.btn {
    transition: background-color 0.3s;
}
</style>
