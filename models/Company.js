const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true, 'Please add an address']
    },
    website:{
        type: String,
        required: [true, 'Please add a website']
    },
    description:{
        type: String,
    },
    tel:{
        type: String,
        required: [true, 'Please add a telephone number']
    },
}
,{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
}
);

//Cascade delete InterviewSessionBooking when a hospital is deleted
CompanySchema.pre('remove',async function(next){
    console.log(`InterviewSessionBooking being removed from hospital ${this._id}`);
    await this.model('InterviewSessionBooking').deleteMany({hospital: this._id});
    next();
});

//Reverse populate with virtuals
CompanySchema.virtual('interviewsessionbookings',{
    ref: 'InterviewSessionBooking',
    localField: '_id',
    foreignField: 'company',
    justOne:false
});

module.exports = mongoose.model('Company', CompanySchema);