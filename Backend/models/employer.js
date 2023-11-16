const employerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyName: String,
    numberOfEmployees: String,
    contactName: String,
    contactPhone: String,
    fAndBIndustry: String,
    companyDescription: String,
    jobTitle: String,
    streetAddress: String,
    jobDescription: {
        description: String,
        requirements: {
            smartServe: Boolean,
            culinaryTraining: Boolean,
            redSeal: Boolean,
            experience: String,
            languageRequirements: [String],
        },
    },
    jobType: String,
    workSchedule: {
        weekDayAvailability: Boolean,
        weekendAvailability: Boolean,
        dayShift: Boolean,
        eveningShift: Boolean,
        onCall: Boolean,
        holidays: Boolean,
    },
    preferredStartDate: Date,
    numberOfOpenings: Number,
    payRate: {
        showPayBy: String,
        amount: Number,
        rate: String,
    },
    supplementalPay: [String],
    benefits: [String],
    relocationAssistance: Boolean,
    flexibleSchedule: Boolean,
    applicationDeadline: {
        hasDeadline: Boolean,
        date: Date,
    },
    communicationSettings: {
        sendUpdatesTo: [String], // Email addresses
        allowDirectCalls: Boolean,
    },
});

const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);

module.exports = EmployerProfile;
