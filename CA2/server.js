const express=require("express");
const mongoose=require("mongoose");
const app=express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/projects");

const projectSchema=new mongoose.Schema({
 studentName:{type:String,required:true},
 registrationNumber:{type:String,required:true},
 projectTitle:{type:String,required:true},
 technologyUsed:{type:String,required:true},
 submissionDate:{type:Date,required:true},
 projectStatus:{type:String,required:true}
});

const Project=mongoose.model("Project",projectSchema);

app.post("/projects",async(req,res)=>{
 const p=await Project.create(req.body);
 res.status(201).json(p);
});

app.get("/projects",async(req,res)=>{
 res.json(await Project.find());
});

app.get("/projects/:id",async(req,res)=>{
 res.json(await Project.findById(req.params.id));
});

app.put("/projects/:id",async(req,res)=>{
 res.json(await Project.findByIdAndUpdate(req.params.id,req.body,{new:true}));
});

app.patch("/projects/:id/status",async(req,res)=>{
 res.json(await Project.findByIdAndUpdate(req.params.id,{projectStatus:req.body.projectStatus},{new:true}));
});

app.delete("/projects/:id",async(req,res)=>{
 await Project.findByIdAndDelete(req.params.id);
 res.json({message:"Deleted"});
});

app.get("/status/:status",async(req,res)=>{
 res.json(await Project.find({projectStatus:req.params.status}));
});

app.get("/technology/:tech",async(req,res)=>{
 res.json(await Project.find({technologyUsed:req.params.tech}));
});

app.listen(3000);
