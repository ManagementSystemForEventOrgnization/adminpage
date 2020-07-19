customParams = "";
function GetColumnsForDatatable(count) {
    var shit = new Array();
    for (var i = 0; i < count; i++) {
        shit.push({ "data": "s" + (i + 1) })
    }
    return shit;
}
function ThongBao(text, type, callback) {
    var isShowCancel = true;
    if (type == "success" || type == "error") {
        isShowCancel = false;
    }
    Swal({
        title: text,
        type: type,
        showCancelButton: isShowCancel,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
    }).then(function (result) {
        if (typeof callback !== 'undefined')
            if (result.value) {
                callback(true);
            } else
                callback(false);
    });
}

function TaoDataTable(idTable, columns) {//, columns, id, isFilter) {

    return new Promise(function (resolve, reject) {
        table = $('#' + idTable).DataTable(
            {
                "order": [[0, "desc"]],
                'language': {
                    "sProcessing": "<div class='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>",
                    "sLengthMenu": "Xem _MENU_ mục",
                    "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
                    "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
                    "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 mục",
                    "sInfoFiltered": "(được lọc từ _MAX_ mục)",
                    "sInfoPostFix": "",
                    "sSearch": "Tìm:",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "Đầu",
                        "sPrevious": "Trước",
                        "sNext": "Tiếp",
                        "sLast": "Cuối"
                    }
                },

                "columnDefs": [
                    {
                        "targets": -1,
                        "className": "hover",
                    },
                ],
                "processing": true,
                "serverSide": true,
                "lengthMenu": [[5, 10, 25, 99999], [5, 10, 25, "All"]],
                "ajax":
                {
                    "url": "/api/datatable/Account",
                    "contentType": "application/json",
                    "type": "GET",
                    "dataType": "JSON",
                    "data": function (d) {
                        d.myCustomParams = customParams;
                        d.idCongViec = "";// idCongViec;
                        return d;
                    },
                    "dataSrc": function (json) {
                        json.draw = json.d.draw;
                        json.recordsTotal = json.d.recordsTotal;
                        json.recordsFiltered = json.d.recordsFiltered;
                        json.data = json.d.data;
                        if (json.data == null) {

                        }
                        var return_data = json;
                        return return_data.data;
                    }, "error": function (data) {
                        console.log(data);
                    }
                },
                "columns": columns,
                "initComplete": function () {
                    resolve('true');
                },
                "drawCallback": function (settings) {

                },
                "deferRender": true
            });
    });
}


function Delete(_id) {
    if (confirm('Xác nhận xóa!')) {
        $.ajax({
            type: 'POST',
            url: '/api/deleteUser',
            data: { _id },
        }).done((data) => {
            if (data.message != 'success') {
                alert(`${data.message}`);
            } else {
                table.ajax.reload();
            }
        }).fail(err => {
            alert(err.responseJSON.message);
        })

    }
}

function Update(id) {
    // get data ve
}

function search1() {

    table.ajax.reload();
}


$(document).ready(function () {

    // $('#idBranch').select2();
    // $('#idDepartment').select2();
    (()=>{
        $.post('/api/Branch',(data,status)=>{
            let element = $('#idBranch');
            data.forEach(e => {
                element.append(`<option value='${e._id}' >${e.name}</option>`)
            });
        });

        $.post('/api/Department', (data,status)=>{
            let element = $('#idDepartment');
            data.forEach(e => {
                element.append(`<option value='${e._id}' >${e.name}</option>`)
            });
        });
    }).call(this);

    $('#btnAdd').click(() => {
        $('#idTitlePopup').text(`THÊM NGƯỜI DÙNG`);
        // load data branch and department ra.
        document.getElementById('lightOrderDetail').style.display = 'block';
        document.getElementById('fadeOrderDetail').style.display = 'block';
    });

    $('#buttonSave').click(() => {
        let name = $('#idTen').val();
        let username = $('#idUsername').val();
        let password = $('#idPassword').val();
        let branch = $('#idBranch').val();
        let department = $('#idDepartment').val();
        if (name == '' || username == '' || password == '' || branch == '0' || department == '0') {
            alert('Bạn chưa điền đủ thông tin');
        } else {
            if (confirm('Xác nhận lưu!')) {
                $.ajax({
                    type: 'POST',
                    url: '/api/addAccount',
                    data: { name, username, password, branch, department },
                }).done((data) => {
                    table.ajax.reload();
                    $('#idTen').val('');
                    $('#idUsername').val('');
                    $('#idPassword').val('');
                    $('#idBranch').val('0');
                    $('#idDepartment').val('0');
                    document.getElementById('fadeOrderDetail').click();
                }).fail((err) => {
                    alert(err.responseJSON.message);
                    console.log(err.responseJSON.message);
                });
            }
        }
    })

    $('#idTen').on(`keyup`, debounce(validateKeyUp, 1000, 'idTen', 'MessageTen'));
    $('#idUsername').on(`keyup`, debounce(validateKeyUp, 1000, 'idUsername', 'MessageUsername'));
    $('#idPassword').on(`keyup`, debounce(validateKeyUp, 1000, 'idPassword', 'MessagePassword'));

    function validateKeyUp(src, target) {
        let val = $(`#${src}`).val();
        let e = document.getElementById(src);
        let tagName = e.tagName;
        let type = e.type;

        switch (e.type) {
            case 'email':
                let regex = /^[a-zA-Z][a-z0-9A-Z\.\_]{1,}@[a-z0-9]{2,}(\.[a-z0-9]{1,4}){1,2}$/gm
                if (!regex.test(val)) {
                    document.getElementById(target).classList.remove('hidden');
                    document.getElementById(target).innerText = 'Email không hợp lệ';
                } else {
                    document.getElementById(target).classList.add('hidden');
                }
                break;
            case 'password':
                if (val.length < 3) {
                    document.getElementById(target).classList.remove('hidden');
                    document.getElementById(target).innerText = 'Mật khẩu phải > 3 kí tự';
                } else {
                    document.getElementById(target).classList.add('hidden');
                }
                break;
            case 'text':
                if (val == '') {
                    document.getElementById(target).classList.remove('hidden');
                    document.getElementById(target).innerText = 'Không được để trống';
                } else {
                    document.getElementById(target).classList.add('hidden');
                }
                break;
        }

    }

});