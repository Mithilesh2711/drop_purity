const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const accountSchema = new Schema({
    
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    earned: {
        type: Number,
        default:0
    },
    flow:[
        {   
            fid: {
                type: Number,
                min:0
            },
            initialReading: {
                type: Number,
                min:0,
                required:true
            },
            finalReading: {
                type: Number,
                min:0,
                required:true
            },
            expectedTotal: {
                type: Number,
                required:true
            },
            cash: {
                type: Number,
                required:true
            },
            online: {
                type: Number,
                required:true
            },
            duesOut: {
                type: Number,
                required:true
            },
            duesIn: {
                type: Number,
                required:true
            },
            netDues: {
                type: Number,
                required:true
            },
            tokenOut: {
                type: Number,
                required:true
            },
            tokenIn: {
                type: Number,
                required:true
            },
            netToken: {
                type: Number,
                required:true
            },
            error: {
                type: Number,
                required:true
            },
            receivedTotal: {
                type: Number,
                required:true
            },
            year: {
                type: Number,
                required:true
            },
            month: {
                type: Number,
                required:true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }, {
            timestamps:{ currentTime: () => Math.floor(Date.now() / 1000) }
        }
    ]

});

var Accounts = mongoose.model('Account', accountSchema);

module.exports = Accounts;