// ==UserScript==
// @name         Deezer Drop
// @version      0.7.1
// @description  Simple tracks and playlists downloader from Deezer
// @updateURL    http://93.179.68.67/drop/drop.meta.js
// @downloadURL  http://93.179.68.67/drop/drop.user.js
// @include      http://www.deezer.com/*
// @include      https://www.deezer.com/*
// @require      https://cdn.jsdelivr.net/npm/aes-js@3.1.2/index.min.js
// @require      https://cdn.jsdelivr.net/npm/egoroof-blowfish@2.1.0/dist/blowfish.min.js
// @require      https://cdn.jsdelivr.net/npm/browser-id3-writer@4.1.0/dist/browser-id3-writer.min.js
// @require      https://cdn.jsdelivr.net/npm/spark-md5@3.0.0/spark-md5.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.0/dist/FileSaver.min.js
// @author       LittleCrabby
// @connect      deezer.com
// @connect      dzcdn.net
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @licence      MIT
// @copyright    2018, LittleCrabby (https://openuserjs.org/users/LittleCrabby)
// ==/UserScript==

(() => {
    'use strict';

    //Check if we are on Deezer App page. We don't want script to work on Deezer homepage for example.
    if (!document.getElementById('dzr-app')) {
        return;
    }

    const keys = {
        aesKey: "jo6aey6haid2Teih",
        bfIv: "\x00\x01\x02\x03\x04\x05\x06\x07",
        bfSecret: "g4el58wc0zvf9na1"
    };

    const urls = {
        apiUrl: "https://www.deezer.com/ajax/gw-light.php?method={0}&input=3&api_version=1.0&api_token={1}",
        trackUrl: "https://e-cdns-proxy-{0}.dzcdn.net/mobile/1/{1}",
        coverUrl: "https://e-cdns-images.dzcdn.net/images/cover/{0}/{1}x{2}.jpg"
    };

    const regexes = {
        playlist: /https:\/\/www\.deezer\.com\/\w*\/playlist\/(\d*)$/,
        album: /https:\/\/www\.deezer\.com\/\w*\/album\/(\d*)$/
    };

    class UI {
        constructor(history, queue, urls, regexes) {
            this.history = history;
            this.queue = queue;
            this.urls = urls;
            this.regexes = regexes;

            this.dropModal = document.createElement("div");
            this.queueContainer = document.createElement("div");
            this.historyContainer = document.createElement("div");
            this.dropBtn = document.createElement("span");

            this._addDropModal();

            this.history.items.forEach(h => {
                this.addHistoryRow(h);
            });
        }

        _switchTab(target) {
            const containers = this.dropModal.querySelectorAll(".drop-container");
            const tabs = target.parentElement.childNodes;
            const tab = target;
            if (!tab.classList.contains("active")) {
                containers.forEach(x => x.classList.remove("active"));
                tabs.forEach(x => x.classList.remove("active"));
                tab.classList.add("active");
                this[target.dataset.container].classList.add("active");
            }
        }

        _addDropModal() {
            this.dropModal.id = "drop";
            this.dropModal.classList.add("drop");

            const emptyQueue = document.createElement("span");
            const emptyHistory = document.createElement("span");
            emptyQueue.innerText = "Click drop button to add tracks to queue";
            emptyQueue.classList.add("drop", "drop-empty");
            emptyHistory.innerText = "Previously downloaded tracks will be here";
            emptyHistory.classList.add("drop", "drop-empty");

            const dropHeader = document.createElement("div");
            const queueTab = document.createElement("span");
            const historyTab = document.createElement("span");

            queueTab.innerText = "Queue";
            queueTab.classList.add("drop", "drop-tab", "active");
            queueTab.id = "queue-tab";
            queueTab.dataset.container = "queueContainer";
            historyTab.innerText = "History";
            historyTab.classList.add("drop", "drop-tab");
            historyTab.id = "history-tab";
            historyTab.dataset.container = "historyContainer";
            dropHeader.classList.add("drop", "drop-header");
            dropHeader.appendChild(queueTab);
            dropHeader.appendChild(historyTab);

            const clearQueue = document.createElement("span");
            const clearHistory = document.createElement("span");

            clearQueue.innerText = "🗙 clear queue";
            clearQueue.classList.add("drop", "drop-clear");
            clearQueue.id = "clear-queue";
            clearHistory.innerText = "🗙 clear history";
            clearHistory.classList.add("drop", "drop-clear");
            clearHistory.id = "clear-history";

            this.queueContainer.classList.add("drop", "drop-container", "active");
            this.queueContainer.id = "queue-container";
            this.queueContainer.appendChild(emptyQueue);
            this.queueContainer.appendChild(clearQueue);
            this.historyContainer.classList.add("drop", "drop-container");
            this.historyContainer.id = "history-container";
            this.historyContainer.appendChild(emptyHistory);
            this.historyContainer.appendChild(clearHistory);

            this.dropBtn.classList.add("drop");
            this.dropBtn.id = "drop-btn";
            this.dropBtn.dataset.after = 0;
            this.dropBtn.dataset.before = 0;
            this.dropBtn.classList.add("after-hidden", "before-hidden");

            this.dropModal.appendChild(dropHeader);
            this.dropModal.appendChild(this.queueContainer);
            this.dropModal.appendChild(this.historyContainer);
            this.dropModal.appendChild(this.dropBtn);
            document.body.appendChild(this.dropModal);

            this.dropBtn.addEventListener("click", () => {
                if (this.dropModal.classList.contains("expanded")) {
                    this.dropModal.classList.remove("expanded");
                } else {
                    this.dropModal.classList.add("expanded");
                }

                if (this.historyContainer.classList.contains("active")) {
                    this.resetHistoryBadge();
                }
            });

            queueTab.addEventListener("click", e => this._switchTab(e.target));
            historyTab.addEventListener("click", e => {
                this.resetHistoryBadge();
                this._switchTab(e.target);
            });
            clearHistory.addEventListener("click", () => {
                this.historyContainer.querySelectorAll('.drop-row').forEach(r => r.remove());
                this.resetHistoryBadge();
                this.history.clear();
            });
            clearQueue.addEventListener("click", () => {
                this.queueContainer.querySelectorAll('.drop-row').forEach(r => r.remove());
                this.resetQueueBadge();
                this.queue.clear();
            });
        }

        addToolbarButton(item) {
            const ar = this.regexes.album.exec(location.href);
            const pr = this.regexes.playlist.exec(location.href);
            if (item && (pr || ar)) {
                if (!item.getElementsByClassName("drop-list-button").length) {
                    const toolbarItem = document.createElement("div");
                    const listBtn = document.createElement("button");
                    const imgSpan = document.createElement("span");
                    const txtSpan = document.createElement("span");
                    const text = document.createTextNode("Drop");
                    imgSpan.classList.add("drop", "drop-icon");
                    txtSpan.classList.add("drop", "drop-button-span");
                    txtSpan.appendChild(text);
                    listBtn.classList.add("drop", "drop-list-button");
                    listBtn.appendChild(imgSpan);
                    listBtn.appendChild(txtSpan);
                    toolbarItem.classList.add("drop", "toolbar-item");
                    toolbarItem.appendChild(listBtn);
                    item.insertBefore(toolbarItem, item.childNodes[2]);
                    if (pr) {
                        listBtn.addEventListener("click", () => this.queue.addPlaylist(pr[1]));
                    }
                    if (ar) {
                        listBtn.addEventListener("click", () => this.queue.addAlbum(ar[1]));
                    }
                }
            }
        }

        addTrackButton(item) {
            let cell = item.getElementsByClassName("cell-love").item(0);
            if (!cell.getElementsByClassName("drop-button").length) {
                const downloadBtn = document.createElement("button");
                const downloadImg = document.createElement("span");
                downloadImg.classList.add("drop", "drop-icon");
                downloadBtn.classList.add("drop", "datagrid-action", "drop-button");
                downloadBtn.setAttribute('aria-label', "Download");
                downloadBtn.appendChild(downloadImg);
                downloadBtn.addEventListener("click", () => this.queue.add(item.dataset.key));
                cell.appendChild(downloadBtn);
            }
        }

        addQueueRow(trackInfo) {
            const row = document.createElement("div");
            row.classList.add("drop", "drop-row");
            row.dataset.key = trackInfo.SNG_ID;

            const picContainer = document.createElement("div");
            const trackImg = document.createElement("img");

            trackImg.src = this.urls.coverUrl.format(trackInfo.ALB_PICTURE, 60, 60);
            trackImg.classList.add("drop");
            picContainer.appendChild(trackImg);
            picContainer.classList.add("drop", "drop-queue-pic");
            row.appendChild(picContainer);

            const trackTitle = document.createElement("p");
            const trackSize = document.createElement("p");
            const trackStatus = document.createElement("p");
            const infoContainer = document.createElement("div");

            trackTitle.classList.add("drop", "drop-queue-track-title");
            trackTitle.innerText = trackInfo.ART_NAME + " - " + trackInfo.SNG_TITLE;
            trackSize.classList.add("drop", "drop-queue-track-size");
            trackSize.innerText = "" + (trackInfo.FILESIZE_MP3_320 / 1048576).toFixed(2) + " MB";
            trackStatus.classList.add("drop", "drop-queue-track-status");
            trackStatus.innerText = "In queue";
            infoContainer.appendChild(trackTitle);
            infoContainer.appendChild(trackSize);
            infoContainer.appendChild(trackStatus);
            infoContainer.classList.add("drop", "drop-queue-info");
            row.appendChild(infoContainer);

            const actionContainer = document.createElement("div");
            const cancelAction = document.createElement("a");
            cancelAction.classList.add("drop", "drop-queue-track-cancel");
            cancelAction.innerText = "🗙";
            actionContainer.appendChild(cancelAction);
            actionContainer.classList.add("drop", "drop-queue-actions");
            row.appendChild(actionContainer);

            this.queueContainer.insertBefore(row, this.queueContainer.querySelector('.drop-empty'));

            cancelAction.addEventListener("click", () => {
                this.deleteRow(trackInfo.SNG_ID)
                this.queue.cancel(trackInfo.SNG_ID);
            });
        }

        addHistoryRow(trackInfo) {
            const row = document.createElement("div");
            row.classList.add("drop", "drop-row");
            row.dataset.key = trackInfo.SNG_ID;

            const picContainer = document.createElement("div");
            const trackImg = document.createElement("img");

            trackImg.src = this.urls.coverUrl.format(trackInfo.ALB_PICTURE, 60, 60);
            trackImg.classList.add("drop");
            picContainer.appendChild(trackImg);
            picContainer.classList.add("drop", "drop-queue-pic");
            row.appendChild(picContainer);

            const trackTitle = document.createElement("p");
            const trackSize = document.createElement("p");
            const trackStatus = document.createElement("p");
            const infoContainer = document.createElement("div");

            trackTitle.classList.add("drop", "drop-queue-track-title");
            trackTitle.innerText = trackInfo.ART_NAME + " - " + trackInfo.SNG_TITLE;
            trackSize.classList.add("drop", "drop-queue-track-size");
            trackSize.innerText = "" + (trackInfo.FILESIZE_MP3_320 / 1048576).toFixed(2) + " MB";
            trackStatus.classList.add("drop", "drop-queue-track-status");
            trackStatus.innerText = "Downloaded " + trackInfo.timestamp;
            infoContainer.appendChild(trackTitle);
            infoContainer.appendChild(trackSize);
            infoContainer.appendChild(trackStatus);
            infoContainer.classList.add("drop", "drop-queue-info");
            row.appendChild(infoContainer);

            const actionContainer = document.createElement("div");
            const restartAction = document.createElement("a");
            restartAction.classList.add("drop", "drop-queue-track-restart");
            restartAction.innerText = "⟲";
            actionContainer.appendChild(restartAction);
            actionContainer.classList.add("drop", "drop-queue-actions");
            row.appendChild(actionContainer);

            this.historyContainer.insertBefore(row, this.historyContainer.firstChild);

            restartAction.addEventListener("click", () => {
                this.queue.add(trackInfo.SNG_ID);
            });

            if (this.history.length > 50) {
                this.deleteHistoryRow();
            }
        }

        updateRow(key, status) {
            const row = this.queueContainer.querySelector(`.drop-row[data-key='${key}']`);
            if (row) {
                row.querySelector(".drop-queue-track-status").innerText = status;
            }
        }

        deleteRow(key) {
            const row = this.queueContainer.querySelector(`.drop-row[data-key='${key}']`);
            if (row) {
                row.remove();
            }

            this.decQueueBadge();
        }

        deleteHistoryRow() {
            const row = this.historyContainer.querySelector(`.drop-row:last-child`);
            if (row) {
                row.remove();
            }
        }

        incQueueBadge() {
            let cnt = parseInt(this.dropBtn.dataset.before);
            this.dropBtn.dataset.before = ++cnt;
            this.showQueueBadge();
        }

        incHistoryBadge() {
            let cnt = parseInt(this.dropBtn.dataset.after);
            this.dropBtn.dataset.after = ++cnt;
            this.showHistoryBadge();
        }

        decQueueBadge() {
            let cnt = parseInt(this.dropBtn.dataset.before);
            this.dropBtn.dataset.before = --cnt;
            if (cnt == 0) {
                this.dropBtn.classList.add("before-hidden");
            }
        }

        resetQueueBadge() {
            this.dropBtn.dataset.before = 0;
            this.hideQueueBadge();
        }

        resetHistoryBadge() {
            this.dropBtn.dataset.after = 0;
            this.hideHistoryBadge();
        }

        hideHistoryBadge() {
            this.dropBtn.classList.add("after-hidden");
        }

        showHistoryBadge() {
            this.dropBtn.classList.remove("after-hidden");
        }

        hideQueueBadge() {
            this.dropBtn.classList.add("before-hidden");
        }

        showQueueBadge() {
            this.dropBtn.classList.remove("before-hidden");
        }
    }

    class Queue {
        constructor(deezer) {
            this.deezer = deezer;
            this.items = [];

            // init arrays of listeners callbacks
            this.addListeners = [];
            this.startListeners = [];
            this.finishListeners = [];
        }

        set onItemAdd(listener) {
            this.addListeners.push(listener);
        }

        set onStartDownload(listener) {
            this.startListeners.push(listener);
        }

        set onFinishDownload(listener) {
            this.finishListeners.push(listener);
        }

        async add(item) {
            if (Array.isArray(item)) {
                // if argument is array, push each item to queue
                item.forEach(i => this.push(i));
            } else {
                this.push(item);
            }
        }

        async push(key) {
            const trackInfo = await this.deezer.getTrackInfo(key);
            this.addListeners.forEach(f => f(trackInfo));

            // each item will contain info about track and XHR object
            this.items.push({ti: trackInfo, xhr: new XMLHttpRequest()});

            if (this.items.length === 1) {
                await this.startDownload();
            }
        }

        async startDownload() {
            if (!this.items.length) {
                // return if no items left in queue
                return;
            }

            const qItem = this.items[0];
            this.startListeners.forEach(f => f(qItem.ti));

            // track downloading and decrypting operations
            const encryptedBuffer = await this.deezer.downloadTrack(qItem.ti, qItem.xhr);
            const decryptedBuffer = await this.deezer.decryptTrack(qItem.ti, encryptedBuffer);
            const coverBuffer = await this.deezer.downloadCover(qItem.ti);
            // add mp3 tags to file and generate blob
            const blob = this.deezer.addTags(decryptedBuffer, coverBuffer, qItem.ti);

            // save mp3 file
            saveAs(blob, `${qItem.ti.ART_NAME} - ${qItem.ti.SNG_TITLE}.mp3`);

            // save timestamp to display in history tab
            qItem.ti.timestamp = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
            this.finishListeners.forEach(f => f(qItem.ti));

            // shift one item from queue and try again
            this.items.shift();
            await this.startDownload();
        }

        async addPlaylist(key) {
            const playlist = await this.deezer.getPlaylist(key);

            this.add(playlist.SONGS.data.map(x => x.SNG_ID));
        }

        async addAlbum(key) {
            const album = await this.deezer.getAlbum(key);

            this.add(album.SONGS.data.map(x => x.SNG_ID));
        }

        cancel(key) {
            const i = this.items.findIndex(item => item.ti.SNG_ID == key);

            // if key found in queue, remove and abort downloading, start download next track
            if (i !== -1) {
                this.items[i].xhr.abort();
                this.items.splice(i, 1);
                this.startDownload();
            }
        }

        clear() {
            this.items.forEach(i => i.xhr.abort());
            this.items = [];
        }
    }

    class History {
        constructor() {
            this.history = GM_getValue('history', []);
        }

        get length() {
            return this.history.length;
        }

        get items() {
            return this.history;
        }

        push(item) {
            this.history.push(item);
            if (this.history.length > 50) {
                this.history.shift();
            }
            GM_setValue('history', this.history);
        }

        clear() {
            GM_setValue('history', []);
        }

    }

    class Deezer {
        constructor(crypt, urls) {
            this.crypt = crypt;
            this.apiUrl = urls.apiUrl;
            this.apiTrackUrl = urls.apiTrackUrl;
            this.apiPlaylistUrl = urls.apiPlaylistUrl;
            this.apiAlbumUrl = urls.apiAlbumUrl;
            this.trackUrl = urls.trackUrl;
            this.coverUrl = urls.coverUrl;

            this.progressListeners = [];
            this.apiToken = "";
        }

        set onDownloadProgress(listener) {
            this.progressListeners.push(listener);
        }

        get apiKey() {
            return new Promise((resolve, reject) => {
                if (!this.apiToken) {
                    // if apiToken is empty, fetch it from deezer API and save
                    fetch(this.apiUrl.format("deezer.getUserData", ""), {
                        method: "POST"
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.apiToken = data.results.checkForm;
                        resolve(this.apiToken)
                    });
                } else {
                    resolve(this.apiToken);
                }
            });
        }

        async getTrackInfo(id) {
            const response = await fetch(this.apiUrl.format("song.getData", await this.apiKey, id), {
                method: "POST",
                body: JSON.stringify({sng_id: id})
            });

            const data = await response.json();

            return data.results;
        }

        async getAlbum(id) {
            const response = await fetch(this.apiUrl.format("deezer.pageAlbum", await this.apiKey, id), {
                method: "POST",
                body: JSON.stringify({
                    alb_id: id,
                    lang: "en"
                })
            });

            const data = await response.json();

            return data.results;
        }

        async getPlaylist(id) {
            const response = await fetch(this.apiUrl.format("deezer.pagePlaylist", await this.apiKey, id), {
                method: "POST",
                body: JSON.stringify({
                    playlist_id: id,
                    lang: "en"
                })
            });

            const data = await response.json();

            return data.results;
        }

        async downloadCover(trackInfo) {
            const response = await fetch(this.coverUrl.format(trackInfo.ALB_PICTURE, 500, 500));

            return response.arrayBuffer();
        }

        getTrackUrl(trackInfos) {
            // select file format according to track info
            const bitRate = trackInfos.FILESIZE_MP3_320 ? 3 : trackInfos.FILESIZE_MP3_256 ? 5 : 1;
            // prepare string to be hashed
            const toHash = [trackInfos.MD5_ORIGIN, bitRate, trackInfos.SNG_ID, trackInfos.MEDIA_VERSION].join('¤');
            // encrypt using md5 and aes algorithms
            const hash = this.crypt.aes(this.crypt.md5(toHash) + '¤' + toHash + '¤');

            return this.trackUrl.format(trackInfos.MD5_ORIGIN[0], hash);
        }

        downloadTrack(trackInfo, r) {
            return new Promise((resolve, reject) => {
                r.onload = e => resolve(r.response);
                r.onprogress = xhr => this.progressListeners.forEach(f => f(xhr, trackInfo))
                r.open("GET", this.getTrackUrl(trackInfo));
                r.responseType = "arraybuffer";
                r.send();
            });
        }

        decryptTrack(trackInfo, buffer) {
            return new Promise((resolve, reject) => {
                const bfKey = this.crypt.getBfKey(trackInfo.SNG_ID);
                const data = new Uint8Array(buffer);

                // work with buffer as with 2048 bytes blocks
                for (let i = 0, j = 2048, n = 0; j < data.length; i += 2048, j += 2048, n++) {
                    if (n % 3 > 0 || data.length - j < 2048) {
                        // skip and don't decrypt blocks except 3rd and
                        // skip block that has less than 2048 bytes
                        continue;
                    }
                    // decrypt selected block and save it back to Uint8Array
                    data.set(this.crypt.bfDecrypt(data.slice(i, j), bfKey), i);
                }
                resolve(data.buffer);
            });
        }

        addTags(songBuffer, coverBuffer, trackInfo) {
            const writer = new ID3Writer(songBuffer);

            let TPE1;

            // set correct TPE1 tag
            trackInfo.SNG_CONTRIBUTORS.featuring  ? TPE1 = trackInfo.SNG_CONTRIBUTORS.featuring :
            trackInfo.SNG_CONTRIBUTORS.mainartist ? TPE1 = trackInfo.SNG_CONTRIBUTORS.mainartist :
            TPE1 = [trackInfo.ART_NAME];

            // write tags and cover to mp3 file
            writer.setFrame('TIT2', trackInfo.SNG_TITLE)
                .setFrame('TPE1', TPE1)
                .setFrame('TPE2', trackInfo.ART_NAME)
                .setFrame('TALB', trackInfo.ALB_TITLE)
                .setFrame('TYER', parseInt(trackInfo.PHYSICAL_RELEASE_DATE))
                .setFrame('TRCK', trackInfo.TRACK_NUMBER)
                .setFrame('TPOS', trackInfo.DISK_NUMBER)
                .setFrame('APIC', { type: 3, data: coverBuffer, description: 'Cover' });
            writer.addTag();

            return writer.getBlob();
        }
    }

    class Crypt {
        constructor(keys) {
            this.aesKey = keys.aesKey;
            this.bfIv = keys.bfIv;
            this.bfSecret = keys.bfSecret;
        }

        md5(value) {
            return SparkMD5.hashBinary(value);
        }

        bfDecrypt(value, bfKey) {
            const bf = new Blowfish(bfKey, Blowfish.MODE.CBC, Blowfish.PADDING.NULL);
            bf.setIv(this.bfIv);
            return bf.decode(value, Blowfish.TYPE.UINT8_ARRAY);
        }

        aes(value) {
            while (value.length % 16 > 0) {
                value += ' ';
            }
            const aesEcb = new aesjs.ModeOfOperation.ecb(this.strToBytes(this.aesKey));
            const encryptedBytes = aesEcb.encrypt(this.strToBytes(value));
            return aesjs.utils.hex.fromBytes(encryptedBytes);
        }

        getBfKey(songId) {
            let key = "";
            const idMd5 = this.md5(songId);
            for (let i = 0; i < 16; i++) {
                key += String.fromCharCode(idMd5.charCodeAt(i) ^ idMd5.charCodeAt(i + 16) ^ this.bfSecret.charCodeAt(i));
            }
            return key;
        }

        strToBytes(str) {
            let bytes = [];
            for (let i = 0; i < str.length; i++) {
                bytes.push(str.charCodeAt(i));
            }
            return bytes;
        }
    }

    const deezer = new Deezer(new Crypt(keys), urls);
    const history = new History();
    const queue = new Queue(deezer);
    const ui = new UI(history, queue, urls, regexes);

    queue.onItemAdd = (trackInfo) => {
        ui.addQueueRow(trackInfo);
        ui.incQueueBadge();
    };

    queue.onStartDownload = (trackInfo) => {
        ui.updateRow(trackInfo.SNG_ID, "Downloading track...");
    };

    queue.onFinishDownload = (trackInfo) => {
        history.push(trackInfo);
        ui.addHistoryRow(trackInfo);
        ui.deleteRow(trackInfo.SNG_ID);
        ui.incHistoryBadge();
    };

    deezer.onDownloadProgress = (xhr, trackInfo) => {
        const p = (xhr.loaded / (xhr.total / 100)).toFixed(2);
        if (p < 99.9) {
            ui.updateRow(trackInfo.SNG_ID, `Downloaded ${p}%`);
        } else {
            ui.updateRow(trackInfo.SNG_ID, `Processing track...`);
        }
    };

    // Create an observer that will add drop buttons to each dynamically created song row and toolbar
    const observer = new MutationObserver(mutationsList => {
        for(let mutation of mutationsList) {
            if (mutation.type == 'childList') {
                let node = mutation.addedNodes[0];
                if (node instanceof HTMLElement && typeof node.classList !== "undefined") {
                    if (node.classList.contains("song")) {
                        ui.addTrackButton(node);
                    } else {
                        const songRows = node.getElementsByClassName("song");
                        const toolbar = node.getElementsByClassName("toolbar-wrapper").item(0);

                        ui.addToolbarButton(toolbar);

                        for (let i = 0; i < songRows.length; i++) {
                            ui.addTrackButton(songRows[i]);
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Add listener to collapse Drop menu when clicking outside of it
    document.body.addEventListener("click", e => {
        if (!e.target.classList.contains("drop")) {
            ui.dropModal.classList.remove("expanded");
        }
    });

    String.prototype.format = function() {
        let k, a = this;
        for (k in arguments) {
            a = a.replace("{" + k + "}", arguments[k])
        }
        return a
    }

    GM_addStyle(`
.datagrid-cell.datagrid-cell-action.cell-love {
    width: 56px;
    padding-left: 5px;
}

div.datagrid-cell.cell-title {
    padding-left: 8px;
}

.drop-icon {
    display: block;
    width: 16px;
    height:16px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOGSURBVFiFvZY/bxpJGId/Mzs7ywqJVLFk5MpAEYkq+GxrU9A7rqC6wmn9GSgi+9xcsQVWihRbWE6EdEJyvgOlN3drNzQ0RqI8pQEJOwy7814R1rqz+Q+5n7TFaqT3eWZ239HLiAjLhDEmpZR/AIBS6lciUksVIqKFHwAGY+xLMplUyWRSMca+ADCWqrWkwEchRNhoNKjRaJAQIgTw8X8RAHAMQNfrdYpTr9cJgAZw/FMFALxhjA1d143oSVzXjRhjQwBvfooAgC0hxLdSqaSewuOUSiUlhPgGYGutAgASpmneZjIZ1ev1JvGp1+tRJpNRpmneAkisU+BDIpEIm83mRHicZrNJiUQiBPBhLQIAXjPGolqtNhMep1arEWMsAvB6JQEA3DTNoFwuD+amj1IulwemaQYA+CoCx1LKsNPpLMqnTqdDUsrhrNacBn8phOidnp4uDI9zdnZGQogegJcLC5im+TmdTg/v7++XFnh4eKCtrS1lmubnhQQA7D697ZbN1dVVfEvuzi3AOf+0s7Oz8I83Kfv7+wPO+ae5BAC8MAzj+8XFxbr4dHl5SYZhfAfwYh6BYyll1O121ybQ7XZJShmN6wg+ZkRwisWiTqVSS80X45JKpVAsFjUA5+naMwHLsvL5fF6sjT5KPp8XlmXlZwporXPZbHbdfGSzWWitczMFGGNqMBg8vqfTaZyfn68sMBgMwBh7NjeOOwE/CILHSbVQKODm5mZlgSAISGvtzxQIw/Cr7/uPpoVCAdfX19BaryTg+74Kw/Drs4UxbfiWc677/T4REbVaLbJtm1zXXboN+/0+cc41gLfPeGMENjjnoed5jwWq1SpZlkVBECwl4Hkecc5DABszBUYS723bHrbbbSIi0lrTwcEBWZZFrutSFD2bSSem3W6TbdtDAO/HsiYICCnlreM4KoZpralarZJt25TL5ejo6Iiq1epUeBRF5DiOklLeAhBzC4wkXhmGoSqVyn923Gq16OTkhA4PD2lzc3MqvFKpkGEYCsCriZxJCyOJd4ZhKMdxVPw55km73SbHcdQI/m4qY9pifBJSylvbtoee51HcHePS7/fJ8zyybXs4OvaJO48fNoJMDWNMAKhwzk8A8O3tbbW3tycLhQIDflwyvu+ru7s7CUBrrX8D8DsRhTNrzyPwL5ENAL8A2BFC7HLO9/CD6I8umb8A/ElEf89b8x96fwU2MHVN0AAAAABJRU5ErkJggg==);
    background-size: 102% 100%;
}

.drop-button {
    width: 28px;
    padding: 0 4px;
}

.drop-button .drop-icon {
    margin-left: 2px;
}

.drop-list-button {
    color: #23232D;
    background-color: #F8F8F9;
    border: 1px solid #D1D1D7;
    cursor: pointer;
    height: 32px;
    display: inline-flex;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    align-items: center;
    font-family: Open Sans;
    font-weight: 600;
    border-radius: 3px;
    justify-content: center;
}

.drop-list-button:hover {
    background-color: #FFFFFF;
}

.drop-list-button .drop-icon {
    margin-right: 6px;
}

.toolbar-item button {
    padding: 0 10px;
}

#drop {
    position: fixed;
    padding: 2px;
    right: 20px;
    top: 68px;
	width:36px;
    height:36px;
	background-color: #fff;
	border-radius:5px;
    box-shadow: 0 2px 10px 0 rgba(25,25,34,.24);
    z-index: 999;
}

#drop.expanded {
	width:400px;
    height:72%;
    display:flex;
    flex-direction:column;
}

#drop-btn {
    position: absolute;
    top: 5px;
    right: 5px;
	width:26px;
    height:26px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOdSURBVFiFvZdPaBxVHMc/vzd/ktY0KdUtNNnFVhE2JNtom8Y2wV6EmpDaVgy0KUWDWFNYPejNILSB2EBLoGBT/zSCWNCLRUIOORm8qE2zQeofPJcNEepl8RLZnZ2fh9mSqLuZnc3iF+Yw8958v5/5vTeP90RVqUUi4mK5XwJQzA+rar4mI1WNfAEWyG3c7Xnc7XmQ24BVk1eNADcwtsfIrDIyqxjbA278LwDAKOAzNKNc/CO4hmYU8IHRqH4m4rj3IXKdY5eUjpPrDR0n4dglReS6iPRF8awaQETiGGuW5IByJP3f946kDckBxVizIhKvK4CINGKcOVoSzZyadip2PDXt0JJoxjhzItJYNwDgCsakGL7l4DZV7uU2wfAtB2NSwJW6AIjIAUTSnLhmEUuGO8aScOKahUhaRA5sCUBEDMa5SXLQIzUUHv5QqSFIDnoY56aIbJoRVoHzCF30T7jVp5fUP+Eish84XxOAiMQw9lWee9uiuS1yPs1tcPQdG2NfFZFYZACMNcUjj22j763o4Q/V+yY07W7EWFORAESkB794jhcmbOyq/qbyshug/30Hv3hORHqqBsCYNG1PF/6x2tWq9uOQ6C5gTLoqABFpATlN92vRJ14lHXzVBTkdeIcAAGcQ49B+vG75JAdBjAOcqQagl719Pg076gfQsAP29vlAbziA7XYSS9r1Sy8plrSx3c5wAN9/il376p7Prn2BdyiASJ7ihu3dVCfc+XjrAMV84B0KgC6yem99p9raBb//tHWA1XsKuhgOUPTusrK8TrqnC1YyoP7WAFaW8xS9u+EAkCF336WwFtylXoY/V+GHD2sPL6xB7r4LZKoBWAJ8fv4quHv0SXj+PVi4XPtQBF5+yXtzAFV9gPrjzI955LLBw8NvwBNH4dMB+H462nDksjA/5qH+uKo++HezlDsZiYiNcZaIP9PByJyDGEDhzifwzQQ0t0K8G/bsh8OjlcPVh89eLLDy46/4hUOq6oVWAEBVPfzCWbIZWJgsfbEEYRe+DebFXzn47oPNwxcmIZsBv3C2XHjFCmyoxCuImSHRDS995LAzUTlwo3JZ+PpCgWwG1H9dVT+vmBF2OBWRdozzBcbqZOCyTWoInG3lOxfWggk3P+bhF38pfflvm/pXczoWERt4FzEXAcPOx/PED7q0dgkQLDIry/nSr+aj/jgwWanskQE2gOwGDgHdWHYPyLNBiy6WFpkMsFRutlfS3yH6DlSLMq+6AAAAAElFTkSuQmCC);
    background-size: 26px;
    cursor: pointer;
}

#drop-btn:hover {
    opacity: 0.8;
}

#drop-btn::before {
    content: attr(data-before);
    background-color: rgb(255, 251, 151);
    width: 16px;
    height: 16px;
    display: block;
    position: absolute;
    text-align: center;
    top: -10px;
    left: -10px;
    border-radius: 5px;
    box-shadow: 0 2px 2px 0 rgba(25,25,34,.24);
}

#drop-btn.before-hidden::before {
    display:none;
}

#drop-btn::after {
    content: attr(data-after);
    background-color: rgb(151, 255, 192);
    width: 16px;
    height: 16px;
    display: block;
    position: absolute;
    text-align: center;
    top: -10px;
    right: -10px;
    border-radius: 5px;
    box-shadow: 0 2px 2px 0 rgba(25,25,34,.24);
}

#drop-btn.after-hidden::after {
    display:none;
}

.drop-container {
    display: none;
    height: 100%;
    overflow: auto;
    margin: 7px 7px;
}

#drop.expanded .drop-container.active {
    display: block;
}

#drop.expanded .drop-header {
    display: block;
}

.drop-header {
    display: none;
    font-size: 16px;
    margin: 6px 8px;
    width: 350px;
}

.drop-tab {
    padding: 8px 20px;
    cursor: pointer;
}

.drop-tab:hover {
    color: black;
    border-bottom: 2px solid gray;
}

.drop-tab.active {
    color: black;
    border-bottom: 2px solid #007feb;
}

.toolbar-wrapper .c0113 {
    padding: 0 8px;
}

.toolbar-wrapper .c0117 {
    margin-right: 6px;
}

.drop-row {
    display: flex;
    margin: 5px 0;
}

.drop-queue-pic img {
    width: 60px;
    height: 60px;
}

.drop-queue-info {
    flex: 1;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid lightgray;
    flex-direction: column;
    padding-left: 5px;
}

.drop-queue-actions {
    width: 30px;
    text-align: center;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    border-bottom: 1px solid lightgray;
}

.drop-empty {
    display: block;
    padding: 20px;
    font-size: 14px;
}

.drop-row ~ .drop-empty {
    display: none;
}

.drop-clear {
    padding: 5px;
    display: none;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
}

.drop-row ~ .drop-clear {
    display: block;
}

.drop-clear:hover {
    color: black;
}

#page_topbar > div.popper-wrapper.topbar-entrypoints > div {
    display: none;
}
    `);
})();