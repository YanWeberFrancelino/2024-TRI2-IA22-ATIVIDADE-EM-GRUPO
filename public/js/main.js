document.addEventListener('DOMContentLoaded', () => {
  
  const registerForm = document.getElementById('register-form');
  const loginForm = document.querySelector('form[data-action="login"]') || document.querySelector('form');
  const dashboardForm = document.querySelector('form#update-form'); 

  function showMessage(container, type, text) {
    const messageDiv = container.querySelector('#message');
    if (messageDiv) {
      messageDiv.className = ''; 
      messageDiv.classList.add(type);
      messageDiv.textContent = text;
      messageDiv.classList.remove('hidden');
      
      setTimeout(() => {
        messageDiv.classList.add('hidden');
      }, 5000);
    }
  }
  

  function validatePasswords(password, confirmPassword) {
    return password === confirmPassword;
  }

  async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form['confirm-password'].value;

    if (!validatePasswords(password, confirmPassword)) {
      showMessage(form, 'error', 'As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(form, 'error', data.error || 'Erro ao cadastrar usuário.');
      } else {
        showMessage(form, 'success', 'Cadastro realizado com sucesso. Redirecionando para login...');
        form.reset();
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      showMessage(form, 'error', 'Ocorreu um erro. Tente novamente.');
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const password = form.password.value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(form, 'error', data.error || 'Erro ao efetuar login.');
      } else {
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
      }
    } catch (error) {
      console.error('Erro ao efetuar login:', error);
      showMessage(form, 'error', 'Ocorreu um erro. Tente novamente.');
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const currentPassword = form['current-password'].value;
    const newPassword = form['new-password'].value;
    const confirmNewPassword = form['confirm-new-password'].value;

    if (newPassword && !validatePasswords(newPassword, confirmNewPassword)) {
      showMessage(form, 'error', 'As novas senhas não coincidem.');
      return;
    }

    let payload = { name, email, currentPassword };
    if (newPassword) {
      payload.newPassword = newPassword;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage(form, 'error', 'Token não encontrado. Faça login novamente.');
        window.location.href = 'index.html';
        return;
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(form, 'error', data.error || 'Erro ao atualizar dados.');
      } else {
        showMessage(form, 'success', 'Dados atualizados com sucesso.');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      showMessage(form, 'error', 'Ocorreu um erro. Tente novamente.');
    }
  }

  async function handleDeleteAccount(event) {
    event.preventDefault();
    const form = event.target;
    const password = form.password.value;

    if (!password) {
      showMessage(form, 'error', 'Por favor, insira sua senha para confirmar.');
      return;
    }

    const confirmDeletion = confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível.');
    if (!confirmDeletion) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage(form, 'error', 'Token não encontrado. Faça login novamente.');
        window.location.href = 'index.html';
        return;
      }

      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(form, 'error', data.error || 'Erro ao deletar conta.');
      } else {
        
        form.innerHTML = `
          <div class="success-message-container">
            <div id="message" class="success">Conta deletada com sucesso.</div>
            <button type="button" id="ok-button">OK</button>
          </div>
        `;
        localStorage.removeItem('token');

        document.getElementById('ok-button').addEventListener('click', () => {
          window.location.href = 'index.html';
        });
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      showMessage(form, 'error', 'Ocorreu um erro. Tente novamente.');
    }
  }

  async function fetchUserData() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = 'index.html';
        return;
      }

      const response = await fetch('/api/users/logged', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        return;
      }

      const userData = await response.json();
      document.getElementById('user-name').textContent = userData.name;
      document.getElementById('user-email').textContent = userData.email;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    }
  }

  async function listarUsuarios() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch('/api/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Erro ao listar usuários:', response.statusText);
        return;
      }

      const users = await response.json();

      const userListContainer = document.getElementById('list_users_with_name_email');
      userListContainer.innerHTML = '';

      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.innerHTML = `
          <p><strong>Nome:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
        `;
        userListContainer.appendChild(userDiv);
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
    }
  }

  function removeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.remove();
    }
  }

  document.getElementById('btn-dado')?.addEventListener('click', () => {
    const el = document.createElement('div');
    el.className = 'modal';
    el.innerHTML = `
      <form id="update-form">
        <div id="message"></div> <!-- Área de Mensagens Dentro do Formulário -->
        <div class="input-container">
          <label for="name">Nome</label>
          <input type="text" name="name" autocomplete="off" required>
        </div>
        <div class="input-container">
          <label for="email">E-mail</label>
          <input type="email" name="email" autocomplete="off" required>
        </div>
        <div class="input-container">
          <label for="current-password">Senha Atual</label>
          <input type="password" name="current-password" autocomplete="current-password" required>
        </div>
        <div class="input-container">
          <label for="new-password">Nova Senha (opcional)</label>
          <input type="password" name="new-password" autocomplete="new-password">
        </div>
        <div class="input-container">
          <label for="confirm-new-password">Confirmar Nova Senha (opcional)</label>
          <input type="password" name="confirm-new-password" autocomplete="new-password">
        </div>
        <div class="actions-container">
          <button type="submit" data-action="update">Atualizar</button>
          <button type="button" data-action="cancel">Cancelar</button>
        </div>
      </form>
    `;
    document.body.appendChild(el);

    el.querySelector('button[data-action="cancel"]')?.addEventListener('click', removeModal);

    el.querySelector('#update-form')?.addEventListener('submit', handleUpdate);
  });

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (loginForm && loginForm.dataset.action === 'login') {
    loginForm.addEventListener('submit', handleLogin);
  }

  document.getElementById('deleteUserButton')?.addEventListener('click', () => {
    const el = document.createElement('div');
    el.className = 'modal';
    el.innerHTML = `
      <form id="delete-form">
        <div id="message"></div> <!-- Área de Mensagens Dentro do Formulário -->
        <div class="input-container">
          <label for="password">Senha</label>
          <input type="password" name="password" autocomplete="current-password" required>
        </div>
        <div class="actions-container">
          <button type="submit" data-action="delete">Deletar Conta</button>
          <button type="button" data-action="cancel">Cancelar</button>
        </div>
      </form>
    `;
    document.body.appendChild(el);

    el.querySelector('button[data-action="cancel"]')?.addEventListener('click', removeModal);

    el.querySelector('#delete-form')?.addEventListener('submit', handleDeleteAccount);
  });

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html'; 
  }

  document.getElementById('logoutButton')?.addEventListener('click', handleLogout);

  const token = localStorage.getItem('token');

  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    if (token) {
      window.location.href = 'dashboard.html';
    }
  }
  if (window.location.pathname.endsWith('dashboard.html')) {
    if (!token) {
      window.location.href = 'index.html';
    } else {
      fetchUserData();
      listarUsuarios();
    }
  }

  if (window.location.pathname.endsWith('cadastro.html')) {
    if (token) {
      window.location.href = 'dashboard.html';
    }
  }
});
