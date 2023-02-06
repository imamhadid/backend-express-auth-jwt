const { DataTypes } = require('sequelize')
const db =require("../database/mysql.js")


const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
            isEmail: { msg: "Email harus berbentuk email" },
            notNull: {
                msg: 'Role tidak boleh kosong'
            }
        },
        unique: true,
        allowNull: false,
    },
    photo: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    tokenFb: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Role tidak boleh kosong'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password tidak boleh kosong'
            }
        }
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Nama tidak boleh kosong'
            }
        }
    },
    numberPhone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Nomor tidak boleh kosong'
            }
        }
    }
}, {
    freezeTableName: true
});

module.exports = Users