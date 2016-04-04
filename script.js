

// My header
var headers = ["C1","C2","C3","c4","C5","C6","C7","C8","C9","C10"].join(",");
//bar data
//var bardata=[];
var bardata;
// First I get the file or URL data like text
//d3.text("data/climate/GlobalTemperatures.csv", function(error, data) {
d3.text("data/data.csv", function(error, data) {		
  	// Then I add the header and parse to csv
  	//data = d3.csv.parse(headers +"\n"+ data);
  	bardata = d3.csv.parse(data); 
  	bardata.forEach(function(d){
  		d.value=parseInt(d.value);
  	})

  	console.log('data',data); 
   
    
   buildNav(bardata);
   //setBarData(data);
   buildBarChart();
   //buildChartDataNeg();
  	

});  


//dom buidling
//nav buidling
function buildNav(data){
	console.log('data',data);
	var list=document.createElement('ul');

	//build headers
	for (var key in data[0]) {
		  if (data[0].hasOwnProperty(key)) {
		   // console.log(key + " -> " , data[0][key]);
		    var item=document.createElement('li');
		    var itemText=document.createTextNode(key);
		    item.appendChild(itemText);
		    list.appendChild(item);
             
		    //build data for bar chart
		  }
		}


	document.getElementsByTagName('nav')[0].appendChild(list);

}

function setBarData(data){
	for(var key in data)
	{
		//console.log(key + " -> " , data[key]);
		//bardata.push(parseInt(data[key].LandAverageTemperature));
		var row;
		row.value=parseInt(data[key].value);
		row.label=data[key].label;
		bardata.push(parseInt(data[key].value));
	}
}

function buildBarChart(){
	/*
	bardata.sort(function compareNumbers(a,b) {
    	return a -b;
	});
    */
	var margin = { top: 30, right: 30, bottom: 40, left:50 }

	var height = 400 - margin.top - margin.bottom,
	    width = 600 - margin.left - margin.right,
	    barWidth = 50,
	    barOffset = 5;

	var tempColor;

	var colors = d3.scale.linear()
	.domain([0, bardata.length*.33, bardata.length*.66, bardata.length])
	.range(['#B58929','#C61C6F', '#268BD2', '#85992C']);
	var maxdata=d3.max(bardata, function(d) { return d.value; });
	var mindata=d3.min(bardata, function(d) { return d.value; });

	
	var labelArray=[] 
	bardata.forEach(function(d){
		labelArray.push(String(d.label))
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

	var myChart = d3.select('#chart').append('svg')
	    .style('background', '#E7E0CB')
	    .attr('width', width + margin.left + margin.right)
	    .attr('height', height + margin.top + margin.bottom)
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

	myChart.transition()
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
	    .tickValues( function(){
		       			var labelArray=[] 
		       			bardata.forEach(function(d){
	           			labelArray.push(String(d.label))
		       			})
		       	    console.log('labelArray ',labelArray);		
		     		return labelArray;

   					});

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


