import { useState, useEffect } from "react"

function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/productos")
      .then(res => res.json())
      .then(data => {
        setProductos(data.productos)
        setCargando(false)
      })
  }, [])

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ color: "#FF6B00", textAlign: "center" }}>🔥 Barril And Grill</h1>
      <p style={{ textAlign: "center", color: "#666" }}>Marinados · Ahumados · Calidad</p>

      <h2>Nuestros productos</h2>

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
          </div>
        ))
      )}
    </div>
  )
}

export default App