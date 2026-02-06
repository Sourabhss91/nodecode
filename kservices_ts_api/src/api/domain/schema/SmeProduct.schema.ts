import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db'

export const SME_PRODUCT = sequelize.define('sme_product_list', {
    product_name: DataTypes.STRING,
    sme_id: DataTypes.INTEGER,
    status:DataTypes.TINYINT,
    date_time:{ 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
   },
});