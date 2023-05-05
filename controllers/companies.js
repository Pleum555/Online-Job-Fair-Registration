const { query } = require('express');
const Company = require('../models/Company');

//@desc     Get all Companys
//@route    GET /api/Online-Job-Fair/Companys
//@access   Public
exports.getCompanies= async (req,res,next)=>{
    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields=['select','sort'];
    
    //Loop over remove feilds and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);

    //Create query string
    let queryStr=JSON.stringify(reqQuery);

    //Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    //finding resource
    query= Company.find(JSON.parse(queryStr))//.populate('interviewsessionbookings');

    // Select Fields
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    try{
        //Executing query
        const Companies = await query;

        res.status(200).json({success:true, data:Companies});
    }catch(err) {
        res.status(400).json({success:false});
    }
};

//@desc     Get single Company
//@route    GET /api/Online-Job-Fair/Companys/:id
//@access   Public   
exports.getCompany= async (req,res,next)=>{
    try{
        const company = await Company.findById(req.params.id).populate('interviewsessionbookings');
        if(!company) {
            return res.status(400).json({success:false});
        }

        //finding resource
        // company = company.populate('interviewsessionbookings');

        res.status(200).json({success:true, data:company});
    }catch(err) {
        res.status(400).json({success:false});
    }
};

//@desc Create new Company
//@route    POST /api/Online-Job-Fair/Companys
//@access   Private
exports.createCompany= async (req,res,next)=>{
    const company = await Company.create(req.body);
    res.status(201).json({
        success: true, 
        data: company
    });
};

//@desc     Update Company
//@route    PUT /api/Online-Job-Fair/Companys/:id
//@access   Private
exports.updateCompany= async (req,res,next)=>{
    try{
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if(!company){
            return res.status(400).json({sucess: false});
        }

        res.status(200).json({success: true, data: company});
    }catch(err) {
        res.status(400).json({success: false});
    }
};

//@desc     Delete Company
//@route    DELETE /api/Online-Job-Fair/Companys/:id
//@access   Private   
exports.deleteCompany= async (req,res,next)=>{
    try{
        const company = await Company.findById(req.params.id);

        if(!company) {
            return res.status(404).json({success: false, message: `Bootcamp not found with id of ${req.params.id}`});
        }

        company.remove();
        res.status(200).json({success:true, data: {}});
    }catch(err) {
        res.status(400).json({success: false});
    }
};