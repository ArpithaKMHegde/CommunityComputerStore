import * as React from 'react';
import { connect } from 'react-redux';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
// At runtime, Redux will merge together...
type LoginProps =
    LoginStore.LoginsState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
// & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

class NavMenu extends React.PureComponent<LoginProps, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };

    public render() {
        return (
            <header>
                <div className="banner">
                    <h1> Community Computer Store </h1>
                </div>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3">
                    <Container>
                        {/* <NavbarBrand tag={Link} className="inactive" to="/">Store</NavbarBrand> */}
                        <NavbarToggler onClick={this.toggle} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="inactive" activeClassName="active" exact={true} to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="inactive" activeClassName="active" exact={true} to="/Product/0">Products</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="inactive" activeClassName="active" exact={true} to="/User/0">Users</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="inactive" activeClassName="active" exact={true} to="/Member/0">Members</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="inactive" activeClassName="active" exact={true} to="/Transaction/0">Transactions</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="inactive" activeClassName="active" exact={true} to="/SalesDetails/0">Sales</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="inactive" activeClassName="active" exact={true} onClick={() => {this.props.logOut()} } >Log Out</NavLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                    </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    
}

export default connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(NavMenu as any);