import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import Addresses from './components/Addresses';
import Appraisers from './components/Appraisers/Appraisers';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/counter' component={Counter} />
            <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
            <Route path='/address' component={Addresses} />
            <Route path='/appraisers' component={Appraisers} />
        </Switch>
    </Layout>
);
