const btn = document.getElementById('registerbtn');
const modal = document.getElementById('codeModal');

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email')?.value.trim();
    const senha = document.getElementById('password')?.value.trim();
    const username = document.getElementById('username')?.value.trim();
    const errorEl = document.getElementById('error');

    // Validação simples
    if (!email || !senha || !username) {
        if (errorEl) errorEl.innerText = "Please fill in all fields!";
        return; // interrompe aqui
    }

    try {
        const res = await fetch('http://192.168.0.24:7000/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha, username, method: 'send_code' })
        });
        const responsereq = await res.json()
        console.log(responsereq)
        console.log(responsereq.code)
        if (responsereq.code == "sent") {
            if (modal) modal.style.display = 'flex';
            if (errorEl) errorEl.innerText = '';
            async function send_code() {
                
                if (!document.getElementById("codeInput").value)
                {
                    document.getElementById("error2").innerText = "Please insert the code"
                } else
                {
                    try {
                        const res = await fetch('http://192.168.0.24:7000/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, senha, username, code: `${document.getElementById("codeInput").value}`,  method: 'verify_and_create' })
                        });
                        const data = await res.json()
                        console.log(data)
                        if (data.error == "code wrong") {
                            document.getElementById("error2").innerText = "Wrong code"
                        } else if (data.error == "name_exists"){
                            modal.style.display = 'none'
                            errorEl.innerText = "This username is already taken"
                            document.getElementById("codeInput").value = ""
                        } else if (data.error == "unknow_error") {
                            modal.style.display = 'none'
                            errorEl.innerText = "Unknow error happened"
                        } else if (data.success == "account_created_successfully!") {
                            window.location.href = "login"
                        } else if (data.error == "EMAIL_EXISTS") {
                            modal.style.display = 'none'
                            errorEl.innerText = "Email Exists"
                        }
                    } catch (err) {
                        if (errorEl) errorEl.innerText = "Connection error."
                        if (modal) modal.style.display = 'none';
                    }
                    
                }
                
            

            }
            document.getElementById("verifyBtn").addEventListener('click', send_code)
        } else {
            errorEl.innerText = "Connection Error."
        }
        
    } catch (err) {
        if (errorEl) errorEl.innerText = "Connection error.";
        console.error(err);
    }
});
