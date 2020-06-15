class ChatBox {
    constructor(arr) {
        this.arrBox = arr;
        this.lengthArr = arr.length;
        this.maxLength = ~~((+window.outerWidth - 318) / 302);
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
                <input id="chatContent${v.id}" style="height: 34px; line-height: none !important;" placeholder="Chat content.." rows="10" cols="5" name="message"></input>
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
            $(`#chatContent${v.id}`).keypress(function (event) {
                if (event.keyCode === 13) {
                    let content = $(`#chatContent${v.id}`).val().trim();

                    if (content != '')
                        if (!event.shiftKey) {

                            $(`#chatContent${v.id}`).val('');
                            chatBox.appendAdminChat({ id: v.id, src: 'admin', content })
                            socket.emit('admin-sent-content', { src: 'admin', content, user: v })
                            let message = document.getElementById(`contentChat${v.id}`);
                            message.scrollTop = message.scrollHeight;
                        }
                }
            });

        } else {

        }

    }

    loadMore(v, page) {
        let index = this.arrBox.findIndex(u => u.id === v.id);
        if (index !== -1) {
            let pageNumber = page / 50; // /5
            pageNumber++;
            $.get(`/api/chat/get_list?sender=${v.id}&pageNumber=${pageNumber}`, (data, status) => {
                // let arr = data.result;
                let arr = data.result;
                let user = v;
                arr.reverse();
                let func = () => {
                    return new Promise((res, rej) => {
                        arr.forEach(e => {
                            if (e.sender != 'admin') {
                                this.prependUserChat({ id: user.id, src: user.fullName, content: e.content })
                            } else {
                                this.prependAdminChat({ id: user.id, src: e.sender, content: e.content })
                            }
                        });
                        res('true');
                    })
                }
                func().then(d => {
                    this.appendLoadMore(v);
                })
            });
        }
    }

    appendLoadMore(v) {
        $(`#contentChat${v.id} > .loadMore`).remove();
        let page = $(`#contentChat${v.id} > .doted-border`).length;
        if (page % 50 == 0) {
            $(`#contentChat${v.id}`).prepend(`<div class='loadMore'>load more</div>`);

            $(`#contentChat${v.id} > .loadMore`).click(() => {
                chatBox.loadMore(v, page);
            })

        }
    }

    prependUserChat(v) {
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
            $(`#contentChat${v.id}`).prepend(html);

        }
        return true;
    }

    prependAdminChat(v) {
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
            $(`#contentChat${v.id}`).prepend(html);
        }
        return true;
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
        }
        return true;
    }

    appendAdminChat(v) {
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
            $(`#contentChat${v.id}`).append(html);;
        }
        return true;
    }

    userLeave(user) {
        let index = this.arrBox.findIndex(u => u.id === user.id);
        if (index !== -1) {
            return this.arrBox.splice(index, 1)[0];
        }
    }

}

// var socket = io("http://localhost:4000/admin");
var socket = io("https://event-chat.herokuapp.com/admin");
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

    let u = userActive.findIndex(uu => uu.id === data.id);

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
    chatBox.appendUserChat({ id, src: data.user.fullName, content: data.data.content })
    $(`#numberMessage${id}`).text(data.user.number);
    let message = document.getElementById(`contentChat${v.id}`);
    message.scrollTop = message.scrollHeight;
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


$(function () {
    // socket.emit("admin-vao", 'sang');

    $(window).resize(() => {
        chatBox.maxLength = ~~((+window.outerWidth - 318) / 302);
    })

    if(sessionStorage.getItem('chatBox')==1){
        document.getElementById('qnimate').classList.toggle('showChatBox');
    }
    
    socket.emit("getUser", data => {
        $("#boxContent").html("");
        userActive = [...data];
        resetChatBox(data);
    })

    $("#addClass").click(function () {
        document.getElementById('qnimate').classList.toggle('showChatBox');
        sessionStorage.setItem('chatBox', $('.showChatBox').length);
    });


    $(".removeClass").click(function () {
        let id = this.getAttribute('data-close');
        $('#' + id).remove();
        //$("#addClass").addClass('popup-box-on');
    });

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
        let checkBoxExits = $(`#${u.id}`);
        chatBox.appendBox(u);
        if (!checkBoxExits[0]) {
            $.get(`/api/chat/get_list?sender=${v.id}`, (data, status) => {

                let user = v;
                let arr = data.result;

                let func = async () => {
                    return new Promise((res, rej) => {
                        arr.forEach(e => {
                            if (e.sender != 'admin') {
                                chatBox.prependUserChat({ id: user.id, src: user.fullName, content: e.content })
                            } else {
                                chatBox.prependAdminChat({ id: user.id, src: e.sender, content: e.content })
                            }

                        });
                        res('res');
                    })

                }

                func().then(dd => {
                    let message = document.getElementById(`contentChat${v.id}`);
                    message.scrollTop = message.scrollHeight;
                    chatBox.appendLoadMore(v);
                }
                ).catch(er => {

                })

            })
        }
    });
}

function ShowChatBox(t) {
    let id = t.getAttribute('data-user');
    let u = userActive.find(v => v.id == id);
    chatBox.appendBox(u);
}

