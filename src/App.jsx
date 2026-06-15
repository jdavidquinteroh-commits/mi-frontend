import { useState, useEffect } from "react"

function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoria, setCategoria] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    cargarProductos()
  }, [])

  function cargarProductos() {
    fetch("http://127.0.0.1:8000/productos")
      .then(res => res.json())
      .then(data => {
        setProductos(data.productos)
        setCargando(false)
      })
  }

  function login() {
    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          setToken(data.access_token)
          setMensaje("✓ Sesión iniciada")
        } else {
          setMensaje("Usuario o contraseña incorrectos")
        }
      })
  }

  function cerrarSesion() {
    setToken(null)
    setMensaje("")
    setUsername("")
    setPassword("")
  }

  function guardarProducto() {
    if (!nombre || !precio) {
      setMensaje("Completa el nombre y precio")
      return
    }

    const url = editandoId
      ? `http://127.0.0.1:8000/productos/${editandoId}`
      : "http://127.0.0.1:8000/productos"

    const method = editandoId ? "PUT" : "POST"

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: nombre,
        precio: parseInt(precio),
        categoria: categoria
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.producto) {
          setMensaje(editandoId ? "✓ Producto actualizado" : "✓ Producto creado")
          setNombre("")
          setPrecio("")
          setCategoria("")
          setEditandoId(null)
          cargarProductos()
        }
      })
  }

  function eliminarProducto(id) {
    fetch(`http://127.0.0.1:8000/productos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => {
        setMensaje("✓ Producto eliminado")
        cargarProductos()
      })
  }

  function seleccionarEditar(producto) {
    setNombre(producto.nombre)
    setPrecio(producto.precio)
    setCategoria(producto.categoria || "")
    setEditandoId(producto.id)
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ color: "#FF6B00", textAlign: "center" }}>🔥 Barril And Grill</h1>
      <p style={{ textAlign: "center", color: "#666" }}>Marinados · Ahumados · Calidad</p>

      {!token ? (
        <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
          <h2>Iniciar sesión</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <input
              placeholder="Usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #FF6B00" }}
            />
            <input
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #FF6B00" }}
            />
            <button
              onClick={login}
              style={{
                padding: "0.5rem",
                backgroundColor: "#FF6B00",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Entrar
            </button>
            {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "#FF6B00" }}>✓ Sesión activa</p>
            <button
              onClick={cerrarSesion}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#666",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Cerrar sesión
            </button>
          </div>

          <h2>{editandoId ? "✏️ Editar producto" : "Agregar producto"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              placeholder="Nombre del producto"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #FF6B00" }}
            />
            <input
              placeholder="Precio"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              type="number"
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #FF6B00" }}
            />
            <input
              placeholder="Categoría"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #FF6B00" }}
            />
            <button
              onClick={guardarProducto}
              style={{
                padding: "0.5rem",
                backgroundColor: "#FF6B00",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {editandoId ? "Actualizar producto" : "Crear producto"}
            </button>
            {editandoId && (
              <button
                onClick={() => { setEditandoId(null); setNombre(""); setPrecio(""); setCategoria("") }}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#666",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Cancelar edición
              </button>
            )}
            {mensaje && <p style={{ color: "#FF6B00" }}>{mensaje}</p>}
          </div>

          <h2>Productos</h2>
          {cargando ? (
            <p>Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p>No hay productos disponibles</p>
          ) : (
            productos.map((producto) => (
              <div key={producto.id} style={{
                border: "1px solid #FF6B00",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem"
              }}>
                <h3 style={{ color: "#FF6B00" }}>{producto.nombre}</h3>
                <p>Categoría: {producto.categoria}</p>
                <p><strong>${producto.precio.toLocaleString()}</strong></p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      backgroundColor: "#cc0000",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                  <button
                    onClick={() => seleccionarEditar(producto)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      backgroundColor: "#333",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    ✏️ Editar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App