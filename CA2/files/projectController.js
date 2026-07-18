const mongoose = require("mongoose");
const Project = require("../models/Project");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors: messages });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `A project with registration number '${req.body.registrationNumber}' already exists`,
      });
    }
    res.status(500).json({ success: false, message: "Server error while creating project", error: error.message });
  }
};

// @desc    Retrieve all project submissions
// @route   GET /api/projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching projects", error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID format" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project submission not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching project", error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID format" });
    }

    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true, 
      runValidators: true, 
      overwrite: false,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project submission not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors: messages });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Registration Number must be unique" });
    }
    res.status(500).json({ success: false, message: "Server error while updating project", error: error.message });
  }
};

const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectStatus } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID format" });
    }

    if (!projectStatus) {
      return res.status(400).json({ success: false, message: "projectStatus is required in the request body" });
    }

    if (!Project.ALLOWED_STATUSES.includes(projectStatus)) {
      return res.status(400).json({
        success: false,
        message: `projectStatus must be one of: ${Project.ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { projectStatus },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project submission not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while updating status", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID format" });
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project submission not found" });
    }

    res.status(200).json({ success: true, message: "Project submission deleted successfully", data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while deleting project", error: error.message });
  }
};

const getProjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!Project.ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${Project.ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const projects = await Project.find({ projectStatus: status }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching projects by status", error: error.message });
  }
};

const getProjectsByTechnology = async (req, res) => {
  try {
    const { tech } = req.params;

    const projects = await Project.find({
      technologyUsed: { $regex: tech, $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching projects by technology", error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getProjectsByStatus,
  getProjectsByTechnology,
};
