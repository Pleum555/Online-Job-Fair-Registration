const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        require: [true, 'Please add an address']
    },
    website:{
        type: String
    },
    description:{
        type: String
    },
    tel:{
        type: String,
    },

    // district:{
    //     type: String,
    //     require: [true, 'Please add a district']
    // },
    // province:{
    //     type: String,
    //     require: [true, 'Please add a province']
    // },
    // postalcode:{
    //     type: String,
    //     require: [true, 'Please add a postalcode'],
    //     maxlength: [5, 'Postal Code can not be than 5 digits']
    // },
    
    // region:{
    //     type: String,
    //     require: [true, 'Please add a region'],
    // }
}
// ,{
//     toJSON: {virtuals:true},
//     toObject: {virtuals:true}
// }
);

//Cascade delete appointments when a hospital is deleted
// HospitalSchema.pre('remove',async function(next){
//     console.log(`Appointments being removed from hospital ${this._id}`);
//     await this.model('Appointment').deleteMany({hospital: this._id});
//     next();
// });

//Reverse populate with virtuals
// HospitalSchema.virtual('appointments',{
//     ref: 'Appointment',
//     localField: '_id',
//     foreignField: 'hospital',
//     justOne:false
// });

module.exports = mongoose.model('Company', CompanySchema);