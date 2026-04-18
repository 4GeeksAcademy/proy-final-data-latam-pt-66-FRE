export const getDietRecommendation = (goal, diet) => {
    const base = {
        protein: 30,
        carbs: 40,
        fat: 30,
    };

    if (goal === "gain") {
        base.protein = 35;
    }

    if (goal === "lose") {
        base.carbs = 30;
        base.protein = 40;
    }

    // Ajustes por dieta
    if (diet === "vegan") {
        return { ...base, focus: "legumbres, tofu, vegetales" };
    }

    if (diet === "keto") {
        return { protein: 25, carbs: 10, fat: 65, focus: "grasas saludables" };
    }

    if (diet === "paleo") {
        return { ...base, focus: "proteína natural, frutas, verduras" };
    }

    return { ...base, focus: "alimentación balanceada" };
};