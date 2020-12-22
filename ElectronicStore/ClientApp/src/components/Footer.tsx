import * as React from 'react';
import './NavMenu.css';

export default class Footer extends React.PureComponent<{}, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };
    
    public render() {
        return (
            <footer className="page-footer">
                <h6>Copyright © 2020. All rights reserved. </h6>
            </footer>
        );
    }
}

