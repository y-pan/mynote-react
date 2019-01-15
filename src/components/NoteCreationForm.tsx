import React from 'react';
import {FieldDecorator} from "./FieldDecorator";
import {isEmpty} from "../utils/Utils";
import {createNote} from "../api/api";
import {BasicComponent, booleanCallback, HasNavigateBackProvider, Note} from "../interfaces";

interface NoteFormProps {
    id: string;
    visible: boolean;
    onCreatedCallback: (note: Note) => void;
}

interface NoteFormState {
    name?: string;
    description?: string;
    visible?: boolean;
}

export class NoteCreationForm extends React.Component<NoteFormProps, NoteFormState> implements BasicComponent {

    private nameFieldRef: FieldDecorator | undefined;
    private submitFieldRef: FieldDecorator | undefined;

    constructor(props: NoteFormProps) {
        super(props);
        this.state = {
            name: "",
            description: "",
            visible: this.props.visible
        };
        this.onCreate = this.onCreate.bind(this);
        this.clear = this.clear.bind(this);
    }

    render() {
        return (
            <div className="container" style={{display: this.state.visible ? "block" : "none"}}>
                <div className="row">
                    <div className="col-sm">
                        <FieldDecorator
                            errorMessageProvider={() => <span style={{color: "red"}}>* Name is required.</span>}
                            ref={(ref: FieldDecorator) => this.nameFieldRef = ref}
                        >
                            <input
                                id="note-create-name"
                                className="form-control"
                                type="text"
                                placeholder="-- Name --"
                                value={this.state.name}
                                onChange={(event: any) => this.setState({name: event.target.value})}
                            />
                        </FieldDecorator>
                    </div>
                    <div className="col-sm">
                        <input
                            id="note-create-description"
                            className="form-control"
                            type="text"
                            placeholder="-- Description --"
                            value={this.state.description}
                            onChange={(event: any) => this.setState({description: event.target.value})}
                        />
                    </div>
                    <div className="col-sm">
                        <FieldDecorator
                            errorMessageProvider={() => <span style={{color: "red"}}>Error</span>}
                            okMessageProvider={() => <span style={{color: "green"}}>OK</span>}

                            ref={(ref: FieldDecorator) => this.submitFieldRef = ref}
                        >
                            <input
                                id="note-create-sub"
                                className="form-control btn-primary"
                                type="button"
                                value={"Create Note"}
                                onClick={this.onCreate}
                            />
                        </FieldDecorator>
                    </div>
                </div>
            </div>
        );
    }

    setVisible(visible: boolean, callback?: booleanCallback): void {
        console.log("Note Create Form visible to", visible)
        this.setState({
            visible: visible
        }, () => {
            callback && callback(this.state.visible);
        });
    }

    getVisible(): boolean {
        return this.state.visible || false;
    }

    private onCreate(): void {
        if (isEmpty(this.state.name)) {
            this.nameFieldRef && this.nameFieldRef.showError();
        } else {
            createNote(this.state.name, this.state.description)
                .then((data: Note) => {
                    this.submitFieldRef && this.submitFieldRef.showOk();
                    this.clear();
                    this.props.onCreatedCallback(data);

                }).catch((err: any) => {
                console.log(err);
                this.submitFieldRef && this.submitFieldRef.showError();
            })
        }
    }

    clear(): void {
        this.setState({name: "", description: ""});
    }

    getId(): string {
        return this.props.id;
    }
}
    
