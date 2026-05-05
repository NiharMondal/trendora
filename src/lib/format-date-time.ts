import moment from "moment";

export type TFormatDateTime =
    | "ll"
    | "MMM YYYY"
    | "MMM Do"
    | "YYYY"
    | "MMM/YY"
    | "MMM Do, YYYY HH:mm A"
    | "DD/MM/YYYY"
    | "MM/DD/YYYY"
    | "DD MMM"
    | "DD/MM/YY"
    | "DD Month YYYY"
    | "DD-MM-YYYY";



export const formatDate = (
    dateString: string,
    format: TFormatDateTime = "ll",
): string => {
    if (!dateString || !moment(dateString).isValid()) return "-";
    return moment(dateString).format(format);
};


export const dateFromNow = (
    dateString: string,
): string => {
    if (!dateString || !moment(dateString).isValid()) return "-";
    return moment(dateString).fromNow();
};

export const isDateValid = (dateString: string): boolean => {
    return moment(dateString).isValid();
};
