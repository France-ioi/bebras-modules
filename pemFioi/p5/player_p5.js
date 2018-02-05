function PlayerP5(options) {

    var defaults = {
        parent: document.body,
        channels: 3,
        min_frequency: 100,
        max_frequency: 8000,
        width: 400,
        height: 400,
        visualize_wave: true,
        visualize_bars: true,
        visualization_fps: 20,
        visualization_smoothing: 0.3,
        visualization_resolution: 64, // Must be a power of two between 16 and 1024.
        visualization_stroke_color: '#333333',
        visualization_fill_color: '#990000',
        filesRepository: null
    }

    var options = (function() {
        var res = {}
        for(var k in defaults) {
            res[k] = k in options ? options[k] : defaults[k]
        }
        return res
    })()



    // play waveforms or noise
    function SignalChannel() {

        var generator = null;
        var generator_type = null;
        var freq = null;

        function initGenerator(type, frequency, amplitude) {
            if(amplitude < 0 || amplitude > 1) {
                throw new Error('Amplitude is out of range [0..1]');
            }
            if(type == 'noise') {
                if(generator_type !== type) {
                    generator = new p5.Noise('white');
                    generator_type = type;
                }
                freq = null;
            } else {
                if(frequency < options.min_frequency || frequency > options.max_frequency) {
                    throw new Error('Frequency is out of range [' + options.min_frequency + '..' + options.max_frequency + ']');
                }
                if(generator_type !== type) {
                    generator = new p5.Oscillator();
                    generator_type = type;
                }
                generator.setType(type);
                generator.freq(frequency);
                freq = frequency;
            }
            generator.amp(amplitude);
        }


        this.init = function(type, frequency, amplitude) {
            initGenerator(type, frequency, amplitude);
        }


        this.play = function(rate) {
            if(generator && rate > 0) {
                freq !== null && generator.freq(Math.min(24000, freq * rate));
                generator.start();
            }
        }


        this.stop = function() {
            generator && generator.stop();
        }


        this.destroy = function() {
            this.stop();
            generator = null;
            generator_type = null;
        }
    }



    // play file
    function FileChannel() {

        var file = null;
        var filter = null;

        this.init = function(url, frequency, onLoadEnd, onLoadError, onLoadProgress) {
            if(frequency < options.min_frequency || frequency > options.max_frequency) {
                throw new Error('Frequency is out of range [' + options.min_frequency + '..' + options.max_frequency + ']');
            }
            file = new p5.SoundFile(
                url,
                onLoadEnd,
                onLoadError,
                onLoadProgress
            );
            file.disconnect();
            filter = new p5.LowPass()
            filter.freq(frequency);
            file.connect(filter);
        }


        this.play = function(rate) {
            if(!file || !rate) return;
            file.playMode('sustain');
            file.rate(rate)
            file.play();
        }


        this.stop = function() {
            file && file.pause();
        }


        this.destroy = function() {
            this.stop();
            file = null;
            filter = null;
        }
    }








    function Visualizator() {

        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        options.parent.appendChild(canvas);

        var context = canvas.getContext('2d');
        context.strokeStyle = options.visualization_stroke_color;

        var fft = new p5.FFT(options.visualization_smoothing, options.visualization_resolution);

        var microphone = null;
        var microphone_enabled = false;
        var playback_render = false;


        function getFFT() {
            return !playback_render && microphone_fft ? microphone_fft : fft;
        }

        // waveform
        function renderWave(y, height) {
            var waveform = fft.waveform();
            var dx = Math.round(options.width / waveform.length);
            var wave_amp = height * 0.5;
            var wave_y = y + wave_amp;

            function dy(i) {
                return wave_y + wave_amp * waveform[i];
            }
            context.beginPath();
            context.moveTo(0, dy(0))
            for(var i=1; i<waveform.length; i++) {
                context.lineTo(i*dx, dy(i))
            }
            context.stroke();
        }


        // spectrum bars
        function getSpectrum() {
            var spectrum = fft.analyze();
            for(var i=0; i<spectrum.length; i++) {
                spectrum[i] = spectrum[i]/255;
            }
            return spectrum;
        }

        function renderBars(y, height) {
            var spectrum = getSpectrum();
            context.fillStyle = options.visualization_fill_color;
            context.lineWidth = 1;
            var bar_width = Math.round(options.width / spectrum.length);
            var bar_height, bar_x, bar_y;
            for(var i=0; i<spectrum.length; i++) {
                bar_height = height * spectrum[i];
                bar_x = i * bar_width;
                bar_y = y + height - bar_height;
                context.fillRect(bar_x, bar_y, bar_width, bar_height);
                context.strokeRect(bar_x, bar_y, bar_width, bar_height);
            }
        }

        var rendering = false;
        var div_y = Math.round(options.height * 0.5);
        var wave_height = options.visualize_bars ? div_y  : options.height;
        var bars_y = (options.visualize_wave ? div_y : 0) + 1;  // +1 to hide border
        var bars_height = options.visualize_wave ? options.height - bars_y  : options.height;


        function render() {
            if(rendering) return;
            if(playback_render || microphone) {
                rendering = true;
                context.clearRect(0, 0, options.width, options.height);
                options.visualize_wave && renderWave(0, wave_height);
                options.visualize_bars && renderBars(bars_y, bars_height);
                rendering = false;
            }
        }


        var interval = setInterval(
            render,
            options.visualization_fps ? 1000/options.visualization_fps : 100
        );


        this.start = function() {
            playback_render = true;
            fft.setInput();
        }


        this.stop = function() {
            playback_render = false;
            this.refreshMicrophoneInput();
        }


        this.refreshMicrophoneInput = function() {
            if(microphone_enabled) {
                if(!microphone) {
                    microphone = new p5.AudioIn()
                    microphone.start();
                }
                fft.setInput(microphone);
            } else {
                microphone = null;
                fft.setInput();
            }
        }


        this.toggleMicrophone = function(enabled) {
            microphone_enabled = enabled;
            this.refreshMicrophoneInput();
        }

        this.destroy = function() {
            clearInterval(interval);
            this.toggleMicrophone(false);
            options.parent.removeChild(canvas)
            context = null
            canvas = null
            fft = null;
        }
    }


    // init
    var playing = false;

    // init channels
    var channels = [];
    for(var i=0; i<options.channels; i++) {
        channels[i] = new SignalChannel();
    }
    // and last channel for file
    channels[i] = new FileChannel();

    // init visualization
    var visualizator = new Visualizator();



    // interface
    this.initSignal = function(channel, type, frequency, amplitude) {
        channel = channel - 1;
        if(channel < 0 || channel > options.channels) {
            throw new Error('Channel is out of range [1..' + options.channels + ']');
        }
        channels[channel].stop();
        channels[channel].init(type, frequency, amplitude);
    }


    this.initRecord = function(url, frequency, onLoadProgress, onLoadEnd) {
        var file = parseInt(url, 10) == url && options.filesRepository ? options.filesRepository(url - 1) : url;
        if(!file) {
            throw new Error('Wrong file param');
        }
        channels[channels.length - 1].init(file, frequency, onLoadProgress, onLoadEnd);
    }


    this.changeRate = function(rate) {
        if(!playing) return;
        for(var i=0; i<channels.length; i++) {
            channels[i].play(rate);
        }
    }


    this.play = function(rate) {
        if(playing) return;
        playing = true;
        visualizator.start();
        for(var i=0; i<channels.length; i++) {
            channels[i].stop();
            channels[i].play(rate);
        }
    }


    this.stop = function() {
        playing = false;
        visualizator.stop();
        for(var i=0; i<channels.length; i++) {
            channels[i].stop();
        }
    }


    this.toggleMicrophone = function(enabled) {
        visualizator.toggleMicrophone(enabled);
    }


    this.destroyChannels = function() {
        for(var i=0; i<channels.length; i++) {
            channels[i].destroy();
        }
    }

    this.destroy = function() {
        this.destroyChannels();
        visualizator.destroy();
    }

}