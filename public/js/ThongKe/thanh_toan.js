customParams = "";
multiSearch = "";
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
            {

                // "order": false,// [[0, "desc"]],
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
                rowId: '_id',
                "serverSide": true,
                "lengthMenu": [[5, 10, 25, 99999], [5, 10, 25, "All"]],
                "ajax":
                {
                    "url": "/api/datatable/thanh_toan",
                    "contentType": "application/json",
                    "type": "GET",
                    "dataType": "JSON",
                    "data": function (d) {
                        d.myCustomParams = customParams;
                        d.multiSearch = multiSearch;// idCongViec;
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
                "deferRender": true,
            });
    });
}


function search1() {
    let status = $('#idTT').val();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let fee = $('#traPhi:checkbox:checked').length;
    multiSearch = { status, startDate, endDate, fee };
    table.ajax.reload(null, false);
}

function ShowSession(id) {
    document.querySelector('.lds-default').classList.toggle('hidden');
    document.getElementById('lightOrderDetail').style.display = 'block';
    document.getElementById('fadeOrderDetail').style.display = 'block';
    $.get(`/api/get_payment_event/${id}`, (data, status) => {
        let result = data.data;
        let arr = event.session;
        $('#idTitlePopup').text(`THANH TOÁN ${result[0].eventId.name}`);
        $('#idBodyReport > tr').remove();
        let tbody = $('#idBodyReport');
        result.forEach((e, i) => {
            let user = e.userId || {};
            let html = `<tr><th scope="row">${(i + 1)}</th><td>${e.sender.fullName}</td><td>${e.amount}</td><td>${e.payType || ''}</td><td>${new Date(e.createdAt).toLocaleDateString()}</td></tr>`
            tbody.append(html);
        });
        document.querySelector('.lds-default').classList.toggle('hidden');
    })

}

function ThanhToan(id, amount) {

    if (confirm(`Xác nhận thanh toán cho người dùng`)) {
        document.querySelector('.lds-default').classList.toggle('hidden');
        $.ajax({
            type: 'POST',
            url: '/api/thanh_toan',
            data: { id, amount },

        }).done((data) => {

            table.ajax.reload(null, false);
            document.querySelector('.lds-default').classList.toggle('hidden');
        }).fail(err => {
            document.querySelector('.lds-default').classList.toggle('hidden');
            alert(err.responseJSON.message);
            console.log(err.responseJSON.message);
        })
    }
}

$(document).ready(function () {

});
