
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const kcConfig = {
    clientId: "client-academic",
    bearerOnly:true,
    serverUrl:"https://kc.mindtechpy.net",
    realm:"Academic",
    realmPublicKey:"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxULYZ/8/bTWX+abnOmx562w6B8wYZPUXDewMch2AUoJ52D39cRHuY+XU/xo+qRourtFqO+zUYOUqLFfSgqSiHeih35kbHjaVENibhQYpJYpwRV2EmjtjFwUDl1HuoWevc/r6NNhXkZCcf9PBAOWv+O/KHpzhvhRPL1LBd7jnF1las6PJ7cuSV+n7BRKdvw5LKg1dsBibW+QuLqH94rBAEjexx9wQqovN/SQWqsitobr1fU0sgRm4drpVVNOGzP3/KMLYjFXeKt63sslKGWz5ODWsHzpLk1+gREBEk+ZgImHoMQib0dIH3lJTcUuG/Hf/lNmvpvbCNMhHwys9jGbPiwIDAQAB",
    issuer: 'https://kc.mindtechpy.net/realms/Academic',
    tokenEndpoint: 'https://kc.mindtechpy.net/realms/Academic/protocol/openid-connect/token',
    responseType: 'code',
    scope: 'openid profile',
    showDebugInformation: true,
    //clave: 'FjE6UUh6Njj7ALmBpEeJbUPwY1bKCtCF',
}



// Configuración de la sesión para Keycloak
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore },kcConfig);

module.exports = {
    session: session({
        secret: 'mySecret',
        resave: false,
        saveUninitialized: false,
        store: memoryStore
    }),
    keycloak
}