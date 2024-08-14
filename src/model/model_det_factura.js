const{DataTypes}=require("sequelize")
const sequelize=require("../database")

const det_factura=sequelize.define("det_factura",{
    iddet_factura:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
    producto:{type:DataTypes.STRING},
    cantidad:{type:DataTypes.STRING},
    precio:{type:DataTypes.DECIMAL(13.2)},
    tipo_iva:{type:DataTypes.INTEGER},
    monto_iva:{type:DataTypes.DECIMAL(13.2)},
    subtotal:{type:DataTypes.DECIMAL(13.2)},
    idfactura_cab:{type:DataTypes.INTEGER},
},{
    tableName:"det_factura",
    timestamps:false
})

module.exports=det_factura