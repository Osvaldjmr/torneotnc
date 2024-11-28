import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "./App.css"; // Archivo de estilos
import AgregarTorneo from "./components/AgregarTorneo"; // Importación del componente
import TablaClasificacion from "./components/TablaClasificacion"; // Tabla de clasificación separada

console.log("Firestore DB:", db); // Prueba de Firestore
console.log("Firestore DB importada:", db);

function App() {
  const [equipos, setEquipos] = useState([]);
  const [nuevoEquipo, setNuevoEquipo] = useState("");
  const [partidos, setPartidos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});

  // Agregar un equipo
  const agregarEquipo = () => {
    if (nuevoEquipo && !equipos.includes(nuevoEquipo)) {
      setEquipos([...equipos, nuevoEquipo]);
      setEstadisticas({
        ...estadisticas,
        [nuevoEquipo]: { puntos: 0, wins: 0, loses: 0 },
      });
      setNuevoEquipo("");
    } else {
      alert("Por favor, introduce un nombre único para el equipo.");
    }
  };

  // Generar partidos en formato "todos contra todos"
  const generarPartidos = () => {
    const nuevosPartidos = [];
    for (let i = 0; i < equipos.length; i++) {
      for (let j = i + 1; j < equipos.length; j++) {
        nuevosPartidos.push({
          local: equipos[i],
          visitante: equipos[j],
          resultado: null,
        });
      }
    }
    setPartidos(nuevosPartidos);
  };

  // Actualizar el resultado de un partido
  const actualizarResultado = (index, resultado) => {
    const nuevosPartidos = [...partidos];
    const partido = nuevosPartidos[index];
    partido.resultado = resultado;

    const local = partido.local;
    const visitante = partido.visitante;

    const nuevasEstadisticas = { ...estadisticas };

    if (resultado === "local") {
      nuevasEstadisticas[local].puntos += 3;
      nuevasEstadisticas[local].wins += 1;
      nuevasEstadisticas[visitante].loses += 1;
    } else if (resultado === "visitante") {
      nuevasEstadisticas[visitante].puntos += 3;
      nuevasEstadisticas[visitante].wins += 1;
      nuevasEstadisticas[local].loses += 1;
    }

    setPartidos(nuevosPartidos);
    setEstadisticas(nuevasEstadisticas);
  };

  // Guardar datos en Firestore
  const guardarEnFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "torneos"), {
        equipos,
        partidos,
        estadisticas,
      });
      alert("Torneo guardado con éxito. ID: " + docRef.id);
    } catch (e) {
      alert("Error al guardar: " + e.message);
    }
  };

  // Ordenar equipos por puntos, luego por victorias, luego por derrotas
  const obtenerClasificacion = () => {
    return Object.entries(estadisticas)
      .map(([equipo, stats]) => ({ equipo, ...stats }))
      .sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos; // Puntos descendente
        if (b.wins !== a.wins) return b.wins - a.wins; // Wins descendente
        return a.loses - b.loses; // Loses ascendente
      });
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Torneo Todos contra Todos</h1>
      </header>
      <main>
        {/* Componente para agregar torneos */}
        <AgregarTorneo />

        {/* Sección para agregar equipos */}
        <section className="section">
          <h2>Agregar Equipos</h2>
          <div className="input-group">
            <input
              type="text"
              value={nuevoEquipo}
              onChange={(e) => setNuevoEquipo(e.target.value)}
              placeholder="Nombre del equipo"
            />
            <button onClick={agregarEquipo}>Agregar</button>
          </div>
          <ul className="equipos-list">
            {equipos.map((equipo) => (
              <li key={equipo}>{equipo}</li>
            ))}
          </ul>
        </section>

        {/* Sección para generar y mostrar partidos */}
        <section className="section">
          <h2>Partidos</h2>
          <button onClick={generarPartidos}>Generar Partidos</button>
          <table className="partidos-table">
            <thead>
              <tr>
                <th>Local</th>
                <th>Visitante</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {partidos.map((partido, index) => (
                <tr key={index}>
                  <td>{partido.local}</td>
                  <td>{partido.visitante}</td>
                  <td>
                    <button onClick={() => actualizarResultado(index, "local")}>
                      Gana Local
                    </button>
                    <button
                      onClick={() => actualizarResultado(index, "visitante")}
                    >
                      Gana Visitante
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Tabla de clasificación */}
        <TablaClasificacion clasificacion={obtenerClasificacion()} />

        {/* Botón para guardar en Firestore */}
        <button onClick={guardarEnFirestore} className="guardar-btn">
          Guardar Torneo
        </button>
      </main>
    </div>
  );
}

export default App;
