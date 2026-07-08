const form = document.getElementById('loginForm');
form.addEventListener('submit', async e => {
  e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const loginBtn = document.getElementById("login-btn");
    loginBtn.classList.add("loading");
    loginBtn.disabled = true;
    await new Promise(res => setTimeout(res, 2000));
      try {
        const res = await fetch('http://192.168.0.24:7000/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, senha})
        });
        
        if(res.ok) {
          const data = await res.json();
          if(data.status === "logged") {
            // checa se veio algo
          if (!data) {
            console.error("Resposta vazia do servidor");
          } else {
            // nomes curtos e válidos
            const loginName = "DONT SHARE IT WITH ANYONE, THEY WILL STEAL UR ACCOUNT!";
            

            // valores (escape)
            const loginValue = data.cookielogin ? encodeURIComponent(data.cookielogin) : "";

            // atributos - exemplo: expira em 15 minutos (900s)
            const attrs = `; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax`;

            // Se estiver em HTTPS e quiser, adicione '; Secure' (recomendado em produção).
            // Para cookies cross-site com SameSite=None, precisa também de Secure.

            // escreve
            document.cookie = `${loginName}=${loginValue}${attrs}`;

            console.log("Cookies set:", document.cookie);
          }


            window.location.href = 'dashboard';
          } else if (data.error == "loginfailed") {
            console.log(data)
            document.getElementById('error').innerText = "Email or Password is wrong";
            loginBtn.disabled = false
            loginBtn.classList.remove("loading");
          }
        } else {
          document.getElementById('error').innerText = `HTTP error ${res.status}`;
          loginBtn.disabled = false
          loginBtn.classList.remove("loading");
        }
      } catch(err) {
        document.getElementById('error').innerText = "Connection error. Make sure the server is running.";
        loginBtn.disabled = false
        loginBtn.classList.remove("loading");
        console.error(err);
      }
});