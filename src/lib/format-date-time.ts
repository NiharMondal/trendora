import moment from "moment";

export const formatMonthDateYear = (dateString: string) => {
    return moment(dateString).format("ll");
}
export const formatMonthYear = (dateString: string) => {
    return moment(dateString).format("MMM YYYY");
}
export const formatMonthDate = (dateString: string) => {
    return moment(dateString).format("MMM Do");
}
export const formatYear = (dateString: string) => {
    return moment(dateString).format("YYYY");
}
export const formatMonthYearWithSlash = (dateString: string) => {
    return moment(dateString).format("MMM/YY");
}
export const formatDateTime = (dateString: string) => {
    return moment(dateString).format("MMM Do, YYYY HH:mm A");
}
export const formatDDMMYYYY = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY");
}
export const formatMMDDYYYY = (dateString: string) => {
    return moment(dateString).format("MM/DD/YYYY");
}
export const formatDayMonth = (dateString: string) => {
    return moment(dateString).format("DD MMM");
}
export const formatDayMonthYearWithSlash = (dateString: string) => {
    return moment(dateString).format("DD/MM/YY");
}
export const formatDayMonthYear = (dateString: string) => {
    return moment(dateString).format("DD Month YYYY");
}
export const formatDayMonthYearWithHyphen = (dateString: string) => {
    return moment(dateString).format("DD-MM-YYYY");
}

