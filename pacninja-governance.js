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

// Pac Ninja Front-End (pacninja-fe) - Governance
// By elberethzone / https://www.dash.org/forum/members/elbereth.175/

var pacninjaversion = '1.6.3';
var tableGovernance = null;
var tableBudgetsProjection = null;
var tableSuperBlocks = null;
var tableSuperBlocksExpected = null;
var tableMonthlyBudgetPayments = null;
var latestblock = null;
var superblock = null;
var totalmns = 0;
var latestblock2 = null;
var superblock2 = null;
var totalmns2 = 0;
var arrayMonthlyPayments = [];

$.fn.dataTable.ext.errMode = 'throw';

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

if (typeof pacninjacoin === 'undefined') {
    var pacninjacoin = ['', ''];
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

function tableGovernanceRefresh() {
    tableGovernance.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableGovernanceRefresh, 150000);
};

function tableSuperBlocksRefresh() {
    tableSuperBlocks.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableSuperBlocksRefresh, 150000);
};

function tableSuperBlocksExpectedRefresh() {
    tableSuperBlocksExpected.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableSuperBlocksExpectedRefresh, 150000);
};

$(document).ready(function() {

    $('#pacninjajsversion').text(pacninjaversion).addClass("label-info").removeClass("label-danger");

    if (pacninjatestnet == 1) {
        $('#testnetalert').show();
        $('a[name=menuitemexplorer]').attr("href", "https://" + pacninjatestnetexplorer);
        if (typeof pacninjatestnettor !== 'undefined') {
            $('a[name=pacninjatorurl]').attr("href", "http://" + pacninjatestnettor + "/governance.html");
            $('span[name=pacninjatordisplay]').show();
        }

        if (typeof pacninjatestneti2p !== 'undefined') {
            $('a[name=pacninjai2purl]').attr("href", "http://" + pacninjatestneti2p + "/governance.html");
            $('span[name=pacninjai2pdisplay]').show();
        }
    } else {
        if (typeof pacninjator !== 'undefined') {
            $('a[name=pacninjatorurl]').attr("href", "http://" + pacninjator + "/governance.html");
            $('span[name=pacninjatordisplay]').show();
        }

        if (typeof pacninjai2p !== 'undefined') {
            $('a[name=pacninjai2purl]').attr("href", "http://" + pacninjai2p + "/governance.html");
            $('span[name=pacninjai2pdisplay]').show();
        }
    }

    $('#proposalsdetailtable').on('xhr.dt', function(e, settings, json) {

        var nextsuperblockdatetimestamp = json.data.stats.latestblock.BlockTime + (((json.data.stats.nextsuperblock.blockheight - json.data.stats.latestblock.BlockId) / 553.85) * 86400);

        // Calculate the established project total amounts
        var totalamount = 0.0;
        for (var bix in json.data.governanceproposals) {
            if ((json.data.governanceproposals[bix].FundedSB) && (json.data.governanceproposals[bix].EpochEnd > currenttimestamp()) && (json.data.governanceproposals[bix].EpochStart <= nextsuperblockdatetimestamp) && ((currenttimestamp() - json.data.governanceproposals[bix].LastReported) <= 3600)) {
                totalamount += json.data.governanceproposals[bix].PaymentAmount;
            }
        }

        // Show global stats
        $('#globalvalidbudget').text(json.data.stats.valid);
        $('#globalestablishedbudget').text(json.data.stats.funded);
        $('#globalestablishedbudgetamount').text(addCommas(Math.round(totalamount * 100) / 100) + ' ' + pacninjacoin[pacninjatestnet]);
        var cls = "panel-red";
        if ((json.data.stats.nextsuperblock.blockheight - 1662) <= json.data.stats.latestblock.BlockId) {
            $('#globalnextvotelimitdate').text("Current month vote is over!");
            $('#globalnextvotelimitremaining').text("Too late...");
        } else {
            var nextvotelimitdatetimestamp = json.data.stats.latestblock.BlockTime + (((json.data.stats.nextsuperblock.blockheight - 1662 - json.data.stats.latestblock.BlockId) / 553.85) * 86400);
            var datevotelimit = new Date(nextvotelimitdatetimestamp * 1000);
            $('#globalnextvotelimitdate').text(datevotelimit.toLocaleString());
            $('#globalnextvotelimitremaining').text(deltaTimeStampHRlong(nextvotelimitdatetimestamp, currenttimestamp()));
            if ((nextvotelimitdatetimestamp - currenttimestamp()) <= 86400) {
                cls = "panel-yellow";
            } else {
                cls = "panel-green";
            }
        }
        $('#votedeadline').removeClass("panel-green").removeClass("panel-red").removeClass("panel-yellow").addClass(cls);
        var datesuperblock = new Date(nextsuperblockdatetimestamp * 1000);
        $('#globalnextsuperblockdate').text(datesuperblock.toLocaleString());
        $('#globalnextsuperblockremaining').text(deltaTimeStampHRlong(nextsuperblockdatetimestamp, currenttimestamp()));
        $('#globalnextsuperblockid').text(json.data.stats.nextsuperblock.blockheight);
        var unallocper = Math.round((json.data.stats.nextsuperblock.estimatedbudgetamount - totalamount) / json.data.stats.nextsuperblock.estimatedbudgetamount * 100);
        var allocper = 100 - unallocper;
        $('#globalnextsuperblockamount').text(addCommas(Math.round(json.data.stats.nextsuperblock.estimatedbudgetamount * 100) / 100) + ' ' + pacninjacoin[pacninjatestnet]);
        $('#globalnextsuperblockunallocated').text(addCommas(Math.round((json.data.stats.nextsuperblock.estimatedbudgetamount - totalamount) * 100) / 100) + ' ' + pacninjacoin[pacninjatestnet]);
        $('#budgetallocatedper').css({ 'width': allocper + '%' }).text("Allocated (" + allocper + "%)");
        $('#budgetleftper').css({ 'width': unallocper + '%' }).text("Left (" + unallocper + "%)");



        // Store information for future use
        latestblock = json.data.stats.latestblock;
        superblock = json.data.stats.nextsuperblock;
        totalmns = json.data.stats.totalmns;

        if (tableSuperBlocksExpected !== null) {
            tableSuperBlocksExpected.api().ajax.reload();
        } else {
            tableSuperBlocksExpected = $('#superblocksexpectedtable').dataTable({
                ajax: {
                    url: "/data/governancetriggers-" + pacninjatestnet + ".json",
                    dataSrc: 'data.governancetriggers',
                    cache: true
                },
                paging: false,
                order: [
                    [0, "desc"]
                ],
                columns: [{
                        data: null,
                        render: function(data, type, row) {
                            var outtxt = data.Hash;
                            return outtxt;
                        }
                    },
                    {
                        data: null,
                        render: function(data, type, row) {
                            var outtxt = data.BlockHeight;
                            return outtxt;
                        }
                    },
                    {
                        data: null,
                        render: function(data, type, row) {
                            var outtxt = data.PaymentPosition;
                            return outtxt;
                        }
                    },
                    {
                        data: null,
                        render: function(data, type, row) {
                            if (type == "sort") {
                                return data.PaymentProposalName;
                            } else {
                                return '<a href="' + pacninjagovernanceproposaldetail[pacninjatestnet].replace('%%b%%', encodeURIComponent(data.PaymentProposalHash)) + '">' + data.PaymentProposalName + '</a>';
                            }
                        }
                    },
                    {
                        data: null,
                        render: function(data, type, row) {
                            if (type == "sort") {
                                return data.PaymentAmount;
                            } else {
                                return addCommas(data.PaymentAmount.toFixed(3)) + " " + pacninjacoin[pacninjatestnet];
                            }
                        }
                    }
                ],
                createdRow: function(row, data, index) {}
            });
        }

        // Change the last refresh date
        var date = new Date(json.data.cache.time * 1000);
        var n = date.toLocaleDateString();
        var time = date.toLocaleTimeString();
        $('#proposalsdetailtableLR').text(n + ' ' + time);
        $('#proposalsdetailtableLRHR').text(deltaTimeStampHRlong(json.data.cache.time, currenttimestamp()));
    });
    tableGovernance = $('#proposalsdetailtable').dataTable({
        ajax: {
            url: "/data/governanceproposals-" + pacninjatestnet + ".json",
            dataSrc: 'data.governanceproposals',
            cache: true
        },
        paging: true,
        lengthMenu: [
            [20, 50, 100, 200, -1],
            [20, 50, 100, 200, "All"]
        ],
        pageLength: 20,
        order: [
            [0, "desc"]
        ],
        columns: [{
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.FirstReported;
                    } else {
                        return timeSince((currenttimestamp() - data.FirstReported));
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = data.Name;
                    if (type != 'sort') {
                        if (data.Name == "") {
                            outtxt = data.Hash;
                        }
                        outtxt = '<a href="' + pacninjagovernanceproposaldetail[pacninjatestnet].replace('%%b%%', data.Hash) + '">' + outtxt + '</a>';
                        //                    outtxt = '<a href="'+data.URL+'">'+outtxt+'</a>';
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var blockdatetimestamp = data.EpochStart;
                    return (new Date(blockdatetimestamp * 1000)).toLocaleDateString();
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var blockdatetimestamp = data.EpochEnd;
                    return (new Date(blockdatetimestamp * 1000)).toLocaleDateString();
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.PaymentAmount;
                    } else {
                        return addCommas(data.PaymentAmount.toFixed(2)) + '&nbsp;' + pacninjacoin[pacninjatestnet];
                    }

                }
            },
            { data: "Yes" },
            { data: "No" },
            { data: "Abstain" },
            {
                data: null,
                render: function(data, type, row) {
                    var total = data.AbsoluteYes / totalmns;
                    if (type == 'sort') {
                        return total;
                    } else {
                        var number = Math.round(total * 10000) / 100;
                        return (number.toFixed(2) + '%');
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (data.BlockchainValidity) {
                        return "Yes";
                    } else {
                        return "No";
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (data.FundedSB) {
                        return "Yes";
                    } else {
                        return "No";
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.LastReported;
                    } else {
                        return timeSince((currenttimestamp() - data.LastReported));
                    }
                }
            },
        ],
        "createdRow": function(row, data, index) {
            $('td', row).eq(4).css({ "text-align": "right" });
            var totalvotesratio = data.AbsoluteYes / totalmns;
            var isalloted = false;
            var color = '#8F8F8F';
            var cls = 'success';
            if (data.BlockchainValidity) {
                if (totalvotesratio < 0.1000) {
                    cls = 'danger';
                } else if (totalvotesratio <= 0.25) {
                    isalloted = true;
                    cls = 'warning';
                } else {
                    isalloted = true;
                    cls = 'success';
                }
            }
            $('td', row).eq(8).removeClass("success").removeClass("warning").removeClass("danger").addClass(cls).css({ "text-align": "right" });
            cls = 'success';
            if (data.BlockchainValidity) {
                if (isalloted) {
                    cls = 'success';
                } else {
                    cls = 'warning';
                }
            } else {
                cls = 'danger';
            }
            $('td', row).eq(1).removeClass("success").removeClass("warning").removeClass("danger").addClass(cls).css({ "text-align": "left" });
            if (data.BlockchainValidity) {
                cls = 'success';
            } else {
                cls = 'danger';
            }
            $('td', row).eq(9).removeClass("success").removeClass("warning").removeClass("danger").addClass(cls).css({ "text-align": "center" });
            if (data.FundedSB) {
                cls = 'success';
            } else {
                cls = 'danger';
            }
            $('td', row).eq(10).removeClass("success").removeClass("warning").removeClass("danger").addClass(cls).css({ "text-align": "center" });
            $('td', row).eq(11).css({ "text-align": "center" });
        }
    });
    setTimeout(tableGovernanceRefresh, 150000);

    $('#superblockstable').on('xhr.dt', function(e, settings, json) {
        // Change the last refresh date
        var date = new Date(json.data.cache.time * 1000);
        var n = date.toLocaleDateString();
        var time = date.toLocaleTimeString();
        $('#superblockstableLR').text(n + ' ' + time);
        $('#superblockstableLRHR').text(deltaTimeStampHRlong(json.data.cache.time, currenttimestamp()));

        /*        var monthlypayments = {};
                var tmpDate;
                var xaxis = [];
                var paidbudgets = [];

                for (var bix in json.data.blocks){
                    tmpDate = new Date(json.data.blocks[bix].BlockTime*1000);
                    curmonth = tmpDate.getFullYear().toString()+"-"+pad((tmpDate.getMonth()+1).toString(),2,"0",STR_PAD_LEFT);
                    if (!monthlypayments.hasOwnProperty(curmonth)) {
                        monthlypayments[curmonth] = {};
                    }
                    monthlypayments[curmonth][json.data.blocks[bix].SuperBlockBudgetName] = json.data.blocks[bix].BlockMNValue;
                    if ($.inArray(curmonth,xaxis) == -1) {
                        xaxis.push(curmonth);
                    }
                    if ($.inArray(json.data.blocks[bix].SuperBlockBudgetName,paidbudgets) == -1) {
                        paidbudgets.push(json.data.blocks[bix].SuperBlockBudgetName);
                    }
                }

                xaxis.sort();
                paidbudgets.sort();

                for (var x in xaxis) {
                    var thismonth = 0.0;
                    for (var b in monthlypayments[xaxis[x]]) {
                        thismonth += monthlypayments[xaxis[x]][b];
                    }
                    arrayMonthlyPayments.push([xaxis[x], thismonth]);
                }

                var series = [];

                for (var p in paidbudgets) {
                    var thisserie = {name: paidbudgets[p],
                                     data: []};
                    for (var x in xaxis) {
                        if (monthlypayments[xaxis[x]].hasOwnProperty(paidbudgets[p])) {
                            thisserie.data.push(monthlypayments[xaxis[x]][paidbudgets[p]]);
                        }
                        else {
                            thisserie.data.push(null);
                        }
                    }
                    series.push(thisserie);
                }

                if (tableMonthlyBudgetPayments !== null) {
                    tableMonthlyBudgetPayments.api().rows().invalidate().draw();
                }
                else {
                    tableMonthlyBudgetPayments = $('#monthlybudgetpaymentstable').dataTable({
                        data: arrayMonthlyPayments,
                        paging: false,
                        order: [[0, "desc"]],
                        columns: [
                            {title: "Month"},
                            { data: null, render: function ( data, type, row ) {
                                var outtxt = addCommas(data[1].toFixed(3))+" "+pacninjacoin[pacninjatestnet];
                                return outtxt;
                            } }
                        ]
                    });
                }

                $('#chartpayments').highcharts({
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: 'Monthly Budget Payments',
                        x: -20 //center
                    },
                    xAxis: {
                        categories: xaxis
                    },
                    yAxis: {
                        title: {
                            text: 'Amount (Pac)'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: 'Pac'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    plotOptions: {
                        area: {
                            stacking: 'normal',
                            lineColor: '#666666',
                            lineWidth: 1,
                            marker: {
                                lineWidth: 1,
                                lineColor: '#666666'
                            }
                        }
                    },
                    series: series
                });
                */

    });
    tableSuperBlocks = $('#superblockstable').dataTable({
        ajax: {
            url: "/data/blockssuperblocks-" + pacninjatestnet + ".json",
            dataSrc: 'data.superblocks',
            cache: true
        },
        paging: true,
        lengthMenu: [
            [20, 50, 100, 200, -1],
            [20, 50, 100, 200, "All"]
        ],
        pageLength: 20,
        order: [
            [0, "desc"]
        ],
        columns: [{
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.BlockTime;
                    } else {
                        //                return deltaTimeStampHR(currenttimestamp(),data.BlockTime);
                        return timeSince((currenttimestamp() - data.BlockTime));
                    }

                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = data.BlockId;
                    if (type != 'sort') {
                        if (pacninjablockexplorer[pacninjatestnet].length > 0) {
                            outtxt = '<a href="' + pacninjablockexplorer[pacninjatestnet][0][0].replace('%%b%%', data.BlockHash) + '">' + data.BlockId + '</a>';
                        }
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    var outtxt = data.BlockPoolPubKey;
                    if (data.PoolDescription) {
                        outtxt = data.PoolDescription;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == "sort") {
                        return data.SuperBlockProposalName;
                    } else {
                        if (data.SuperBlockVersion == 1) {
                            return '<a href="' + pacninjabudgetdetail[pacninjatestnet].replace('%%b%%', encodeURIComponent(data.SuperBlockProposalName)) + '">' + data.SuperBlockProposalName + '</a>';
                        } else {
                            return '<a href="' + pacninjagovernanceproposaldetail[pacninjatestnet].replace('%%b%%', encodeURIComponent(data.SuperBlockProposalHash)) + '">' + data.SuperBlockProposalName + '</a>';
                        }
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == "sort") {
                        return data.SuperBlockPaymentAmount;
                    } else {
                        return addCommas(data.SuperBlockPaymentAmount.toFixed(3)) + " " + pacninjacoin[pacninjatestnet];
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == "sort") {
                        return data.SuperBlockPaymentAddress;
                    } else {
                        var outtxt = "";
                        var ix = 0;
                        for (var i = 0, ien = pacninjaaddressexplorer[pacninjatestnet].length; i < ien; i++) {
                            if (ix == 0) {
                                outtxt += '<a href="' + pacninjaaddressexplorer[pacninjatestnet][0][0].replace('%%a%%', data.SuperBlockPaymentAddress) + '">' + data.SuperBlockPaymentAddress + '</a>';
                            } else {
                                outtxt += '<a href="' + pacninjaaddressexplorer[pacninjatestnet][i][0].replace('%%a%%', data.SuperBlockPaymentAddress) + '">[' + ix + ']</a>';
                            }
                            ix++;
                        }
                        return outtxt;
                    }
                }
            }
        ],
        createdRow: function(row, data, index) {}
    });
    setTimeout(tableSuperBlocksRefresh, 150000);

    $('#superblocksexpectedtable').on('xhr.dt', function(e, settings, json) {
        // Change the last refresh date
        var date = new Date(json.data.cache.time * 1000);
        $('#superblocksexpectedtableLR').text(date.toLocaleString());
        $('#superblocksexpectedtableLRHR').text(deltaTimeStampHRlong(json.data.cache.time, currenttimestamp()));

    });

});