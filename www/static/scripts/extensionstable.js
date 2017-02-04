/*globals*/
/**
 * @author pmeijer / https://github.com/pmeijer
 */

$(function () {
    var populated = false;

    window.GMEExtensions = {
        populateTable: populateTable
    };

    function populateTable() {
        if (populated) {
            return;
        }

        populated = true;
        $.getJSON('/extensions.json')
            .then(function (data) {
               console.log(data);
                 $('#extension-table').DataTable({
                     data: data,
                     'bAutoWidth': false,
                     'bLengthChange': false,
                     'aaSorting': [
                         [0, 'desc']
                     ],
                     'columns': [{
                         'data': 'name',
                         'bSearchable': true,
                         'sDefaultContent': '',
                         'mRender': function (data, type, full) {
                             var name = (data.indexOf('webgme-') === 0) ? data.substring('webgme-'.length) : data,
                                 author = (full.author && full.author.length > 0) ? ('by ' + full.author) : '',
                                 tmpl = '';

                             tmpl += '<a class="list-anchor" href="https://www.npmjs.com/package/' + data + '">';
                             tmpl += '<span class="name-description">';
                             tmpl += '<span class="title">' + name + '</span>';
                             tmpl += '<span class="author">' + author + '</span>';
                             tmpl += '<span class="desc">' + full.description + '</span>';
                             tmpl += '</span>';
                             tmpl += '</a>';

                             return tmpl;
                         }
                     },
                         {
                             'data': 'modified',
                             'sClass': 'dl',
                             'sType': 'numeric',
                             'bSearchable': false,
                             'sDefaultContent': '',
                             'asSorting': [ 'desc' ]
                         }]
                 });
            })
            .fail(function (err) {
                console.error(err);
            });
    }
});