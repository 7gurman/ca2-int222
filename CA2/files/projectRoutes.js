const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getProjectsByStatus,
  getProjectsByTechnology,
} = require("../controllers/projectController");



router.get("/status/:status", getProjectsByStatus);

router.get("/technology/:tech", getProjectsByTechnology);


router.route("/").post(createProject).get(getAllProjects);


router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

router.patch("/:id/status", updateProjectStatus);

module.exports = router;
