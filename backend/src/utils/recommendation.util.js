export const calculateRecommendationScore = ({
    distanceKm,
    maxDistanceKm,
    targetValue,
    candidateValue,
    targetCategory,
    candidateCategory,
    targetCondition,
    candidateCondition
}) => {

    // Distance score - 40%
    const distanceScore =
        distanceKm >= maxDistanceKm
            ? 0
            : 100 - (distanceKm / maxDistanceKm) * 100;


    // Value score - 35%
    let valueScore = 0;

    if (targetValue === 0) {
        valueScore = candidateValue === 0 ? 100 : 0;
    } else {

        const difference = Math.abs(
            targetValue - candidateValue
        );

        const differencePercentage =
            (difference / targetValue) * 100;

        valueScore = Math.max(
            0,
            100 - differencePercentage
        );
    }


    // Category score - 15%
    const categoryScore =
        targetCategory === candidateCategory
            ? 100
            : 0;


    // Condition score - 10%
    const conditionRank = {
        "New": 5,
        "Like New": 4,
        "Excellent": 3,
        "Good": 2,
        "Fair": 1
    };

    const targetRank =
        conditionRank[targetCondition] || 0;

    const candidateRank =
        conditionRank[candidateCondition] || 0;

    const conditionDifference =
        Math.abs(targetRank - candidateRank);

    let conditionScore;

    if (conditionDifference === 0) {
        conditionScore = 100;
    } else if (conditionDifference === 1) {
        conditionScore = 75;
    } else if (conditionDifference === 2) {
        conditionScore = 50;
    } else {
        conditionScore = 25;
    }


    // Final score
    const score =
        distanceScore * 0.40 +
        valueScore * 0.35 +
        categoryScore * 0.15 +
        conditionScore * 0.10;


    let recommendation;

    if (score >= 80) {
        recommendation = "excellent_match";
    } else if (score >= 65) {
        recommendation = "good_match";
    } else if (score >= 50) {
        recommendation = "fair_match";
    } else {
        recommendation = "low_match";
    }


    return {
        score: Number(score.toFixed(2)),
        recommendation,

        breakdown: {
            distanceScore: Number(
                distanceScore.toFixed(2)
            ),

            valueScore: Number(
                valueScore.toFixed(2)
            ),

            categoryScore,

            conditionScore
        }
    };
};