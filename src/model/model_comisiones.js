const{DataTypes}=require("sequelize")
const database=require("../database");
const usuario = require("./model_usuario");

const comisiones = database.define("comisiones",{
    
    idventa:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    idusuario:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true,
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    tableName:"Comisiones",
    timestamps:false
});

comisiones.hasOne(usuario,{
    foreignKey:"idusuario",
    primaryKey:"idusuario",
    sourceKey:"idusuario"
})

module.exports=comisiones
