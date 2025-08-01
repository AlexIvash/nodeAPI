
// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';
/**
 * Fetch all tasks from API and add them to the DOM lists.
 */

getTasks((tasks)=>{
 //console.log(tasks);
  tasks.forEach((item) => {
    addItemToDOM(item, item.completed);
  });
});

document.getElementById('add').addEventListener('click', function() {
  var value = document.getElementById('item').value;
  if (value) {
    addItem(value);
  }
});

document.getElementById('item').addEventListener('keydown', function (e) {
  var value = this.value;
  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
    addItem(value);
  }
});

function addItem (value) {

  document.getElementById('item').value = '';
sendItemToAPI(value, (item)=> {
  console.log(item);

    addItemToDOM(item);
});
}

function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var taskId = parseInt(item.getAttribute('data-id'));

  const req = new XMLHttpRequest();
  req.open('POST', '/tasks' + taskId + '/remove');
  req.setRequestHeader('Content-Type', 'application/json');
  req.send();

  req.addEventListener('load', ()=> {
    var results = JSON.parse(req.responseText);
    if (results.error) return console.log(results.error);
    parent.removeChild(item);
    if (callback) callback(results);
  });

  req.addEventListener('error',(e)=>{
    console.log('Shit, something bad happened.');
    console.log(e);
  });
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;
  var taskId = parseInt(item.getAttribute('data-id'));

  // Check if the item should be added to the completed list or to re-added to the todo list
  var target = (id === 'todo') ? document.getElementById('completed'):document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);


  var req = new XMLHttpRequest();
  req.open('POST', '/tasks' + taskId + '/update');
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify({completed: ( id == 'todo')}));

  req.addEventListener('load', ()=> {
    var results = JSON.parse(req.responseText);
    if (results.error) return console.log(results.error);
    parent.removeChild(item);
  });

  req.addEventListener('error',(e)=>{
    console.log('Shit, something bad happened.');
    console.log(e);
  });


}

// Adds a new item to the todo list
function addItemToDOM(task, completed) {
  var list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

  var item = document.createElement('li');
  item.innerText = task.description;
  item.setAttribute('data-id', task.id);

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var remove = document.createElement('button');
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;

  // Add click event for removing the item
  remove.addEventListener('click', removeItem);

  var complete = document.createElement('button');
  complete.classList.add('complete');
  complete.innerHTML = completeSVG;

  // Add click event for completing the item
  complete.addEventListener('click', completeItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
}

/**
*Method for sending to-do item to API
*/

function sendItemToAPI(item, callback) {
  // sendTaskToAPI
const req = new XMLHttpRequest();
req.open('POST', '/tasks/add');
req.setRequestHeader('Content-Type', 'application/json');
req.send(JSON.stringify({ item:item }));

req.addEventListener('load', ()=> {
var results = JSON.parse(req.responseText);
if (results.error) return console.log(results.error);

if (callback) callback(results);
});

req.addEventListener('error',()=>{
console.log('Shit, something bad happened.');
console.log(e);
});
}

/**
 *Will fetch all tasks from API.
 */
function getTasks(callback){
  var req = new XMLHttpRequest();
  req.open('GET', '/tasks');
  req.send();



  req.addEventListener('load', ()=> {
    var results = JSON.parse(req.responseText);
    if (results.error) return console.log(results.error);

    if (callback) callback(results);
  });

  req.addEventListener('error',()=>{
    console.log('Shit, something bad happened.');
    console.log(e);
  });
}