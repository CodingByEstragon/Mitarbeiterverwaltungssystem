import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./MainBoardContent.css";
import UserCard from "../UserCard/UserCard";

function MainBoardContent({
   selectedDate,
   employeeSelected,
   setEmployeeSelected,
}) {
   // Function to handle rearrangement of cards after drag and drop
   const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
   };

   const handleOnDragEnd = (result) => {
      if (!result.destination)
         return;

      const items = reorder(
         employeeSelected,
         result.source.index,
         result.destination.index
      );

      setEmployeeSelected(items);
   };

   //const divRef = useRef(null);

   return (
      <div
         // ref={divRef}
         className="scrollableMainBoard"
         // onWheel={(e) => {
         //    e.preventDefault();
         //    divRef.current.scrollLeft += e.deltaY;
         // }}
      >
         <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="cards" direction="horizontal">
               {(provided) => (
                  <div
                     className="MainBoardContent"
                     {...provided.droppableProps}
                     ref={provided.innerRef}
                  >
                     {employeeSelected?.map(
                        ({ ID, FIRST_NAME, LAST_NAME }, index) => (
                           <Draggable
                              key={ID}
                              draggableId={ID.toString()}
                              index={index}
                           >
                              {(provided) => (
                                 <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                 >
                                    <UserCard
                                       selectedDate={selectedDate}
                                       setEmployeeSelected={setEmployeeSelected}
                                       employeeSelected={employeeSelected}
                                       id={ID}
                                       name={FIRST_NAME + " " + LAST_NAME}
                                    />
                                 </div>
                              )}
                           </Draggable>
                        )
                     )}
                     {provided.placeholder}
                  </div>
               )}
            </Droppable>
         </DragDropContext>
      </div>
   );
}

export default MainBoardContent;