const loginStart = 'LOGIN_START';
const loginFinish = 'LOGIN_FINISH';
const logout = 'LOGOUT';
const errorClose = 'ERROR_CLOSE';
const initialState = { role: 0, error: true, name: "" };

export const actionCreators = {
    Login: (data) => async (dispatch) => {
        dispatch({ type: loginStart });

        const url = `api/Login`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (res) {                
                dispatch({ type: loginFinish, res });
                return res;
            });
    },
    Logout: () => async (dispatch) => {
        dispatch({ type: logout });
    },
    ErrorClose: () => async (dispatch) => {
        dispatch({ type: errorClose });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === loginStart) {
        return {
            ...state,
            error: true
        };
    }

    if (action.type === loginFinish) {
        let err = true;
        if (action.res.role === 0) {
            err = false;
        }

        return {
            ...state,
            role: action.res.role,
            error: err,
            name: action.res.name
        };
    }

    if (action.type === logout) {
        return {
            ...state,
            role: 0,
            name: ""
        };
    }

    if (action.type === errorClose) {
        return {
            ...state,
            error: true
        };
    }

    return state;
};
