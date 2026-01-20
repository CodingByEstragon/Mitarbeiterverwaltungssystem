const db = require("../db.js");
require("dotenv").config();
const oracledb = require("oracledb");

module.exports = {
  async viewUserByID(id) {
    let connection = await db.connection();
    sql = `SELECT * FROM employees_wfp WHERE id = ${id};`;
    const data = await connection.execute(sql);
    await connection.close();
    return data;
  },

  async viewAllEmployees(seeAllEmployees, supervisor_id) {
    let connection = await db.connection();

    let sql;
    let usersResult;
    if (seeAllEmployees === "true") {
      sql = "SELECT * FROM employees_wfp ORDER BY first_name ASC";
      usersResult = await connection.execute(sql);
    } else {
      sql = `SELECT * FROM employees_wfp WHERE supervisor_id = :supervisorID ORDER BY first_name ASC`;
      usersResult = await connection.execute(sql, {
        supervisorID: supervisor_id,
      });
    }

    let users = usersResult.rows;
    for (let user of users) {
      const assignmentsSql = `SELECT * FROM assignments_wfp WHERE employee_id = :employee_id`;
      let assignmentsResult = await connection.execute(
        assignmentsSql,
        [user.ID],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      let assignments = assignmentsResult.rows;

      for (let assignment of assignments) {
        const weeksSql = `SELECT * FROM weeks_wfp WHERE assignment_id = :assignment_id`;
        let weeksResult = await connection.execute(weeksSql, [assignment.ID], {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
        console.log(weeksResult.rows);
        assignment.weeks = weeksResult.rows;
      }

      user.assignments = assignments;
    }

    await connection.close();
    return users;
  },

  async AddNewEmployee(newEmployee) {
    let connection = await db.connection();
    const sql = `INSERT INTO employees_wfp (first_name, last_name, email, supervisor_id) VALUES (:firstName, :lastName, :email, :supervisor_id)`;
    await connection.execute(sql, newEmployee, {
      autoCommit: true,
    });
    await connection.close();
    return {};
  },
};