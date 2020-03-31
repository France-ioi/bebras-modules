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


        function createGenerator(type, frequency, amplitude) {
            var generator;
            if(type == 'noise') {
                generator = new p5.Noise('white');
                generator.freq = function() {}
            } else {
                generator = new p5.Oscillator();
                generator.setType(type);
            }
            return generator;
        }


        function realFrequency(frequency, rate) {
            return Math.min(24000, frequency * rate);
        }


        this.init = function(type, frequency, amplitude) {
            if(amplitude < 0 || amplitude > 1) {
                throw new Error('Amplitude is out of range [0..1]');
            }
            if(frequency < options.min_frequency || frequency > options.max_frequency) {
                throw new Error('Frequency is out of range [' + options.min_frequency + '..' + options.max_frequency + ']');
            }
            if(type !== this.type) {
                this.reset();
                this.generator = createGenerator(type);
                this.type = type;
            }
            if(amplitude !== this.amplitude) {
                this.generator.amp(amplitude);
                this.amplitude = amplitude;
            }
            this.frequency = frequency;
        }


        this.setRate = function(rate) {
            if(this.generator && rate > 0) {
                this.generator.freq(realFrequency(this.frequency, rate));
            }
        }


        this.play = function() {
            if(this.playing || !this.generator) return;
            this.generator.start();
            this.playing = true;
        }


        this.pause = function() {
            this.generator && this.generator.stop();
            this.playing = false;
        }


        this.reset = function() {
            this.playing = false;
            this.generator && this.generator.stop();
            this.generator = null;
            this.type = null;
            this.frequency = null;
            this.amplitude = null;
        }

        this.reset();
    }



    // play file
    function FileChannel() {

        this.init = function(url, frequency, onLoadEnd, onLoadError, onLoadProgress) {
            if(frequency < options.min_frequency || frequency > options.max_frequency) {
                throw new Error('Frequency is out of range [' + options.min_frequency + '..' + options.max_frequency + ']');
            }
            if(url !== this.url) {
                if(!url) {
                    throw new Error('Wrong file param');
                }                
                this.reset();
                this.url = url;
                this.file = new p5.SoundFile(
                    options.filesRepository.getFile(url),
                    onLoadEnd,
                    onLoadError,
                    onLoadProgress
                );
                this.file.disconnect();
                this.filter = new p5.LowPass()
                this.filter.freq(frequency);
                this.frequency = frequency;
                this.file.connect(this.filter);
                this.file.playMode('restart');
            } else {
                if(frequency !== this.frequency) {
                    this.filter.freq(frequency);
                    this.frequency = frequency;
                }
                onLoadEnd();
            }
        }


        this.play = function() {
            if(this.playing || !this.file) return;
            this.playing = true;
            this.file.play();
        }


        this.setRate = function(rate) {
            if(!this.file || !rate) return;
            this.file.rate(rate);
        }


        this.pause = function() {
            this.playing = false;
            this.file && this.file.pause();
        }


        this.reset = function() {
            this.file && this.file.stop();
            this.playing = false;
            this.url = null;
            this.frequency = null;
            this.file = null;
            this.filter = null;
        }

        this.reset();
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
        channels[channel].init(type, frequency, amplitude);
    }


    this.initRecord = function(url, frequency, onLoadProgress, onLoadEnd) {
        channels[channels.length - 1].init(url, frequency, onLoadProgress, onLoadEnd);
    }


    this.setRate = function(rate) {
        for(var i=0, channel; channel=channels[i]; i++) {
            channel.setRate(rate);
        }
    }


    this.play = function() {
        visualizator.start();
        for(var i=0, channel; channel=channels[i]; i++) {
            channel.play();
        }
    }


    this.pause = function() {
        visualizator.stop();
        for(var i=0, channel; channel=channels[i]; i++) {
            channel.pause();
        }
    }


    this.toggleMicrophone = function(enabled) {
        visualizator.toggleMicrophone(enabled);
    }


    this.resetChannels = function() {
        for(var i=0, channel; channel=channels[i]; i++) {
            channel.reset();
        }
    }


    this.destroy = function() {
        this.resetChannels();
        channels = null;
        visualizator.destroy();
        visualizator = null;
    }

}