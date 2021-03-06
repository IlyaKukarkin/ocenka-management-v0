﻿import React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Addresses from './components/Addresses';
import Appraisers from './components/Appraisers/Appraisers';
import Users from './components/Users/Users';
import Neural from './components/Neural/Neural';
import NeuralSettings from './components/NeuralSettings/NeuralSettings';
import Clients from './components/Clients/Clients';
import Entities from './components/Entities/Entities';
import Flats from './components/Flats/Flats';
import Contracts from './components/Contracts/Contracts';
import Salary from './components/Salary/Salary';
import SalarySettings from './components/SalarySettings/SalarySettings';
import Parcels from './components/Parcels/Parcels';
import Cars from './components/Cars/Cars';

export default () => (
    <Layout>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/users' component={Users} />
            <Route path='/address' component={Addresses} />
            <Route path='/appraisers' component={Appraisers} />
            <Route path='/neural' component={Neural} />
            <Route path='/neuralSettings' component={NeuralSettings} />
            <Route path='/clients' component={Clients} />
            <Route path='/entities' component={Entities} />
            <Route path='/flats' component={Flats} />
            <Route path='/contracts' component={Contracts} />
            <Route path='/salary' component={Salary} />
            <Route path='/salarySettings' component={SalarySettings} />
            <Route path='/parcels' component={Parcels} />
            <Route path='/cars' component={Cars} />
        </Switch>
    </Layout>
);
