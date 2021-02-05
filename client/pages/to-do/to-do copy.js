//@ts-check

// ? ADD TO DO BUTTON HIDE SHOW FORM
$("#add-to-do-form").hide()

$("#add-to-do-button").click((e) => {
    e.preventDefault()
    $("#add-to-do-form").show()
})

$("#add-to-do-form-cancel").click((e) => {
    e.preventDefault()
    $("#add-to-do-form").hide()
})

$("#add-to-do-form-submit").click((e) => {
    e.preventDefault()
    createToDo()
    $("#main").load("./pages/to-do/to-do.html")
})

// ? SHOW ALL TO DO LIST
$("#to-dolist").show()
// readToDoList()

// ? FUNCTION CREATE TO-DO
function createToDo() {
    const title = $("#titleAdd").val()
    const due_date = $("#dueDateAdd").val()
    const description = $("#descriptionAdd").val()
    // console.log(title, due_date, description)
    $.ajax({
        url: base_url + "todos",
        method: "POST",
        headers: {
            token: localStorage.getItem("accessToken"),
        },
        data: {
            title,
            due_date,
            status: false,
            description,
        },
    })
        .done((res) => {
            console.log(res)
        })
        .fail((xhr, text) => {
            console.log(xhr, text)
        })
        .always((_) => {
            $("#add-to-do-form").trigger("reset")
        })
}

// ? FUNCTION READ TO-DO-LIST
function readToDoList() {
    $.ajax({
        url: base_url + "todos",
        method: "GET",
        headers: {
            token: localStorage.getItem("accessToken"),
        },
    })
        .done((res) => {
            // console.log(res)
            res.forEach((e) => {
                $("#to-do-list").append(`
                    <div class="input-group mb-3">
                        <div class="card">
                            <div class="d-flex align-items-center">
                                <div class="input-group-text">
                                    <input
                                        type="checkbox"
                                        id="checkbox${e.id}"
                                        value="${e.status}"
                                        onclick="patchToDoStatus(${e.id})" 
                                    />
                                </div>
                            <div>
                        </div>

                        <div class="card" style="width: 50rem">
                        
                            <div class="card-body" id="edit-to-do-form-${e.id}">
                                <form onsubmit="confirmUpdateToDo(event))">
                                    <div class="row">
                                        <div class="col">
                                            <input
                                                type="text"
                                                class="form-control title"
                                                placeholder="${e.title}"
                                                value="${e.title}"
                                                id="title-edit-${e.id}"
                                                required
                                            />
                                        </div>
                                        <div class="col">
                                            <input
                                                type="date"
                                                class="form-control due_date"
                                                value="${e.due_date.slice(0, 10)}"
                                                id="due-date-add-${e.id}"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group mt-2">
                                        <textarea
                                            class="form-control description"
                                            id="description-edit-${e.id}"
                                            rows="3"
                                            placeholder="${e.description}">${e.description}</textarea>
                                    </div>
                                    <p>* Date must not be in the past</p>
                                    <div>
                                        <button 
                                            id="edit-to-do-button-${e.id}"
                                            class="btn btn-primary"
                                            onclick="confirmUpdateToDo(${e.id})">
                                        Edit
                                        </button>
                                        <button 
                                            id="cancel-edit-to-do-button-${e.id}"
                                            class="btn btn-danger"
                                            onclick="cancelUpdateToDo(${e.id})">
                                        Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>



                            <div class="card-body" id="card-to-do-${e.id}">
                                <div id="to-do-card-value-${e.id}" style="">
                                    <h5 id="title-${e.id}" class="card-title">${e.title}</h5>
                                    <p class="card-text">${e.description}</p>
                                    <h6 class="card-subtitle mb-2 text-muted">${e.due_date.slice(0, 10)}</h6>
                                    <div>
                                        <button 
                                            id="form-edit-to-do-button-${e.id}" 
                                            type="button"
                                            class="btn btn-warning"
                                            onclick="editToDoForm(${e.id}">
                                        Edit
                                        </button>
                                        <button 
                                            id="delete-to-do-button" 
                                            class="btn btn-danger"
                                            onclick="deleteToDo(${e.id})">
                                        Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <script>
                        $("#edit-to-do-form-${e.id}").hide()
                        $("#form-edit-to-do-button-${e.id}").click((e) => {
                            $("#edit-to-do-form-${e.id}").show()
                            $("#to-do-card-value-${e.id}").hide()
                        })
                        $("#cancel-edit-to-do-button-${e.id}").click((e) => {
                            $("#edit-to-do-form-${e.id}").hide()
                            $("#to-do-card-value-${e.id}").show()
                        })

                        $('#checkbox${e.id}').prop('checked',(value == 1))

                        $('#checkbox-value').text($('#checkbox${e.id}').val())
                        $("#checkbox${e.id}").on('change', function() {
                        if ($(this).is(':checked')) {
                            $(this).attr('value', 'true')
                        } else {
                            $(this).attr('value', 'false')
                        }

                        $('#checkbox-value').text($('#checkbox${e.id}').val())
                        })

                    </script>
                `)
            })
        })
        .fail((xhr, text) => {
            console.log(xhr, text)
        })
}

// ? FUNCTION UPDATE PUT TO-DO
function confirmUpdateToDo(toDoId) {
    const title = $(`#title-edit-${toDoId}`).val()
    const due_date = $(`#due-date-add-${toDoId}`).val()
    const status = $(`#checkbox${toDoId}`).val()
    const description = $(`#description-edit-${toDoId}`).val()
    let newStatus
    if (status === "on") {
        newStatus = true
    } else {
        newStatus = false
    }
    console.log(title, due_date, newStatus, description)
    $.ajax({
        url: base_url + `todos/${toDoId}`,
        method: "PUT",
        data: {
            title,
            due_date,
            status: false,
            description,
        },
        headers: {
            token: localStorage.getItem("accessToken"),
        },
    })
        .done((res) => {
            console.log(res)
            $("#main").load("./pages/to-do/to-do.html")
        })
        .fail((xhr, text) => {
            console.log(xhr, text)
        })
}

// ? FUNCTION UPDATE PATCH TO-DO
function patchToDoStatus(toDoId) {
    const status = $(`#checkbox${toDoId}`).val()
    let newStatus
    if (status === "on") {
        newStatus = true
    } else {
        newStatus = true
    }
    console.log(status)
    console.log(newStatus)
    $.ajax({
        url: base_url + `todos/${toDoId}`,
        method: "PATCH",
        data: {
            status: newStatus,
        },
        headers: {
            token: localStorage.getItem("accessToken"),
        },
    })
        .done((res) => {
            console.log(res)
            $("#main").load("./pages/to-do/to-do.html")
        })
        .fail((xhr, text) => {
            console.log(xhr, text)
        })
}

// ? FUNCTION DELETE TO-DO
function deleteToDo(toDoId) {
    $.ajax({
        url: base_url + `todos/${toDoId}`,
        method: "DELETE",
        headers: {
            token: localStorage.getItem("accessToken"),
        },
    })
        .done((res) => {
            console.log(res)
            $("#main").load("./pages/to-do/to-do.html")
        })
        .fail((xhr, text) => {
            console.log(xhr, text)
        })
}