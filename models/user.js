import {DataTypes} from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const  User = db.define('users', {
    name: {
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
    birthDate: { 
        type: DataTypes.DATE,
        allowNull: true, 
    },

    token: DataTypes.STRING,
    confirm: DataTypes.BOOLEAN

},{
    hooks: {
        beforeCreate: async function (user) {
            const salt = await  bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
}) 

export default User;