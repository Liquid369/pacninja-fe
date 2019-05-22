/*
 This file is part of Paccoin Ninja.
 https://github.com/akshaynexus/pacninja-fe

 Paccoin Ninja is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Paccoin Ninja is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Paccoin Ninja.  If not, see <http://www.gnu.org/licenses/>.

 */

// Either indicate if we are we on testnet (=1) or on mainnet (=0)
//var pacninjatestnet = 0;
// OR indicate the hostname for testnet (if the hostname the page is running is equal to this, it will switch to testnet)
var pacninjatestnethost = 'test.pacninja.pl';
var pacninjatestnetexplorer = 'test.explorer.pacninja.pl';

// Tor onion hostname
var pacninjator = 'seuhd5sihasshuqh.onion';
var pacninjatestnettor = 'gycv32vrbvhfohjj.onion';
var pacninjai2p = 'dzjzoefy7fx57h5xkdknikvfv3ckbxu2bx5wryn6taud343g2jma.b32.i2p';
var pacninjatestneti2p = 'hkttp5yfsmmmtsgynadotlk6t3ppsuaj274jzipj4fe7cko3whza.b32.i2p';

// Coin logos
var pacninjacoin = ['PAC', 'tPAC'];

// URLs
// Block info
// ["https://explorer.pacninja.pl/block/%%b%%","elberethzone's Paccoin Blockchain Explorer"]
var pacninjablockexplorer = [
    [
        ["http://chainz.cryptoid.info/Paccoin/block.dws?%%b%%.htm", "cryptoID Paccoin Blockchain Explorer"]
    ],
    [
        ["https://test.explorer.pacninja.pl/block/%%b%%", "Paccoin Ninja Testnet Blockchain Explorer"],
        ["https://test.insight.Paccoin.siampm.com/block/%%b%%", "Alternate Testnet Paccoin Blockchain Explorer"]
    ]
];

// Address info
var pacninjamndetail = [
    [
        ["/mndetails.html?mnpubkey=%%a%%", "Paccoin Ninja Masternode Detail"],
        ["https://www.Paccoincentral.org/masternodes/%%a%%", "Paccoin Central Masternode Monitoring"]
    ],
    [
        ["/mndetails.html?mnpubkey=%%a%%", "Paccoin Ninja Testnet Masternode Detail"]
    ]
];
var pacninjamndetailvin = [
    [
        ["/mndetails.html?mnoutput=%%a%%", "Paccoin Ninja Masternode Detail"]
    ],
    [
        ["/mndetails.html?mnoutput=%%a%%", "Paccoin Ninja Testnet Masternode Detail"]
    ]
];

var pacninjamndetailprotx = [
    [
        ["/mndetails.html?protxhash=%%a%%", "Paccoin Ninja Masternode Detail"]
    ],
    [
        ["/mndetails.html?protxhash=%%a%%", "Paccoin Ninja Testnet Masternode Detail"]
    ]
];

// ["https://explorer.pacninja.pl/address/%%a%%","elberethzone's Paccoin Blockchain Explorer"],
var pacninjaaddressexplorer = [
    [
        ["https://chainz.cryptoid.info/Paccoin/address.dws?%%a%%.htm", "cryptoID Paccoin Blockchain Explorer"]
    ],
    [
        ["https://test.explorer.pacninja.pl/address/%%a%%", "Paccoin Ninja Testnet Blockchain Explorer"],
        ["https://test.insight.Paccoin.siampm.com/address/%%a%%", "Alternate Testnet Paccoin Blockchain Explorer"]
    ]
];
// ["http://explorer.pacninja.pl/tx/%%a%%","elberethzone's Paccoin Blockchain Explorer"],
var pacninjatxexplorer = [
    [
        ["https://chainz.cryptoid.info/Paccoin/tx.dws?%%a%%.htm", "cryptoID Paccoin Blockchain Explorer"]
    ],
    [
        ["http://test.explorer.pacninja.pl/tx/%%a%%", "Paccoin Ninja Testnet Blockchain Explorer"],
        ["https://test.insight.Paccoin.siampm.com/tx/%%a%%", "Alternate Testnet Paccoin Blockchain Explorer"]
    ]
];

// Search query
// ["https://explorer.pacninja.pl/search?q=%%q%%","elberethzone's Paccoin Blockchain Explorer"],
var pacninjaqueryexplorer = [
    [
        ["https://chainz.cryptoid.info/Paccoin/search.dws?q=%%q%%", "cryptoID Paccoin Blockchain Explorer"]
    ],
    [
        ["https://test.explorer.pacninja.pl/search?q=%%q%%", "Paccoin Ninja Testnet Blockchain Explorer"],
        ["http://test.explorer.darkcoin.qa/search?q=%%q%%", "Official Testnet Paccoin Blockchain Explorer"]
    ]
];

var pacninjamasternodemonitoring = ["/masternodes.html?mnregexp=%%p%%#mnversions", "/masternodes.html?mnregexp=%%p%%#mnversions"];

var pacninjabudgetdetail = ["/budgetdetails.html?budgetid=%%b%%", "/budgetdetails.html?budgetid=%%b%%"];

var pacninjagovernanceproposaldetail = ["/proposaldetails.html?proposalhash=%%b%%", "/proposaldetails.html?proposalhash=%%b%%"];

// Blocks per day
var Paccoinblocksperday = 553;