import React from 'react';
import {FieldDecorator} from "./FieldDecorator";
import {BasicComponent, booleanCallback, HasNavigateBackProvider, Item, Note} from "../interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import ReactTable, {CellInfo} from "react-table";
import {ItemCreationForm} from "./ItemCreationForm";
import {deleteItem, getNote} from "../api/api";
import {deleteById, isNullOrUndefined} from "../utils/Utils";
import {isEmptyNumber} from "../tmp/Utils";

interface NoteDetailsProps {
    id: string;
    note?: Note;
    onCreatedCallback: (note: Note) => void;
    visible: boolean;
}

interface NoteDetailsState {
    visible: boolean;
    note?: Note;
}

export class NoteDetails extends React.Component<NoteDetailsProps, NoteDetailsState> implements BasicComponent {

    private nameFieldRef: FieldDecorator | undefined;
    private submitFieldRef: FieldDecorator | undefined;

    constructor(props: NoteDetailsProps) {
        super(props);
        this.state = {
            visible: this.props.visible,
            note: this.props.note
        };

        this.show = this.show.bind(this);
        this.refreshOnItemAdded = this.refreshOnItemAdded.bind(this);
        this.renderNoteInfo = this.renderNoteInfo.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
    }

    private renderNoteInfo(note?: Note): JSX.Element {

        let info: JSX.Element = (
            <form>
                <div className="form-group row">
                    <label htmlFor="info-name" className="col-sm-2 col-form-label">Note Name:</label>
                    <div className="col-sm-10">
                        <input type="text" readOnly className="form-control" id="info-name"
                               value={note && note.name || ""} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="info-description" className="col-sm-2 col-form-label">Note Description:</label>
                    <div className="col-sm-10">
                        <textarea readOnly className="form-control" id="info-description"
                               value={note && note.description || ""} rows={1}/>
                    </div>
                </div>
            </form>
        );

        return info;
    }
    render() {
        let table: JSX.Element = <ReactTable
            data={(this.state.note && this.state.note.items) || []}
            columns={[
                {
                    Header: "Name",
                    id: "name",
                    accessor: (d:Item) => d.name,
                    Cell: (row: CellInfo) => (
                        <div>
                            <span
                                style={{color: "red", cursor: "pointer", padding: 5}}
                                // onClick={() => console.log(row.original.id)}
                            >
                                {row.original.name}
                                {/*<FontAwesomeIcon icon={faLink} />*/}
                            </span>
                        </div>
                    )
                },
                {
                    Header: "Description",
                    id: "description",
                    accessor: (d:Item) => d.description
                },
                {
                    Header: "Status",
                    id: "status",
                    accessor: (d:Item) => d.status
                },
                {
                    Header: "Action",
                    id: "action",
                    Cell: (row: CellInfo) => (
                        <div>
                            <span
                                style={{color: "red", cursor: "pointer", padding: 5}}
                                onClick={() => this.onDeleteItem(row.original.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                        </div>
                    )
                }
            ]}
            defaultPageSize={5}
            className="-striped -highlight"
        />;

        return (
                <div id={"note-detail"} style={{display: this.state.visible? "block" : "none"}}>
                    {this.renderNoteInfo(this.state.note)}
                    <ItemCreationForm
                        id={"item-create"}
                        noteId={this.state.note? this.state.note.id : undefined}
                        visible={true}
                        onCreatedCallback={this.refreshOnItemAdded}
                        ref={(ref: ItemCreationForm) => this.itemCreateRef = ref}
                    />
                    {table}
                </div>
        );
    }

    private refreshOnItemAdded(item: Item, hardRefresh?: boolean): void {
        if (!item || !this.state.note || !this.state.note.id) {
            console.error("Incorrect state occurred.");
            return;
        }

        if (hardRefresh) {
            this.loadData();
        } else {
            let note: Note = this.state.note;
            if(!note.items) {
                note.items = [];
            }
            note.items.push(item);
            this.setState({note: note});
        }
    }

    private onDeleteItem(itemId: number, hardRefresh?: boolean): void {
        if (!itemId) {
            console.error("Invalid item id");
            return;
        }

        deleteItem(itemId).then((itemIdDeleted: number) => {
            this.refreshOnItemDeleted(itemIdDeleted, false);
        })
    }

    private loadData(): void {
        if (!this.state.note || this.state.note.id === undefined) {
            console.error("Bad data state");
            return;
        }
        getNote(this.state.note.id).then((note: Note) => {
            this.setState({note: note})
        }).catch((err: any) => {
            console.error(err);
        });
    }

    refreshOnItemDeleted(deletedId: number | undefined, hardRefresh?: boolean): void {
        if (!deletedId || !this.state.note) {
            return;
        }
        if (hardRefresh) {
            return this.loadData();
        } else {
            let note: Note = {...this.state.note};
            let latestItems: Item[] = deleteById(note.items, deletedId) as Item[];
            note.items = latestItems;
            this.setState({note: note});
        }
    }


    private itemCreateRef: ItemCreationForm | undefined;

    public show(note: Note, callback: booleanCallback): void {
        if (!note) {
            return this.setState({visible: false, note: undefined}, () => {callback(this.state.visible)});
        }

        this.setState({visible: true, note: note}, () => {
            callback(this.state.visible);
        });
    }

    getId(): string {
        return this.props.id;
    }

    getVisible(): boolean {
        return this.state.visible || false;
    }

    setVisible(visible: boolean, callback: booleanCallback) {
        this.setState({visible: visible}, () => {
            callback && callback(this.state.visible);
        });
    }
}
    
