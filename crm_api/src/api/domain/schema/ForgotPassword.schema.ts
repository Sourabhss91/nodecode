import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db'

export const FORGOT_PASSWORD = sequelize.define('forget_password', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    sme_id: DataTypes.STRING,
    status: DataTypes.INTEGER,
    token:DataTypes.STRING,
    insertion_date:{ 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    updation_date:{ 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
});