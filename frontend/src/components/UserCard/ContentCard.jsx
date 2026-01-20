import "./UserCard.css";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { useDrop } from "react-dnd";
import { useState } from "react";
import AddAssignmentForm from "../utils/AddAssignmentForm/AddAssignmentForm";
import { useSelector } from "react-redux";
import EditAssignmentDialog from "../utils/EditAssignmentDialog/EditAssignmentDialog";

function ContentCard({ week, id, name }) {
  function getOppositeColor(hexColor) {
    hexColor = hexColor.replace("#", "");

    let r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);

    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    r = r.toString(16).padStart(2, "0");
    g = g.toString(16).padStart(2, "0");
    b = b.toString(16).padStart(2, "0");

    return "#" + r + g + b;
  }

  /**** Get Assignment ****/

  /*** MODAL STATES ****/
  const [openModal, setOpenModal] = useState(false);
  const handleClickOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openEditAssignmentModal, setOpenEditAssignmentModal] = useState(false);
  const activateEditAssignmentModal = () => {
    setOpenEditAssignmentModal(true);
  };
  const handleEditAssignmentCloseModal = (e) => {
    e.stopPropagation();
    setOpenEditAssignmentModal(false);
  };

  const [selectedAssignment, setSelectedAssignment] = useState(0);

  /*** MODAL STATES ****/
  const employees = useSelector((state) => state.employees.value);
  const projects = useSelector((state) => state.projects.value);
  const [project, setProject] = useState("");

  const [{ isOver }, dropref] = useDrop({
    accept: "project",
    drop: (item, monitor) => {
      setProject(monitor.getItem().project);
      console.log("Dropped project", monitor.getItem().project);
      console.log("user ID:", id);
      console.log(
        `week info: ${week.startDay}/${week.startMonth} - ${week.endDay}/${week.endMonth}`
      );
      handleClickOpenModal();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  
  const currentEmployee = employees.filter((employee) => employee.ID === id)[0];
  const [busyTimePercentage, setBusyTimePercentage] = useState(0);

  function CurrentWeeksAssignments() {
    
    let res = [];
    let assignments = currentEmployee?.assignments || [];

    for (let index = 0; index < assignments.length; index++) {
      let temp = assignments[index].weeks.filter(
        (el) =>
          new Date(el.START_WEEK)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-") ===
          `${week.startDay}-${week.startMonth}-${week.year}`
      );

      if (temp.length > 0) {
        let project = projects.find((elproject) => elproject.ID === assignments[index].PROJECT_ID);

        // PROJECT_NAME: project.PROJECT_NAME,
        // COLOR: project.COLOR,
        if (project) {
          res.push({
            assignment_id: assignments[index].ID,
            PROJECT_ID: assignments[index].PROJECT_ID,
            TYPE: assignments[index].TYPE,
            PROJECT_NAME: projects.filter(
             (elproject) => elproject.ID === assignments[index].PROJECT_ID
           )[0].PROJECT_NAME,
           COLOR: projects.filter(
             (elproject) => elproject.ID === assignments[index].PROJECT_ID
           )[0].COLOR,
            PROJECT_NAME_FROM_PROJECT: project.PROJECT_NAME,
            COLOR_FROM_PROJECT: project.COLOR,
            NUMBER_OF_DAYS_PER_WEEK: assignments[index].NUMBER_OF_DAYS_PER_WEEK,
            NUMBER_OF_WEEKS_TOTAL: assignments[index].NUMBER_OF_WEEKS_TOTAL,
            DURATION: temp[0].DURATION,
          });
        }
      }
    }

    let sum = 0;
    res.forEach((el) => {
      sum += el.DURATION;
    });
    setBusyTimePercentage((sum * 100) / 40);

    return (
      <>
        {res.map((el, index) => (
          <div
            key={index}
            className="dayBar"
            style={{
              backgroundColor: el.COLOR,
              height: `${Number((el.DURATION * 100) / 56)}%`,
              important: "true",
              color: getOppositeColor(el.COLOR),
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAssignment(index);
              activateEditAssignmentModal();
            }}
          >
            {el.PROJECT_NAME}
          </div>
        ))}
        {res[selectedAssignment] !== undefined && (
          <EditAssignmentDialog
            assignment_Duration={currentEmployee.assignments
              .filter(
                (assign) => assign.ID === res[selectedAssignment].assignment_id
              )[0]
              .weeks.reduce((total, week) => total + week.DURATION, 0)}
            projectID={res[selectedAssignment].PROJECT_ID}
            assignId={res[selectedAssignment].assignment_id}
            projectName={res[selectedAssignment].PROJECT_NAME}
            TYPE={res[selectedAssignment].TYPE}
            NUMBER_OF_DAYS_PER_WEEK={res[selectedAssignment].NUMBER_OF_DAYS_PER_WEEK}
            NUMBER_OF_WEEKS_TOTAL={res[selectedAssignment].NUMBER_OF_WEEKS_TOTAL}
            openEditAssignmentModal={openEditAssignmentModal}
            handleEditAssignmentCloseModal={handleEditAssignmentCloseModal}
            busyTimePercentage={(sum * 100) / 40}
            week={week}
            userID={id}
          />
        )}
        <div
          className="dayBar"
          style={{
            backgroundColor: "rgba(221, 231, 230, 0.642)",
            height: `${100 - Number((sum * 100) / 56)}%`,
            important: "true",
          }}
        ></div>
      </>
    );
  }
  return (
    <div
      className="weekCard"
      ref={dropref}
      style={isOver ? { backgroundColor: "rgba(0, 0, 0, 0.1)" } : {}}
    >
      <div className="weekDate">
        <div
          style={{
            fontSize: "14px",
            fontWeight: "400",
            color: "#7D7C7C",
          }}
        >
          {week.startDay}/{week.startMonth} - {week.endDay}/{week.endMonth}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "400",
            color: Number(busyTimePercentage) > 100 ? "red" : "#7D7C7C",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CheckBoxOutlinedIcon style={{ height: "20px" }} />
          {Number(busyTimePercentage)}%
        </div>
      </div>
      <CurrentWeeksAssignments />
      <AddAssignmentForm
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        projectInfo={project}
        userID={id}
        week={week}
        busyTimePercentage={busyTimePercentage}
      />
    </div>
  );
}

export default ContentCard;
