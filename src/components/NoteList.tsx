import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBusinessTime, faCheckCircle, faTrash, faWalking} from '@fortawesome/free-solid-svg-icons'
import {deleteItem, deleteNote, getNotes} from "../api/api";
import {Note} from "../interfaces";
import {FieldDecorator} from "./FieldDecorator";

interface NoteListProps {

}

interface NoteListState {
    notes: Note[];

}

export class NoteList extends React.Component<NoteListProps, NoteListState> {

    constructor(props: NoteListProps) {
        super(props);
        this.state = {
            notes: []
        };

        this.loadData = this.loadData.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentWillMount(): void {
        this.loadData();
    }

    refresh(newNote: Note, hardRefresh?: boolean): void {
        // this.loadData();
        if (!newNote) {
            return;
        }
        if (hardRefresh) {
            return this.loadData();
        } else {
            let notes: Note[] = [...this.state.notes];
            notes.push(newNote)
            this.setState({notes: notes});
        }
    }

    refreshByAdd(newNote: Note, hardRefresh?: boolean): void {
        // this.loadData();
        if (!newNote) {
            return;
        }
        if (hardRefresh) {
            this.loadData();
        } else {
            let notes: Note[] = [...this.state.notes];
            notes.push(newNote)
            this.setState({notes: notes});
        }
    }

    refreshByDelete(deletedId: number | undefined, hardRefresh?: boolean): void {
        // this.loadData();
        if (!deletedId) {
            return;
        }
        if (hardRefresh) {
            return this.loadData();
        } else {
            let notes: Note[] = [...this.state.notes];
            let indexToDelete: number = -1;
            notes.forEach((note: Note, index: number) => {
                if (note.id === deletedId) {
                    indexToDelete = index;
                    return;
                }
            });
            if (indexToDelete !== -1) {
                notes.splice(indexToDelete, 1);
                this.setState({notes: notes});
            }
        }
    }

    private loadData(): void {
        console.log("loaddata")
        getNotes()
            .then((notes: Note[]) => {
                this.setState({notes: notes})
            })
            .catch((err: any) => console.info(err));
    }

    render() {

        let table: JSX.Element = <ReactTable
            data={this.state.notes}
            columns={[
                {
                    Header: "Name",
                    id: "name",
                    accessor: d => d.name
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
            <div>
                <div id={"note-list"}>
                    {table}
                </div>
            </div>
        );
    }

    private onDelete(note: Note): void {
        console.log(note)
        if (!note || !note.id) {
            alert("Invalid data");
            return;
        }
        if (confirm("Delete note: " + note.name + " ?")) {
            deleteNote(note.id as number).then(() => {
                this.refreshByDelete(note.id);
                // this.loadData();
            });
        }
    }


}