const jwt = require("jsonwebtoken");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var db = require("./db.js");
var app = express();
const ldap = require("ldapjs");
const cors = require("cors");
const ProjectServices = require("./ProjectServices/ProjectServices.js");
const EmployeeServices = require("./EmployeeServices/EmployeeServices.js");
const AssignmentServices = require("./AssignmentServices/AssignmentServices.js");
const SupervisorServices = require("./SupervisorServices/SupervisorServices.js");
const JWTSigner = require("./JWTTools.js");
const { verifyJWT } = require("./middleware/verifyAuth.js");

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const ldapConfig = {
  url: process.env.LDAP_URL,
  bindDN: process.env.LDAP_BINDDN,
  bindCredentials: process.env.LDAP_BINDCREDENTIAL,
};

async function authenticateLDAPUser(username, password) {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: ldapConfig.url,
    });

    client.bind(`${username}@intern.promatis.de`, password, function (err) {
      client.unbind();
      if (err) {
        console.log("LDAP Login failed: " + err);
        reject(err.lde_message);
      } else {
        resolve(username);
      }
    });
  });
}

app.post("/auth/authenticate", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authenticateLDAPUser(username, password);
    const token = JWTSigner.generateAccessToken({ username: user });
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    console.log("LDAP Connection failed");
    res.status(401).json({ error: "Login failed!" });
  }
});

app.use("/api/*", verifyJWT);

app.get("/api/apiRefresh", async (req, res) => {
  // const { username, password } = req.body;
  try {
    const token = JWTSigner.generateAccessToken({ username: req.decoded.username });
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    console.log("LDAP Connection failed");
    res.status(401).json({ error: "Login failed!" });
  }
});

app.get("/api/supervisor/view", async (req, res) => {
  try {
    let supervisorData = await SupervisorServices.viewSupervisorByUsername(
      req.decoded.username
    );
    res.status(200).json({ supervisorData: supervisorData });
  } catch (e) {
    console.log("error at /api/supervisor/view");
    console.log(e);
    res.status(500);
  }
});

// app.listen(3001, '127.0.0.1');
const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//  EMPLOYEES ENDPOINTS //
app.post("/api/employee/view", async (req, res) => {
  try {
    let id = req.body.id;
    let employeeData = await EmployeeServices.viewEmployeeByID(id);
    res.status(200).json({ employeeData: employeeData });
  } catch (e) {
    console.log("error at /api/employee/view");
    res.status(500);
  }
});

app.get("/api/employee/viewall", async (req, res) => {
  try {
    const seeAllEmployees = req.query.seeAllEmployees;
    const supervisor_id = req.query.supervisor_id;
    let employeesData = await EmployeeServices.viewAllEmployees(
      seeAllEmployees,
      supervisor_id
    );
    res.status(200).json({ employeesData: employeesData }).end();
  } catch (e) {
    console.log(e);
    console.log("error at /api/employee/viewall");
    res.status(500);
  }
});

app.post("/api/employee/add", async (req, res) => {
  try {
    let newEmployee = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      supervisor_id: req.body.supervisor_id,
    };
    await EmployeeServices.AddNewEmployee(newEmployee);
    res.status(200).end();
  } catch (e) {
    console.log("error at /api/employee/add ", e);
    res.status(500);
  }
});

//  PROJECTS ENDPOINTS //
app.post("/api/project/view", async (req, res) => {
  try {
    let id = req.body.id; // <--- war auskommentiert
    let projectData = await ProjectServices.viewProjectByID(id); // <---- war auskommentiert
    res.status(200).json({ projectData: projectData });  // <----- war auskommentiert
  } catch (e) {
    console.log("error at /api/project/view");
    res.status(500);
  }
});

app.get("/api/project/viewall", async (req, res) => {
  try {
    const supervisor_id = req.query.supervisor_id;
    let projectsData = await ProjectServices.viewAllProjects(supervisor_id);
    res.status(200).json({ projectsData: projectsData }).end();
  } catch (e) {
    console.log(e);
    console.log("error at /api/project/viewall");
    res.status(500);
  }
});

app.post("/api/project/add", async (req, res) => {
  try {
    await ProjectServices.AddNewProject(req.body);
    res.status(200).end();
  } catch (e) {
    console.log("error at /api/project/add ", e);
    res.status(500);
  }
});

app.post("/api/project/edit", async (req, res) => {
  try {
    await ProjectServices.editProject(req.body);
    res.status(200).end();
  } catch (e) {
    console.log("error at /api/project/edit ", e);
    res.status(500);
  }
});

//  ASSIGNMENTS ENDPOINTS //
app.post("/api/assignment/add", async (req, res) => {
  try {
    await AssignmentServices.AddNewAssignment(req.body);
    res.status(200).end();
  } catch (e) {
    console.log("error at /api/assignment/add ", e);
    res.status(500);
  }
});

app.post("/api/assignment/edit", async (req, res) => {
  try {
    await AssignmentServices.EditAssignment(req.body);
    res.status(200).end();
  } catch (e) {
    console.log("error at /api/assignment/edit ", e);
    res.status(500);
  }
});
app.post("/api/assignment/delete", async (req, res) => {
  try {
    await AssignmentServices.DeleteAssignment(req.body.assignID);
    res.status(200).end();
  } catch (e) {
    console.log("error at /api/assignment/delete ", e);
    res.status(500);
  }
});

app.get("/api/test", async (req, res) => {
  let connection = await db.connection();
  let sql = "DELETE FROM weeks";
  let data = await connection.execute(sql);
  sql = "DELETE FROM assignments";
  data = await connection.execute(sql);
  await connection.close();
  res.status(200).end();
});

// A folder path for static files (buildPath) is also defined and a default route is created, to serve HTML files from this folder.
// buildPath = "/var/nodejs01.intern.promatis.de/workforce-planner/build";
// app.use(express.static(buildPath));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(buildPath, 'index.html'));
// }); 

module.exports = app;