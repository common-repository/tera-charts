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

    if (ie < 9) { 
          alert("This website needs a modern browser/questo sito richiede un browser moderno.  Install/installare Google Chrome, Mozilla Firefox, Apple Safari, Internet Explorer 10.");
          }





        var language = "eng";
        function ita() {
          language = "ita";
          init();}
          function eng() {
          language = "eng";
          init();}


        
