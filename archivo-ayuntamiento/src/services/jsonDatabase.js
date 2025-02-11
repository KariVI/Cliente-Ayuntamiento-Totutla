export class JsonDatabaseService {
    constructor() {
        this.directoryPath = null; 
        this.filePath = null; 
        this.init();
    }

    async init() {

        try {
            console.log('ℹ️ Inicializando base de datos JSON');
            this.directoryPath = this.directoryPath = './resources/data';
            this.filePath = this.directoryPath + '/data.json'; // Ruta del archivo JSON

            try {
                await Neutralino.filesystem.readDirectory(this.directoryPath);
                console.log('📂 Directorio encontrado:', this.directoryPath);
            } catch (dirError) {
                if (dirError.code === 'NE_FS_DIRNF') { // Directorio no encontrado
                    await Neutralino.filesystem.createDirectory(this.directoryPath);
                } else {
                    throw dirError; 
                }
            }

            try {
                await Neutralino.filesystem.readFile(this.filePath);
            } catch (fileError) {
                if (fileError.code === 'NE_FS_FILNF') { 
                    await Neutralino.filesystem.writeFile(this.filePath, '{}'); 
                    console.log('📄 Archivo data.json creado:', this.filePath);
                } else {
                    throw fileError; 
                }
            }

        } catch (error) {
            throw error; 
        }
    }

    async readData() {
        if (!this.filePath) throw new Error('filePath no está definido');
        const data = await Neutralino.filesystem.readFile(this.filePath);
        return JSON.parse(data);
    }
    

    async writeData(data) {
        console.log(data);
        console.log(this.filePath);
        await Neutralino.filesystem.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async addUsuario(usuario) {
        const data = await this.readData();
        data.usuarios.push(usuario);
        await this.writeData(data);
    }
}

export const jsonDatabase = new JsonDatabaseService();