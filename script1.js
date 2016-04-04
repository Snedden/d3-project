    var bardata; //bar data
    var margin = { top: 30, right: 30, bottom: 40, left:50 }

    var height = 400 - margin.top - margin.bottom,
      width = 600 - margin.left - margin.right,
      barWidth = 50,
      barOffset = 5;

    //on change event on file input dom
    document.getElementById('file').addEventListener('change', handleFileSelect, false);
    
    //build canvas
    var canvas=buildSvgCanvas();

    function handleFileSelect(evt) {
    //remove previous chart
    removeChart();  
    console.log('data ', evt.target.files[0]) ;
    var file = evt.target.files[0];

    handleFile(file);
    
  }


  function handleFile(file) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(file);
    } else {
        alert('FileReader are not supported in this browser.');
    }
  }

  function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
  }

  function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
  }

  function processData(csv) {
    bardata = d3.csv.parse(csv); 
    bardata.forEach(function(d){
      d.value=parseInt(d.value);
    });

    //init
    buildNav(bardata);
    
    buildBarChart('label');

  }

  function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
  }


//builds svg container for the chart
function buildSvgCanvas(){

   var myCanvas = d3.select('#chart').append('svg')
      .style('background', '#E7E0CB')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
  return myCanvas;  
}

//nav buidling
function buildNav(data){
  console.log('data',data);
  var list=document.createElement('ul');

  //build headers
  for (var key in data[0]) {
      if (data[0].hasOwnProperty(key)) {
       // console.log(key + " -> " , data[0][key]);
        var item=document.createElement('li');
        var itemText;
        itemText=document.createTextNode(key);
        item.appendChild(itemText);
        list.appendChild(item);

        //create second level list 
        var L2list=document.createElement('ul');
        //item one
        var L2item1=document.createElement('li');
        var itemText=document.createTextNode('Use as value');
        L2item1.appendChild(itemText);
        L2item1.addEventListener('click',function(){
          resetAxis();
        });
        L2list.appendChild(L2item1);
        //item two
        var L2item2=document.createElement('li');
        L2item2.addEventListener('click',function(){
          resetAxis();
        });
        var itemText=document.createTextNode('Use as label');
        L2item2.appendChild(itemText);
        L2list.appendChild(L2item2);

        item.appendChild(L2list);
             
        //build data for bar chart
      }
    }


  document.getElementsByTagName('nav')[0].appendChild(list);

}

function resetAxis(){
  removeChart();
  buildBarChart('label2');
}

function removeChart(){
  d3.selectAll("svg > *").remove();
}


function buildBarChart(lbl){
  /*
  bardata.sort(function compareNumbers(a,b) {
      return a -b;
  });
    */


  var tempColor;

  var colors = d3.scale.linear()
  .domain([0, bardata.length*.33, bardata.length*.66, bardata.length])
  .range(['#B58929','#C61C6F', '#268BD2', '#85992C']);

  var maxdata=d3.max(bardata, function(d) { return d.value; });
  var mindata=d3.min(bardata, function(d) { return d.value; });

  
  var labelArray=[] ;
  bardata.forEach(function(d){
    labelArray.push(String(d[lbl]))
  });
                
                  
          

    console.debug('maxdata',maxdata);
    console.debug('mindata',mindata);
    console.debug('length',bardata.length);
  var yScale = d3.scale.linear()
          .domain([mindata-5, maxdata])
          .range([0, height]);
    
  var xScale = d3.scale.ordinal()
          .domain(labelArray)
          .range([0, width])
          .rangeBands([0, width], 0.3)

  var tooltip = d3.select('body').append('div')
          .style('position', 'absolute')
          .style('padding', '0 10px')
          .style('background', 'white')
          .style('opacity', 0)

  canvas
      .append('g')
      .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
      .selectAll('rect').data(bardata)
      .enter().append('rect')
          .style('fill', function(d,i) {
              return colors(i);
          })
          .attr('width', xScale.rangeBand())
          .attr('x', function(d,i) {
              return (i*(width/labelArray.length));
          })
          .attr('height', 0)
          .attr('y', height)

      .on('mouseover', function(d) {

          tooltip.transition()
              .style('opacity', .9)

          tooltip.html(d.label+d.value)
              .style('left', (d3.event.pageX - 35) + 'px')
              .style('top',  (d3.event.pageY - 30) + 'px')


          tempColor = this.style.fill;
          d3.select(this)
              .style('opacity', .5)
              .style('fill', 'yellow')
      })

      .on('mouseout', function(d) {
          d3.select(this)
              .style('opacity', 1)
              .style('fill', tempColor)
      })

      .transition()
        .attr('height', function(d) {
            return yScale(d.value);
        })
        .attr('y', function(d) {
            return height - yScale(d.value);
        })
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1000)
        .ease('elastic')

  var vGuideScale = d3.scale.linear()
      .domain([mindata-5, maxdata])
      .range([height, 0])

  var vAxis = d3.svg.axis()
      .scale(vGuideScale)
      .orient('left')
      .ticks(5)

  var vGuide = d3.select('svg').append('g')
      vAxis(vGuide)
      vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      vGuide.selectAll('path')
          .style({ fill: 'none', stroke: "#000"})
      vGuide.selectAll('line')
          .style({ stroke: "#000"})

  var hAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .tickValues(labelArray)
      
    

     var hGuide=d3.select('svg').append('g') ;
      hAxis(hGuide);
      hGuide.attr('transform','translate('+margin.left+','+(height+margin.top)+')');
      var path =hGuide.selectAll('path')
    console.log(path); 
    hGuide.selectAll('path')
        .style({ fill: 'none', stroke: "#000"})
    hGuide.selectAll('line')
        .style({ stroke: "#000"})
}





