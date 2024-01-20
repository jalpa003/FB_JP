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
        streetAddress: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
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
        workplaceSafety: {
            type: Boolean,
            default: false
        },
        customerService: {
            type: Boolean,
            default: false
        },
        barTending: {
            type: Boolean,
            default: false
        },
        barista: {
            type: Boolean,
            default: false
        },
        fineDining: {
            type: Boolean,
            default: false
        },
    },
    experience: {
        type: String,
        enum: ['1-3', '3-5', '5-7', '7-10', '10+'],
    },
    languageRequirements: String,
    jobType: {
        type: String,
        enum: ['fullTime', 'partTime', 'internship', 'casual', 'seasonal'],
    },
    hoursPerWeek: Number,
    workSchedule: {
        weekDayAvailability: {
            type: Boolean,
            default: false,
        },
        weekendAvailability: {
            type: Boolean,
            default: false,
        },
        dayShift: {
            type: Boolean,
            default: false,
        },
        eveningShift: {
            type: Boolean,
            default: false,
        },
        onCall: {
            type: Boolean,
            default: false,
        },
        holidays: {
            type: Boolean,
            default: false,
        },
    },
    preferredStartDate: Date,
    numberOfPositions: Number,
    showWageRate: {
        type: Boolean,
        default: false,
    },
    payAmount: {
        type: String,
    },
    payRate: {
        type: String,
        enum: ['perHour', 'perYear']
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
    closeReason: {
        type: String,
        enum: [
            'filled_through_tastetalent',
            'filled_internally',
            'filled_from_another_source',
            'no_longer_needed'
        ],
        default: null, // Default to null until the job is closed
    },
    closedAt: {
        type: Date,
        default: null, // Default to null until the job is closed
    },
    isClosed: {
        type: Boolean,
        default: false,
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
    appliedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;