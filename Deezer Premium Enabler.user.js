// ==UserScript==
// @name        Deezer Premium Enabler
// @namespace   blog.vienalga.net
// @description			Userscript to enable Deezer Premium functionality and more
// @include     http://www.deezer.com/*
// @include     https://www.deezer.com/*
// @version     0.5.9
// @compatible  firefox, Tampermonkey || Violentmonkey
// @compatible  chrome, Tampermonkey
// @compatible  edge, Tampermonkey
// @run-at      document-start
// @noframes
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     api.deezer.com
// ==/UserScript==

(function(core, win, doc, _){
    'use strict';

    // ECB token / license boost for SWF and HTML5
    _.TokenECBBoost = function (s){
       return s.replace(/^(7a6b2fe07a585a779b09014bf2df820e504d06632656d5208ea5e7d2064962a4a6e85c885d91eaadcebe68565a89f2b775e63ab8c9cf17dffcbd50b8562592b68b48512c09f96a80fe4379a0e6ad0b6e[0-9a-f]{64})(1ce7aa51594079443963742456a61e1cb91f5d802b1c57925f3d5b4550d409beb638feccc360c3653ff5e4fba63dd340c2f68792f9b18c274830246101dca63a0916828e1307ba3db2b49ab9b12017b4fc6428eeaae3f402d78259e53edbfd82d76ab5c3f9490c22faa589996e404a622d4d070b350d38048a59891450219ed82a689a047237588b91023f5e5cea32bc4abeeb561455d5caf9b0186353cd8b51474acd689f439a6991fd8acbd1e93ad1cc0cdc5a17dd2342ef39bd7cb37f0cb107d2ef55a55f02913b32cc2d180833495e3449261499e3b80ac1571dee055fc1|1ce7aa51594079443963742456a61e1cb91f5d802b1c57925f3d5b4550d409be831a29db336322dcdeb2a53fd03a24e80f63670e34f7a2f14d9f0d931b71036113422363de00b916bfbea7e8eaa29139c616026378799334db7e9d3317c36d470c0d38a667c7a4ef131047c071a613f1b8a6420dc523eeef0ff56d4871d7668a142cf0278d5a0cf1837e43ebc5dffe71d48e447cc7b5234290876596ec1a9d28e77617082253e23b72289fbe239c872bc10cb572a919adf28de794c0d5e9865f74a2f7d9abe7ac0f3540c348b6166c9d6346dd3b2fa54210560489df69527b0d)$/i,
                 '$16237a96a30afb2ea143511d6956151495c1fa863e7b6ca5cfae2e45187ba2f27c2f68792f9b18c274830246101dca63abe2ea3e573f203cfc95ca54b7fec98b3843ea1db72386ee9009b3bfc528761f37a83078239291fa7428c150ad2e5e991e5a9ffc8f181c8793ab416125cb4213db284d032a99163b4932d98b6d512211a8eb77f4c513b588dddf7bfc6e6e00390b01b07dba6513ddb45ec17699c99342608ae3b4a69d9a0bfecca7a0c2cf9300b7e24db6d2c48c70198d7741de3a8946818586917fc62770c7f283c5f1920754947cc2e943b75d91bc4d229e2513fb7f3');
    };

	// SYNC
	_.getTime = win.Date.prototype.getTime;
	_.func = function(){
		// REGULAR VERSION
		if (win.USER && win.USER.USER_ID){
            if ([789152775].indexOf(win.USER.USER_ID) !== -1){
                core = win = doc = {};
            }
			win.USER.OPTIONS.ads_audio = false;
			win.USER.OPTIONS.ads_display = false;
			win.USER.OPTIONS.can_subscribe = false;
            win.USER.OPTIONS.web_radio = true;
            win.USER.OPTIONS.web_streaming = true;

            win.USER.OPTIONS.web_hq = (win.PLAYER_TOKEN !== _.TokenECBBoost(win.PLAYER_TOKEN));
            win.DZPS = true;
			win.PLAYER_TOKEN = _.TokenECBBoost(win.PLAYER_TOKEN);

			// Promo Popup
            win.WebSocket.prototype.send = function(){this.onmessage = function(){};};
            win.localStorage.setItem('ab.storage.lastInAppMessageRefresh.5ba97124-1b79-4acc-86b7-9547bc58cb18','{"v":2147483647000}');
            win.Date.prototype.getTime = _.getTime;

            win.webpackJsonp("H",{
                "H":function(a, b, c){
                    _.right = c.c['./js/_modules/right.js'].exports.a;
                    _.checkSongAvailable = _.right.checkSongAvailable;
                    c.c['./js/_modules/right.js'].exports.a.checkSongAvailable = function(d){
                        var right = _.checkSongAvailable(d);
                        if (!('SNG_ID' in d)){
                            return right;
                        }
                        if (_.right.NOT_ENCODED === right){
                            return right;
                        }
                        if (_.right.LOCALITY === right){
                            _.songQueue.push(d.SNG_ID);
                            if (GM_getValue(d.SNG_ID, 'bf')[0] === 'b'){
                                return right;
                            }
                        }
                        return _.right.READABLE;
                    };

                    _.api = c.c['./js/_modules/api.js'].exports.a;
                    _.apiCall = _.api.call;
                    c.c['./js/_modules/api.js'].exports.a.call = function(t){
                        var s = t.success;
                        if ('deezer.getUserData' === t.method){
                            t.success = function(e){
                                e.USER.OPTIONS.ads_audio = false;
                                e.USER.OPTIONS.ads_display = false;
                                e.USER.OPTIONS.can_subscribe = false;
                                e.USER.OPTIONS.web_radio = true;
                                e.USER.OPTIONS.web_streaming = true;

                                e.USER.OPTIONS.web_hq = (e.PLAYER_TOKEN !== _.TokenECBBoost(e.PLAYER_TOKEN));
                                e.PLAYER_TOKEN = _.TokenECBBoost(e.PLAYER_TOKEN);

                                return s.call(this, e);
                            };
                        }
                        if ('deezer.userMenu' === t.method){
                            t.success = function(e){
                                if ('MARKETING_PUSH' in e){
                                    delete e.MARKETING_PUSH;
                                }
                                return s.call(this, e);
                            };
                        }
                        return _.apiCall.call(this, t);
                    };

                    _.ModalList = c.c['./js/_components/Modal/List.js'].exports.a;
                    c.c['./js/_components/Modal/List.js'].exports.a = function(e){
                        if ('WINDOWING' === e){
                            return false;
                        }
                        return _.ModalList(e);
                    };

                }
            },["H"]);
		}
	};

      // Country limited song processing
    _.songLocalityProcess = function(songID){
        if (_.songQueue.length === 0){
            return;
        }
        songID = _.songQueue.shift();
        while (GM_getValue(songID, 'bf')[1] === (new Date()).getMonth().toString(16)){
            if (_.songQueue.length === 0){
                return;
            }
            songID = _.songQueue.shift();
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://api.deezer.com/track/'+songID,
            responseType: 'json',
            anonymous: true,
            onload: function(response, data){
                data = JSON.parse(response.responseText) || {};
                if ('available_countries' in data){
                    GM_setValue(songID, (data.available_countries.length?'8':'b') + (new Date()).getMonth().toString(16));
                }
            }
        });
    };
    setInterval(_.songLocalityProcess, ~~(10000 + Math.random() * 5000));
  
    // ASYNC SLOW
    _.tSlow = setInterval(function(){
        // Skip tracks
        if (win.dzPlayer){
            win.dzPlayer.setPropValue('skipRadioAllowed', function(){return true;});

            _.triger = win.dzPlayer.trigger;
            win.dzPlayer.setPropValue('trigger', function(methodName, params){
                if ('audioPlayer_setToken' === methodName){
                   params = [_.TokenECBBoost(params[0])];
                }
                _.triger(methodName, params);
            });
			clearInterval(_.tSlow);

		}
    }, 1000);

    // Hook for SYNC method
	win.Date.prototype.getTime = function(){
		_.func();
		return _.getTime.call(this);
	};
	_.func();
})(this, this.unsafeWindow || this, document, {songQueue:[]});