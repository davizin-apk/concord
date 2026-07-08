const apiBase = "http://127.0.0.1:7000";
const lista = [
  { id: 1, text: "We Are Loading somethings for the best experience" },
  { id: 2, text: "Loading Concord Dash..." },
  { id: 3, text: "Sup 😎" },
  { id: 4, text: "Chat With everyone!" },
  { id: 5, text: 'console.log("Hello!")' },
  { id: 6, text: "Welcome back!" },
  { id: 7, text: "Conquer the world.." },
  { id: 8, text: "We're trying some new things!" },
  { id: 9, text: "Thank You So much for using Concord" },
  { id: 10, text: "Loading your all data!" }
];

// Escolhe um aleatório
const textto = lista[Math.floor(Math.random() * lista.length)];
const text = document.getElementById("textloading")
text.textContent = textto.text
console.log(textto.id)


window.scrollTo(0, 0);


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function showToast(text) {
    const toast = document.getElementById("toast");
    const span = document.getElementById("spanacceptfr");

    toast.classList.remove("hide");
    toast.classList.add("show");
    span.textContent = `${text}`

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
    }, 3000);
}



function closeModal() {
  const modal = document.getElementById('frprofModal');
  modal.style.display = "none"
}


function openusrprofilefromfr(btn) {
    const modal = document.getElementById('frprofModal');
    document.getElementById("modaltext").innerHTML = btn.getAttribute("username")
    modalfriendselected = `${btn.getAttribute("userid")}`
    modalfriendselectedname = `${btn.getAttribute("username")}`
    console.log(modalfriendselected)
    modal.style.display = "flex"
}

let friendrequestsTabLoaded = false
let friendsTabLoaded = false
let messageTabLoaded = false
let modalfriendselected = false
let modalfriendselectedname = false
let timeout = false;
const friendsCache = {};
const friendrequestCache = {};


async function hideLoadingScreen() {
  const loading = document.getElementById("loading-screen");
  if (loading) {
    // espera 2 segundos
    await wait(2000);


    function getCookie(name) {
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
      }
      return null;
    }

    

    // exemplo de uso
      window.loginToken = getCookie("DONT SHARE IT WITH ANYONE, THEY WILL STEAL UR ACCOUNT!");
      const userid = getCookie("THIS IS A IMPORTANT INFORMATION, IF YOU SHARE THIS YOUR ACCOUNT IS ON RISK")

    if (!loginToken) {
      window.location.href = "login"
    } else {
        connectWS();
    }



    try {
        const res = await fetch(`http://192.168.0.24:7000/verify_access_token`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json', "Authorization": "Bearer " + loginToken},
          
        });
        
        if(res.status == 401) {
          document.getElementById("error").innerText = "Unauthorized"
        } else{
          const data = await res.json();
          window.frs = [];  
          window.cnns = [];
          if (data.frs) {
            
            Object.values(data.frs).forEach(fr => {
                console.log(fr);
                frs.push(fr);
                console.log(frs);
            });
          }

          if (data.cnns) {
              Object.keys(data.cnns).forEach(conn => {
                  cnns.push(conn);
              });
          }
        
          
          if (data.success == "tokenvalid") {
            window.username = data.username
            console.log(username)
            friendstabupdate()
          }

          await wait(600);

          // remove do DOM
          loading.remove();
        }
      } catch(err) {
        document.getElementById('error').innerText = "Connection error.";
        console.error(err);
      }


      try {
        const res = await fetch(`http://192.168.0.24:7000/get_userid_by_token`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json', "Authorization": "Bearer " + loginToken},
          
        });
        
        if(res.status == 401) {
          document.getElementById("error").innerText = "Unauthorized"
        } else{
          const data = await res.json();
          
          if (data.success == "tokenvalid") {
            window.somepotatointheworld = data.userid
            console.log(somepotatointheworld)
          }

          await wait(600);

          // remove do DOM
          loading.remove();
        }
      } catch(err) {
        document.getElementById('error').innerText = "Connection error.";
        console.error(err);
      }


  }
}

// chama quando a página terminar de carregar
window.addEventListener("load", async () => {
  await hideLoadingScreen();

  
  console.log("Página carregou e loading sumiu!");
});



const listnm = [
  { id: 1, text: "1" },
  { id: 2, text: "2" },
  { id: 3, text: "likely guy" },
  { id: 4, text: "some guy" },
  { id: 5, text: 'hecker' },
  { id: 6, text: "concord user" },
  { id: 7, text: "idk" },
  { id: 8, text: "true" },
  { id: 9, text: "friendly" },
  { id: 10, text: "dev?" }
];

// WebSocket
    let ws2 = new WebSocket("ws://192.168.0.24:8000");

    ws2.onopen = () => console.log("Connected to WebSocket accountss");
    ws2.onmessage = (msg) => {
      let data = JSON.parse(msg.data);
      if (data.tousr == somepotatointheworld) {
        if (data.type == "fr") {
          console.log(data.fromusr)
          frs[data.fromusr] = data.fromusr
          frlistsupdate()
        } else if (data.type == "acp") {
            add_f_to_list_client(data.fromusr)
            showToast(`${data.username} Aceitou seu pedido de Amizade`)
            console.log(data.fromusr)
        }
      }
      console.log(data)
    };

    

    let accessToken = "";
    let thisusername = window.username
    let color = "#3498db";
    let roomId = "25";
    const secretKey = "kd99**090@#&94859!8";

    // WebSocket
    let currentFriend = null;
    let currentFriendName = null;

    console.log(window.loginToken)

    let ws = null;

    function connectWS() {
        if (!loginToken) {
            console.log("sem token ainda");
            return;
        }

        ws = new WebSocket(
            "ws://192.168.0.24:3000?token=" + loginToken
        );

        ws.onopen = () => console.log("WS conectado");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
        };
    }

    ws.onopen = () => {
        console.log("Conectado ao servidor DM");
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const div = document.createElement("div");
        div.className = "message";

        const author = document.createElement("span");
        author.className = "message-author";
        author.textContent = data.from_username + ": ";

        const text = document.createElement("span");
        text.className = "message-text";
        text.textContent = data.message;

        div.appendChild(author);
        div.appendChild(text);

        document.getElementById("messages").appendChild(div);
    };

    ws.onerror = (err) => {
        console.error(err);
    };

    ws.onclose = () => {
        console.log("Desconectado");
    };



async function frlistsupdate() {
    const frtou = document.getElementById("frtou");
    frtou.innerHTML = "";

    for (const fr of Object.values(frs)) {

        // Já carregou esse amigo antes?
        if (friendrequestCache[fr]) {
            frtou.insertAdjacentHTML(
                "beforeend",
                `<button class="frtoubtn"
                        userid="${fr}"
                        username="${friendrequestCache[fr]}"
                        onclick="openusrprofilefromfr(this)"
                        oncontextmenu="showFriendMenu(event, this)">
                    ${friendrequestCache[fr]}
                </button>`
            );
            console.log(friendrequestCache[fr])
            continue;
        }

        try {
            const res = await fetch("http://192.168.0.24:7000/usrusernamebyuserid", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + loginToken
                },
                body: JSON.stringify({
                    userid: fr
                })
            });

            const data = await res.json();

            // Salva no cache
            friendrequestCache[fr] = data.username;

            frtou.insertAdjacentHTML(
                "beforeend",
                `<button class="frtoubtn"
                        userid="${fr}"
                        username="${friendrequestCache[fr]}"
                        onclick="openusrprofilefromfr(this)"
                        oncontextmenu="showFriendMenu(event, this)">
                    ${data.username}
                </button>`
            );  

        } catch (err) {
            console.error(err);
        }
    }
}



function openfrtab() {
    closemessagetab();
    closeftab();
    document.getElementById("frtou").hidden = false;

    if (!friendrequestsTabLoaded) {
        friendrequestsTabLoaded = true;
        frlistsupdate();
    }
}

function openmessagetab(friend, fun) {
    console.log(friend)
    currentFriend = friend
    currentFriendName = fun
    document.getElementById("message-area-name").innerHTML = ""
    document.getElementById("message-area-name").insertAdjacentHTML(
        "afterbegin",
        `<div class="linha">
            <div class="${currentFriend}" id="switch">
                <div class="quadrado cheio">
                    <div class="bolinha-central">D</div>
                </div>
                <div class="quadrado vazio">
                    <div class="loading">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
        </div>`
    );
    closeftab();
    closefrtab();
    document.getElementById("message-area").hidden = false;
    document.getElementById("inputmsg").addEventListener("input", handleTyping);

    if (!messageTabLoaded) {
        messageTabLoaded = true;
        frlistsupdate();
    }
}

function openftab() {
    closemessagetab();
    closefrtab();
    
    document.getElementById("friendstab").hidden = false;

    if (!friendsTabLoaded) {
        friendsTabLoaded = true;
        friendstabupdate();
    }
}


if (document.getElementById("frtou").children.length === 0) {
    document.getElementById("frtou").innerHTML = `
        <p style="font-size: 16px; color: var(--text-muted); margin-top: 4px;">
            Friend Requests
        </p>
    `;
}





async function friendstabupdate() {
    const friendstab = document.getElementById("friendstab");
    const friendsbar = document.getElementById("friendsbar");
    friendstab.innerHTML = "";
    friendsbar.innerHTML = "";

    for (const friend of Object.values(cnns)) {

        // cache
        if (friendsCache[friend]) {
            friendstab.insertAdjacentHTML(
            "beforeend",
                `<div class="frtoubtn"
                    userid="${friend}"
                    username="${friendsCache[friend]}">

                    <span class="friend-name">${friendsCache[friend]}</span>

                    <div class="friend-actions">
                        <button class="circle-btn call-btn"><i class="icon-phone"></i></button>
                        <button class="circle-btn msg-btn" onclick="openmessagetab(${friend})"><i class="icon-message-circle-more"></i></button>
                    </div>

                </div>`
            );
            friendsbar.insertAdjacentHTML(
            "beforeend",
                `<div class="frbarbtn"
                    onclick="openmessagetab('${friend}')"
                    userid="${friend}"
                    username="${friendsCache[friend]}">

                    <div class="linha"><div class="${friend} switch" id="switch"><div class="quadrado cheio"><div class="bolinha-central">D</div></div><div class="quadrado vazio"><div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div></div></div>
                    <span class="friend-name">${friendsCache[friend]}</span>

                </div>`
            );
            continue;
        }

        try {
            const res = await fetch(
                "http://192.168.0.24:7000/usrusernamebyuserid",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + loginToken
                    },
                    body: JSON.stringify({
                        userid: friend
                    })
                }
            );

            const data = await res.json();

            friendsCache[friend] = data.username;

            friendstab.insertAdjacentHTML(
            "beforeend",
                `<div class="frtoubtn"
                    userid="${friend}"
                    username="${friendsCache[friend]}">

                    <span class="friend-name">${friendsCache[friend]}</span>

                    <div class="friend-actions">
                        <button class="circle-btn call-btn"><i class="icon-phone"></i></button>
                        <button class="circle-btn msg-btn"><i class="icon-message-circle-more" onclick="openmessagetab(${friend})"></i></button>
                    </div>

                </div>`
            );

            friendsbar.insertAdjacentHTML(
            "beforeend",
                `<div class="frbarbtn"
                    onclick="openmessagetab('${friend}')"
                    userid="${friend}"
                    username="${friendsCache[friend]}">

                    <div class="linha"><div class="${friend} switch" id="switch"><div class="quadrado cheio"><div class="bolinha-central">D</div></div><div class="quadrado vazio"><div class="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div></div></div>
                    <span class="friend-name">${friendsCache[friend]}</span>
                    

                </div>`
            );

        } catch (err) {
            console.error(err);
        }
    }
}





function closefrtab() {
  document.getElementById("frtou").hidden = true;
}

function closemessagetab() {
    currentFriend = null
  document.getElementById("message-area").hidden = true;
}

function closeftab() {
  document.getElementById("friendstab").hidden = true;
}


function add_f_to_list_client(friend) {
    cnns.push(friend)
    friendstabupdate();
}

function remove_f_from_list_client(friend) {
    const key = Object.keys(cnns).find(k => cnns[k] === friend);
    delete cnns[key]
    console.log(key)
    friendstabupdate();
}

async function acceptfr() {
    try {
      const res = await fetch("http://192.168.0.24:7000/acceptfr", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + loginToken
          },
          body: JSON.stringify({
              friend: modalfriendselected
          })
      });


      const data = await res.json();

      if (data.status === "accepted") {
        delete friendsCache[modalfriendselected]
        document.querySelectorAll(".frtoubtn").forEach(btn => {
            if (btn.getAttribute("userid") == modalfriendselected) {
                btn.outerHTML = "";
            }
        });
        console.log("accepted")
        closeModal()
        add_f_to_list_client(modalfriendselected)
        showToast(`Pedido de amizade aceito para ${modalfriendselectedname}`);
      }

    

      } catch (err) {
          console.error(err);
      }
}



const dots = document.querySelectorAll(".dot");
let current = 0;

setInterval(() => {
    dots[current].classList.add("up");

    setTimeout(() => {
        dots[current].classList.remove("up");
        current = (current + 1) % dots.length;
    }, 200);

}, 400);



function handleTyping() {
  const elements = document.querySelectorAll(`#switch.${currentFriend}`);

  if (elements.length === 0) return;

  elements.forEach(el => el.classList.add("active"));

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    elements.forEach(el => el.classList.remove("active"));
  }, 3000);
}

document.getElementById("inputmsg").addEventListener("input", handleTyping);
