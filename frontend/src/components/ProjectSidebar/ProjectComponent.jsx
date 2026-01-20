import "./ProjectSidebar.css";
import { useDrag } from "react-dnd";
import EditIcon from "@mui/icons-material/Edit";
import EditProjectDialog from "../utils/EditProjectDialog/EditProjectDialog";
import { useState } from "react";

export default function ProjectComponent({ project, open }) {

  const [{ isDragging }, dragRef] = useDrag({
    type: "project",
    item: { project },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const activateEditProjectModal = () => {
    setOpenModal(true);
  };

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

  return (
    <div
      ref={dragRef}
      className="projectName"
      style={
        !open
          ? {
              backgroundColor: project.COLOR,
              opacity: isDragging ? "0.5" : "1",
              color: getOppositeColor(project.COLOR),
            }
          : {
              backgroundColor: project.COLOR,
              width: "40px",
              height: "30px",
              opacity: isDragging ? "0.5" : "1",
            }
      }
    >
      {!open && <div>{project.PROJECT_NAME}</div>}
      {!open && (
        <div>
          <EditIcon
            onClick={() => activateEditProjectModal()}
            style={{ color: getOppositeColor(project.COLOR) }}
          />
        </div>
      )}
      <EditProjectDialog
        project={project}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
}