import knex from "knex";
import path from "path";

const connection = knex({
    client: 'sqlite3',
    connection: {
        // Dirname retorna o diretório do arquivo que está o chamando
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
})

export default connection