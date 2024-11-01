
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
			var budget = { name: "Totale", entries:[] }; 
 			var chart;  
			var w = 950;
			var h = 600;
			var caso = Math.floor((Math.random()*6)+1)   
			var format = null
			var source = null
			var dysponenci = [];
			
			var historyStack = [];
			
			function rebuildBreadcrumbs() {
				var breadcrumbs = d3.select("#breadcrumbschart");    
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
				case 1: source = 'progetti coesione'; break;
				case 2: source = 'progetti ponrec'; break;
				case 3: source = 'spese firenze'; break;
				case 4: source = 'PA allargata'; break;
				case 5: source = 'bilancio stato'; break;
				case 6: source = 'spese rimini'; break;
				default: null; break;
				}
				}
				
				caso = null;

				var totale = null;
				switch (source) {
				case 'progetti coesione': totale = 18696623450; break;
				case 'progetti ponrec': totale = 2611145879; break;
				case 'spese firenze': totale = 137951231; break;
				case 'bilancio stato': totale = 3896751517660; break;
				case 'PA allargata': totale = 5064604000280; break;
				case 'spese rimini': totale = 264338877; break;
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
		    	alert("Questo sito richiede un web browser moderno.  Installare Google Chrome, Mozilla Firefox, Apple Safari, Internet Explorer versione 9 o superiore.");
	    		}
				d3.select("#chartContainer svg").remove();
				budget.entries.length = 0;
				dysponenci.length = 0;
				historyStack.length = 0; 
				chart = d3.select("#chartContainer").append("svg:svg");
				
				var pulisciOrder = document.getElementById("listOrder").options.length
				var pulisciDatabase = document.getElementById("listDatabase").options.length
				var pulisciFormat = document.getElementById("listFormat").options.length

   				var menuDatabaseIta = "Database,progetti Coesione,progetti Ponrec,PA allargata,bilancio dello Stato,spese Rimini,spese Firenze";
				var menuDatabaseEng = "Database,Cohesion projects,Ponrec projects,Enlarged PA,State expenses,Rimini expenses,Florence expenses";
				var menuDatabaseVal = "Database,progetti coesione,progetti ponrec,PA allargata,bilancio stato,spese rimini,spese firenze";
				

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
				case 1: source = 'progetti coesione'; break;
				case 2: source = 'progetti ponrec'; break;
				case 3: source = 'spese firenze'; break;
				case 4: source = 'PA allargata'; break;
				case 5: source = 'bilancio stato'; break;
				case 6: source = 'spese rimini'; break;
				default: null; break;
				}
				} 
				else if(sceltaDB == "Database" && caso == null)
				{} 
				else 
				{source = sceltaDB;}

				
				var totale = null;
				switch (source) {
				case 'progetti coesione': totale = 20734541482; break;
				case 'progetti ponrec': totale = 2611145879; break;
				case 'spese firenze': totale = 137951231; break;
				case 'bilancio stato': totale = 3896751517660; break;
				case 'PA allargata': totale = 5064604000280; break;
				case 'spese rimini': totale = 264338877; break;
				default:  null; break;
				}
				var tema = null;
				if (language == "ita"){
				switch (source) {
				case 'progetti coesione': tema = "Pagamenti progetti Politiche di Coesione"; break;
				case 'progetti ponrec': tema = "Pagamenti progetti PON R&C"; break;
				case 'bilancio stato': tema = "Spese Amministrazioni Centrali Stato 2008-2012"; break;
				case 'PA allargata': tema = "Spese settore pubblico allargato 2006-2010"; break;
				case 'spese firenze': tema = "Fatture Comune di Firenze II semestre 2012"; break;
				case 'spese rimini': tema = "Spese Comune di Rimini 2011-2012"; break;
				default:  null; break;
				}
				}
				else {
				switch (source) {
				case 'progetti coesione': tema = "Payments, Cohesion Policy Projects"; break;
				case 'progetti ponrec': tema = "Payments, PON R&C Projects"; break;
				case 'bilancio stato': tema = "2008-2012 Expenses, Central State Administration"; break;
				case 'PA allargata': tema = "2006-2010 Expenses, Enlarged Public Sector"; break;
				case 'spese firenze': tema = "2nd Semester 2012 Invoices, City of Florence"; break;
				case 'spese rimini': tema = "2011-2012 Expenses, City of Rimini"; break;
				default:  null; break;
				}
				}

				var nomeFile = null;
				switch (source) {
				case 'progetti coesione': nomeFile = "coesione"; break;
				case 'progetti ponrec': nomeFile = "pon"; break;
				case 'bilancio stato': nomeFile = "rgs"; break;
				case 'PA allargata': nomeFile = "pa"; break;
				case 'spese firenze': nomeFile = "firenze"; break;
				case 'spese rimini': nomeFile = "rimini"; break;
				default:  null; break;
				}
				var testoSpiega = null;
				if (language == "ita"){
				switch (source) {
				case 'progetti coesione': testoSpiega = "<img src='http://www.wpbusinessintelligence.com/css/charts/stripes.png' align=middle'/> - contributo UE (stima)"; break;
				case 'progetti ponrec': testoSpiega = ""; break;
				case 'spese firenze': testoSpiega = ""; break;
				case 'spese rimini': testoSpiega = "Spesa vs anno precedente: <span style='color:#0000ff'>Blu - incremento,</span><span style='color:#00ff00'> Verde - decremento,</span><span style='color:#ff0000'> Rosso - invariata/non disponibile.</span> Entita' variazione = area non grigiata su totale"; break;
				case 'PA allargata': testoSpiega = "Spesa vs anno precedente: <span style='color:#0000ff'>Blu - incremento,</span><span style='color:#00ff00'> Verde - decremento,</span><span style='color:#ff0000'> Rosso - invariata/non disponibile.</span> Entita' variazione = area non grigiata su totale"; break;
				case 'bilancio stato': testoSpiega = "Spesa vs anno precedente: <span style='color:#0000ff'>Blu - incremento,</span><span style='color:#00ff00'> Verde - decremento,</span><span style='color:#ff0000'> Rosso - invariata/non disponibile.</span> Entita' variazione = area non grigiata su totale"; break;
				default:  null; break;
				}
				}
				else{
					switch (source) {
				case 'progetti coesione': testoSpiega = "<img src='http://www.wpbusinessintelligence.com/css/charts/stripes.png' align=middle'/> - EU contribution (estimate)"; break;
				case 'progetti ponrec': testoSpiega = ""; break;
				case 'spese firenze': testoSpiega = ""; break;
				case 'spese rimini': testoSpiega = "Expense vs previous year: <span style='color:#0000ff'>Blue - increase,</span><span style='color:#00ff00'> Green - decrease,</span><span style='color:#ff0000'> Red - no change/not available.</span> Change size = non greyed area on total area"; break;
				case 'PA allargata': testoSpiega = "Expense vs previous year: <span style='color:#0000ff'>Blue - increase,</span><span style='color:#00ff00'> Green - decrease,</span><span style='color:#ff0000'> Red - no change/not available.</span> Change size = non greyed area on total area"; break;
				case 'bilancio stato': testoSpiega = "Expense vs previous year: <span style='color:#0000ff'>Blue - increase,</span><span style='color:#00ff00'> Green - decrease,</span><span style='color:#ff0000'> Red - no change/not available.</span> Change size = non greyed area on total area"; break;
				default:  null; break;
				}
				}


				var togliImmagine = null;
				switch (source) {
				case 'progetti coesione': togliImmagine = "visible"; break;
				case 'progetti ponrec': togliImmagine = "hidden"; break;
				case 'spese firenze': togliImmagine = "hidden"; break;
				case 'spese rimini': togliImmagine = "hidden"; break;
				case 'bilancio stato': togliImmagine = "hidden"; break;
				case 'PA allargata': togliImmagine = "hidden"; break;
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
				case 'progetti coesione': provaMenu = provaMenu3; break;
				case 'progetti ponrec':provaMenu = provaMenu3; break;
				case 'bilancio stato': provaMenu = provaMenu4; break;
				case 'spese firenze': provaMenu = provaMenu1; break;
				case 'spese rimini': provaMenu = provaMenu1; break;
				case 'PA allargata': provaMenu = provaMenu3; break;
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
				case "Drill-down order": unodue = "uno"; break;
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
				if (source == "bilancio stato") {
						if (language == "ita"){
				switch (order) {
				case 'a': testoPercorso = "Anno => Missione => Programma => Categoria => Amministrazione => Titolo"; break;
				case 'b': testoPercorso = "Anno => Amministrazione => Programma => Categoria => Missione  => Titolo"; break;
				case 'c': testoPercorso = "Anno => Titolo => Missione => Programma => Categoria => Amministrazione"; break;
				case 'd': testoPercorso = "Anno => Titolo => Amministrazione => Missione => Programma => Categoria "; break;
				default: testoPercorso = "Anno => Missione => Programma => Categoria => Amministrazione => Titolo"; break;
				}
				}

				else
				switch (order) {
				case 'a': testoPercorso = "Year => Mission => Program => Category => Administration => Title"; break;
				case 'b': testoPercorso = "Year => Administration => Program => Category => Mission  => Title"; break;
				case 'c': testoPercorso = "Year => Title => Mission => Program => Category => Administration"; break;
				case 'd': testoPercorso = "Year => Title => AAdministration => Mission => Program => Category "; break;
				default: testoPercorso = "Year => Mission => Program => Category => Administration => Title"; break;
				}
				}				
				else if (source == "progetti coesione"){
					if (language == "ita"){
				switch (order) {
				case 'a': testoPercorso = "Tema => Settore => Sottosettore => Categoria => Programma => Tipologia => Ateco"; break;
				case 'b': testoPercorso = "Natura =>Tema => Settore => Sottosettore =>  Categoria => Programma => Tipologia"; break;
				case 'c': testoPercorso = "Settore => Sottosettore => Tema => Categoria => Programma => Tipologia => Natura"; break;
				default: testoPercorso = "Tema => Settore => Sottosettore => Categoria => Programma => Tipologia => Ateco"; break;
				}
				}

				else
				switch (order) {
				case 'a': testoPercorso = "Topic => Sector => Subsector => Category => Program => Type => Ateco code"; break;
				case 'b': testoPercorso = "Nature => Topic => Sector => Subsector =>  Category => Program => Type"; break;
				case 'c': testoPercorso = "Sector => Subsector => Topic => Category => Program => Type => Nature"; break;
				default: testoPercorso = "Topic => Sector => Subsector => Category => Program => Type => Ateco code"; break;
				}
				}
				else if (source == "progetti ponrec"){
					if (language == "ita"){
				switch (order) {
				case 'a': testoPercorso = "Ambito => Azione => Obiettivo => Bando => Organismo Responsabile => Beneficiario => Progetto"; break;
				case 'b': testoPercorso = "Azione => Obiettivo => Ambito => Organismo Responsabile => Natura => Beneficiario => Progetto"; break;
				case 'c': testoPercorso = "Bando => Azione => Ambito => Obiettivo => Organismo Responsabile => Beneficiario => Progetto"; break;
				default: testoPercorso = "Bando => Azione => Ambito => Obiettivo => Organismo Responsabile => Beneficiario => Progetto"; break;
				}
				}
				else
				switch (order) {
				case 'a': testoPercorso = "Scope => Action => Objective => Tender => Responsible organization => Beneficiary => Project"; break;
				case 'b': testoPercorso = "Action => Objective => Scope => Responsible organization => Nature => Beneficiary => Project"; break;
				case 'c': testoPercorso = "Tender => Action => Scope => Objective => Responsible organization => Beneficiary => Project"; break;
				default: testoPercorso = "Tender => Action => Scope => Objective => Responsible organization => Beneficiary => Project"; break;
				}
				}
				else if (source == "spese firenze"){
				if (language == "ita"){
				switch (order) {
				case 'a': testoPercorso = "Tipo struttura => Nome struttura => Atto di impegno => Fornitore"; break;
				default: testoPercorso = "Tipo struttura => Nome struttura => Atto di impegno => Fornitore"; break;
				}
				}
				 else
				switch (order) {
				case 'a': testoPercorso = "Structure type => Structure name => Act of commitment => Supplier"; break;
				default: testoPercorso = "Structure type => Structure name => Act of commitment => Supplier"; break;
				}
				}
				
				else if (source == "PA allargata"){
				if (language == "ita"){
				switch (order) {
				case 'a': testoPercorso = "Anno => Settore => Soggetti => Area geografica => Regione => Area di spesa => Tipo Spesa"; break;
				case 'b': testoPercorso = "Anno => Area geografica => Regione => Soggetti => Settore => Area di spesa => Tipo Spesa"; break;
				case 'c': testoPercorso = "Anno => Area di spesa => Area geografica => Regione => Soggetti => Settore => Tipo Spesa"; break;
				default: testoPercorso = "Anno => Settore => Soggetti => Area geografica => Regione => Area di spesa => Tipo Spesa"; break;
				}
				} else
				switch (order) {
				case 'a': testoPercorso = "Year => Sector => Party => Geographic Area => Region => Expense area => Expense type"; break;
				case 'b': testoPercorso = "Year => Geographic Area => Region => Party => Sector => Expense area => Expense type"; break;
				case 'c': testoPercorso = "Year => Expense area => Geographic Area => Region => Party => Sector => Expense type"; break;
				default: testoPercorso = "Year => Sector => Party => Geographic Area => Region => Expense area => Expense type"; break;
				}
				}

		
				else if (source == "spese rimini"){
					if (language == "ita"){
				switch (order) {
				case 'a': testoPercorso = "Anno => Direzione => Settore => Descrizione"; break;
				default: testoPercorso =  "Anno => Direzione => Settore => Descrizione"; break;
				}
				} else
				switch (order) {
				case 'a': testoPercorso = "Year => Division => Sector => Description"; break;
				default: testoPercorso =  "Year => Division => Sector => Description"; break;
				}
				}
				var paroleIta = "<p><br><br>Scegli la base dati e la sequenza di drill-down, l'ordine con il quale vuoi esplorare il database. Clicca sulle barre per vedere ulteriori livelli di dettaglio. Il valore percentuale e' rapportato al totale complessivo. Per tornare indietro clicca sul titolo o sulle label in grigio in alto a sinistra.</p><p> <span>Questa visualizzazione e' stata preparata modificando del codice scritto da <a href='http://marcinignac.com'>Marcina Ignaca</a>. La versione originale e il relativo codice si trovano <a href='http://marcinignac.com/projects/open-budget/viz/index.html'>qui. </a>Clicca <a id='datadownload'> qui</a> per scaricare il file csv relativo al DB ed alla sequenza di drill down selezionata.</span><p> La visualizzazione utilizza sei basi dati: (i) il db dei pagamenti dei progetti 2007-2013 del <a href='http://www.opencoesione.gov.it/''> Ministero per la Coesione</a>, (ii) il db dei pagamenti progetti 2007-2013 del <a href='http://www.ponrec.it/''> Programma Operativo Nazionale Ricerca e Competitivita', </a> (iv) il db della Spesa 2008-2012 delle<a href='http://www.rgs.mef.gov.it/VERSIONE-I/Servizio-s/Studi-e-do/La-spesa-d/'> Amministrazioni Centrali dello Stato </a>, (iv) il db delle spese del secondo semestre 2012 del <a href='http://opendata.comune.fi.it/amministrazione/dataset_0270.html'>comune di Firenze </a>, (v) il db delle spese 2006-2010 del <a href='http://www.dati.gov.it/content/dps-conti-pubblici-territoriali-spese-del-settore-pubblico-allargato'>settore pubblico allargato </a>, (vi) il db delle spese 2011-2012 del <a href='https://commondatastorage.googleapis.com/ckannet-storage/2012-06-22T034044/spese-correnti-2012.csv'>Bilancio di Previsione del comune di Rimini</a>. L'indicazione dell'incremento o decremento della spesa rispetto all'anno precedente si riferisce alle spese codificate in modo identico in periodi diversi. Poiche' spese identiche vengono a volte codificate in modo diverso in esercizi diversi, l'indicazione puo' essere imprecisa o errata. </p><p>DISCLAIMER: Il materiale in questo sito viene reso disponibile come servizio al pubblico. I dati vanno utilizzati solo a scopo di referenza. Nonostante il fatto che le informazioni sono ritenute accurate, dati,  analisi e visualizzazioni sono resi disponibili sul sito 'AS IS' senza alcuna garanzia di alcun tipo, implicita o espressa, sulla loro accuratezza. Con la conoscenza di quanto sopra, ogni visitatore del sito fornisce il proprio accordo e assenso incondizionato a rinunciare, esentare, liberare e dispensare i promotori di questo sito, e tutti loro agenti, consulenti e associati, da ogni e qualunque rivendicazione, pretesa e/o richiesta di azioni per danni e/o pregiudizi a persone e/o a cose legati al loro utilizzo e/o alla loro impossibilita' di utilizzo dei dati. In caso di errori, si prega di inviare una mail a <a href='mailto:wpbi.support@wpbusinessintelligence.com'>wpbi.support@wpbusinessintelligence.com</a> con una dettagliata descrizione del problema.</p>"

				var paroleEng = "<p><br><br>Choose the data-base and the drill down order. Click on the bars to see further levels of detail. The percent value is relative to the grand total. To go back click on the title or on the grey label on the upper left.</p><p> <span>Tis visualization was preparared modifying some code written by <a href='http://marcinignac.com'>Marcina Ignaca</a>. The original version and its code can be found <a href='http://marcinignac.com/projects/open-budget/viz/index.html'>here. </a>Click <a id='datadownload'>here</a> to download the cvs file of the selected database and drill down sequence.</span><p> The visualization uses six databases: (i) the db of the 2007-2013 payments on the projects of the Italian <a href='http://www.opencoesione.gov.it/''> Ministero per la Coesione</a>, (ii) the db of the 2007-2013 payments on the projects for the <a href='http://www.ponrec.it/''> Programma Operativo Nazionale Ricerca e Competitivita' program, </a> (iv) the db of the 2008-2012 expenses of the <a href='http://www.rgs.mef.gov.it/VERSIONE-I/Servizio-s/Studi-e-do/La-spesa-d/'> Italian Central Public Administrations</a>, (iv) the db of the second semester 2012 expenses of the <a href='http://opendata.comune.fi.it/amministrazione/dataset_0270.html'>city of Florence</a>, (v) the db of the 2006-2010 expenses of <a href='http://www.dati.gov.it/content/dps-conti-pubblici-territoriali-spese-del-settore-pubblico-allargato'> the Italian enlarged public sector </a>, (vi) the db of the 2011-2012 expenses of the <a href='https://commondatastorage.googleapis.com/ckannet-storage/2012-06-22T034044/spese-correnti-2012.csv'>city of Rimini</a>. The indication of the increase or decrease of expenses relative to the previous year assumes that identical expenses are codified in exactly the same way in different periods. Since identical expenses not always codified in the same exact way across time, this indication might be inaccurate or misleading. The database are in Italian and the data labels have not been translated.</p><p>DISCLAIMER: The material on this site is made available as a public service. The data is to be used for reference purposes only. Although the data is believed to be accurate, data and visualizations are provided AS IS without warranty of any kind, implied or expressed, as to the information being accurate or complete. With knowledge of the foregoing, each visitor to this website agrees to waive, release, and indemnify the promotors of this website, along with their agents, consultants, contractors and employees, from any and all claims, actions, or causes of action for damages or injury to persons or property arising from his/her use or inability to use this data. If you encounter an error, please email <a href='mailto:wpbi.support@wpbusinessintelligence.com'>wpbi.support@wpbusinessintelligence.com</a> and describe the problem in detail."
				


				
				var parole = null
				switch (language) {
				case 'ita': parole = paroleIta; break;
				case 'eng': parole = paroleEng; break;
				default: testoPercorso =  paroleIta; break;
				}

				var secondLine = null
				switch (language) {
				case 'ita': secondLine = 'Totale = '+accounting.formatMoney(Math.round(totale/1000000), "", 0, ".", ",")+' milioni di EUR'; break;
				case 'eng': secondLine = 'Total = '+accounting.formatMoney(Math.round(totale/1000000), "", 0, ".", ",")+' Million Euros'; break;
				default: testoPercorso =  null; break;
				}

				var flags = "<img id='flagIta' src='http://www.wpbusinessintelligence.com/css/charts/flagita.png' onclick='ita()'/><img id='flagEng' src='http://www.wpbusinessintelligence.com/css/charts/flageng.png' onclick='eng()'/>"

				var database = "/wp-content/uploads/data/"+nomeFile+"_ipotesi_"+unodue+".csv"   
				var chartDefs = chart.append("svg:defs");	
				var pattern = chartDefs.append("svg:pattern");

				document.getElementById("flags").innerHTML = flags;
				document.getElementById("titolo").innerHTML = tema;
				document.getElementById("subtitolo").innerHTML = secondLine;
				document.getElementById("spiega").innerHTML = testoSpiega;
				document.getElementById("immagine").style.visibility = togliImmagine;
				document.getElementById("percorso").innerHTML = testoPercorso;
				document.getElementById("parole").innerHTML = parole;
				document.getElementById("datadownload").href="http://www.logeeka.com/opendata/"+database;

				
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
							v_proce_nation: params[10],	
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
						var colorScale = d3.scale.ordinal()
									.domain(["","1","2","3","4"])
									.range(["#ff0000","#ff0000","#0000ff","#00ff00","#ff0000"]);
									return colorScale(d.part)
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
					.attr("height", function(d) { return (256 * (1.0 - d.v_proce_nation/100)) + "px"; } )
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
			
			 	
  		
		