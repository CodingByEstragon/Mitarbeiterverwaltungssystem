const db = require("../db.js");
require("dotenv").config();
const oracledb = require("oracledb");

module.exports = {
  async AddNewAssignment(assignmentData) {
    let connection = await db.connection();

    let assignmentSql = `INSERT INTO assignments_wfp (project_id, employee_id, type, number_of_days_per_week, number_of_weeks_total)
            VALUES (:project_id, :employee_id, :type, :number_of_days_per_week, :number_of_weeks_total)
            RETURNING id INTO :id`;

    let assignmentVars = {
      project_id: assignmentData.project_id,
      employee_id: assignmentData.employee_id,
      type: assignmentData.type,
      number_of_days_per_week: assignmentData.number_of_days_per_week,
      number_of_weeks_total: assignmentData.number_of_weeks_total,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    };

    let assignmentResult = await connection.execute(
      assignmentSql,
      assignmentVars,
      {
        autoCommit: false, // Don't commit yet. We'll commit after all weeks have been inserted.
      }
    );

    let assignmentId = assignmentResult.outBinds.id[0];

    const { weeks } = assignmentData;

    for (let week of weeks) {
      let weekSql = `INSERT INTO weeks_wfp (start_week, duration, assignment_id) VALUES (TO_DATE(:start_week, 'DD-MM-YYYY'), :duration, :assignment_id)`;

      let weekVars = {
        start_week: week.start_week,
        duration: week.duration,
        assignment_id: assignmentId,
      };

      await connection.execute(weekSql, weekVars, { autoCommit: false }); // Don't commit yet. We'll commit after all weeks have been inserted.
    }

    await connection.commit();
    await connection.close();

    return {};
  },

  async EditAssignment(assignmentData) {
    let connection = await db.connection();

    let deleteAssignmentSql = `DELETE FROM assignments_wfp WHERE id = :assignId`;
    let deleteWeeksSql = `DELETE FROM weeks_wfp WHERE assignment_id = :assignId`;

    // Delete the old assignment and its associated weeks
    await connection.execute(
      deleteWeeksSql,
      { assignId: assignmentData.assignId },
      { autoCommit: false }
    );
    await connection.execute(
      deleteAssignmentSql,
      { assignId: assignmentData.assignId },
      { autoCommit: false }
    );
    // Recreate the assignment
    let assignmentSql = `INSERT INTO assignments_wfp (project_id, employee_id, type, number_of_days_per_week, number_of_weeks_total)
              VALUES (:project_id, :employee_id, :type, :number_of_days_per_week, :number_of_weeks_total)
              RETURNING id INTO :id`;

    let assignmentVars = {
      project_id: assignmentData.project_id,
      employee_id: assignmentData.employee_id,
      type: assignmentData.type,
      number_of_days_per_week: assignmentData.number_of_days_per_week,
      number_of_weeks_total: assignmentData.number_of_weeks_total,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    };

    let assignmentResult = await connection.execute(
      assignmentSql,
      assignmentVars,
      {
        autoCommit: false, // Don't commit yet. We'll commit after all weeks have been inserted.
      }
    );

    let assignmentId = assignmentResult.outBinds.id[0];

    const { weeks } = assignmentData;

    for (let week of weeks) {
      let weekSql = `INSERT INTO weeks_wfp (start_week, duration, assignment_id) VALUES (TO_DATE(:start_week, 'DD-MM-YYYY'), :duration, :assignment_id)`;

      let weekVars = {
        start_week: week.start_week,
        duration: week.duration,
        assignment_id: assignmentId,
      };

      await connection.execute(weekSql, weekVars, { autoCommit: false }); // Don't commit yet. We'll commit after all weeks have been inserted.
    }

    await connection.commit();

    await connection.close();
    return {};
  },

  async DeleteAssignment(assignID) {
    let connection = await db.connection();
    
    let deleteAssignmentSql = `DELETE FROM assignments_wfp WHERE id = :assignId`;
    let deleteWeeksSql = `DELETE FROM weeks_wfp WHERE assignment_id = :assignId`;
    
    // Delete the old assignment and its associated weeks
    
    await connection.execute(
      deleteWeeksSql,
      { assignId: assignID },
      { autoCommit: false }
    );
    await connection.execute(
      deleteAssignmentSql,
      { assignId: assignID },
      { autoCommit: false }
    );
    await connection.commit();
    await connection.close();

    return {};
  },
};