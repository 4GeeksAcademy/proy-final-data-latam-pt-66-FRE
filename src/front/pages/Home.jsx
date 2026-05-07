import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import erikaImg from "../assets/erikaImg.jpg";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    const slides = [
        {
            url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000",
            title: "¡Tu bienestar, nuestra meta!",
            text: "Vive sano, come bien. La nutrición es la base de tu energía."
        },
        {
            url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000",
            title: "Hidratarse es el primer paso",
            text: "Mantén tu cuerpo en movimiento y tu mente clara. #AguaEsVida"
        },
        {
            url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000",
            title: "Energía Natural",
            text: "Pequeños cambios hoy generan grandes resultados mañana."
        }
    ];

    // const loadMessage = async () => {
    //     try {
    //         const backendUrl = import.meta.env.VITE_BACKEND_URL;
    //         if (!backendUrl) return;
    //         const response = await fetch(`${backendUrl}/api/hello`);
    //         const data = await response.json();
    //         if (response.ok) dispatch({ type: "set_hello", payload: data.message });
    //     } catch (error) {
    //         console.log("Error loading message from backend");
    //     }
    // };

    useEffect(() => {

        // Inicialización manual para asegurar el movimiento cada 4 segundos
        const carouselElement = document.querySelector('#healthCarousel');
        if (carouselElement && window.bootstrap) {
            new window.bootstrap.Carousel(carouselElement, {
                interval: 4000,
                ride: 'carousel',
                pause: false // Para que no se detenga si el mouse está encima
            });
        }
    }, []);

    return (
        <div className="home-container animate__animated animate__fadeIn">
            {/* HERO SECTION */}
            <section className="hero-section py-5" style={{ background: "#198754", color: "white", minHeight: "65vh", display: "flex", alignItems: "center" }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-5 text-start">
                            <h1 className="display-2 fw-bold mb-3">NutriFit</h1>
                            <p className="fs-3 mb-5 opacity-90">
                                Tu control total de <strong>consumo de calorías</strong>, <strong>ayuno</strong>, <strong>hidratación</strong> y <strong>nutrición</strong> en una sola plataforma.
                            </p>
                            <Link to="/signup" className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow" style={{ color: "#198754" }}>
                                REGÍSTRATE GRATIS <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>

                        {/* CARRUSEL DINÁMICO MEJORADO */}
                        <div className="col-md-7 d-none d-md-block">
                            <div id="healthCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                                {/* Indicadores (Puntitos) para forzar el estado dinámico */}
                                <div className="carousel-indicators">
                                    {slides.map((_, i) => (
                                        <button key={i} type="button" data-bs-target="#healthCarousel" data-bs-slide-to={i} className={i === 0 ? "active" : ""}></button>
                                    ))}
                                </div>

                                <div className="carousel-inner shadow-lg rounded-4 overflow-hidden" style={{ border: "5px solid rgba(255,255,255,0.2)" }}>
                                    {slides.map((slide, index) => (
                                        <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index} data-bs-interval="4000">
                                            <img src={slide.url} className="d-block w-100" alt="Salud" style={{ height: "400px", objectFit: "cover" }} />
                                            <div className="carousel-caption" style={{
                                                background: "rgba(255, 255, 255, 0.95)",
                                                color: "#333",
                                                borderRadius: "20px",
                                                padding: "15px",
                                                bottom: "40px",
                                                left: "10%",
                                                right: "10%",
                                                borderLeft: "5px solid #198754"
                                            }}>
                                                <h5 className="fw-bold mb-1">{slide.title}</h5>
                                                <p className="small mb-0">{slide.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN DE CARACTERÍSTICAS */}
            <section className="features-section py-5 bg-light" style={{ marginTop: "-50px" }}>
                <div className="container text-center">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 rounded-4">
                                <div className="mb-3 text-success fs-1"><i className="fas fa-clock"></i></div>
                                <h4 className="fw-bold">Ayuno Dinámico</h4>
                                <p className="text-muted small">Gestiona tus tiempos y visualiza tu progreso metabólico con nuestro temporizador.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 rounded-4">
                                <div className="mb-3 text-success fs-1"><i className="fas fa-droplet"></i></div>
                                <h4 className="fw-bold">Hidratación Pro</h4>
                                <p className="text-muted small">Calculamos tu meta según la OMS y tu peso corporal. Botella visual interactiva.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 rounded-4">
                                <div className="mb-3 text-success fs-1"><i className="fas fa-utensils"></i></div>
                                <h4 className="fw-bold">Menú Inteligente</h4>
                                <p className="text-muted small">Organiza tu semana con nuestro algoritmo de mezcla inteligente de recetas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="py-5 bg-white">
                <div className="container">

                    {/* TITLE */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-success">
                            Creadores de NutriFit
                        </h2>

                        <p className="text-muted">
                            El equipo detrás de la experiencia NutriFit
                        </p>
                    </div>

                    <div className="row g-4 justify-content-center">

                        {/* PERSONA 1 */}
                        <div className="col-md-4">
                            <div className="card border-0 shadow-lg rounded-4 text-center p-4 h-100">

                                <img
                                    src={erikaImg}
                                    alt="Integrante"
                                    className="rounded-circle mx-auto mb-3 shadow"
                                    style={{
                                        width: "130px",
                                        height: "130px",
                                        objectFit: "cover",
                                        border: "5px solid #198754"
                                    }}
                                />

                                <h4 className="fw-bold mb-1">
                                    Erika Portes
                                </h4>

                                <span className="badge bg-success mb-3">
                                    Full Stack Developer con IA
                                </span>

                                <p className="text-muted small">
                                    Con conocimiento en Diseño UX/UI y Marketing Digital ahora integrando Full Stack con IA con la finalidad de ser freelance independiente y ofrecer un servicio integral.
                                </p>

                            </div>
                        </div>

                        {/* PERSONA 2 */}
                        <div className="col-md-4">
                            <div className="card border-0 shadow-lg rounded-4 text-center p-4 h-100">

                                <img
                                    src=""
                                    alt="Integrante"
                                    className="rounded-circle mx-auto mb-3 shadow"
                                    style={{
                                        width: "130px",
                                        height: "130px",
                                        objectFit: "cover",
                                        border: "5px solid #198754"
                                    }}
                                />

                                <h4 className="fw-bold mb-1">
                                    Raymon Burgos
                                </h4>

                                <span className="badge bg-success mb-3">
                                    Full Stack Developer con IA
                                </span>

                                <p className="text-muted small">
                                    Encargado de APIs, autenticación JWT, base de datos y arquitectura del sistema.
                                </p>

                            </div>
                        </div>

                        {/* PERSONA 3 */}
                        <div className="col-md-4">
                            <div className="card border-0 shadow-lg rounded-4 text-center p-4 h-100">

                                <img
                                    src=""
                                    alt="Integrante"
                                    className="rounded-circle mx-auto mb-3 shadow"
                                    style={{
                                        width: "130px",
                                        height: "130px",
                                        objectFit: "cover",
                                        border: "5px solid #198754"
                                    }}
                                />

                                <h4 className="fw-bold mb-1">
                                    Frank Padilla
                                </h4>

                                <span className="badge bg-success mb-3">
                                    Full Stack Developer con IA
                                </span>

                                <p className="text-muted small">
                                    Responsable de recomendaciones inteligentes, nutrición personalizada y experiencia fitness.
                                </p>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* MISIÓN SECTION */}
            <section
                className="py-5 position-relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #198754 0%, #0f5132 100%)"
                }}
            >

                {/* EFECTOS DE FONDO */}
                <div
                    style={{
                        position: "absolute",
                        top: "-100px",
                        right: "-100px",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        filter: "blur(20px)"
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        bottom: "-120px",
                        left: "-80px",
                        width: "250px",
                        height: "250px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)",
                        filter: "blur(20px)"
                    }}
                />

                <div className="container position-relative">

                    {/* HEADER */}
                    <div className="text-center mb-5">

                        <span className="badge bg-light text-success px-4 py-2 mb-3 rounded-pill fw-semibold">
                            FUTURO DE NUTRIFIT
                        </span>

                        <h2 className="display-5 fw-bold text-white">
                            Nuestra misión
                        </h2>

                        <p
                            className="mx-auto text-white opacity-75 mt-3"
                            style={{
                                maxWidth: "750px",
                                fontSize: "1.1rem"
                            }}
                        >
                            Estamos construyendo una plataforma fitness inteligente
                            enfocada en transformar la nutrición personalizada mediante
                            inteligencia artificial, automatización y bienestar digital.
                        </p>

                    </div>

                    {/* CARDS */}
                    <div className="row g-4">

                        {/* CARD 1 */}
                        <div className="col-md-4">

                            <div
                                className="card border-0 shadow-lg rounded-4 p-4 h-100 text-center"
                                style={{
                                    backdropFilter: "blur(10px)",
                                    transition: "0.3s ease"
                                }}
                            >

                                <div
                                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        borderRadius: "50%",
                                        background: "rgba(25,135,84,0.12)"
                                    }}
                                >
                                    <i className="fas fa-brain text-success fs-1"></i>
                                </div>

                                <h4 className="fw-bold text-success mb-3">
                                    Inteligencia Artificial
                                </h4>

                                <p className="text-muted mb-0">
                                    NutriFit evolucionará constantemente utilizando IA
                                    para generar recomendaciones nutricionales más precisas,
                                    inteligentes y totalmente personalizadas.
                                </p>

                            </div>

                        </div>

                        {/* CARD 2 */}
                        <div className="col-md-4">

                            <div
                                className="card border-0 shadow-lg rounded-4 p-4 h-100 text-center"
                                style={{
                                    backdropFilter: "blur(10px)",
                                    transition: "0.3s ease"
                                }}
                            >

                                <div
                                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        borderRadius: "50%",
                                        background: "rgba(25,135,84,0.12)"
                                    }}
                                >
                                    <i className="fas fa-qrcode text-success fs-1"></i>
                                </div>

                                <h4 className="fw-bold text-success mb-3">
                                    Escaneo con QR
                                </h4>

                                <p className="text-muted mb-0">
                                    Queremos simplificar el registro de alimentos mediante
                                    escaneo QR para obtener automáticamente calorías,
                                    ingredientes y macronutrientes.
                                </p>

                            </div>

                        </div>

                        {/* CARD 3 */}
                        <div className="col-md-4">

                            <div
                                className="card border-0 shadow-lg rounded-4 p-4 h-100 text-center"
                                style={{
                                    backdropFilter: "blur(10px)",
                                    transition: "0.3s ease"
                                }}
                            >

                                <div
                                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        borderRadius: "50%",
                                        background: "rgba(25,135,84,0.12)"
                                    }}
                                >
                                    <i className="fas fa-leaf text-success fs-1"></i>
                                </div>

                                <h4 className="fw-bold text-success mb-3">
                                    API Nutricional Real
                                </h4>

                                <p className="text-muted mb-0">
                                    Integraremos APIs nutricionales avanzadas para ofrecer
                                    datos reales, análisis detallados y recomendaciones
                                    profesionales en tiempo real.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* FOOTER INFO */}
                    <div className="text-center mt-5">

                        <div
                            className="d-inline-flex align-items-center gap-3 px-4 py-3 rounded-pill shadow"
                            style={{
                                background: "rgba(255,255,255,0.12)",
                                backdropFilter: "blur(10px)"
                            }}
                        >

                            <span className="text-white fw-semibold">
                                NutriFit seguirá creciendo como una plataforma líder en bienestar digital
                            </span>

                        </div>

                    </div>

                </div>
            </section>

            {/* TECNOLOGÍAS SECTION */}
            <section className="py-5 bg-light position-relative overflow-hidden">

                <div className="container">

                    {/* HEADER */}
                    <div className="text-center mb-5">

                        <h2 className="display-5 fw-bold text-success">
                            Tecnologías utilizadas
                        </h2>

                        <p
                            className="text-muted mx-auto"
                            style={{ maxWidth: "700px" }}
                        >
                            NutriFit fue desarrollada utilizando tecnologías modernas
                            Full Stack enfocadas en rendimiento, escalabilidad y
                            experiencia de usuario.
                        </p>

                    </div>

                    {/* GRID */}
                    <div className="row g-12">

                        {/* FRONTEND */}
                        <div className="col-md-6">

                            <div className="card border-0 shadow-lg rounded-4 p-4 h-100 text-center">

                                <div
                                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        borderRadius: "50%",
                                        background: "rgba(13,110,253,0.1)"
                                    }}
                                >
                                    <i className="fab fa-react text-primary fs-1"></i>
                                </div>

                                <h4 className="fw-bold mb-3">
                                    Frontend
                                </h4>

                                <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">

                                    <span className="badge bg-primary px-3 py-2">
                                        React
                                    </span>

                                    <span className="badge bg-success px-3 py-2">
                                        Bootstrap
                                    </span>

                                    <span className="badge bg-dark px-3 py-2">
                                        JavaScript
                                    </span>

                                    <span className="badge bg-warning text-dark px-3 py-2">
                                        Vite
                                    </span>

                                </div>

                                <p className="text-muted mb-0">
                                    Interfaces dinámicas, SPA moderna y experiencia
                                    responsive enfocada en un diseño intuitivo.
                                </p>

                            </div>

                        </div>

                        {/* BACKEND */}
                        <div className="col-md-6">

                            <div className="card border-0 shadow-lg rounded-4 p-4 h-100 text-center">

                                <div
                                    className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        borderRadius: "50%",
                                        background: "rgba(25,135,84,0.1)"
                                    }}
                                >
                                    <i className="fas fa-server text-success fs-1"></i>
                                </div>

                                <h4 className="fw-bold mb-3">
                                    Backend
                                </h4>

                                <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">

                                    <span className="badge bg-success px-3 py-2">
                                        Python
                                    </span>

                                    <span className="badge bg-dark px-3 py-2">
                                        Flask
                                    </span>

                                    <span className="badge bg-secondary px-3 py-2">
                                        SQLAlchemy
                                    </span>

                                    <span className="badge bg-danger px-3 py-2">
                                        JWT
                                    </span>

                                </div>

                                <p className="text-muted mb-0">
                                    Autenticación avanzada y manejo
                                    eficiente de datos nutricionales.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* FOOTER TOTALMENTE LIMPIO */}
            <footer className="py-5 text-center">

            </footer>
        </div>
    );
};