import {ajaxDelete, ajaxGet, ajaxPost, ajaxPostTyped, slashJoin} from "../utils/Utils";
import {Note} from "../interfaces";
import {getApiRoot} from "../config/config";

const root: string = getApiRoot("dev");

export function deleteItem(id: number): Promise<any> {
    return ajaxDelete(slashJoin(root, "items", id));
}
export function deleteNote(id: number): Promise<any> {
    return ajaxDelete(slashJoin(root, "notes", id));
}
export function getNotes(): Promise<Note[]> {
    return ajaxGet(slashJoin(root, "notes"));
}
export function getNote(noteId: number) {
    return ajaxGet(slashJoin(root, "notes", noteId));
}
export function createNote(name: string, description: string): Promise<Note> {
    return ajaxPostTyped<Note>(slashJoin(root, "notes"), {name: name, description: description});
}