const getSettingsStart = 'GET_SETTINGS_START';
const getSettingsFinish = 'GET_SETTINGS_FINISH';
const calculateStart = 'CALCULATE_START';
const calculateFinish = 'CALCULATE_FINISH';
const initialState = { settings: [], price: 0, isLoading: false };

export const actionCreators = {
    GetSettings: () => async (dispatch) => {
        dispatch({ type: getSettingsStart });

        const url = `api/NeuralSettingsSets`;
        const response = await fetch(url);
        const settings = await response.json();

        dispatch({ type: getSettingsFinish, settings });
    },
    Calculate: (data) => async (dispatch) => {
        dispatch({ type: calculateStart });

        const url = `api/Neural`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'post', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                return response.json();
            }).then(function (price) {
                dispatch({ type: calculateFinish, price });
            });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === getSettingsStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === getSettingsFinish) {
        return {
            ...state,
            settings: action.settings,
            isLoading: false
        };
    }

    if (action.type === calculateStart) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === calculateFinish) {
        return {
            ...state,
            price: action.price,
            isLoading: false
        };
    }

    return state;
};
