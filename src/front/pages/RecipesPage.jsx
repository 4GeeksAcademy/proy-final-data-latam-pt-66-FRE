import React, { useState, useEffect } from "react";

export const RecipesPage = () => {
    const [weeklyPlan, setWeeklyPlan] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [sundayMotto, setSundayMotto] = useState("");
    
    // Identificador único para evitar que se resalten duplicados
    const [activeSelection, setActiveSelection] = useState(null);

    // --- IMAGEN BASE64 PARA SHAKSHUKA ---
    const shakshukaBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFhUZGRgaGhoaGRoaGhkaGhkaGhgaGhoYGhocIS4lHB4rHhkYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHhISHzQrJCs0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAECBAUGB//EADwQAAIBAgQDBgQEBQMFAQEAAAECEQAhAxIxQVFhBBIicYGRMvChsfAFE0LBUnKy4fIUI2KSorPC0uIV/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDBAAF/8QAIhEAAgIDAQEBAQEBAQAAAAAAAAECEQMhMRIiQRMyUWH/2gAMAwEAAвому...";

    const foodDatabase = {
        desayunos: [
            { name: "Panquecas de Avena", ingredients: ["1 taza de avena", "1 plátano", "2 huevos"], prep: "1. Licúa todo.\n2. Cocina en sartén 2 min por lado.", cal: 320, p: 12, img: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { name: "Shakshuka Express", ingredients: ["2 huevos", "Salsa de tomate casera", "Pimientos"], prep: "1. Calienta la salsa.\n2. Rompe los huevos encima.\n3. Tapa hasta que cuajen.", cal: 290, p: 18, img: shakshukaBase64 },
            { name: "Tostadas con Ricotta", ingredients: ["Pan integral", "Queso ricotta", "Fresas"], prep: "1. Tuesta el pan.\n2. Unta el ricotta.\n3. Decora con fresas.", cal: 270, p: 14, img: "https://images.pexels.com/photos/6294354/pexels-photo-6294354.jpeg?auto=compress&cs=tinysrgb&w=600" }
        ],
        almuerzos: [
            { name: "Bowl de Quinoa y Pollo", ingredients: ["Quinoa", "Pechuga", "Aguacate"], prep: "1. Cocina la quinoa.\n2. Pollo a la plancha.\n3. Mezcla en un bowl.", cal: 480, p: 35, img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { name: "Salmón con Brócoli", ingredients: ["Salmón", "Salsa soja", "Brócoli"], prep: "1. Sella el salmón.\n2. Cocina el brócoli al vapor.", cal: 420, p: 30, img: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600" }
        ],
        cenas: [
            { name: "Tacos de Lechuga", ingredients: ["Lechuga", "Pavo molido", "Pico de gallo"], prep: "1. Saltea la carne.\n2. Rellena las hojas de lechuga.", cal: 290, p: 28, img: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { name: "Sopa Miso con Tofu", ingredients: ["Pasta miso", "Tofu", "Algas nori"], prep: "1. Disuelve el miso en agua caliente.\n2. Agrega tofu.", cal: 220, p: 16, img: "https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=600" }
        ]
    };

    const mottos = [
        "¡Día de recargar energías! 🔋",
        "Disfruta tu comida trampa con moderación. 🍕",
        "Mente sana en cuerpo sano. ✨"
    ];

    const generateRandomPlan = () => {
        const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        setSundayMotto(mottos[Math.floor(Math.random() * mottos.length)]);

        const newPlan = days.map((day) => ({
            day,
            d: foodDatabase.desayunos[Math.floor(Math.random() * foodDatabase.desayunos.length)],
            a: foodDatabase.almuerzos[Math.floor(Math.random() * foodDatabase.almuerzos.length)],
            c: foodDatabase.cenas[Math.floor(Math.random() * foodDatabase.cenas.length)],
            isSpecial: day === "Domingo"
        }));
        setWeeklyPlan(newPlan);
        setSelectedRecipe(null);
        setActiveSelection(null);
    };

    useEffect(() => {
        generateRandomPlan();
    }, []);

    // Maneja la selección única combinando día y tipo de comida
    const handleRecipeClick = (recipe, day, mealType) => {
        setSelectedRecipe(recipe);
        setActiveSelection(`${day}-${mealType}`);
    };

    return (
        <div className="container py-5 mt-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="display-5 fw-bold text-success m-0">Tu Plan Semanal 🗓️</h1>
                    <p className="text-white-50">Haz clic en un plato para ver su preparación.</p>
                </div>
                <button className="btn btn-success rounded-pill shadow-sm px-4 fw-bold" onClick={generateRandomPlan}>
                    <i className="fas fa-random me-2"></i> Mezclar Menú
                </button>
            </div>

            {/* Grid de Cards */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {weeklyPlan.map((plan, i) => (
                    <div key={i} className="col">
                        <div className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-dark text-white border ${plan.isSpecial ? 'border-success' : 'border-secondary'}`}>
                            <div className="card-header border-0 bg-transparent pt-4 px-4 text-center text-md-start">
                                <h3 className="fw-bold text-success">{plan.day}</h3>
                            </div>
                            
                            <div className="card-body px-4 pb-4">
                                {plan.isSpecial ? (
                                    <div className="d-flex align-items-center justify-content-center h-100 py-5">
                                        <p className="fs-4 text-center italic mb-0 text-warning">🌟 {sundayMotto} 🌟</p>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {[
                                            { label: "Desayuno", data: plan.d, color: "text-info" },
                                            { label: "Almuerzo", data: plan.a, color: "text-success" },
                                            { label: "Cena", data: plan.c, color: "text-warning" }
                                        ].map((meal, idx) => {
                                            const selectionKey = `${plan.day}-${meal.label}`;
                                            const isActive = activeSelection === selectionKey;

                                            return (
                                                <div 
                                                    key={idx}
                                                    onClick={() => handleRecipeClick(meal.data, plan.day, meal.label)} 
                                                    className="p-2 rounded-3 d-flex align-items-center gap-3"
                                                    style={{ 
                                                        cursor: 'pointer',
                                                        backgroundColor: isActive ? 'rgba(25, 135, 84, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                                        border: isActive ? '2px solid #198754' : '2px solid transparent',
                                                        boxShadow: isActive ? '0 0 12px rgba(25, 135, 84, 0.4)' : 'none',
                                                        transition: 'all 0.2s ease-in-out'
                                                    }}
                                                >
                                                    <img src={meal.data?.img} alt="food" className="rounded-2" style={{ width: '55px', height: '55px', objectFit: 'cover' }} />
                                                    <div>
                                                        <small className={`d-block fw-bold ${meal.color}`}>{meal.label}</small>
                                                        <span className="small fw-semibold">{meal.data?.name}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Panel de Detalle (Se muestra al seleccionar una receta) */}
            {selectedRecipe && (
                <div className="mt-5 p-4 bg-dark border border-success rounded-4 shadow-lg animate__animated animate__fadeInUp">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <img 
                                src={selectedRecipe.img} 
                                className="img-fluid rounded-3 shadow border border-secondary" 
                                alt={selectedRecipe.name} 
                                style={{ maxHeight: "300px", width: "100%", objectFit: "cover" }} 
                            />
                        </div>
                        <div className="col-md-8 text-white">
                            <div className="d-flex justify-content-between align-items-start">
                                <h2 className="text-success fw-bold">{selectedRecipe.name}</h2>
                                <button className="btn btn-close btn-close-white" onClick={() => { setSelectedRecipe(null); setActiveSelection(null); }}></button>
                            </div>
                            <hr className="border-secondary" />
                            <div className="row">
                                <div className="col-md-5">
                                    <h5 className="text-info small text-uppercase fw-bold mb-3">Ingredientes</h5>
                                    <ul className="list-unstyled">
                                        {selectedRecipe.ingredients.map((ing, idx) => (
                                            <li key={idx} className="small mb-1">• {ing}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-md-7 border-start border-secondary">
                                    <h5 className="text-warning small text-uppercase fw-bold mb-3">Preparación</h5>
                                    <p className="small" style={{ whiteSpace: "pre-line" }}>{selectedRecipe.prep}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-top border-secondary d-flex gap-3">
                                <span className="badge bg-danger rounded-pill px-3 py-2">🔥 {selectedRecipe.cal} Kcal</span>
                                <span className="badge bg-primary rounded-pill px-3 py-2">💪 {selectedRecipe.p}g Proteína</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};