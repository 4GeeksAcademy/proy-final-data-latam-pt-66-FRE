import React, { useState, useEffect } from "react";
import swal from "sweetalert";

export const RecipesPage = () => {
    const [weeklyPlan, setWeeklyPlan] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [sundayMotto, setSundayMotto] = useState("");
    const [activeSelection, setActiveSelection] = useState(null);

    const foodDatabase = {
        desayunos: [
            { 
                name: "Panquecas de Avena", 
                ingredients: ["1 taza de avena", "1 plátano", "2 huevos"], 
                prep: "1. Licúa todos los ingredientes hasta tener una mezcla homogénea.\n2. Calienta una sartén antiadherente.\n3. Cocina por 2 minutos por cada lado hasta que doren.", 
                cal: 320, p: 12, 
                img: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600" 
            },
            { 
                name: "Shakshuka Express", 
                ingredients: ["2 huevos", "1/2 taza de salsa de tomate", "Pimientos y cebolla"], 
                prep: "1. Sofreír vegetales.\n2. Agregar la salsa y dejar que hierva.\n3. Romper los huevos encima y tapar hasta que cuajen.", 
                cal: 290, p: 18, 
                img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" 
            },
            { 
                name: "Tostadas con Ricotta", 
                ingredients: ["2 rebanadas de pan integral", "4 cdas de queso ricotta", "Fresas fileteadas"], 
                prep: "1. Tostar el pan.\n2. Untar el queso generosamente.\n3. Decorar con las fresas.", 
                cal: 270, p: 14, 
                img: "https://images.pexels.com/photos/6294354/pexels-photo-6294354.jpeg?auto=compress&cs=tinysrgb&w=600" 
            }
        ],
        almuerzos: [
            { 
                name: "Bowl de Quinoa y Pollo", 
                ingredients: ["150g de pechuga", "1/2 taza de quinoa", "Aguacate y espinacas"], 
                prep: "1. Cocinar la quinoa.\n2. Pollo a la plancha.\n3. Mezclar todo en un bowl.", 
                cal: 480, p: 35, 
                img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" 
            },
            { 
                name: "Salmón con Brócoli", 
                ingredients: ["Filete de salmón", "Brócoli al vapor", "Limón"], 
                prep: "1. Sellar el salmón en la sartén.\n2. Cocinar el brócoli al vapor.\n3. Servir con limón.", 
                cal: 420, p: 30, 
                img: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600" 
            }
        ],
        cenas: [
            { 
                name: "Tacos de Lechuga", 
                ingredients: ["Hojas de lechuga", "150g pavo molido", "Pico de gallo"], 
                prep: "1. Saltear el pavo.\n2. Usar la lechuga como tortilla.\n3. Rellenar y servir.", 
                cal: 290, p: 28, 
                img: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600" 
            }
        ]
    };

    const mottos = ["¡Día de recargar energías! 🔋", "Disfruta con moderación. 🍕", "Mente sana en cuerpo sano. ✨"];

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

    useEffect(() => { generateRandomPlan(); }, []);

    const handleRecipeClick = (recipe, day, mealType) => {
        setSelectedRecipe(recipe);
        setActiveSelection(`${day}-${mealType}`);
    };

    return (
        <div className="container py-5 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-5 text-white">
                <h1 className="fw-bold text-success m-0">Tu Plan Semanal 🗓️</h1>
                <button className="btn btn-success rounded-pill px-4 fw-bold" onClick={generateRandomPlan}>
                    Mezclar Menú
                </button>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {weeklyPlan.map((plan, i) => (
                    <div key={i} className="col">
                        <div className={`card h-100 bg-dark text-white border ${plan.isSpecial ? 'border-success' : 'border-secondary'}`}>
                            <div className="card-header border-0 bg-transparent pt-4 px-4 text-center">
                                <h3 className="fw-bold text-success">{plan.day}</h3>
                            </div>
                            <div className="card-body px-4 pb-4">
                                {!plan.isSpecial ? (
                                    <div className="d-flex flex-column gap-3">
                                        {[
                                            { label: "Desayuno", data: plan.d, color: "text-info" },
                                            { label: "Almuerzo", data: plan.a, color: "text-success" },
                                            { label: "Cena", data: plan.c, color: "text-warning" }
                                        ].map((meal, idx) => (
                                            <div key={idx} onClick={() => handleRecipeClick(meal.data, plan.day, meal.label)} 
                                                className={`p-2 rounded-3 d-flex align-items-center gap-3 border ${activeSelection === `${plan.day}-${meal.label}` ? 'border-success bg-success bg-opacity-25' : 'border-transparent'}`}
                                                style={{ cursor: 'pointer' }}>
                                                <img src={meal.data?.img} alt="food" className="rounded-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                <div>
                                                    <small className={`d-block fw-bold ${meal.color}`}>{meal.label}</small>
                                                    <span className="small">{meal.data?.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-warning text-center my-4">{sundayMotto}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRecipe && (
                <div className="mt-5 p-4 bg-dark border border-success rounded-4 text-white shadow-lg">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <img src={selectedRecipe.img} className="img-fluid rounded-3 border border-secondary" alt={selectedRecipe.name} />
                        </div>
                        <div className="col-md-8">
                            <div className="d-flex justify-content-between">
                                <h2 className="text-success fw-bold">{selectedRecipe.name}</h2>
                                <button className="btn btn-close btn-close-white" onClick={() => { setSelectedRecipe(null); setActiveSelection(null); }}></button>
                            </div>
                            <hr className="border-secondary" />
                            <div className="row">
                                <div className="col-md-5">
                                    <h5 className="text-info small fw-bold">Ingredientes</h5>
                                    <ul className="list-unstyled small">
                                        {selectedRecipe.ingredients.map((ing, idx) => <li key={idx}>• {ing}</li>)}
                                    </ul>
                                </div>
                                <div className="col-md-7 border-start border-secondary">
                                    <h5 className="text-warning small fw-bold">Preparación</h5>
                                    <p className="small" style={{ whiteSpace: "pre-line" }}>{selectedRecipe.prep}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-top border-secondary">
                                <div className="d-flex gap-3">
                                    <span className="badge bg-danger px-3 py-2">🔥 {selectedRecipe.cal} Kcal</span>
                                    <span className="badge bg-primary px-3 py-2">💪 {selectedRecipe.p}g Prot</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};