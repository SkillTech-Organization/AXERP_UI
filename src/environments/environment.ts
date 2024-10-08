export const environment = {
    apiUrl: "https://axerpazurefunctiontest.azurewebsites.net/",
    msalConfig: {
        auth: {
            clientId: 'CLIENT_ID',
            authority: 'https://login.microsoftonline.com/DIRECTORY_ID',
        },
    },
    apiConfig: {
        scopes: [],
        uri: 'https://axerpazurefunctiontest.azurewebsites.net/',
    },
};