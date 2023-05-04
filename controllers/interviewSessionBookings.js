const InterviewSessionBooking = require('../models/InterviewSessionBooking');
const Company = require('../models/Company')

//desc      Get all InterviewSessionBookings
//@route    GET /api/v1/interviewsessionbooking
//@access   Public
exports.getBookings=async (req,res,next)=>{
    let query;
    let companyId = req.params.companyId;

    //General users can see only their InterviewSessionBookings!
    if(req.user.role !== 'admin'){
        if(companyId)
        query=InterviewSessionBooking.find({user:req.user.id, company:companyId}).populate({
            path: 'company',
            // select: 'name province tel'
        });
        else
        query=InterviewSessionBooking.find({user:req.user.id}).populate({
            path: 'company',
            // select: 'name province tel'
        });
    }else{ //If you are an admin, you can see all!
        if(companyId)
        query=InterviewSessionBooking.find({company:companyId}).populate({
            path: 'company',
            // select: 'name province tel'
        });
        else
        query=InterviewSessionBooking.find().populate({
            path: 'company',
            // select: 'name province tel'
        });

    }

    try{
        const Bookings= await query;

        res.status(200).json({
            success:true,
            count:Bookings.length,
            data: Bookings
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find InterviewSessionBooking"});
    }
};

//desc      Get single InterviewSessionBooking
//@route    GET /api/v1/interviewsessionbooking/:id
//@access   Public
// exports.getBooking=async (req,res,next)=>{
//     try{
//         const interviewSessionBooking= await InterviewSessionBooking.findById(req.params.id).populate({
//             path: 'company',
//             //select: 'name description tel'
//         });

//         if(!interviewSessionBooking){
//             return res.status(404).json({success:false, message:`No interviewSessionBooking with the id if ${req.params.id}`});
//         }

//         res.status(200).json({
//             success:true,
//             data: interviewSessionBooking
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:"Cannot find interviewSessionBookings"});
//     }
// };

//desc      Add single InterviewSessionBooking
//@route    POST /api/v1/hospitals/:interviewSessionBookingId/interviewsessionbooking/
//@access   Private
exports.addBooking=async (req,res,next)=>{
    try{
        req.body.company = req.params.companyId;

        const company = await Company.findById(req.params.companyId);
        if(!company){
            return res.status(404).json({success:false, message:`No hospital with the id of ${req.params.interviewSessionBookingId}`});
        }

        //add user Id to req.body
        req.body.user = req.user.id;
        
        //Check for existed appointment
        const existedInterviewSessionBookings = await InterviewSessionBooking.find({user:req.user.id});

        //If the user is not an admin, they can only create 3 InterviewSessionBookings.
        if(existedInterviewSessionBookings.length >= 3 ){ //&& req.body.role !== 'admin'){
            return res.status(400).json({success:false, message:`The user with ID ${req.user.id} has already made 3 interviewSessionBookings`})
        }
        const interviewSessionBooking = await InterviewSessionBooking.create(req.body);
        
        res.status(200).json({
            success:true,
            data: interviewSessionBooking
        });
    }catch(error){
        console.log(error);
        res.status(500).json({success:false, message:"Cannot create InterviewSessionBooking"});
    }
};

//desc      Update InterviewSessionBooking
//@route    PUT /api/v1/interviewsessionbooking/:id
//@access   Private
exports.updateBooking=async (req,res,next)=>{
    try{
        let interviewSessionBooking = await InterviewSessionBooking.findById(req.params.id);

        if(!interviewSessionBooking){
            return res.status(404).json({success:false, message:`No interviewSessionBooking with the id of ${req.params.id}`});
        }

        //Make sure user is the appointment owner
        if(interviewSessionBooking.user.toString()!== req.user.id && req.user.role!== 'admin'){
            res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to update this interviewSessionBooking`});
        }

        interviewSessionBooking = await InterviewSessionBooking.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});

        res.status(200).json({
            status:true,
            data: interviewSessionBooking
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot update InterviewSessionBooking"});
    }
};

//desc      Delete InterviewSessionBooking
//@route    DELETE /api/v1/interviewsessionbooking/:id
//@access   Private
exports.deleteBooking=async (req,res,next)=>{
    try{
        let interviewSessionBooking = await InterviewSessionBooking.findById(req.params.id);

        if(!interviewSessionBooking){
            return res.status(404).json({success:false, message:`No interviewSessionBooking with the id of ${req.params.id}`});
        }

        //Make sure user is the appointment owner
        if(interviewSessionBooking.user.toString()!== req.user.id && req.user.role!== 'admin'){
            res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to delete this interviewSessionBooking`});
        }

        await interviewSessionBooking.remove();

        res.status(200).json({
            status:true,
            data: {}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot delete InterviewSessionBooking"});
    }
};