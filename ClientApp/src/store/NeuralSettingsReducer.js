const getSettingsStart = 'GET_SETTINGS_2_START';
const getSettingsFinish = 'GET_SETTINGS_2_FINISH';
const saveStart = 'SAVE_START';
const saveFinish = 'SAVE_FINISH';
const saveClose = 'SAVE_CLOSE';
const initialState = { settings: [], isLoading: false, saved: false };

export const actionCreators = {
    GetSettings: () => async (dispatch) => {
        dispatch({ type: getSettingsStart });

        const url = `api/NeuralSettingsSets`;
        const response = await fetch(url);
        const settings = await response.json();

        dispatch({ type: getSettingsFinish, settings });
    },
    SaveSettings: (data) => async (dispatch) => {
        dispatch({ type: saveStart });

        const url = `api/NeuralSettingsSets/${1}`;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(url, { method: 'put', body: JSON.stringify(data), headers: myHeaders })
            .then(function (response) {
                dispatch({ type: saveFinish });
            });
    },
    SaveClose: () => async (dispatch) => {
        dispatch({ type: saveClose });
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

    if (action.type === saveStart) {
        return {
            ...state,
            saved: false
        };
    }

    if (action.type === saveFinish) {
        return {
            ...state,
            saved: true
        };
    }

    if (action.type === saveClose) {
        return {
            ...state,
            saved: false
        };
    }

    return state;
};
