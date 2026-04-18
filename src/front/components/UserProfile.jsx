import { useApp } from "../context/AppContext";

export const UserProfile = () => {
    const { state, dispatch } = useApp();

    const handleChange = (e) => {
        dispatch({
            type: "SET_USER",
            payload: { [e.target.name]: e.target.value }
        });
    };

    return (
        <div className="card p-3 mb-3">
            <h4 className="text-success">Perfil</h4>

            <div className="row">
                <div className="col">
                    <input name="weight" placeholder="Peso (kg)" className="form-control"
                        value={state.user.weight} onChange={handleChange} />
                </div>

                <div className="col">
                    <input name="height" placeholder="Altura (cm)" className="form-control"
                        value={state.user.height} onChange={handleChange} />
                </div>

                <div className="col">
                    <input name="age" placeholder="Edad" className="form-control"
                        value={state.user.age} onChange={handleChange} />
                </div>
            </div>

            <div className="row mt-2">
                <div className="col">
                    <select name="gender" className="form-control" onChange={handleChange}>
                        <option value="">Género</option>
                        <option value="male">Hombre</option>
                        <option value="female">Mujer</option>
                    </select>
                </div>

                <div className="col">
                    <select name="activity" className="form-control"
                        onChange={(e) => dispatch({ type: "SET_ACTIVITY", payload: e.target.value })}>
                        <option value="low">Baja actividad</option>
                        <option value="moderate">Moderada</option>
                        <option value="high">Alta</option>
                    </select>
                </div>
            </div>
        </div>
    );
};