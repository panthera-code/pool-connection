const Pool = require('./Pool')

class Connection {

    constructor(database) {
        this.mysql = null
        this.#connect(database)
    }

    async #connect(database) {

        const pool = Pool.connect()
        if (!pool) throw new Error('Le pool MySQL n\'a pas été initialisé')

        try {
            this.mysql = await pool.getConnection()
            if (typeof database === 'string' && database.trim()) await this.mysql.changeUser({ database })
        } catch (error) {
            console.error('Erreur lors connexion MySQL :', error.message)
            throw new Error(`Echec de la connection MySQL : ${error.message}`)
        }

    }

    async query({querySQL, values = []}) {

        if (!querySQL.trim() || !Array.isArray(values)) {
            throw new Error('Erreur dans la configuration de la requête SQL')
        }

        try {
            return await this.mysql.query(querySQL, values)
        } catch (error) {
            console.error('Erreur lors de la requête SQL :', error.message)
            throw new Error(`Echec de la requête SQL : ${error.message}`)
        } finally {
            if (this.mysql && typeof this.mysql.release === 'function') this.mysql.release()
        }

    }

    async transaction(queries = []) {

        if (!Array.isArray(queries) || queries.length === 0) {
            throw new Error('Erreur dans la configuration des requêtes SQL')
        }

        try {
            
            const results = []
            await this.mysql.beginTransaction()

            for (const { querySQL, values = []} of queries) {
                if (!querySQL.trim() || !Array.isArray(values)) {
                    throw new Error('Erreur dans la configuration de la requête SQL')
                }
                const result = await this.mysql.query(querySQL, values)
                results.push(result)
            }

            await this.mysql.commit()
            return results

        } catch (error) {
            await this.mysql.rollback()
            console.error('Erreur lors de la transaction des requêtes SQL :', error.message)
            throw new Error(`Echec de la transaction des requêtes SQL : ${error.message}`)
        } finally {
            if (this.mysql && typeof this.mysql.release === 'function') this.mysql.release()
        }

    }

}

module.exports = Connection