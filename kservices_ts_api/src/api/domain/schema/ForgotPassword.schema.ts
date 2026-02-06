import { STRING } from 'sequelize';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db'

export const FORGOT_PASSWORD = sequelize.define('forget_password', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    sme_id: DataTypes.STRING,
    status: DataTypes.INTEGER,
    otp: DataTypes.INTEGER,
    token:DataTypes.STRING,
    insertion_date:DataTypes.STRING,
    updation_date:DataTypes.STRING
});