import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as LoginsStore from '../store/Login';
import './Style.css';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from './Footer';


// At runtime, Redux will merge together...
type LoginProps =
    LoginsStore.LoginsState // ... state we've requested from the Redux store
    & typeof LoginsStore.actionCreators // ... plus action creators we've requested
    //& RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

class Login extends React.PureComponent<LoginProps> {
    public render() {
        return (
            <React.Fragment>
                <header>
                    <div className="banner">
                        <h1> Community Computer Store </h1>
                    </div>
                </header>
                <h2 className="style-h2"> Welcome to community computer sales and purchase platform </h2>
                {this.renderLoginsTable()}
                <Footer />
            </React.Fragment>
        );
    }

    private renderLoginsTable() {
        return (
            <div className="Container" style={{ backgroundColor: '#F5F5F5', alignItems: 'center', marginTop: '40px', width: '50%', justifyContent: 'center', marginLeft: '25%' }}>
                <h4 className="style-h4"> Please sign in to your store management account </h4>
                <hr /><br />
                <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3" />
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon">
                                    <FontAwesomeIcon icon="user" />
                                </span>
                            </div>
                            <input type="text" id="UserName" name="UserName" className="form-control" placeholder="User Name" aria-label="Username" aria-describedby="basic-addon" value={this.props.uivalues.UserName} onChange={(event) => { this.props.loginValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3" />
                </div> <br />
                <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3" />
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon">
                                    <FontAwesomeIcon icon="key" />
                                </span>
                            </div>
                            <input type="password" id="Password" name="Password" placeholder="Password" className="form-control" value={this.props.uivalues.Password} onChange={(event) => { this.props.loginValueChange(event.target.id, event.target.value); }} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3" />
                </div>
                <br />
                <hr style={{ width: '50%' }} />
                <div className="row">
                    <div className="col-lg-5 col-md-5 col-sm-5" />
                    <div className="col-lg-2 col-md-2 col-sm-2">
                        <div className="form-group center-block">
                            <div typeof="button" className="btn btn-success" style={{ marginRight: '10px', width:'100%' }} onClick={(event) => { this.props.requestLogins(); }}>Login</div>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5" />
                </div>
                <div className="row">
                    <div className="col-lg-5 col-md-5 col-sm-5" />
                    <div className="col-lg-4 col-md-4 col-sm-4">
                        <div className="form-group center-block">
                            <div style={{ color: 'red' }}>{this.props.helperText} </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3" />
                </div>
            </div >
        );
    }
}

export default connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginsStore.actionCreators // Selects which action creators are merged into the component's props
)(Login as any);
