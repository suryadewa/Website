// ==UserScript==
// @name         Deezer: Download
// @namespace    DekiHaker
// @version      0.4
// @description  Download the currently playing song (or any song from the current tracklist) in any chosen format (standard, hq, etc) right to your computer for playing in any player (outside Deezer). Supports HQ even without Premium subscription.
// @author       Deki Haker
// @require      https://cdnjs.cloudflare.com/ajax/libs/aes-js/2.1.0/index.js
// @require      https://greasyfork.org/scripts/32982-pajhome-md5/code/PajHome%20MD5.js?version=216643
// @icon         https://e-cdns-files.dzcdn.net/images/common/favicon/favicon-96x96-v00400107.png
// @run-at       document-end
// @include      https://www.deezer.com/*
// @include      http://www.deezer.com/*
// @exclude      *://www.deezer.com/login*
// @exclude      *://www.deezer.com/register*
// @exclude      *://www.deezer.com/signout*
// @grant        GM_addStyle
// ==/UserScript==


(function(W, D) {
	'use strict'; var window = W;
	// W.hex_md5 = hex_md5;
	// Worker
	function createWorker(code) {
		var blobURL = URL.createObjectURL(new Blob(['(', code.toString(), ')()'], {type: 'application/javascript'}));
		var worker = new Worker(blobURL);
		URL.revokeObjectURL(blobURL);
		return worker;
	}
	var mainWk = createWorker(function() {
		!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.ID3Writer=t()}(this,function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e){return String(e).split("").map(function(e){return e.charCodeAt(0)})}function r(e){return new Uint8Array(t(e))}function n(e){var r=new Uint8Array(2*e.length);return new Uint16Array(r.buffer).set(t(e)),r}function a(e){return 73===e[0]&&68===e[1]&&51===e[2]}function i(e){if(!e||!e.length)return null;if(255===e[0]&&216===e[1]&&255===e[2])return"image/jpeg";if(137===e[0]&&80===e[1]&&78===e[2]&&71===e[3])return"image/png";if(71===e[0]&&73===e[1]&&70===e[2])return"image/gif";if(87===e[8]&&69===e[9]&&66===e[10]&&80===e[11])return"image/webp";var t=73===e[0]&&73===e[1]&&42===e[2]&&0===e[3],r=77===e[0]&&77===e[1]&&0===e[2]&&42===e[3];return t||r?"image/tiff":66===e[0]&&77===e[1]?"image/bmp":0===e[0]&&0===e[1]&&1===e[2]&&0===e[3]?"image/x-icon":null}function s(e){return[e>>>24&255,e>>>16&255,e>>>8&255,255&e]}function o(e){return[e>>>21&127,e>>>14&127,e>>>7&127,127&e]}function c(e){return(e[0]<<21)+(e[1]<<14)+(e[2]<<7)+e[3]}function u(e){return 11+e}function f(e){return 13+2*e}function h(e,t){return 16+2*e+2+2+2*t}function p(e,t,r,n){return 11+t+1+1+(n?2+2*(r+1):r+1)+e}function l(e,t){return 16+2*e+2+2+2*t}function g(e,t){return 13+2*e+2+2+2*t}function m(e){return 10+e}return function(){function t(r){if(e(this,t),!(r&&"object"==typeof r&&"byteLength"in r))throw new Error("First argument should be an instance of ArrayBuffer or Buffer");this.arrayBuffer=r,this.padding=4096,this.frames=[],this.url=""}return t.prototype._setIntegerFrame=function(e,t){var r=parseInt(t,10);this.frames.push({name:e,value:r,size:u(r.toString().length)})},t.prototype._setStringFrame=function(e,t){var r=t.toString();this.frames.push({name:e,value:r,size:f(r.length)})},t.prototype._setPictureFrame=function(e,t,r,n){var a=i(new Uint8Array(t)),s=r.toString();if(!a)throw new Error("Unknown picture MIME type");r||(n=!1),this.frames.push({name:"APIC",value:t,pictureType:e,mimeType:a,useUnicodeEncoding:n,description:s,size:p(t.byteLength,a.length,s.length,n)})},t.prototype._setLyricsFrame=function(e,t){var r=e.toString(),n=t.toString();this.frames.push({name:"USLT",value:n,description:r,size:h(r.length,n.length)})},t.prototype._setCommentFrame=function(e,t){var r=e.toString(),n=t.toString();this.frames.push({name:"COMM",value:n,description:r,size:l(r.length,n.length)})},t.prototype._setUserStringFrame=function(e,t){var r=e.toString(),n=t.toString();this.frames.push({name:"TXXX",description:r,value:n,size:g(r.length,n.length)})},t.prototype._setUrlLinkFrame=function(e,t){var r=t.toString();this.frames.push({name:e,value:r,size:m(r.length)})},t.prototype.setFrame=function(e,t){switch(e){case"TPE1":case"TCOM":case"TCON":if(!Array.isArray(t))throw new Error(e+" frame value should be an array of strings");var r="TCON"===e?";":"/",n=t.join(r);this._setStringFrame(e,n);break;case"TIT2":case"TALB":case"TPE2":case"TPE3":case"TPE4":case"TRCK":case"TPOS":case"TMED":case"TPUB":this._setStringFrame(e,t);break;case"TBPM":case"TLEN":case"TYER":this._setIntegerFrame(e,t);break;case"USLT":if(!("object"==typeof t&&"description"in t&&"lyrics"in t))throw new Error("USLT frame value should be an object with keys description and lyrics");this._setLyricsFrame(t.description,t.lyrics);break;case"APIC":if(!("object"==typeof t&&"type"in t&&"data"in t&&"description"in t))throw new Error("APIC frame value should be an object with keys type, data and description");if(t.type<0||t.type>20)throw new Error("Incorrect APIC frame picture type");this._setPictureFrame(t.type,t.data,t.description,!!t.useUnicodeEncoding);break;case"TXXX":if(!("object"==typeof t&&"description"in t&&"value"in t))throw new Error("TXXX frame value should be an object with keys description and value");this._setUserStringFrame(t.description,t.value);break;case"TKEY":if(!/^([A-G][#b]?m?|o)$/.test(t))throw new Error(e+" frame value should be like Dbm, C#, B or o");this._setStringFrame(e,t);break;case"WCOM":case"WCOP":case"WOAF":case"WOAR":case"WOAS":case"WORS":case"WPAY":case"WPUB":this._setUrlLinkFrame(e,t);break;case"COMM":if(!("object"==typeof t&&"description"in t&&"text"in t))throw new Error("COMM frame value should be an object with keys description and text");this._setCommentFrame(t.description,t.text);break;default:throw new Error("Unsupported frame "+e)}return this},t.prototype.removeTag=function(){if(!(this.arrayBuffer.byteLength<10)){var e=new Uint8Array(this.arrayBuffer),t=e[3],r=c([e[6],e[7],e[8],e[9]])+10;!a(e)||t<2||t>4||(this.arrayBuffer=new Uint8Array(e.subarray(r)).buffer)}},t.prototype.addTag=function(){this.removeTag();var e=[255,254],t=[101,110,103],a=10+this.frames.reduce(function(e,t){return e+t.size},0)+this.padding,i=new ArrayBuffer(this.arrayBuffer.byteLength+a),c=new Uint8Array(i),u=0,f=[];return f=[73,68,51,3],c.set(f,u),u+=f.length,u++,u++,f=o(a-10),c.set(f,u),u+=f.length,this.frames.forEach(function(a){switch(f=r(a.name),c.set(f,u),u+=f.length,f=s(a.size-10),c.set(f,u),u+=f.length,u+=2,a.name){case"WCOM":case"WCOP":case"WOAF":case"WOAR":case"WOAS":case"WORS":case"WPAY":case"WPUB":f=r(a.value),c.set(f,u),u+=f.length;break;case"TPE1":case"TCOM":case"TCON":case"TIT2":case"TALB":case"TPE2":case"TPE3":case"TPE4":case"TRCK":case"TPOS":case"TKEY":case"TMED":case"TPUB":f=[1].concat(e),c.set(f,u),u+=f.length,f=n(a.value),c.set(f,u),u+=f.length;break;case"TXXX":case"USLT":case"COMM":f=[1],"USLT"!==a.name&&"COMM"!==a.name||(f=f.concat(t)),f=f.concat(e),c.set(f,u),u+=f.length,f=n(a.description),c.set(f,u),u+=f.length,f=[0,0].concat(e),c.set(f,u),u+=f.length,f=n(a.value),c.set(f,u),u+=f.length;break;case"TBPM":case"TLEN":case"TYER":u++,f=r(a.value),c.set(f,u),u+=f.length;break;case"APIC":f=[a.useUnicodeEncoding?1:0],c.set(f,u),u+=f.length,f=r(a.mimeType),c.set(f,u),u+=f.length,f=[0,a.pictureType],c.set(f,u),u+=f.length,a.useUnicodeEncoding?(f=[].concat(e),c.set(f,u),u+=f.length,f=n(a.description),c.set(f,u),u+=f.length,u+=2):(f=r(a.description),c.set(f,u),u+=f.length,u++),c.set(new Uint8Array(a.value),u),u+=a.value.byteLength}}),u+=this.padding,c.set(new Uint8Array(this.arrayBuffer),u),this.arrayBuffer=i,i},t.prototype.getBlob=function(){return new Blob([this.arrayBuffer],{type:"audio/mpeg"})},t.prototype.getURL=function(){return this.url||(this.url=URL.createObjectURL(this.getBlob())),this.url},t.prototype.revokeURL=function(){URL.revokeObjectURL(this.url)},t}()});

		// Blowfish library, adapted from https://github.com/agorlov/javascript-blowfish (MIT-licensed)
		// Modified to work with byte arrays, and also supports encryption / decryption in-place for buffers.
		// Cannot be @require-d, as it is part of worker code. Workers share NO data so everything must be embedded.
		var Blowfish = function(key, mode) {
			this.key = key;
			if (mode === "ecb" || mode === "cbc") this.mode = mode;
			this.sBox0  = Blowfish.sBox0.slice();
			this.sBox1  = Blowfish.sBox1.slice();
			this.sBox2  = Blowfish.sBox2.slice();
			this.sBox3  = Blowfish.sBox3.slice();
			this.pArray = Blowfish.pArray.slice();
			this.generateSubkeys(key);
		};
		Blowfish.prototype = {
			sBox0: null, sBox1: null, sBox2: null, sBox3: null, pArray: null,
			key: null, mode: "ecb", iv:  "abc12345",
			encrypt: function(data, iv) {
				if (this.mode === "ecb")  return this.encryptECB(data);
				if (this.mode === "cbc")  return this.encryptCBC(data, iv);
				throw new Error("BF: unknown cipher mode");
			},
			decrypt: function(data, iv) {
				if (this.mode === "ecb")  return this.decryptECB(data);
				if (this.mode === "cbc")  return this.decryptCBC(data, iv);
				throw new Error("BF: unknown cipher mode");
			},
			encryptECB: function(data) {
				var blocks = Math.ceil(data.length/8);
				var encrypted = [];
				for (var i = 0; i < blocks; i++) {
					var block = data.slice(i * 8, (i+1) * 8);
					if (block.length < 8) throw new Error('BF: data length not multiple of 8'); // var count = 8 - block.length; while (0 < count--) block += "\0";
					var xL, xR;
					var xLxR  = this.split64by32(block); xL = xLxR[0]; xR = xLxR[1];
					xLxR = this.encipher(xL, xR);        xL = xLxR[0]; xR = xLxR[1];
					if (data instanceof Uint8Array) {
						data.set(this.num2block32(xL), i * 8);
						data.set(this.num2block32(xR), i * 8 + 4);
					}
					else encrypted = encrypted.concat(this.num2block32(xL), this.num2block32(xR));
				}
				if (!(data instanceof Uint8Array))  return encrypted;
			},
			encryptCBC: function(data, iv) {
				var blocks = Math.ceil(data.length/8);
				var ivL, ivR, ivLivR;
				ivLivR = this.split64by32(iv); ivL = ivLivR[0]; ivR = ivLivR[1];
				var encrypted = [];
				for (var i = 0; i < blocks; i++) {
					var block = data.slice(i * 8, (i+1) * 8);
					if (block.length < 8) throw new Error('BF: data length not multiple of 8'); // var count = 8 - block.length; while (0 < count--) block += "\0";
					var xL, xR, xLxR;
					xLxR = this.split64by32(block); xL = xLxR[0]; xR = xLxR[1];
					xL = this.xor(xL, ivL); xR = this.xor(xR, ivR);
					xLxR = this.encipher(xL, xR);   xL = xLxR[0]; xR = xLxR[1];
					ivL = xL; ivR = xR;
					if (data instanceof Uint8Array) {
						data.set(this.num2block32(xL), i * 8);
						data.set(this.num2block32(xR), i * 8 + 4);
					}
					else encrypted = encrypted.concat(this.num2block32(xL), this.num2block32(xR));
				}
				if (!(data instanceof Uint8Array))  return encrypted;
			},
			decryptECB: function(data) {
				var blocks = Math.ceil(data.length/8);
				var decrypted = [];
				for (var i = 0; i < blocks; i++) {
					var block = data.slice(i * 8, (i+1) * 8);
					if (block.length < 8)  throw new Error('BF: ciphertext too short (must be multiple of 8 bytes)');
					var xL, xR, xLxR;
					xLxR = this.split64by32(block); xL = xLxR[0]; xR = xLxR[1];
					xLxR = this.decipher(xL, xR);   xL = xLxR[0]; xR = xLxR[1];
					if (data instanceof Uint8Array) {
						data.set(this.num2block32(xL), i * 8);
						data.set(this.num2block32(xR), i * 8 + 4);
					}
					else decrypted = decrypted.concat(this.num2block32(xL), this.num2block32(xR));
				}
				if (!(data instanceof Uint8Array))  return decrypted;
			},
			decryptCBC: function(data, iv) {
				var blocks = Math.ceil(data.length/8);
				var ivL, ivR, ivLtmp, ivRtmp, ivLivR;
				ivLivR = this.split64by32(iv); ivL = ivLivR[0]; ivR = ivLivR[1];
				var decrypted = [];
				for (var i = 0; i < blocks; i++) {
					var block = data.slice(i * 8, (i+1) * 8);
					if (block.length < 8) throw new Error('BF: ciphertext too short (must be multiple of 8 bytes)');
					var xL, xR, xLxR;
					xLxR = this.split64by32(block); xL = xLxR[0]; xR = xLxR[1];
					ivLtmp = xL; ivRtmp = xR;
					xLxR = this.decipher(xL, xR);   xL = xLxR[0]; xR = xLxR[1];
					xL = this.xor(xL, ivL); xR = this.xor(xR, ivR);
					ivL = ivLtmp; ivR = ivRtmp;
					if (data instanceof Uint8Array) {
						data.set(this.num2block32(xL), i * 8);
						data.set(this.num2block32(xR), i * 8 + 4);
					}
					else decrypted = decrypted.concat(this.num2block32(xL), this.num2block32(xR));
				}
				if (!(data instanceof Uint8Array))  return decrypted;
			},
			F: function(xL) {
				var a = xL >>> 24; var b = xL << 8 >>> 24; var c = xL << 16 >>> 24; var d = xL << 24 >>> 24;
				var res = this.addMod32(this.sBox0[a], this.sBox1[b]); res = this.xor(res, this.sBox2[c]); res = this.addMod32(res, this.sBox3[d]);
				return res;
			},
			encipher: function(xL, xR) {
				var tmp;
				for (var i = 0; i < 16; i++) {
					xL = this.xor(xL, this.pArray[i]); xR = this.xor(this.F(xL), xR);
					tmp = xL; xL = xR; xR = tmp;
				}
				tmp = xL; xL = xR; xR = tmp;
				xR = this.xor(xR, this.pArray[16]); xL = this.xor(xL, this.pArray[17]);
				return [xL, xR];
			},
			decipher: function(xL, xR) {
				var tmp;
				xL = this.xor(xL, this.pArray[17]); xR = this.xor(xR, this.pArray[16]);
				tmp = xL; xL = xR; xR = tmp;
				for (var i = 15; i >= 0; i--) {
					tmp = xL; xL = xR; xR = tmp;
					xR = this.xor(this.F(xL), xR); xL = this.xor(xL, this.pArray[i]);
				}
				return [xL, xR];
			},
			generateSubkeys: function(key) {
				var data = 0; var k = 0; var i, j;
				for (i = 0; i < 18; i++) {
					for (j = 4; j > 0; j--) { data = this.fixNegative(data << 8 | key[k]);  k = (k + 1) % key.length; }
					this.pArray[i] = this.xor(this.pArray[i], data);
					data = 0;
				}
				//var block64 = num2block32(0) + num2block32(0);
				var block64 = [0, 0];
				for (i = 0; i <  18; i += 2) { block64 = this.encipher(block64[0], block64[1]);  this.pArray[i] = block64[0];  this.pArray[i + 1] = block64[1]; }
				for (i = 0; i < 256; i += 2) { block64 = this.encipher(block64[0], block64[1]);  this.sBox0[i]  = block64[0];  this.sBox0[i + 1]  = block64[1]; }
				for (i = 0; i < 256; i += 2) { block64 = this.encipher(block64[0], block64[1]);  this.sBox1[i]  = block64[0];  this.sBox1[i + 1]  = block64[1]; }
				for (i = 0; i < 256; i += 2) { block64 = this.encipher(block64[0], block64[1]);  this.sBox2[i]  = block64[0];  this.sBox2[i + 1]  = block64[1]; }
				for (i = 0; i < 256; i += 2) { block64 = this.encipher(block64[0], block64[1]);  this.sBox3[i]  = block64[0];  this.sBox3[i + 1]  = block64[1]; }
			},
			block32toNum: function (block32) { return this.fixNegative(block32[0] << 24 | block32[1] << 16 | block32[2] << 8 | block32[3]); },
			num2block32: (num)    => [num >>> 24, num << 8 >>> 24, num << 16 >>> 24, num << 24 >>> 24],
			xor:          function (a, b)    { return this.fixNegative(a ^ b); },
			addMod32:     function (a, b)    { return this.fixNegative((a + b) | 0); },  // | 0 Ð¿Ñ€Ð¸Ð²Ð¾Ð´Ð¸Ñ‚ Ðº 32Ð±Ð¸Ñ‚Ð½Ð¾Ð¼Ñƒ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸ÑŽ
			fixNegative: (number) => (number >>> 0),
			split64by32:  function (block64) { return [this.block32toNum(block64.slice(0,4)), this.block32toNum(block64.slice(4,8))]; },
			trimZeros: (input) => input.replace(/\0+$/g, "")
		};
		Blowfish.pArray = [0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0, 0x082efa98, 0xec4e6c89, 0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c, 0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917, 0x9216d5d9, 0x8979fb1b];
		Blowfish.sBox0 = [0xd1310ba6, 0x98dfb5ac, 0x2ffd72db, 0xd01adfb7, 0xb8e1afed, 0x6a267e96, 0xba7c9045, 0xf12c7f99, 0x24a19947, 0xb3916cf7, 0x0801f2e2, 0x858efc16, 0x636920d8, 0x71574e69, 0xa458fea3, 0xf4933d7e, 0x0d95748f, 0x728eb658, 0x718bcd58, 0x82154aee, 0x7b54a41d, 0xc25a59b5, 0x9c30d539, 0x2af26013, 0xc5d1b023, 0x286085f0, 0xca417918, 0xb8db38ef, 0x8e79dcb0, 0x603a180e, 0x6c9e0e8b, 0xb01e8a3e, 0xd71577c1, 0xbd314b27, 0x78af2fda, 0x55605c60, 0xe65525f3, 0xaa55ab94, 0x57489862, 0x63e81440, 0x55ca396a, 0x2aab10b6, 0xb4cc5c34, 0x1141e8ce, 0xa15486af, 0x7c72e993, 0xb3ee1411, 0x636fbc2a, 0x2ba9c55d, 0x741831f6, 0xce5c3e16, 0x9b87931e, 0xafd6ba33, 0x6c24cf5c, 0x7a325381, 0x28958677, 0x3b8f4898, 0x6b4bb9af, 0xc4bfe81b, 0x66282193, 0x61d809cc, 0xfb21a991, 0x487cac60, 0x5dec8032, 0xef845d5d, 0xe98575b1, 0xdc262302, 0xeb651b88, 0x23893e81, 0xd396acc5, 0x0f6d6ff3, 0x83f44239, 0x2e0b4482, 0xa4842004, 0x69c8f04a, 0x9e1f9b5e, 0x21c66842, 0xf6e96c9a, 0x670c9c61, 0xabd388f0, 0x6a51a0d2, 0xd8542f68, 0x960fa728, 0xab5133a3, 0x6eef0b6c, 0x137a3be4, 0xba3bf050, 0x7efb2a98, 0xa1f1651d, 0x39af0176, 0x66ca593e, 0x82430e88, 0x8cee8619, 0x456f9fb4, 0x7d84a5c3, 0x3b8b5ebe, 0xe06f75d8, 0x85c12073, 0x401a449f, 0x56c16aa6, 0x4ed3aa62, 0x363f7706, 0x1bfedf72, 0x429b023d, 0x37d0d724, 0xd00a1248, 0xdb0fead3, 0x49f1c09b, 0x075372c9, 0x80991b7b, 0x25d479d8, 0xf6e8def7, 0xe3fe501a, 0xb6794c3b, 0x976ce0bd, 0x04c006ba, 0xc1a94fb6, 0x409f60c4, 0x5e5c9ec2, 0x196a2463, 0x68fb6faf, 0x3e6c53b5, 0x1339b2eb, 0x3b52ec6f, 0x6dfc511f, 0x9b30952c, 0xcc814544, 0xaf5ebd09, 0xbee3d004, 0xde334afd, 0x660f2807, 0x192e4bb3, 0xc0cba857, 0x45c8740f, 0xd20b5f39, 0xb9d3fbdb, 0x5579c0bd, 0x1a60320a, 0xd6a100c6, 0x402c7279, 0x679f25fe, 0xfb1fa3cc, 0x8ea5e9f8, 0xdb3222f8, 0x3c7516df, 0xfd616b15, 0x2f501ec8, 0xad0552ab, 0x323db5fa, 0xfd238760, 0x53317b48, 0x3e00df82, 0x9e5c57bb, 0xca6f8ca0, 0x1a87562e, 0xdf1769db, 0xd542a8f6, 0x287effc3, 0xac6732c6, 0x8c4f5573, 0x695b27b0, 0xbbca58c8, 0xe1ffa35d, 0xb8f011a0, 0x10fa3d98, 0xfd2183b8, 0x4afcb56c, 0x2dd1d35b, 0x9a53e479, 0xb6f84565, 0xd28e49bc, 0x4bfb9790, 0xe1ddf2da, 0xa4cb7e33, 0x62fb1341, 0xcee4c6e8, 0xef20cada, 0x36774c01, 0xd07e9efe, 0x2bf11fb4, 0x95dbda4d, 0xae909198, 0xeaad8e71, 0x6b93d5a0, 0xd08ed1d0, 0xafc725e0, 0x8e3c5b2f, 0x8e7594b7, 0x8ff6e2fb, 0xf2122b64, 0x8888b812, 0x900df01c, 0x4fad5ea0, 0x688fc31c, 0xd1cff191, 0xb3a8c1ad, 0x2f2f2218, 0xbe0e1777, 0xea752dfe, 0x8b021fa1, 0xe5a0cc0f, 0xb56f74e8, 0x18acf3d6, 0xce89e299, 0xb4a84fe0, 0xfd13e0b7, 0x7cc43b81, 0xd2ada8d9, 0x165fa266, 0x80957705, 0x93cc7314, 0x211a1477, 0xe6ad2065, 0x77b5fa86, 0xc75442f5, 0xfb9d35cf, 0xebcdaf0c, 0x7b3e89a0, 0xd6411bd3, 0xae1e7e49, 0x00250e2d, 0x2071b35e, 0x226800bb, 0x57b8e0af, 0x2464369b, 0xf009b91e, 0x5563911d, 0x59dfa6aa, 0x78c14389, 0xd95a537f, 0x207d5ba2, 0x02e5b9c5, 0x83260376, 0x6295cfa9, 0x11c81968, 0x4e734a41, 0xb3472dca, 0x7b14a94a, 0x1b510052, 0x9a532915, 0xd60f573f, 0xbc9bc6e4, 0x2b60a476, 0x81e67400, 0x08ba6fb5, 0x571be91f, 0xf296ec6b, 0x2a0dd915, 0xb6636521, 0xe7b9f9b6, 0xff34052e, 0xc5855664, 0x53b02d5d, 0xa99f8fa1, 0x08ba4799, 0x6e85076a];
		Blowfish.sBox1 = [0x4b7a70e9, 0xb5b32944, 0xdb75092e, 0xc4192623, 0xad6ea6b0, 0x49a7df7d, 0x9cee60b8, 0x8fedb266, 0xecaa8c71, 0x699a17ff, 0x5664526c, 0xc2b19ee1, 0x193602a5, 0x75094c29, 0xa0591340, 0xe4183a3e, 0x3f54989a, 0x5b429d65, 0x6b8fe4d6, 0x99f73fd6, 0xa1d29c07, 0xefe830f5, 0x4d2d38e6, 0xf0255dc1, 0x4cdd2086, 0x8470eb26, 0x6382e9c6, 0x021ecc5e, 0x09686b3f, 0x3ebaefc9, 0x3c971814, 0x6b6a70a1, 0x687f3584, 0x52a0e286, 0xb79c5305, 0xaa500737, 0x3e07841c, 0x7fdeae5c, 0x8e7d44ec, 0x5716f2b8, 0xb03ada37, 0xf0500c0d, 0xf01c1f04, 0x0200b3ff, 0xae0cf51a, 0x3cb574b2, 0x25837a58, 0xdc0921bd, 0xd19113f9, 0x7ca92ff6, 0x94324773, 0x22f54701, 0x3ae5e581, 0x37c2dadc, 0xc8b57634, 0x9af3dda7, 0xa9446146, 0x0fd0030e, 0xecc8c73e, 0xa4751e41, 0xe238cd99, 0x3bea0e2f, 0x3280bba1, 0x183eb331, 0x4e548b38, 0x4f6db908, 0x6f420d03, 0xf60a04bf, 0x2cb81290, 0x24977c79, 0x5679b072, 0xbcaf89af, 0xde9a771f, 0xd9930810, 0xb38bae12, 0xdccf3f2e, 0x5512721f, 0x2e6b7124, 0x501adde6, 0x9f84cd87, 0x7a584718, 0x7408da17, 0xbc9f9abc, 0xe94b7d8c, 0xec7aec3a, 0xdb851dfa, 0x63094366, 0xc464c3d2, 0xef1c1847, 0x3215d908, 0xdd433b37, 0x24c2ba16, 0x12a14d43, 0x2a65c451, 0x50940002, 0x133ae4dd, 0x71dff89e, 0x10314e55, 0x81ac77d6, 0x5f11199b, 0x043556f1, 0xd7a3c76b, 0x3c11183b, 0x5924a509, 0xf28fe6ed, 0x97f1fbfa, 0x9ebabf2c, 0x1e153c6e, 0x86e34570, 0xeae96fb1, 0x860e5e0a, 0x5a3e2ab3, 0x771fe71c, 0x4e3d06fa, 0x2965dcb9, 0x99e71d0f, 0x803e89d6, 0x5266c825, 0x2e4cc978, 0x9c10b36a, 0xc6150eba, 0x94e2ea78, 0xa5fc3c53, 0x1e0a2df4, 0xf2f74ea7, 0x361d2b3d, 0x1939260f, 0x19c27960, 0x5223a708, 0xf71312b6, 0xebadfe6e, 0xeac31f66, 0xe3bc4595, 0xa67bc883, 0xb17f37d1, 0x018cff28, 0xc332ddef, 0xbe6c5aa5, 0x65582185, 0x68ab9802, 0xeecea50f, 0xdb2f953b, 0x2aef7dad, 0x5b6e2f84, 0x1521b628, 0x29076170, 0xecdd4775, 0x619f1510, 0x13cca830, 0xeb61bd96, 0x0334fe1e, 0xaa0363cf, 0xb5735c90, 0x4c70a239, 0xd59e9e0b, 0xcbaade14, 0xeecc86bc, 0x60622ca7, 0x9cab5cab, 0xb2f3846e, 0x648b1eaf, 0x19bdf0ca, 0xa02369b9, 0x655abb50, 0x40685a32, 0x3c2ab4b3, 0x319ee9d5, 0xc021b8f7, 0x9b540b19, 0x875fa099, 0x95f7997e, 0x623d7da8, 0xf837889a, 0x97e32d77, 0x11ed935f, 0x16681281, 0x0e358829, 0xc7e61fd6, 0x96dedfa1, 0x7858ba99, 0x57f584a5, 0x1b227263, 0x9b83c3ff, 0x1ac24696, 0xcdb30aeb, 0x532e3054, 0x8fd948e4, 0x6dbc3128, 0x58ebf2ef, 0x34c6ffea, 0xfe28ed61, 0xee7c3c73, 0x5d4a14d9, 0xe864b7e3, 0x42105d14, 0x203e13e0, 0x45eee2b6, 0xa3aaabea, 0xdb6c4f15, 0xfacb4fd0, 0xc742f442, 0xef6abbb5, 0x654f3b1d, 0x41cd2105, 0xd81e799e, 0x86854dc7, 0xe44b476a, 0x3d816250, 0xcf62a1f2, 0x5b8d2646, 0xfc8883a0, 0xc1c7b6a3, 0x7f1524c3, 0x69cb7492, 0x47848a0b, 0x5692b285, 0x095bbf00, 0xad19489d, 0x1462b174, 0x23820e00, 0x58428d2a, 0x0c55f5ea, 0x1dadf43e, 0x233f7061, 0x3372f092, 0x8d937e41, 0xd65fecf1, 0x6c223bdb, 0x7cde3759, 0xcbee7460, 0x4085f2a7, 0xce77326e, 0xa6078084, 0x19f8509e, 0xe8efd855, 0x61d99735, 0xa969a7aa, 0xc50c06c2, 0x5a04abfc, 0x800bcadc, 0x9e447a2e, 0xc3453484, 0xfdd56705, 0x0e1e9ec9, 0xdb73dbd3, 0x105588cd, 0x675fda79, 0xe3674340, 0xc5c43465, 0x713e38d8, 0x3d28f89e, 0xf16dff20, 0x153e21e7, 0x8fb03d4a, 0xe6e39f2b, 0xdb83adf7];
		Blowfish.sBox2 = [0xe93d5a68, 0x948140f7, 0xf64c261c, 0x94692934, 0x411520f7, 0x7602d4f7, 0xbcf46b2e, 0xd4a20068, 0xd4082471, 0x3320f46a, 0x43b7d4b7, 0x500061af, 0x1e39f62e, 0x97244546, 0x14214f74, 0xbf8b8840, 0x4d95fc1d, 0x96b591af, 0x70f4ddd3, 0x66a02f45, 0xbfbc09ec, 0x03bd9785, 0x7fac6dd0, 0x31cb8504, 0x96eb27b3, 0x55fd3941, 0xda2547e6, 0xabca0a9a, 0x28507825, 0x530429f4, 0x0a2c86da, 0xe9b66dfb, 0x68dc1462, 0xd7486900, 0x680ec0a4, 0x27a18dee, 0x4f3ffea2, 0xe887ad8c, 0xb58ce006, 0x7af4d6b6, 0xaace1e7c, 0xd3375fec, 0xce78a399, 0x406b2a42, 0x20fe9e35, 0xd9f385b9, 0xee39d7ab, 0x3b124e8b, 0x1dc9faf7, 0x4b6d1856, 0x26a36631, 0xeae397b2, 0x3a6efa74, 0xdd5b4332, 0x6841e7f7, 0xca7820fb, 0xfb0af54e, 0xd8feb397, 0x454056ac, 0xba489527, 0x55533a3a, 0x20838d87, 0xfe6ba9b7, 0xd096954b, 0x55a867bc, 0xa1159a58, 0xcca92963, 0x99e1db33, 0xa62a4a56, 0x3f3125f9, 0x5ef47e1c, 0x9029317c, 0xfdf8e802, 0x04272f70, 0x80bb155c, 0x05282ce3, 0x95c11548, 0xe4c66d22, 0x48c1133f, 0xc70f86dc, 0x07f9c9ee, 0x41041f0f, 0x404779a4, 0x5d886e17, 0x325f51eb, 0xd59bc0d1, 0xf2bcc18f, 0x41113564, 0x257b7834, 0x602a9c60, 0xdff8e8a3, 0x1f636c1b, 0x0e12b4c2, 0x02e1329e, 0xaf664fd1, 0xcad18115, 0x6b2395e0, 0x333e92e1, 0x3b240b62, 0xeebeb922, 0x85b2a20e, 0xe6ba0d99, 0xde720c8c, 0x2da2f728, 0xd0127845, 0x95b794fd, 0x647d0862, 0xe7ccf5f0, 0x5449a36f, 0x877d48fa, 0xc39dfd27, 0xf33e8d1e, 0x0a476341, 0x992eff74, 0x3a6f6eab, 0xf4f8fd37, 0xa812dc60, 0xa1ebddf8, 0x991be14c, 0xdb6e6b0d, 0xc67b5510, 0x6d672c37, 0x2765d43b, 0xdcd0e804, 0xf1290dc7, 0xcc00ffa3, 0xb5390f92, 0x690fed0b, 0x667b9ffb, 0xcedb7d9c, 0xa091cf0b, 0xd9155ea3, 0xbb132f88, 0x515bad24, 0x7b9479bf, 0x763bd6eb, 0x37392eb3, 0xcc115979, 0x8026e297, 0xf42e312d, 0x6842ada7, 0xc66a2b3b, 0x12754ccc, 0x782ef11c, 0x6a124237, 0xb79251e7, 0x06a1bbe6, 0x4bfb6350, 0x1a6b1018, 0x11caedfa, 0x3d25bdd8, 0xe2e1c3c9, 0x44421659, 0x0a121386, 0xd90cec6e, 0xd5abea2a, 0x64af674e, 0xda86a85f, 0xbebfe988, 0x64e4c3fe, 0x9dbc8057, 0xf0f7c086, 0x60787bf8, 0x6003604d, 0xd1fd8346, 0xf6381fb0, 0x7745ae04, 0xd736fccc, 0x83426b33, 0xf01eab71, 0xb0804187, 0x3c005e5f, 0x77a057be, 0xbde8ae24, 0x55464299, 0xbf582e61, 0x4e58f48f, 0xf2ddfda2, 0xf474ef38, 0x8789bdc2, 0x5366f9c3, 0xc8b38e74, 0xb475f255, 0x46fcd9b9, 0x7aeb2661, 0x8b1ddf84, 0x846a0e79, 0x915f95e2, 0x466e598e, 0x20b45770, 0x8cd55591, 0xc902de4c, 0xb90bace1, 0xbb8205d0, 0x11a86248, 0x7574a99e, 0xb77f19b6, 0xe0a9dc09, 0x662d09a1, 0xc4324633, 0xe85a1f02, 0x09f0be8c, 0x4a99a025, 0x1d6efe10, 0x1ab93d1d, 0x0ba5a4df, 0xa186f20f, 0x2868f169, 0xdcb7da83, 0x573906fe, 0xa1e2ce9b, 0x4fcd7f52, 0x50115e01, 0xa70683fa, 0xa002b5c4, 0x0de6d027, 0x9af88c27, 0x773f8641, 0xc3604c06, 0x61a806b5, 0xf0177a28, 0xc0f586e0, 0x006058aa, 0x30dc7d62, 0x11e69ed7, 0x2338ea63, 0x53c2dd94, 0xc2c21634, 0xbbcbee56, 0x90bcb6de, 0xebfc7da1, 0xce591d76, 0x6f05e409, 0x4b7c0188, 0x39720a3d, 0x7c927c24, 0x86e3725f, 0x724d9db9, 0x1ac15bb4, 0xd39eb8fc, 0xed545578, 0x08fca5b5, 0xd83d7cd3, 0x4dad0fc4, 0x1e50ef5e, 0xb161e6f8, 0xa28514d9, 0x6c51133c, 0x6fd5c7e7, 0x56e14ec4, 0x362abfce, 0xddc6c837, 0xd79a3234, 0x92638212, 0x670efa8e, 0x406000e0];
		Blowfish.sBox3 = [0x3a39ce37, 0xd3faf5cf, 0xabc27737, 0x5ac52d1b, 0x5cb0679e, 0x4fa33742, 0xd3822740, 0x99bc9bbe, 0xd5118e9d, 0xbf0f7315, 0xd62d1c7e, 0xc700c47b, 0xb78c1b6b, 0x21a19045, 0xb26eb1be, 0x6a366eb4, 0x5748ab2f, 0xbc946e79, 0xc6a376d2, 0x6549c2c8, 0x530ff8ee, 0x468dde7d, 0xd5730a1d, 0x4cd04dc6, 0x2939bbdb, 0xa9ba4650, 0xac9526e8, 0xbe5ee304, 0xa1fad5f0, 0x6a2d519a, 0x63ef8ce2, 0x9a86ee22, 0xc089c2b8, 0x43242ef6, 0xa51e03aa, 0x9cf2d0a4, 0x83c061ba, 0x9be96a4d, 0x8fe51550, 0xba645bd6, 0x2826a2f9, 0xa73a3ae1, 0x4ba99586, 0xef5562e9, 0xc72fefd3, 0xf752f7da, 0x3f046f69, 0x77fa0a59, 0x80e4a915, 0x87b08601, 0x9b09e6ad, 0x3b3ee593, 0xe990fd5a, 0x9e34d797, 0x2cf0b7d9, 0x022b8b51, 0x96d5ac3a, 0x017da67d, 0xd1cf3ed6, 0x7c7d2d28, 0x1f9f25cf, 0xadf2b89b, 0x5ad6b472, 0x5a88f54c, 0xe029ac71, 0xe019a5e6, 0x47b0acfd, 0xed93fa9b, 0xe8d3c48d, 0x283b57cc, 0xf8d56629, 0x79132e28, 0x785f0191, 0xed756055, 0xf7960e44, 0xe3d35e8c, 0x15056dd4, 0x88f46dba, 0x03a16125, 0x0564f0bd, 0xc3eb9e15, 0x3c9057a2, 0x97271aec, 0xa93a072a, 0x1b3f6d9b, 0x1e6321f5, 0xf59c66fb, 0x26dcf319, 0x7533d928, 0xb155fdf5, 0x03563482, 0x8aba3cbb, 0x28517711, 0xc20ad9f8, 0xabcc5167, 0xccad925f, 0x4de81751, 0x3830dc8e, 0x379d5862, 0x9320f991, 0xea7a90c2, 0xfb3e7bce, 0x5121ce64, 0x774fbe32, 0xa8b6e37e, 0xc3293d46, 0x48de5369, 0x6413e680, 0xa2ae0810, 0xdd6db224, 0x69852dfd, 0x09072166, 0xb39a460a, 0x6445c0dd, 0x586cdecf, 0x1c20c8ae, 0x5bbef7dd, 0x1b588d40, 0xccd2017f, 0x6bb4e3bb, 0xdda26a7e, 0x3a59ff45, 0x3e350a44, 0xbcb4cdd5, 0x72eacea8, 0xfa6484bb, 0x8d6612ae, 0xbf3c6f47, 0xd29be463, 0x542f5d9e, 0xaec2771b, 0xf64e6370, 0x740e0d8d, 0xe75b1357, 0xf8721671, 0xaf537d5d, 0x4040cb08, 0x4eb4e2cc, 0x34d2466a, 0x0115af84, 0xe1b00428, 0x95983a1d, 0x06b89fb4, 0xce6ea048, 0x6f3f3b82, 0x3520ab82, 0x011a1d4b, 0x277227f8, 0x611560b1, 0xe7933fdc, 0xbb3a792b, 0x344525bd, 0xa08839e1, 0x51ce794b, 0x2f32c9b7, 0xa01fbac9, 0xe01cc87e, 0xbcc7d1f6, 0xcf0111c3, 0xa1e8aac7, 0x1a908749, 0xd44fbd9a, 0xd0dadecb, 0xd50ada38, 0x0339c32a, 0xc6913667, 0x8df9317c, 0xe0b12b4f, 0xf79e59b7, 0x43f5bb3a, 0xf2d519ff, 0x27d9459c, 0xbf97222c, 0x15e6fc2a, 0x0f91fc71, 0x9b941525, 0xfae59361, 0xceb69ceb, 0xc2a86459, 0x12baa8d1, 0xb6c1075e, 0xe3056a0c, 0x10d25065, 0xcb03a442, 0xe0ec6e0e, 0x1698db3b, 0x4c98a0be, 0x3278e964, 0x9f1f9532, 0xe0d392df, 0xd3a0342b, 0x8971f21e, 0x1b0a7441, 0x4ba3348c, 0xc5be7120, 0xc37632d8, 0xdf359f8d, 0x9b992f2e, 0xe60b6f47, 0x0fe3f11d, 0xe54cda54, 0x1edad891, 0xce6279cf, 0xcd3e7e6f, 0x1618b166, 0xfd2c1d05, 0x848fd2c5, 0xf6fb2299, 0xf523f357, 0xa6327623, 0x93a83531, 0x56cccd02, 0xacf08162, 0x5a75ebb5, 0x6e163697, 0x88d273cc, 0xde966292, 0x81b949d0, 0x4c50901b, 0x71c65614, 0xe6c6c7bd, 0x327a140a, 0x45e1d006, 0xc3f27b9a, 0xc9aa53fd, 0x62a80f00, 0xbb25bfe2, 0x35bdd2f6, 0x71126905, 0xb2040222, 0xb6cbcf7c, 0xcd769c2b, 0x53113ec0, 0x1640e3d3, 0x38abbd60, 0x2547adf0, 0xba38209c, 0xf746ce76, 0x77afa1c5, 0x20756060, 0x85cbfe4e, 0x8ae88dd8, 0x7aaaf9b0, 0x4cf9aa7e, 0x1948c25c, 0x02fb8a8c, 0x01c36ae4, 0xd6ebe1f9, 0x90d4f869, 0xa65cdea0, 0x3f09252d, 0xc208e69f, 0xb74e6132, 0xce77e25b, 0x578fdfe3, 0x3ac372e6];

		function xhrProgress(e, userdata) {
			if (e.lengthComputable) {
				var percent = e.loaded * 100.0 / e.total;
				postMessage([userdata, 'Downloading ' + Math.floor(percent) + '%']);
			} else {
				postMessage([userdata, 'Downloading ' + Math.round(e.loaded * 10.0 / 1024 / 1024) / 10.0 + 'M']);
			}
		}

		function xhrComplete(e, key, userdata, obj) {
			postMessage([userdata, 'Decrypting']);
			var data = new Uint8Array(e.target.response);
			//var dd = '';
			var L=data.length;
// console.log("Data length", data.length);
			for (var i=0; i<L; i+=6144) {
				if (i % (6144*20) == 6144*19) // let it display state at every 120K
					postMessage([userdata, 'Decrypting ' + Math.floor(i * 100.0 / L) + '%']);
				if (i+2048<=L) {
					var D = data.slice(i, i+2048); //data.substr(i, 2048);
					var bf = new Blowfish(key, 'cbc');
					//var DD =
					bf.decrypt(D, [0,1,2,3,4,5,6,7]);
// if (i==0){ console.log( D.toString(), D.length ); }
					data.set(D, i); //for (var j=0; j<2048; j++) data[i+j]=DD.charCodeAt(j);
					//dd += DD;
					//if (i+6144<L) dd += data.substr(i+2048, 4096);
					//else          dd += data.substr(i+2048);
				} // else { dd += data.substr(i); }
			}

			console.log(obj);
			const coverUrl = "https://e-cdns-images.dzcdn.net/images/cover/" + obj.ALB_PICTURE +  "/500x500.jpg";
			// Simulate a call to Dropbox or other service that can
			// return an image as an ArrayBuffer.

			var xhr = new XMLHttpRequest();

			// Use JSFiddle logo as a sample image to avoid complicating
			// this example with cross-domain issues.
			xhr.open( "GET", coverUrl, true );

			// Ask for the result as an ArrayBuffer.
			xhr.responseType = "arraybuffer";

			xhr.onload = function( e ) {
			    var coverArrayBuffer = new Uint8Array( this.response );
			    const songBuffer = data;
			    const writer = new ID3Writer(songBuffer);

				console.log(obj);
				console.log("TIT2:" + obj.SNG_TITLE);
				console.log("TPE2:" + obj.ART_NAME);
				console.log("TYER:" + parseInt(obj.PHYSICAL_RELEASE_DATE));
				console.log("TRCK:" + obj.TRACK_NUMBER);
				console.log("TPOS:" + obj.DISK_NUMBER);


				let TPE1;
				var mainartist = obj.SNG_CONTRIBUTORS.mainartist === undefined ? obj.SNG_CONTRIBUTORS.main_artist : obj.SNG_CONTRIBUTORS.mainartist;

				if(obj.SNG_CONTRIBUTORS.featuredartist !== undefined || obj.SNG_CONTRIBUTORS.featuredartist !== undefined){
					let featuredartist = obj.SNG_CONTRIBUTORS.featuredartist === undefined ? obj.SNG_CONTRIBUTORS.featured_artist : obj.SNG_CONTRIBUTORS.featuredartist
					 if(featuredartist.length > 0 && obj.SNG_CONTRIBUTORS.mainartist.length > 0){
				    	TPE1 = mainartist[0] + " feat. " + featuredartist[0];
				    	for(var i = 1, l = featuredartist.length; i < l; i++){
				    		TPE1 += " & " + featuredartist[i];
				    	}
				    }
				}else{
					TPE1 = mainartist === undefined ? obj.ART_NAME : mainartist[0];
				}

				TPE1 = [TPE1];

			    console.log("TPE1:" + TPE1);


			    writer.setFrame('TIT2', obj.SNG_TITLE)
					.setFrame('TPE1', TPE1)
					.setFrame('TPE2', obj.ART_NAME == null ? "" : obj.ART_NAME)
					.setFrame('TALB', obj.ALB_TITLE == null ? "" : obj.ALB_TITLE)
					.setFrame('TYER', isNaN(parseInt(obj.PHYSICAL_RELEASE_DATE)) ? null : parseInt(obj.PHYSICAL_RELEASE_DATE))
					.setFrame('TRCK', obj.TRACK_NUMBER == null ? "" : obj.TRACK_NUMBER)
					.setFrame('TPOS', obj.DISK_NUMBER == null ? "" : obj.ART_NAME)
					.setFrame('APIC', {
						type: 3,
						data: coverArrayBuffer,
						description: 'cover'
					});

	            writer.addTag();
	            data = writer.arrayBuffer

				var B = new Blob([data], {type:'audio/mpeg'});//dd
				var burl = URL.createObjectURL(B);
				postMessage([userdata, 'DONE', burl]);
			};

			xhr.send();
		}
		function xhrError(e, userdata) {
			postMessage([userdata, 'ERROR']);
		}
		function xhrCancelled(e, userdata) {
			postMessage([userdata, 'ABORT']);
		}

		self.onmessage = function(m) {
// console.log(m.origin, m.data);
			var url = m.data[0], key = m.data[1], userdata = m.data[2], obj = m.data[3];
			var rq = new XMLHttpRequest();
			rq.responseType = 'arraybuffer';
			rq.addEventListener('progress', function(e) { xhrProgress (e, userdata); }); // xhr.onprogress = xhrProgress;
			rq.addEventListener('load',     function(e) { xhrComplete (e, key, userdata, obj); });
			rq.addEventListener('error',    function(e) { xhrError (   e, userdata); });
			rq.addEventListener('abort',    function(e) { xhrCancelled(e, userdata); });

			rq.open('get', url);
			rq.send();
		};
	});

	// Downloader logic: URL encryption
	// W.aesjs = aesjs;
	var urlCryptor = new aesjs.ModeOfOperation.ecb(aesjs.util.convertStringToBytes('jo6aey6haid2Teih'));
	var hex2bin = function(h) { return aesjs.util.convertStringToBytes(h, 'hex'); };
	var bin2hex = function(b) { return aesjs.util.convertBytesToString(b, 'hex'); };
	var bin2str = function(b) { return b.map(c => String.fromCharCode(c)).join(''); }; //aesjs.util.convertBytesToString(b);
	var str2bin = function(s) { return s.split('').map(c => c.charCodeAt(0)); }; //aesjs.util.convertStringToBytes(s));
	var aesBS = 16;
	var zeroPad = function(b) {
		var l = b.length;
		if (l%aesBS!=0) {
			if (typeof(b) === 'string') b += '\0'.repeat(aesBS-(l%aesBS));
			else b = b.concat(Array.apply(null, Array(aesBS-(l%aesBS))).map(() => 0));
		}
		return b;
	};
	var zeroUnpad = (s => s.replace(/\0+$/, ''));
	var urlsep='\xa4';
	function decryptURL(url, raw){
		var i = url.lastIndexOf('/');
		if (i>=0)
			url = url.substr(i+1);
		var decrypted = zeroUnpad(bin2str(urlCryptor.decrypt(hex2bin(url)))).split(urlsep);
		if (raw) return decrypted;
		if (hasTrack(decrypted[3])) return getTrack(decrypted[3]);
		return {SNG_ID:decrypted[3], MD5_ORIGIN:decrypted[1], MEDIA_VERSION:decrypted[4], chosen_fmt:decrypted[2], h:decrypted[0], e:decrypted[5]};
	}
	function encryptURL(track, fmt){
		var str = [track.MD5_ORIGIN, fmt, track.SNG_ID, track.MEDIA_VERSION].join(urlsep);
		str = zeroPad([hex_md5(str), str, ''].join(urlsep));
		return bin2hex(urlCryptor.encrypt(str2bin(str)));
	}

	// Downloader logic: global variables and helper methods
	var fmtMisc=0, fmtLow=10, fmtLow32=11, fmtMed=1, fmtHQ=3, fmtFLAC=9;
	var flagTitle=1, flagArt=3, flagHash=16, flagVer=32, flagFmt=64;
	function generateName(track, fmt, flags){
		var name = track.SNG_TITLE;
		/*if ((flags & flagHash) == flagHash) name += '_' + track.MD5_ORIGIN;
		if ((flags & flagVer)  == flagVer)  name += '_v' + track.MEDIA_VERSION;
		if ((flags & flagTitle) == flagTitle) {
			name += ' ' + track.SNG_TITLE;
			if (track.VERSION && (track.VERSION != ''))
				name += ' ' + track.VERSION;
		}
		if ((flags & flagArt)  == flagArt)  name += ' - ' + track.ART_NAME;)*/
		if (fmt == fmtFLAC)
			name += '.flac';
		else if ((flags & flagFmt) == flagFmt) {
			switch(fmt) {
				case fmtMisc: name += '.default'; break;
				case fmtLow: name += '.lq'; break;
				case fmtLow32: name += '.32'; break;
				case fmtMed: name += '.sq'; break;
				case fmtHQ: name += '.hq'; break;
			}
			name += '.mp3';
		}
		else if (fmt >= 0)
			name += '.mp3';
		return name;
	}
	var bfGK = 'g4el58wc0zvf9na1';
	function bfGenKey2(h1, h2){
		var l=h1.length, s=[];
		for (var i=0; i<l; i++)  s.push(bfGK.charCodeAt(i) ^ h1.charCodeAt(i) ^ h2.charCodeAt(i));
		return s;
	}
	function bfGenKey(id, format){
		var h = hex_md5(id+'');
		var h1 = h.substr(0, 16), h2 = h.substr(16, 16);
		var k = bfGenKey2(h1, h2);
		if (!format) return k;
		return k.map(format == 'hex' ? (a => (a + 256).toString(16).substr(-2)) : (a => String.fromCharCode(a))).join('');
	}
	var trackDB = {};
	var urlDB = {};
	function hasTrack (id) { return trackDB.hasOwnProperty(id + ''); }
	function getTrack (id) { return hasTrack(id) ? trackDB[id + ''] : null; }
	function hasDownloaded (id, fmt) {
		if (!urlDB.hasOwnProperty(id + '')) return false;
		var urls = urlDB[id + ''];
		return urls.hasOwnProperty(fmt);
	}
	function getDownloaded (id, fmt) { return hasDownloaded(id, fmt) ? urlDB[id + ''][fmt] : null; }

	// Download entry point
	function dzDownload(obj, userdata, fmt, size){
//		var flags = flagHash | flagVer;
//		if (obj.SNG_TITLE) flags |= flagTitle;
//		if (obj.ART_NAME)  flags |= flagArt;
//		var name = generateName(obj, fmt, flags);
		var msg = [
			'https://e-cdns-proxy-' + obj.MD5_ORIGIN.charAt(0) + '.dzcdn.net' //W.location.origin
				+ '/mobile/1/' + encryptURL(obj, fmt),
			bfGenKey(obj.SNG_ID),
			userdata + ',' + fmt,
			obj
		];
//console.log(msg);
		mainWk.postMessage(msg);
	}

	// Downloader worker callback
	mainWk.onmessage = function (msg) {
		var userdata = msg.data[0].split(',');
		var elId = userdata[0];
		var fmt = userdata[1];
		var trackEl = D.querySelector('#' + elId);
		if (trackEl == null)
			return;
		var trackId = trackEl.dataset.trackId;
		var state = msg.data[1];
		if (state == 'DONE') {
			if (!hasTrack(trackId)) {
				console.log ('On download: MISSING TRACK INFO!', trackId);
				trackEl.querySelector('.status').style.display = 'none';
				trackEl.querySelector('.links').style.display = 'block';
				return;
			}
			if (!urlDB[trackId + ''])
				urlDB[trackId + ''] = {};
			urlDB[trackId + ''][fmt] = msg.data[2];

			var links = trackEl.querySelectorAll('a.dl');
			for (var i=0; i<links.length; i++) {
				if (links[i].dataset.fmt == fmt) {
					links[i].download = generateName(getTrack(trackId), fmt, window.dzDL.dlFlags);
					links[i].href = msg.data[2];
					W.setTimeout((function(l) { return function() { l.click(); }; })(links[i]), 10);
					break;
				}
			}
		}
		else if (state == 'ABORT') {
			console.log ('Download abort:', trackId, fmt);
		}
		else if (state == 'ERROR') {
			console.log ('Download ERROR!', trackId, fmt);
		}
		else {
			trackEl.querySelector('.status').innerHTML = state;
			return;
		}
		trackEl.querySelector('.status').style.display = 'none';
		trackEl.querySelector('.links').style.display = 'block';
	};

	// Downloader logic: HTML generator
	var rootEl = D.createElement('div');
	function getFilesize(track, fmt_name) {
		if (!track.hasOwnProperty('FILESIZE_' + fmt_name))
			return 0;
		if (track['FILESIZE_' + fmt_name] == "" || track['FILESIZE_' + fmt_name] == 0)
			return 0;
		var size = parseInt(track['FILESIZE_' + fmt_name]);
		return isNaN(size) ? 0 : size;
	}
	function generateDl(track, fmt_name, fmt_id, size) {
		var el = D.createElement('a');
		el.href = '#';
		el.className = 'dl';
		el.dataset.fmt = fmt_id;
		el.dataset.filesize = size;
		//el.dataset.trackUrl = "";
		el.innerHTML = fmt_name;
		el.title = 'size: ' + size;

		el.onclick = function() {
			var trackEl = this.parentElement.parentElement; // a <- links <- trackdl
			if (hasDownloaded(trackEl.dataset.trackId, this.dataset.fmt)) //(this.dataset.trackUrl != "")
				return true; // we already have a link. href should also be set.
			else {
				this.href = '#';
				this.removeAttribute('download');
			}
			if (!hasTrack(trackEl.dataset.trackId)) {
				console.log('NO INFORMATION ABOUT TRACK!', trackEl.dataset.trackId);
				return false;
			}
			var track = trackDB[trackEl.dataset.trackId + ''];
			trackEl.querySelector('.links').style.display = 'none';
			trackEl.querySelector('.status').style.display = 'block';
			dzDownload(track, trackEl.id, this.dataset.fmt, this.dataset.filesize);
			return false;
		};
		return el;
	}
	function generateTrackDiv(track, index) {
		trackDB[track.SNG_ID + ''] = track;

		var trackEl = D.createElement('div');
		trackEl.className = 'trackdl';
		trackEl.id = 'trackdl' + Math.floor(Math.random() * 900000 + 100000);
		trackEl.dataset.trackId = track.SNG_ID;
		//trackEl.dataset.trackUrl = "";

		var nameEl = D.createElement('span');
		nameEl.className = 'name';
		nameEl.innerHTML = (index ? index + '. ' : '') + generateName(track, -1, flagTitle | flagArt); // don't add extension here

		var linksEl = D.createElement('div');
		linksEl.className = 'links';
		linksEl.innerHTML = 'dl:';

		var statusEl = D.createElement('div');
		statusEl.className = 'status';
		statusEl.style.display = 'none';
		statusEl.innerHTML = 'Waiting for download...';

		var miscFilesize = 0;
		if (track.hasOwnProperty('FILESIZE') && track.FILESIZE != 0 && track.FILESIZE != "")
			miscFilesize = parseInt(track.FILESIZE);
		else miscFilesize = getFilesize(track, 'MISC');
		if (miscFilesize > 0)
			linksEl.appendChild(generateDl(track, 'default', fmtMisc, miscFilesize));
		if (getFilesize(track, 'MP3_32') > 0)
			linksEl.appendChild(generateDl(track, 'low(32)', fmtLow32, getFilesize(track, 'MP3_32')));
		if (getFilesize(track, 'MP3_64') > 0)
			linksEl.appendChild(generateDl(track, 'low(64)', fmtLow, getFilesize(track, 'MP3_64')));
		if (getFilesize(track, 'MP3_128') > 0)
			linksEl.appendChild(generateDl(track, 'standard', fmtMed, getFilesize(track, 'MP3_128')));
		// MP3_256
		if (getFilesize(track, 'MP3_320') > 0)
			linksEl.appendChild(generateDl(track, 'hq', fmtHQ, getFilesize(track, 'MP3_320')));
		if (getFilesize(track, 'FLAC') > 0)
			linksEl.appendChild(generateDl(track, 'flac', fmtFLAC, getFilesize(track, 'FLAC')));

		trackEl.appendChild(nameEl);
		trackEl.appendChild(linksEl);
		trackEl.appendChild(statusEl);
		trackEl.appendChild((function(){ var el = D.createElement('div'); el.className = 'endfloat'; return el; })());
		return trackEl;
	}

	// Entry points
	function deleteElement(id) {
		var trackEl = id;
		if (typeof(id) === 'string')
			trackEl = D.querySelector('#' + id);
		if (hasTrack(trackEl.dataset.trackId)) {
			var urls = urlDB[trackEl.dataset.trackId + ''];
			for (var fmt in urls)
				window.URL.revokeObjectURL(urls[fmt]);
		}
		trackEl.parentElement.removeChild(trackEl);
	}
	function addTrack(track) {
		var el = generateTrackDiv(track);
		var delEl = D.createElement('a');
		delEl.href='#';
		delEl.className='deltrack';
		delEl.onclick = function() { window.dzDL.deleteCustom(this.parentElement); };
		delEl.innerHTML = '[X]';
		el.insertBefore(el.children[0], delEl);
		D.querySelector('#dlcustomtracks').appendChild(el); //divCustomTracks
		return el.id; //el
	}
	function refreshTracklist() {
		// Clean up EVERYTHING
		if (divCurrentTrack != null) {
			deleteElement(divCurrentTrack);
			divCurrentTrack = null;
		}
		var tracks = divTracklist.querySelectorAll('.trackdl');
		for (var i=0; i<tracks.length; i++)
			deleteElement(tracks[i]);

		//rootEl.appendChild(elH1);
		if (W.dzPlayer) {
			var sng = W.dzPlayer.getCurrentSong();
			if (sng && sng.SNG_ID) {
				divCurrentTrack = generateTrackDiv(sng);
				rootEl//.appendChild
					.insertBefore(divCurrentTrack, elH2);
			}
		}
		//rootEl.appendChild(elH2);
		if (W.dzPlayer) {
			var list = W.dzPlayer.getTrackList();
			var current = W.dzPlayer.getTrackListIndex();
			if (list) {
				var digits = list.length.toString().length;
				for (var i=0; i<list.length; i++) {
					var trackDiv = generateTrackDiv(list[i], '0'.repeat(digits - (i+1).toString().length) + (i+1));
					if (i == current) trackDiv.classList.add('current');
					divTracklist.appendChild(trackDiv);
				}
			}
		}
		return false;
	}

	// Dat stylesheet.
	var css =
		  '.dltitle { font-weight: bold; padding-top: 3px; padding-bottom: 3px; color: #000000; }\n'
		+ '#dzdownloader { position: fixed; top: 0; z-index: 500; background: #cccccc; padding: 5px; max-height: 90%; overflow-y: auto }\n' // .dzdl
		+ '#dzdltrigger { position: fixed; left: 0; top: 0; z-index: 501; background: #cccccc; padding: 3px; text-align: right }\n'
		+ '.trackdl .name {}\n' + '.trackdl .status { float: right }\n' + '.trackdl .links { float: right }\n'
		+ '.trackdl:nth-child(even) { background: #dddddd }\n' + '.trackdl a.dl { margin-left: 4px }\n'
		+ '.trackdl.current { background: #bbffbb }\n' + '.trackdl a.dl[download] { color: #00aa00 }\n'
		+ '#dlrefresh { margin-left: 5px }\n' + '.deltrack { margin-right: 3px }\n' + '#dzdownloader .endfloat { clear: both }';
	var docHead = D.head || D.querySelector('head') || D.getElementsByTagName('head')[0];
	var style = D.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet)
		style.styleSheet.cssText = css;
	else
		style.appendChild(new Text(css)); // D.createTextNode
	docHead.appendChild(style);

	// The downloader panel
	rootEl.style.left = '220px';
	rootEl.id = 'dzdownloader';
	rootEl.className = 'dzdl';
	var elCombo = D.createElement('select');
	elCombo.title = 'Choose file naming';
	elCombo.innerHTML =
		'<option value="0">[ID]</option>' +
		'<option value="'+(flagTitle          )+'">[ID] Title</option>' +
		'<option value="'+(flagTitle | flagArt)+'">[ID] Title - Artist</option>' +
		'<option value="'+(            flagVer            )+'">[ID_v]</option>' +
		'<option value="'+(            flagVer | flagTitle)+'">[ID_v] Title</option>' +
		'<option value="'+(            flagVer | flagArt  )+'">[ID_v] Title - Artist</option>' +
		'<option value="'+(flagHash  | flagVer            )+'">[ID_hash_v]</option>' +
		'<option value="'+(flagHash  | flagVer | flagTitle)+'" selected>[ID_hash_v] Title</option>' +
		'<option value="'+(flagHash  | flagVer | flagArt  )+'">[ID_hash_v] Title - Artist</option>' +
		'<option value="'+(flagFmt            )+'">[ID].fmt</option>' +
		'<option value="'+(flagFmt | flagTitle)+'">[ID] Title.fmt</option>' +
		'<option value="'+(flagFmt | flagArt  )+'">[ID] Title - Artist.fmt</option>' +
		'<option value="'+(flagFmt |             flagVer            )+'">[ID_v].fmt</option>' +
		'<option value="'+(flagFmt |             flagVer | flagTitle)+'">[ID_v] Title.fmt</option>' +
		'<option value="'+(flagFmt |             flagVer | flagArt  )+'">[ID_v] Title - Artist.fmt</option>' +
		'<option value="'+(flagFmt | flagHash  | flagVer            )+'">[ID_hash_v].fmt</option>' +
		'<option value="'+(flagFmt | flagHash  | flagVer | flagTitle)+'">[ID_hash_v] Title.fmt</option>' +
		'<option value="'+(flagFmt | flagHash  | flagVer | flagArt  )+'">[ID_hash_v] Title - Artist.fmt</option>';
	elCombo.onclick = function () { window.dzDL.dlFlags = parseInt(this.value); };
	var elRefresh = D.createElement('a');
	elRefresh.id = 'dlrefresh';
	elRefresh.href = '#';
	elRefresh.innerHTML = 'refresh track list';
	elRefresh.onclick = function() { window.dzDL.refreshPlayer(); return false; };
	var elH1 = D.createElement('p'); elH1.className = 'dltitle';
	elH1.innerHTML = 'Current track';
	var elH2 = D.createElement('p'); elH2.className = 'dltitle';
	elH2.innerHTML = 'Tracklist';
	var elH3 = D.createElement('p'); elH3.className = 'dltitle';
	elH3.innerHTML = 'User-added tracks';
	var divCurrentTrack = null;
	var divTracklist = D.createElement('div');
	divTracklist.id = 'dltracklist';
	divTracklist.className = 'dllist';
	var divCustomTracks = D.createElement('div');
	divCustomTracks.id = 'dlcustomtracks';
	divCustomTracks.className = 'dllist';
	rootEl.style.display = 'none';
	rootEl.appendChild(elCombo); rootEl.appendChild(elRefresh);
	rootEl.appendChild(elH1);
	rootEl.appendChild(elH2); rootEl.appendChild(divTracklist);
	rootEl.appendChild(elH3); rootEl.appendChild(divCustomTracks);
	refreshTracklist(); W.setTimeout(refreshTracklist, 1000);
	var triggerEl = D.createElement('div');
	triggerEl.style.width = '214px'; //padding is 3 => 220 total
	triggerEl.id = 'dzdltrigger';
	triggerEl.innerHTML = 'Downloader >';
	triggerEl.onclick = function() {
		var el = window.document.querySelector('#dzdownloader');//rootEl
		if (el.style && el.style.display) {
			if (el.style.display == 'none') {
				el.style.display = 'block';
				this.innerHTML = 'Downloader <';
			} else {
				el.style.display = 'none';
				this.innerHTML = 'Downloader >';
			}
		}
	};

	D.body.appendChild(triggerEl);
	D.body.appendChild(rootEl);

	var dzDL = {
		// Constants
		DEFAULT: fmtMisc, MP3_64: fmtLow, MP3_32: fmtLow32, MP3: fmtMed, MP3_128: fmtMed, MP3_320: fmtHQ, HQ: fmtHQ, FLAC: fmtFLAC, LOSSLESS: fmtFLAC,
		WITH_TITLE: flagTitle, WITH_ART: flagArt, WITH_HASH: flagHash, WITH_VER: flagVer, WITH_FMT: flagFmt,
		NAME_DEFAULT: /*flagTitle |*/ flagArt, NAME_DB: flagHash | flagVer,

		// Configuration
		dlFlags: flagHash | flagVer | flagTitle,
		// Miscellaneous functions
		hasTrackInDB: hasTrack,             getTrackFromDB: getTrack,
		hasDownloadedTrack: hasDownloaded,  getDownloadedTrack: getDownloaded,
		generateFileName: generateName,
		// Entry points
		getFromURL: decryptURL,  makeURL: encryptURL,
		download: dzDownload,
		deleteCustom: deleteElement,  addCustom: addTrack,
		refreshPlayer: refreshTracklist
	};
	W.dzDL = dzDL; if (!W.dzHAX) W.dzHAX={}; W.dzHAX.dL = dzDL;
})(unsafeWindow, document); // window seems not to work here; does not set property, and 'window' not accessible from insode