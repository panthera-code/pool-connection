require('dotenv').config()
const mysql = require('mysql2/promise')

class Pool {

    static #connection = null

    static connect() {
        if (!Pool.#connection) {
            const options = this.#optionsSQL()
            Pool.#connection = mysql.createPool({...options, multipleStatements: true})
        }
        return Pool.#connection
    }

    static #optionsSQL() {

        const required = {host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT, 10), user: process.env.DB_USER, password: process.env.DB_PASSWORD}

        const missing = Object.entries(required)
            .filter(([key, value]) => !value.trim() || (key === 'port' && (isNaN(value) || value < 1024 || value > 49151)))
            .map(([key]) => key)
    
        if (missing.length) throw new Error(`${missing.length > 1 ? 'Les variables' : 'La variable'} d'environnement MySQL "${missing.join('", "')}" ${missing.length > 1 ? 'sont manquantes' : 'est manquante'}`)
    
        return required
    
    }

    static end() {
        if (Pool.#connection) {
            Pool.#connection.end()
            Pool.#connection = null
        }
    }

}

module.exports = Pool