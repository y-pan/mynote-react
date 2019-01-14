import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {NoteList} from "./components/NoteList";
import {NoteForm} from "./components/NoteForm";
import {Note} from "./interfaces";

class App extends Component {
    private noteListRef: NoteList | undefined;
    private noteFormRef: NoteForm | undefined;

    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">

                    <NoteList
                        ref = {(ref: NoteList) => this.noteListRef = ref}
                    />

                    <NoteForm
                        onCreatedCallback={(note: Note) => {
                            this.noteListRef && this.noteListRef.refresh(note);
                        }}
                        ref={(ref: NoteForm) => this.noteFormRef = ref}
                    />

                </header>
            </div>
        );
    }

}

export default App;
