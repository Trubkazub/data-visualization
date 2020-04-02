// Объявляем основные переменные
const width = 1000;
const height = 500;
const margin = 30;
const svg  = d3.select('#scatter-plot')
            .attr('width', width)
            .attr('height', height);

// Указываем изначальные значения, на основе которых будет строится график
let xParam = 'fertility-rate';
let yParam = 'child-mortality';
let radius = 'gdp';
let year = '2000';

// Эти переменные понадобятся в Part 2 и 3
const params = ['child-mortality', 'fertility-rate', 'gdp', 'life-expectancy', 'population'];
const colors = ['aqua', 'lime', 'gold', 'hotpink']

// Создаем шкалы для осей и точек
const x = d3.scaleLinear().range([margin*2, width-margin]);
const y = d3.scaleLinear().range([height-margin, margin]);



// Создаем наименования для шкал и помещаем их на законные места сохраняя переменные
const xLable = svg.append('text').attr('transform', `translate(${width/2}, ${height})`);
const yLable = svg.append('text').attr('transform', `translate(${margin/2}, ${height/2}) rotate(-90)`);

// Part 1: по аналогии со строчками сверху задайте атрибуты 'transform' чтобы переместить оси +
const xAxis = svg.append('g').attr('transform', `translate(0, 460)`);
const yAxis = svg.append('g').attr('transform', `translate(61, -10) rotate(+90)`);


// Part 2: Здесь можно создать шкалы для цвета и радиуса объектов +-
//const color = d3.scaleOrdinal().range(colors);
//const r = d3.scaleSqrt().range(params);

// Part 2: для элемента select надо задать options http://htmlbook.ru/html/select
// и установить selected для дефолтного значения

// d3.select('#radius').selectAll('option')
//         ...


// Part 3: то же что делали выше, но для осей
// ...


loadData().then(data => {
    // сюда мы попадаем после загружки данных и можем для начала на них посмортеть:
    console.log(data)

    // Part 2: здесь мы можем задать пораметр 'domain' для цветовой шкалы
    // для этого нам нужно получить все уникальные значения поля 'region', сделать это можно при помощи 'd3.nest' +-
    //let regions = d3.nest().key(d => d.region).rollup(d => d[0]).entries(data).map(d => d.key);
    //color.domain(regions);

    // подписка на изменение позиции ползунка
    d3.select('.slider').on('change', newYear);

    // подписка на событие 'change' элемента 'select'
    d3.select('#radius').on('change', newRadius);

    // Part 3: подпишемся на изменения селектороы параметров осей
    // ...

    // изменяем значение переменной и обновляем график
    function newYear(){
        year = this.value;
        updateChart()
    }

    function newRadius(){
        // Part 2: по аналогии с newYear +-
        radius = this.value;
        updateChart()
    }

    function updateChart(){
        // Обновляем все лейблы в соответствии с текущем состоянием
        xLable.text(xParam);
        yLable.text(yParam);
        d3.select('.year').text(year);

        // обновляем параметры шкалы и ось 'x' в зависимости от выбранных значений
        // P.S. не стоит забывать, что значения показателей изначально представленны в строчном формате, по этому преобразуем их в Number при помощи +
        let xRange = data.map(d=> +d[xParam][year]);
        x.domain([d3.min(xRange), d3.max(xRange)]);

        // и вызовим функцию для ее отрисовки
        xAxis.call(d3.axisBottom(x));    

        // Part 1: нужно сделать то же самое и для 'y' +
        let yRange = data.map(d=> +d[yParam][year]);
        y.domain([d3.min(yRange), d3.max(yRange)]);

        yAxis.call(d3.axisBottom(y));  
        
        // Part 2: теперь у нас есть еще одна не постоянная шкала
        // ...

        // Part 1, 2: создаем и обновляем состояние точек
        let xLen = d3.max(xRange)-d3.min(xRange);
        let yLen = d3.max(yRange)-d3.min(yRange);
        alert(xLen+" "+yLen+" "+ +data[0][xParam][year]+" "+ +data[0][yParam][year]+" "+ x(+data[0][xParam][year])+" "+y(+data[0][yParam][year]));
        var p = d3.select("svg")
            .selectAll("circle")
            .data(data)
            .attr('cx', function(d) { return x(+d[xParam][year]); })
            .attr('cy', function(d) { return y(+d[yParam][year]); })
            .attr('r', 4);

        // Create 
        p.enter().append("circle")
            .attr('cx', function(d) { return x(+d.xParam.year); })
            .attr('cy', function(d) { return y(+d.yParam.year); })
            .attr('r', function(d) { return 4; });

        //alert(width*((+data[0][xParam][year]/(xLen/100))/100));
        /*for (let i = 0; i < 1; i++) { 
            svg.selectAll('circle').data(data).enter().append("circle")
                .attr("cx", x(+data[i][xParam][year])) //[""0""][""fertility-rate""][1800]
                .attr("cy", y(+data[i][yParam][year])) //function (d) { return +d[i][yParam][year]; }
                .attr("r", 3);
            alert(i);

        }
        svg.selectAll('circle').data(data).enter().append("circle")
            .attr("cx", function (d) { return +d[Xparam][year]; })
            .attr("cy", function (d) { return +d[Yparam][year]; })
            .attr("r", radius);
        //     ...*/
    }

    // рисуем график в первый раз
    updateChart();
});

// Эта функция загружает и обрабатывает файлы, без особого желания лучше ее не менять
async function loadData() {
    const population = await d3.csv('data/pop.csv');
    const rest = { 
        'gdp': await d3.csv('data/gdppc.csv'),
        'child-mortality': await d3.csv('data/cmu5.csv'),
        'life-expectancy': await d3.csv('data/life_expect.csv'),
        'fertility-rate': await d3.csv('data/tfr.csv')
    };
    const data = population.map(d=>{
        return {
            geo: d.geo,
            country: d.country,
            region: d.region,
            population: {...d},
            ...Object.values(rest).map(v=>v.find(r=>r.geo===d.geo)).reduce((o, d, i)=>({...o, [Object.keys(rest)[i]]: d }), {})
            
        }
    })
    return data
}