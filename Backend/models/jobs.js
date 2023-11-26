const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true,
    },
    jobLocation: {
        type: String,
        required: true,
    },
    uploadedDocument: {
        type: String,
    },
    jobRequirements: {
        smartServe: {
            type: Boolean,
            default: false
        },
        culinaryTraining: {
            type: Boolean,
            default: false
        },
        redSeal: {
            type: Boolean,
            default: false
        },
    },
    experience: {
        type: String,
        enum: ['1-3 Years', '3-5 Years', '5-7 Years', '7-10 Years', '10+ Years'],
    },
    languageRequirements: String,
    jobType: {
        type: String,
        enum: ['fullTime', 'partTime', 'internship', 'casual', 'seasonal'],
    },
    hoursPerWeek: Number,
    workSchedule: {
        weekDayAvailability: Boolean,
        weekendAvailability: Boolean,
        dayShift: Boolean,
        eveningShift: Boolean,
        onCall: Boolean,
        holidays: Boolean,
    },
    preferredStartDate: Date,
    numberOfPositions: Number,
    payRate: {
        showPayBy: {
            type: String,
            enum: ['Range', 'Starting Amount', 'Maximum Amount', 'Exact Amount'],
        },
        amount: Number,
        rate: {
            type: String,
            enum: ['per hour', 'per week', 'per month', 'per year'],
        },
    },
    supplementalPay: {
        overtime: {
            type: Boolean,
            default: false,
        },
        bonusPay: {
            type: Boolean,
            default: false,
        },
        tips: {
            type: Boolean,
            default: false,
        },
        signingBonus: {
            type: Boolean,
            default: false,
        },
        retentionBonus: {
            type: Boolean,
            default: false,
        },
    },
    benefitsOffered: {
        dentalCare: {
            type: Boolean,
            default: false,
        },
        extendedHealthCare: {
            type: Boolean,
            default: false,
        },
        lifeInsurance: {
            type: Boolean,
            default: false,
        },
        rrspMatch: {
            type: Boolean,
            default: false,
        },
        paidTimeOff: {
            type: Boolean,
            default: false,
        },
        onSiteParking: {
            type: Boolean,
            default: false,
        },
        employeeAssistanceProgram: {
            type: Boolean,
            default: false,
        },
        discountedOrFreeFoodBeverage: {
            type: Boolean,
            default: false,
        },
        tuitionReimbursement: {
            type: Boolean,
            default: false,
        },
        wellnessProgram: {
            type: Boolean,
            default: false,
        },
        profitSharing: {
            type: Boolean,
            default: false,
        },
        relocationAssistance: {
            type: Boolean,
            default: false,
        },
        flexibleSchedule: {
            type: Boolean,
            default: false,
        },
    },
    applicationDeadline: {
        // hasDeadline: {
        //     type: Boolean,
        //     default: false,
        // },
        deadlineDate: Date,
    },
    communicationSettings: {
        sendUpdatesTo: [String], // Array of email addresses
        allowDirectCalls: {
            allowCalls: Boolean,
            phoneNumber: String,
        },
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
