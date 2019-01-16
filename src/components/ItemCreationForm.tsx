import React from 'react';
import {FieldDecorator} from "./FieldDecorator";
import {BasicComponent, booleanCallback, HasCompId, Item, Note, PromiseData} from "../interfaces";
import {createItem} from "../api/api";
import {isEmpty} from "../utils/Utils";

interface ItemFormProps extends HasCompId {
    visible: boolean;
    onCreatedCallback: (item: Item) => void;
}

interface ItemFormState {
    note?: Note;
    name?: string;
    description?: string;
    visible?: boolean;
}

export class ItemCreationForm extends React.Component<ItemFormProps, ItemFormState> implements BasicComponent {

    private nameFieldRef: FieldDecorator | undefined;
    private submitFieldRef: FieldDecorator | undefined;

    constructor(props: ItemFormProps) {
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
        let noteInfoRow: JSX.Element | undefined = !this.state.note? undefined : (
            <div className="row">
                Note: {this.state.note.name} | {this.state.note.id}
            </div>
        );
        return (
            <div className="container" style={{display: this.state.visible ? "block" : "none"}}>
                {noteInfoRow}
                <div className="row">
                    <div className="col-sm">
                        <FieldDecorator
                            errorMessageProvider={() => <span style={{color: "red"}}>* Name is required.</span>}
                            ref={(ref: FieldDecorator) => this.nameFieldRef = ref}
                        >
                            <input
                                id="item-create-name"
                                className="form-control"
                                type="text"
                                placeholder="New item name"
                                value={this.state.name}
                                onChange={(event: any) => this.setState({name: event.target.value})}
                            />
                        </FieldDecorator>
                    </div>
                    <div className="col-sm">
                        <input
                            id="item-create-description"
                            className="form-control"
                            type="text"
                            placeholder="New item description"
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
                                id="item-create-sub"
                                className="form-control btn-primary"
                                type="button"
                                value={"Add Item"}
                                onClick={this.onCreate}
                            />
                        </FieldDecorator>
                    </div>
                </div>
            </div>
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

    update(note: Note): Promise<PromiseData<Note>> {
        return new Promise((resolve, reject) => {
            this.setState({note: note}, () => {
                resolve({data: note});
            });
        });
    }

    getId(): string {
        return this.props.compId;
    }

    private onCreate(): void {
        if (isEmpty(this.state.name) || !this.state.note || !this.state.note.id) {
            this.nameFieldRef && this.nameFieldRef.showError();
        } else {
            if (!this.state.note) {
                console.error("Id invalid.");
                return;
            }
            createItem(this.state.note.id, this.state.name, this.state.description)
                .then((data: Item) => {
                    this.submitFieldRef && this.submitFieldRef.showOk();
                    this.clear();
                    this.props.onCreatedCallback(data);
                }).catch((err: any) => {
                console.log(err);
                this.submitFieldRef && this.submitFieldRef.showError();
            })
        }
    }

    private clear(): void {
        this.setState({name: "", description: ""});
    }
}
    
