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
        visualization_resolution: 32, // Must be a power of two between 16 and 1024.
        visualization_stroke_color: '#333333',
        visualization_fill_color: '#990000',
        visualization_background_color: '#ffffff'
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



    // init channels
    var channels = [];
    for(var i=0; i<options.channels; i++) {
        channels[i] = new SignalChannel();
    }


    // init visualization
    var canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    options.parent.appendChild(canvas);
    var context = canvas.getContext('2d');
    context.strokeStyle = options.visualization_stroke_color;

    var fft = new p5.FFT(options.visualization_smoothing, options.visualization_resolution);

    function visualizeBars(spectrum) {
        context.fillStyle = options.visualization_fill_color;
        context.lineWidth = 1;
        var dx = Math.round(options.width / spectrum.length);
        for(var i=0; i<spectrum.length; i++) {
            var dy = options.height * spectrum[i] * 0.5;
            context.fillRect(i * dx, 1 + options.height - dy, dx, dy);
            context.rect(i * dx, 1 + options.height - dy, dx, dy);
            context.stroke();
        }
    }



    function visualizeWave(spectrum) {
        var dx = Math.round(options.width / spectrum.length);
        var h = options.height * 0.25;
        function dy(i) {
            return h * (1 - spectrum[i]);
        }
        context.beginPath();
        context.moveTo(0, dy(0))
        for(var i=1; i<spectrum.length; i++) {
            context.lineTo(i*dx, dy(i))
        }
        context.stroke();
    }
    //visualizeWave([0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]);


    var visualization_rendering = false;
    var visualization_interval = setInterval(function() {
        if(visualization_rendering) return;
        visualization_rendering = true;
        var spectrum = fft.analyze();
        for(var i=0; i<spectrum.length; i++) {
            spectrum[i] = spectrum[i]/255;
        }

        context.fillStyle = options.visualization_background_color;
        context.fillRect(0, 0, options.width, options.height);
        options.visualize_bars && visualizeBars(spectrum);
        options.visualize_wave && visualizeWave(spectrum);
        visualization_rendering = false;
    }, 1000/options.visualization_fps);




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
        clearInterval(visualization_interval);
        options.parent.removeChild(canvas)
        context = null
        canvas = null
    }

}