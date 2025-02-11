import { jsonDatabase } from "./jsonDatabase";

export class UserService {
    async addUsuario(usuario) {
        const data = await jsonDatabase.readData();
        data.usuarios.push(usuario);
        await jsonDatabase.writeData(data);
    }

    async updateUsuario(usuarioId, updatedData) {
        const data = await jsonDatabase.readData();
        const usuarioIndex = data.usuarios.findIndex(user => user.id === usuarioId);

        if (usuarioIndex !== -1) {
            data.usuarios[usuarioIndex] = { ...data.usuarios[usuarioIndex], ...updatedData };
            await jsonDatabase.writeData(data);
        } else {
            console.error('Usuario no encontrado');
        }
    }

    async deleteUsuario(usuarioId) {
        const data = await jsonDatabase.readData();
        const updatedUsuarios = data.usuarios.filter(user => user.id !== usuarioId);

        if (updatedUsuarios.length !== data.usuarios.length) {
            data.usuarios = updatedUsuarios;
            await jsonDatabase.writeData(data);
            console.log('Usuario eliminado');
        } else {
            console.error('Usuario no encontrado');
        }
    }

    async selectUsuarios(usuarioId = null) {
        const data = await jsonDatabase.readData();
        if (usuarioId) {
            const usuario = data.usuarios.find(user => user.id === usuarioId);
            return usuario || null;
        }
        return data.usuarios;
    }
}

export const userService = new UserService();