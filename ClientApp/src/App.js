import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import Addresses from './components/Addresses';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/counter' component={Counter} />
            <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
            <Route path='/address' component={Addresses} />
        </Switch>
    </Layout>
);
