function calculatorComponent() {

    let chart;

    const initialCrystalPendulumChart =  {
        type: 'bar',
        data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        datasets: [{
            label: 'Probability to fulfill',
            data: [],
            borderWidth: 1,
            backgroundColor: '#8a508f',
        },{
            label: 'Probability to fulfill and win',
            data: [],
            borderWidth: 1,
            backgroundColor: '#558f50',
        }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                },
            }
        }
    };

    const updateChart = (probabilities) => {
        chart.data.datasets[0].data = probabilities.predictions.map(p => (p * 100).toFixed(0));
        chart.data.datasets[1].data = probabilities.predictionsAndWins.map(p => (p * 100).toFixed(0));
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
        get prettyResult() {
            return (this.result?.winning * 100).toFixed(2) + '%'; 
        },
    }
};