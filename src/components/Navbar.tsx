import React from 'react';
import ReactDOM from 'react-dom';
import {spaceJoin} from "../utils/Utils";
import {spaceJoinIf} from "../tmp/Utils";

export interface Nav {
    id: string;
    caption: string;
    handler(id: string): void;
}

interface NavbarProps {
    navs: Nav[];
}

interface NavbarState {
    selectedId: string;
}

export class Navbar extends React.Component<NavbarProps, NavbarState> {

    constructor(props: NavbarProps) {
        super(props);

        this.state = {
            selectedId: this.props.navs[0].id
        };

        this.onNavClicked = this.onNavClicked.bind(this);
    }

    render() {
        let liElements: JSX.Element [] = this.props.navs.map((nav: Nav, index: number) => {
            return (
                <li key={index} className={"nav-item"}>
                    <a
                        className={spaceJoinIf("nav-link", "active", this.state.selectedId === nav.id)}
                        onClick={(event: any) => this.onNavClicked(nav)}>
                        {nav.caption}
                    </a>
                </li>
            );
        });
        return (
            <ul className="nav nav-pills nav-fill" style={{margin: "5px 0px"}}>
                {liElements}
            </ul>
        );
    }

    private onNavClicked(nav: Nav): void {
        if (this.state.selectedId === nav.id) {
            return;
        }

        this.setState({
            selectedId: nav.id
        }, () => {
            nav.handler && nav.handler(nav.id);
        });
    }
}
    
