const mainForm = document.querySelector('form');

document.addEventListener('submit', async (event) => {
  event.preventDefault();
  const action = event.submitter.dataset.action ?? null;
  const currentForm = event.target;

  // login feito
  if (action === 'login') {
    const method = 'POST';
    const url = '/user';
    const headers = { 'Content-Type': 'application/json' };
    const name = currentForm.name.value;
    const password = currentForm.password.value;
    const body = JSON.stringify({ name, password });

    const response = await fetch(url, { method, headers, body });
    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401 && responseData.error === 'Usuário ou senha inválidos') {
        alert('Nome ou senha inválidos.');
      } else {
        alert('Erro inesperado. Tente novamente.');
      }
    } else {
      localStorage.setItem('token', responseData.token);
      window.location.href = 'dashboard.html';
    }
  }
  //deletar o coitado do user
  if (action === 'update') {
    if (!token) {
      alert('Token do usuário não está definido.');
      return;
    }

    const method = 'PUT';
    const url = `/users/${token}`;
    const headers = { 'Content-Type': 'application/json' };
    const name = currentForm.name.value;
    const email = currentForm.email.value;
    const password = currentForm.password.value; // Incluindo a senha na atualização
    const body = JSON.stringify({ name, email, password });

    const response = await fetch(url, { method, headers, body });

    if (!response.ok) {
      console.error('Erro:', response.statusText);
      return;
    }

    const responseData = await response.json();
    currentForm.name.value = responseData.name;
    currentForm.email.value = responseData.email;
    return;
  }
  // cadastro completo
  if (action === 'create') {
    const method = 'POST';
    const url = '/users';
    const headers = { 'Content-Type': 'application/json' };

    const name = currentForm.name.value;
    const email = currentForm.email.value;
    const password = currentForm.password.value;
    
    if(name === '' || email === '' || password === ''){
      alert('faltou preencher algo')
      return
    }

    const body = JSON.stringify({ name, email, password });

    const response = await fetch(url, { method, headers, body });
    const responseData = await response.json();

    if (!response.ok) {
      if (responseData.error === 'Email already exists') {
        alert('O e-mail já está registrado.');
      } else {
        console.error('Erro:', response.statusText);
        alert('Ocorreu um erro inesperado. Tente novamente.');
      }
    } else {
      mainForm.reset();
      window.location.href = 'index.html';
      return;
    }
  }
});
