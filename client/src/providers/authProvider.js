import inMemoryJWTManager from '../inMemoryJWTManager';

const authProvider = {
    login: ({ email, password }) => {
        const request = new Request('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: new Headers({ 'Content-Type': 'application/json' })
        });
        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ accessToken, tokenExpiry }) => {
                inMemoryJWTManager.setToken(accessToken, tokenExpiry)
            });
    },
    logout: () => {
        inMemoryJWTManager.ereaseToken();
        return Promise.resolve();
    },

    checkAuth: () => {
        return inMemoryJWTManager.getToken();
    },

    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            inMemoryJWTManager.ereaseToken();
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: () => {
        return inMemoryJWTManager.getToken() ? Promise.resolve() : Promise.reject();
    },

    refresh: () => {
        const request = new Request('/api/auth/refresh-token', {
            method: 'POST',
            body: JSON.stringify({  }),
            headers: new Headers({ 'Content-Type': 'application/json' })
        });
        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((response) => {
               console.log(response);
            });
    },
};

export default authProvider;