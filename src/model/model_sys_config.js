const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const venta =require("./model_venta")

const sys_config=sequelize.define("sys_config",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    descripcion:{
        type:DataTypes.STRING,
        //allowNull:false
    },
    valor:{
        type:DataTypes.STRING,
        //allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        //allowNull:false
    }
},{
    tableName:"Sys_config",
    timestamps:false
})

module.exports=sys_config