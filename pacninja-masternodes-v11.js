/*
 This file is part of Pac Ninja.
 https://github.com/akshaynexus/pacninja-fe

 Pac Ninja is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Pac Ninja is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Pac Ninja.  If not, see <http://www.gnu.org/licenses/>.

 */

// Pac Ninja Front-End (pacninja-fe) - Masternode List (v2)
// By elberethzone / https://dashtalk.org/members/elbereth.175/

var pacninjaversion = '2.1.7';
var tableLocalNodes = null;
var tableBlockConsensus = null;
var tableMNList = null;
var chartMNVersions = null;
var dashversiondefault = "0.11.2.22";
var dashversion = dashversiondefault;
var dashversionsemaphore = false;

$.fn.dataTable.ext.errMode = 'throw';

if (typeof(Storage) !== "undefined") {
    if (sessionStorage.getItem("nextdashversion") !== null) {
        sessionStorage.removeItem("nextdashversion");
    }
}

if (typeof pacninjatestnet === 'undefined') {
    var pacninjatestnet = 0;
}
if (typeof pacninjatestnethost !== 'undefined') {
    if (window.location.hostname == pacninjatestnethost) {
        pacninjatestnet = 1;
    }
}

if (typeof pacninjamndetail === 'undefined') {
    var pacninjamndetail = [
        [],
        []
    ];
}
if (typeof pacninjamndetail[0] === 'undefined') {
    pacninjamndetail[0] = [];
}
if (typeof pacninjamndetail[1] === 'undefined') {
    pacninjamndetail[1] = [];
}

if (typeof pacninjaaddressexplorer === 'undefined') {
    var pacninjaaddressexplorer = [
        [],
        []
    ];
}
if (typeof pacninjaaddressexplorer[0] === 'undefined') {
    pacninjaaddressexplorer[0] = [];
}
if (typeof pacninjaaddressexplorer[1] === 'undefined') {
    pacninjaaddressexplorer[1] = [];
}

if (typeof pacninjaqueryexplorer === 'undefined') {
    var pacninjaqueryexplorer = [
        [],
        []
    ];
}
if (typeof pacninjaqueryexplorer[0] === 'undefined') {
    pacninjaqueryexplorer[0] = [];
}
if (typeof pacninjaqueryexplorer[1] === 'undefined') {
    pacninjaqueryexplorer[1] = [];
}

function tableLocalNodesRefresh() {
    tableLocalNodes.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableLocalNodesRefresh, 60000);
};

function tableBlockConsensusRefresh() {
    tableBlockConsensus.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableLocalNodesRefresh, 150000);
};

function tableMNListRefresh() {
    tableMNList.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableMNListRefresh, 300000);
};

function mnpaymentsRefresh() {
    $.getJSON("/api/masternodes/stats?testnet=" + pacninjatestnet, function(data) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#mnpaymentsLR').text(n + ' ' + time);
        $('#mnpayments').text(Math.round(data.data.MasternodeStatsTotal.MasternodeExpectedPayment * 10000) / 10000);
        $('#mnpaymentsratio').text((Math.round(data.data.MasternodeStatsTotal.RatioPayed * 10000) / 100) + '%');
        setTimeout(mnpaymentsRefresh, 300000);
    });
};

function displaydashVersion(dashversion) {
    if (dashversion != "?") {
        $('#msgalert').show();
    } else {
        $('#msgalert').hide();
    }
    $('#currentdashversion').text(dashversion);
}

function getLatestdashVersion() {
    var currentdate = new Date();
    dashversion = sessionStorage.getItem("currentdashversion");
    var nextdate = sessionStorage.getItem("nextdashversion");
    if (((dashversion === null) ||
            (sessionStorage.getItem("nextdashversion") === null) ||
            (sessionStorage.getItem("nextdashversion") < currentdate.getTime())) && (dashversionsemaphore == false)) {
        dashversionsemaphore = true;
        $.getJSON("/pacninja-latestversion.json", function(data) {
            sessionStorage.setItem('currentdashversion', data.version.string);
            var currentdate = new Date();
            currentdate = new Date(currentdate.getTime() + 15 * 60000);
            sessionStorage.setItem('nextdashversion', currentdate.getTime());
            dashversionsemaphore = false;
            displaydashVersion(data.version.string);
        });
        dashversion = dashversiondefault;
    } else {
        if (dashversion === null) {
            dashversion = dashversiondefault;
        }
        displaydashVersion(dashversion);
    }
    return dashversion;
};

$(document).ready(function() {

    $('#pacninjajsversion').text(pacninjaversion);

    if (pacninjatestnet == 1) {
        $('#testnetalert').show();
    }

    getLatestdashVersion();

    var pkutxt = '<ul>';
    var ix = 0;
    for (var i = 0, ien = pacninjamndetail[pacninjatestnet].length; i < ien; i++) {
        if (ix == 0) {
            pkutxt += '<li>[Link]';
        } else {
            pkutxt += '<li>[' + ix + ']';
        }
        pkutxt += ' ' + pacninjamndetail[pacninjatestnet][i][1] + "</li>";
        ix++;
    }
    for (var i = 0, ien = pacninjaaddressexplorer[pacninjatestnet].length; i < ien; i++) {
        if (ix == 0) {
            pkutxt += '<li>[Link]';
        } else {
            pkutxt += '<li>[' + ix + ']';
        }
        pkutxt += ' ' + pacninjaaddressexplorer[pacninjatestnet][i][1] + "</li>";
        ix++;
    }
    pkutxt += '</ul>';
    $("#pubkeyurllist").html(pkutxt);

    $('#localnodes').on('xhr.dt', function(e, settings, json) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#localnodesLR').text(n + ' ' + time);
        $('#localnodes').DataTable().column(1).search('^(?:(?!Disabled).)*$', true, false).draw();
    });
    tableLocalNodes = $('#localnodes').dataTable({
        dom: "Tfrtp",
        ajax: "/api/nodes?testnet=" + pacninjatestnet,
        "paging": false,
        columns: [
            { data: "NodeName" },
            {
                data: null,
                render: function(data, type, row) {
                    if (data.NodeEnabled == 0) {
                        return '<img src="/static/status/daemon-disabled.png" width=16 height=16 /> Disabled';
                    } else {
                        var iconurl = '<img src="/static/status/daemon-' + data.NodeProcessStatus + '.png" width=16 height=16 /> ';
                        if (data.NodeProcessStatus == 'running') {
                            return iconurl + 'Running';
                        } else if (data.NodeProcessStatus == 'stopped') {
                            return iconurl + 'Stopped';
                        } else if (data.NodeProcessStatus == 'notresponding') {
                            return iconurl + 'Not Responding';
                        } else {
                            return data.NodeProcessStatus;
                        }
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                        outtxt = data.NodeVersion;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                        outtxt = data.NodeProtocol;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                        outtxt = data.NodeBlocks;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                        if (type != 'sort') {
                            if (pacninjablockexplorer[pacninjatestnet].length > 0) {
                                outtxt += '<a href="' + pacninjablockexplorer[pacninjatestnet][0][0].replace('%%b%%', data.NodeLastBlockHash) + '">' + data.NodeLastBlockHash + '</a>';
                                for (var i = 1, ien = pacninjablockexplorer[pacninjatestnet].length; i < ien; i++) {
                                    outtxt += '<a href="' + pacninjablockexplorer[pacninjatestnet][i][0].replace('%%b%%', data.NodeLastBlockHash) + '">[' + i + ']</a>';
                                }
                            }
                        } else {
                            outtxt = data.NodeLastBlockHash;
                        }
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                        outtxt = data.NodeConnections;
                    }
                    return outtxt;
                }
            }
        ]
    });
    setTimeout(tableLocalNodesRefresh, 60000);

    $('#blockconsensus').on('xhr.dt', function(e, settings, json) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#blockconsensusLR').text(n + ' ' + time);
    });
    tableBlockConsensus = $('#blockconsensus').dataTable({
        dom: "Trtp",
        ajax: "/api/blocks/consensus?testnet=" + pacninjatestnet,
        "paging": false,
        "order": [
            [0, "desc"]
        ],
        columns: [
            { data: "BlockID" },
            {
                data: null,
                render: function(data, type, row) {
                    return (Math.round(data.Consensus * 10000) / 100) + '%';
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (data.ConsensusPubKey == '') {
                        return "<i>None</i>";
                    } else {
                        return data.ConsensusPubKey;
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var str = '<ul>';
                    var sstr = '';
                    for (var col in data.Others) {
                        str += '<li>';
                        if (data.Others[col].Payee == '') {
                            str += '<i>None</i>';
                        } else {
                            str += data.Others[col].Payee;
                        }
                        str += ' (' + (Math.round(data.Others[col].RatioVotes * 10000) / 100) + '% - Nodes: ';
                        sstr = '';
                        for (var uname in data.Others[col].NodeNames) {
                            if (sstr != '') {
                                sstr += ' ';
                            }
                            sstr += data.Others[col].NodeNames[uname];
                        }
                        str += sstr + ')</li>'
                    };
                    return str + '</ul>';
                }
            }
        ],
        "createdRow": function(row, data, index) {
            if (data.Consensus == 1) {
                $('td', row).eq(1).css({ "background-color": "#8FFF8F" });
            } else {
                $('td', row).eq(1).css({ "background-color": "#FF8F8F" });
            }
        }
    });
    setTimeout(tableBlockConsensusRefresh, 150000);

    chartMNVersions = $('#mnversions').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null, //null,
            plotShadow: false
        },
        title: {
            text: 'Masternode versions (only compatible protocols)'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Masternode version',
            data: [
                ['Unknown', 100]
            ]
        }]
    });

    $('#mnregexp').on('keyup click', function() {
        $('#mnlist').DataTable().search($('#mnregexp').val(), true, true).draw();
    });

    $('#mnregexp').val(getParameter("mnregexp"));

    $('#mnlist').on('xhr.dt', function(e, settings, json) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        var activeCount = 0;
        var uniqueIPs = [];
        $('#mnlistLR').text(n + ' ' + time);
        var versioninfo = 'Unknown';
        var dataVersionCount = [];
        var mnregexp = $('#mnregexp').val();
        for (var i = 0, ien = json.data.length; i < ien; i++) {
            if (json.data[i].ActiveCount > 0) {
                activeCount++;
            }
            if (uniqueIPs.indexOf(json.data[i].MasternodeIP + ":" + json.data[i].MasternodePort) == -1) {
                uniqueIPs.push(json.data[i].MasternodeIP + ":" + json.data[i].MasternodePort);
            }
            if ((json.data[i].Portcheck.SubVer.length > 10) && (json.data[i].Portcheck.SubVer.substring(0, 9) == '/Satoshi:') && (json.data[i].Portcheck.SubVer.substring(json.data[i].Portcheck.SubVer.length - 1) == '/')) {
                versioninfo = json.data[i].Portcheck.SubVer.substring(9, json.data[i].Portcheck.SubVer.indexOf('/', 10));
            } else if ((json.data[i].Portcheck.SubVer.length > 7) && (json.data[i].Portcheck.SubVer.substring(0, 6) == '/Core:') && (json.data[i].Portcheck.SubVer.substring(json.data[i].Portcheck.SubVer.length - 1) == '/')) {
                versioninfo = json.data[i].Portcheck.SubVer.substring(6, json.data[i].Portcheck.SubVer.indexOf('/', 6));
            } else {
                versioninfo = 'Unknown';
            }
            if (dataVersionCount.hasOwnProperty(versioninfo)) {
                dataVersionCount[versioninfo]++;
            } else {
                dataVersionCount[versioninfo] = 1;
            }
        }

        var dataSet = [];
        for (version in dataVersionCount) {
            if (dataVersionCount.hasOwnProperty(version)) {
                dataSet.push([version, Math.round((dataVersionCount[version] / json.data.length) * 10000) / 100]);
            }
        }
        chartMNVersions = $('#mnversions').highcharts();
        chartMNVersions.series[0].setData(dataSet, true);

        var inactiveCount = json.data.length - activeCount;

        $('#mnactive').text(activeCount);
        $('#mninactive').text(inactiveCount);
        $('#mntotal').text(json.data.length);
        $('#uniquemnips').text(uniqueIPs.length);

        if (mnregexp != "") {
            $('#mnlist').DataTable().search(mnregexp, true, true).draw();
        }
    });
    tableMNList = $('#mnlist').dataTable({
        ajax: "/api/masternodes?testnet=" + pacninjatestnet + "&portcheck=1&balance=1&lastpaid=1&prev12=1",
        lengthMenu: [
            [50, 100, 250, 500, -1],
            [50, 100, 250, 500, "All"]
        ],
        pageLength: 50,
        columns: [{
                data: null,
                render: function(data, type, row) {
                    return data.MasternodeIP + ':' + data.MasternodePort;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var txt = data.Portcheck.Result;
                    if ((data.Portcheck.Result == 'closed') || (data.Portcheck.Result == 'timeout')) {
                        txt = "Closed";
                    } else if (data.Portcheck.Result == 'unknown') {
                        txt = "Pending";
                    } else if ((data.Portcheck.Result == 'open') || (data.Portcheck.Result == 'rogue')) {
                        txt = "Open";
                    }
                    if (data.Portcheck.NextCheck < currenttimestamp()) {
                        if (txt != "Pending") {
                            txt = txt + ' (Re-check pending)';
                        }
                    } else {
                        txt = txt + ' (' + deltaTimeStampHR(data.Portcheck.NextCheck, currenttimestamp()) + ')';
                    }
                    return txt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var versioninfo = '<i>Unknown</i>';
                    if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0, 9) == '/Satoshi:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(9, data.Portcheck.SubVer.indexOf('/', 10));
                    } else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0, 6) == '/Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(6, data.Portcheck.SubVer.indexOf('/', 6));
                    }
                    return versioninfo;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if (type != 'sort') {
                        if ((pacninjamndetail[pacninjatestnet].length > 0) || (pacninjaaddressexplorer[pacninjatestnet].length > 0)) {
                            var ix = 0;
                            for (var i = 0, ien = pacninjamndetail[pacninjatestnet].length; i < ien; i++) {
                                if (ix == 0) {
                                    outtxt += '<a href="' + pacninjamndetail[pacninjatestnet][0][0].replace('%%a%%', data.MNPubKey) + '">' + data.MNPubKey + '</a>';
                                } else {
                                    outtxt += '<a href="' + pacninjamndetail[pacninjatestnet][i][0].replace('%%a%%', data.MNPubKey) + '">[' + ix + ']</a>';
                                }
                                ix++;
                            }
                            for (var i = 0, ien = pacninjaaddressexplorer[pacninjatestnet].length; i < ien; i++) {
                                if (ix == 0) {
                                    outtxt += '<a href="' + pacninjaaddressexplorer[pacninjatestnet][0][0].replace('%%a%%', data.MNPubKey) + '">' + data.MNPubKey + '</a>';
                                } else {
                                    outtxt += '<a href="' + pacninjaaddressexplorer[pacninjatestnet][i][0].replace('%%a%%', data.MNPubKey) + '">[' + ix + ']</a>';
                                }
                                ix++;
                            }
                        } else {
                            outtxt = data.MNPubKey;
                        }
                    } else {
                        outtxt = data.MNPubKey;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var balance = parseFloat(data.Balance.Value);
                    if (type == 'sort') {
                        return balance;
                    } else {
                        var num = Math.round(balance * 1000) / 1000;
                        return addCommas(num.toFixed(3));
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (data.LastPaid != false) {
                        if (type == 'sort') {
                            return data.LastPaid.MNLastPaidBlock;
                        } else {
                            var outtxt = '';
                            if (pacninjaqueryexplorer[pacninjatestnet].length > 0) {
                                outtxt += '<a href="' + pacninjaqueryexplorer[pacninjatestnet][0][0].replace('%%q%%', data.LastPaid.MNLastPaidBlock) + '">' + deltaTimeStampHR(data.LastPaid.MNLastPaidTime, currenttimestamp()) + '</a>';
                                for (var i = 1, ien = pacninjaqueryexplorer[pacninjatestnet].length; i < ien; i++) {
                                    outtxt += '<a href="' + pacninjaqueryexplorer[pacninjatestnet][i][0].replace('%%q%%', data.LastPaid.MNLastPaidBlock) + '">[' + i + ']</a>';
                                }
                            } else {
                                outtxt = deltaTimeStampHR(data.LastPaid.MNLastPaidTime, currenttimestamp());
                            }
                            return outtxt;
                        }
                    } else {
                        if (type == 'sort') {
                            return 0;
                        } else {
                            return 'Never/Unknown';
                        }
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var activeseconds = parseInt(data.MNActiveSeconds);
                    if (type == 'sort') {
                        return activeseconds;
                    } else if (activeseconds < 0) {
                        return 'Just now (' + activeseconds + ')';
                    } else {
                        return diffHR(activeseconds);
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.MNLastSeen;
                    } else if (data.MNLastSeen > 0) {
                        return deltaTimeStampHR(data.MNLastSeen, currenttimestamp());
                    } else {
                        return '';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.MNCountry;
                    } else {
                        return '<img src="/static/flags/flags_iso/16/' + data.MNCountryCode + '.png" width=16 height=16 /> ' + data.MNCountry;
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var activecount = parseInt(data.ActiveCount);
                    var inactivecount = parseInt(data.InactiveCount);
                    var unlistedcount = parseInt(data.UnlistedCount);
                    var total = activecount + inactivecount + unlistedcount;
                    var ratio = activecount / total;
                    var result = ratio;
                    if (type == 'sort') {
                        result = ratio;
                    } else {
                        if (ratio == 1) {
                            result = 'Active';
                        } else if (ratio == 0) {
                            result = 'Inactive';
                        } else if (unlistedcount > 0) {
                            result = 'Partially Unlisted';
                        } else {
                            result = 'Partially Inactive';
                        }
                        result += ' (' + Math.round(ratio * 100) + '%)';
                    }
                    return result;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return data.MasternodeStatusPoS;
                }
            },
        ],
        "createdRow": function(row, data, index) {
            dashversion = getLatestdashVersion();
            var color = '#FF8F8F';
            if ((data.Portcheck.Result == 'open') || (data.Portcheck.Result == 'rogue')) {
                color = '#8FFF8F';
            } else if (data.Portcheck.Result == 'unknown') {
                color = '#8F8F8F';
            }
            $('td', row).eq(1).css({ "background-color": color, "text-align": "center" });
            color = '#8FFF8F';
            if (data.Balance.Value < 1000) {
                color = '#FF8F8F';
            }
            $('td', row).eq(4).css({ "background-color": color, "text-align": "right" });
            var versioninfo = "Unknown";
            if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0, 9) == '/Satoshi:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                versioninfo = data.Portcheck.SubVer.substring(9, data.Portcheck.SubVer.indexOf('/', 10));
            } else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0, 6) == '/Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                versioninfo = data.Portcheck.SubVer.substring(6, data.Portcheck.SubVer.indexOf('/', 6));
            }
            if (versioninfo == "Unknown") {
                color = '#8F8F8F';
            } else if ((versioninfo.substring(0, 5) == "0.10.") || (versioninfo.substring(0, 7) == "0.11.0.")) {
                color = '#FF8F8F';
            } else if (versioninfo == dashversion) {
                color = '#8FFF8F';
            } else {
                color = '#FFFF8F';
            }
            $('td', row).eq(2).css({ "background-color": color });
            var total = data.ActiveCount + data.InactiveCount + data.UnlistedCount;
            var activecount = parseInt(data.ActiveCount);
            var inactivecount = parseInt(data.InactiveCount);
            var unlistedcount = parseInt(data.UnlistedCount);
            var total = activecount + inactivecount + unlistedcount;
            var ratio = activecount / total;
            if (ratio == 1) {
                color = '#8FFF8F';
            } else if (ratio == 0) {
                color = '#FF8F8F';
            } else if (ratio < 0.5) {
                color = '#ffcb8f';
            } else {
                color = '#FFFF8F';
            }
            $('td', row).eq(9).css({ "background-color": color, "text-align": "center" });
            if (data.MasternodeStatusPoS == 0) {
                color = '#8FFF8F';
            } else if (data.MasternodeStatusPoS >= 6) {
                color = '#FF8F8F';
            } else {
                var maxcolor = 255 - ((data.MasternodeStatusPoS - 1) * 13);
                color = '#FF' + maxcolor.toString(16) + '8F';
            }
            $('td', row).eq(10).css({ "background-color": color, "text-align": "center" });
        }
    });
    setTimeout(tableMNListRefresh, 300000);

    mnpaymentsRefresh();

});