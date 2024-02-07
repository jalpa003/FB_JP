// Helper function to generate date filter
function getDateFilter(datePosted) {
    const currentDate = new Date();
    switch (datePosted) {
        case 'last24hours':
            return { $gte: new Date(currentDate - 24 * 60 * 60 * 1000) };
        case 'last7days':
            return { $gte: new Date(currentDate - 7 * 24 * 60 * 60 * 1000) };
        case 'last15days':
            return { $gte: new Date(currentDate - 15 * 24 * 60 * 60 * 1000) };
        case 'last30days':
            return { $gte: new Date(currentDate - 30 * 24 * 60 * 60 * 1000) };
        default:
            return null;
    }
}

function handleRegistrationError(error, res) {
    if (error.name === 'ValidationError') {
        // Extract validation error messages
        const validationErrors = Object.values(error.errors).map((error) => error.message);

        res.status(400).json({ error: 'Validation Error', messages: validationErrors });
    } else {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
function getWageFilter(payRate, payAmount) {
    if (!payRate || !payAmount) {
        return null;
    }

    let lowerLimit, upperLimit;

    // Handle string representations of payAmount for perHour
    if (payRate === 'perHour') {
        switch (payAmount) {
            case 'below20':
                lowerLimit = 0;
                upperLimit = 20;
                break;
            case '20to30':
                lowerLimit = 20;
                upperLimit = 30;
                break;
            case '30to40':
                lowerLimit = 30;
                upperLimit = 40;
                break;
            case '40plus':
                lowerLimit = 40;
                upperLimit = Infinity; // Represents any value greater than or equal to 40
                break;
            default:
                return null; // Invalid payAmount
        }

        return { payRate: 'perHour', payAmount: { $gte: lowerLimit, $lt: upperLimit } };
    }

    // Handle string representations of payAmount for perYear
    switch (payAmount) {
        case 'below50k':
            lowerLimit = 0;
            upperLimit = 50000;
            break;
        case '50kto75k':
            lowerLimit = 50000;
            upperLimit = 75000;
            break;
        case '75kto100k':
            lowerLimit = 75000;
            upperLimit = 100000;
            break;
        case '100kplus':
            lowerLimit = 100000;
            // upperLimit = Infinity; // Represents any value greater than or equal to 100000
            break;
        default:
            return null; // Invalid payAmount
    }

    return { payRate: 'perYear', payAmount: { $gte: lowerLimit, $lt: upperLimit } };
}

function getWorkAvailabilityFilter(workAvailability) {
    const filter = {};

    if (workAvailability === 'weekDayAvailability') {
        filter['workSchedule.weekDayAvailability'] = true;
    } else if (workAvailability === 'weekendAvailability') {
        filter['workSchedule.weekendAvailability'] = true;
    } else if (workAvailability === 'dayShift') {
        filter['workSchedule.dayShift'] = true;
    } else if (workAvailability === 'eveningShift') {
        filter['workSchedule.eveningShift'] = true;
    } else if (workAvailability === 'onCall') {
        filter['workSchedule.onCall'] = true;
    } else if (workAvailability === 'holidays') {
        filter['workSchedule.holidays'] = true;
    }

    return filter;
}

module.exports = {
    getDateFilter,
    handleRegistrationError,
    getWageFilter,
    getWorkAvailabilityFilter,
};