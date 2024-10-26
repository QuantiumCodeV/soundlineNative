const backendDomain = "http://casintymi.com";

// Функция для сохранения данных в localStorage
const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

// Функция для получения данных из localStorage
const getFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

// Функция для регистрации пользователя
function registerUser(username, password) {
  const response = fetch(`${backendDomain}/soundline/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const result = response.json();
  console.log(response)
  console.log(result)
  if (response.ok) {
    return { success: true };
  } else {
    return { success: false, error: result.error };
  }
}

// Функция для логина пользователя
async function loginUser(username, password) {
  const response = await fetch(`${backendDomain}/backend/api/user/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  if (response.ok) {
    saveToLocalStorage("accessToken", result.access);
    saveToLocalStorage("refreshToken", result.refresh);
    return { success: true };
  } else {
    return { success: false, error: "Login error" };
  }
}

// Функция для получения данных профиля
async function getProfile() {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/profile/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const result = await response.json();
  if (response.ok) {
    return result;
  } else if (response.status === 403) {
    // Делаем лог-аут пользователя
    logout();
    return null;
  } else {
    return null;
  }
}

// Функция для изменения данных профиля
async function updateProfile(data) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (response.ok) {
    return { success: true };
  } else if (response.status === 403) {
    logout();
    return { success: false, error: "Forbidden" };
  } else {
    return { success: false, error: result.error };
  }
}

// Функция для удаления профиля
async function deleteProfile() {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/profile/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const result = await response.json();
  if (response.ok) {
    logout();
    return { success: true };
  } else if (response.status === 403) {
    logout();
    return { success: false, error: "Forbidden" };
  } else {
    return { success: false, error: result.error };
  }
}

// Функция для получения ссылки на загрузку
async function getDownloadLink(conferenceCode) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(
    `${backendDomain}/soundline/retreive/${conferenceCode}/`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const result = await response.json();
  if (response.ok) {
    return { success: true, link: result.link };
  } else if (response.status === 403) {
    logout();
    return { success: false, error: "Forbidden" };
  } else {
    return { success: false, error: result.error };
  }
}

// Функция для получения списка друзей
async function getFriends() {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/friends/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const result = await response.json();
  if (response.ok) {
    return result;
  } else if (response.status === 403) {
    logout();
    return null;
  } else {
    return null;
  }
}

// Функция для добавления друга
async function addFriend(email) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/friends/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ search: email }),
  });

  const result = await response.json();
  if (response.ok) {
    return { success: true };
  } else if (response.status === 403) {
    logout();
    return { success: false, error: "Forbidden" };
  } else {
    return { success: false, error: result.error };
  }
}

// Функция для принятия/отклонения предложения дружбы
async function respondToFriendRequest(id, action) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/friends/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, action }),
  });

  const result = await response.json();
  if (response.ok) {
    return { success: true };
  } else if (response.status === 403) {
    logout();
    return { success: false, error: "Forbidden" };
  } else {
    return { success: false, error: result.error };
  }
}

// Функция для блокировки/разблокировки друга
async function toggleBlockFriend(id) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/friends/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const result = await response.json();
  if (response.ok) {
    return { success: true };
  } else if (response.status === 403) {
    logout();
    return { success: false, error: "Forbidden" };
  } else {
    return { success: false, error: result.error };
  }
}

// Функция для удаления друга
async function deleteFriend(id) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/friends/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const result = await response.json();
  if (response.ok) {
    return { success: true };
  } else if (response.status === 403) {
    logout();
    return { success: false, error: "Forbidden" };
  } else {
    return { success: false, error: result.error };
  }
}

// Функция для получения списка чатов
async function getChats() {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/chat/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const result = await response.json();
  if (response.ok) {
    return result.chats;
  } else if (response.status === 403) {
    logout();
    return null;
  } else {
    return null;
  }
}

// Функция для получения сообщений в чате
async function getChatMessages(userId) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/chat/${userId}/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const result = await response.json();
  if (response.ok) {
    return result.messages;
  } else if (response.status === 403) {
    logout();
    return null;
  } else {
    return null;
  }
}

// Функция для отправки сообщения
async function sendMessage(recipientId, message) {
  const accessToken = getFromLocalStorage("accessToken");
  const response = await fetch(`${backendDomain}/soundline/chat/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipent_id: recipientId, message }),
  });

  const result = await response.json();
  if (response.ok) {
    return { success: true };
  } else if (response.status === 403) {
    logout();
    return { success: false, error: "Forbidden" };
  } else {
    return { success: false, error: result.error };
  }
}
function profilePanel() {
  var profile = getProfile()
  document.getElementById("username_main").textContent = profile.username
  document.getElementById("avatar_main").src = profile.avatar
}
// Функция для выхода из системы
function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
  // Дополнительная логика для выхода из системы
}
