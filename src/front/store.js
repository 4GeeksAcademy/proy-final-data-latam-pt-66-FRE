export const initialStore = () => {
    return {
        token: localStorage.getItem("token") || null,
        user: null, // Aquí guardaremos los datos de Raymon
        message: null
    }
}

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'login':
            return {
                ...store,
                token: action.payload.token,
                user: action.payload.user
            };
        case 'logout':
            localStorage.removeItem("token");
            return {
                ...store,
                token: null,
                user: null
            };
        case 'set_message':
            return {
                ...store,
                message: action.payload
            };
        default:
            return store;
    }
}