import React, { useState, useEffect } from "react";



export const FastingPage = () => {

    const [fasting, setFasting] = useState(null);

    const [lastDuration, setLastDuration] = useState(null);

    const token = sessionStorage.getItem("token");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;



    const fetchStatus = async () => {

        try {

            const res = await fetch(`${backendUrl}/api/fasting/status`, {

                headers: { "Authorization": `Bearer ${token}` }

            });

            if (res.ok) {

                const data = await res.json();

                setFasting(data);

            }

        } catch (error) {

            console.error("Error al obtener status:", error);

        }

    };



    useEffect(() => {

        if (token) fetchStatus();

    }, []);



    const handleFastingAction = async (action) => {

        try {

            const res = await fetch(`${backendUrl}/api/fasting/${action}`, {

                method: action === 'start' ? "POST" : "PUT",

                headers: {

                    "Authorization": `Bearer ${token}`,

                    "Content-Type": "application/json"

                }

            });



            const data = await res.json();



            if (res.ok) {

                if (action === 'stop') {

                    setLastDuration(data.duration); // Aquí guardamos el formato Oh Om Os

                } else {

                    setLastDuration(null);

                }

                await fetchStatus();

            } else {

                console.log("Error en la terminal:", data.msg);

            }

        } catch (error) {

            console.error("Error de red:", error);

        }

    };



    return (

        <div className="container mt-5 text-center">

            <div className="card shadow border-0 p-5 mx-auto" style={{ maxWidth: "500px", borderRadius: "25px" }}>

                <h2 className="fw-bold mb-4">Control de Ayuno</h2>

               

                <div className="mb-4">

                    <i className={`fas fa-stopwatch fa-5x ${fasting ? 'text-success' : 'text-muted'}`}></i>

                </div>



                {fasting ? (

                    <div>

                        <h4 className="text-success fw-bold">Ayuno en curso</h4>

                        <div className="alert alert-light border-0 py-2 mb-4">

                            <p className="mb-0 text-muted small">Iniciado el:</p>

                            <h6 className="fw-bold">{new Date(fasting.start_time).toLocaleString()}</h6>

                        </div>

                        <button

                            className="btn btn-danger btn-lg w-100 rounded-pill shadow-sm"

                            onClick={() => handleFastingAction('stop')}

                        >

                            DETENER AYUNO

                        </button>

                    </div>

                ) : (

                    <div>

                        {lastDuration && (

                            <div className="alert alert-success border-0 rounded-pill mb-4 d-flex align-items-center justify-content-center shadow-sm py-2">

                                <i className="fas fa-trophy me-2"></i>

                                <span>¡Completado! Duración: <strong>{lastDuration}</strong></span>

                            </div>

                        )}

                        <p className="text-muted mb-4 small">¿Preparado para tu próxima meta?</p>

                        <button

                            className="btn btn-success btn-lg w-100 rounded-pill shadow-sm"

                            onClick={() => handleFastingAction('start')}

                        >

                            INICIAR AYUNO

                        </button>

                    </div>

                )}

            </div>

        </div>

    );

};