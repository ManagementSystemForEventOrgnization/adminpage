const id = location.pathname.split("/")[3];
customParams = "";
idSession = "";
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
                rowId: 's1',
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
                    "url": `/api/datatable/apply_event_cancel/`,
                    "contentType": "application/json",
                    "type": "GET",
                    "dataType": "JSON",
                    "data": function (d) {
                        d.myCustomParams = customParams;
                        d.idEvent = id;// idCongViec;
                        d.idSession = idSession;
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


function search1() {
    idSession = $('#idSearch').val();
    table.ajax.reload();
}

function ShowSessionApply(id){
    document.querySelector('.lds-default').classList.toggle('hidden');
    document.getElementById('lightOrderDetail').style.display = 'block';
    document.getElementById('fadeOrderDetail').style.display = 'block';
    $.get(`/api/get_session_apply/${id}?isCancel=1`, (data, status) => {
        let event = data.result.event;
        let arr = data.result.session;
        console.log(arr);
        $('#idTitlePopup').text(`DANH SÁCH THAM GIA SESSION ${event.name}`);
        $('#OrderDetail').text('');
        let baseURLWeb = '';
        let length = arr.length - 1;
        arr.forEach((e, i) => {
            let template = `<div class="col-sm-6 left padding-left-right-0-m" style='margin-left: ${((i==length)%2)==0?'0px':'25%'}'>
                <div class="card">
                    <div class="card-cover relative lazyload-hot-event"
                        data-src="${event.bannerUrl}"
                        style="background-image:
                        url(&quot;${event.bannerUrl}&quot;);">
                        <div class="badge-live-event">
                            ${event.status || 'Run'}
                        </div>
                        <a data-opm="0"
                            href="${event.domain || ''}${event.urlWeb}"
                            class="cover-img w-100 event-item-link"
                            data-event-id="79608"></a>
                    </div>
                    <div class="card-body relative">
                        <div class="padding-10">
                            <div class="table w-100 margin-bottom-0">
                                <div class="table-cell event-title">
                                    <a data-opm="0"
                                        href="${event.domain || ''}${event.urlWeb}"
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

function Delete(id) {
    // reject all session of user
   
    if (confirm("Xác nhận xóa!")) {
        document.querySelector('.lds-default').classList.toggle('hidden');
        $.ajax({
            type: 'POST',
            url: '/api/event/reject_user',
            data: { applyEventId: id },
        }).done((data) => {
            console.log(data);
            appendAlert(data || 'Success',10000);
            document.getElementById('lightOrderDetail').style.display = 'none';
            document.getElementById('fadeOrderDetail').style.display = 'none';
            
            document.querySelector('.lds-default').classList.toggle('hidden');
            table.ajax.reload();
        }).fail((err) => {
            document.querySelector('.lds-default').classList.toggle('hidden');
            appendAlert(err.responseJSON.message)
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