import React from 'react';

export interface DateTimeCompProps {
    date: string | undefined;
}

export const DateTimeComp = (props: DateTimeCompProps) => {
    if (!props.date) {
        return <span></span>
    }

    let date: Date = new Date(props.date);
    if (date instanceof Date) {
        return <span>{date.toLocaleDateString("us")} | {date.toLocaleTimeString("us")}</span>;
    } else {
        return <span>{props.date}</span>
    }
};