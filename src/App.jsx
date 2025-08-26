import React, { useState, useEffect } from "react";
import './App.css';

const API_URL = "http://127.0.0.1:5000";

// Componente para Login/Registro
const AuthPage = ({ onLogin, onRegister, onRecover }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [recoverEmail, setRecoverEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = () => {
    if (!validateEmail(loginEmail)) {
      alert("Por favor, insira um email válido");
      return;
    }
    if (!validatePassword(loginPassword)) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    onLogin(loginEmail, loginPassword);
  };

  const handleRegister = () => {
    if (!regName.trim()) {
      alert("Por favor, insira seu nome");
      return;
    }
    if (!validateEmail(regEmail)) {
      alert("Por favor, insira um email válido");
      return;
    }
    if (!validatePassword(regPassword)) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    onRegister(regName, regEmail, regPassword);
  };

  const handleRecover = () => {
    if (!validateEmail(recoverEmail)) {
      alert("Por favor, insira um email válido");
      return;
    }
    if (!validatePassword(newPassword)) {
      alert("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    onRecover(recoverEmail, newPassword);
  };

  if (isRecovering) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Recuperar Senha</h2>
        <input 
          placeholder="Email" 
          value={recoverEmail} 
          onChange={(e) => setRecoverEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Nova Senha" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <button onClick={handleRecover}>Recuperar Senha</button>
        <button onClick={() => setIsRecovering(false)}>Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{isLogin ? "Login" : "Registro"}</h2>
      
      {!isLogin && (
        <input 
          placeholder="Nome" 
          value={regName} 
          onChange={(e) => setRegName(e.target.value)} 
        />
      )}
      
      <input 
        placeholder="Email" 
        value={isLogin ? loginEmail : regEmail} 
        onChange={(e) => isLogin ? setLoginEmail(e.target.value) : setRegEmail(e.target.value)} 
      />
      
      <input 
        type="password" 
        placeholder="Senha" 
        value={isLogin ? loginPassword : regPassword} 
        onChange={(e) => isLogin ? setLoginPassword(e.target.value) : setRegPassword(e.target.value)} 
      />
      
      {isLogin ? (
        <>
          <button onClick={handleLogin}>Login</button>
          <button onClick={() => setIsLogin(false)}>Criar Conta</button>
          <button onClick={() => setIsRecovering(true)}>Esqueci minha senha</button>
        </>
      ) : (
        <>
          <button onClick={handleRegister}>Registrar</button>
          <button onClick={() => setIsLogin(true)}>Já tenho conta</button>
        </>
      )}
    </div>
  );
};

// Componente para o Perfil do Usuário
const ProfilePage = ({ user, onUpdate, onLogout }) => {
  const [newName, setNewName] = useState(user.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      alert("O nome não pode estar vazio");
      return;
    }
    await onUpdate('name', { new_name: newName });
    alert("Nome atualizado com sucesso!");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Por favor, preencha todos os campos de senha");
      return;
    }
    if (newPassword.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    await onUpdate('password', { 
      current_password: currentPassword, 
      new_password: newPassword 
    });
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Meu Perfil</h2>
      <button onClick={onLogout} style={{ marginBottom: "20px" }}>Logout</button>
      
      <div style={{ marginBottom: "20px" }}>
        <h3>Alterar Nome</h3>
        <input 
          placeholder="Novo nome" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
        />
        <button onClick={handleUpdateName}>Atualizar Nome</button>
      </div>

      <div>
        <h3>Alterar Senha</h3>
        <input 
          type="password" 
          placeholder="Senha atual" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Nova senha" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <button onClick={handleUpdatePassword}>Atualizar Senha</button>
      </div>
    </div>
  );
};

// Componente para o Feed
const FeedPage = ({ user, posts, onCreatePost, onEditPost, onDeletePost, onNavigateToProfile }) => {
  const [newPost, setNewPost] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      alert("O post não pode estar vazio");
      return;
    }
    await onCreatePost(newPost);
    setNewPost("");
  };

  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) {
      alert("O post não pode estar vazio");
      return;
    }
    await onEditPost(id, editingText);
    setEditingPostId(null);
    setEditingText("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Bem-vindo, {user.name || user.email}</h2>
        <button onClick={onNavigateToProfile}>Meu Perfil</button>
      </div>

      <h3>Criar Post</h3>
      <input 
        value={newPost} 
        onChange={(e) => setNewPost(e.target.value)} 
        placeholder="O que você está pensando?"
      />
      <button onClick={handleCreatePost}>Publicar</button>

      <h3>Feed</h3>
      {posts.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          {editingPostId === p.id ? (
            <div>
              <input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
              <button onClick={() => handleSaveEdit(p.id)}>Salvar</button>
              <button onClick={() => setEditingPostId(null)}>Cancelar</button>
            </div>
          ) : (
            <p>
              <b>{p.name}:</b> {p.description}
            </p>
          )}
          {p.user_id === user.id && editingPostId !== p.id && (
            <div>
              <button
                onClick={() => {
                  setEditingPostId(p.id);
                  setEditingText(p.description);
                }}
              >
                Editar
              </button>
              <button onClick={() => onDeletePost(p.id)}>Excluir</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Componente Principal
export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('auth'); // 'auth', 'feed', 'profile'
  const [posts, setPosts] = useState([]);

  // Função para carregar posts
  const loadPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    }
  };

  // Função de login
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setCurrentPage('feed');
        loadPosts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao fazer login");
    }
  };

  // Função de registro
  const handleRegister = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      alert(data.message || data.error);
      if (res.ok) {
        // Auto-login após registro
        handleLogin(email, password);
      }
    } catch (error) {
      alert("Erro ao registrar");
    }
  };

  // Função de recuperação de senha
  const handleRecover = async (email, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
      const data = await res.json();
      alert(data.message || data.error);
      if (res.ok) {
        setCurrentPage('auth');
      }
    } catch (error) {
      alert("Erro ao recuperar senha");
    }
  };

  // Função para criar post
  const handleCreatePost = async (description) => {
    try {
      await fetch(`${API_URL}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, description }),
      });
      loadPosts();
    } catch (error) {
      alert("Erro ao criar post");
    }
  };

  // Função para editar post
  const handleEditPost = async (id, description) => {
    try {
      await fetch(`${API_URL}/post/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, description }),
      });
      loadPosts();
    } catch (error) {
      alert("Erro ao editar post");
    }
  };

  // Função para deletar post
  const handleDeletePost = async (id) => {
    try {
      await fetch(`${API_URL}/post/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      loadPosts();
    } catch (error) {
      alert("Erro ao deletar post");
    }
  };

  // Função para atualizar perfil
  const handleUpdateProfile = async (type, data) => {
    try {
      const endpoint = type === 'name' ? '/update_name' : '/update_password';
      const body = type === 'name' 
        ? { user_id: user.id, new_name: data.new_name }
        : { user_id: user.id, new_password: data.new_password };
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const result = await res.json();
      if (res.ok) {
        // Atualiza o usuário localmente
        if (type === 'name') {
          setUser({ ...user, name: data.new_name });
        }
        return true;
      } else {
        alert(result.error);
        return false;
      }
    } catch (error) {
      alert("Erro ao atualizar perfil");
      return false;
    }
  };

  // Função de logout
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('auth');
    setPosts([]);
  };

  // Renderização condicional baseada na página atual
  return (
    <div>
      {currentPage === 'auth' && (
        <AuthPage 
          onLogin={handleLogin}
          onRegister={handleRegister}
          onRecover={handleRecover}
        />
      )}
      
      {currentPage === 'feed' && user && (
        <FeedPage
          user={user}
          posts={posts}
          onCreatePost={handleCreatePost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          onNavigateToProfile={() => setCurrentPage('profile')}
        />
      )}
      
      {currentPage === 'profile' && user && (
        <ProfilePage
          user={user}
          onUpdate={handleUpdateProfile}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}