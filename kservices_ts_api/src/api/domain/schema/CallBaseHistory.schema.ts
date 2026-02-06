import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db'

export const CALL_BASE_HISTORY = sequelize.define('call_base_history', {
    history_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    sme_id: DataTypes.INTEGER,
    data:DataTypes.STRING,
    insert_time:{ 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
   },
});