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
var pacninjacoin = ['DASH','tDASH'];

// URLs
// Block info
// ["https://explorer.pacninja.pl/block/%%b%%","elberethzone's Dash Blockchain Explorer"]
var pacninjablockexplorer = [[["http://chainz.cryptoid.info/dash/block.dws?%%b%%.htm","cryptoID Dash Blockchain Explorer"]],
                          [["https://test.explorer.pacninja.pl/block/%%b%%","Dash Ninja Testnet Blockchain Explorer"],
                           ["https://test.insight.dash.siampm.com/block/%%b%%","Alternate Testnet Dash Blockchain Explorer"]]];

// Address info
var pacninjamndetail = [[["/mndetails.html?mnpubkey=%%a%%","Dash Ninja Masternode Detail"],
                          ["https://www.dashcentral.org/masternodes/%%a%%","Dash Central Masternode Monitoring"]],
                         [["/mndetails.html?mnpubkey=%%a%%","Dash Ninja Testnet Masternode Detail"]]];
var pacninjamndetailvin = [[["/mndetails.html?mnoutput=%%a%%","Dash Ninja Masternode Detail"]],
                            [["/mndetails.html?mnoutput=%%a%%","Dash Ninja Testnet Masternode Detail"]]];

var pacninjamndetailprotx = [[["/mndetails.html?protxhash=%%a%%","Dash Ninja Masternode Detail"]],
                              [["/mndetails.html?protxhash=%%a%%","Dash Ninja Testnet Masternode Detail"]]];

// ["https://explorer.pacninja.pl/address/%%a%%","elberethzone's Dash Blockchain Explorer"],
var pacninjaaddressexplorer = [[["https://chainz.cryptoid.info/dash/address.dws?%%a%%.htm","cryptoID Dash Blockchain Explorer"]],
                                [["https://test.explorer.pacninja.pl/address/%%a%%","Dash Ninja Testnet Blockchain Explorer"],
                                 ["https://test.insight.dash.siampm.com/address/%%a%%","Alternate Testnet Dash Blockchain Explorer"]]];
// ["http://explorer.pacninja.pl/tx/%%a%%","elberethzone's Dash Blockchain Explorer"],
var pacninjatxexplorer = [[["https://chainz.cryptoid.info/dash/tx.dws?%%a%%.htm","cryptoID Dash Blockchain Explorer"]],
                           [["http://test.explorer.pacninja.pl/tx/%%a%%","Dash Ninja Testnet Blockchain Explorer"],
                            ["https://test.insight.dash.siampm.com/tx/%%a%%","Alternate Testnet Dash Blockchain Explorer"]]];

// Search query
// ["https://explorer.pacninja.pl/search?q=%%q%%","elberethzone's Dash Blockchain Explorer"],
var pacninjaqueryexplorer = [[["https://chainz.cryptoid.info/dash/search.dws?q=%%q%%","cryptoID Dash Blockchain Explorer"]],
                            [["https://test.explorer.pacninja.pl/search?q=%%q%%","Dash Ninja Testnet Blockchain Explorer"],
                             ["http://test.explorer.darkcoin.qa/search?q=%%q%%","Official Testnet Dash Blockchain Explorer"]]];

var pacninjamasternodemonitoring = ["/masternodes.html?mnregexp=%%p%%#mnversions","/masternodes.html?mnregexp=%%p%%#mnversions"];

var pacninjabudgetdetail = ["/budgetdetails.html?budgetid=%%b%%","/budgetdetails.html?budgetid=%%b%%"];

var pacninjagovernanceproposaldetail = ["/proposaldetails.html?proposalhash=%%b%%","/proposaldetails.html?proposalhash=%%b%%"];

// Blocks per day
var dashblocksperday = 553;