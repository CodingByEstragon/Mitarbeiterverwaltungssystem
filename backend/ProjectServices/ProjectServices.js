const db = require("../db.js");
require("dotenv").config();

module.exports = {
  async viewProjectByID(id) {
    let connection = await db.connection();
    //    sql = `SELECT * FROM employees WHERE id = ${id};`;
    //    const data = await connection.execute(sql);
    await connection.close();
    return data;
  },

  async viewAllProjects(supervisor_id) {
    let connection = await db.connection();
    const sql = `SELECT * FROM projects_wfp WHERE supervisor_id = :supervisorID OR (supervisor_id <> :supervisorID AND is_private = 0) ORDER BY project_name ASC`;
    const data = await connection.execute(sql, {
      supervisorID: supervisor_id,
    });
    await connection.close();
    return data.rows;
  },

  async AddNewProject(newProject) {
    let connection = await db.connection();
    const sql = `INSERT INTO projects_wfp (supervisor_id, project_name, description, budget, deadline, allocated_hours, color, is_private) VALUES (:supervisor_id, :project_name, :description, :budget, TO_DATE(:deadline, 'YYYY-MM-DD'), :allocated_hours, :color, :is_private)`;
    await connection.execute(sql, newProject, {
      autoCommit: true,
    });

    await connection.close();
    return {};
  },

  async editProject(projectData) {
    let connection = await db.connection();
    let sql = `
         UPDATE projects_wfp
         SET 
            project_name = :project_name, 
            description = :description, 
            budget = :budget, 
            deadline = TO_DATE(:deadline, 'YYYY-MM-DD'), 
            allocated_hours = :allocated_hours, 
            color = :color, 
            is_private = :is_private
         WHERE 
            id = :projectID
      `;

    let bindvars = {
      project_name: projectData.project_name,
      description: projectData.description,
      budget: projectData.budget,
      deadline: projectData.deadline,
      allocated_hours: projectData.allocated_hours,
      color: projectData.color,
      is_private: projectData.is_private,
      projectID: projectData.projectID,
    };

    await connection.execute(sql, bindvars, { autoCommit: true });

    await connection.close();
    return {};
  },
};