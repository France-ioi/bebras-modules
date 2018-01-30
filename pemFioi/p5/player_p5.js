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
        visualization_fill_color: '#990000'
    }

    var options = (function() {
        var res = {}
        for(var k in defaults) {
            res[k] = k in options ? options[k] : defaults[k]
        }
        return res
    })()



    function SignalChannel() {

        var generator = null;

        function initGenerator(type, frequency, amplitude) {
            if(amplitude < 0 || amplitude > 1) {
                throw new Error('Amplitude is out of range [0..1]');
            }
            if(type == 'noise') {
                generator = new p5.Noise('white');
            } else {
                if(frequency < options.min_frequency || frequency > options.max_frequency) {
                    throw new Error('Frequency is out of range [' + options.min_frequency + '..' + options.max_frequency + ']');
                }
                generator = new p5.Oscillator();
                generator.setType(type);
                generator.freq(frequency);
            }
            generator.amp(amplitude);
        }


        this.play = function(type, frequency, amplitude) {
            this.stop();
            initGenerator(type, frequency, amplitude);
            generator.start();
        }


        this.stop = function() {
            generator && generator.stop();
            generator = null;
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
        var bars_y = (options.visualize_wave ? div_y : 0) + 1;  //hide border
        var bars_height = options.visualize_wave ? options.height - bars_y  : options.height;


        function render() {
            if(rendering) return;
            rendering = true;
            context.clearRect(0, 0, options.width, options.height);
            options.visualize_wave && renderWave(0, wave_height);
            options.visualize_bars && renderBars(bars_y, bars_height);
            rendering = false;
        }

        var interval = setInterval(render, options.visualization_fps ? 1000/options.visualization_fps : 100);


        this.destroy = function() {
            clearInterval(interval);
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
    // init visualization
    var visualizator = new Visualizator();





    // interface
    this.playSignal = function(channel, type, frequency, amplitude) {
        channel = channel - 1;
        if(channel < 0 || channel > options.channels) {
            throw new Error('Channel is out of range [1..' + options.channels + ']');
        }
        channels[channel].stop();
        channels[channel].play(type, frequency, amplitude);
    }


    this.playRecord = function(url, frequency) {
        //TODO
    }


    this.playStop = function(url, frequency) {
        for(var i=0; i<options.channels; i++) {
            channels[i].stop();
        }
    }


    this.destroy = function() {
        for(var i=0; i<options.channels; i++) {
            channels[i].stop();
        }
        visualizator.destroy();
    }

}