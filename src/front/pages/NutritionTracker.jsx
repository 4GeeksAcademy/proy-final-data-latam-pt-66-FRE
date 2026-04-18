// PROYECTO FINAL
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FoodForm } from "../components/FoodForm";
import { FoodList } from "../components/FoodList";
import { NutritionDashboard } from "../components/NutritionDashboard";
import { CalorieProgress } from "../components/CalorieProgress";
import { UserProfile } from "../components/UserProfile";
import { GoalSelector } from "../components/GoalSelector";

export const NutritionTracker = () => {
    const { loadFoods } = useApp();
    const [editingFood, setEditingFood] = useState(null);

    useEffect(() => {
        loadFoods();
    }, []);

    return (
        <div className="container mt-4 mb-4">

            <CalorieProgress />
            <NutritionDashboard />
            <UserProfile />
            <GoalSelector />

            <div className="row">
                <div className="col-md-5">
                    <FoodForm
                        editingFood={editingFood}
                        setEditingFood={setEditingFood}
                    />
                </div>

                <div className="col-md-7">
                    <FoodList setEditingFood={setEditingFood} />
                </div>
            </div>
        </div>
    );
};