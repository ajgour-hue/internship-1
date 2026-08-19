export const calculateSwapValue = (
    requestedValue,
    offeredValue
) => {

    const requested = Number(requestedValue);
    const offered = Number(offeredValue);

    if (
        !Number.isFinite(requested) ||
        !Number.isFinite(offered) ||
        requested < 0 ||
        offered < 0
    ) {
        throw new Error("Invalid swap values");
    }

    const difference = Math.abs(
        requested - offered
    );

    const differencePercentage =
        requested === 0
            ? 0
            : (difference / requested) * 100;

    let recommendation;

    if (differencePercentage <= 10) {
        recommendation = "excellent_match";
    } else if (differencePercentage <= 25) {
        recommendation = "good_match";
    } else if (differencePercentage <= 40) {
        recommendation = "fair_match";
    } else {
        recommendation = "large_value_difference";
    }

    return {
        requestedValue: requested,
        offeredValue: offered,
        difference,
        differencePercentage: Number(
            differencePercentage.toFixed(2)
        ),
        recommendation
    };
};