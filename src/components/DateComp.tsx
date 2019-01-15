import React from 'react';

export interface DateCompProps {
    date: string | undefined;
}

export const DateComp = (props: DateCompProps) => {
    if (!props.date) {
        return <span></span>
    }

    let date: Date = new Date(props.date);
    if (date instanceof Date) {
        return <span>{date.toLocaleDateString("us")}</span>;
    } else {
        return <span>{props.date}</span>
    }
};