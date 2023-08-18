// React Router Settings File

// Libraries
import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
// import ErrorBoundary from "../../ErrorBoundary";

// Page Parent Components
import Title from "./components/Title";
import Admin from "./Admin";


class AppRouter extends Component {
    componentDidMount() {
        document.title = '読込中...';
    }

    render() {
        return (
                <Router>
                    <Route exact path='/'>
                        <Title title={'参加者リスト'}><Admin /></Title>
                    </Route>
                </Router>
            );
    }
}

export default AppRouter;
