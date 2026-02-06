import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db'

export const ADDRESS_BOOK = sequelize.define('address_book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sme_id: DataTypes.INTEGER,
    customer_name:DataTypes.STRING,
    customer_number_primary:DataTypes.STRING,
    status:DataTypes.INTEGER,
    mode:DataTypes.INTEGER,
    customer_number_secondary:DataTypes.STRING,
    company_name:DataTypes.STRING,
    email_id:DataTypes.STRING,
    created_by:DataTypes.INTEGER,
    visibility_flag:DataTypes.INTEGER,
    is_updated:DataTypes.INTEGER,
    insert_date_time:{ 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    updated_date_time:DataTypes.DATE,
});