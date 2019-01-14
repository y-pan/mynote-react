export enum AjaxMethod {
    GET="GET", POST="POST", PUT="PUT", DELETE="DELETE"
}

export function ajax(url: string, method: AjaxMethod, json?: any): Promise<any> {
    return new Promise((resolve: (data: any) => void, reject: (err: any) => void) => {
        let xmlhttp: XMLHttpRequest = new XMLHttpRequest();
        xmlhttp.open(method, url, true);

        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    try {
                        resolve(JSON.parse(xmlhttp.responseText)); // Object[]
                    } catch (err) {
                        reject(`${err}`);
                    }
                } else {
                    reject(`${JSON.parse(xmlhttp.responseText).message}`); // string
                }
            }
        };
        xmlhttp.ontimeout = (err?: any) => reject(`timeout error: ${err}`);
        xmlhttp.onabort = (err: any) => reject(`abort error: ${err}`);
        xmlhttp.onerror = (err: any) => reject(`error: ${err}`);

        xmlhttp.send(json? JSON.stringify(json) : null);
    });
}

export function ajaxPost(url: string, json: object): Promise<any> {
    return ajax(url, AjaxMethod.POST, json);
}

export function ajaxPostTyped<T>(url: string, json: T): Promise<T> {
    return ajax(url, AjaxMethod.POST, json);
}

export function ajaxPut(url: string): Promise<any> {
    return ajax(url, AjaxMethod.PUT);
}

export function ajaxGet(url: string): Promise<any> {
    return ajax(url, AjaxMethod.GET);
}

export function ajaxDelete(url: string): Promise<any> {
    return ajax(url, AjaxMethod.DELETE);
}

//HTTP status code: 200, 404, 403 and so on. Also can be 0 if an error occurred.

export function isEmpty(str: string | undefined): boolean {
    if (str === undefined || str === null || str === "") {
        return true;
    }
    if (typeof str === "string") {
        return str.trim() === "";
    }
    return false;
}

function joinBy(str1: string, str2: string, separator: string): string {
    if (!str1 || typeof str1 !== "string") {
        str1 = "";
    }

    if (!str2 || typeof str2 !== "string") {
        str2 = "";
    }

    if (!separator || typeof separator !== "string") {
        separator = ""
    }

    str1 = str1.trim();
    str2 = str2.trim();

    if (str1 === "") {
        return str2;
    }

    if (str2 === "") {
        return str1;
    }

    return str1 + separator + str2;
}
export function slashJoin(...strs: any[]): string {
    if (!strs) {
        return "";
    }
    let strArr: string[] = strs.map(value => isNullOrUndefined(value)? "" : value + "");
    return joinAllBy(strArr, "/");
}
export function dashJoin(...strs: any[]): string {
    if (!strs) {
        return "";
    }
    let strArr: string[] = strs.map(value => isNullOrUndefined(value)? "" : value + "");
    return joinAllBy(strArr, "-");
}

export function spaceJoin(...strs: any[]): string {
    if (!strs) {
        return "";
    }
    let strArr: string[] = strs.map(value => isNullOrUndefined(value)? "" : value + "");
    return joinAllBy(strArr, " ");
}

export function joinAllBy(strings: string[], separator: string): string {
    if (!strings || strings.length === 0) {
        return "";
    }

    if (!separator || typeof separator !== "string") {
        separator = ""
    }

    if (typeof strings === "string") {
        return (strings as string).trim();
    }

    let result: string = strings.reduce((acc: string, val: string) => joinBy(acc, val, separator));
    return result;
}

export function spaceJoinIfNotHaving(str1: string, str2: string): string {
    if (hasClass(str1, str2)) {
        return str1; // str1 already has str2, no need to add again.
    }

    return spaceJoin(str1, str2);
}

export function hasClass(str1: string, str2: string): boolean {
    if (!str1) {
        return false;
    }

    str1 = trimStringOrElseEmptyString(str1);
    let allClasses: string[] = str1.split(" ");

    str2 = trimStringOrElseEmptyString(str2);
    return str1.indexOf(str2) > 0;
}

export function trimStringOrElseEmptyString(str: string): string {
    if (!str || typeof str !== "string") {
        return "";
    }
    return str.trim();
}

export function isNullOrUndefined(value: any): boolean {
    return value === undefined || value === null;
}
