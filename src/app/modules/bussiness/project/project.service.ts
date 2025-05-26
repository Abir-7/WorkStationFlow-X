/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import status from "http-status";
import AppError from "../../../errors/AppError";
import User from "../../users/user/user.model";

import { IProject, IProjectPhase } from "./project.interface";
import { Project } from "./project.model";
import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";

const addProject = async (data: Partial<IProject>, userId: string) => {
  const userData = await User.findById(userId);

  if (userData?.role !== "LEADER") {
    throw new AppError(status.BAD_REQUEST, "Only leader can add project");
  }

  const addNewProject = await Project.create({
    ...data,
    teamId: userData?._id,
  });

  return addNewProject;
};

const updateProject = async (
  projectId: string,
  data: Partial<IProject>,
  userId: string
) => {
  const userData = await User.findById(userId);
  if (userData?.role !== "LEADER") {
    throw new AppError(status.BAD_REQUEST, "Only leader can update project");
  }

  const projectData = await Project.findById(projectId);
  if (!projectData) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  const { phases, ...other } = data;

  const filteredData = removeFalsyFields(other) as Omit<IProject, "phases">;
  Object.assign(projectData, filteredData);

  if (phases && phases?.length > 0) {
    for (const newPhase of phases!) {
      if (newPhase._id) {
        // Try to update existing phase
        const index = projectData.phases.findIndex(
          (existing) => existing._id?.toString() === newPhase._id
        );

        if (index !== -1) {
          Object.assign(projectData.phases[index], newPhase);
        } else {
          throw new Error(`Phase with ID ${newPhase._id} not found`);
        }
      } else {
        // Add new phase
        projectData.phases.push(newPhase as IProjectPhase);
      }
    }
  }

  return await projectData.save();
};

export const ProjectService = {
  addProject,
  updateProject,
};
