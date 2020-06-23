customParams = "";
<<<<<<< HEAD
multiSearch = "";
=======
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
function GetColumnsForDatatable(count) {
    var shit = new Array();
    for (var i = 0; i < count; i++) {
        shit.push({ "data": "s" + (i + 1) })
    }
<<<<<<< HEAD
    return shit;
}

=======
    // shit.push({ "data": "name" });
    // shit.push({ "data": "address:" });
    // shit.push({ "data": "limitNumber" });
    // shit.push({ "data": "joinNumber" });
    // shit.push({ "data": "startTime" });
    // shit.push({ "data": "status" });
    // shit.push({ "data": "urlWeb" });
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
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea

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
<<<<<<< HEAD
                {
                    "url": "/api/datatable/event",
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
=======
                  {
                      "url": "/api/datatable/event",
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
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
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


function search1() {
<<<<<<< HEAD
    let status = $('#idTT').val();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let fee = $('#traPhi:checkbox:checked').length;
    multiSearch = { status, startDate, endDate, fee };
    table.ajax.reload();
}

function ShowSession(id) {
    document.querySelector('.lds-default').classList.toggle('hidden');
    document.getElementById('lightOrderDetail').style.display = 'block';
    document.getElementById('fadeOrderDetail').style.display = 'block';
    $.get(`/api/get_session/${id}`, (data, status) => {
        let event = data.result;
        let arr = event.session;
        console.log(arr);
        $('#idTitlePopup').text(`DANH SÁCH SESSION ${event.name}`);
        $('#OrderDetail').text('');
        let baseURLWeb = '';
        arr.forEach((e, i) => {
            let template = `<div class="col-sm-6 left padding-left-right-0-m">
                <div class="card">
                    <div class="card-cover relative lazyload-hot-event"
                        data-src="${event.bannerUrl}"
                        style="background-image:
                        url(&quot;${event.bannerUrl}&quot;);">
                        <div class="badge-live-event">
                            ${event.status || 'Run'}
                        </div>
                        <a data-opm="0"
                            href="${baseURLWeb}/${event.urlWeb}"
                            class="cover-img w-100 event-item-link"
                            data-event-id="79608"></a>
                    </div>
                    <div class="card-body relative">
                        <div class="padding-10">
                            <div class="table w-100 margin-bottom-0">
                                <div class="table-cell event-title">
                                    <a data-opm="0"
                                        href="${event.urlWeb}"
                                        title="[Livestream] Live Max Microwave
                                        2020" class="event-item-link"
                                        data-event-id="79608">
                                        ${e.name}
                                    </a>
                                </div>
                                <div class="table-cell card-right-block">
                                </div>
                            </div>
                            <div class="table w-100 margin-bottom-0">
                                <div class="table-cell">
                                    <div class="event-price w-100">`;
            if (event.isSellTicket && event.ticket && event.ticket.price) {
                template += `<span class="color-6">Từ</span> ${event.ticket.price} <strong> VND</strong>`;
            }
            template += `<div class="event-tags w-100">
                                        <span class="tag-venues">
                                        </span>
                                        <div class="tag-kinds inline-block">
                                            <span class="ello-th color-c"></span>
                                            <a data-opm="0"
                                                href="/events?Categories=8"
                                                class="tag-kind">${event.category.name}</a>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="event-date">
                            <div class="relative">
                                <div class="date-month">
                                   Tháng ${new Date(e.day).getMonth()}
                                </div>
                                <div class="date-detail">
                                    <div class="date-num color-6">
                                    Ngày ${new Date(e.day).getDate()}
                                    </div>
                                    <div class="date-day">
                                    Thứ ${ + new Date(e.day).getDay() + 1}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`

            $('#OrderDetail').append(template);
        });
        document.querySelector('.lds-default').classList.toggle('hidden');
    })

}

function Delete(id, status = 'CANCEL') {

    if (confirm(`Xác nhận ${status}!`)) {
        document.querySelector('.lds-default').classList.toggle('hidden');
        $.ajax({
            type: 'POST',
            url: '/api/deleteEvent',
            data: { id, status: 'CANCEL' },

        }).done((data) => {
            if (data.message != 'success') {
                console.log(data);
                alert(`${data.message}`);
            } else {
                table.ajax.reload();
            }
            document.querySelector('.lds-default').classList.toggle('hidden');
        }).fail(err => {
            document.querySelector('.lds-default').classList.toggle('hidden');
            alert(err.responseJSON.message);
            console.log(err.responseJSON.message);
        })
    }
}


$(document).ready(function () {
    document.querySelector('.lds-default').classList.toggle('hidden');
    $('#startDate').datetimepicker({
        lang: 'vi',
        timepicker: false,
        format: 'Y/m/d',
        formatDate: 'Y/m/d',
    });
    $('#endDate').datetimepicker({
        lang: 'vi',
        timepicker: false,
        format: 'Y/m/d',
        formatDate: 'Y/m/d',
    });
    document.querySelector('.lds-default').classList.toggle('hidden');
});
=======
    customParams = $('#idSearch').val();
    table.ajax.reload();
}


function Change(id) {
    // cho cái select bõ hiện lên.
    document.getElementById(`selectOption_${id}`).classList.toggle('hidden');
    document.getElementById(`label_TT_${id}`).classList.toggle('hidden');
    document.getElementById(`buttonSave_${id}`).classList.toggle('hidden');
    document.getElementById(`buttonChange_${id}`).classList.toggle('hidden');

    
}


function Save(id) {
    if (confirm("Xác nhận lưu!")) {
        document.getElementById(`selectOption_${id}`).classList.toggle('hidden');
        document.getElementById(`label_TT_${id}`).classList.toggle('hidden');
        document.getElementById(`buttonSave_${id}`).classList.toggle('hidden');
        document.getElementById(`buttonChange_${id}`).classList.toggle('hidden');
        let valueSelect1 = $(`#selectOption_${id} option:selected`).text();
        document.getElementById(`label_TT_${id}`).innerText = valueSelect1;
        let valueSelect = $(`#selectOption_${id}`).val();
        // luu lai trang thai cua no nua.
        $.get(`../Ajax.aspx?Action=SaveTT&id=${id}&value=${valueSelect}`, (data, status) => {
            if (data != 'fasle') {

            } else {
                alert('Server đang bận bạn vui lòng quay lại sau.');
            }
        });
    }
}

function Print(id) {
    //alert('Chưa xác định được mẫu in.');
       
    $.get('../Ajax.aspx?Action=LoadIn&id=' + id, (data, status) => {
        
        var print = window.open('', '_blank');

        var shtml = "<html>";
        shtml += "<body onload=\"window.print(); window.close();\">";
        shtml += data;

        shtml += "</body>";
        shtml += "</html>";

        print.document.write(shtml);
        print.document.close();
    });
    // xu ly in ne;
}
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
