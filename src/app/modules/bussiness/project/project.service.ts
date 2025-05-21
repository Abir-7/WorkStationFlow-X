/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import User from "../../users/user/user.model";

import { IProject } from "./project.interface";
import { Project } from "./project.model";

const addProject = async (data: Partial<IProject>, userId: string) => {
  const userData = await User.findById(userId);

  const addNewProject = await Project.create({
    ...data,
    teamId: userData?._id,
  });

  return addNewProject;
};

export const ProjectService = {
  addProject,
};
