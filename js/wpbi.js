function chartSelectionValidate()
{
    'use strict';
    if(document.getElementById('charttype').selectedIndex === 0)
    {
        alert("Please select a chart type");
        return false;
    }
    return true;
}

function fileExtensionValidate(filename)
{
    'use strict';
    var extension = filename.split('.').pop().toLowerCase();

    if(extension.indexOf('.xls') === -1)
    {
        alert("Only xls or xlsx files are supported!");
        return false;
    }
    return true;
}

jQuery(document).ready(function(){
    'use strict';

    // Initialize the chart title:
    jQuery('#charttype').change(function () {
        /*var title = $('#charttitle');
         title.text($('#charttype option:selected').text());*/
        var exampletext = jQuery('#chartexample');
        var filename = jQuery('#charttype option:selected').val();

        exampletext.empty();

        if(jQuery('#charttype option:selected').text() !== "Select your chart type")
        {
            exampletext.append('<h4>' + jQuery('#charttype option:selected').text() +
                ' example file</h4><p>This is an example file for the selected chart type: <a href="/wp-content/plugins/tera-charts/charts/files/examples/' + filename + '.xlsx">' + filename + '.xlsx</p>');
        }

    });

});