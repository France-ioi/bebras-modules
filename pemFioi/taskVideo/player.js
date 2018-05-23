/*

    player -> watcher -> sections
*/


(function($) {

    var player;


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

        generateSections: function(amount) {
            var duration = player.getDuration() / amount;
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
            if(!config.sections) {
                this.data = this.generateSections(1);
            } else if(Number.isInteger(config.sections)) {
                this.data = this.generateSections(config.sections);
            } else {
                this.data = config.sections.slice();
                for(var i=0,section; section = this.data[i]; i++) {
                    section.viewed = false;
                    section.parts = [];
                    var part_duraton = (section.end - section.start) / section.parts;
                    for(var j=0; j<section.parts; j++) {
                        section.parts[i] = {
                            vieved: false,
                            start: section.start + j * part_duraton,
                            end: section.start + (j + 1) * part_duraton
                        }
                    }
                    /*
                    .fill.call(
                        { length: section.parts },
                        { vieved: false }
                    );
                    */
                }

            }
            this.render(parent, function(time) {
                player.seekTo(time);
                player.playVideo();
            });
        },


        render: function(parent, onClick) {
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
            for(var i=0,section; section = this.data[i]; i++) {
                section.element.toggleClass('active', i === this.active);
                section.element.toggleClass('viewed', section.viewed);
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
            this.elements.wrapper.remove();
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
        var defaults = {}
        if(window.stringsLanguage) {
            defaults.hl = window.stringsLanguage;
        }
        var playerVars = Object.assign(defaults, config.playerVars);


        return new YT.Player(parent, {
            videoId: config.videoId,
            height: '100%',
            width: '100%',
            enablejsapi: 1,
            origin: null, // ??
            host: 'https://www.youtube.com',
            playerVars: playerVars,
            events: {
                'onReady': function(e) {
                    sections.init(player, config, template.get('sections'));
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


    $.fn.taskVideo.info = function() {
        if(!player) {
            console.error('Player not ready');
            return null;
        }
        return {
            timestamp: player.getCurrentTime(),
            viewed: sections.getViewed()
        }
    }


    $.fn.taskVideo.destroy = function() {
        watcher.destroy();
        player.destroy();
        player = null;
        template.destroy();
    }

})(jQuery);