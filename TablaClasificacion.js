import React from "react";

function TablaClasificacion({ clasificacion }) {
    return (
        <section className="section">
            <h2>Clasificación</h2>
            <table className="partidos-table">
                <thead>
                    <tr>
                        <th>Equipo</th>
                        <th>Puntos</th>
                        <th>Ganados</th>
                        <th>Perdidos</th>
                    </tr>
                </thead>
                <tbody>
                    {clasificacion.map((equipo) => (
                        <tr key={equipo.equipo}>
                            <td>{equipo.equipo}</td>
                            <td>{equipo.puntos}</td>
                            <td>{equipo.wins}</td>
                            <td>{equipo.loses}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default TablaClasificacion;
