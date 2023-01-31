/*
    ? Todo app
    // work with local storage
    // * select the elements that you need,
    // * add event listner on add todo btn
    // * store user input in a variable
    // * i want to add the user todos as an array to local storage with a key of todos 
    // * that every time a user clicks add todo we take the value and add to the array in the ls
    // * get todos from ls and show them on the UI 
    // * a3mel if checked make it crossed out and remember it in localStorage
    // * a3mel remove todo functionality wa remove all todos at once
*/

const UIUserInput = document.querySelector('[name="todo"]')
const UIBtn = document.getElementById('add-btn')
const clearAllBtn = document.getElementById('remove-all-btn')
const notifications = document.querySelector('.alert')
const todoList = document.getElementById('todo-list')
let todos;

if(localStorage.getItem('todos') == null){
    todos = []
}else{
    todos = JSON.parse(localStorage.getItem('todos'))
    UIShowTodos()
}
//? add a todo on click
UIBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if(UIUserInput.value !== ''){
        let userInputObj = {value: UIUserInput.value, isChecked: false}
        todos.push(userInputObj)
        UIUserInput.value = ''
        addToLS('todos', todos)
        UIShowTodos()
    }else{
        notify('please add a todo first')
        setTimeout(() => {
            hideElement(notifications)
        }, 2000)
    }
})

//? LISTEN FOR CHECKED OR UNCHECKED AND PERSIST TO LS
todoList.addEventListener('change', e => {
    if(e.target.checked){
        e.target.nextElementSibling.classList.add('txt-line-through')
        // sama3ha fel localStorage
        let LS = JSON.parse(localStorage.getItem('todos'))
        LS.forEach((item) => {
            if(e.target.nextElementSibling.innerText === item.value){
                item.isChecked = true
            }
        })
        addToLS('todos', LS)
    }else if(!e.target.checked){
        e.target.nextElementSibling.classList.remove('txt-line-through')
        // sama3ha fel localStorage
        let LS = JSON.parse(localStorage.getItem('todos'))
        LS.forEach((item) => {
            if(e.target.nextElementSibling.innerText === item.value){
                item.isChecked = false
            }
        })
        addToLS('todos', LS)
    }
})
//? Listen for remove all todos btn and remove from LS as well
clearAllBtn.addEventListener('click', (e) => {
    e.preventDefault()
    //remove from LS
    if(todos.length > 0 && confirm('Clear all todos?')){
        localStorage.removeItem('todos')
        todoList.innerHTML = ''
        window.location.reload()
        notify('Your Todos are all removed successfuly.')
        setTimeout(() => {
            hideElement(notifications)
        }, 3500)
    }else if(localStorage.getItem(todos) == null){
        notify('nothing to remove')
        setTimeout(() => {
            hideElement(notifications)
        }, 3500)
    }
})
//? listen for remove 1 todo
todoList.addEventListener('click', (e) => {
    if(e.target.nodeName === 'SPAN'){
        // get the todo value to remove
        const todoValue = e.target.parentElement.children[0].children[1].innerText
        //get ls
        const LS = JSON.parse(localStorage.getItem('todos'))
        //change ls
        for(let i = 0; i < LS.length; i++){
            if(LS[i].value === todoValue){
                LS.splice(i, 1)
            }
        }
        //re-add ls
        if(LS.length === 0){
            localStorage.removeItem('todos')
        }else{
            addToLS('todos', LS)
        }
        // remove from UI
        e.target.parentElement.remove()
        window.location.reload()
    }
})

//? show todos on UI
function UIShowTodos(){
    const todos = JSON.parse(localStorage.getItem('todos'))
    const LS = JSON.parse(localStorage.getItem('todos'))
    let output = '';
    for(let i = 0; i < todos.length ; i++){
        if(LS[i].isChecked){
            output += `
            <li class="list-group-item d-flex justify-content-between">
                <div>
                    <input class="form-check-input me-1" type="checkbox" value="${todos[i].value}" id="todos-${i}" checked>
                    <label class="form-check-label txt-line-through" for=todos-${i}>${todos[i].value}</label>
                </div>
                <span style="cursor: pointer;">X</span>
            </li>
        `
        }else{
            output += `
            <li class="list-group-item d-flex justify-content-between">
                <div>
                    <input class="form-check-input me-1" type="checkbox" value="${todos[i].value}" id="todos-${i}">
                    <label class="form-check-label" for=todos-${i}>${todos[i].value}</label>
                </div>
                <span style="cursor: pointer;">X</span>
            </li>
        `
        }

    }
    todoList.innerHTML = output
}


//? helpers
function addToLS(key, value){
    localStorage.setItem(key, JSON.stringify(value))
}
function notify(message){
    notifications.classList.remove('d-none')
    notifications.innerText = message
}
function hideElement(element){
    element.classList.add('d-none')
}