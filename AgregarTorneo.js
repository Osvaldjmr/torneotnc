import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Importa la configuración de Firebase
import "./AgregarTorneo.css"; // Puedes agregar estilos específicos si deseas

console.log("Firestore DB importada en AgregarTorneo:", db);



function AgregarTorneo() {
    const [nombreTorneo, setNombreTorneo] = useState("");
    const [fechaTorneo, setFechaTorneo] = useState("");
    const [mensaje, setMensaje] = useState("");

    const agregarTorneo = async () => {
        // Validar que los campos no estén vacíos
        if (!nombreTorneo || !fechaTorneo) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            // Agregar un nuevo documento a la colección "torneos" en Firestore
            const docRef = await addDoc(collection(db, "torneos"), {
                nombre: nombreTorneo,
                fecha: fechaTorneo,
                equipos: [], // Lista vacía de equipos por defecto
                estado: "activo", // Estado inicial del torneo
            });

            setMensaje(`Torneo creado con éxito. ID: ${docRef.id}`);
            // Limpia los campos después de agregar
            setNombreTorneo("");
            setFechaTorneo("");
        } catch (error) {
            console.error("Error al agregar el torneo: ", error);
            setMensaje("Hubo un error al agregar el torneo.");
        }
    };

    return (
        <div className="agregar-torneo">
            <h2>Crear Torneo</h2>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Nombre del Torneo"
                    value={nombreTorneo}
                    onChange={(e) => setNombreTorneo(e.target.value)}
                    className="input-field"
                />
                <input
                    type="date"
                    value={fechaTorneo}
                    onChange={(e) => setFechaTorneo(e.target.value)}
                    className="input-field"
                />
                <button onClick={agregarTorneo} className="submit-button">
                    Agregar Torneo
                </button>
            </div>
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
}

export default AgregarTorneo;
