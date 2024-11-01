

 // Detect for ie
	  var ie =( function(){
                var undef,
                    v = 3,
                    div = document.createElement('div'),
                    all = div.getElementsByTagName('i');

                while (
                  div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                  all[0]
                );

                return v > 4 ? v : undef;

          }());	
      



			var entryIdMap = {};
			var entries = new DataArray();
			var budget = { name: "Total", entries:[] }; 
 			var chart;  
			var w = 950;
			var h = 600;
			var caso = 1   
			var format = null
			var source = null
			var grigiato = null
			var dysponenci = [];
			
			var historyStack = [];
			
			function rebuildBreadcrumbs() {
				var breadcrumbs = d3.select("#breadcrumbs");    
				var breadcrumbsLinks = breadcrumbs.selectAll("a")
					.data(historyStack);
					
				breadcrumbsLinks.enter()
					.append("a")
					.attr("href", function(d, i) {
						return "javascript:goToBreadcrumb(" + i + ")";
					})
					.text(function(d) { return d.name + ""; })
					
				breadcrumbsLinks.exit()
					.remove("")
			}
			
			function goToBreadcrumb(i) {
				var clicked = historyStack[i];				 
				historyStack.splice(i, historyStack.length - i);
				rebuildBreadcrumbs();
				chart.selectAll("g").remove();
				rebuildVis(clicked);
			}
			
			function findMinScaleAndPad(n) {
				if (n == 0) return 0;
				
				var scale = 1;
				var result = 0;
				
				while(result == 0 && scale < 100000) {
					scale *= 10;
					result = Math.floor(n * scale);
				}
				
				var scaleStr = "" + scale;
				var resultStr = "" + result;
				while(resultStr.length < scaleStr.length - 1) {
					resultStr = "0" + resultStr;
				}
				return resultStr;
			} 
		
			function numberToAmountStr(n) {
				
				
					
				
				
				if(source == "Database" && caso != null)
				{switch (caso) {
				case 1: source = 'netnet'; break;
				default: null; break;
				}
				}
				
				caso = null;

				var totale = null;
				switch (source) {
				case 'netnet': totale = 94064444 ; break;
				case 'netto': totale = 99172860; break;
				default: null; break;;
				}


 
				

				
				if (format =="€") 

				{

				totale = 1;	
				var normalized = 100*n/totale;  
				var zl = Math.floor(normalized);
				var gr = findMinScaleAndPad(normalized - zl);

				if (gr == 0) {
					gr = Math.floor((normalized - zl)*1000);
				}
				var result = "";
				if (zl > 0) {
					result += zl + " ";
				}
				else {
					result += "0,"
				}
				
				if (gr > 0)	{
					result += gr;
				}
				else {
				result += " ";					
				}
				
				return accounting.formatMoney(Math.floor(result/100), " €", 0, ".", ","); }

				else {
				
				var normalized = 100*n/totale;  
				var zl = Math.floor(normalized);
				var gr = findMinScaleAndPad(normalized - zl);
					
				if (gr == 0) {
					gr = Math.floor((normalized - zl)*1000);
				}
				var result = "";

				if (zl > 0) {
					result += zl + ",";
				}
				else {
					result += "0,"
				}
				
				if (gr > 0)	{
					result += gr;
				}
				else {
				result += "00001";					
				}
				
				return result + " %";}
			
				

				

			};
			
			function addToDysponent(name, value) {
				for(var i=0; i<dysponenci.length; i++) {
					if (dysponenci[i].name == name) {
						dysponenci[i].value += value; 
						return;
					}
				}
				dysponenci.push({
					name: name,
					value: value
				});
			} 

				var language = "eng"

				function ita() {
    			language = "ita";
    			init();}
    			function eng() {
    			language = "eng";
    			init();}
			
			function init() { 
				if (ie < 9) {	
		    	alert("This website needs a modern browser/questo sito richiede un browser moderno.  Install/installare Google Chrome, Mozilla Firefox, Apple Safari, Internet Explorer 10.");
	    		}
				d3.select("#chartContainer svg").remove();
				budget.entries.length = 0;
				dysponenci.length = 0;
				historyStack.length = 0; 
				chart = d3.select("#chartContainer").append("svg:svg");
				
				var pulisciOrder = document.getElementById("listOrder").options.length
				var pulisciDatabase = document.getElementById("listDatabase").options.length
				var pulisciFormat = document.getElementById("listFormat").options.length
				var pulisciGrigiato = document.getElementById("listGrigiato").options.length

   				var menuDatabaseIta = "Metrica,Fatturato net net,Fatturato netto";
				var menuDatabaseEng = "Metric,Net Net sales,Net sales";
				var menuDatabaseVal = "Database,netnet,netto";
				

				var menuDatabase = null;
				switch (language) {
				case 'ita': menuDatabase = menuDatabaseIta; break;
				case 'eng': menuDatabase = menuDatabaseEng; break;
				default:  null; break;
				}
											
   				menuDatabase = menuDatabase.split(",")
   				menuDatabaseVal = menuDatabaseVal.split(",")
				var listdatabase=document.getElementById("listDatabase");  
   				for (var i = 0; i < menuDatabase.length; i++) {
     			 var opt = document.createElement("option");
				 document.getElementById("listDatabase").options.add(opt);
			     opt.text = menuDatabase[i];
			     opt.value = menuDatabaseVal[i];
   				}

   				var sceltaDB = listdatabase.options[listdatabase.selectedIndex].value; 	
				
				if(sceltaDB == "Database" && caso !=  null)
				{switch (caso) {
				case 1: source = 'netnet'; break;
				default: null; break;
				}
				} 
				else if(sceltaDB == "Database" && caso == null)
				{} 
				else 
				{source = sceltaDB;}

				
				var totale = null;
				switch (source) {
				case 'netnet': totale = 94064444; break;
				case 'netto': totale = 99172860; break;
				default:  null; break;
				}
				var tema = null;
				if (language == "ita"){
				switch (source) {
				case 'netnet': tema = "Fatturato net net Ott-Dic 2012"; break;
				case 'netto': tema = "Fatturato netto Ott-Dic 2012"; break;
				default:  null; break;
				}
				}
				else {
				switch (source) {
				case 'netnet': tema = "Net net sales 4Q 2012"; break;
				case 'netto': tema = "Net sales 4Q 2012"; break;
				default:  null; break;
				}
				}

				var nomeFile = null;
				switch (source) {
				case 'netnet': nomeFile = "netnet"; break;
				case 'netto': nomeFile = "netto"; break;
				default:  null; break;
				}
				

				var menuGrigiatoIta = "Area grigiata =>,fatturato,margine,sconti";
				var menuGrigiatoEng = "Greyed area =>,revenues,margin,discounts";
				var menuGrigiatoVal = "Grigiato,a,b,c";

				var menuGrigiato = null;
				switch (language) {
				case 'ita': menuGrigiato = menuGrigiatoIta; break;
				case 'eng': menuGrigiato = menuGrigiatoEng; break;
				default:  null; break;
				}
											
   				menuGrigiato = menuGrigiato.split(",")
   				menuGrigiatoVal = menuGrigiatoVal.split(",")
				var listgrigiato=document.getElementById("listGrigiato");  
   				for (var i = 0; i < menuGrigiato.length; i++) {
     			 var opt = document.createElement("option");
				 document.getElementById("listGrigiato").options.add(opt);
			     opt.text = menuGrigiato[i];
			     opt.value = menuGrigiatoVal[i];
   				}

   				var sceltaGrigiato = listgrigiato.options[listgrigiato.selectedIndex].value;

   				if (sceltaGrigiato == "Grigiato")
   				{}
   				else 
   				{
   					grigiato = sceltaGrigiato;
   				}






				var testoGrigiato = null;
				if (language == "ita"){
				switch (grigiato) {
				case 'a': testoGrigiato = 'Grigiato su sfondo <span style="color:#006400">verde:</span> fatturato periodo precedente. Grigiato su sfondo <span style="color:#ff0000">rosso:</span> fatturato periodo corrente'; break;
				case 'b': testoGrigiato = 'Grigiato: margine lordo su fatturato netto o net net'; break;
				case 'c': testoGrigiato = 'Grigiato: sconto complessivo su fatturato lordo'; break;
				default: testoGrigiato = 'Grigiato su sfondo <span style="color:#006400">verde:</span> fatturato periodo precedente. Grigiato su sfondo <span style="color:#ff0000">rosso:</span> fatturato periodo corrente'; break;
				}
				}
				else{
					switch (grigiato) {
				case 'a': testoGrigiato = 'Greyed area on <span style="color:#006400">green </span>background, previous period sales. Greyed area on <span style="color:#ff0000">red </span>background, current period sales.'; break;
				case 'b': testoGrigiato = 'Greyed area: gross margin on net or net net sales'; break;
				case 'c': testoGrigiato = 'Greyed area: total discount on gross sales'; break;
				default: testoGrigiato = 'Greyed area on <span style="color:#006400">green </span>background, previous period sales. Greyed area on <span style="color:#ff0000">red </span>background, current period sales.'; break;
				}
			}



				


				var togliImmagine = null;
				switch (source) {
				case 'netnet': togliImmagine = "visible"; break;
				case 'netto': togliImmagine = "visible"; break;
				default:  null; break;
				}
				
					
				var menuFormatIta = "Formato,in %,in €";
				var menuFormatEng = "Format,in %,in €s";
				var menuFormatVal = "Formato,%,€";

				var menuFormat = null;
				switch (language) {
				case 'ita': menuFormat = menuFormatIta; break;
				case 'eng': menuFormat = menuFormatEng; break;
				default:  null; break;
				}
											
   				menuFormat = menuFormat.split(",")
   				menuFormatVal = menuFormatVal.split(",")
				var listformat=document.getElementById("listFormat");  
   				for (var i = 0; i < menuFormat.length; i++) {
     			 var opt = document.createElement("option");
				 document.getElementById("listFormat").options.add(opt);
			     opt.text = menuFormat[i];
			     opt.value = menuFormatVal[i];
   				}

   				var sceltaformat = listformat.options[listformat.selectedIndex].value;

   				if (sceltaformat == "Formato")
   				{}
   				else 
   				{
   					format = sceltaformat;
   				} 

				var ordine = null
				switch (language) {
				case 'ita': ordine = "Ordine di drill-down"; break;
				case 'eng': ordine = "Drill-down order"; break;
				default:  null; break;
				}

				var provaMenu1 = ordine+",a";
				var provaMenu2 = ordine+",a,b";
				var provaMenu3 = ordine+",a,b,c";			
				var provaMenu4 = ordine+",a,b,c,d";				
				var provaMenu5 = ordine+",a,b,c,d,e";
				var provaMenu6 = ordine+",a,b,c,d,e,f";
				var provaMenu7 = ordine+",a,b,c,d,e,f,g";
				var provaMenu8 = ordine+",a,b,c,d,e,f,g,h";
				var provaMenu9 = ordine+",a,b,c,d,e,f,g,h,i";
				
				var provaMenu = null;
				switch (source) {
				case 'netnet': provaMenu = provaMenu3; break;
				case 'netto': provaMenu = provaMenu3; break;
				default:  null; break;
				}
											
   				provaMenu = provaMenu.split(",")
				var listorder=document.getElementById("listOrder");  
   				for (var i = 0; i < provaMenu.length; i++) {
     			 var opt = document.createElement("option");
				 document.getElementById("listOrder").options.add(opt);
			     opt.text = provaMenu[i];
			     opt.value = provaMenu[i];
   				}
		
				var order = listorder.options[listorder.selectedIndex].value;  
				
				var unodue = null;
				switch (order) {
				case "Ordine di drill-down": unodue = "uno"; break;
				case 'a': unodue = "uno"; break;
				case 'b': unodue = "due"; break;
				case 'c': unodue = "tre"; break;
				case 'd': unodue = "quattro"; break;
				case 'e': unodue = "cinque"; break;
				case 'f': unodue = "sei"; break;
				case 'g': unodue = "sette"; break;
				case 'h': unodue = "otto"; break;
				case 'i': unodue = "nove"; break;
				default:  unodue = "uno"; break;
				}
				
				


				var testoPercorso = null;
				
				if (source == "netnet"){
					if (language == "ita"){
				switch (order) {
				case 'a': testoPercorso = "Canale => Linea => Categoria => Marchio => Area manager => Agente => Tipo Cliente"; break;
				case 'b': testoPercorso = "Area manager => Agente => Canale => Linea => Categoria => Marchio => Prodotto"; break;
				case 'c': testoPercorso = "Canale => Cliente => Linea => Marchio => Categoria => Codice Articolo"; break;
				case 'd': testoPercorso = "Categoria => Linea => Marchio => Gruppo => Prodotto => Agente"; break;
				default: testoPercorso = "Canale => Linea => Categoria => Marchio => Area manager => Agente => Tipo Cliente"; break;
				}
				}

				else
				switch (order) {
				case 'a': testoPercorso = "Channel => Line => Category => Brand => Area manager => Sales Rep => Customer Type"; break;
				case 'b': testoPercorso = "Area manager => Sales Rep => Channel => Line => Category => Brand => Product description"; break;
				case 'c': testoPercorso = "Channel => Customer => Line => Brand => Category => Product code"; break;
				case 'd': testoPercorso = "Category => Line => Brand => Group => Product => Agent"; break;				
				default: testoPercorso = "Channel => Line => Category => Brand => Area manager => Sales Rep => Customer Type"; break;
				}
				}
				else if (source == "netto"){
					if (language == "ita"){
				switch (order) {
				case 'a': testoPercorso = "Canale => Linea => Categoria => Marchio => Area manager => Agente => Tipo Cliente"; break;
				case 'b': testoPercorso = "Area manager => Agente => Canale => Linea => Categoria => Marchio => Prodotto"; break;
				case 'c': testoPercorso = "Canale => Cliente => Linea => Marchio => Categoria => Codice Articolo"; break;
				case 'd': testoPercorso = "Categoria => Linea => Marchio => Gruppo => Prodotto => Agente"; break;
				default: testoPercorso = "Canale => Linea => Categoria => Marchio => Area manager => Agente => Tipo Cliente"; break;
				}
				}
				else
				switch (order) {
				case 'a': testoPercorso = "Channel => Line => Category => Brand => Area manager => Sales Rep => Customer Type"; break;
				case 'b': testoPercorso = "Area manager => Sales Rep => Channel => Line => Category => Brand => Product description"; break;
				case 'c': testoPercorso = "Channel => Customer => Line => Brand => Category => Product code"; break;
				case 'd': testoPercorso = "Category => Line => Brand => Group => Product => Agent"; break;				
				default: testoPercorso = "Channel => Line => Category => Brand => Area manager => Sales Rep => Customer Type"; break;
				}
				}

		


				var paroleIta = "<span style='color:#ff0000'>Rosso: decremento fatturato, </span><span style='color:#006400'>verde: incremento fatturato.</span> Questa e' una simulazione di una reportistica di vendita. I riferimenti sono di fantasia e i dati sono casuali e non coerenti. Scegli la metrica principale, la sequenza di drill-down e la metrica rappresentata dal grigiato. Il grigiato puo' mostare: (i) la variazione del fatturato rispetto al periodo precedente (ii) il margine lordo rispetto al fatturato netto o net net, (iii) lo sconto rispetto fatturato lordo. Il colore piu' scuro indica una variazione piu' grande. Clicca sulle barre per vedere ulteriori livelli di dettaglio. Per tornare indietro clicca sul titolo o sulle label in grigio in alto a sinistra. </p>"

				var paroleEng = "<span style='color:#ff0000'> Red: sales decrease, </span><span style='color:#006400'>green: salse increase.</span> This is a sales report simulation. Labels are made up and values are random and not consistent. Choose the main metric, the drill-down order and the metric represented by the greyed-out areas. The greyed-out area can represent: (i) the change of sales relative to the previous period, (ii) the gross margin relative to net or net net sales (ii) the discount relative to gross sales. Click on the bars to see further levels of detail. The darker the color, the larger the change. To go back click on the title or on the grey labels on the upper left. </p>"
				


				
				var parole = null
				switch (language) {
				case 'ita': parole = paroleIta; break;
				case 'eng': parole = paroleEng; break;
				default: testoPercorso =  paroleIta; break;
				}

				var secondLine = null
				switch (language) {
				case 'ita': secondLine = 'Totale = '+accounting.formatMoney(Math.round(totale/1000000), "", 0, ".", ",")+' milioni di EUR. '; break;
				case 'eng': secondLine = 'Total = '+accounting.formatMoney(Math.round(totale/1000000), "", 0, ".", ",")+' millions of euros. '; break;
				default: testoPercorso =  null; break;
				}

				var flags = "<img id='flagIta' src='css/flagita.png' onclick='ita()'/><img id='flagEng' src='css/flageng.png' onclick='eng()'/>"

				var database = "data/"+nomeFile+"_ipotesi_"+unodue+".csv"   
				var chartDefs = chart.append("svg:defs");	
				var pattern = chartDefs.append("svg:pattern");

				document.getElementById("flags").innerHTML = flags;
				document.getElementById("titolo").innerHTML = tema;
				document.getElementById("subtitolo").innerHTML = secondLine;
				document.getElementById("grigiato").innerHTML = testoGrigiato;
				document.getElementById("immagine").style.visibility = togliImmagine;
				document.getElementById("percorso").innerHTML = testoPercorso;
				document.getElementById("parole").innerHTML = parole;
		

				
				for (var i = 0; i < pulisciOrder; i++) {
     			var opt = document.createElement("option");
				document.getElementById("listOrder").options.remove(opt);
   				}

   				for (var i = 0; i < pulisciDatabase; i++) {
     			var opt = document.createElement("option");
				document.getElementById("listDatabase").options.remove(opt);
   				}

   				for (var i = 0; i < pulisciFormat; i++) {
     			var opt = document.createElement("option");
				document.getElementById("listFormat").options.remove(opt);
   				}


   				for (var i = 0; i < pulisciGrigiato; i++) {
     			var opt = document.createElement("option");
				document.getElementById("listGrigiato").options.remove(opt);
   				}

				
				pattern.attr("patternUnits", "userSpaceOnUse");
				pattern.attr("x", "0");				
				pattern.attr("y", "0");
				pattern.attr("width", "5");
				pattern.attr("height", "5");
				pattern.attr("id", "stripesPattern");
				var patternPath = pattern.append("svg:path");
				patternPath.attr("d", "M 0,0 0,1 1,1 1,0 0,0 z M 1,1 1,2 2,2 2,1 1,1 z M 2,2 2,3 3,3 3,2 2,2 z M 3,3 3,4 4,4 4,3 3,3 z m 1,1 0,1.0000001 1,0 L 5,4 4,4 z");
				patternPath.attr("style", "fill:#000000;fill-opacity:1;stroke:none");
				chart.attr("id", "chart");
				
				
				
						var width = 960,
						    height = 500,
						    twoPi = 2 * Math.PI,
						    progress = 0,
						    formatPercent = d3.format(".0%");

					var arc = d3.svg.arc()
						    .startAngle(0)
						    .innerRadius(180)
						    .outerRadius(240);


						var meter = chart.append("g")
						    .attr("class", "progress-meter")
						    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

						meter.append("path")
						    .attr("class", "background")
						    .attr("d", arc.endAngle(twoPi));

						var foreground = meter.append("path")
						    .attr("class", "foreground");

					var text = meter.append("text")
					    .attr("text-anchor", "middle")
						    .attr("dy", ".35em");


										
										
				
				
				
				d3.xhr(database, function(text) {  
					var lines = text.responseText.split("\n");
					for(var i in lines) {
						var line = lines[i].replace(/"/g, '');  
						if (!line) continue;   
						if (i==0) continue;  //header
						if (i==1) continue;  //total
						var params = line.split(";");   
						var entry = {     
					   		id: params[0],
							parent: params[1],
							level: params[2],
							type: params[3],
							name: params[4],
							part: params[5],
							v_total: Number(params[6]),
							v_eu: params[7],
							v_nation: params[8],
							v_proc_eu: params[9],
							v_proc_nation: params[10],	
							entries: []		    			
						}      
						entries.add(entry);            
						entryIdMap[entry.id] = entry;
						if (entry.parent) {
							entryIdMap[entry.parent].entries.push(entry);
						}   
						else {
							budget.entries.push(entry);
						}					
				  	}     
							rebuildVis(budget);
					})

					
						.on("progress", function() {
						      var i = d3.interpolate(progress, d3.event.loaded /d3.event.total);
						      d3.transition().tween("progress", function() {
						       return function(t) {
						         progress = i(t);
						         foreground.attr("d", arc.endAngle(twoPi * progress));
						         text.text(formatPercent(progress))
						         meter.transition().delay(250).duration(250).attr("transform", "scale(0)").remove();
						      	 				        };
						      	 						    });
						      						});	     
			
 
			}   
			function rebuildVis(parent) {
				historyStack.push(parent);
				rebuildBreadcrumbs();
				
				var total = 0; 
				parent.entries.forEach(function(funkcja) {    
					total += funkcja.v_total;
				});

				var totalWidth = 948;
				var minWidth = 16;	
				var reminingWidth = totalWidth - parent.entries.length * minWidth - parent.entries.length;
				var dx = 0;
				var i = 0;
				var barsDy = 300;
				
				var barGroup = chart.selectAll("rect.active")
					.data(parent.entries)
					.enter().append("svg:g")
					.attr("transform", "translate(0, " + barsDy + ")");

				
									
								
				barGroup.append("svg:rect")
					.attr("width", function(d) {
					 	var w = minWidth + Math.round(reminingWidth * d.v_total / total);						 	
						d.dx = dx;	
						d.barWidth = w;					
						dx += w + 1;
					 	return w + "px"
					})
					.attr("height", "256px")
					.attr("x", function(d) {							
						return d.dx + "px";
					})
					.attr("y", 0)
					.attr("rx", 5)
					.attr("ry", 5)						
					.attr("class", "bar active")
					.attr("fill",function(d) {
						if(d.part == "2")
						{
								var colorScaleGood = d3.scale.linear()
									          .domain([70,100])
       									 	.range(["#228B22","#98fb98"])
									               .clamp(true);	
											return colorScaleGood(d.v_proc_eu);}
						else
							{ 
								var colorScaleBad = d3.scale.linear()
						          .domain([70,100])
						        .range(["#8B0000","#ffb6c1"])
						               .clamp(true);
										return colorScaleBad(d.v_proc_eu);}
												})
					.transition().delay(100).duration(1000);
				
				dx = 0;	
				barGroup.append("svg:rect")
					.attr("width", function(d) {
					 	var w = minWidth + Math.round(reminingWidth * d.v_total / total);						 	
						d.dx = dx;						
						dx += w + 1;
					 	return w + "px"
					})
					.attr("height", function(d) { if(grigiato == null) {return (256 * (d.v_proc_eu/100)) + "px";}
												  if(grigiato == "a") {return (256 * (d.v_proc_eu/100)) + "px";} 
												  if(grigiato == "b") {return (256 * (d.v_proc_nation/100)) + "px"; }
												  if(grigiato == "c") {return (256 * (d.v_nation/100)) + "px"; }

				} )
					.attr("x", function(d) {							
						return d.dx + "px";
					})
					.attr("y", 0)
					.attr("rx", 5)
					.attr("ry", 5)						
					.attr("class", "eu")
					.style("fill-opacity", 0)
					.transition().delay(100).duration(1000)
						.style("fill-opacity", 1)
					
				barGroup.on('click', function(d, i) {
						if (d.type == "Dysponent") {
							d3.select(this.childNodes[0])
								.style("fill-opacity", 0.25)
								.transition()
									.style("fill-opacity", 1.0)
							return;
						}
						var groups = chart.selectAll("g");											
						var clicked = this;												
						var clickedGroupIndex = groups[0].indexOf(clicked);
						chart.selectAll("rect.active").transition()								
							.duration(750)
							.delay(function() { return (this == clicked.childNodes[0]) ? 50 : 0})
							.attr("x", function(d, i) { return (i <= clickedGroupIndex ? 0 : totalWidth) + "px";})
							.attr("width", function() { return (this == clicked.childNodes[0]) ? (totalWidth) + "px" : "0px"})
						chart.selectAll("rect.eu").transition()								
							.duration(750)
							.delay(function() { return (this == clicked.childNodes[1]) ? 50 : 0})
							.attr("x", function(d, i) { return (i <= clickedGroupIndex ? 0 : totalWidth) + "px";})
							.attr("width", function() { return (this == clicked.childNodes[1]) ? (totalWidth) + "px" : "0px"})
							.each("end", function(d) {
								chart.selectAll("rect.active")
									.attr("class", "bar");									
								if (this != clicked.childNodes[1]) {
									d3.select(this.parentNode).remove();
								}
								else {									
									d3.select(this.parentNode.childNodes[0]).transition()
										.style("fill-opacity", 0);
									d3.select(this.parentNode.childNodes[1]).transition()
										.style("fill-opacity", 0)
										.each("end", function() {
											d3.select(this.parentNode).remove();
										})
									rebuildVis(d);
								}															
							})
						chart.selectAll("text").transition()
							.style("fill-opacity", 0)
						chart.selectAll("line").transition()
							.style("stroke-opacity", 0)
				});
				
				//qui qui qui 
				
				
				barGroup.on('mouseover', function(d, i) {
					var selected = this;
					var groups = chart.selectAll("g");
					groups.attr("class", function() {
						if (this == selected)
						{
							if(d.part == 2)
							{
								return "insopra";
							}

							else if (d.part == 3)
							{
								return	"insotto";
							}
							else
							{
								return	"in";
							}

						}
						else
						{
							return "out";
						}	
						});
				

					var title = d3.select(selected.childNodes[2]);
				});
				












				barGroup.on('mouseout', function(d, i) {
					var groups = chart.selectAll("g");
					groups.attr("class", "");
				});
				
				var itemMarginX = 30;
				var levelHeight = 40;				
				var levelsAbove = [{y:-30, items:[]}];
				var levelsBelow = [{y:285, items:[]}];
				
				function findNextTitleSpace(startX, endX, width, above) {
					var levels = above ? levelsAbove : levelsBelow;
					var ydirection = above ? -1 : 1;
					var result = {x: 2000, y: 0};
					var minX = Math.min(startX, totalWidth - width);
					var maxX = Math.min(endX + width/2 - 5, totalWidth - width);
					var found = false;
					for(var l=0; l<levels.length; l++) {
						var level = levels[l];
						var currX = 0;					
						for(var i=0; i<level.items.length; i++) {
							var item = level.items[i];
							currX = item.x + item.width + itemMarginX;
							if (currX < minX) currX = minX;
							if (currX >= minX && currX <= maxX) {
								if (i < level.items.length - 1 && currX + width < level.items[i+1].x - itemMarginX) {
									result.x = currX;
									level.items.push({x:result.x, width:width})
									found = true;
								}
							}
						}
											
						if (!found && currX < maxX) {
							result.x = Math.max(minX, currX);
							level.items.push({x:result.x, width:width})
							found = true;
						}
						
						if (found) {
							result.y = level.y;
							break;
						}
						else {
							//add new level if we reached the last one
							if (l == levels.length - 1 && levels.length < 10) {
								levels.push({y:level.y + ydirection * levelHeight, items:[]});
							}
						}
					}
					return result;
				}
			
				var titleBelowAbove = -10;
				var titleBelowDy = 280;
				barGroup.append("svg:text") 
					.text(function(d) {return d.name.replace(" ", " ")})
					.attr("class", "label")					
					.attr("y", function(d, i) {
						var center = d.dx + d.barWidth/2;
						var above = (i % 2 == 0);
						d.linePos = [];
						d.linePos.push({x:center.x, y: above ? -2 : 257});
						var width = this.offsetWidth ? this.offsetWidth : this.getClientRects()[0].width;
						d.titlePos = findNextTitleSpace(center - d.barWidth/2, center - width/2 + 5, width, above);
						d.linePos.push({x:center.x, y: above ? d.titlePos.y + 16 : d.titlePos.y - 12});
						return d.titlePos.y;						
					})
					.attr("x", function(d, i) {
						return d.titlePos.x;
					})
					.style("fill-opacity", 0)
					.transition()
						.style("fill-opacity", 1);
				
				barGroup.append("svg:text") 
					.text(function(d) {
						return numberToAmountStr(d.v_total);
					})
					.attr("class", "number")					
					.attr("y", function(d, i) {
						return d.titlePos.y + 12;
					})
					.attr("x", function(d, i) {
						return d.titlePos.x;
					})
					.style("fill-opacity", 0)
					.transition()
						.style("fill-opacity", 1);
					
				barGroup.append("svg:line")
					.attr("x1", function(d) { return Math.floor(Math.max(d.dx, d.titlePos.x)) + 5.5; })
					.attr("x2", function(d) { return Math.floor(Math.max(d.dx, d.titlePos.x)) + 5.5; })
					.attr("y1", function(d) { return d.linePos[0].y; })
					.attr("y2", function(d) { return d.linePos[1].y; })
					.style("stroke-opacity", 0)
					.transition()
						.style("stroke-opacity", 1)			
			}
			
			window.onload = init;

