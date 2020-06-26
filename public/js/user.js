customParams = "";
isReport = false;
function GetColumnsForDatatable(count) {
    var shit = new Array();
    for (var i = 0; i < count; i++) {
        shit.push({ "data": "s" + (i + 1) })
    }
    return shit;
}

function TaoDataTable(idTable, columns) {//, columns, id, isFilter) {

    return new Promise(function (resolve, reject) {
        table = $('#' + idTable).DataTable(
            {rowId: 's1',
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
                    "url": "/api/datatable/user",
                    "contentType": "application/json",
                    "type": "GET",
                    "dataType": "JSON",
                    "data": function (d) {
                        d.myCustomParams = customParams;
                        d.isReport = isReport;// idCongViec;
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

function showPopupReport(_id) {
    document.querySelector('.lds-default').classList.toggle('hidden');
    $.ajax({
        type: 'GET',
        url: `/api/user/get_list_report?_id=${_id}`,
    }).done((data) => {
        let result = data.result.list;
        if (result.length) {
            $('#idBodyReport > tr').remove();
            $('#idTitlePopup1').text(`DANH SÁCH REPORT ${data.result.userName}`);
            $('#idBanned').attr('onclick', `banUser('${_id}')`);
            document.getElementById('lightOrderDetail1').style.display = 'block';
            document.getElementById('fadeOrderDetail1').style.display = 'block';
            let tbody = $('#idBodyReport');
            result.forEach((e, i) => {
                let user = e.userId || {};
                let html = `<tr><th scope="row">${i}</th><td>${user.fullName}</td><td>${e.cause}</td><td>${e.eventId && e.eventId.name}</td><td>${new Date(e.createdAt).toLocaleDateString()}</td></tr>`
                tbody.append(html);
            });
        }
        document.querySelector('.lds-default').classList.toggle('hidden');

    }).fail(err => {
        document.querySelector('.lds-default').classList.toggle('hidden');
        alert(err.responseJSON.message);
    })
}

function banUser(id) {
    if (confirm('Xác nhận banned')) {
        document.querySelector('.lds-default').classList.toggle('hidden');
        $.ajax({
            type: 'POST',
            url: '/api/user/report',
            data: { _id: id },
        }).done((data) => {
            $('#idBanned').prop('onclick');
            document.getElementById('lightOrderDetail1').style.display = 'none';
            document.getElementById('fadeOrderDetail1').style.display = 'none';
            $('#idBodyReport tr').remove();
            document.querySelector('.lds-default').classList.toggle('hidden');
            table.ajax.reload();
        }).fail((err) => {
            document.querySelector('.lds-default').classList.toggle('hidden');

            alert(err.responseJSON.message);
        });

    }

}

function search1() {
    isReport = $('#idReported:checkbox:checked').length
    table.ajax.reload();
}


$(document).ready(function () {

    $('#btnAdd').click(() => {
        $('#idTitlePopup').text(`THÊM USER`);
        document.getElementById('lightOrderDetail').style.display = 'block';
        document.getElementById('fadeOrderDetail').style.display = 'block';
    });

    $('#buttonSave').click(() => {
        let fullName = $('#idTen').val();
        let email = $('#idEmail').val();
        let password = $('#idPassword').val();

        if (fullName == '' || email == '' || password == '') {
            alert('Bạn chưa điền đủ thông tin');
        } else {
            if (confirm('Xác nhận lưu!')) {
                $.ajax({
                    type: 'POST',
                    url: '/api/addUser',
                    data: { fullName, email, password },
                }).done((data) => {
                    table.ajax.reload();
                    $('#idTen').val('');
                    $('#idEmail').val('');
                    $('#idPassword').val('');
                    document.getElementById('fadeOrderDetail').click();
                }).fail((err) => {
                    alert(err.responseJSON.message);
                    console.log(err.responseJSON.message);
                });
            }
        }

    })

    $('#idTen').on(`keyup`, debounce(validateKeyUp, 1000, 'idTen', 'MessageTen'));
    $('#idEmail').on(`keyup`, debounce(validateKeyUp, 1000, 'idEmail', 'MessageEmail'));
    $('#idPassword').on(`keyup`, debounce(validateKeyUp, 1000, 'idPassword', 'MessagePassword'));

    function validateKeyUp(src, taget) {
        let val = $(`#${src}`).val();
        let e = document.getElementById(src);
        switch (e.type) {
            case 'email':
                let regex = /^[a-zA-Z][a-z0-9A-Z\.\_]{1,}@[a-z0-9]{2,}(\.[a-z0-9]{1,4}){1,2}$/gm
                if (!regex.test(val)) {
                    document.getElementById(taget).classList.remove('hidden');
                    document.getElementById(taget).innerText = 'Email không hợp lệ';
                } else {
                    document.getElementById(taget).classList.add('hidden');
                }
                break;
            case 'password':
                if (val.length < 3) {
                    document.getElementById(taget).classList.remove('hidden');
                    document.getElementById(taget).innerText = 'Mật khẩu phải > 3 kí tự';
                } else {
                    document.getElementById(taget).classList.add('hidden');
                }
                break;
            case 'text':
                if (val == '') {
                    document.getElementById(taget).classList.remove('hidden');
                    document.getElementById(taget).innerText = 'Không được để trống';
                } else {
                    document.getElementById(taget).classList.add('hidden');
                }
                break;
        }

    }

});