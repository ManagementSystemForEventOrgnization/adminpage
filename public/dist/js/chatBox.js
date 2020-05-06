class ChatBox {
    constructor(arr) {
        this.arrBox = arr;
        this.lengthArr = arr.length;
        this.maxLength = ~~(+window.innerWidth / 302)
        this.width = 318;
    }

    repairChatBox() {
        this.arrBox.forEach((box, i) => {
            let right = (+i) * this.width + this.width;
            $('#' + box.id).css('right', right + 'px')
        });
    }

    appendBox(v) {
        let id = v.id;
        let index = this.arrBox.findIndex(eml => eml.id == id);
        if (index === -1) {
            if (this.maxLength === this.lengthArr) {
                // xac nhan da full mang.
                this.arrBox.map(eml => {
                    $('#' + eml.id).remove();
                });
                this.arrBox = [];
                this.lengthArr = 0;
            }
            this.arrBox.push(v);
            this.lengthArr++;
            let right = (+this.lengthArr - 1) * this.width + this.width;

            let html = `<div class="popup-box chat-popup popup-box-on" id="${v.id}"  style="right: ${right}px;">
            <div class="popup-head" id='head${v.id}'>
                <div class="popup-head-left pull-left"><img
                        src="/avata.png"
                        alt="iamgurdeeposahan"> ${v.fullName}</div>
                <div class="popup-head-right pull-right">
                    <button data-widget="remove" class="chat-header-button pull-right" id="remove${v.id}" type="button"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="popup-messages">
                <div class="direct-chat-messages" style='max-height: 265px !important;' id='contentChat${v.id}'>

                    
                    <!-- /.direct-chat-msg -->
                </div>
            </div>
            <div class="popup-messages-footer">
                <textarea id="chatContent${v.id}" data-element='${v}' style="height: 34px; line-height: none !important;" placeholder="Chat content.." rows="10" cols="5" name="message"></textarea>
            </div>
        </div>`

            $('#arrChatBox').append(html);

            $('#remove' + v.id).click(() => {
                $('#' + v.id).remove();
                let ind = this.arrBox.findIndex(v1 => v1.id == v.id);
                this.arrBox.splice(ind, 1);
                this.lengthArr = this.arrBox.length;
                this.repairChatBox();
            });

            $('#head' + v.id).click(() => {
                document.getElementById(v.id).classList.toggle('showChatBox');
                $("#addClass").removeClass('popup-box-on');
            })
            $(`#chatContent${v.id}`).autoResize();

            $(`#chatContent${v.id}`).keypress(function (event) {
                if (event.keyCode === 13) {
                    if (!event.shiftKey) {
                        let content = $(`#chatContent${v.id}`).val();
                        $(`#chatContent${v.id}`).val('');
                        chatBox.appendAdminChat({ id: v.id, src: 'admin', content })

                        socket.emit('admin-sent-content', { src: 'admin', content, user: v })
                    }
                }
            });

        } else {

        }

    }

    appendUserChat(v) {
        let index = this.arrBox.findIndex(u => u.id === v.id);
        if (index !== -1) {
            let html = `<div class="direct-chat-msg doted-border">
                            <div class="direct-chat-info clearfix">
                                <span class="direct-chat-name pull-left">${v.src}</span>
                            </div>
                            <!-- /.direct-chat-info -->
                            <img alt="iamgurdeeposahan"
                                src="/avata.png"
                                class="direct-chat-img"><!-- /.direct-chat-img -->
                            <div class="direct-chat-text">
                                ${v.content}
                            </div>
                            <!-- <div class="direct-chat-info clearfix">
                                <span class="direct-chat-timestamp pull-right">3.36 PM</span>
                            </div> -->
                        </div>`;
            $(`#contentChat${v.id}`).append(html);
            let message = document.getElementById(`contentChat${v.id}`);

            message.scrollTop = message.scrollHeight;
        }
    }

    appendAdminChat(v){
        let index = this.arrBox.findIndex(u => u.id === v.id);
        if (index !== -1) {
            let html = `<div class="direct-chat-msg doted-border">
                            <div class="direct-chat-info clearfix">
                                <span class="direct-chat-name-admin pull-right">${v.src}</span>
                            </div>
                            <!-- /.direct-chat-info -->
                            <img alt="iamgurdeeposahan"
                                src="/avata.png"
                                class="direct-chat-img-right"><!-- /.direct-chat-img -->
                            <div class="direct-chat-text-right">
                                ${v.content}
                            </div>
                            <!-- <div class="direct-chat-info clearfix">
                                <span class="direct-chat-timestamp pull-right">3.36 PM</span>
                            </div> -->
                        </div>`;
            $(`#contentChat${v.id}`).append(html);
            let message = document.getElementById(`contentChat${v.id}`);

            message.scrollTop = message.scrollHeight;
        }
    }

    userLeave(user) {
        let index = this.arrBox.findIndex(u => u.id === user.id);
        if (index !== -1) {
            return this.arrBox.splice(index, 1)[0];
        }
    }

}

var socket = io("http://localhost:5000/admin");

let chatBox = new ChatBox([]);
let userActive = [];

// localStorage.setItem('items', JSON.stringify(itemsArray))
// const data = JSON.parse(localStorage.getItem('items'))

socket.on("server-sent-user", function (data) {
    userActive = [...data];
    //localStorage.setItem('chatBoxOnline', JSON.stringify(data))
    // const data1 = JSON.parse(localStorage.getItem('chatBoxOnline'));

    resetChatBox(data);
});

socket.on("newUserConnect", data => {

    let u = userActive.findIndex(uu => uu.fullName === data.fullName);

    if (u !== -1) {
        // user da co k can them vao maf chi can reset lai trang thi cua no neu can

    } else {
        userActive.push(data);
        //let arr = JSON.parse(localStorage.getItem('chatBoxOnline'));
        //arr.push(data);
        addNewUser(data);
    }
})

socket.on('userSentMessage', data => {
    let id = data.user.id; // thang nay moi la id dun
    chatBox.appendUserChat({ id, src: data.data.fullName, content: data.data.content })
    $(`#numberMessage${id}`).text(data.user.number);
})

socket.on('user-leave', user => {
    const index = userActive.findIndex(u => u.id === user.id);
    if (index !== -1) {
        let u1 = userActive.splice(index, 1)[0];
        $('#label' + u1.id).remove();
        let u = chatBox.userLeave(user);
        if (u) {
            $('#remove' + u.id).click();
        }
    }
})

socket.on('chatValue', data => {
    let id = data.value.data;
    let arr = data.value.arr;
    arr.forEach(e => {

        console.log(e);
        if(e.src!='admin'){
            chatBox.appendUserChat({ id: id.data.id, src: e.src, content: e.content })
        }else{
            chatBox.appendAdminChat({ id: id.data.id, src: e.src, content: e.content })
        }

    //     let html = `<div class="direct-chat-msg doted-border">
    //     <div class="direct-chat-info clearfix">
    //         <span class="direct-chat-name pull-left">${e.src}</span>
    //     </div>
    //     <!-- /.direct-chat-info -->
    //     <img alt="iamgurdeeposahan"
    //         src="/avata.png"
    //         class="direct-chat-img"><!-- /.direct-chat-img -->
    //     <div class="direct-chat-text">
    //         ${e.content}
    //     </div>
    //     <div class="direct-chat-info clearfix">
    //         <span class="direct-chat-timestamp pull-right">3.36 PM</span>
    //     </div>
    //     <!-- /.direct-chat-text -->
    // </div>`

    //     $(`#contentChat${id.data.id}`).append(html);

    });
    let message = document.getElementById(`contentChat${id.data.id}`);
    message.scrollTop = message.scrollHeight;
});

$(function () {
    socket.emit("admin-vao", 'sang');


    socket.emit("getUser", data => {
        $("#boxContent").html("");
        userActive = [...data];
        resetChatBox(data);
    })

    $("#addClass").click(function () {
        document.getElementById('qnimate').classList.toggle('showChatBox');
    });


    $(".removeClass").click(function () {
        let id = this.getAttribute('data-close');
        $('#' + id).remove();
        //$("#addClass").addClass('popup-box-on');
    });

    $("textarea").autoResize();
})

function resetChatBox(arr) {
    var list = document.getElementById("DanhSachUser");
    // As long as <ul> has a child node, remove it
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    arr.map(v => {
        addNewUser(v);
    })
}


function addNewUser(v) {
    let html = `<div class="direct-chat-messages" id="label${v.id}" style="cursor: pointer;" data-user='${v.id}'>
    <div class="direct-chat-msg doted-border" >
        <div class="direct-chat-info clearfix">
            <span class="direct-chat-name pull-left" style="margin: 0 0px -10px 50px !important;">${v.fullName}</span> 
            <span class='numberMessage' id='numberMessage${v.id}'>${v.number || ''}</span> <span class="pull-right userActive"></span>
        </div>
        <img alt="iamgurdeeposahan"
            src="${v.avata || '/avata.png'}"
            class="direct-chat-img"><!-- /.direct-chat-img -->
    </div>
</div>`
    $('#DanhSachUser').append(html);

    $("#label" + v.id).click(function () {
        let u = userActive.find(v1 => v1.id == v.id);
        chatBox.appendBox(u);
        socket.emit('getContent', v);
    });
}

function ShowChatBox(t) {
    let id = t.getAttribute('data-user');
    let u = userActive.find(v => v.id == id);
    chatBox.appendBox(u);
}

