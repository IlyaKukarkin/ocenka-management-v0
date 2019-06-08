import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as AddressReducer from './AddressReducer';
import * as AppraiserReducer from './AppraiserReducer';
import * as UserReducer from './UserReducer';
import * as NeuralReducer from './NeuralReducer';
import * as LoginReducer from './LoginReducer';
import * as ClientReducer from './ClientReducer';
import * as FlatReducer from './FlatReducer';
import * as ContractReducer from './ContractReducer';
import * as SalaryReducer from './SalaryReducer';

export default function configureStore(history, initialState) {
    const reducers = {
        address: AddressReducer.reducer,
        appraisers: AppraiserReducer.reducer,
        users: UserReducer.reducer,
        neural: NeuralReducer.reducer,
        login: LoginReducer.reducer,
        clients: ClientReducer.reducer,
        flats: FlatReducer.reducer,
        contracts: ContractReducer.reducer,
        salary: SalaryReducer.reducer,
    };

    const middleware = [
        thunk,
        routerMiddleware(history)
    ];

    // In development, use the browser's Redux dev tools extension if installed
    const enhancers = [];
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
        enhancers.push(window.devToolsExtension());
    }

    const rootReducer = combineReducers({
        ...reducers,
        routing: routerReducer
    });

    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );
}
