import React from 'react';
import ReactTable, {CellInfo} from "react-table";
import "react-table/react-table.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faLink} from '@fortawesome/free-solid-svg-icons'
import {deleteNote, getNote, getNotes} from "../api/api";
import {BasicComponent, booleanCallback, HasId, Note} from "../interfaces";
import {DateComp} from "./DateComp";
import {deleteById} from "../utils/Utils";

interface NoteListProps {
    id: string;
    openNote(note: Note, noteOpenedCallback: booleanCallback): void;
    visible: boolean;
}

interface NoteListState {
    notes: Note[];
    visible?: boolean;
}

export class NoteList extends React.Component<NoteListProps, NoteListState> implements BasicComponent {

    constructor(props: NoteListProps) {
        super(props);
        this.state = {
            notes: [],
            visible: this.props.visible
        };

        this.loadData = this.loadData.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onOpenNoteDetails = this.onOpenNoteDetails.bind(this);
        this.setVisible = this.setVisible.bind(this);
    }

    setVisible(visible: boolean, callback: booleanCallback): void {
        this.setState({visible: visible}, () => {
            callback && callback(this.state.visible);
        });
    }
    componentWillMount(): void {
        this.loadData();
    }

    refreshOnNoteCreated(newNote: Note, hardRefresh?: boolean): void {
        if (!newNote) {
            return;
        }
        if (hardRefresh) {
            return this.loadData();
        } else {
            let notes: Note[] = [...this.state.notes];
            notes.push(newNote);
            this.setState({notes: notes});
        }
    }

    refreshOnNoteDeleted(deletedId: number | undefined, hardRefresh?: boolean): void {
        if (!deletedId) {
            return;
        }
        if (hardRefresh) {
            return this.loadData();
        } else {
            let notes: Note[] = deleteById(this.state.notes, deletedId) as Note[];
            this.setState({notes: notes});
        }
    }


    private loadData(): void {
        getNotes()
            .then((notes: Note[]) => {
                this.setState({notes: notes})
            })
            .catch((err: any) => console.info(err));
    }

    private onOpenNoteDetails(noteId: number): void {
        getNote(noteId).then((note: Note) => {
            this.props.openNote(note, (otherVisible: boolean | undefined) => {
                this.setState({visible: !otherVisible});
            })
        })
    }

    render() {
        let table: JSX.Element = <ReactTable
            data={this.state.notes}
            columns={[
                {
                    Header: "Name",
                    id: "name",
                    accessor: d => d.name,
                    Cell: row => (
                        <div>
                            <span
                                style={{color: "red", cursor: "pointer", padding: 5}}
                                onClick={() => this.onOpenNoteDetails(row.original.id)}
                            >
                                {row.original.name}
                                <FontAwesomeIcon icon={faLink} />
                            </span>
                        </div>
                    )
                },
                {
                    Header: "Description",
                    id: "description",
                    accessor: d => d.description
                },
                {
                    Header: "Status",
                    id: "status",
                    accessor: d => d.status
                }
                ,{
                    Header: "Created",
                    id: "created",
                    // accessor: d => d.created,
                    Cell: (row: CellInfo) => {
                        // console.log(row.original.created)
                        return <DateComp date={row.original.created}/>;
                    }
                },{
                    Header: "Updated",
                    id: "updated",
                    // accessor: d => d.updated
                    Cell: (row: CellInfo) => {
                        return <DateComp date={row.original.updated}/>;
                    }
                },
                {
                    Header: "Action",
                    id: "action",
                    Cell: row => (
                        <div>
                            <span
                                style={{color: "red", cursor: "pointer", padding: 5}}
                                onClick={() => this.onDelete(row.original)}
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
            <div id={"note-list"} style={{display: this.state.visible? "block" : "none"}}>
                {table}
            </div>
        );
    }

    private onDelete(note: Note): void {
        if (!note || !note.id) {
            alert("Invalid data");
            return;
        }
        if (confirm("Delete note: " + note.name + " ?")) {
            deleteNote(note.id as number).then(() => {
                this.refreshOnNoteDeleted(note.id, false);
            });
        }
    }

    getId(): string {
        return this.props.id;
    }

    getVisible(): boolean {
        return this.state.visible || false;
    }

}