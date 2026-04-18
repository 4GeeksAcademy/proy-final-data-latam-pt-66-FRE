import { useApp } from "../context/AppContext";

export const GoalSelector = () => {
    const { state, dispatch } = useApp();

    return (
        <div className="card p-3 mb-3">
            <h4 className="text-success">Objetivo</h4>

            <select
                className="form-control mb-2"
                value={state.goal}
                onChange={(e) =>
                    dispatch({ type: "SET_GOAL", payload: e.target.value })
                }
            >
                <option value="lose">Bajar peso</option>
                <option value="maintain">Mantener</option>
                <option value="gain">Ganar músculo</option>
            </select>

            <select
                className="form-control"
                value={state.diet}
                onChange={(e) =>
                    dispatch({ type: "SET_DIET", payload: e.target.value })
                }
            >
                <option value="balanced">Balanceada</option>
                <option value="vegan">Vegana</option>
                <option value="vegetarian">Vegetariana</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="dairy_free">Sin lácteos</option>
            </select>
        </div>
    );
};