import React from "react";

const RecipeCard = ({ recipe }) => {
    const { name, image, calories, protein, carbs, fat, time } = recipe;

    return (
        <div className="card h-100 shadow-sm border-0 overflow-hidden">
            {/* Imagen con badge de tiempo */}
            <div className="position-relative">
                <img 
                    src={image} 
                    className="card-img-top" 
                    alt={name} 
                    style={{ height: "200px", objectFit: "cover" }} 
                />
                
                <span className="badge bg-dark position-absolute bottom-0 end-0 m-2 opacity-75">
                    ⏱️ {time} min
                </span>
            </div>

            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-dark">{name}</h5>
                
                {/* Sección de Macros en una fila */}
                <div className="row g-0 text-center my-3 py-2 bg-light rounded shadow-sm">
                    <div className="col border-end">
                        <div className="fw-bold text-success">{protein}g</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>PROT</small>
                    </div>
                    <div className="col border-end">
                        <div className="fw-bold text-primary">{carbs}g</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>CARBS</small>
                    </div>
                    <div className="col">
                        <div className="fw-bold text-warning">{fat}g</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>GRASA</small>
                    </div>
                </div>

                {/* Footer de la Card */}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-danger">🔥 {calories} kcal</span>
                    <button className="btn btn-outline-success btn-sm px-3 rounded-pill">
                        Ver receta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;