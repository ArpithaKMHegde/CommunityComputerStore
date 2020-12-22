import * as React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import Layout from './components/Layout';
import Home from './components/Home';
import Products from './components/Products';
import Members from './components/Members';
import Users from './components/Users';
import Transactions from './components/Transactions';
import { ApplicationState } from './store';
import SalesDetails from './components/SalesDetails';

import Login from './components/Login';

import * as LoginStore from './store/Login';

import './custom.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'


library.add(fas, faTwitter)

// At runtime, Redux will merge together...
type LoginProps =
    LoginStore.LoginsState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
// & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

class App extends React.Component<LoginProps>{
    public render() {
        return (<div>
                
            {
                !this.props.isLoggedIn ?
                    <Login />
                    :
                    <Layout>
                        <Route exact path='/' component={Home} />
                        <Route path='/Product/:startDateIndex?' component={Products} />
                        <Route path='/User/:startDateIndex?' component={Users} />
                        <Route path='/Member/:startDateIndex?' component={Members} />
                        <Route path='/Transaction/:startDateIndex?' component={Transactions} />
                        <Route path='/SalesDetails/:startDateIndex?' component={SalesDetails} />
                    </Layout>
            }
                
                </div>
    
            )
    }
}

export default connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(App as any);



