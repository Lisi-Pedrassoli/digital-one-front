import React, { useState, useEffect } from "react";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

const API_URL = "http://127.0.0.1:5000";

export default function App() {
  const [user, setUser] = useState(null);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const [editingPostId, setEditingPostId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const register = async () => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail, password: regPassword, name: regName }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  const login = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
    } else {
      alert(data.error);
    }
  };

  const loadPosts = async () => {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    setPosts(data);
  };

  const createPost = async () => {
    if (!user) return alert("Você precisa estar logado!");
    await fetch(`${API_URL}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, description: newPost }),
    });
    setNewPost("");
    loadPosts();
  };

  const deletePost = async (id) => {
    await fetch(`${API_URL}/post/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });
    loadPosts();
  };

  const saveEdit = async (id) => {
  try {
    const response = await fetch(`${API_URL}/post/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, description: editingText }),
    });
    
    if (response.ok) {
      setPosts(posts.map(post => 
        post.id === id ? { ...post, description: editingText } : post
      ));
      
      setEditingPostId(null);
      setEditingText("");
      
      setTimeout(() => {
        loadPosts();
      }, 100);
    }
  } catch (error) {
    console.error("Erro ao editar post:", error);
    alert("Erro ao editar post");
  }
};

  useEffect(() => {
    if (user) loadPosts();
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      {!user ? (
        <div>
          <h2>Registro</h2>
          <input placeholder="Nome" value={regName} onChange={(e) => setRegName(e.target.value)} />
          <input placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
          <input type="password" placeholder="Senha" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
          <button onClick={register}>Registrar</button>

          <h2>Login</h2>
          <input placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          <input type="password" placeholder="Senha" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Bem-vindo, {user.name || user.email}</h2>

          <h3>Criar Post</h3>
          <input value={newPost} onChange={(e) => setNewPost(e.target.value)} />
          <button onClick={createPost}>Publicar</button>

          <h3>Feed</h3>
          {posts.map((p) => (
            <div key={p.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              {editingPostId === p.id ? (
                <div>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(p.id)}>Salvar</button>
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
                  <button onClick={() => deletePost(p.id)}>Excluir</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}