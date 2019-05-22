/*
 This file is part of Dash Ninja.
 https://github.com/akshaynexus/pacninja-fe

 Dash Ninja is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Dash Ninja is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Dash Ninja.  If not, see <http://www.gnu.org/licenses/>.

 */

// Dash Ninja Front-End (pacninja-fe) - Deterministic Masternode List (ProTx)
// By elberethzone / https://www.dash.org/forum/members/elbereth.175/

var pacninjaversion = '0.2.3';
var tableLocalNodes = null;
var tableBlockConsensus = null;
var tableMNList = null;
var chartMNVersions = null;
var dashversiondefault = "0.13.1.0";
var dashversion = dashversiondefault;
var dashversioncheck = dashversion;
var dashversionsemaphore = false;
var sentinelversiondefault = "1.3.0";
var sentinelversion = sentinelversiondefault;
var dashmaxprotocol = 0;

$.fn.dataTable.ext.errMode = 'throw';

if (typeof(Storage) !== "undefined") {
    if (sessionStorage.getItem("nextdashversion") !== null) {
        sessionStorage.removeItem("nextdashversion");
    }
}

var pacninjatestnet = 0;

if (typeof pacninjatestnethost !== 'undefined') {
    if (window.location.hostname == pacninjatestnethost) {
        pacninjatestnet = 1;
    }
}
if (typeof pacninjatestnettor !== 'undefined') {
    if (window.location.hostname == pacninjatestnettor) {
        pacninjatestnet = 1;
    }
}
if (typeof pacninjatestneti2p !== 'undefined') {
    if (window.location.hostname == pacninjatestneti2p) {
        pacninjatestnet = 1;
    }
}

if (typeof pacninjamndetailprotx === 'undefined') {
    var pacninjamndetailprotx = [
        [],
        []
    ];
}
if (typeof pacninjamndetailprotx[0] === 'undefined') {
    pacninjamndetailprotx[0] = [];
}
if (typeof pacninjamndetail[1] === 'undefined') {
    pacninjamndetailprotx[1] = [];
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

if (typeof pacninjamndetailvin === 'undefined') {
    var pacninjamndetailvin = [
        [],
        []
    ];
}
if (typeof pacninjamndetailvin[0] === 'undefined') {
    pacninjamndetailvin[0] = [];
}
if (typeof pacninjamndetailvin[1] === 'undefined') {
    pacninjamndetailvin[1] = [];
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

if (typeof pacninjatxexplorer === 'undefined') {
    var pacninjatxexplorer = [
        [],
        []
    ];
}
if (typeof pacninjatxexplorer[0] === 'undefined') {
    pacninjatxexplorer[0] = [];
}
if (typeof pacninjatxexplorer[1] === 'undefined') {
    pacninjatxexplorer[1] = [];
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

function displaydashVersion(dashversion, sentinelversion) {
    if (dashversion != "?") {
        $('#msgalert').show();
    } else {
        $('#msgalert').hide();
    }
    $('#currentdashversion').text(dashversion);
    $('#currentsentinelversion').text(sentinelversion);
}

function getLatestdashVersion() {
    var currentdate = new Date();
    dashversion = sessionStorage.getItem("currentdashversion");
    sentinelversion = sessionStorage.getItem("currentsentinelversion");
    var nextdate = sessionStorage.getItem("nextdashversion");
    if (((dashversion === null) || (sentinelversion === null) ||
            (sessionStorage.getItem("nextdashversion") === null) ||
            (sessionStorage.getItem("nextdashversion") < currentdate.getTime())) && (dashversionsemaphore == false)) {
        dashversionsemaphore = true;
        $.getJSON("/pacninja-latestversion.json?nocache=" + (new Date()).getTime(), function(data) {
            sessionStorage.setItem('currentdashversion', data.version.string);
            sessionStorage.setItem('currentsentinelversion', data.sentinelversion.string);
            var currentdate = new Date();
            currentdate = new Date(currentdate.getTime() + 15 * 60000);
            sessionStorage.setItem('nextdashversion', currentdate.getTime());
            dashversionsemaphore = false;
            displaydashVersion(data.version.string, data.sentinelversion.string);
        });
        dashversion = dashversiondefault;
        sentinelversion = sentinelversiondefault;
    } else {
        if (dashversion === null) {
            dashversion = dashversiondefault;
        }
        if (sentinelversion === null) {
            sentinelversion = sentinelversiondefault;
        }
        displaydashVersion(dashversion, sentinelversion);
    }
    var testrc = dashversion.indexOf("-rc");
    if (testrc > -1) {
        dashversioncheck = dashversion.substr(0, testrc);
    } else {
        dashversioncheck = dashversion;
    }
    if ((dashversioncheck.length > 2) && (dashversioncheck.substr(dashversioncheck.length - 2) == ".0")) {
        dashversioncheck = dashversioncheck.substr(0, dashversioncheck.length - 2);
    }
    return dashversioncheck;
};

function getVoteLimit() {
    $.getJSON("/data/votelimit-" + pacninjatestnet + ".json", function(data) {
        var cls = "panel-red";
        if (data.data.votelimit.nextvote.BlockTime == 0) {
            var datevotelimit = new Date(data.data.votelimit.nextsuperblock.BlockTime * 1000);
            $('#nextvotelimithr').text("Too late! Superblock on " + datevotelimit.toLocaleString());
        } else {
            $('#nextvotelimithr').text(deltaTimeStampHRlong(data.data.votelimit.nextvote.BlockTime, currenttimestamp()));
            if ((data.data.votelimit.nextvote.BlockTime - currenttimestamp()) <= 86400) {
                cls = "panel-yellow";
            } else {
                cls = "panel-green";
            }
        }
        $('#nextvotepanel').removeClass("panel-green").removeClass("panel-red").removeClass("panel-yellow").addClass(cls);
    });
};


$(document).ready(function() {

    $('#pacninjajsversion').text(pacninjaversion).addClass("label-info").removeClass("label-danger");

    if (pacninjatestnet == 1) {
        $('#testnetalert').show();
        $('#testnettitle').show();
        $('a[name=menuitemexplorer]').attr("href", "https://" + pacninjatestnetexplorer);
        if (typeof pacninjatestnettor !== 'undefined') {
            $('a[name=pacninjatorurl]').attr("href", "http://" + pacninjatestnettor + "/masternodes.html");
            $('span[name=pacninjatordisplay]').show();
        }

        if (typeof pacninjatestneti2p !== 'undefined') {
            $('a[name=pacninjai2purl]').attr("href", "http://" + pacninjatestneti2p + "/masternodes.html");
            $('span[name=pacninjai2pdisplay]').show();
        }
    } else {
        if (typeof pacninjator !== 'undefined') {
            $('a[name=pacninjatorurl]').attr("href", "http://" + pacninjator + "/masternodes.html");
            $('span[name=pacninjatordisplay]').show();
        }

        if (typeof pacninjai2p !== 'undefined') {
            $('a[name=pacninjai2purl]').attr("href", "http://" + pacninjai2p + "/masternodes.html");
            $('span[name=pacninjai2pdisplay]').show();
        }
    }

    getLatestdashVersion();
    getVoteLimit();

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
        var date = new Date(json.data.cache.time * 1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#localnodesLR').text(n + ' ' + time);
        $('#localnodes').DataTable().column(1).search('^(?:(?!Disabled).)*$', true, false).draw();
        $('#localnodesLRHR').text(deltaTimeStampHRlong(json.data.cache.time, currenttimestamp()) + " ago");
    });
    tableLocalNodes = $('#localnodes').dataTable({
        responsive: true,
        searching: false,
        dom: "Tfrtp",
        ajax: {
            url: "/data/nodesstatus-" + pacninjatestnet + ".json",
            dataSrc: 'data.nodes',
            cache: true
        },
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
        var date = new Date(json.data.cache.time * 1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#blockconsensusLR').text(n + ' ' + time);
        $('#blockconsensusLRHR').text(deltaTimeStampHRlong(json.data.cache.time, currenttimestamp()) + " ago");
    });
    tableBlockConsensus = $('#blockconsensus').dataTable({
        dom: "Trtp",
        responsive: true,
        searching: false,
        ajax: {
            url: "/data/blocksconsensus-" + pacninjatestnet + ".json",
            dataSrc: 'data.blocksconsensus',
            cache: true
        },
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
                $('td', row).eq(1).removeClass("danger").removeClass("success").addClass("success");
            } else {
                $('td', row).eq(1).removeClass("danger").removeClass("success").addClass("danger");
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
            text: ''
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
        $('#mnlist').DataTable().search($('#mnregexp').val(), true, false).draw();
    });

    $('#mnregexp').val(getParameter("mnregexp"));

    $('#mnlist').on('xhr.dt', function(e, settings, json) {
        var date = new Date(json.data.cache.time * 1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        var activeCount = 0;
        var uniqueIPs = [];
        $('#mnlistLR').text(n + ' ' + time);
        $('#mnlistLRHR').text(deltaTimeStampHRlong(json.data.cache.time, currenttimestamp()) + " ago");
        var versioninfo = 'Unknown';
        var dataVersionCount = [];
        var mnregexp = $('#mnregexp').val();
        for (var i = 0, ien = json.data.protx.length; i < ien; i++) {
            //            if (parseInt(json.data.protx[i].MasternodeProtocol) > dashmaxprotocol) {
            //                dashmaxprotocol = parseInt(json.data.masternodes[i].MasternodeProtocol);
            //            }
            activeCount += json.data.protx[i].listedLast5Min;

            if (uniqueIPs.indexOf(json.data.protx[i].state.addrIP + ":" + json.data.protx[i].state.addrPort) == -1) {
                uniqueIPs.push(json.data.protx[i].state.addrIP + ":" + json.data.protx[i].state.addrPort);
            }
            if ((json.data.protx[i].Portcheck != false) && json.data.protx[i].Portcheck.hasOwnProperty("SubVer")) {
                if ((json.data.protx[i].Portcheck.SubVer.length > 10) && (json.data.protx[i].Portcheck.SubVer.substring(0, 9) == '/Satoshi:') && (json.data.protx[i].Portcheck.SubVer.substring(json.data.protx[i].Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = json.data.protx[i].Portcheck.SubVer.substring(9, json.data.protx[i].Portcheck.SubVer.indexOf('/', 10));
                } else if ((json.data.protx[i].Portcheck.SubVer.length > 7) && (json.data.protx[i].Portcheck.SubVer.substring(0, 6) == '/Core:') && (json.data.protx[i].Portcheck.SubVer.substring(json.data.protx[i].Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = json.data.protx[i].Portcheck.SubVer.substring(6, json.data.protx[i].Portcheck.SubVer.indexOf('/', 6));
                } else if ((json.data.protx[i].Portcheck.SubVer.length > 11) && (json.data.protx[i].Portcheck.SubVer.substring(0, 11) == '/Dash Core:') && (json.data.protx[i].Portcheck.SubVer.substring(json.data.protx[i].Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = json.data.protx[i].Portcheck.SubVer.substring(11, json.data.protx[i].Portcheck.SubVer.indexOf('/', 11));
                } else {
                    versioninfo = "Unknown";
                }
            } else {
                versioninfo = "Unknown";
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
                dataSet.push([version, Math.round((dataVersionCount[version] / json.data.protx.length) * 10000) / 100]);
            }
        }
        chartMNVersions = $('#mnversions').highcharts();
        chartMNVersions.series[0].setData(dataSet, true);

        var inactiveCount = json.data.protx.length - activeCount;

        $('#mnactive').text(activeCount);
        $('#mninactive').text(inactiveCount);
        $('#mntotal').text(json.data.protx.length);
        $('#uniquemnips').text(uniqueIPs.length);

        if (mnregexp != "") {
            $('#mnlist').DataTable().search(mnregexp, true, false).draw();
        }
    });
    tableMNList = $('#mnlist').dataTable({
        ajax: {
            url: "/data/protxfull-" + pacninjatestnet + ".json",
            dataSrc: 'data.protx',
            cache: true
        },
        lengthMenu: [
            [50, 100, 250, 500, -1],
            [50, 100, 250, 500, "All"]
        ],
        processing: true,
        responsive: true,
        pageLength: 50,
        columns: [{
                data: null,
                orderable: false,
                render: function(data, type, row) {
                    return ''
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if (type != 'filter') {
                        if (pacninjamndetailprotx[pacninjatestnet].length > 0) {
                            var ix = 0;
                            for (var i = 0, ien = pacninjamndetailprotx[pacninjatestnet].length; i < ien; i++) {
                                if (ix == 0) {
                                    outtxt += '<a href="' + pacninjamndetailprotx[pacninjatestnet][0][0].replace('%%a%%', data.proTxHash) + '" data-toggle="tooltip" data-placement="left" title="' + data.proTxHash + '">' + data.proTxHash.substring(0, 8) + '<i class="fa fa-ellipsis-h" aria-hidden="true"></i></a>';
                                } else {
                                    outtxt += '<a href="' + pacninjamndetailprotx[pacninjatestnet][i][0].replace('%%a%%', data.proTxHash) + '">[' + ix + ']</a>';
                                }
                                ix++;
                            }
                        } else {
                            outtxt = data.proTxHash;
                        }
                    } else {
                        outtxt = data.proTxHash;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if (type != 'filter') {
                        if (pacninjatxexplorer[pacninjatestnet].length > 0) {
                            var ix = 0;
                            for (var i = 0, ien = pacninjatxexplorer[pacninjatestnet].length; i < ien; i++) {
                                if (ix == 0) {
                                    outtxt += '<a href="' + pacninjatxexplorer[pacninjatestnet][0][0].replace('%%a%%', data.collateralHash) + '" data-toggle="tooltip" data-placement="left" title="' + data.collateralHash + '-' + data.collateralIndex + '">' + data.collateralHash.substring(0, 8) + '...-' + data.collateralIndex + '</a>';
                                } else {
                                    outtxt += '<a href="' + pacninjatxexplorer[pacninjatestnet][i][0].replace('%%a%%', data.collateralHash) + '">[' + ix + ']</a>';
                                }
                                ix++;
                            }
                        } else {
                            outtxt = data.collateralHash + '-' + data.collateralIndex;
                        }
                    } else {
                        outtxt = data.collateralHash + '-' + data.collateralIndex;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if (type != 'filter') {
                        if (pacninjaaddressexplorer[pacninjatestnet].length > 0) {
                            var ix = 0;
                            for (var i = 0, ien = pacninjaaddressexplorer[pacninjatestnet].length; i < ien; i++) {
                                if (ix == 0) {
                                    outtxt += '<a href="' + pacninjaaddressexplorer[pacninjatestnet][0][0].replace('%%a%%', data.state.payoutAddress) + '">' + data.state.payoutAddress + '</a>';
                                } else {
                                    outtxt += '<a href="' + pacninjaaddressexplorer[pacninjatestnet][i][0].replace('%%a%%', data.state.payoutAddress) + '">[' + ix + ']</a>';
                                }
                                ix++;
                            }
                        } else {
                            outtxt = data.state.payoutAddress;
                        }
                    } else {
                        outtxt = data.state.payoutAddress;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var mnip = "";
                    mnip = data.state.addrIP;
                    return mnip + ':' + data.state.addrPort;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var activecount = parseInt(data.state.activeCount);
                    var inactivecount = parseInt(data.state.inactiveCount);
                    var total = activecount + inactivecount;
                    var ratio = activecount / total;
                    var result = ratio;
                    if (type == 'sort') {
                        result = ratio;
                    } else {
                        if (ratio == 1) {
                            result = 'Valid';
                        } else if (ratio == 0) {
                            result = 'Unlisted';
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
                    var txt = "";
                    if (data.Portcheck != false) {
                        txt = data.Portcheck.Result;
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
                    } else {
                        txt = "<i>Unknown</i>";
                    }
                    return txt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var versioninfo = '<i>Unknown</i>';
                    if ((data.Portcheck != false) && data.Portcheck.hasOwnProperty("SubVer")) {
                        if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0, 9) == '/Satoshi:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                            versioninfo = data.Portcheck.SubVer.substring(9, data.Portcheck.SubVer.indexOf('/', 10));
                        } else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0, 6) == '/Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                            versioninfo = data.Portcheck.SubVer.substring(6, data.Portcheck.SubVer.indexOf('/', 6));
                        } else if ((data.Portcheck.SubVer.length > 11) && (data.Portcheck.SubVer.substring(0, 11) == '/Dash Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                            versioninfo = data.Portcheck.SubVer.substring(11, data.Portcheck.SubVer.indexOf('/', 11));
                        }
                    }
                    return versioninfo;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return data.state.registeredHeight;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (data.Balance == false) {
                        return "Unknown";
                    } else {
                        var balance = parseFloat(data.Balance.Value);
                        if (type == 'filter') {
                            return balance;
                        } else {
                            var num = Math.round(balance * 1000) / 1000;
                            return addCommas(num.toFixed(3));
                        }
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var lastpaid = parseInt(data.state.lastPaidHeight);
                    return lastpaid;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return data.state.PoSePenalty;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if (type != 'filter') {
                        if ((data.state.operatorRewardAddress != '') && (pacninjaaddressexplorer[pacninjatestnet].length > 0)) {
                            var ix = 0;
                            for (var i = 0, ien = pacninjaaddressexplorer[pacninjatestnet].length; i < ien; i++) {
                                if (ix == 0) {
                                    outtxt += '<a href="' + pacninjaaddressexplorer[pacninjatestnet][0][0].replace('%%a%%', data.state.operatorRewardAddress) + '">' + data.state.operatorRewardAddress + '</a>';
                                } else {
                                    outtxt += '<a href="' + pacninjaaddressexplorer[pacninjatestnet][i][0].replace('%%a%%', data.state.operatorRewardAddress) + '">[' + ix + ']</a>';
                                }
                                ix++;
                            }
                        } else {
                            outtxt = data.state.operatorRewardAddress;
                        }
                    } else {
                        outtxt = data.state.operatorRewardAddress;
                    }
                    return outtxt;
                }
            },
        ],
        "createdRow": function(row, data, index) {
            dashversioncheck = getLatestdashVersion();
            var activecount = parseInt(data.state.activeCount);
            var inactivecount = parseInt(data.state.inactiveCount);
            var total = activecount + inactivecount;
            var ratio = activecount / total;
            if (ratio == 1) {
                color = 'success';
            } else if (ratio == 0) {
                color = 'danger';
            } else {
                color = 'warning';
            }
            $('td', row).eq(5).removeClass("danger").removeClass("success").removeClass("warning").addClass(color).css({ "text-align": "center" });
            var color = 'danger';
            if (data.Portcheck == false) {
                color = 'warning';
            } else {
                if ((data.Portcheck.Result == 'open') || (data.Portcheck.Result == 'rogue')) {
                    color = 'success';
                } else if (data.Portcheck.Result == 'unknown') {
                    color = 'warning';
                }
            }
            $('td', row).eq(6).removeClass("danger").removeClass("success").removeClass("warning").addClass(color).css({ "text-align": "center" });
            color = 'success';
            if (data.Balance == false) {
                color = 'warning';
            } else if (data.Balance.Value < 1000) {
                color = 'danger';
            }
            $('td', row).eq(9).removeClass("danger").removeClass("success").removeClass("info").addClass(color).css({ "text-align": "right" });
            var versioninfo = "Unknown";
            if ((data.Portcheck != false) && data.Portcheck.hasOwnProperty("SubVer")) {
                if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0, 9) == '/Satoshi:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(9, data.Portcheck.SubVer.indexOf('/', 10));
                } else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0, 6) == '/Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(6, data.Portcheck.SubVer.indexOf('/', 6));
                } else if ((data.Portcheck.SubVer.length > 11) && (data.Portcheck.SubVer.substring(0, 11) == '/Dash Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(11, data.Portcheck.SubVer.indexOf('/', 11));
                }
            }
            if (versioninfo == "Unknown") {
                color = 'active';
            } else if ((versioninfo.substring(0, 5) == "0.10.") || (versioninfo.substring(0, 7) == "0.11.")) {
                color = 'danger';
            } else if (versioninfo == dashversioncheck) {
                color = 'success';
            } else {
                color = 'danger';
            }
            $('td', row).eq(7).removeClass("danger").removeClass("success").removeClass("warning").removeClass("active").addClass(color);
            if (data.state.PoSePenalty != 0) {
                color = 'danger';
            } else {
                color = 'success';
            }
            $('td', row).eq(11).removeClass("danger").removeClass("success").addClass(color);
        }
    });
    var mnlistsize = getParameter("mnlistsize");
    if (mnlistsize != "") {
        $('#mnlist').DataTable().page.len(parseInt(mnlistsize));
    }


    setTimeout(tableMNListRefresh, 300000);

    //mnpaymentsRefresh();

});