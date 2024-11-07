import {DataTypes} from 'sequelize'
import db from '../config/db.js'

const user = db.define ('users', {
    nombre: {
        type: DataTypes.STRING,
        allouwNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    token: DataTypes.STRING,
    confirm: DataTypes.BOOLEAN

}) 

export default user;