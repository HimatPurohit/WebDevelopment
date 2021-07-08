module.exports.date=getDate;

function getDate() {
    const today=new Date();
    const options={weekday:"long", day:"numeric",month:"long"};
    const date=today.toLocaleDateString("en-us",options);
    return date;
}

exports.day=function() {
    const today=new Date();
    const options={weekday:"long"};
    return day=today.toLocaleDateString("en-us",options);
}