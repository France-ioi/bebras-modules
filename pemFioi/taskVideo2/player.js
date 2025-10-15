(function($) {

    var player;
    var ready = false;
    var state_cache;
    var current_timestamp = null;



    // time formatter and parser
    var time_string = {

        parse: function(value) {
            if(typeof value === 'string') {
                var mult = 1,
                    parts = value.split(':'),
                    res = 0;
                while(parts.length) {
                    res += mult * parseFloat(parts.pop());
                    mult *= 60;
                }
                return res;
            }
            return value || 0;
        },

        format: function(value) {
            var v = parseInt(value, 10),
                h = Math.floor(v / 3600);
                m = Math.floor((v - (h * 3600)) / 60),
                s = v - (h * 3600) - (m * 60);

            function zero(v) {
                return v < 10 ? '0' + v : v;
            }
            return (h > 0 ? h + ':' : '') + zero(m) + ':' + zero(s);
        }
    }


    // load youtube IFrame Player API
    var youtubeApiLoader = {
        callbacks: [],
        loaded: false,
        loading: false,

        fetch: function() {
            window.onYouTubePlayerAPIReady = function() {
                delete window.onYouTubePlayerAPIReady;
                youtubeApiLoader.loaded = true;
                var cb;
                while(cb = youtubeApiLoader.callbacks.pop()) {
                    cb();
                }
            }
            var script = document.createElement("script");
            script.src = "https://www.youtube.com/player_api";
            script.onerror = function() {
                console.error('Error loading IFrame Player API');
            }
            document.body.appendChild(script);
        },


        load: function(callback) {
            console.log('test', this);
            if(this.loaded) {
                return callback();
            }
            this.callbacks.push(callback);
            if(!this.loading) {
                this.loading = true;
                this.fetch();
            }
        }
    }



    // sections nav
    var sections = {

        data: [],
        active: null,
        visible: true,
        show_viewed: true,
        callback: null,

        generateSections: function(amount, start, end) {
            if(!start) start = 0;
            if(!end) end = player.getDuration();
            var duration = (end - start) / amount;
            var res = [];
            for(var i=0; i<amount; i++) {
                res.push({
                    start: i * duration,
                    end: (i + 1) * duration,
                    title: 'Section ' + (1 + i),
                    viewed: false,
                    parts: [
                        {
                            viewed: false,
                            start: i * duration,
                            end: (i + 1) * duration
                        }
                    ],
                    description: null
                });
            }
            return res;
        },


        prepareSectionsArray: function(sections) {
            for(var i=0; i<sections.length; i++) {
                if('start' in sections[i]) {
                    sections[i].start = time_string.parse(sections[i].start);
                }
                if('end' in sections[i]) {
                    sections[i].end = time_string.parse(sections[i].end);
                }
            }
            for(var i=0; i<sections.length; i++) {
                if('start' in sections[i]) continue;
                if(i == 0) {
                    sections[i].start = 0;
                } else if('end' in sections[i - 1]) {
                    sections[i].start = sections[i - 1].end;
                } else {
                    console.error('Section #' + i + ' start time not computable');
                }
            }
            for(var i=0; i<sections.length; i++) {
                if('end' in sections[i]) continue;
                if(i == sections.length - 1) {
                    sections[i].end = player.getDuration();
                } else if('start' in sections[i + 1]) {
                    sections[i].end = sections[i + 1].start;
                } else {
                    console.error('Section #' + i + ' end time not computable');
                }
            }
            return sections;
        },


        init: function(config, parent) {
            this.active = null;
            this.show_viewed = !!config.show_viewed;
            this.callback = config.callback;
            if(!config.sections) {
                this.visible = false;
                this.data = this.generateSections(1);
            } else if(Number.isInteger(config.sections)) {
                this.visible = false;
                this.data = this.generateSections(config.sections);
            } else {
                this.visible = true;
                this.data = this.prepareSectionsArray(config.sections.slice());
                for(var i=0,section; section = this.data[i]; i++) {
                    section.viewed = false;
                    var parts_amount = Number.isInteger(section.parts) ? section.parts : 1;
                    var part_duraton = (section.end - section.start) / parts_amount;
                    if(config.layout.enumerate_sections) {
                        section.number = 1 + i;
                    }
                    section.parts = [];
                    for(var j=0; j<parts_amount; j++) {
                        section.parts[j] = {
                            viewed: false,
                            start: section.start + j * part_duraton,
                            end: section.start + (j + 1) * part_duraton
                        }
                    }
                }
            }
            this.render(parent, function(time) {
                player.seekTo(time);
                player.playVideo();
            });
        },


        renderTitle: function(parent, idx, section, onClick) {
            var that = this;
            function makeClickCallback(idx) {
                return function() {
                    onClick(that.data[idx].start);
                }
            }
            var el = $(
                '<div class="title">' + ('number' in section ? section.number + '. ' : '') + section.title +
                    '<div class="duration">' + time_string.format(section.start) + '</div>' +
                '</div>'
            );
            el.click(makeClickCallback(idx));
            parent.append(el);
        },

        renderDescription: function(parent, idx, section) {
            if(!section.image && !section.description) {
                return;
            }
            var description = section.description.replace(/\{[^\}]+\}/g, function(m) {
                m = m.substr(1, m.length - 2).split('|');
                if(m.length > 1) {
                    var time = time_string.parse(m[1]);
                    var title = m[0];
                } else {
                    var time = time_string.parse(m[0]);
                    var title = time_string.format(time);
                }

                return '<span class="time-link" data-time="' + time + '">' + title + '</span>';
            });
            if(section.image) { 
                // section.image is either an URL to an image, or a #id
                // identifier for an image tag to fetch the URL from
                var html = '<div class="description hasImage">';
                var imgSrc = section.image;
                if(imgSrc[0] == '#') {
                    imgSrc = $('img' + imgSrc).attr('src');
                }
                html += '<div class="image"><img src="' + imgSrc + '"></img></div>';
                html += '<div>' + description + '</div>';
                html += '</div>';
            } else {
                var html = '<div class="description">';
                html += description;
                html += '</div>';
            }
            var el = $(html);

            function makeClickCallback(link) {
                var time = parseFloat($(link).data('time'));
                return function() {
                    player.seekTo(time);
                    player.playVideo();
                }
            }
            el.find('span.time-link').each(function() {
                $(this).click(makeClickCallback(this));
            });
            parent.append(el);
        },


        render: function(parent, onClick) {
            if(!this.visible) return;

            for(var i=0,section; section = this.data[i]; i++) {
                section.element = $('<div class="section"></div>');
                this.renderTitle(section.element, i, section, onClick);
                this.renderDescription(section.element, i, section);
                parent.append(section.element);
            }
        },


        refresh: function() {
            if(!this.visible) return;
            for(var i=0,section; section = this.data[i]; i++) {
                section.element.toggleClass('active', i === this.active);
                section.element.toggleClass('viewed', this.show_viewed && section.viewed);
            }
        },


        track: function(time) {
            for(var i=0,section; section=this.data[i]; i++) {
                if(time >= section.start && time < section.end) {
                    this.setActive(i);
                    var cnt = 0;
                    var refresh = false;
                    var scoreUpdate = false;
                    for(var j=0,part; part=this.data[i].parts[j]; j++) {
                        if(!part.viewed && time >= part.start && time < part.end) {
                            part.viewed = true;
                            refresh = true;
                        }
                        if(part.viewed) cnt++;
                    }
                    if(cnt && cnt > Math.floor(section.parts.length * 0.5)) {
                        var wasViewed = section.viewed;
                        section.viewed = true;
                        refresh = refresh || !wasViewed;
                        scoreUpdate = !wasViewed
                    }
                    if(refresh) {
                        this.refresh();
                    }
                    if(scoreUpdate && this.callback) {
                        this.callback();
                    }
                    return;
                }
            }
        },


        setActive: function(idx) {
            if(this.active === idx) return;
            this.active = idx;
            this.refresh();
        },


        getViewed: function() {
            var res = [];
            for(var i=0,section; section=this.data[i]; i++) {
                res.push({viewed: !!section.viewed, parts: section.parts});
            }
            return res;
        },


        setViewed: function(viewed) {
            for(var i=0,section; section=this.data[i]; i++) {
                var v = viewed[i];
                if(!v) { continue; }
                section.viewed = v.viewed;
                if(section.parts && v.parts) {
                    for(var j=0, part; part=section.parts[j]; j++) {
                        if(!v.parts[j]) { continue; }
                        part.viewed = !!v.parts[j].viewed;
                    }
                }
            }
            this.refresh();
        },


        destroy: function() {
            $.each(this.data, function(i, section) {
                section.element.remove();
            })
        }

    }



    // tpl
    var template = {

        elements: {},

        init: function(parent, config) {
            this.render(parent);
            var refreshLayout = this.getRefreshLayoutFunc(config);
            $(window).scroll(refreshLayout);
            $(window).resize(refreshLayout);
            if (window.Dual) { Dual.addResizeFunction(refreshLayout); }
            refreshLayout();
        },


        render: function(parent) {
            this.elements.root = $(
                '<div class="task-video">\
                    <div class="task-video-content" data-key="content">\
                        <div class="player" data-key="player"><div></div></div>\
                        <div class="sections" data-key="sections"></div>\
                    </div>\
                </div>'
            );
            var self = this;
            this.elements.root.find('[data-key]').each(function() {
                self.elements[$(this).data('key')] = $(this);
            });
            parent.html('').append(this.elements.root);
        },


        getRefreshLayoutFunc: function(config) {
            var elements = this.elements,
                win = $('#task'),
                doc = $(window.document),
                is_wide_mode_old = null;

            return function() {
                var is_fixed_content = win.scrollTop() > elements.root.position().top;
                var is_wide_mode = win.width() >= config.layout.wide_mode_min_width;

                elements.root.toggleClass('task-video-wide-mode', is_wide_mode);
                elements.root.toggleClass('task-video-narrow-mode', !is_wide_mode);

                var scroll = Math.max(0, win.scrollTop() - elements.root.position().top);

                if(is_wide_mode_old !== is_wide_mode) {
                    is_wide_mode_old = is_wide_mode;
                    elements.root.height('');
                    elements.content.width('');
                    elements.content.height('');
                    elements.player.height('');
                    elements.player.width('');
                    elements.sections.height('');
                    elements.sections.width('');
                    elements.sections.css('margin-top', '');
                }

                if(is_wide_mode) {
                    var video_width = config.layout.wide_mode_video_width * elements.root.width();
                    elements.player.width(video_width);
                    elements.sections.width(elements.root.width() - video_width);
                    elements.content.width(elements.root.width());

                    var max_height = video_width / config.layout.video_aspect_ratio;
                    var height = Math.floor(Math.max(0.5 * max_height, max_height - scroll));
                    elements.root.height(height);
                    elements.content.height(height);
                } else {
                    var max_height = elements.root.width() / config.layout.video_aspect_ratio;
                    elements.sections.height(max_height);
                    var player_height = Math.max(0.5 * max_height, max_height - scroll);
                    elements.player.height(player_height);
                    elements.sections.css('margin-top', is_fixed_content ? max_height : '');
                }

                elements.content.toggleClass('fixed-content', is_fixed_content);
            }
        },


        get: function(name) {
            return this.elements[name];
        },




        destroy: function() {
            $(window).unbind('scroll');
            $(window).unbind('resize');
            this.elements.root && this.elements.root.remove();
            this.elements = {};
        }
    }



    // player watcher
    var watchDog = {

        interval: null,

        watch: function() {
            if(this.interval !== null) return;
            this.interval = setInterval(function() {
                sections.track(player.getCurrentTime());
            }, 100);
        },


        stop: function() {
            clearInterval(this.interval);
            this.interval = null;
        }
    }



    // player init

    function createYoutubePlayer(parent, config, events) {
        ready = false;
        var defaults = {}
        if(window.stringsLanguage) {
            defaults.hl = window.stringsLanguage;
        }
        var youtube = Object.assign(defaults, config.youtube);

        var player = new YT.Player(parent, {
            videoId: config.video_id,
            height: '100%',
            width: '100%',
            enablejsapi: 1,
            origin: null, // ??
            host: 'https://www.youtube.com',
            playerVars: youtube,
            events: {
                'onReady': function(e) {
                    sections.init(config, template.get('sections'));
                    ready = true;
                    if(state_cache) {
                        stateHandler(state_cache);
                        delete(state_cache);
                    }
                },
                'onStateChange': function(e) {
                    if(e.data === YT.PlayerState.PLAYING) {
                        watchDog.watch();
                    } else {
                        watchDog.stop();
                    }
                    if(e.data === YT.PlayerState.ENDED && events.onPlaybackEnd) {
                        events.onPlaybackEnd();
                    }
                },
                'onError': function(e) {
                    console.log('onError', e.data)
                }
            }
        });

        player.isPlaying = function () {
            return player.getPlayerState() === YT.PlayerState.PLAYING
        };

        return player;
    }

    function createPeertubePlayer(parent, config, events) {
        ready = false;

        var iframe = document.createElement("iframe");
        iframe.src = config.peertubeServer + `/videos/embed/${config.video_id}?api=1&warningTitle=0&peertubeLink=0&p2p=0`;
        iframe.allow = 'autoplay';
        iframe.sandbox.add("allow-same-origin", "allow-scripts", "allow-popups", "allow-forms");
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.inset = '0px';
        parent.replaceWith(iframe);

        var player = new PeerTubePlayer(iframe);

        var currentTime = null;
        var playbackStatus = null;
        var seekedTime = null;

        function onPlaybackStatusChange(newStatus) {
            console.log('status change', {playbackStatus, newStatus, seekedTime});

            playbackStatus = newStatus;
            if(newStatus === 'ended' && events.onPlaybackEnd) {
                events.onPlaybackEnd();
            }
        }

        function onPlaybackStatusUpdate(data) {
            console.log('status update', data);
            currentTime = data['position'];
            playbackStatus = data['playbackState'];
            console.log('status update', playbackStatus);

            if (seekedTime && playbackStatus && 'unstarted' !== playbackStatus) {
                player.seek(seekedTime);
                seekedTime = null;
            }

            if ('playing' === playbackStatus) {
                sections.track(data['position']);
            }
        }

        player.addEventListener('playbackStatusChange', onPlaybackStatusChange);
        player.addEventListener('playbackStatusUpdate', onPlaybackStatusUpdate);

        player.ready.then(function () {
            sections.init(config, template.get('sections'));
            ready = true;
            if(state_cache) {
                stateHandler(state_cache);
                delete(state_cache);
            }
        });

        // Note: Peertube does not support getting duration, and duration is not available until the user starts the video
        player.getDuration = function () {
            return Number.MAX_VALUE;
        };

        player.seekTo = function (time) {
            if (!playbackStatus || playbackStatus === 'unstarted') {
                seekedTime = time;
                // Some buffering is needed before the player can seek to specified time.
                player.play();
            } else {
                player.seek(time);
            }
        };

        player.playVideo = function () {
            player.play();
        };

        player.pauseVideo = function () {
            player.pause();
        };

        player.destroy = function () {
            player.removeEventListener('playbackStatusChange', onPlaybackStatusChange);
            player.removeEventListener('playbackStatusUpdate', onPlaybackStatusUpdate);
        };

        player.getCurrentTime = function () {
            return currentTime;
        };

        player.isPlaying = function () {
            return 'playing' === playbackStatus;
        };

        window.player = player;

        return player;
    }


    function makeConfig(params, callback) {
        var defaults = {
            layout: {
                video_aspect_ratio: 16/9,
                wide_mode_min_width: 1024,
                wide_mode_video_width: 0.6,
                enumerate_sections: true
            },
            callback: callback
        }
        return Object.assign(defaults, params);
    }


    function stateHandler(state) {

        if(!ready) {
            //console.error('Player not ready');
            return null;
        }

        if(state) {
            if('sections' in state) {
                sections.setViewed(state.sections);
            }
            if('timestamp' in state) {
                player.seekTo(state.timestamp);
                //player.playVideo();
            }
        } else {
            var sectionsData = sections.getViewed();
            var nbViewed = 0;
            for(var i=0, section; section=sectionsData[i]; i++) {
                if(section.viewed) { nbViewed += 1; }
            }
            return {
                timestamp: player.getCurrentTime(),
                playing: player.isPlaying(),
                viewed: nbViewed,
                total: sectionsData.length,
                sections: sectionsData
            }
        }
    }

    function getVideoPlatform(config) {
        if (config.peertubeServer) {
            return {
                name: 'peertube',
                createPlayer: createPeertubePlayer,
                loader: function (callback) {
                    callback();
                },
            };
        }

        return {
            name: 'youtube',
            createPlayer: createYoutubePlayer,
            loader: youtubeApiLoader.load.bind(youtubeApiLoader)
        };
    }

    // jQuery plugin interface

    $.fn.taskVideo = function(params, callback, events) {
        var that = this;
        var config = makeConfig(params, callback);
        if(!events) { events = {}; }
        if(callback) { events.onPlaybackEnd = callback; }
        var platform = getVideoPlatform(config);

        platform.loader(function() {
            template.init(that, config);
            player = platform.createPlayer(template.get('player').find('div')[0], config, events);
        });
        return this;
    }


    $.fn.taskVideo.ready = function() {
        return ready;
    }


    $.fn.taskVideo.state = function(state) {
        if(ready) {
            return stateHandler(state);
        } else if(state !== undefined) {
            state_cache = state;
        } else {
            return state_cache;
        }
    }


    $.fn.taskVideo.destroy = function() {
        delete(state_cache);
        watchDog.stop();
        player && player.destroy();
        player = null;
        template.destroy();
    }

})(jQuery);
