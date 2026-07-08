const nameinp = document.getElementById("searchInput");

async function check () {
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

nameinp.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // evita comportamento padrão (tipo submit/reload)
    console.log("Valor atual:", e.target.value);
    onSearchInput(e.target.value);
  }
});


function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

window.loginToken = getCookie("DONT SHARE IT WITH ANYONE, THEY WILL STEAL UR ACCOUNT!");
const userid = getCookie("THIS IS A IMPORTANT INFORMATION, IF YOU SHARE THIS YOUR ACCOUNT IS ON RISK")


let pickedupuser = ""

let cooldown = false;
let cooldownTimer = null;

function startCooldown(seconds) {
    cooldown = true;

    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = `<p style="color:var(--text-muted);">Aguarde ${seconds}s antes de pesquisar novamente...</p>`;

    // limpa timer anterior se existir
    if (cooldownTimer) clearInterval(cooldownTimer);

    let timeLeft = seconds;

    cooldownTimer = setInterval(() => {
        timeLeft--;

        resultDiv.innerHTML = `<p style="color:var(--text-muted);">Aguarde ${timeLeft}s...</p>`;

        if (timeLeft <= 0) {
            clearInterval(cooldownTimer);
            cooldown = false;
            resultDiv.innerHTML = "";
        }
    }, 1000);
}

function searchUsers() {
    if (cooldown) return;

    const q = document.getElementById("searchInput").value.trim();
    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    if (q === "") return;

    fetch("http://192.168.0.24:7000/search_users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + window.loginToken
        },
        body: JSON.stringify({ query: q })
    })
    .then(res => res.json())
    .then(data => {

        console.log(data);

        // -------------------------
        // 🚨 VERIFICA RATE LIMIT
        // -------------------------
        if (data.error === "too_many_requests" && data.cooldown) {
            startCooldown(Math.ceil(data.cooldown));
            return;
        }

        if (data.error === "too_many_requests_minute" && data.retry_after) {
            startCooldown(Math.ceil(data.retry_after));
            return;
        }

        // -------------------------
        // RESULTADOS NORMAIS
        // -------------------------
        const filtered = data.results || [];

        if (filtered.length === 0) {
            resultDiv.innerHTML = `<p style="color:var(--text-muted);">Nenhum usuário encontrado...</p>`;
            return;
        }

        filtered.forEach(u => {
            const el = document.createElement("div");
            el.className = "message";
            el.style.cursor = "pointer";
            el.innerHTML = `
                <span class="message-author">${u.username || "(sem nome)"}</span>
                <span class="message-text">ID: ${u.userid}</span>
            `;
            el.onclick = () => {
                // document.getElementById("frprofModal").style.display = "flex";
                // document.getElementById("username").textContent = u.username;
                pickedupuser = u.username
                checkfriendreqreachable()
            };

            resultDiv.appendChild(el);
        });

    })
    .catch(err => {
        console.error("Erro:", err);
        resultDiv.innerHTML = `<p style="color:red;">Erro ao buscar usuários.</p>`;
    });
}



async function checkfriendreqreachable() {

    try {
        const res = await fetch("http://192.168.0.24:7000/checkfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + window.loginToken
            },
            body: JSON.stringify({
                hisusrid: pickedupuser,
                userid: somepotatointheworld
            })
        });

        const data = await res.json();

        console.log("STATUS:", res.status);
        console.log("RESPOSTA:", data);

        if (res.ok) {
            document.getElementById("username").textContent = pickedupuser;
            document.getElementById("frprofModal").style.display = "flex";
        }


    } catch (err) {
        console.error("💥 Erro na request:", err);
    }
}

let searchTimeout = null;

function onSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchUsers, 0);
}

function closeModal() {
  document.getElementById("frprofModal").style.display = "none";
}






async function sendfr() {
    const btn = document.getElementById("sendfrbtn");

    btn.disabled = true;
    
    try {
        const res = await fetch("http://192.168.0.24:7000/sendfr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + window.loginToken
            },
            body: JSON.stringify({
                tousr: pickedupuser
            })
        });

        const data = await res.json();

        console.log("STATUS:", res.status);
        console.log("RESPOSTA:", data);

        if (!res.ok) {
            if (data.retry_after) {
                console.log(`⏳ Espera ${data.retry_after}s pra tentar de novo`);
            }
            return;
        }

        document.getElementById("frprofModal").style.display = "none";
        console.log("✅ Friend request enviada com sucesso!");

    } catch (err) {
        console.error("💥 Erro na request:", err);
    }
}

check()