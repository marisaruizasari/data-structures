$(dropDownChange());

var change;
var returnedData;

var main = document.querySelector('main')
var img = document.querySelector('img')

function dropDownChange() {
    $('select').change(function () {

        if ($(this).val() != 'none') {
            getResults();
        }

        setTimeout(function () {
            main.style.display = 'block';
            img.className += ' shadow'
        }, 150);
    });
}


function getResults() {

    var parameters = { category: $('select[name=category]').val() };

    //call the endpoint
    change = $.get('/pblog-page', parameters, function (data) {
        console.log(data)
        returnedData = data;
        $('.blogposts').html(data);
    });

    runScrollama();

}


async function runScrollama() {

    var results = await change
    console.log(results);

    // using d3 for convenience
    var main = d3.select('main')
    var scrolly = main.select('#scrolly');
    var figure = scrolly.select('figure');
    var article = scrolly.select('article');
    var step = article.selectAll('.step');
    console.log(step)
    // initialize the scrollama
    var scroller = scrollama();
    // generic window resize listener event
    function handleResize() {
        // 1. update height of step elements
        // var stepH = Math.floor(window.innerHeight * 0.75);
        // step.style('height', stepH + 'px');
        var figureHeight = window.innerHeight / 1.6
        var figureMarginTop = (window.innerHeight - figureHeight) / 2
        figure
            .style('height', figureHeight + 'px')
            .style('top', figureMarginTop + 'px');
        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }


    // scrollama event handlers
    var appended;

    function handleStepEnter(response) {
        console.log(response)
        // response = { element, direction, index }
        // add color to current step only
        step.classed('is-active', function (d, i) {
            return i === response.index;
        })
        // update graphic based on step
        // figure.select('p').text(response.index + 1);
        // figure.select('.figure-info').text(returnedData[1].blogpost[response.index].date);
        var img = document.querySelector('.figure-img')

        img.src = `images/${returnedData[1].blogpost[response.index].fileName}`;



    }

    async function listenForAppend() {
        var response = await appended;
        console.log(response);

        var precode = document.querySelectorAll('pre code');
        precode.forEach(block => {
            hljs.highlightBlock(block);
        });
    }




    function setupStickyfill() {
        d3.selectAll('.sticky').each(function () {
            Stickyfill.add(this);
        });
    }

    function init() {
        setupStickyfill();
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();
        // 2. setup the scroller passing options
        // 		this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller.setup({
                step: '#scrolly article .step',
                offset: 0.33,
                debug: false,
            })
            .onStepEnter(handleStepEnter)
        // setup resize event
        window.addEventListener('resize', handleResize);
    }


    init();

}


hljs.initHighlightingOnLoad();
