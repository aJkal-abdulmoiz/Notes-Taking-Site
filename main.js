const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = document.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
title = document.querySelector("input"),
dsc = popupBox.querySelector("textarea"),
saveBtn = popupBox.querySelector("button");

const monthsArr =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//geting LocalStorage Notes if exists and parsing them to
//js object else passing an empty array->
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate= false, updateId;

addBox.addEventListener("click",() => {
    title.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    isUpdate=false; 
    title.value="";
    dsc.value="";
    saveBtn.innerHTML = "Save";
    popupTitle.innerHTML = "Add a New Note";
    popupBox.classList.remove("show");
});

function showNotes(){
    document.querySelectorAll(".note-content").forEach(note => note.remove());
    notes.forEach((note,index) => {
        let liTag=`<li class="note-content">
                    <div class="Title">
                        <p>${note.title}</p>
                        <span>${note.description}</span>
                    </div>
                    <div class="bottom-content">
                        <span>${note.date}</span>
                        <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h">...</i>
                        <ul class="menu">
                        <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</li>
                        <li onclick="deleteNote(${index})"><i class="fa fa-trash" aria-hidden="true"></i>Delete</li>
                        </ul>
                        </div>
                    </div>
            </li>`;

            addBox.insertAdjacentHTML("afterend",liTag);



    });
}

showNotes();

function showMenu(elem){

    elem.parentElement.classList.add("show");
    //removing show class on cliking anywhere on the document besides settngs.
    document.addEventListener("click",e => {
        if(e.target.tagName !="I" || e.target !=elem){
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId){
    let noteToDelete = notes[noteId];

    let confirmDel = confirm(`Are You Sure you want to Delete ${noteToDelete.title}?`);

    if(!confirmDel) return;

   notes.splice(noteId,1); //removing the note when pressing delete on that note.
   // Updating other notes to LocalStorage.
   localStorage.setItem("notes",JSON.stringify(notes));
   showNotes();
}

function updateNote(noteId,titl,desc){
    console.log(noteId,titl,desc);
    isUpdate= true;
    updateId=noteId;
    addBox.click();
    title.value=titl;
    dsc.value=desc;
    saveBtn.innerHTML = "Update";
    popupTitle.innerHTML = "Edit Note";
}

saveBtn.addEventListener("click", e => {
    e.preventDefault();

    let noteTitle = title.value;
    let noteContent = dsc.value;

    if(noteTitle || noteContent){

        let dateObj= new Date(),
        month = monthsArr[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();

        let noteInfo ={
            title: noteTitle,
            description: noteContent,
            date: `${month} ${day}, ${year}`
        }
        if(!isUpdate){
            notes.push(noteInfo); //adding new notes if isUpdate=false

        }
        else{
            isUpdate=false; 
            notes[updateId] = noteInfo; //updating the specified note only

        }

        
        
        //saving notes to Local Storage->
        localStorage.setItem("notes",JSON.stringify(notes));

        closeIcon.click();//From will close after save is clicked

        showNotes();
    }
    else{
        alert("Nothing To Save!!!");
    }

    
});