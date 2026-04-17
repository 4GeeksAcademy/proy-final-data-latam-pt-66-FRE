// PROYECTO FINAL
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

export const FoodForm = ({ editingFood, setEditingFood }) => {
    const { addFood, updateFood } = useApp();

    const [form, setForm] = useState({
        mealtime: "Desayuno",
        name: "",
        calories: "",
        category: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (editingFood) {
            setForm(editingFood);
        }
    }, [editingFood]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            return setError("Agrega algún alimento");
        }

        if (!form.calories) {
            return setError("Cuantas calorias");
        }

        setError("");

        if (editingFood) {
            await updateFood(editingFood.id, form);
            setEditingFood(null);
        } else
            await addFood(form);

        setForm({
            mealtime: "Desayuno",
            name: "",
            calories: "",
            category: ""
        });
    };

    return (
        <div className="card shadow p-4 mb-4">
            <h4 className="mb-3 text-success">
                {editingFood ? "Editar alimento" : "Agregar alimento"}
            </h4>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label className="form-label">Horario</label>
                <select
                    className="form-select"
                    value={form.mealtime}
                    onChange={e => setForm({ ...form, mealtime: e.target.value })}
                >
                    <option>Desayuno</option>
                    <option>Comida</option>
                    <option>Cena</option>
                    <option>Snack</option>
                </select>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Alimento</label>
                    <input
                        className="form-control"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Calorías</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.calories}
                        onChange={e => setForm({ ...form, calories: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <select
                        className="form-select"
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                        <option>Proteina</option>
                        <option>Carbohidrato</option>
                        <option>Lácteo</option>
                        <option>Vegetal</option>
                        <option>Fruta</option>
                        <option>Leguminosa</option>
                        <option>Grasa</option>
                        <option>Azucar</option>
                    </select>
                </div>

                <button className="btn btn-success w-100">
                    {editingFood ? "Actualizar" : "Agregar"}
                </button>
            </form>
        </div>
    );
};