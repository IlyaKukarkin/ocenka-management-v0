import React from 'react';
import { connect } from 'react-redux';
import HomeText from './Home/HomeText';

const Home = props => (
    <div>
        <HomeText />
    </div>
);

export default connect()(Home);
