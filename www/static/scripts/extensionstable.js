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
                         [1, 'asc']
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
                             'data': 'keywords',
                             'sClass': 'dl',
                             'bSearchable': true,
                             'sDefaultContent': '',
                             'mRender': function (data, type, full) {
                                 var tmpl = '<a class="category-anchor" href="https://github.com/webgme/webgme/wiki/Publish-Extensions';
                                 if (data.indexOf('webgme-app') > -1) {
                                     tmpl += '#webgme-app">App</a>';
                                 } else if (data.indexOf('webgme-domain') > -1) {
                                     tmpl += '#webgme-domain">Domain</a>';
                                 } else if (data.indexOf('webgme-component') > -1) {
                                     tmpl += '#webgme-component">Component</a>';
                                 } else {
                                     tmpl += '#component-domain-or-app">Unclassified</a>';
                                 }

                                 return tmpl;
                             }
                         }]
                 });
            })
            .fail(function (err) {
                console.error(err);
            });
    }
});