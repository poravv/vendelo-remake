
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const kcConfig = {
    clientId: "client-vendelo",
    bearerOnly:true,
    serverUrl:"https://kc.mindtechpy.net",
    realm:"realm_vendelo",
    realmPublicKey:"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9GWK7ub+V966BBZPesXuD/CHLtCVGuDmrxHeOv/mIK7hl/nZ5hVbN4KzdTp8jy/pnfdEVM5pgv3WXKLawNZgSaIbRFO4MQ88IEudON7igm+fZQoCJRyGBq+Qa3uNtvvhvtNg48fEgteQMnv7m0gEv1HZDETli4pvmRaOw4ONx87RlvDo9LGwKqKDOZdxQllGi0+m5t8hMjehFNOhNH6UiqTfNzjOO7GSXFdeoZB6pR2H0bAYdjf1KvFPLHOPjwTG8kXX/283HcgIEjRBy643INTnB31zaXRzxaG3Q2Ib0FMrNH5h9vT0XFZ3To5idhtWv26ZJcbIj3xmdeE7fXU9HQIDAQAB",
    issuer: 'https://kc.mindtechpy.net/realms/realm_vendelo',
    tokenEndpoint: 'https://kc.mindtechpy.net/realms/realm_vendelo/protocol/openid-connect/token',
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
        secret: 'mySecretVendelo',
        resave: false,
        saveUninitialized: false,
        store: memoryStore
    }),
    keycloak
}