const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const venta =require("./model_venta")

const pago=sequelize.define("pago",{
    idpago:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    vencimiento:{
        type:DataTypes.DATE,
        //allowNull:false
    },
    fecha_pago:{
        type:DataTypes.DATE,
        //allowNull:false
    },
    monto_pago:{
        type:DataTypes.DECIMAL(13.2),
        //allowNull:false
    },
    pagado:{
        type:DataTypes.DECIMAL(13.2),
        //allowNull:false
    },
    idventa:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    cuota:{
        type:DataTypes.INTEGER,
        //allowNull:false
    },
    monto_mora:{
        type:DataTypes.DECIMAL(13.2),
        //allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        //allowNull:false
    },
    idusuario_upd:{
        type:DataTypes.STRING,
        //allowNull:false
    },
},{
    tableName:"Pago",
    timestamps:false
})

/*
pago.hasMany(venta,{
    foreignKey:"idventa",
    sourceKey:"idventa",
    primaryKey:"idventa"
})
*/

module.exports=pago