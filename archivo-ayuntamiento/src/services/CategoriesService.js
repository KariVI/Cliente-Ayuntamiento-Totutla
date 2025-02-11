
import { jsonDatabase } from './jsonDatabase.js';

export class CategoriesService {
    async addCategory(category) {
        const data = await jsonDatabase.readData();
        data.categorias.push(category);
        await jsonDatabase.writeData(data);
    }

    async updateCategory(categoryId, updatedData) {
        const data = await jsonDatabase.readData();
        const categoryIndex = data.categorias.findIndex(category => category.id === categoryId);

        if (categoryIndex !== -1) {
            data.categorias[categoryIndex] = { ...data.categorias[categoryIndex], ...updatedData };
            await jsonDatabase.writeData(data);
        } else {
            console.error('Categoría no encontrada');
        }
    }

    async deleteCategory(categoryId) {
        const data = await jsonDatabase.readData();
        const updatedCategories = data.categorias.filter(category => category.id !== categoryId);

        if (updatedCategories.length !== data.categorias.length) {
            data.categorias = updatedCategories;
            await jsonDatabase.writeData(data);
        } else {
            console.error('Categoría no encontrada');
        }
    }

   static async selectCategories(categoryId = null) {
        const data = await jsonDatabase.readData();
        if (categoryId) {
            const category = data.categorias.find(category => category.id == categoryId);
            return category || null;
        }
        return data.categorias;
    }

    static async getDescriptionCategory(categoryId)  {
        const category = await this.selectCategories(categoryId);
        return category ? category.descripcion : '';
    }

}


