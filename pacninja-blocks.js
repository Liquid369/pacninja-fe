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

// Pac Ninja Front-End (pacninja-fe) - Blocks (v2)
// By elberethzone / https://dashtalk.org/members/elbereth.175/

var pacninjaversion = '2.5.10';
var tableBlocks = null;
var tablePerVersion = null;
var tablePerMiner = null;
var dataProtocolDesc = [];
var maxProtocol = -1;
var maxblockversion = -1;
var maxblockversiondesc = '';

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

function tableBlocksRefresh() {
    tableBlocks.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableBlocksRefresh, 150000);
};

function tableBlockFilter(poolfilter) {
    tableBlocks.api().search(poolfilter)
        .draw();
    location.hash = "#blocksdetail";
}

function tableBlockFilterReset() {
    tableBlockFilter('');
}

$(document).ready(function() {

    $('#pacninjajsversion').text(pacninjaversion).addClass("label-info").removeClass("label-danger");

    if (pacninjatestnet == 1) {
        $('#testnetalert').show();
        $('a[name=menuitemexplorer]').attr("href", "https://" + pacninjatestnetexplorer);
        if (typeof pacninjatestnettor !== 'undefined') {
            $('a[name=pacninjatorurl]').attr("href", "http://" + pacninjatestnettor + "/blocks.html");
            $('span[name=pacninjatordisplay]').show();
        }

        if (typeof pacninjatestneti2p !== 'undefined') {
            $('a[name=pacninjai2purl]').attr("href", "http://" + pacninjatestneti2p + "/blocks.html");
            $('span[name=pacninjai2pdisplay]').show();
        }
    } else {
        if (typeof pacninjator !== 'undefined') {
            $('a[name=pacninjatorurl]').attr("href", "http://" + pacninjator + "/blocks.html");
            $('span[name=pacninjatordisplay]').show();
        }

        if (typeof pacninjai2p !== 'undefined') {
            $('a[name=pacninjai2purl]').attr("href", "http://" + pacninjai2p + "/blocks.html");
            $('span[name=pacninjai2pdisplay]').show();
        }
    }

    tablePerVersion = $('#perversiontable').dataTable({
        data: [],
        paging: false,
        columns: [{
                data: null,
                render: function(data, type, row) {
                    return data.BlockVersionDesc;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return data.Blocks;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.Amount;
                    } else {
                        return addCommas(data.Amount.toFixed(3));
                    }
                },
                class: "right"
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioBlocksPayed;
                    } else {
                        return (Math.round(data.RatioBlocksPayed * 10000) / 100).toFixed(2) + '%';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioBlocksAll;
                    } else {
                        return (Math.round(data.RatioBlocksAll * 10000) / 100).toFixed(2) + '%';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioBlocksPayedIncorrectRatio;
                    } else {
                        return (Math.round(data.RatioBlocksPayedIncorrectRatio * 10000) / 100).toFixed(2) + '%';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioBlocksPayedCorrectRatio;
                    } else {
                        return (Math.round(data.RatioBlocksPayedCorrectRatio * 10000) / 100).toFixed(2) + '%';
                    }
                }
            }
        ],
        createdRow: function(row, data, index) {
            $('td', row).eq(2).css({ "text-align": "right" });
            $('td', row).eq(3).css({ "text-align": "right" });
            $('td', row).eq(4).css({ "text-align": "right" });
            $('td', row).eq(5).css({ "text-align": "right" });
            console.log(data.BlockVersionDesc + ' == '.maxblockversiondesc);
            if (data.BlockVersionDesc == maxblockversiondesc) {
                $('td', row).eq(0).css({ "background-color": "#8FFF8F" });
                var color = '#8FFF8F';
                if (data.RatioBlocksPayedCorrectRatio < 0.25) {
                    color = '#FF8F8F';
                } else if (data.RatioBlocksPayedCorrectRatio < 0.5) {
                    color = '#ffcb8f';
                } else if (data.RatioBlocksPayedCorrectRatio < 0.75) {
                    color = '#FFFF8F';
                }
                $('td', row).eq(6).css({ "text-align": "right", "border": "2px solid red", "background-color": color, "font-weight": "bold" });
            } else {
                $('td', row).eq(0).css({});
                $('td', row).eq(6).css({ "text-align": "right" });
            }
        }
    });

    tablePerMiner = $('#perminertable').dataTable({
        data: [],
        paging: true,
        lengthMenu: [
            [20, 50, 100, 200, -1],
            [20, 50, 100, 200, "All"]
        ],
        pageLength: 20,
        order: [
            [1, "desc"],
            [9, "desc"]
        ],
        columns: [{
                data: null,
                render: function(data, type, row) {
                    var outtxt = '';
                    if (data.PoolName == '') {
                        outtxt = data.PoolPubKey;
                    } else {
                        outtxt = data.PoolName;
                    }
                    return outtxt;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return data.Blocks;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioBlocksFound;
                    } else {
                        return (Math.round(data.RatioBlocksFound * 10000) / 100).toFixed(2) + '%';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return data.BlocksPayed;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioBlocksPayed;
                    } else {
                        return (Math.round(data.RatioBlocksPayed * 10000) / 100).toFixed(2) + '%';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.TotalAmount;
                    } else {
                        return data.TotalAmount.toFixed(3);
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.MasternodeAmount;
                    } else {
                        return data.MasternodeAmount.toFixed(3);
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioMNPayments;
                    } else {
                        return (Math.round(data.RatioMNPayments * 1000) / 10).toFixed(1) + '%';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioBlocksPayedToCurrentProtocol;
                    } else {
                        return (Math.round(data.RatioBlocksPayedToCurrentProtocol * 10000) / 100).toFixed(2) + '%';
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == 'sort') {
                        return data.RatioBlocksPayedCorrectly;
                    } else {
                        return (Math.round(data.RatioBlocksPayedCorrectly * 10000) / 100).toFixed(2) + '%';
                    }
                }
            }
        ],
        createdRow: function(row, data, index) {
            if (data.BlocksPayed == 0) {
                $('td', row).eq(0).css({ "color": "#FF0000", "font-weight": "bold", 'cursor': 'pointer' });
            } else {
                $('td', row).eq(0).css({ 'cursor': 'pointer' });
            }
            $('td', row).eq(0).click(function(event) {
                console.log('CLICK');
                tableBlockFilter($(event.target).text());
            });
            $('td', row).eq(1).css({ "text-align": "right" });
            $('td', row).eq(2).css({ "text-align": "right" });
            $('td', row).eq(3).css({ "text-align": "right" });
            $('td', row).eq(4).css({ "text-align": "right" });
            $('td', row).eq(5).css({ "text-align": "right" });
            $('td', row).eq(6).css({ "text-align": "right" });
            var color = '';
            if (Math.round(data.RatioMNPayments * 100) == Math.round(data.RatioMNPaymentsExpected * 100)) {
                color = '#8fff8f';
            } else if (data.RatioMNPayments > 0.11) {
                color = '#ffff8f';
            } else if (data.RatioMNPayments > 0) {
                color = '#ffcb8f';
            } else {
                color = '#ff8f8f';
            }
            $('td', row).eq(7).css({ "text-align": "right", "background-color": color });
            if (data.RatioBlocksPayedToCurrentProtocol == 1) {
                color = '#8fff8f';
            } else if (data.RatioBlocksPayedToCurrentProtocol > 0) {
                color = '#ffff8f';
            } else {
                color = '#ff8f8f';
            }
            $('td', row).eq(8).css({ "text-align": "right", "background-color": color });
            if (data.RatioBlocksPayedCorrectly == 1) {
                color = '#8fff8f';
            } else if (data.RatioBlocksPayedCorrectly > 0) {
                color = '#ffff8f';
            } else {
                color = '#ff8f8f';
            }
            $('td', row).eq(9).css({ "text-align": "right", "background-color": color });
        }
    });

    $('#blockstable').on('xhr.dt', function(e, settings, json) {
        // Show global stats
        $('#globalsupplyamount').text(addCommas(json.data.stats.global.SupplyAmount) + ' ' + pacninjacoin[pacninjatestnet]);
        $('#globalmnamount').text(addCommas(json.data.stats.global.MNPaymentsAmount) + ' ' + pacninjacoin[pacninjatestnet]);
        $('#globalpayed').text((Math.round(json.data.stats.global.RatioBlocksPayed * 10000) / 100) + '%');
        $('#globalcorrectlypayed').text((Math.round(json.data.stats.global.RatioBlocksPayedCorrectly * 10000) / 100) + '%');
        $('#globalcurrentmnratio').text((Math.round(json.data.blocks[0].BlockMNValueRatioExpected * 1000) / 10));

        // Fill per version stats table
        for (var protocol in json.data.stats.protocoldesc) {
            if (!json.data.stats.protocoldesc.hasOwnProperty(protocol)) { continue; }
            dataProtocolDesc[protocol] = json.data.stats.protocoldesc[protocol];
        }
        maxProtocol = json.data.stats.global.maxprotocol;

        tablePerVersion.api().clear();
        maxblockversion = -1;
        for (var blockversion in json.data.stats.perversion) {
            if (blockversion > maxblockversion) {
                maxblockversion = blockversion;
            }
        }
        maxblockversiondesc = json.data.stats.perversion[maxblockversion].BlockVersionDesc;

        for (var blockversion in json.data.stats.perversion) {
            if (!json.data.stats.perversion.hasOwnProperty(blockversion)) { continue; }
            tablePerVersion.api().row.add(json.data.stats.perversion[blockversion]);
        }
        tablePerVersion.api().draw();

        // Fill per miner stats table
        tablePerMiner.api().clear();
        var tempObj = [];
        for (var poolpubkey in json.data.stats.perminer) {
            if (!json.data.stats.perminer.hasOwnProperty(poolpubkey)) { continue; }
            tempObj = json.data.stats.perminer[poolpubkey];
            tempObj['PoolPubKey'] = poolpubkey;
            tablePerMiner.api().row.add(tempObj);
        }
        tablePerMiner.api().draw();

        // Change the last refresh date
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#blockstableLR').text(n + ' ' + time);
    });
    tableBlocks = $('#blockstable').dataTable({
        ajax: {
            url: "/data/blocks24h-" + pacninjatestnet + ".json",
            dataSrc: 'data.blocks',
            cache: true
        },
        lengthMenu: [
            [20, 70, 136, 272, -1],
            ["20 (~1h)", "70 (~3h)", "136 (~6h)", "272 (~12h)", "All (24h)"]
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
            { data: "BlockDifficulty" },
            { data: "BlockSupplyValue" },
            { data: "BlockMNValue" },
            {
                data: null,
                render: function(data, type, row) {
                    if (data.IsSuperBlock) {
                        return "Super-Block";
                    } else {
                        return (Math.round(data.BlockMNValueRatioExpected * 1000) / 10).toFixed(1) + "%/" + (Math.round(data.BlockMNValueRatio * 1000) / 10).toFixed(1) + "%";
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (type == "sort") {
                        return data.BlockMNPayee;
                    } else {
                        if (data.BlockMNPayee == "") {
                            return "<i>Unpaid block</i>";
                        } else {
                            if ((data.BlockMNPayee == "SUPERBLOCK") && (data.IsSuperBlock)) {
                                return '<a href="/governance.html#superblocks">' + data.SuperBlockBudgetPayees + ' proposal(s) paid</a>';
                            } else {
                                if (data.IsSuperBlock) {
                                    return '<a href="' + pacninjabudgetdetail[pacninjatestnet].replace('%%b%%', encodeURIComponent(data.SuperBlockBudgetName)) + '">' + data.SuperBlockBudgetName + '</a>';
                                } else {
                                    return '<a href="' + pacninjamasternodemonitoring[pacninjatestnet].replace('%%p%%', data.BlockMNPayee) + '">' + data.BlockMNPayee + '</a>';
                                }
                            }
                        }
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (data.IsSuperBlock) {
                        if (data.BlockMNProtocol == 0) {
                            return "Pac 0.12.0.44+";
                        } else {
                            return dataProtocolDesc[data.BlockMNProtocol];
                        }
                    } else {
                        return dataProtocolDesc[data.BlockMNProtocol];
                    }
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return data.BlockDarkSendTXCount;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return data.MemPoolDarkSendTXCount;
                }
            }
        ],
        createdRow: function(row, data, index) {
            if (data.BlockVersion == 0x20000008) {
                $('td', row).eq(1).css({ "background-color": "#8FFF8F" });
            } else {
                $('td', row).eq(1).css({ "background-color": '' });
            }
            if (data.IsSuperBlock) {
                $('td', row).eq(5).css({ "background-color": "#FFCB8F" });
                $('td', row).eq(6).css({ "background-color": "#FFCB8F" });
                $('td', row).eq(7).css({ "background-color": "#FFCB8F" });
                $('td', row).eq(8).css({ "background-color": "#FFCB8F" });
            } else {
                if (data.BlockMNPayed == 0) {
                    $('td', row).eq(5).css({ "background-color": "#FF8F8F" });
                    $('td', row).eq(6).css({ "background-color": "#FF8F8F" });
                    $('td', row).eq(7).css({ "background-color": "#FF8F8F" });
                    $('td', row).eq(8).css({ "background-color": "#FF8F8F" });
                } else {
                    if (Math.round(data.BlockMNValueRatio * 1000) == Math.round(data.BlockMNValueRatioExpected * 1000)) {
                        $('td', row).eq(5).css({ "background-color": "#8FFF8F" });
                        $('td', row).eq(6).css({ "background-color": "#8FFF8F" });
                    } else if ((data.BlockMNValueRatio == 0.1) || (data.BlockMNValueRatio == 0.2)) {
                        $('td', row).eq(5).css({ "background-color": "#FFFF8F" });
                        $('td', row).eq(6).css({ "background-color": "#FFFF8F" });
                    } else {
                        $('td', row).eq(5).css({ "background-color": "#ffcb8f" });
                        $('td', row).eq(6).css({ "background-color": "#ffcb8f" });
                    }
                    if (data.BlockMNProtocol == 70213) {
                        $('td', row).eq(8).css({ "background-color": "#8FFF8F" });
                    } else if (data.BlockMNProtocol < 70210) {
                        $('td', row).eq(8).css({ "background-color": "#FFCB8F" });
                    } else {
                        $('td', row).eq(8).css({ "background-color": "#FFFF8F" });
                    }
                }

            }
        }
    });
    setTimeout(tableBlocksRefresh, 150000);

});