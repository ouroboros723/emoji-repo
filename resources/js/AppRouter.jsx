// React Router Settings File

// Libraries
import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
// import ErrorBoundary from "../../ErrorBoundary";

// Page Parent Components
import Participant from "./Participant";
import Title from "./components/Title";


class AppRouter extends Component {
    componentDidMount() {
        document.title = '読込中...';
    }

    render() {
        return (
                <Router>
                    <Route exact path='/'>
                        <Title title={'参加者リスト'}><Participant /></Title>
                    </Route>
                </Router>
            );
    }
}

export default AppRouter;
