let form = document.getElementById("form");
let inputText = document.getElementById("inputText");
let selectStatus = document.getElementById("selectStatus");
let selectColor = document.getElementById("selectColor");
let endTime = document.getElementById("endTime");
let submitbtn = document.getElementById("submitbtn");
let formData = document.getElementById("form-data");


form.addEventListener("submit", (e) => {
  e.preventDefault();
  acceptData();
  submitbtn.click();
});


let data = [{}];

let acceptData = () => {

  const currentTime = new Date().getTime();
  const selectedTime = new Date(endTime.value).getTime();

  if (selectedTime < currentTime) {
    alert("Time cannot be from the past.");
    return;
  }

  data.push({
    text: inputText.value,
    status: selectStatus.value,
    color: selectColor.value,
    time2: endTime.value,
  });


  localStorage.setItem("data", JSON.stringify(data));

  createTasks();
};

// let createTasks = () => {
//   formData.innerHTML = "";
//   data.map((x, y) => {
//     const completedClass = x.status === 'done' ? 'completed' : '';
//     return (formData.innerHTML += `
//       <div class="datacontainer ${completedClass}" id=${y}>
//         <ul class="datatask" style="background-color: ${x.color}">
//           <li class="activityColumn">${x.text}</li>
//           <li style = "flex: 5% 0 0;">${x.status}</li>
//           <li style = "flex: 10% 0 0;">${formatDateTime(x.time2)}</li>
//           <li class="listaction">
//             <input type="checkbox" id="done${y}" onchange="toggleCompleted
//             (this, ${y})" ${x.status === 'done' ? 'checked' : ''}>
//             <label for="done${y}"></label>
//             <button id="editButton" onClick="editTask(this)">edit</button>
//             <li class="delete id="deleteButton"> 
//             <button id="deleteButton" onClick="deleteTask(this);createTasks()">delete</button>
//           </li>
//         </ul>
//       </div>
//     `);
//   });

//   resetForm();
// };

let createTasks = () => {
  formData.innerHTML = "";
  data.map((x, y) => {
    const completedClass = x.status === 'done' ? 'completed' : '';
    return (formData.innerHTML += `
      <div class="datacontainer ${completedClass}" id=${y}>
        <ul class="datatask" style="background-color: ${x.color}">
          <li class="activityColumn">${x.text}</li>
          <li class="statusColumn">${x.status}</li>
          <li class="dateColumn">${formatDateTime(x.time2)}</li>
          <li class="editBtnAction"><button id="editButton" onClick="editTask(this)">edit</button></li>
          <li class="deleteBtnAction"><button id="deleteButton" onClick="deleteTask(this);createTasks()">delete</button></li>
          <li class="checkBtnAction"class="listaction"> <input type="checkbox" id="done${y}" onchange="toggleCompleted
          (this, ${y})" ${x.status === 'done' ? 'checked' : ''}>
          <label for="done${y}"></label></li>
        </ul>
      </div>
    `);
  });

  resetForm();
};

let toggleCompleted = (checkbox, taskId) => {
  data[taskId].status = checkbox.checked ? 'done' : '';

  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};


let deleteTask = (e) => {
  let taskElement = e.closest("div");
  let taskId = taskElement.id;

  taskElement.remove();
  data.splice(taskId, 1);

  // buat update ID
  let taskElements = document.querySelectorAll("#form-data > div");
  taskElements.forEach((taskElement, index) => {
    taskElement.id = index;
  });

  localStorage.setItem("data", JSON.stringify(data));
  console.log(data);
};


// format angka nol
const formatNumber = (number) => {
  return number < 10 ? `0${number}` : number;
};

let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;

  inputText.value = selectedTask.children[0].innerHTML;
  selectStatus.value = selectedTask.children[1].innerHTML;
  selectColor.value = selectedTask.children[2].innerHTML;

  // format "dd/mm/yyyy hh:mm"
  let endTimeValue = selectedTask.children[3].innerHTML;
  let [date, time] = endTimeValue.split(' ');
  let [day, month, year] = date.split('/');
  let [hours, minutes] = time.split(':');

  // atur nilai waktu elemen input datetime-local
  let formattedEndTime = `${year}-${formatNumber(month)}-${formatNumber(day)}T${formatNumber(hours)}:${formatNumber(minutes)}`;
  endTime.value = formattedEndTime;

  deleteTask(e);
};

let resetForm = () => {
  inputText.value = "";
  selectStatus.value = "";
  selectColor.value = "";
  endTime.value = "";
};

let formatDateTime = (dateTimeString) => {
  let dateTime = new Date(dateTimeString);
  let day = String(dateTime.getDate()).padStart(2, "0");
  let month = String(dateTime.getMonth() + 1).padStart(2, "0");
  let year = dateTime.getFullYear();
  let hours = String(dateTime.getHours()).padStart(2, "0");
  let minutes = String(dateTime.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || []
  createTasks();
})();

function alert(message) {
  var overlay = document.createElement("div");
  overlay.className = "custom-alert-overlay";

  var alertBox = document.createElement("div");
  alertBox.className = "custom-alert";
  alertBox.innerText = message;

  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 1500);
}
