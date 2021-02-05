// Application Information
const VERSION = "1.0";
let SESSION;

// ARRAY
var TASKS = [];
const tasksOrder = [];

// HANDLER
const taskTitleHandler = document.getElementById('task-title');
const taskDescriptionHandler = document.getElementById('task-description');
const taskCreationControls = document.getElementById('creator-controls');
const taskCreatorButton = document.getElementById('creator-button');
const tasksHandler = document.getElementById('tasks');
const tasksCompletedHandler = document.getElementById('completed');

window.addEventListener('load', () => {
    taskUtilities.retrieveTasks();
    SESSION = sessionUtlities.generateSession();
    applicationUtilities.updateModal();
});

// Application functions
const applicationUtilities = {
    updateModal: () => {
        $("#applicationInfo").text(`Session ID: ${SESSION}`);
    }
}

// Task functions
const taskUtilities = {
    createTask: (taskId,taskData) => {
        var title, description, task, data;
        if(taskId && taskData){
            data = taskData.split(';');
            task = {
                id: taskId,
                title: taskUtilities.normalizeText(data[0]),
                description: taskUtilities.normalizeText(data[1]),
                priority: parseInt(data[2]),
                check: (data[3] == 'true')
            };
            TASKS.push(task);
        } else {
            if(taskTitleHandler.value == '' || taskDescriptionHandler.value == ''){
                alert("No es válido!");
            } else {
                title = taskTitleHandler.value;
                description = taskDescriptionHandler.value;
            }
            task = {
                id: taskUtilities.createUUID(),
                title: taskUtilities.textSanitization(taskUtilities.normalizeText(title)),
                description: taskUtilities.textSanitization(taskUtilities.normalizeText(description)),
                priority: 0,
                check: false
            };
            TASKS.push(task);
            localUtilities.saveData(task.id,`${task.title};${task.description};${task.priority};${task.check}`);
            
            taskTitleHandler.value = '';
            taskDescriptionHandler.value = '';

        }
        taskUtilities.updateTasks();
    },
    updateTask: {
        title: (taskId,newTitle) => {
            var data = localUtilities.getData(taskId).split(";");
            var updatedTaskData = {
                title:  taskUtilities.normalizeText(newTitle),
                description: data[1],
                priority: data[2],
                check: data[3]
            };
            localUtilities.saveData(taskId,`${updatedTaskData.title};${updatedTaskData.description};${updatedTaskData.priority};${updatedTaskData.check}`);
            taskUtilities.retrieveTasks();
        },
        description: (taskId,newDescription) => {
            var data = localUtilities.getData(taskId).split(";");
            var updatedTaskData = {
                title:  data[0],
                description: taskUtilities.normalizeText(newDescription),
                priority: data[2],
                check: data[3]
            };
            localUtilities.saveData(taskId,`${updatedTaskData.title};${updatedTaskData.description};${updatedTaskData.priority};${updatedTaskData.check}`);
            taskUtilities.retrieveTasks();
        },
        priority: (taskId,newPriority) => {
            var data = localUtilities.getData(taskId).split(";");
            var updatedTaskData = {
                title:  data[0],
                description: data[1],
                priority: newPriority,
                check: data[3]
            };
            localUtilities.saveData(taskId,`${updatedTaskData.title};${updatedTaskData.description};${updatedTaskData.priority};${updatedTaskData.check}`);
            taskUtilities.retrieveTasks();
        },
        check: (taskId,check) => {
            var data = localUtilities.getData(taskId).split(";");
            var updatedTaskData = {
                title:  data[0],
                description: data[1],
                priority: data[2],
                check: check
            };
            localUtilities.saveData(taskId,`${updatedTaskData.title};${updatedTaskData.description};${updatedTaskData.priority};${updatedTaskData.check}`);
            taskUtilities.retrieveTasks();
        }
    },
    removeTask: (taskId) => {
        TASKS.forEach((task) => {
            if(task.id == taskId){
                TASKS.splice(taskId);
                localUtilities.removeData(taskId);
            }
        })
        taskUtilities.retrieveTasks();    
    },
    updateTasks: () => {
        while(tasksHandler.childNodes.length > 0){
            tasksHandler.childNodes.forEach((child) => {
                tasksHandler.removeChild(child);
            });
        }
        while(tasksCompletedHandler.childNodes.length > 0){
            tasksCompletedHandler.childNodes.forEach((child) => {
                tasksCompletedHandler.removeChild(child);
            });
        }
        TASKS = taskUtilities.orderTasks(TASKS);
        TASKS.forEach((task) => {
            
            
            /* 

                BOOTSTRAP
            
            */
        
            var itemContainer, itemHeader, itemContent;

            // ITEM

            itemContainer = document.createElement('div');
            itemContainer.classList.add('accordion-item');
            itemContainer.draggable = true;
            itemContainer.id = task.id;
            itemContainer.ondragstart = (event) => {
                dragDropContainerUtilities.drag(event);
            }

            // HEADER
            var itemButtonContainer, headerTitle, headerControls;

                itemHeader = document.createElement('div');
                itemHeader.classList.add('accordion-header');
                itemHeader.id = `header${task.id}`;
                
                    itemButtonContainer = document.createElement('div');
                    itemButtonContainer.classList.add('accordion-button');
                    itemButtonContainer.classList.add('row');

                        headerTitle = document.createElement('div');
                        headerTitle.classList.add('col');
                        headerTitle.innerHTML = task.title;
                            
                        headerControls = document.createElement('div');
                        headerControls.classList.add('col');

                            // CONTROLS EDIT/PRIORITY/VIEW/REMOVE

                            var editHandler, priorityPlusHandler, priorityMinusHandler, viewHandler, removeHandler, uncheckHandler, checkHandler;
                            var editIcon, priorityPlusIcon, priorityMinusIcon, viewIcon, removeIcon, uncheckIcon, checkIcon;

                            editHandler = document.createElement('a');
                            editHandler.classList.add('btn');
                            editHandler.classList.add('btn-secondary');
                            editHandler.classList.add('btn-sm');

                                // EVENT
                                editHandler.addEventListener('click', () => {

                                    taskTitleHandler.value = task.title;
                                    taskDescriptionHandler.value = task.description;

                                    editHandler.href = "#task-creator";
                                    taskCreatorButton.innerHTML = "Update task";
                                    taskCreatorButton.onclick = () => {
                                        taskUtilities.updateTask.title(task.id,taskTitleHandler.value);
                                        taskUtilities.updateTask.description(task.id,taskDescriptionHandler.value);
                                    }
                                
                                    var resetButton, resetIcon;
                                    resetButton = document.createElement('a');
                                    resetButton.classList.add('btn');
                                    resetButton.classList.add('btn-primary');
                                    
                                        // EVENT
                                        resetButton.addEventListener('click',() => {
                                            taskCreatorButton.innerHTML = "Create task!";
                                            taskTitleHandler.value = '';
                                            taskDescriptionHandler.value = '';
                                            taskCreatorButton.onclick = () => {
                                                taskUtilities.createTask();
                                            }
                                            taskCreationControls.removeChild(resetButton);
                                        });

                                        // ICON
                                        resetIcon = document.createElement('i');
                                        resetIcon.classList.add('fas');
                                        resetIcon.classList.add('fa-undo');
                                        resetButton.appendChild(resetIcon);

                                    if(taskCreationControls.children.length > 1){
                                        taskCreationControls.removeChild(resetButton);
                                    }
                                    taskCreationControls.appendChild(resetButton);
                                });

                                // ICON
                                editIcon = document.createElement('i');
                                editIcon.classList.add('fas');
                                editIcon.classList.add('fa-edit');
                                editIcon.style.color = "#fff";
                                editHandler.appendChild(editIcon);

                            priorityPlusHandler = document.createElement('a');
                            priorityPlusHandler.classList.add('btn');
                            priorityPlusHandler.classList.add('btn-info');
                            priorityPlusHandler.classList.add('btn-sm');

                                // EVENT
                                priorityPlusHandler.addEventListener('click', () => {
                                    if(!(task.priority > TASKS[0].priority) && !(task.priority == TASKS[0].priority && task.id.includes(TASKS[0].id))){
                                        if(!(task.priority + 1 == 20)){
                                            taskUtilities.updateTask.priority(task.id,(task.priority + 1));
                                        }
                                    }
                                });

                                // ICON
                                priorityPlusIcon = document.createElement('i');
                                priorityPlusIcon.classList.add('fas');
                                priorityPlusIcon.classList.add('fa-arrow-up');
                                priorityPlusIcon.style.color = "#fff";
                                priorityPlusHandler.appendChild(priorityPlusIcon);
                            
                            priorityMinusHandler = document.createElement('a');
                            priorityMinusHandler.classList.add('btn');
                            priorityMinusHandler.classList.add('btn-warning');
                            priorityMinusHandler.classList.add('btn-sm');

                                // EVENT
                                priorityMinusHandler.addEventListener('click', () => {
                                    if(!(task.priority > TASKS[0].priority) && !(task.priority == TASKS[TASKS.length - 1].priority && task.id.includes(TASKS[TASKS.length - 1].id))){
                                        if(!(task.priority - 1 == -20)){
                                            taskUtilities.updateTask.priority(task.id,(task.priority - 1));
                                        }
                                    }
                                });
                                
                                // ICON
                                priorityMinusIcon = document.createElement('i');
                                priorityMinusIcon.classList.add('fas');
                                priorityMinusIcon.classList.add('fa-arrow-down');
                                priorityMinusIcon.style.color = "#fff";
                                priorityMinusHandler.appendChild(priorityMinusIcon);
                            
                            viewHandler = document.createElement('button');
                            viewHandler.classList.add('btn');
                            viewHandler.classList.add('btn-primary');
                            viewHandler.classList.add('btn-sm');
                            viewHandler.type = "button";

                                // ATTRIBUTES
                                var handlerAttributeToggler, handlerAttributeTarget;

                                handlerAttributeToggler = document.createAttribute('data-bs-toggle');
                                handlerAttributeTarget = document.createAttribute('data-bs-target');
                                handlerAttributeToggler.value = "collapse";
                                handlerAttributeTarget.value = `#item${task.id}`;
                                viewHandler.attributes.setNamedItem(handlerAttributeToggler);
                                viewHandler.attributes.setNamedItem(handlerAttributeTarget);

                                // ICON
                                viewIcon = document.createElement('i');
                                viewIcon.classList.add('far');
                                viewIcon.classList.add('fa-eye');
                                viewHandler.appendChild(viewIcon);
                            
                            removeHandler = document.createElement('a');
                            removeHandler.classList.add('btn');
                            removeHandler.classList.add('btn-danger');
                            removeHandler.classList.add('btn-sm');

                                // EVENT
                                removeHandler.addEventListener('click', () => {
                                    taskUtilities.removeTask(task.id);
                                });

                                // ICON
                                removeIcon = document.createElement('i');
                                removeIcon.classList.add('far');
                                removeIcon.classList.add('fa-trash-alt');
                                removeHandler.appendChild(removeIcon);

                            uncheckHandler = document.createElement('a');
                            uncheckHandler.classList.add('btn');
                            uncheckHandler.classList.add('btn-success');
                            uncheckHandler.classList.add('btn-sm');

                                // EVENT
                                if(task.check){
                                    uncheckHandler.addEventListener('click', () => {
                                        taskUtilities.updateTask.check(task.id,false);
                                    })
                                }

                                // ICON
                                uncheckIcon = document.createElement('i');
                                uncheckIcon.classList.add('fas');
                                uncheckIcon.classList.add('fa-undo');
                                uncheckHandler.appendChild(uncheckIcon);
                                
                            checkHandler = document.createElement('a');
                            checkHandler.classList.add('btn','btn-success','btn-sm','check-handler');

                                // EVENT
                                checkHandler.addEventListener('click',() => {
                                    taskUtilities.updateTask.check(task.id,true);
                                });

                                // ICON
                                checkIcon = document.createElement('i');
                                checkIcon.classList.add('fas','fa-check');
                                checkHandler.appendChild(checkIcon);
                                
                            if(!task.check){
                                headerControls.appendChild(editHandler);
                                headerControls.appendChild(priorityPlusHandler);
                                headerControls.appendChild(priorityMinusHandler);
                                headerControls.appendChild(checkHandler);
                            } else {
                                headerControls.appendChild(uncheckHandler);
                            }
                            headerControls.appendChild(viewHandler);
                            headerControls.appendChild(removeHandler);

                    itemButtonContainer.appendChild(headerTitle);
                    itemButtonContainer.appendChild(headerControls);
                
                itemHeader.appendChild(itemButtonContainer);
                        

            // CONTENT

            var itemBody;

                itemContent = document.createElement('div');
                itemContent.classList.add('accordion-collapse');
                itemContent.classList.add('collapse');
                itemContent.id = `item${task.id}`;

                    // ATTRIBUTE
                    var contentParent = document.createAttribute('data-bs-parent');
                    if(task.check){
                        contentParent.value = `#completed`;
                    } else {
                        contentParent.value = `#tasks`;
                    }
                    itemContent.attributes.setNamedItem(contentParent);

                itemBody = document.createElement('div');
                itemBody.classList.add('accordion-body');
                itemBody.innerHTML = task.description;
                itemContent.appendChild(itemBody);

            itemContainer.appendChild(itemHeader);
            itemContainer.appendChild(itemContent);

            // TASK HANDLER
            if(task.check){
                itemContainer.draggable = false;
                tasksCompletedHandler.appendChild(itemContainer);
            } else {
                tasksHandler.appendChild(itemContainer);
            }

        })
    },
    retrieveTasks: () => {
        TASKS = [];
        if(localStorage.length > 0){
            for(var index = 0; index < localStorage.length; index++){
                if(localStorage.key(index)){
                    taskUtilities.createTask(localStorage.key(index),localStorage.getItem(localStorage.key(index)));
                }
            }
        } else {
            taskUtilities.updateTasks();
        }
    },
    orderTasks: (tasks) => {
        // CREDITS https://www.studytonight.com/data-structures/bubble-sort
        // Bubble Sort Algorithm
        var i, j, temp;
        for(i = 0; i < tasks.length; i++){
            for(j = 0; j < tasks.length-i-1; j++){
                if(taskUtilities.compareTask(tasks[j],tasks[j+1]) == -1){
                    temp = tasks[j];
                    tasks[j] = tasks[j+1];
                    tasks[j+1] = temp;
                }
            }
        }
        return tasks;
    },
    compareTask: (a,b) => {
        return (a.priority < b.priority) ? -1 : (a.priority > b.priority) ? 1 : 0;
    },
    createUUID: () => {
        var dt, uuid;
        dt = new Date().getTime();
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    },
    getTask: (taskId) => {
        var output;
        TASKS.forEach((task) => {
            if(task.id == taskId){
                output = task;
            }
        });
        return output;
    },
    normalizeText: (text) => {
        if(text.includes('&special')){
            return text.replace('&special',';');
        } else if(text.includes(';')){
            return text.replace(';','&special');
        } else {
            return text;
        }
    },
    textSanitization: (text) => {
        if(text.includes("<script>") || text.includes("<object>") || text.includes("<embed>")){
            return text.replace('<script>','&PROHIBITED').replace('<object>','&PROHIBITED').replace('<embed>','&PROHIBITED');
        } else {
            return text;
        }
    }
}

// LocalStorage functions
const localUtilities = {
    getData: (key) => {
        return localStorage.getItem(key);
    },
    saveData: (key,data) => {
        localStorage.setItem(key,data);
    },
    removeData: (key) => {
        localStorage.removeItem(key);
    }
}

// SessionStorage functions
const sessionUtlities = {
    generateSession: () => {
        if(sessionUtlities.getData('SESSIONID') == null){
            sessionUtlities.saveData('SESSIONID',taskUtilities.createUUID());
            return sessionUtlities.getData('SESSIONID');
        } else {
            return sessionUtlities.getData('SESSIONID');
        }
    },
    getData: (key) => {
        return sessionStorage.getItem(key);
    },
    saveData: (key,data) => {
        sessionStorage.setItem(key,data);
    },
    removeData: (key) => {
        sessionStorage.removeItem(key);
    }
}

// Drag and Drop (Container, Tasks)
const dragDropContainerUtilities = {
    allowDrop: (ev,d) => {
        ev.preventDefault();
        if(!d){
            ev.dataTransfer.dropEffect = "none";
        }
        var dropZone = document.createAttribute('drop-active');
        dropZone.value = true;
        ev.target.attributes.setNamedItem(dropZone);
    },
    drag: (ev) => {
        ev.dataTransfer.setData('task',ev.target.id);
    },
    drop: (ev) => {
        ev.preventDefault();
        ev.target.attributes.removeNamedItem("drop-active");
        console.log(ev.dataTransfer.getData('task'));
        var data = ev.dataTransfer.getData('task'); 
        taskUtilities.updateTask.check(data,true);
        var task = document.getElementById(data);
        task.draggable = false;
    },
    leaveDropZone: (ev) => {
        ev.target.attributes.removeNamedItem("drop-active");
    },
    normalizeId: (id) => {
        return id.replace('item','');
    }
}