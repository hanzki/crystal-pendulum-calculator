function calculatorComponent() {

    let chart;

    const initialCrystalPendulumChart =  {
        type: 'bar',
        data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        datasets: [{
            label: 'Probability',
            data: [],
            borderWidth: 1
        }]
        },
        options: {
            scales: {
                y: {
                beginAtZero: true,
                max: 1
                }
            }
        }
    };

    const updateChart = (probabilities) => {
        chart.data.datasets[0].data = probabilities.predictions;
        chart.update();
    };

    return {
        isLoading: false,
        init() {
            chart = new Chart(this.$refs.chart, initialCrystalPendulumChart);
        },
        config: {
            skill: 5,
            difficulty: 3,
            olive: false,
            jacqueline: true,
            candles: 0,
        },
        result: undefined,
        chaosBag: new ChaosBag(),
        calculate() {
            this.result = calculateProbabilities(this.config, this.chaosBag);
            updateChart(this.result);
        },
        isTentacles(token) {
            return token === 'tentacles';
        },
        isSymbol(token) {
            return ['tentacles','star','tablet','cultist','skull'].includes(token);
        },
        isNumber(token) {
            return ['minus_four','minus_three','minus_two','minus_one','zero','plus_one'].includes(token);
        },
        get prettyResult() {
            return (this.result?.winning * 100).toFixed(2) + '%'; 
        },
    }
};