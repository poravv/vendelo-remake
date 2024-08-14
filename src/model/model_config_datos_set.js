const{DataTypes}=require("sequelize")
const sequelize=require("../database")

const config_datos_set=sequelize.define("config_datos_set",{
    idconfig_datos_set:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
    razon_social:{type:DataTypes.STRING,allowNull:false},
    ruc:{type:DataTypes.STRING,allowNull:true},
    telefono:{type:DataTypes.STRING},
    direccion:{type:DataTypes.STRING},
    correo:{type:DataTypes.STRING},
    timbrado:{type:DataTypes.STRING},
    nro_factura_desde:{type:DataTypes.INTEGER},
    nro_factura_hasta:{type:DataTypes.INTEGER,},
    nro_factura_usado:{type:DataTypes.INTEGER,},
    idusuario_upd:{type:DataTypes.INTEGER},
    fecha_desde:{type:DataTypes.DATE},
    fecha_hasta:{type:DataTypes.DATE},
    fecha_insert:{type:DataTypes.DATE},
    fecha_upd:{type:DataTypes.DATE},
    estado:{type:DataTypes.STRING},
    idsucursal:{type:DataTypes.INTEGER},
},{
    tableName:"config_datos_set",
    timestamps:false
})

module.exports=config_datos_set