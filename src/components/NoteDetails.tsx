import React from 'react';
import {FieldDecorator} from "./FieldDecorator";
import {BasicComponent, booleanCallback, HasNavigateBackProvider, Item, Note} from "../interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import ReactTable, {CellInfo} from "react-table";

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
        this.renderNoteInfo = this.renderNoteInfo.bind(this);
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
                               value={note && note.description || ""} />
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
                                onClick={() => console.log("delete" + row.original.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                        </div>
                    )
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
        />;

        return (
                <div id={"note-detail"} style={{display: this.state.visible? "block" : "none"}}>
                    {this.renderNoteInfo(this.state.note)}
                    {table}
                </div>
        );
    }

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
    
