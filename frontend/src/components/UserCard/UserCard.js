import "./UserCard.css";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { format } from "date-fns";
//import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import ContentCard from "./ContentCard.jsx";

function UserCard({
   setEmployeeSelected,
   employeeSelected,
   id,
   name,
   selectedDate,
}) {

   // In dieser Funktion wird der Januar nicht angezeigt da erscheint ein weiße Usercard
   // function getWorkingWeeks(month, year) {
   //    let date = new Date(year, month - 1, 1);

   //    while (date.getDay() !== 1) {
   //       date.setDate(date.getDate() - 1);
   //    }


   //    // if (month === 1) {
   //    //    date.setDate(1);
   //    // } 
   //    // else {
   //    //    while (date.getDay() !== 1) {
   //    //      date.setDate(date.getDate() - 1);
   //    //    }
   //    // }

   //    let weeks = [];
   //    while (
   //       (date.getFullYear() === year && date.getMonth() <= month - 1) ||
   //       (date.getFullYear() === year + 1 && date.getMonth() === 0)
   //    ) {
   //       let startOfWeek = new Date(date.getTime());
   //       let endOfWeek = new Date(date.getTime());
   //       endOfWeek.setDate(endOfWeek.getDate() + 4);
         
   //       if (
   //          (startOfWeek.getMonth() === month - 1 &&
   //             endOfWeek.getMonth() === month - 1) ||
   //          (startOfWeek.getMonth() === month - 2 &&
   //             endOfWeek.getMonth() === month - 1) ||
   //          (startOfWeek.getMonth() === month - 1 &&
   //             endOfWeek.getMonth() === month)
   //       ) {
   //          weeks.push({
   //             year: startOfWeek.getFullYear().toString(),
   //             startDay: ("0" + startOfWeek.getDate()).slice(-2),
   //             startMonth: ("0" + (startOfWeek.getMonth() + 1)).slice(-2),
   //             endDay: ("0" + endOfWeek.getDate()).slice(-2),
   //             endMonth: ("0" + (endOfWeek.getMonth() + 1)).slice(-2),
   //          });
   //       }
   //       date.setDate(date.getDate() + 7);
   //    }
   //    return weeks;
   // }

   // ---------------------------------------------------------------------------------------

   // die Funktion neu bearbeitet und hinzugefügt 31.10.2023 <-- so funktioniert es ordnungsgemäß
   function getWorkingWeeks(month, year) {
      let date = new Date(year, month - 1, 1);

      while (date.getDay() !== 1) {
         date.setDate(date.getDate() - 1);
      }

      let weeks = [];
      //let currentYear = date.getFullYear();
      //let currentMonth = date.getMonth();
      let weekCount = 0;

      while (weekCount < 5) {
         let startOfWeek = new Date(date.getTime());

         // Find next Friday
         let endOfWeek = new Date(date.getTime());
         while (endOfWeek.getDay() !== 5) {
            endOfWeek.setDate(endOfWeek.getDate() + 1);
         }

         weeks.push({
            year: startOfWeek.getFullYear().toString(),
            startDay: ("0" + startOfWeek.getDate()).slice(-2),
            startMonth: ("0" + (startOfWeek.getMonth() + 1)).slice(-2),
            endDay: ("0" + endOfWeek.getDate()).slice(-2),
            endMonth: ("0" + (endOfWeek.getMonth() + 1)).slice(-2),
         });

         date.setDate(date.getDate() + 7);
         weekCount++;
      }

      return weeks;
   }
   // ---------------------------------------------------------------------------------------
   const removeCard = (currID) => {
      var tempcardData = [...employeeSelected];
      tempcardData = tempcardData.filter((elem) => {
         return elem.ID !== currID;
      });
      setEmployeeSelected(tempcardData);
   };

   return (
      <div className="userCard">
         <div className="headerCard">
            <p className="cardTitle">{name}</p>
            <div className="closeCardIcon">
               <IconButton onClick={() => removeCard(id)}>
                  <CloseIcon />
               </IconButton>
            </div>
         </div>
         <div className="contentCard">
            <div>
               {getWorkingWeeks(
                  Number(format(selectedDate, "yyyy-MM").split("-")[1]),
                  Number(format(selectedDate, "yyyy-MM").split("-")[0])
               ).map((week, index) => (
                  <ContentCard
                     key={index}
                     week={week}
                     id={id}
                     name={name}
                     year={Number(
                        format(selectedDate, "yyyy-MM").split("-")[0]
                     )}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}

export default UserCard;