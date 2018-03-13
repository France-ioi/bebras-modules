function getFioiPlayer() {
    return {
        players: [],
        isPlaying: false,
        currentPlayer: null,
        currentSeek: 0,
        duration: 0,
        loaded: false,
        endReset: false,
        ended: false,

        targetDiv: null,
        progressBar: null,

        bind: function(elem) {
            var fioiPlayer = this;
            this.targetDiv = elem;
            $(elem).find('#btn-play-pause, #container').on('click', function () {
                fioiPlayer.playpause();
            });
            $(elem).find('#btn-stop').on('click', function () {
                fioiPlayer.stop();
            });
            $(elem).find('#btn-step').on('click', function () {
                fioiPlayer.step();
            });
            this.progressBar = $(elem).find('progress, meter').get(0);
            this.progressBar.addEventListener('mouseup', function (e) {
                fioiPlayer.seek(fioiPlayer.duration * e.offsetX / fioiPlayer.progressBar.offsetWidth);
                });

            if(window.location.protocol == 'file:') {
              $(elem).prepend('<div style="color: red">Attention : le lecteur vidéo peut rencontrer des soucis en ouverture directe du document (en file:///). Utilisez la commande <code>python -m SimpleHTTPServer</code> dans le dossier <code>tasks/v01/</code>, puis allez sur <a href="http://127.0.0.1:8000/">http://127.0.0.1:8000/</a> pour corriger ce problème.');
            }
        },

        prepareAnimation: function(idx) {
            var fioiPlayer = this;
            var newPlayer = {
                loaded: false,
                duration: 0,
                transparent: false,
                div: $('<div></div>'),
                play: $.noop,
                pause: $.noop,
                step: $.noop,
                seek: $.noop
                };
            if(idx >= 0) {
                this.players[idx].div.hide();
                this.currentPlayer = (this.currentPlayer == idx) ? null : this.currentPlayer;
                this.players[idx] = newPlayer;
            } else {
                this.players.push(newPlayer);
            }
            this.updateLoaded();
            return this.players.indexOf(newPlayer);
        },

        replaceAnimation: function(player, idx) {
            this.players[idx] = player;
            this.updateLoaded();
        },

        addVideo: function(video, div, transparent, animation) {
            var fioiPlayer = this;
            var thisVideo = video;
            var newPlayer = {
                loaded: video.readyState >= 1,
                duration: video.duration ? video.duration : 0,
                animation: animation,
                transparent: transparent,
                div: div,
                play: video.play.bind(video),
                pause: video.pause.bind(video),
                step: function() {
                    video.play.bind(video)();
                    setTimeout(video.pause.bind(video), 1000)
                    },
                seek: function(t) {
                    thisVideo.currentTime = t+0;
                    }
                };
            this.players.push(newPlayer);
            var newIdx = this.players.indexOf(newPlayer);

            if(newPlayer.loaded) {
                this.updateLoaded();
            } else {
                // Wait for media to load
                video.addEventListener('loadedmetadata', function() {
                    newPlayer.loaded = true;
                    newPlayer.duration = video.duration;
                    fioiPlayer.updateLoaded();
                    });
            }

            video.addEventListener('timeupdate', function() {
                fioiPlayer.updateSeek(newIdx, video.currentTime);
                if(animation) { animation(video.currentTime, div); }
                });

            video.addEventListener('ended', function() {
                fioiPlayer.next(newIdx);
            });
        },

        addImage: function(div) {
            var fioiPlayer = this;
            var newIdx = 0;
            var playFunc = function() {
                fioiPlayer.updateSeek(newIdx, 0);
                setTimeout(function() { fioiPlayer.next(newIdx); }, 1000);
            }
            var newPlayer = {
                loaded: true,
                duration: 1,
                transparent: false,
                div: div,
                play: playFunc,
                pause: $.noop,
                step: playFunc,
                seek: playFunc
                };
            this.players.push(newPlayer);
            newIdx = this.players.indexOf(newPlayer);
        },

        updateLoaded: function() {
            // Update state when one of the players finished loading metadata
            var nowLoaded = true;
            this.duration = 0;
            for(i=0; i<this.players.length; i++) {
                if(this.players[i].loaded) {
                    this.duration += this.players[i].duration;
                } else {
                    nowLoaded = false;
                }
            }

            if(nowLoaded) {
                this.progressBar.max = this.duration;
                this.updatePlayer(0);
                if(this.isPlaying) {
                   this.loaded = true;
                   this.seek(this.currentSeek);
                }
            }

            this.loaded = nowLoaded;
        },

        updateSeek: function(idx, t) {
            // Update state when one of the players' currentTime changed
            var newSeek = 0;
            for(i=0; i<idx; i++) {
                newSeek += this.players[i].duration;
            }
            newSeek += t;

            this.progressBar.value = newSeek;
            this.currentSeek = newSeek;
        },

        updatePlayer: function(newIdx) {
            if(newIdx != this.currentPlayer) {
                var ctn = $(this.targetDiv).find('#container');
                ctn.children().not('#play-pause-ctn').hide();
                if(this.players[newIdx].transparent && newIdx > 0) {
                    this.players[newIdx-1].ctnDiv = this.players[newIdx-1].div.appendTo(ctn).show();
                }
                this.players[newIdx].ctnDiv = this.players[newIdx].div.appendTo(ctn).show();
                this.currentPlayer = newIdx;
            }
        },

        next: function(idx) {
            this.currentSeek = 0;
            // Player ended, start next player
            if(idx+1 >= this.players.length) {
                this.stop(true);
            } else {
                var newSeek = 0;
                for(i=0; i<=idx; i++) {
                    newSeek += this.players[i].duration;
                }
                this.seek(newSeek);
            }
        },

        playpause: function() {
            if(this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },

        play: function() {
            if(this.ended) {
                this.seek(0);
                this.ended = false;
            }
            this.isPlaying = true;
            this.seek(this.currentSeek);
            $(this.targetDiv).find('#play-pause-glyph').addClass('glyphicon-pause').removeClass('glyphicon-play');
            $(this.targetDiv).find('#play-pause-ctn').hide();
        },

        pause: function() {
            for(i=0; i<this.players.length; i++) {
                this.players[i].pause();
            }
            this.isPlaying = false;
            $(this.targetDiv).find('#play-pause-glyph').addClass('glyphicon-play').removeClass('glyphicon-pause');
            if(!this.ended) {
                $(this.targetDiv).find('#play-pause-ctn').show();
            }
        },

        stop: function(ending) {
            if(ending && !this.endReset) {
                this.ended = true;
                this.progressBar.value = this.progressBar.max;
                var lastPlayer = this.players[this.players.length-1];
                if(lastPlayer.animation) {
                   lastPlayer.animation(lastPlayer.duration + 60);
                }
            } else {
                var fioiPlayer = this;
                setTimeout(function() { fioiPlayer.seek(0); }, 100);
            }
            this.pause();
        },

        step: function() {
            this.pause();
            this.players[this.currentPlayer].step();
        },

        seek: function(t) {
            // User seek
            if(!this.loaded) { return; };
            var remTime = t;
            var curPlayer = 0;
            while(curPlayer < this.players.length && remTime >= this.players[curPlayer].duration) {
                this.players[curPlayer].pause();
                remTime -= this.players[curPlayer].duration;
                curPlayer += 1;
            }
            if(curPlayer < this.players.length) {
                for(i=curPlayer+1; i<this.players.length; i++) {
                    this.players[i].pause();
                }
                this.players[curPlayer].seek(remTime);
                this.updatePlayer(curPlayer);
                if(this.isPlaying) {
                    this.players[curPlayer].play();
                }
            } else {
                this.updateSeek(-1, this.duration);
            }
        }
    };
}

function simpleFioiPlayerAttach(targetDiv, videoElem, videoDiv, videoAnimation) {
    var newFioiPlayer = getFioiPlayer();
    newFioiPlayer.bind(targetDiv);
    newFioiPlayer.addVideo(videoElem, videoDiv, videoAnimation);
}

function bindVttReader(url, selector) {
    var vttCues = [];
    var curTimestamp = 0;
    var curIdx = 0;
    var selected = $(selector);

    $.ajax({
        url: url,
        dataType: 'text',
        success: function(data) {
            var vttParser = new WebVTTParser();
            vttCues = vttParser.parse(data).cues;
            },
        error: function () {
            console.error("VTT reader couldn't load url " + url);
            }
        });

    return function(t) {
        if(t < curTimestamp) {
            curTimestamp = t;
            curIdx = 0;
        }
        for(idx=curIdx; idx<vttCues.length; idx++) {
            if(vttCues[idx].startTime > t) {
                break;
            } else if(vttCues[idx].endTime > t) {
                selected.html(vttCues[idx].text.replace(/\n/g, '<br>'));
                selected.show();
                return;
            }
        }
        selected.html('');
        selected.hide();
    };
}

function getVideoHtmlAttrs(elem) {
    var videoAttrs = [];
    var sources = elem.attr('data-source') ? elem.attr('data-source').split(';') : [];
    for(var v=0; v<sources.length; v++) {
        var curSource = sources[v];
        var curVideo = {};
        if(!curSource || curSource === 'none') {
            curVideo['source'] = null;
        } else {
            curVideo['source'] = curSource;
        }
        videoAttrs[v] = curVideo;
    }
    var subtitles = elem.attr('data-subtitles') ? elem.attr('data-subtitles').split(';') : [];
    for(var v=0; v<subtitles.length; v++) {
        if(!subtitles[v] || subtitles[v] === 'none') {
            videoAttrs[v]['subtitles'] = null;
        } else {
            videoAttrs[v]['subtitles'] = subtitles[v];
        }
    }
    var images = elem.attr('data-image') ? elem.attr('data-image').split(';') : [];
    for(var v=0; v<images.length; v++) {
        if(!images[v] || images[v] === 'none') {
            videoAttrs[v]['image'] = null;
        } else {
            videoAttrs[v]['image'] = images[v];
        }
    }
    return videoAttrs;
}

function canPlayTypeInt(mediaType) {
    if(typeof HTMLMediaElement === 'undefined' || typeof HTMLMediaElement.canPlayType !== 'function') { return 0; }
    var cpt = HTMLMediaElement.canPlayType(mediaType);
    if(cpt == 'probably') {
        return 2;
    } else if(cpt == 'maybe') {
        return 1;
    } else {
        return 0;
    }
}

var fioiVideoPlayers = {};

var playerApp = null;
if(typeof app !== 'undefined') {
  playerApp = app;
} else {
  playerApp = angular.module('fioiVideoPlayer', []);
}

playerApp.directive('fioiVideoPlayer', function() {
   return {
      template: function (elem, attr) {
        elem = $(elem);
        var newId = elem.attr('data-id');

        var width = elem.attr('width') ? parseInt(elem.attr('width')) : 772;
        var height = elem.attr('height') ? parseInt(elem.attr('height')) : 428;

        if($('body').width() < width) {
           $('body').width(width);
        }

        var newHtml = '';
        newHtml += ''
            + '<div id="'+newId+'" style="width: '+(width+12)+'px; '+elem.attr('style')+'">'
            + '   <div id="container" style="width: '+width+'px; height: '+height+'px; overflow: hidden; position: relative;">'
            + '     <div id="play-pause-ctn" style="width: 100%; height: 100%; position: absolute; z-index: 1; background: black; opacity: 0.4; text-align: center;">'
            + '       <img src="/play.png" style="width: auto; height: 100%;" />' // TODO :: get play.png from somewhere better
            + '     </div>'
            + '   </div>'
            + '   <button id="btn-play-pause" class="btn btn-xs" title="Jouer / Pause"><span id="play-pause-glyph" class="glyphicon glyphicon-play"></span></button>'
            + '   <button id="btn-stop" class="btn btn-xs" title="Stop"><span class="glyphicon glyphicon-stop"></span></button>'
            + '   <button id="btn-step" class="btn btn-xs" title="Exécuter une étape"><span class="glyphicon glyphicon-flash"></span></button>'
            + '   <meter min="0" max="100" value="0" style="height: 15px; width: '+(width-84)+'px"></meter>';

        // Video source
        var videoAttrs = getVideoHtmlAttrs(elem);
        for(var v=0; v<videoAttrs.length; v++) {
            var curVideo = videoAttrs[v];
            if(curVideo.source && curVideo.source != 'animation') {
                newHtml += '   <video id="videoSource'+v+'" style="display: none;" crossorigin="anonymous">';
                if(curVideo.source.substr(curVideo.source.length-4) == '.mp3'
                        && canPlayTypeInt('audio/ogg') > canPlayTypeInt('audio/mpeg')) {
                    newHtml += '      <source src="'+(curVideo.source.substr(0, curVideo.source.length-4))+'.ogg" type="audio/ogg">';
                } else {
                    newHtml += '      <source src="'+curVideo.source+'" type="audio/mpeg">';
                }
                if(curVideo.subtitles) {
                    newHtml += '      <track kind="subtitles" label="Sous-titres en français" src="'+curVideo.subtitles+'" srclang="fr" default></track>';
                }
                newHtml += '   </video>';
            }

            // Video displays
            newHtml += '<div id="videoDisplay'+v+'" style="position: absolute; top: 0px; left: 0px; width: '+width+'px; height: '+height+'px; display: none;">';
            if(curVideo.image) {
                newHtml += '   <img src="'+curVideo.image+'" width="'+width+'px" height="'+height+'px" />';
            }
            if(curVideo.subtitles) {
                newHtml += '   <div id="subtitlesContainer" style="position: absolute; top: '+(height-72)+'px; left: 0px; height: 80px; width: 100%; background: rgba(0, 0, 0, 0.8); color: white; text-align: center; font-size: 24px"></div>'
            }
            newHtml += '</div>';
        }

        newHtml += '</div>';

        return newHtml;
      },
    link: function(scope, elem, attrs) {
        var newFioiPlayer = getFioiPlayer();
        var newId = elem.attr('data-id');
        newFioiPlayer.bind($('#'+newId));

        if(elem.attr('data-end-reset')) {
            newFioiPlayer.endReset = true;
        }

        var videoAttrs = getVideoHtmlAttrs($(elem));
        for(var v=0; v<videoAttrs.length; v++) {
            var curVideo = videoAttrs[v];
            var videoSource = null;
            var callback = null;
            if (curVideo.source == 'animation') {
                newFioiPlayer.prepareAnimation();
                continue;
            } else if (curVideo.source) {
                videoSource = $('#'+newId+' #videoSource'+v).get(0);
            }

            if(curVideo.subtitles) {
                callback = bindVttReader(curVideo.subtitles, $('#'+newId+' #videoDisplay'+v+' #subtitlesContainer'));
            }
            if(videoSource) {
                newFioiPlayer.addVideo(
                    videoSource,
                    $('#'+newId+' #videoDisplay'+v),
                    !curVideo.image,
                    callback);
            } else {
                newFioiPlayer.addImage($('#'+newId+' #videoDisplay'+v));
            }
        }

        fioiVideoPlayers[newId] = newFioiPlayer;
    }
   }
});

var previousSubmissionId = null;

function fioiPlayerEvaluationCallback(submission, animationLoaded) {
    var successPlayer = fioiVideoPlayers['successPlayer'];
    var failurePlayer = fioiVideoPlayers['failurePlayer'];
    if(!submission.bEvaluated) {
        $('#successPlayer').hide();
        $('#failurePlayer').hide();
        failurePlayer.pause();
        failurePlayer.seek(0);
        successPlayer.pause();
        successPlayer.seek(0);
        if(typeof taskSettings !== 'undefined' && typeof taskSettings.animationFeatures !== 'undefined') {
           failurePlayer.prepareAnimation(0);
           successPlayer.prepareAnimation(0);
        }
        return;
    } else if (submission.ID == previousSubmissionId) {
        return;
    }

    previousSubmissionId = submission.ID;
    $('html, body').animate({scrollTop: $('#submission-visualization').offset().top-50}, 1000);
    if(submission.iScore == 100) {
        $('#failurePlayer').hide();
        $('#successPlayer').appendTo('#submission-visualization');
        $('#successPlayer').show();
        successPlayer.play();
    } else {
        $('#successPlayer').hide();
        $('#failurePlayer').appendTo('#submission-visualization');
        $('#failurePlayer').show();
        failurePlayer.play();
    }
}

function simulationToVideo(fioiPlayer, idx, selector, task, commands) {
    var nbCmds = 0;
    var animDelay = 0.4;
    var simu = null;
    var callback = function (curCmd) {
        if(curCmd >= nbCmds) {
            simu.pause();
            fioiPlayer.next(idx);
        } else {
            fioiPlayer.updateSeek(idx, curCmd*animDelay);
        }
    }

    simu = simulationInstance(selector, task, commands, callback);
    animDelay = simu.animDelay/1000;
    nbCmds = simu.nbCmds;

    $(selector).find('.play, .pause, .restart').remove();

    var newPlayer = {
        loaded: true,
        duration: simu.nbCmds*animDelay,
        animation: $.noop,
        div: $(selector),
        play: simu.play,
        pause: simu.pause,
        step: simu.step,
        seek: simu.seek
        };
    fioiPlayer.replaceAnimation(newPlayer, idx);
}
