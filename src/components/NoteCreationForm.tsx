import React from 'react';
import {FieldDecorator} from "./FieldDecorator";
import {isEmpty} from "../utils/Utils";
import {createNote} from "../api/api";
import {BasicComponent, booleanCallback, HasCompId, Note} from "../interfaces";

interface NoteFormProps extends HasCompId {
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
            <form style={{display: this.state.visible ? "block" : "none"}}>
                <div className="form-group">
                    <label htmlFor="note-create-name">Name</label>
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
                <div className="form-group">
                    <label htmlFor="note-create-description">Description</label>
                    <textarea
                        id="note-create-description"
                        className="form-control"
                        placeholder="-- Description --"
                        value={this.state.description}
                        onChange={(event: any) => this.setState({description: event.target.value})}
                    />
                </div>
                <div className="form-group">
                    <input
                        id="note-create-sub"
                        className="form-control btn-success"
                        type="button"
                        value={"Create Note"}
                        onClick={this.onCreate}
                    />
                </div>
            </form>
        );
    }

    setVisible(visible: boolean, callback?: booleanCallback): void {
        this.setState({
            visible: visible
        }, () => {
            callback && callback(this.state.visible);
        });
    }

    getVisible(): boolean {
        return this.state.visible || false;
    }

    clear(): void {
        this.setState({name: "", description: ""});
    }

    getId(): string {
        return this.props.compId;
    }

    private onCreate(): void {
        if (isEmpty(this.state.name)) {
            this.nameFieldRef && this.nameFieldRef.showError();
        } else {
            createNote(this.state.name, this.state.description)
                .then((data: Note) => {
                    this.clear();
                    this.props.onCreatedCallback(data);

                }).catch((err: any) => {
                console.log(err);
                this.submitFieldRef && this.submitFieldRef.showError();
            })
        }
    }
}
    
