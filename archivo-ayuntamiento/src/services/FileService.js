import {jsonDatabase} from './jsonDatabase';

export default class FileService {
    static async addNewFile(file) {
        const data = await jsonDatabase.readData();
        data.archivos.push(file);
        await jsonDatabase.writeData(data);
    }

    static async updateFile(fileId, updatedData) {
        const data = await jsonDatabase.readData();
        const fileIndex = data.archivos.findIndex(file => file.id == fileId);

        if (fileIndex !== -1) {

            data.archivos[fileIndex] = { ...data.archivos[fileIndex], ...updatedData };
            await jsonDatabase.writeData(data);
        } else {
            console.error('Archivo no encontrado');
        }
    }

    static async deleteFile(fileId) {
        const data = await jsonDatabase.readData();
        const updatedFiles = data.archivos.filter(file => file.id !== fileId);

        if (updatedFiles.length !== data.archivos.length) {
            data.archivos = updatedFiles;
            await jsonDatabase.writeData(data);
        } else {
        }
    }

    static async selectFiles(fileId = null) {
        const data = await jsonDatabase.readData();
        if (fileId) {
            const file = data.archivos.find(file => file.id === fileId);
            return file || null;
        }
        console.log(data.archivos);
        return data.archivos;
    }

    static async getFile(fileId) {
        const data = await jsonDatabase.readData();
        const file = data.archivos.find(file => file.id == fileId);
        return file || null;
    }

    

}