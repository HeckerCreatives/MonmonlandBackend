const Maintenance = require("../Gamemodels/Maintenance")

exports.checkmaintenance = async (maintenancetype) => {
    return await Maintenance.findOne({type: maintenancetype})
    .then(data => {
        if (!data){
            return "nomaintenance"
        }

        return data.value
    })
    .catch(() => "bad-request")
}

// use if not owned yet
exports.DateTimeServerExpiration1 = (expiration) => {
    const date = new Date();

    // Get the Unix timestamp in milliseconds
    const unixTimeMilliseconds = date.getTime();

    // Convert it to Unix timestamp in seconds
    const unixTimeSeconds = Math.floor(unixTimeMilliseconds / 1000);

    // Add 30 days (30 * 24 * 60 * 60 seconds) to the current timestamp
    const unixTimeSecondsIn30Days = unixTimeSeconds + (expiration * 24 * 60 * 60);

    return unixTimeSecondsIn30Days;
}

// use if already owned
exports.DateTimeServerExpiration2 = (expiration) => {
    // const date = new Date();

    // // Get the Unix timestamp in milliseconds
    // const unixTimeMilliseconds = date.getTime();

    // // Convert it to Unix timestamp in seconds
    // const unixTimeSeconds = Math.floor(unixTimeMilliseconds / 1000);

    // Add 30 days (30 * 24 * 60 * 60 seconds) to the current timestamp
    const unixTimeSecondsIn30Days = (expiration * 24 * 60 * 60);

    return unixTimeSecondsIn30Days;
}