import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Addresses from './components/Addresses';
import Appraisers from './components/Appraisers/Appraisers';
import Users from './components/Users/Users';
import Neural from './components/Neural/Neural';
import Clients from './components/Clients/Clients';
import Flats from './components/Flats/Flats';
import Contracts from './components/Contracts/Contracts';
import Salary from './components/Salary/Salary';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/users' component={Users} />
            <Route path='/address' component={Addresses} />
            <Route path='/appraisers' component={Appraisers} />
            <Route path='/neural' component={Neural} />
            <Route path='/clients' component={Clients} />
            <Route path='/flats' component={Flats} />
            <Route path='/contracts' component={Contracts} />
            <Route path='/salary' component={Salary} />
        </Switch>
    </Layout>
);
