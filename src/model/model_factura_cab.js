const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const det_factura = require("./model_det_factura")

const factura_cab=sequelize.define("factura_cab",{
    idfactura_cab:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
    nro_factura:{type:DataTypes.STRING},
    estado:{type:DataTypes.STRING},
    idconfig_datos_set:{type:DataTypes.STRING},
    idventa:{type:DataTypes.STRING},
    fecha:{type:DataTypes.DATE},
    timbrado:{type:DataTypes.INTEGER},
    nro_caja:{type:DataTypes.INTEGER},
    total5:{type:DataTypes.DECIMAL(13.2)},
    total10:{type:DataTypes.DECIMAL(13.2)},
    idsucursal:{type:DataTypes.INTEGER},
    tipo_venta:{type:DataTypes.STRING},
},{
    tableName:"factura_cab",
    timestamps:false
})

factura_cab.hasMany(det_factura,{
    foreignKey:"idfactura_cab",
    sourceKey:"idfactura_cab",
    primaryKey:"idfactura_cab",
})

module.exports=factura_cab