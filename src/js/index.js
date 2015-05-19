var listItem = require('application-temp');
var baseurl = 'http://latestayapp.com/';
if (window.location.host === 'latestayapp.com') {
    baseurl = '/';
    console.log('baseurl is ' + '/');
}
var url = baseurl + 'applications/';
// var url = 'http://phptek-latestay.local/applications/';
var req = $.ajax(url);
$ul = $('ul#applications');

req.done(function (res) {
    $.each(res.data, function (index, item) {
        var id = item.id;
        item.created = $.timeago(new Date(item.created_at));
        $ul.append(listItem(item));
        $('#application-' + id).removeClass('removed');
    });
});

function approveApplication(evt) {
    var $button = $(this);
    var $parent = $(this).closest('.application');
    var id = $parent.data('id');
    $.ajax({url: url + id + '/approve', method: 'PUT'})
     .done(function (res) {
        $parent.removeClass('unprocessed');
        $parent.addClass('approved');
        $parent.find('.status').text('Approved');
        $parent.find('.actions').remove();
     });
}

function denyApplication(evt) {
    var $button = $(this);
    var $parent = $(this).closest('.application');
    var id = $parent.data('id');
    $.ajax({url: url + id + '/deny', method: 'PUT'})
     .done(function (res) {
        $parent.removeClass('unprocessed');
        $parent.addClass('denied');
        $parent.find('.status').text('Denied');
        $parent.find('.actions').remove();
     });
}

function deleteApplication(evt) {
    var $button = $(this);
    var $parent = $(this).closest('.application');
    var id = $parent.data('id');
    $.ajax({url: url + id, method: 'DELETE'})
     .done(function (res) {
        var height = $parent.height();
        $parent.addClass('removed');
        setTimeout(function () {
            $parent.remove();
        }, 500);
     });
}

function addApplication(evt) {
    $.ajax({url: baseurl + 'addrandom'})
     .done(function (res) {
        var item = res.data;
        var id = item.id;
        item.created = $.timeago(new Date(item.created_at));
        $('ul#applications').prepend(listItem(item));
        setTimeout(function () {
            $('#application-' + id).removeClass('removed');
        }, 1);
     });
}

$('#applications').on('click', 'button.approve', approveApplication);
$('#applications').on('click', 'button.deny', denyApplication);
$('#applications').on('click', 'button.delete', deleteApplication);
$('#add').on('click', addApplication);