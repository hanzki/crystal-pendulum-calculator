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

    const setChartData = (probabilities) => {
        chart.data.datasets[0].data = probabilities.predictions;
        chart.update();
    };

    return {
        isLoading: false,
        init() {
            chart = new Chart(this.$refs.chart, initialCrystalPendulumChart);
        },
        skill: 5,
        difficulty: 3,
        olive: false,
        jacqueline: true,
        result: undefined,
        chaosBag: new ChaosBag(),
        calculate() {
            SKILL = this.skill;
            DIFFICULTY = this.difficulty;
            JACQUELINE_ENABLED = this.jacqueline;
            OLIVE_ENABLED = this.olive;
            this.result = calculateProbabilities(this.chaosBag);
            setChartData(this.result);
        },
        updateChaosBag() {
            Object.keys(this.chaosBag).foreach(key => {
                CHAOS_BAG[key] = this.chaosBag[key].count;
                if (key !== 'tentacles') {
                    MODIFIERS[key] = this.chaosBag[key].modifier;
                }
            });
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