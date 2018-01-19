export const colors = ["#f44336", "#42a5f5", "#43a047", "#ffeb3b", "#ff5722", "#00897b", "#ab47bc", "#607d8b", "#18ffff", "#ff4081"];

export const getColor = (i) => {
    return colors[i % 10];
};