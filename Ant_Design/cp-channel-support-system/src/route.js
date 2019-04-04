import React, { Component } from 'react'
import { HashRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import App from './App';
import Login from './pages/login/index';
import Home from './pages/home/home';
import CpChannelBind from './pages/cpchannelbind/index';
import CpManage from './pages/cpmanage/index';
import CpChannelQueryAdmin from './pages/cpchannelquery-admin/index';
import CpChannelQueryCp from './pages/cpchannelquery-cp/index';
import DsManageAdmin from './pages/dsmanage-admin';
import DsManageCp from './pages/dsmanage-cp';
import Permission from './pages/permission/index';
import NoMatch from './pages/nomatch/index';
import VolumeProvinceSumAdmin from './pages/volumeprovincesum-admin'
import VolumeProvinceSumCp from './pages/volumeprovincesum-cp'

import PrivateRoute from "./privateroute";
import Admin from './admin'

export default class IRouter extends Component {
    render() {
        return (
            <Router>
                <App>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/" render={() =>
                            <Admin>
                                <Switch>
                                    <PrivateRoute path="/home" component={Home} />
                                    <PrivateRoute path="/admin/cpchannelbind" component={CpChannelBind} />
                                    <PrivateRoute path="/admin/cpmanage" component={CpManage} />
                                    <PrivateRoute path="/admin/dsmanage" component={DsManageAdmin} />
                                    <PrivateRoute path="/admin/permission" component={Permission} />
                                    <PrivateRoute path="/admin/cpchannelquery" component={CpChannelQueryAdmin} />
                                    <PrivateRoute path="/admin/volumeprovincesum" component={VolumeProvinceSumAdmin} />
                                    
                                    <PrivateRoute path="/cp/dsmanage" component={DsManageCp} />
                                    <PrivateRoute path="/cp/cpchannelquery" component={CpChannelQueryCp} />
                                    <PrivateRoute path="/cp/volumeprovincesum" component={VolumeProvinceSumCp} />
                              
                                   <PrivateRoute component={Home} />
                                </Switch>
                            </Admin>
                        } />
                    </Switch>
                </App>
            </Router>
        );
    }
}