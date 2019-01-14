import React from 'react';
import ReactDOM from 'react-dom';

interface FieldDecoratorProps {
    errorMessageProvider?: () => JSX.Element;
    okMessageProvider?: () => JSX.Element;
    children?: any;
}

interface FieldDecoratorState {
    showError?: boolean;
    showOk?: boolean;
}

export class FieldDecorator extends React.Component<FieldDecoratorProps, FieldDecoratorState> {

    constructor(props: FieldDecoratorProps) {
        super(props);
        this.state = {
            showError: false,
            showOk: false,
        }
    }

    render() {
        return (
            <div>
                {this.props.children}
                <div style={{display: (this.state.showError? "block" : "none")}}>
                    {this.props.errorMessageProvider && this.props.errorMessageProvider()}
                </div>
                <div style={{display: (this.state.showOk? "block" : "none")}}>
                    {this.props.okMessageProvider && this.props.okMessageProvider()}
                </div>
            </div>
        );
    }

    showError(): void {
        this.setState({showError: true, showOk: false}, () => {
            setTimeout(() => {
                this.setState({showError: false});
            }, 3000);
        });
    }
    showOk(): void {
        this.setState({showError: false, showOk: true}, () => {
            setTimeout(() => {
                this.setState({showOk: false});
            }, 3000);
        });
    }
}
    
