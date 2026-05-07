import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

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

    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) return;
            const response = await fetch(`${backendUrl}/api/hello`);
            const data = await response.json();
            if (response.ok) dispatch({ type: "set_hello", payload: data.message });
        } catch (error) {
            console.log("Error loading message from backend");
        }
    };

    useEffect(() => {
        loadMessage();
        
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
                                Tu control total de <strong>Ayuno</strong>, <strong>Hidratación</strong> y <strong>Nutrición</strong> en una sola plataforma.
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

            {/* FOOTER TOTALMENTE LIMPIO */}
            <footer className="py-5 text-center">
              
            </footer>
        </div>
    );
};