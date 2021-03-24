// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    document.getElementById('save').addEventListener('click', save_options2);

    chrome.storage.sync.get({
        dataX: [],
        backOffice: [],
    }, function(items) {
        tr="";
        items.dataX.forEach(function(obj) {
            tr+='<tr>\n' +
                '            <td><input type="text" class="inputLabel" value="'+obj.label.replace(/"/g, '&quot;')+'"></td>\n' +
                '            <td><input type="text" class="inputRegex" value="'+obj.regex.replace(/"/g, '&quot;')+'"></td>\n' +
                '            <td><button class="delete">X</button></td>\n' +
                '            <td><button class="drag">=</button></td>\n' +
                '        </tr>';
        });
        $("#pattern tbody").prepend(tr);
        $( "#pattern tbody" ).sortable({
            handle: 'button.drag',
            cancel: ''
        }).disableSelection();

        tr="";
        items.backOffice.forEach(function(obj) {
            tr+='<tr>\n' +
                '            <td><input type="text" class="inputEnvironment" value="'+obj.urlPattern.replace(/"/g, '&quot;')+'"></td>\n' +
                '            <td><input type="text" class="inputbackOffice" value="'+obj.backOfficeLink.replace(/"/g, '&quot;')+'"></td>\n' +
                '            <td><button class="delete">X</button></td>\n' +
                '            <td><button class="drag">=</button></td>\n' +
                '        </tr>';
        });
        $("#backOffice tbody").prepend(tr);
        $("#backOffice tbody" ).sortable({
            handle: 'button.drag',
            cancel: ''
        }).disableSelection();
    });
}

// Saves options to chrome.storage
function save_options2() {
    var data = [];
    var databackOffice = [];
    $( "#pattern tbody > tr" ).each(function() {
        var label = $(this).find(".inputLabel").val();
        var regex = $(this).find(".inputRegex").val();
        if(label && regex) {
            data.push({label: label, regex: regex});
        }
    });
    $( "#backOffice tbody > tr" ).each(function() {
        var label = $(this).find(".inputbackOffice").val();
        var regex = $(this).find(".inputEnvironment").val();
        if(label && regex) {
            databackOffice.push({backOfficeLink: label, urlPattern: regex});
        }
    });
    chrome.storage.sync.set({
        dataX: data,
        backOffice: databackOffice
    }, function() {
        $('#pattern tbody').html('<tr>\n' +
            '            <td><input type="text" class="inputLabel"></td>\n' +
            '            <td><input type="text" class="inputRegex"></td>\n' +
            '            <td></td>\n' +
            '            <td></td>\n' +
            '        </tr>');
        $('#backOffice tbody').html('<tr>\n' +
            '            <td><input type="text" class="inputEnvironment"></td>\n' +
            '            <td><input type="text" class="inputbackOffice"></td>\n' +
            '            <td></td>\n' +
            '            <td></td>\n' +
            '        </tr>');
        restore_options();
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

document.addEventListener('DOMContentLoaded', restore_options);

$(document)
    .on("click", ".delete", function(){
        $(this).closest("tr").remove();
    });