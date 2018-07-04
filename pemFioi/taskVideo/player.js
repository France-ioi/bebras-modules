(function($) {

    var player;
    var ready = false;
    var state_cache;

    // load youtube IFrame Player API
    var apiLoader = {
        callbacks: [],
        loaded: false,
        loading: false,

        fetch: function() {
            window.onYouTubePlayerAPIReady = function() {
                delete window.onYouTubePlayerAPIReady;
                apiLoader.loaded = true;
                var cb;
                while(cb = apiLoader.callbacks.pop()) {
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
                            vieved: false,
                            start: i * duration,
                            end: (i + 1) * duration
                        }
                    ],
                    description: null
                });
            }
            return res;
        },


        init: function(player, config, parent) {
            this.active = null;
            this.show_viewed = !!config.show_viewed;
            if(!config.sections) {
                this.visible = false;
                this.data = this.generateSections(1);
            } else if(Number.isInteger(config.sections)) {
                this.visible = false;
                this.data = this.generateSections(config.sections);
            } else {
                this.visible = true;
                this.data = config.sections.slice();
                for(var i=0,section; section = this.data[i]; i++) {
                    section.viewed = false;
                    var parts_amount = Number.isInteger(section.parts) ? section.parts : 1;
                    var part_duraton = (section.end - section.start) / parts_amount;

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


        render: function(parent, onClick) {
            if(!this.visible) return;
            var that = this;
            function makeClickCallback(idx) {
                return function() {
                    onClick(that.data[idx].start);
                }
            }
            for(var i=0,section; section = this.data[i]; i++) {
                section.element = $(
                    '<div class="section">' +
                        '<div class="title">' + section.title + '</div>' +
                        (section.description ? '<div class="description">' + section.description + '</div>' : '') +
                    '</div>'
                );
                section.element.click(makeClickCallback(i));
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
                    for(var j=0,part; part=this.data[i].parts[j]; j++) {
                        if(!part.viewed && time >= part.start && time < part.end) {
                            part.viewed = true;
                            refresh = true;
                        }
                        if(part.viewed) cnt++;
                    }
                    if(cnt && cnt > Math.floor(section.parts.length * 0.5)) {
                        section.viewed = true;
                        refresh = true;
                    }
                    if(refresh) {
                        this.refresh();
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
                if(section.viewed) {
                    res.push(i);
                }
            }
            return res;
        },


        setViewed: function(viewed) {
            for(var i=0,section; section=this.data[i]; i++) {
                section.viewed = viewed.indexOf(i) !== -1;
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

        init: function(parent) {
            this.elements = {
                wrapper: $('<div class="task-video"></div>'),
                introduction: $('<div class="introduction"></div>'),
                video: $('<div class="video"></div>'),
                sections: $('<div class="sections"></div>'),
                conclusion: $('<div class="conclusion"></div>'),
            };
            parent.html('');
            parent.append(this.elements.wrapper)
            for(var name in this.elements) {
                if(name !== 'wrapper') {
                    this.elements.wrapper.append(this.elements[name]);
                }
            }
        },


        get: function(name) {
            return this.elements[name];
        },


        html: function(name, html) {
            if(typeof html === 'undefined') {
                this.elements[name].hide();
            } else {
                this.elements[name].show();
                this.elements[name].html(html);
            }
        },


        width: function(name, width) {
            this.elements[name].width(width);
        },


        height: function(name, height) {
            this.elements[name].height(height);
        },


        destroy: function() {
            this.elements.wrapper && this.elements.wrapper.remove();
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

    function createPlayer(parent, config) {
        ready = false;
        var defaults = {}
        if(window.stringsLanguage) {
            defaults.hl = window.stringsLanguage;
        }
        var youtube = Object.assign(defaults, config.youtube);


        return new YT.Player(parent, {
            videoId: config.video_id,
            height: '100%',
            width: '100%',
            enablejsapi: 1,
            origin: null, // ??
            host: 'https://www.youtube.com',
            playerVars: youtube,
            events: {
                'onReady': function(e) {
                    sections.init(player, config, template.get('sections'));
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
                },
                'onError': function(e) {
                    console.log('onError', e.data)
                }
            }
        });
    }


    function makeConfig(params) {
        var defaults = {
            width: '100%',
            height: '400px'
        }
        return Object.assign(defaults, params);
    }


    function stateHandler(state) {
        
        if(!ready) {
            //console.error('Player not ready');
            return null;
        }
       
        if(state) {
            if('viewed' in state) {
                sections.setViewed(state.viewed);
            }
            if('timestamp' in state) {
                player.seekTo(state.timestamp);
            }
            if('playing' in state && state.playing) {
                player.playVideo();
            } else {
                player.pauseVideo();
            }
        } else {
            return {
                timestamp: player.getCurrentTime(),
                playing: player.getPlayerState() === YT.PlayerState.PLAYING,
                viewed: sections.getViewed()
            }
        }
    }

    // jQuery plugin interface

    $.fn.taskVideo = function(params) {
        var that = this;
        var config = makeConfig(params)
        apiLoader.load(function() {
            template.init(that);
            template.html('introduction', config['introduction']);
            template.html('conclusion', config['conclusion']);
            template.width('wrapper', config.width);
            template.height('video', config.height);
            player = createPlayer(template.get('video')[0], config);

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