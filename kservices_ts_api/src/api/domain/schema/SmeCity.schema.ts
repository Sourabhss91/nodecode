import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db'

export const SME_CITY = sequelize.define('sme_cities_list', {
    city_id: DataTypes.INTEGER,
    sme_id: DataTypes.INTEGER,
    status:DataTypes.TINYINT,
    date_time:{ 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
   },
});