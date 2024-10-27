const formatDate = (date) => {
    const newDate = new Date(date);
    const options = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    };
    const [day, month, year] = new Intl.DateTimeFormat("en-GB", options)
        .format(newDate)
        .split("/");

    return `${day}-${month}-${year}`;
};

export { formatDate };
