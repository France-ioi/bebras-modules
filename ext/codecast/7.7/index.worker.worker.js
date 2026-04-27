(function() {
	var e = Object.create, t = Object.defineProperty, a = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, s = Object.getPrototypeOf, r = Object.prototype.hasOwnProperty, _ = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), i = (_, i, o) => (o = null != _ ? e(s(_)) : {}, ((e, s, _, i) => {
		if (s && "object" == typeof s || "function" == typeof s) for (var o, l = n(s), f = 0, h = l.length; f < h; f++) o = l[f], r.call(e, o) || o === _ || t(e, o, {
			get: ((e) => s[e]).bind(null, o),
			enumerable: !(i = a(s, o)) || i.enumerable
		});
		return e;
	})(!i && _ && _.__esModule ? o : t(o, "default", {
		value: _,
		enumerable: !0
	}), _)), o = _((e, t) => {
		var a = {};
		t.exports = function(e) {
			if ("undefined" == typeof window) return null;
			var t = window.OfflineAudioContext || window.webkitOfflineAudioContext, n = window.AudioContext || window.webkitAudioContext;
			if (!n) return null;
			"number" == typeof e && (e = { sampleRate: e });
			var s = e && e.sampleRate;
			if (e && e.offline) return t ? new t(e.channels || 2, e.length, s || 44100) : null;
			var r = a[s];
			if (r) return r;
			try {
				r = new n(e);
			} catch (_) {
				r = new n();
			}
			return a[r.sampleRate] = a[s] = r, r;
		};
	}), l = i(_((e, t) => {
		var a = o();
		function n(e, t) {
			if (!(this instanceof n)) return new n(e, t);
			if (t || (e = (t = e) && t.context), t || (t = {}), void 0 === e && (e = a()), null == t.numberOfChannels && (t.numberOfChannels = 1), null == t.sampleRate && (t.sampleRate = e && e.sampleRate || this.sampleRate), null == t.length && (null != t.duration ? t.length = t.duration * t.sampleRate : t.length = 1), e && e.createBuffer) return e.createBuffer(t.numberOfChannels, Math.ceil(t.length), t.sampleRate);
			this.length = Math.ceil(t.length), this.numberOfChannels = t.numberOfChannels, this.sampleRate = t.sampleRate, this.duration = this.length / this.sampleRate, this._data = new Float32Array(this.length * this.numberOfChannels), this._channelData = [];
			for (var s = 0; s < this.numberOfChannels; s++) this._channelData.push(this._data.subarray(s * this.length, (s + 1) * this.length));
		}
		t.exports = n, n.prototype.numberOfChannels = 1, n.prototype.sampleRate = 44100, n.prototype.getChannelData = function(e) {
			if (e >= this.numberOfChannels || e < 0 || null == e) throw Error("Cannot getChannelData: channel number (" + e + ") exceeds number of channels (" + this.numberOfChannels + ")");
			return this._channelData[e];
		}, n.prototype.copyFromChannel = function(e, t, a) {
			null == a && (a = 0);
			for (var n = this._channelData[t], s = a, r = 0; s < this.length && r < e.length; s++, r++) e[r] = n[s];
		}, n.prototype.copyToChannel = function(e, t, a) {
			var n = this._channelData[t];
			a || (a = 0);
			for (var s = a, r = 0; s < this.length && r < e.length; s++, r++) n[s] = e[r];
		};
	})(), 1), f = class {
		constructor({ numberOfChannels: e, sampleRate: t }) {
			this.numberOfChannels = 0, this.sampleRate = 0, this.duration = 0, this.length = 0, this.channels = [], this.numberOfChannels = e, this.sampleRate = t, this.duration = 0, this.length = 0, this.channels = new Array(e);
			for (let a = 0; a < e; a += 1) this.channels[a] = { chunks: [] };
		}
		stats() {
			const { numberOfChannels: e, sampleRate: t, duration: a, length: n, channels: s } = this;
			return {
				numberOfChannels: e,
				sampleRate: t,
				duration: a,
				length: n,
				channels: s.map(({ chunks: e }) => ({ chunks: e.length }))
			};
		}
		getAudioBuffer(e) {
			const { length: t, sampleRate: a, numberOfChannels: n, channels: s } = this, r = new l.default({
				length: t,
				sampleRate: a,
				numberOfChannels: n
			}), _ = t * n;
			let i = 0;
			for (let o = 0; o < n; o += 1) {
				let t = 0;
				for (let a of s[o].chunks) r.copyToChannel(a, o, t), t += a.length, i += a.length, "function" == typeof e && e(i / _);
			}
			return r;
		}
		addSamples(e) {
			const { numberOfChannels: t, channels: a } = this, n = e[0].length;
			for (let s = 0; s < t; s += 1) {
				if (e[s].length !== n) throw new Error("inconsistent chunk lengths");
				a[s].chunks.push(e[s]);
			}
			return this.length += n, this.duration = this.length / this.sampleRate, !0;
		}
		truncateAt(e) {
			const { sampleRate: t, numberOfChannels: a, channels: n } = this, s = Math.round(e * t), r = n[0].chunks;
			let _ = 0;
			for (let i = 0; i < r.length; i += 1) {
				const e = r[i], o = _ + e.length;
				if (s <= o) {
					const r = s - _;
					if (r < e.length) for (let e = 0; e < a; e += 1) n[e].chunks[i] = n[e].chunks[i].slice(0, r);
					for (let e = 0; e < a; e += 1) n[e].chunks.splice(i + 1);
					return this.length = s, this.duration = s / t, !0;
				}
				_ = o;
			}
			return !1;
		}
	}, h = _((e, t) => {
		function a(e) {
			return new Int16Array(e);
		}
		function n(e) {
			return new Int32Array(e);
		}
		function s(e) {
			return new Float32Array(e);
		}
		var r = { fill: function(e, t, a, n) {
			if (2 == arguments.length) for (var s = 0; s < e.length; s++) e[s] = arguments[1];
			else for (s = t; s < a; s++) e[s] = n;
		} }, _ = {
			arraycopy: function(e, t, a, n, s) {
				for (var r = t + s; t < r;) a[n++] = e[t++];
			},
			out: {}
		};
		_.out.println = function(e) {
			console.log(e);
		}, _.out.printf = function() {
			console.log.apply(console, arguments);
		};
		var i = {};
		function o(e) {
			this.ordinal = e;
		}
		i.SQRT2 = 1.4142135623730951, i.FAST_LOG10 = function(e) {
			return Math.log10(e);
		}, i.FAST_LOG10_X = function(e, t) {
			return Math.log10(e) * t;
		}, o.short_block_allowed = new o(0), o.short_block_coupled = new o(1), o.short_block_dispensed = new o(2), o.short_block_forced = new o(3);
		var l = {};
		function f(e) {
			this.ordinal = e;
		}
		l.MAX_VALUE = 34028235e31, f.vbr_off = new f(0), f.vbr_mt = new f(1), f.vbr_rh = new f(2), f.vbr_abr = new f(3), f.vbr_mtrh = new f(4), f.vbr_default = f.vbr_mtrh;
		t.exports = {
			System: _,
			VbrMode: f,
			Float: l,
			ShortBlock: o,
			Util: i,
			Arrays: r,
			new_array_n: function e(t) {
				if (1 == t.length) return new Array(t[0]);
				var a = t[0];
				t = t.slice(1);
				for (var n = [], s = 0; s < a; s++) n.push(e(t));
				return n;
			},
			new_byte: function(e) {
				return new Int8Array(e);
			},
			new_double: function(e) {
				return new Float64Array(e);
			},
			new_float: s,
			new_float_n: function e(t) {
				if (1 == t.length) return s(t[0]);
				var a = t[0];
				t = t.slice(1);
				for (var n = [], r = 0; r < a; r++) n.push(e(t));
				return n;
			},
			new_int: n,
			new_int_n: function e(t) {
				if (1 == t.length) return n(t[0]);
				var a = t[0];
				t = t.slice(1);
				for (var s = [], r = 0; r < a; r++) s.push(e(t));
				return s;
			},
			new_short: a,
			new_short_n: function e(t) {
				if (1 == t.length) return a(t[0]);
				var n = t[0];
				t = t.slice(1);
				for (var s = [], r = 0; r < n; r++) s.push(e(t));
				return s;
			},
			assert: function(e) {}
		};
	}), c = _((e, t) => {
		var a = h(), n = a.System;
		a.VbrMode, a.Float, a.ShortBlock;
		var s = a.Util, r = a.Arrays;
		a.new_array_n, a.new_byte, a.new_double;
		var _ = a.new_float;
		a.new_float_n, a.new_int, a.new_int_n, a.assert;
		var i = m();
		t.exports = function() {
			var e = [
				-.1482523854003001,
				32.308141959636465,
				296.40344946382766,
				883.1344870032432,
				11113.947376231741,
				1057.2713659324597,
				305.7402417275812,
				30.825928907280012,
				3.8533188138216365,
				59.42900443849514,
				709.5899960123345,
				5281.91112291017,
				-5829.66483675846,
				-817.6293103748613,
				-76.91656988279972,
				-4.594269939176596,
				.9063471690191471,
				.1960342806591213,
				-.15466694054279598,
				34.324387823855965,
				301.8067566458425,
				817.599602898885,
				11573.795901679885,
				1181.2520595540152,
				321.59731579894424,
				31.232021761053772,
				3.7107095756221318,
				53.650946155329365,
				684.167428119626,
				5224.56624370173,
				-6366.391851890084,
				-908.9766368219582,
				-89.83068876699639,
				-5.411397422890401,
				.8206787908286602,
				.3901806440322567,
				-.16070888947830023,
				36.147034243915876,
				304.11815768187864,
				732.7429163887613,
				11989.60988270091,
				1300.012278487897,
				335.28490093152146,
				31.48816102859945,
				3.373875931311736,
				47.232241542899175,
				652.7371796173471,
				5132.414255594984,
				-6909.087078780055,
				-1001.9990371107289,
				-103.62185754286375,
				-6.104916304710272,
				.7416505462720353,
				.5805693545089249,
				-.16636367662261495,
				37.751650073343995,
				303.01103387567713,
				627.9747488785183,
				12358.763425278165,
				1412.2779918482834,
				346.7496836825721,
				31.598286663170416,
				3.1598635433980946,
				40.57878626349686,
				616.1671130880391,
				5007.833007176154,
				-7454.040671756168,
				-1095.7960341867115,
				-118.24411666465777,
				-6.818469345853504,
				.6681786379192989,
				.7653668647301797,
				-.1716176790982088,
				39.11551877123304,
				298.3413246578966,
				503.5259106886539,
				12679.589408408976,
				1516.5821921214542,
				355.9850766329023,
				31.395241710249053,
				2.9164211881972335,
				33.79716964664243,
				574.8943997801362,
				4853.234992253242,
				-7997.57021486075,
				-1189.7624067269965,
				-133.6444792601766,
				-7.7202770609839915,
				.5993769336819237,
				.9427934736519954,
				-.17645823955292173,
				40.21879108166477,
				289.9982036694474,
				359.3226160751053,
				12950.259102786438,
				1612.1013903507662,
				362.85067106591504,
				31.045922092242872,
				2.822222032597987,
				26.988862316190684,
				529.8996541764288,
				4671.371946949588,
				-8535.899136645805,
				-1282.5898586244496,
				-149.58553632943463,
				-8.643494270763135,
				.5345111359507916,
				1.111140466039205,
				-.36174739330527045,
				41.04429910497807,
				277.5463268268618,
				195.6386023135583,
				13169.43812144731,
				1697.6433561479398,
				367.40983966190305,
				30.557037410382826,
				2.531473372857427,
				20.070154905927314,
				481.50208566532336,
				4464.970341588308,
				-9065.36882077239,
				-1373.62841526722,
				-166.1660487028118,
				-9.58289321133207,
				.4729647758913199,
				1.268786568327291,
				-.36970682634889585,
				41.393213350082036,
				261.2935935556502,
				12.935476055240873,
				13336.131683328815,
				1772.508612059496,
				369.76534388639965,
				29.751323653701338,
				2.4023193045459172,
				13.304795348228817,
				430.5615775526625,
				4237.0568611071185,
				-9581.931701634761,
				-1461.6913552409758,
				-183.12733958476446,
				-10.718010163869403,
				.41421356237309503,
				1.414213562373095,
				-.37677560326535325,
				41.619486213528496,
				241.05423794991074,
				-187.94665032361226,
				13450.063605744153,
				1836.153896465782,
				369.4908799925761,
				29.001847876923147,
				2.0714759319987186,
				6.779591200894186,
				377.7767837205709,
				3990.386575512536,
				-10081.709459700915,
				-1545.947424837898,
				-200.3762958015653,
				-11.864482073055006,
				.3578057213145241,
				1.546020906725474,
				-.3829366947518991,
				41.1516456456653,
				216.47684307105183,
				-406.1569483347166,
				13511.136535077321,
				1887.8076599260432,
				367.3025214564151,
				28.136213436723654,
				1.913880671464418,
				.3829366947518991,
				323.85365704338597,
				3728.1472257487526,
				-10561.233882199509,
				-1625.2025997821418,
				-217.62525175416,
				-13.015432208941645,
				.3033466836073424,
				1.66293922460509,
				-.5822628872992417,
				40.35639251440489,
				188.20071124269245,
				-640.2706748618148,
				13519.21490106562,
				1927.6022433578062,
				362.8197642637487,
				26.968821921868447,
				1.7463817695935329,
				-5.62650678237171,
				269.3016715297017,
				3453.386536448852,
				-11016.145278780888,
				-1698.6569643425091,
				-234.7658734267683,
				-14.16351421663124,
				.2504869601913055,
				1.76384252869671,
				-.5887180101749253,
				39.23429103868072,
				155.76096234403798,
				-889.2492977967378,
				13475.470561874661,
				1955.0535223723712,
				356.4450994756727,
				25.894952980042156,
				1.5695032905781554,
				-11.181939564328772,
				214.80884394039484,
				3169.1640829158237,
				-11443.321309975563,
				-1765.1588461316153,
				-251.68908574481912,
				-15.49755935939164,
				.198912367379658,
				1.847759065022573,
				-.7912582233652842,
				37.39369355329111,
				119.699486012458,
				-1151.0956593239027,
				13380.446257078214,
				1970.3952110853447,
				348.01959814116185,
				24.731487364283044,
				1.3850130831637748,
				-16.421408865300393,
				161.05030052864092,
				2878.3322807850063,
				-11838.991423510031,
				-1823.985884688674,
				-268.2854986386903,
				-16.81724543849939,
				.1483359875383474,
				1.913880671464418,
				-.7960642926861912,
				35.2322109610459,
				80.01928065061526,
				-1424.0212633405113,
				13235.794061869668,
				1973.804052543835,
				337.9908651258184,
				23.289159354463873,
				1.3934255946442087,
				-21.099669467133474,
				108.48348407242611,
				2583.700758091299,
				-12199.726194855148,
				-1874.2780658979746,
				-284.2467154529415,
				-18.11369784385905,
				.09849140335716425,
				1.961570560806461,
				-.998795456205172,
				32.56307803611191,
				36.958364584370486,
				-1706.075448829146,
				13043.287458812016,
				1965.3831106103316,
				326.43182772364605,
				22.175018750622293,
				1.198638339011324,
				-25.371248002043963,
				57.53505923036915,
				2288.41886619975,
				-12522.674544337233,
				-1914.8400385312243,
				-299.26241273417224,
				-19.37805630698734,
				.04912684976946725,
				1.990369453344394,
				.035780907 * s.SQRT2 * .5 / 2384e-9,
				.017876148 * s.SQRT2 * .5 / 2384e-9,
				.003134727 * s.SQRT2 * .5 / 2384e-9,
				.002457142 * s.SQRT2 * .5 / 2384e-9,
				971317e-9 * s.SQRT2 * .5 / 2384e-9,
				218868e-9 * s.SQRT2 * .5 / 2384e-9,
				101566e-9 * s.SQRT2 * .5 / 2384e-9,
				13828e-9 * s.SQRT2 * .5 / 2384e-9,
				12804.797818791945,
				1945.5515939597317,
				313.4244966442953,
				20.801593959731544,
				1995.1556208053692,
				9.000838926174497,
				-29.20218120805369
			], t = [
				[
					2382191739347913e-28,
					6423305872147834e-28,
					9400849094049688e-28,
					1122435026096556e-27,
					1183840321267481e-27,
					1122435026096556e-27,
					940084909404969e-27,
					6423305872147839e-28,
					2382191739347918e-28,
					5456116108943412e-27,
					4878985199565852e-27,
					4240448995017367e-27,
					3559909094758252e-27,
					2858043359288075e-27,
					2156177623817898e-27,
					1475637723558783e-27,
					8371015190102974e-28,
					2599706096327376e-28,
					-5456116108943412e-27,
					-4878985199565852e-27,
					-4240448995017367e-27,
					-3559909094758252e-27,
					-2858043359288076e-27,
					-2156177623817898e-27,
					-1475637723558783e-27,
					-8371015190102975e-28,
					-2599706096327376e-28,
					-2382191739347923e-28,
					-6423305872147843e-28,
					-9400849094049696e-28,
					-1122435026096556e-27,
					-1183840321267481e-27,
					-1122435026096556e-27,
					-9400849094049694e-28,
					-642330587214784e-27,
					-2382191739347918e-28
				],
				[
					2382191739347913e-28,
					6423305872147834e-28,
					9400849094049688e-28,
					1122435026096556e-27,
					1183840321267481e-27,
					1122435026096556e-27,
					9400849094049688e-28,
					6423305872147841e-28,
					2382191739347918e-28,
					5456116108943413e-27,
					4878985199565852e-27,
					4240448995017367e-27,
					3559909094758253e-27,
					2858043359288075e-27,
					2156177623817898e-27,
					1475637723558782e-27,
					8371015190102975e-28,
					2599706096327376e-28,
					-5461314069809755e-27,
					-4921085770524055e-27,
					-4343405037091838e-27,
					-3732668368707687e-27,
					-3093523840190885e-27,
					-2430835727329465e-27,
					-1734679010007751e-27,
					-974825365660928e-27,
					-2797435120168326e-28,
					0,
					0,
					0,
					0,
					0,
					0,
					-2283748241799531e-28,
					-4037858874020686e-28,
					-2146547464825323e-28
				],
				[
					.1316524975873958,
					.414213562373095,
					.7673269879789602,
					1.091308501069271,
					1.303225372841206,
					1.56968557711749,
					1.920982126971166,
					2.414213562373094,
					3.171594802363212,
					4.510708503662055,
					7.595754112725146,
					22.90376554843115,
					.984807753012208,
					.6427876096865394,
					.3420201433256688,
					.9396926207859084,
					-.1736481776669303,
					-.7660444431189779,
					.8660254037844387,
					.5,
					-.5144957554275265,
					-.4717319685649723,
					-.3133774542039019,
					-.1819131996109812,
					-.09457419252642064,
					-.04096558288530405,
					-.01419856857247115,
					-.003699974673760037,
					.8574929257125442,
					.8817419973177052,
					.9496286491027329,
					.9833145924917901,
					.9955178160675857,
					.9991605581781475,
					.999899195244447,
					.9999931550702802
				],
				[
					0,
					0,
					0,
					0,
					0,
					0,
					2283748241799531e-28,
					4037858874020686e-28,
					2146547464825323e-28,
					5461314069809755e-27,
					4921085770524055e-27,
					4343405037091838e-27,
					3732668368707687e-27,
					3093523840190885e-27,
					2430835727329466e-27,
					1734679010007751e-27,
					974825365660928e-27,
					2797435120168326e-28,
					-5456116108943413e-27,
					-4878985199565852e-27,
					-4240448995017367e-27,
					-3559909094758253e-27,
					-2858043359288075e-27,
					-2156177623817898e-27,
					-1475637723558782e-27,
					-8371015190102975e-28,
					-2599706096327376e-28,
					-2382191739347913e-28,
					-6423305872147834e-28,
					-9400849094049688e-28,
					-1122435026096556e-27,
					-1183840321267481e-27,
					-1122435026096556e-27,
					-9400849094049688e-28,
					-6423305872147841e-28,
					-2382191739347918e-28
				]
			], a = t[i.SHORT_TYPE], o = t[i.SHORT_TYPE], l = t[i.SHORT_TYPE], f = t[i.SHORT_TYPE], h = [
				0,
				1,
				16,
				17,
				8,
				9,
				24,
				25,
				4,
				5,
				20,
				21,
				12,
				13,
				28,
				29,
				2,
				3,
				18,
				19,
				10,
				11,
				26,
				27,
				6,
				7,
				22,
				23,
				14,
				15,
				30,
				31
			];
			function c(t, a, n) {
				for (var r = 10, _ = a + 238 - 14 - 286, i = -15; i < 0; i++) {
					var o = e[r + -10], l = t[_ + -224] * o, f = t[a + 224] * o;
					o = e[r + -9], l += t[_ + -160] * o, f += t[a + 160] * o, o = e[r + -8], l += t[_ + -96] * o, f += t[a + 96] * o, o = e[r + -7], l += t[_ + -32] * o, f += t[a + 32] * o, o = e[r + -6], l += t[_ + 32] * o, f += t[a + -32] * o, o = e[r + -5], l += t[_ + 96] * o, f += t[a + -96] * o, o = e[r + -4], l += t[_ + 160] * o, f += t[a + -160] * o, o = e[r + -3], l += t[_ + 224] * o, f += t[a + -224] * o, o = e[r + -2], l += t[a + -256] * o, f -= t[_ + 256] * o, o = e[r + -1], l += t[a + -192] * o, f -= t[_ + 192] * o, o = e[r + 0], l += t[a + -128] * o, f -= t[_ + 128] * o, o = e[r + 1], l += t[a + -64] * o, f -= t[_ + 64] * o, o = e[r + 2], l += t[a + 0] * o, f -= t[_ + 0] * o, o = e[r + 3], l += t[a + 64] * o, f -= t[_ + -64] * o, o = e[r + 4], l += t[a + 128] * o, f -= t[_ + -128] * o, o = e[r + 5], l += t[a + 192] * o, o = (f -= t[_ + -192] * o) - (l *= e[r + 6]), n[30 + 2 * i] = f + l, n[31 + 2 * i] = e[r + 7] * o, r += 18, a--, _++;
				}
				var h, c;
				f = t[a + -16] * e[r + -10];
				l = t[a + -32] * e[r + -2], f += (t[a + -48] - t[a + 16]) * e[r + -9], l += t[a + -96] * e[r + -1], f += (t[a + -80] + t[a + 48]) * e[r + -8], l += t[a + -160] * e[r + 0], f += (t[a + -112] - t[a + 80]) * e[r + -7], l += t[a + -224] * e[r + 1], f += (t[a + -144] + t[a + 112]) * e[r + -6], l -= t[a + 32] * e[r + 2], f += (t[a + -176] - t[a + 144]) * e[r + -5], l -= t[a + 96] * e[r + 3], f += (t[a + -208] + t[a + 176]) * e[r + -4], l -= t[a + 160] * e[r + 4], f += (t[a + -240] - t[a + 208]) * e[r + -3], h = (l -= t[a + 224]) - f, c = l + f, f = n[14], l = n[15] - f, n[31] = c + f, n[30] = h + l, n[15] = h - l, n[14] = c - f;
				var u = n[28] - n[0];
				n[0] += n[28], n[28] = u * e[r + -36 + 7], u = n[29] - n[1], n[1] += n[29], n[29] = u * e[r + -36 + 7], u = n[26] - n[2], n[2] += n[26], n[26] = u * e[r + -72 + 7], u = n[27] - n[3], n[3] += n[27], n[27] = u * e[r + -72 + 7], u = n[24] - n[4], n[4] += n[24], n[24] = u * e[r + -108 + 7], u = n[25] - n[5], n[5] += n[25], n[25] = u * e[r + -108 + 7], u = n[22] - n[6], n[6] += n[22], n[22] = u * s.SQRT2, u = n[23] - n[7], n[7] += n[23], n[23] = u * s.SQRT2 - n[7], n[7] -= n[6], n[22] -= n[7], n[23] -= n[22], u = n[6], n[6] = n[31] - u, n[31] = n[31] + u, u = n[7], n[7] = n[30] - u, n[30] = n[30] + u, u = n[22], n[22] = n[15] - u, n[15] = n[15] + u, u = n[23], n[23] = n[14] - u, n[14] = n[14] + u, u = n[20] - n[8], n[8] += n[20], n[20] = u * e[r + -180 + 7], u = n[21] - n[9], n[9] += n[21], n[21] = u * e[r + -180 + 7], u = n[18] - n[10], n[10] += n[18], n[18] = u * e[r + -216 + 7], u = n[19] - n[11], n[11] += n[19], n[19] = u * e[r + -216 + 7], u = n[16] - n[12], n[12] += n[16], n[16] = u * e[r + -252 + 7], u = n[17] - n[13], n[13] += n[17], n[17] = u * e[r + -252 + 7], u = -n[20] + n[24], n[20] += n[24], n[24] = u * e[r + -216 + 7], u = -n[21] + n[25], n[21] += n[25], n[25] = u * e[r + -216 + 7], u = n[4] - n[8], n[4] += n[8], n[8] = u * e[r + -216 + 7], u = n[5] - n[9], n[5] += n[9], n[9] = u * e[r + -216 + 7], u = n[0] - n[12], n[0] += n[12], n[12] = u * e[r + -72 + 7], u = n[1] - n[13], n[1] += n[13], n[13] = u * e[r + -72 + 7], u = n[16] - n[28], n[16] += n[28], n[28] = u * e[r + -72 + 7], u = -n[17] + n[29], n[17] += n[29], n[29] = u * e[r + -72 + 7], u = s.SQRT2 * (n[2] - n[10]), n[2] += n[10], n[10] = u, u = s.SQRT2 * (n[3] - n[11]), n[3] += n[11], n[11] = u, u = s.SQRT2 * (-n[18] + n[26]), n[18] += n[26], n[26] = u - n[18], u = s.SQRT2 * (-n[19] + n[27]), n[19] += n[27], n[27] = u - n[19], u = n[2], n[19] -= n[3], n[3] -= u, n[2] = n[31] - u, n[31] += u, u = n[3], n[11] -= n[19], n[18] -= u, n[3] = n[30] - u, n[30] += u, u = n[18], n[27] -= n[11], n[19] -= u, n[18] = n[15] - u, n[15] += u, u = n[19], n[10] -= u, n[19] = n[14] - u, n[14] += u, u = n[10], n[11] -= u, n[10] = n[23] - u, n[23] += u, u = n[11], n[26] -= u, n[11] = n[22] - u, n[22] += u, u = n[26], n[27] -= u, n[26] = n[7] - u, n[7] += u, u = n[27], n[27] = n[6] - u, n[6] += u, u = s.SQRT2 * (n[0] - n[4]), n[0] += n[4], n[4] = u, u = s.SQRT2 * (n[1] - n[5]), n[1] += n[5], n[5] = u, u = s.SQRT2 * (n[16] - n[20]), n[16] += n[20], n[20] = u, u = s.SQRT2 * (n[17] - n[21]), n[17] += n[21], n[21] = u, u = -s.SQRT2 * (n[8] - n[12]), n[8] += n[12], n[12] = u - n[8], u = -s.SQRT2 * (n[9] - n[13]), n[9] += n[13], n[13] = u - n[9], u = -s.SQRT2 * (n[25] - n[29]), n[25] += n[29], n[29] = u - n[25], u = -s.SQRT2 * (n[24] + n[28]), n[24] -= n[28], n[28] = u - n[24], u = n[24] - n[16], n[24] = u, u = n[20] - u, n[20] = u, u = n[28] - u, n[28] = u, u = n[25] - n[17], n[25] = u, u = n[21] - u, n[21] = u, u = n[29] - u, n[29] = u, u = n[17] - n[1], n[17] = u, u = n[9] - u, n[9] = u, u = n[25] - u, n[25] = u, u = n[5] - u, n[5] = u, u = n[21] - u, n[21] = u, u = n[13] - u, n[13] = u, u = n[29] - u, n[29] = u, u = n[1] - n[0], n[1] = u, u = n[16] - u, n[16] = u, u = n[17] - u, n[17] = u, u = n[8] - u, n[8] = u, u = n[9] - u, n[9] = u, u = n[24] - u, n[24] = u, u = n[25] - u, n[25] = u, u = n[4] - u, n[4] = u, u = n[5] - u, n[5] = u, u = n[20] - u, n[20] = u, u = n[21] - u, n[21] = u, u = n[12] - u, n[12] = u, u = n[13] - u, n[13] = u, u = n[28] - u, n[28] = u, u = n[29] - u, n[29] = u, u = n[0], n[0] += n[31], n[31] -= u, u = n[1], n[1] += n[30], n[30] -= u, u = n[16], n[16] += n[15], n[15] -= u, u = n[17], n[17] += n[14], n[14] -= u, u = n[8], n[8] += n[23], n[23] -= u, u = n[9], n[9] += n[22], n[22] -= u, u = n[24], n[24] += n[7], n[7] -= u, u = n[25], n[25] += n[6], n[6] -= u, u = n[4], n[4] += n[27], n[27] -= u, u = n[5], n[5] += n[26], n[26] -= u, u = n[20], n[20] += n[11], n[11] -= u, u = n[21], n[21] += n[10], n[10] -= u, u = n[12], n[12] += n[19], n[19] -= u, u = n[13], n[13] += n[18], n[18] -= u, u = n[28], n[28] += n[3], n[3] -= u, u = n[29], n[29] += n[2], n[2] -= u;
			}
			function u(e, a) {
				for (var n = 0; n < 3; n++) {
					var s, r, _, o, l, f = e[a + 6] * t[i.SHORT_TYPE][0] - e[a + 15];
					r = f + (s = e[a + 0] * t[i.SHORT_TYPE][2] - e[a + 9]), _ = f - s, o = (f = e[a + 15] * t[i.SHORT_TYPE][0] + e[a + 6]) + (s = e[a + 9] * t[i.SHORT_TYPE][2] + e[a + 0]), l = -f + s, s = 2069978111953089e-26 * (e[a + 3] * t[i.SHORT_TYPE][1] - e[a + 12]), f = 2069978111953089e-26 * (e[a + 12] * t[i.SHORT_TYPE][1] + e[a + 3]), e[a + 0] = 190752519173728e-25 * r + s, e[a + 15] = 190752519173728e-25 * -o + f, _ = .8660254037844387 * _ * 1907525191737281e-26, o = .5 * o * 1907525191737281e-26 + f, e[a + 3] = _ - o, e[a + 6] = _ + o, r = .5 * r * 1907525191737281e-26 - s, l = .8660254037844387 * l * 1907525191737281e-26, e[a + 9] = r + l, e[a + 12] = r - l, a++;
				}
			}
			function b(e, t, a) {
				var n, s, r, _ = a[17] - a[9], i = a[15] - a[11], l = a[14] - a[12], f = a[0] + a[8], h = a[1] + a[7], c = a[2] + a[6], u = a[3] + a[5];
				e[t + 17] = f + c - u - (h - a[4]), s = (f + c - u) * o[19] + (h - a[4]), n = (_ - i - l) * o[18], e[t + 5] = n + s, e[t + 6] = n - s, r = (a[16] - a[10]) * o[18], h = h * o[19] + a[4], n = _ * o[12] + r + i * o[13] + l * o[14], s = -f * o[16] + h - c * o[17] + u * o[15], e[t + 1] = n + s, e[t + 2] = n - s, n = _ * o[13] - r - i * o[14] + l * o[12], s = -f * o[17] + h - c * o[15] + u * o[16], e[t + 9] = n + s, e[t + 10] = n - s, n = _ * o[14] - r + i * o[12] - l * o[13], s = f * o[15] - h + c * o[16] - u * o[17], e[t + 13] = n + s, e[t + 14] = n - s;
				var b, p = a[8] - a[0], m = a[6] - a[2], d = a[5] - a[3], v = a[17] + a[9], g = a[16] + a[10], w = a[15] + a[11], S = a[14] + a[12];
				e[t + 0] = v + w + S + (g + a[13]), n = (v + w + S) * o[19] - (g + a[13]), s = (p - m + d) * o[18], e[t + 11] = n + s, e[t + 12] = n - s, b = (a[7] - a[1]) * o[18], g = a[13] - g * o[19], n = v * o[15] - g + w * o[16] + S * o[17], s = p * o[14] + b + m * o[12] + d * o[13], e[t + 3] = n + s, e[t + 4] = n - s, n = -v * o[17] + g - w * o[15] - S * o[16], s = p * o[13] + b - m * o[14] - d * o[12], e[t + 7] = n + s, e[t + 8] = n - s, n = -v * o[16] + g - w * o[17] - S * o[15], s = p * o[12] - b + m * o[13] - d * o[14], e[t + 15] = n + s, e[t + 16] = n - s;
			}
			this.mdct_sub48 = function(e, s, o) {
				for (var p = s, m = 286, d = 0; d < e.channels_out; d++) {
					for (var v = 0; v < e.mode_gr; v++) {
						for (var g, w = e.l3_side.tt[v][d], S = w.xr, R = 0, A = e.sb_sample[d][1 - v], M = 0, B = 0; B < 9; B++) for (c(p, m, A[M]), c(p, m + 32, A[M + 1]), M += 2, m += 64, g = 1; g < 32; g += 2) A[M - 1][g] *= -1;
						for (g = 0; g < 32; g++, R += 18) {
							var y = w.block_type, E = e.sb_sample[d][v], T = e.sb_sample[d][1 - v];
							if (0 != w.mixed_block_flag && g < 2 && (y = 0), e.amp_filter[g] < 1e-12) r.fill(S, R + 0, R + 18, 0);
							else {
								if (e.amp_filter[g] < 1) for (B = 0; B < 18; B++) T[B][h[g]] *= e.amp_filter[g];
								if (y == i.SHORT_TYPE) {
									for (B = -3; B < 0; B++) {
										var k = t[i.SHORT_TYPE][B + 3];
										S[R + 3 * B + 9] = E[9 + B][h[g]] * k - E[8 - B][h[g]], S[R + 3 * B + 18] = E[14 - B][h[g]] * k + E[15 + B][h[g]], S[R + 3 * B + 10] = E[15 + B][h[g]] * k - E[14 - B][h[g]], S[R + 3 * B + 19] = T[2 - B][h[g]] * k + T[3 + B][h[g]], S[R + 3 * B + 11] = T[3 + B][h[g]] * k - T[2 - B][h[g]], S[R + 3 * B + 20] = T[8 - B][h[g]] * k + T[9 + B][h[g]];
									}
									u(S, R);
								} else {
									var x = _(18);
									for (B = -9; B < 0; B++) {
										var P = t[y][B + 27] * T[B + 9][h[g]] + t[y][B + 36] * T[8 - B][h[g]], I = t[y][B + 9] * E[B + 9][h[g]] - t[y][B + 18] * E[8 - B][h[g]];
										x[B + 9] = P - I * a[3 + B + 9], x[B + 18] = P * a[3 + B + 9] + I;
									}
									b(S, R, x);
								}
							}
							if (y != i.SHORT_TYPE && 0 != g) for (B = 7; B >= 0; --B) {
								var O = S[R + B] * l[20 + B] + S[R + -1 - B] * f[28 + B], V = S[R + B] * f[28 + B] - S[R + -1 - B] * l[20 + B];
								S[R + -1 - B] = O, S[R + B] = V;
							}
						}
					}
					if (p = o, m = 286, 1 == e.mode_gr) for (var H = 0; H < 18; H++) n.arraycopy(e.sb_sample[d][1][H], 0, e.sb_sample[d][0][H], 0, 32);
				}
			};
		};
	}), u = _((e, t) => {
		var a = m(), n = h(), s = n.System;
		n.VbrMode, n.Float, n.ShortBlock, n.Util, n.Arrays, n.new_array_n, n.new_byte, n.new_double;
		var r = n.new_float, _ = n.new_float_n;
		n.new_int, n.new_int_n, n.assert, t.exports = function() {
			this.l = r(a.SBMAX_l), this.s = _([a.SBMAX_s, 3]);
			var e = this;
			this.assign = function(t) {
				s.arraycopy(t.l, 0, e.l, 0, a.SBMAX_l);
				for (var n = 0; n < a.SBMAX_s; n++) for (var r = 0; r < 3; r++) e.s[n][r] = t.s[n][r];
			};
		};
	}), b = _((e, t) => {
		var a = u();
		t.exports = function() {
			this.thm = new a(), this.en = new a();
		};
	}), p = _((e, t) => {
		function a(e) {
			var t = e;
			this.ordinal = function() {
				return t;
			};
		}
		a.STEREO = new a(0), a.JOINT_STEREO = new a(1), a.DUAL_CHANNEL = new a(2), a.MONO = new a(3), a.NOT_SET = new a(4), t.exports = a;
	}), m = _((e, t) => {
		var a = h(), n = a.System, s = a.VbrMode;
		a.Float, a.ShortBlock, a.Util, a.Arrays;
		var r = a.new_array_n;
		a.new_byte, a.new_double;
		var _ = a.new_float, i = a.new_float_n, o = a.new_int;
		a.new_int_n;
		var l = a.assert;
		function f() {
			var e = c(), t = b(), a = p(), h = f.FFTOFFSET, u = f.MPG_MD_MS_LR, m = null;
			this.psy = null;
			var d = null, v = null, g = null;
			this.setModules = function(e, t, a, n) {
				m = e, this.psy = t, d = t, v = n, g = a;
			};
			var w = new e();
			this.lame_encode_mp3_frame = function(e, c, b, p, S, R) {
				var A, M = r([2, 2]);
				M[0][0] = new t(), M[0][1] = new t(), M[1][0] = new t(), M[1][1] = new t();
				var B, y = r([2, 2]);
				y[0][0] = new t(), y[0][1] = new t(), y[1][0] = new t(), y[1][1] = new t();
				var E, T, k, x = [null, null], P = e.internal_flags, I = i([2, 4]), O = [.5, .5], V = [[0, 0], [0, 0]], H = [[0, 0], [0, 0]];
				if (x[0] = c, x[1] = b, 0 == P.lame_encode_frame_init && function(e, t) {
					var a, n, s = e.internal_flags;
					if (0 == s.lame_encode_frame_init) {
						var r, i, o = _(2014), h = _(2014);
						for (s.lame_encode_frame_init = 1, r = 0, i = 0; r < 286 + 576 * (1 + s.mode_gr); ++r) r < 576 * s.mode_gr ? (o[r] = 0, 2 == s.channels_out && (h[r] = 0)) : (o[r] = t[0][i], 2 == s.channels_out && (h[r] = t[1][i]), ++i);
						for (n = 0; n < s.mode_gr; n++) for (a = 0; a < s.channels_out; a++) s.l3_side.tt[n][a].block_type = f.SHORT_TYPE;
						w.mdct_sub48(s, o, h), l(576 >= f.FFTOFFSET), l(s.mf_size >= f.BLKSIZE + e.framesize - f.FFTOFFSET), l(s.mf_size >= 512 + e.framesize - 32);
					}
				}(e, x), P.padding = 0, (P.slot_lag -= P.frac_SpF) < 0 && (P.slot_lag += e.out_samplerate, P.padding = 1), 0 != P.psymodel) {
					var L = [null, null], N = 0, D = o(2);
					for (k = 0; k < P.mode_gr; k++) {
						for (T = 0; T < P.channels_out; T++) L[T] = x[T], N = 576 + 576 * k - f.FFTOFFSET;
						if (0 != (e.VBR == s.vbr_mtrh || e.VBR == s.vbr_mt ? d.L3psycho_anal_vbr(e, L, N, k, M, y, V[k], H[k], I[k], D) : d.L3psycho_anal_ns(e, L, N, k, M, y, V[k], H[k], I[k], D))) return -4;
						for (e.mode == a.JOINT_STEREO && (O[k] = I[k][2] + I[k][3], O[k] > 0 && (O[k] = I[k][3] / O[k])), T = 0; T < P.channels_out; T++) {
							var X = P.l3_side.tt[k][T];
							X.block_type = D[T], X.mixed_block_flag = 0;
						}
					}
				} else for (k = 0; k < P.mode_gr; k++) for (T = 0; T < P.channels_out; T++) P.l3_side.tt[k][T].block_type = f.NORM_TYPE, P.l3_side.tt[k][T].mixed_block_flag = 0, H[k][T] = V[k][T] = 700;
				if (function(e) {
					var t, a;
					if (0 != e.ATH.useAdjust) if (a = e.loudness_sq[0][0], t = e.loudness_sq[1][0], 2 == e.channels_out ? (a += e.loudness_sq[0][1], t += e.loudness_sq[1][1]) : (a += a, t += t), 2 == e.mode_gr && (a = Math.max(a, t)), a *= .5, (a *= e.ATH.aaSensitivityP) > .03125) e.ATH.adjust >= 1 ? e.ATH.adjust = 1 : e.ATH.adjust < e.ATH.adjustLimit && (e.ATH.adjust = e.ATH.adjustLimit), e.ATH.adjustLimit = 1;
					else {
						var n = 31.98 * a + 625e-6;
						e.ATH.adjust >= n ? (e.ATH.adjust *= .075 * n + .925, e.ATH.adjust < n && (e.ATH.adjust = n)) : e.ATH.adjustLimit >= n ? e.ATH.adjust = n : e.ATH.adjust < e.ATH.adjustLimit && (e.ATH.adjust = e.ATH.adjustLimit), e.ATH.adjustLimit = n;
					}
					else e.ATH.adjust = 1;
				}(P), w.mdct_sub48(P, x[0], x[1]), P.mode_ext = f.MPG_MD_LR_LR, e.force_ms) P.mode_ext = f.MPG_MD_MS_LR;
				else if (e.mode == a.JOINT_STEREO) {
					var C = 0, F = 0;
					for (k = 0; k < P.mode_gr; k++) for (T = 0; T < P.channels_out; T++) C += H[k][T], F += V[k][T];
					if (C <= 1 * F) {
						var Y = P.l3_side.tt[0], q = P.l3_side.tt[P.mode_gr - 1];
						Y[0].block_type == Y[1].block_type && q[0].block_type == q[1].block_type && (P.mode_ext = f.MPG_MD_MS_LR);
					}
				}
				if (P.mode_ext == u ? (B = y, E = H) : (B = M, E = V), e.analysis && null != P.pinfo) for (k = 0; k < P.mode_gr; k++) for (T = 0; T < P.channels_out; T++) P.pinfo.ms_ratio[k] = P.ms_ratio[k], P.pinfo.ms_ener_ratio[k] = O[k], P.pinfo.blocktype[k][T] = P.l3_side.tt[k][T].block_type, P.pinfo.pe[k][T] = E[k][T], n.arraycopy(P.l3_side.tt[k][T].xr, 0, P.pinfo.xr[k][T], 0, 576), P.mode_ext == u && (P.pinfo.ers[k][T] = P.pinfo.ers[k][T + 2], n.arraycopy(P.pinfo.energy[k][T + 2], 0, P.pinfo.energy[k][T], 0, P.pinfo.energy[k][T].length));
				if (e.VBR == s.vbr_off || e.VBR == s.vbr_abr) {
					var j, G;
					for (j = 0; j < 18; j++) P.nsPsy.pefirbuf[j] = P.nsPsy.pefirbuf[j + 1];
					for (G = 0, k = 0; k < P.mode_gr; k++) for (T = 0; T < P.channels_out; T++) G += E[k][T];
					for (P.nsPsy.pefirbuf[18] = G, G = P.nsPsy.pefirbuf[9], j = 0; j < 9; j++) G += (P.nsPsy.pefirbuf[j] + P.nsPsy.pefirbuf[18 - j]) * f.fircoef[j];
					for (G = 3350 * P.mode_gr * P.channels_out / G, k = 0; k < P.mode_gr; k++) for (T = 0; T < P.channels_out; T++) E[k][T] *= G;
				}
				if (P.iteration_loop.iteration_loop(e, E, O, B), m.format_bitstream(e), A = m.copy_buffer(P, p, S, R, 1), e.bWriteVbrTag && v.addVbrFrame(e), e.analysis && null != P.pinfo) {
					for (T = 0; T < P.channels_out; T++) {
						var U;
						for (U = 0; U < h; U++) P.pinfo.pcmdata[T][U] = P.pinfo.pcmdata[T][U + e.framesize];
						for (U = h; U < 1600; U++) P.pinfo.pcmdata[T][U] = x[T][U - h];
					}
					g.set_frame_pinfo(e, B);
				}
				return function(e) {
					var t, a;
					for (l(0 <= e.bitrate_index && e.bitrate_index < 16), l(0 <= e.mode_ext && e.mode_ext < 4), e.bitrate_stereoMode_Hist[e.bitrate_index][4]++, e.bitrate_stereoMode_Hist[15][4]++, 2 == e.channels_out && (e.bitrate_stereoMode_Hist[e.bitrate_index][e.mode_ext]++, e.bitrate_stereoMode_Hist[15][e.mode_ext]++), t = 0; t < e.mode_gr; ++t) for (a = 0; a < e.channels_out; ++a) {
						var n = 0 | e.l3_side.tt[t][a].block_type;
						0 != e.l3_side.tt[t][a].mixed_block_flag && (n = 4), e.bitrate_blockType_Hist[e.bitrate_index][n]++, e.bitrate_blockType_Hist[e.bitrate_index][5]++, e.bitrate_blockType_Hist[15][n]++, e.bitrate_blockType_Hist[15][5]++;
					}
				}(P), A;
			};
		}
		f.ENCDELAY = 576, f.POSTDELAY = 1152, f.MDCTDELAY = 48, f.FFTOFFSET = 224 + f.MDCTDELAY, f.DECDELAY = 528, f.SBLIMIT = 32, f.CBANDS = 64, f.SBPSY_l = 21, f.SBPSY_s = 12, f.SBMAX_l = 22, f.SBMAX_s = 13, f.PSFB21 = 6, f.PSFB12 = 6, f.BLKSIZE = 1024, f.HBLKSIZE = f.BLKSIZE / 2 + 1, f.BLKSIZE_s = 256, f.HBLKSIZE_s = f.BLKSIZE_s / 2 + 1, f.NORM_TYPE = 0, f.START_TYPE = 1, f.SHORT_TYPE = 2, f.STOP_TYPE = 3, f.MPG_MD_LR_LR = 0, f.MPG_MD_LR_I = 1, f.MPG_MD_MS_LR = 2, f.MPG_MD_MS_I = 3, f.fircoef = [
			-.1039435,
			-.1892065,
			5 * -.0432472,
			-.155915,
			3898045e-23,
			.0467745 * 5,
			.50455,
			.756825,
			.187098 * 5
		], t.exports = f;
	}), d = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock;
		var n = a.Util;
		a.Arrays, a.new_array_n, a.new_byte, a.new_double;
		var s = a.new_float;
		a.new_float_n, a.new_int, a.new_int_n, a.assert;
		var r = m();
		t.exports = function() {
			var e = s(r.BLKSIZE), t = s(r.BLKSIZE_s / 2), a = [
				.9238795325112867,
				.3826834323650898,
				.9951847266721969,
				.0980171403295606,
				.9996988186962042,
				.02454122852291229,
				.9999811752826011,
				.006135884649154475
			];
			function _(e, t, s) {
				var r, _, i, o = 0, l = t + (s <<= 1);
				r = 4;
				do {
					var f, h, c, u, b, p, m = r >> 1;
					p = (b = r << 1) + (u = r), r = b << 1, i = (_ = t) + m;
					do {
						var d = e[_ + 0] - e[_ + u];
						R = e[_ + 0] + e[_ + u], y = e[_ + b] - e[_ + p], M = e[_ + b] + e[_ + p], e[_ + b] = R - M, e[_ + 0] = R + M, e[_ + p] = d - y, e[_ + u] = d + y, d = e[i + 0] - e[i + u], R = e[i + 0] + e[i + u], y = n.SQRT2 * e[i + p], M = n.SQRT2 * e[i + b], e[i + b] = R - M, e[i + 0] = R + M, e[i + p] = d - y, e[i + u] = d + y, i += r, _ += r;
					} while (_ < l);
					for (h = a[o + 0], f = a[o + 1], c = 1; c < m; c++) {
						var v = 1 - 2 * f * f, g = 2 * f * h;
						_ = t + c, i = t + u - c;
						do {
							var w, S, R, A, M, B, y, E, T = g * e[_ + u] - v * e[i + u];
							w = v * e[_ + u] + g * e[i + u], d = e[_ + 0] - w, R = e[_ + 0] + w, A = e[i + 0] - T, S = e[i + 0] + T, T = g * e[_ + p] - v * e[i + p], w = v * e[_ + p] + g * e[i + p], y = e[_ + b] - w, M = e[_ + b] + w, E = e[i + b] - T, B = e[i + b] + T, T = f * M - h * E, w = h * M + f * E, e[_ + b] = R - w, e[_ + 0] = R + w, e[i + p] = A - T, e[i + u] = A + T, T = h * B - f * y, w = f * B + h * y, e[i + b] = S - w, e[i + 0] = S + w, e[_ + p] = d - T, e[_ + u] = d + T, i += r, _ += r;
						} while (_ < l);
						h = (v = h) * a[o + 0] - f * a[o + 1], f = v * a[o + 1] + f * a[o + 0];
					}
					o += 2;
				} while (r < s);
			}
			var i = [
				0,
				128,
				64,
				192,
				32,
				160,
				96,
				224,
				16,
				144,
				80,
				208,
				48,
				176,
				112,
				240,
				8,
				136,
				72,
				200,
				40,
				168,
				104,
				232,
				24,
				152,
				88,
				216,
				56,
				184,
				120,
				248,
				4,
				132,
				68,
				196,
				36,
				164,
				100,
				228,
				20,
				148,
				84,
				212,
				52,
				180,
				116,
				244,
				12,
				140,
				76,
				204,
				44,
				172,
				108,
				236,
				28,
				156,
				92,
				220,
				60,
				188,
				124,
				252,
				2,
				130,
				66,
				194,
				34,
				162,
				98,
				226,
				18,
				146,
				82,
				210,
				50,
				178,
				114,
				242,
				10,
				138,
				74,
				202,
				42,
				170,
				106,
				234,
				26,
				154,
				90,
				218,
				58,
				186,
				122,
				250,
				6,
				134,
				70,
				198,
				38,
				166,
				102,
				230,
				22,
				150,
				86,
				214,
				54,
				182,
				118,
				246,
				14,
				142,
				78,
				206,
				46,
				174,
				110,
				238,
				30,
				158,
				94,
				222,
				62,
				190,
				126,
				254
			];
			this.fft_short = function(e, a, n, s, o) {
				for (var l = 0; l < 3; l++) {
					var f = r.BLKSIZE_s / 2, h = 65535 & 192 * (l + 1), c = r.BLKSIZE_s / 8 - 1;
					do {
						var u, b, p, m, d, v = 255 & i[c << 2];
						b = (u = t[v] * s[n][o + v + h]) - (d = t[127 - v] * s[n][o + v + h + 128]), u += d, m = (p = t[v + 64] * s[n][o + v + h + 64]) - (d = t[63 - v] * s[n][o + v + h + 192]), p += d, f -= 4, a[l][f + 0] = u + p, a[l][f + 2] = u - p, a[l][f + 1] = b + m, a[l][f + 3] = b - m, b = (u = t[v + 1] * s[n][o + v + h + 1]) - (d = t[126 - v] * s[n][o + v + h + 129]), u += d, m = (p = t[v + 65] * s[n][o + v + h + 65]) - (d = t[62 - v] * s[n][o + v + h + 193]), p += d, a[l][f + r.BLKSIZE_s / 2 + 0] = u + p, a[l][f + r.BLKSIZE_s / 2 + 2] = u - p, a[l][f + r.BLKSIZE_s / 2 + 1] = b + m, a[l][f + r.BLKSIZE_s / 2 + 3] = b - m;
					} while (--c >= 0);
					_(a[l], f, r.BLKSIZE_s / 2);
				}
			}, this.fft_long = function(t, a, n, s, o) {
				var l = r.BLKSIZE / 8 - 1, f = r.BLKSIZE / 2;
				do {
					var h, c, u, b, p, m = 255 & i[l];
					c = (h = e[m] * s[n][o + m]) - (p = e[m + 512] * s[n][o + m + 512]), h += p, b = (u = e[m + 256] * s[n][o + m + 256]) - (p = e[m + 768] * s[n][o + m + 768]), u += p, a[(f -= 4) + 0] = h + u, a[f + 2] = h - u, a[f + 1] = c + b, a[f + 3] = c - b, c = (h = e[m + 1] * s[n][o + m + 1]) - (p = e[m + 513] * s[n][o + m + 513]), h += p, b = (u = e[m + 257] * s[n][o + m + 257]) - (p = e[m + 769] * s[n][o + m + 769]), u += p, a[f + r.BLKSIZE / 2 + 0] = h + u, a[f + r.BLKSIZE / 2 + 2] = h - u, a[f + r.BLKSIZE / 2 + 1] = c + b, a[f + r.BLKSIZE / 2 + 3] = c - b;
				} while (--l >= 0);
				_(a, f, r.BLKSIZE / 2);
			}, this.init_fft = function(a) {
				for (var n = 0; n < r.BLKSIZE; n++) e[n] = .42 - .5 * Math.cos(2 * Math.PI * (n + .5) / r.BLKSIZE) + .08 * Math.cos(4 * Math.PI * (n + .5) / r.BLKSIZE);
				for (n = 0; n < r.BLKSIZE_s / 2; n++) t[n] = .5 * (1 - Math.cos(2 * Math.PI * (n + .5) / r.BLKSIZE_s));
			};
		};
	}), v = _((e, t) => {
		var a = h();
		a.System;
		var n = a.VbrMode, s = a.Float, r = a.ShortBlock, _ = a.Util, i = a.Arrays;
		a.new_array_n, a.new_byte, a.new_double;
		var o = a.new_float, l = a.new_float_n, f = a.new_int;
		a.new_int_n;
		var c = a.assert, u = d(), b = m();
		t.exports = function() {
			var e = p(), t = new u(), a = 2.302585092994046, h = 1 / 217621504 / (b.BLKSIZE / 2), m = .3, d = 21, v = .2302585093;
			function g(e) {
				return e;
			}
			function w(e, t) {
				for (var a = 0, n = 0; n < b.BLKSIZE / 2; ++n) a += e[n] * t.ATH.eql_w[n];
				return a *= h;
			}
			function S(e, a, n, s, r, i, o, l, f, h, c) {
				var u = e.internal_flags;
				if (f < 2) t.fft_long(u, s[r], f, h, c), t.fft_short(u, i[o], f, h, c);
				else if (2 == f) {
					for (var p = b.BLKSIZE - 1; p >= 0; --p) {
						var m = s[r + 0][p], d = s[r + 1][p];
						s[r + 0][p] = (m + d) * _.SQRT2 * .5, s[r + 1][p] = (m - d) * _.SQRT2 * .5;
					}
					for (var v = 2; v >= 0; --v) for (p = b.BLKSIZE_s - 1; p >= 0; --p) {
						m = i[o + 0][v][p], d = i[o + 1][v][p];
						i[o + 0][v][p] = (m + d) * _.SQRT2 * .5, i[o + 1][v][p] = (m - d) * _.SQRT2 * .5;
					}
				}
				a[0] = s[r + 0][0], a[0] *= a[0];
				for (p = b.BLKSIZE / 2 - 1; p >= 0; --p) {
					var S = s[r + 0][b.BLKSIZE / 2 - p], R = s[r + 0][b.BLKSIZE / 2 + p];
					a[b.BLKSIZE / 2 - p] = g(.5 * (S * S + R * R));
				}
				for (v = 2; v >= 0; --v) {
					n[v][0] = i[o + 0][v][0], n[v][0] *= n[v][0];
					for (p = b.BLKSIZE_s / 2 - 1; p >= 0; --p) {
						S = i[o + 0][v][b.BLKSIZE_s / 2 - p], R = i[o + 0][v][b.BLKSIZE_s / 2 + p];
						n[v][b.BLKSIZE_s / 2 - p] = g(.5 * (S * S + R * R));
					}
				}
				var A = 0;
				for (p = 11; p < b.HBLKSIZE; p++) A += a[p];
				if (u.tot_ener[f] = A, e.analysis) {
					for (p = 0; p < b.HBLKSIZE; p++) u.pinfo.energy[l][f][p] = u.pinfo.energy_save[f][p], u.pinfo.energy_save[f][p] = a[p];
					u.pinfo.pe[l][f] = u.pe[f];
				}
				2 == e.athaa_loudapprox && f < 2 && (u.loudness_sq[l][f] = u.loudness_sq_save[f], u.loudness_sq_save[f] = w(a, u));
			}
			var R, A, M, B = [
				1,
				.79433,
				.63096,
				.63096,
				.63096,
				.63096,
				.63096,
				.25119,
				.11749
			], y = [
				3.3246 * 3.3246,
				3.23837 * 3.23837,
				9.9500500969,
				9.0247369744,
				8.1854926609,
				7.0440875649,
				2.46209 * 2.46209,
				2.284 * 2.284,
				4.4892710641,
				1.96552 * 1.96552,
				1.82335 * 1.82335,
				1.69146 * 1.69146,
				2.4621061921,
				2.1508568964,
				1.37074 * 1.37074,
				1.31036 * 1.31036,
				1.5691069696,
				1.4555939904,
				1.16203 * 1.16203,
				1.2715945225,
				1.09428 * 1.09428,
				1.0659 * 1.0659,
				1.0779838276,
				1.0382591025,
				1
			], E = [
				1.7782755904,
				1.35879 * 1.35879,
				1.38454 * 1.38454,
				1.39497 * 1.39497,
				1.40548 * 1.40548,
				1.3537 * 1.3537,
				1.6999465924,
				1.22321 * 1.22321,
				1.3169398564,
				1
			], T = [
				5.5396212496,
				2.29259 * 2.29259,
				4.9868695969,
				2.12675 * 2.12675,
				2.02545 * 2.02545,
				1.87894 * 1.87894,
				1.74303 * 1.74303,
				1.61695 * 1.61695,
				2.2499700001,
				1.39148 * 1.39148,
				1.29083 * 1.29083,
				1.19746 * 1.19746,
				1.2339655056,
				1.0779838276
			];
			function k(e, t, a, n, s, r) {
				var i;
				if (t > e) {
					if (!(t < e * A)) return e + t;
					i = t / e;
				} else {
					if (e >= t * A) return e + t;
					i = e / t;
				}
				if (c(e >= 0), c(t >= 0), e += t, n + 3 <= 6) {
					if (i >= R) return e;
					var o = 0 | _.FAST_LOG10_X(i, 16);
					return e * E[o];
				}
				o = 0 | _.FAST_LOG10_X(i, 16);
				if (t = 0 != r ? s.ATH.cb_s[a] * s.ATH.adjust : s.ATH.cb_l[a] * s.ATH.adjust, c(t >= 0), e < M * t) {
					if (e > t) {
						var l, f = 1;
						return o <= 13 && (f = T[o]), l = _.FAST_LOG10_X(e / t, 10 / 15), e * ((y[o] - f) * l + f);
					}
					return o > 13 ? e : e * T[o];
				}
				return e * y[o];
			}
			var x = [
				1.7782755904,
				1.35879 * 1.35879,
				1.38454 * 1.38454,
				1.39497 * 1.39497,
				1.40548 * 1.40548,
				1.3537 * 1.3537,
				1.6999465924,
				1.22321 * 1.22321,
				1.3169398564,
				1
			];
			function P(e, t, a) {
				var n;
				if (e < 0 && (e = 0), t < 0 && (t = 0), e <= 0) return t;
				if (t <= 0) return e;
				if (n = t > e ? t / e : e / t, -2 <= a && a <= 2) {
					if (n >= R) return e + t;
					var s = 0 | _.FAST_LOG10_X(n, 16);
					return (e + t) * x[s];
				}
				return n < A ? e + t : (e < t && (e = t), e);
			}
			function I(e, t, a, n, s) {
				var r, _, i = 0, o = 0;
				for (r = _ = 0; r < b.SBMAX_s; ++_, ++r) {
					for (var l = e.bo_s[r], f = e.npart_s, h = l < f ? l : f; _ < h;) c(t[_] >= 0), c(a[_] >= 0), i += t[_], o += a[_], _++;
					if (e.en[n].s[r][s] = i, e.thm[n].s[r][s] = o, _ >= f) {
						++r;
						break;
					}
					c(t[_] >= 0), c(a[_] >= 0);
					var u = e.PSY.bo_s_weight[r], p = 1 - u;
					i = u * t[_], o = u * a[_], e.en[n].s[r][s] += i, e.thm[n].s[r][s] += o, i = p * t[_], o = p * a[_];
				}
				for (; r < b.SBMAX_s; ++r) e.en[n].s[r][s] = 0, e.thm[n].s[r][s] = 0;
			}
			function O(e, t, a, n) {
				var s, r, _ = 0, i = 0;
				for (s = r = 0; s < b.SBMAX_l; ++r, ++s) {
					for (var o = e.bo_l[s], l = e.npart_l, f = o < l ? o : l; r < f;) c(t[r] >= 0), c(a[r] >= 0), _ += t[r], i += a[r], r++;
					if (e.en[n].l[s] = _, e.thm[n].l[s] = i, r >= l) {
						++s;
						break;
					}
					c(t[r] >= 0), c(a[r] >= 0);
					var h = e.PSY.bo_l_weight[s], u = 1 - h;
					_ = h * t[r], i = h * a[r], e.en[n].l[s] += _, e.thm[n].l[s] += i, _ = u * t[r], i = u * a[r];
				}
				for (; s < b.SBMAX_l; ++s) e.en[n].l[s] = 0, e.thm[n].l[s] = 0;
			}
			function V(e, t, a, n, s, r) {
				var _, i, o = e.internal_flags;
				for (i = _ = 0; i < o.npart_s; ++i) {
					for (var l = 0, f = 0, h = o.numlines_s[i], u = 0; u < h; ++u, ++_) {
						var p = t[r][_];
						l += p, f < p && (f = p);
					}
					a[i] = l;
				}
				for (c(i == o.npart_s), c(129 == _), _ = i = 0; i < o.npart_s; i++) {
					var m = o.s3ind_s[i][0], d = o.s3_ss[_++] * a[m];
					for (++m; m <= o.s3ind_s[i][1];) d += o.s3_ss[_] * a[m], ++_, ++m;
					var v = 2 * o.nb_s1[s][i];
					if (n[i] = Math.min(d, v), o.blocktype_old[1 & s] == b.SHORT_TYPE) {
						v = 16 * o.nb_s2[s][i];
						var g = n[i];
						n[i] = Math.min(v, g);
					}
					o.nb_s2[s][i] = o.nb_s1[s][i], o.nb_s1[s][i] = d, c(n[i] >= 0);
				}
				for (; i <= b.CBANDS; ++i) a[i] = 0, n[i] = 0;
			}
			function H(e, t, a) {
				return a >= 1 ? e : a <= 0 ? t : t > 0 ? Math.pow(e / t, a) * t : 0;
			}
			var L = [
				11.8,
				13.6,
				17.2,
				32,
				46.5,
				51.3,
				57.5,
				67.1,
				71.5,
				84.6,
				97.6,
				130
			];
			function N(e, t) {
				for (var n = 309.07, s = 0; s < b.SBMAX_s - 1; s++) for (var r = 0; r < 3; r++) {
					var i = e.thm.s[s][r];
					if (c(s < L.length), i > 0) {
						var o = i * t, l = e.en.s[s][r];
						l > o && (l > 1e10 * o ? n += L[s] * (10 * a) : (c(o > 0), n += L[s] * _.FAST_LOG10(l / o)));
					}
				}
				return n;
			}
			var D = [
				6.8,
				5.8,
				5.8,
				6.4,
				6.5,
				9.9,
				12.1,
				14.4,
				15,
				18.9,
				21.6,
				26.9,
				34.2,
				40.2,
				46.8,
				56.5,
				60.7,
				73.9,
				85.7,
				93.4,
				126.1
			];
			function X(e, t) {
				for (var n = 281.0575, s = 0; s < b.SBMAX_l - 1; s++) {
					var r = e.thm.l[s];
					if (c(s < D.length), r > 0) {
						var i = r * t, o = e.en.l[s];
						o > i && (o > 1e10 * i ? n += D[s] * (10 * a) : (c(i > 0), n += D[s] * _.FAST_LOG10(o / i)));
					}
				}
				return n;
			}
			function C(e, t, a, n, s) {
				var r, _;
				for (r = _ = 0; r < e.npart_l; ++r) {
					var i, o = 0, l = 0;
					for (i = 0; i < e.numlines_l[r]; ++i, ++_) {
						var f = t[_];
						c(f >= 0), o += f, l < f && (l = f);
					}
					a[r] = o, n[r] = l, s[r] = o * e.rnumlines_l[r], c(e.rnumlines_l[r] >= 0), c(o >= 0), c(a[r] >= 0), c(n[r] >= 0), c(s[r] >= 0);
				}
			}
			function F(e, t, a, n) {
				var s = B.length - 1, r = 0, _ = a[r] + a[r + 1];
				(c(_ >= 0), _ > 0) ? ((i = t[r]) < t[r + 1] && (i = t[r + 1]), c(e.numlines_l[r] + e.numlines_l[r + 1] - 1 > 0), (o = 0 | (_ = 20 * (2 * i - _) / (_ * (e.numlines_l[r] + e.numlines_l[r + 1] - 1)))) > s && (o = s), n[r] = o) : n[r] = 0;
				for (r = 1; r < e.npart_l - 1; r++) {
					var i, o;
					if (_ = a[r - 1] + a[r] + a[r + 1], c(_ >= 0), _ > 0) (i = t[r - 1]) < t[r] && (i = t[r]), i < t[r + 1] && (i = t[r + 1]), c(e.numlines_l[r - 1] + e.numlines_l[r] + e.numlines_l[r + 1] - 1 > 0), (o = 0 | (_ = 20 * (3 * i - _) / (_ * (e.numlines_l[r - 1] + e.numlines_l[r] + e.numlines_l[r + 1] - 1)))) > s && (o = s), n[r] = o;
					else n[r] = 0;
				}
				(c(r > 0), c(r == e.npart_l - 1), _ = a[r - 1] + a[r], c(_ >= 0), _ > 0) ? ((i = t[r - 1]) < t[r] && (i = t[r]), c(e.numlines_l[r - 1] + e.numlines_l[r] - 1 > 0), (o = 0 | (_ = 20 * (2 * i - _) / (_ * (e.numlines_l[r - 1] + e.numlines_l[r] - 1)))) > s && (o = s), n[r] = o) : n[r] = 0;
				c(r == e.npart_l - 1);
			}
			var Y = [
				-1730326e-23,
				-.01703172,
				-1349528e-23,
				.0418072,
				-673278e-22,
				-.0876324,
				-30835e-21,
				.1863476,
				-1104424e-22,
				-.627638
			];
			function q(e, a, n, s, r, i, o, l) {
				var f = e.internal_flags;
				if (s < 2) t.fft_long(f, o[l], s, a, n);
				else if (2 == s) for (var h = b.BLKSIZE - 1; h >= 0; --h) {
					var c = o[l + 0][h], u = o[l + 1][h];
					o[l + 0][h] = (c + u) * _.SQRT2 * .5, o[l + 1][h] = (c - u) * _.SQRT2 * .5;
				}
				i[0] = o[l + 0][0], i[0] *= i[0];
				for (h = b.BLKSIZE / 2 - 1; h >= 0; --h) {
					var p = o[l + 0][b.BLKSIZE / 2 - h], m = o[l + 0][b.BLKSIZE / 2 + h];
					i[b.BLKSIZE / 2 - h] = g(.5 * (p * p + m * m));
				}
				var d = 0;
				for (h = 11; h < b.HBLKSIZE; h++) d += i[h];
				if (f.tot_ener[s] = d, e.analysis) {
					for (h = 0; h < b.HBLKSIZE; h++) f.pinfo.energy[r][s][h] = f.pinfo.energy_save[s][h], f.pinfo.energy_save[s][h] = i[h];
					f.pinfo.pe[r][s] = f.pe[s];
				}
			}
			function j(e, a, n, s, r, i, o, l) {
				var f = e.internal_flags;
				if (0 == r && s < 2 && t.fft_short(f, o[l], s, a, n), 2 == s) for (var h = b.BLKSIZE_s - 1; h >= 0; --h) {
					var c = o[l + 0][r][h], u = o[l + 1][r][h];
					o[l + 0][r][h] = (c + u) * _.SQRT2 * .5, o[l + 1][r][h] = (c - u) * _.SQRT2 * .5;
				}
				i[r][0] = o[l + 0][r][0], i[r][0] *= i[r][0];
				for (h = b.BLKSIZE_s / 2 - 1; h >= 0; --h) {
					var p = o[l + 0][r][b.BLKSIZE_s / 2 - h], m = o[l + 0][r][b.BLKSIZE_s / 2 + h];
					i[r][b.BLKSIZE_s / 2 - h] = g(.5 * (p * p + m * m));
				}
			}
			function G(e, t, a, n) {
				var s = e.internal_flags;
				2 == e.athaa_loudapprox && a < 2 && (s.loudness_sq[t][a] = s.loudness_sq_save[a], s.loudness_sq_save[a] = w(n, s));
			}
			this.L3psycho_anal_ns = function(t, a, s, _, h, u, p, v, g, w) {
				var R, A, M, y, E, T, x, P, L, D, q = t.internal_flags, j = l([2, b.BLKSIZE]), G = l([
					2,
					3,
					b.BLKSIZE_s
				]), U = o(b.CBANDS + 1), z = o(b.CBANDS + 1), K = o(b.CBANDS + 2), Z = f(2), Q = f(2), W = l([2, 576]), J = f(b.CBANDS + 2), $ = f(b.CBANDS + 2);
				for (i.fill($, 0), R = q.channels_out, t.mode == e.JOINT_STEREO && (R = 4), L = t.VBR == n.vbr_off ? 0 == q.ResvMax ? 0 : q.ResvSize / q.ResvMax * .5 : t.VBR == n.vbr_rh || t.VBR == n.vbr_mtrh || t.VBR == n.vbr_mt ? .6 : 1, A = 0; A < q.channels_out; A++) {
					var ee = a[A], te = s + 576 - 350 - d + 192;
					for (c(10 == Y.length), y = 0; y < 576; y++) {
						var ae = ee[te + y + 10], ne = 0;
						for (E = 0; E < 9; E += 2) ae += Y[E] * (ee[te + y + E] + ee[te + y + d - E]), ne += Y[E + 1] * (ee[te + y + E + 1] + ee[te + y + d - E - 1]);
						W[A][y] = ae + ne;
					}
					h[_][A].en.assign(q.en[A]), h[_][A].thm.assign(q.thm[A]), R > 2 && (u[_][A].en.assign(q.en[A + 2]), u[_][A].thm.assign(q.thm[A + 2]));
				}
				for (A = 0; A < R; A++) {
					var se, re = o(12), _e = [
						0,
						0,
						0,
						0
					], ie = o(12), oe = 1, le = o(b.CBANDS), fe = o(b.CBANDS), he = [
						0,
						0,
						0,
						0
					], ce = o(b.HBLKSIZE), ue = l([3, b.HBLKSIZE_s]);
					for (c(q.npart_s <= b.CBANDS), c(q.npart_l <= b.CBANDS), y = 0; y < 3; y++) re[y] = q.nsPsy.last_en_subshort[A][y + 6], c(q.nsPsy.last_en_subshort[A][y + 4] > 0), ie[y] = re[y] / q.nsPsy.last_en_subshort[A][y + 4], _e[0] += re[y];
					if (2 == A) for (y = 0; y < 576; y++) {
						var be = W[0][y], pe = W[1][y];
						W[0][y] = be + pe, W[1][y] = be - pe;
					}
					var me = W[1 & A], de = 0;
					for (y = 0; y < 9; y++) {
						for (var ve = de + 64, ge = 1; de < ve; de++) ge < Math.abs(me[de]) && (ge = Math.abs(me[de]));
						q.nsPsy.last_en_subshort[A][y] = re[y + 3] = ge, _e[1 + y / 3] += ge, ge > re[y + 3 - 2] ? (c(re[y + 3 - 2] > 0), ge /= re[y + 3 - 2]) : re[y + 3 - 2] > 10 * ge ? (c(ge > 0), ge = re[y + 3 - 2] / (10 * ge)) : ge = 0, ie[y + 3] = ge;
					}
					if (t.analysis) {
						var we = ie[0];
						for (y = 1; y < 12; y++) we < ie[y] && (we = ie[y]);
						q.pinfo.ers[_][A] = q.pinfo.ers_save[A], q.pinfo.ers_save[A] = we;
					}
					for (se = 3 == A ? q.nsPsy.attackthre_s : q.nsPsy.attackthre, y = 0; y < 12; y++) 0 == he[y / 3] && ie[y] > se && (he[y / 3] = y % 3 + 1);
					for (y = 1; y < 4; y++) {
						var Se;
						_e[y - 1] > _e[y] ? (c(_e[y] > 0), Se = _e[y - 1] / _e[y]) : (c(_e[y - 1] > 0), Se = _e[y] / _e[y - 1]), Se < 1.7 && (he[y] = 0, 1 == y && (he[0] = 0));
					}
					for (0 != he[0] && 0 != q.nsPsy.lastAttacks[A] && (he[0] = 0), 3 != q.nsPsy.lastAttacks[A] && he[0] + he[1] + he[2] + he[3] == 0 || (oe = 0, 0 != he[1] && 0 != he[0] && (he[1] = 0), 0 != he[2] && 0 != he[1] && (he[2] = 0), 0 != he[3] && 0 != he[2] && (he[3] = 0)), A < 2 ? Q[A] = oe : 0 == oe && (Q[0] = Q[1] = 0), g[A] = q.tot_ener[A], S(t, ce, ue, j, 1 & A, G, 1 & A, _, A, a, s), C(q, ce, U, le, fe), F(q, le, fe, J), P = 0; P < 3; P++) {
						var Re, Ae;
						for (V(t, ue, z, K, A, P), I(q, z, K, A, P), x = 0; x < b.SBMAX_s; x++) {
							if (Ae = q.thm[A].s[x][P], Ae *= .8, he[P] >= 2 || 1 == he[P + 1]) {
								var Me = 0 != P ? P - 1 : 2;
								ge = H(q.thm[A].s[x][Me], Ae, .6 * L);
								Ae = Math.min(Ae, ge);
							}
							if (1 == he[P]) {
								Me = 0 != P ? P - 1 : 2, ge = H(q.thm[A].s[x][Me], Ae, m * L);
								Ae = Math.min(Ae, ge);
							} else if (0 != P && 3 == he[P - 1] || 0 == P && 3 == q.nsPsy.lastAttacks[A]) {
								Me = 2 != P ? P + 1 : 0, ge = H(q.thm[A].s[x][Me], Ae, m * L);
								Ae = Math.min(Ae, ge);
							}
							Re = re[3 * P + 3] + re[3 * P + 4] + re[3 * P + 5], 6 * re[3 * P + 5] < Re && (Ae *= .5, 6 * re[3 * P + 4] < Re && (Ae *= .5)), q.thm[A].s[x][P] = Ae;
						}
					}
					for (q.nsPsy.lastAttacks[A] = he[2], T = 0, M = 0; M < q.npart_l; M++) {
						for (var Be = q.s3ind[M][0], ye = U[Be] * B[J[Be]], Ee = q.s3_ll[T++] * ye; ++Be <= q.s3ind[M][1];) ye = U[Be] * B[J[Be]], Ee = k(Ee, q.s3_ll[T++] * ye, Be, Be - M, q, 0);
						Ee *= .158489319246111, q.blocktype_old[1 & A] == b.SHORT_TYPE ? K[M] = Ee : K[M] = H(Math.min(Ee, Math.min(2 * q.nb_1[A][M], 16 * q.nb_2[A][M])), Ee, L), q.nb_2[A][M] = q.nb_1[A][M], q.nb_1[A][M] = Ee;
					}
					for (; M <= b.CBANDS; ++M) U[M] = 0, K[M] = 0;
					O(q, U, K, A);
				}
				(t.mode != e.STEREO && t.mode != e.JOINT_STEREO || t.interChRatio > 0 && function(e, t) {
					var a = e.internal_flags;
					if (a.channels_out > 1) {
						for (var n = 0; n < b.SBMAX_l; n++) {
							var s = a.thm[0].l[n], r = a.thm[1].l[n];
							a.thm[0].l[n] += r * t, a.thm[1].l[n] += s * t;
						}
						for (n = 0; n < b.SBMAX_s; n++) for (var _ = 0; _ < 3; _++) s = a.thm[0].s[n][_], r = a.thm[1].s[n][_], a.thm[0].s[n][_] += r * t, a.thm[1].s[n][_] += s * t;
					}
				}(t, t.interChRatio), t.mode == e.JOINT_STEREO) && (function(e) {
					for (var t = 0; t < b.SBMAX_l; t++) if (!(e.thm[0].l[t] > 1.58 * e.thm[1].l[t] || e.thm[1].l[t] > 1.58 * e.thm[0].l[t])) {
						var a = e.mld_l[t] * e.en[3].l[t], n = Math.max(e.thm[2].l[t], Math.min(e.thm[3].l[t], a));
						a = e.mld_l[t] * e.en[2].l[t];
						var s = Math.max(e.thm[3].l[t], Math.min(e.thm[2].l[t], a));
						e.thm[2].l[t] = n, e.thm[3].l[t] = s;
					}
					for (t = 0; t < b.SBMAX_s; t++) for (var r = 0; r < 3; r++) e.thm[0].s[t][r] > 1.58 * e.thm[1].s[t][r] || e.thm[1].s[t][r] > 1.58 * e.thm[0].s[t][r] || (a = e.mld_s[t] * e.en[3].s[t][r], n = Math.max(e.thm[2].s[t][r], Math.min(e.thm[3].s[t][r], a)), a = e.mld_s[t] * e.en[2].s[t][r], s = Math.max(e.thm[3].s[t][r], Math.min(e.thm[2].s[t][r], a)), e.thm[2].s[t][r] = n, e.thm[3].s[t][r] = s);
				}(q), D = t.msfix, Math.abs(D) > 0 && function(e, t, a) {
					var n = t, s = Math.pow(10, a);
					t *= 2, n *= 2;
					for (var r = 0; r < b.SBMAX_l; r++) {
						var _ = e.ATH.cb_l[e.bm_l[r]] * s;
						(o = Math.min(Math.max(e.thm[0].l[r], _), Math.max(e.thm[1].l[r], _))) * t < (l = Math.max(e.thm[2].l[r], _)) + (f = Math.max(e.thm[3].l[r], _)) && c((l *= h = o * n / (l + f)) + (f *= h) > 0), e.thm[2].l[r] = Math.min(l, e.thm[2].l[r]), e.thm[3].l[r] = Math.min(f, e.thm[3].l[r]);
					}
					for (s *= b.BLKSIZE_s / b.BLKSIZE, r = 0; r < b.SBMAX_s; r++) for (var i = 0; i < 3; i++) {
						var o, l, f, h;
						_ = e.ATH.cb_s[e.bm_s[r]] * s, (o = Math.min(Math.max(e.thm[0].s[r][i], _), Math.max(e.thm[1].s[r][i], _))) * t < (l = Math.max(e.thm[2].s[r][i], _)) + (f = Math.max(e.thm[3].s[r][i], _)) && c((l *= h = o * t / (l + f)) + (f *= h) > 0), e.thm[2].s[r][i] = Math.min(e.thm[2].s[r][i], l), e.thm[3].s[r][i] = Math.min(e.thm[3].s[r][i], f);
					}
				}(q, D, t.ATHlower * q.ATH.adjust));
				for (function(e, t, a, n) {
					var s = e.internal_flags;
					e.short_blocks != r.short_block_coupled || 0 != t[0] && 0 != t[1] || (t[0] = t[1] = 0);
					for (var _ = 0; _ < s.channels_out; _++) n[_] = b.NORM_TYPE, e.short_blocks == r.short_block_dispensed && (t[_] = 1), e.short_blocks == r.short_block_forced && (t[_] = 0), 0 != t[_] ? (c(s.blocktype_old[_] != b.START_TYPE), s.blocktype_old[_] == b.SHORT_TYPE && (n[_] = b.STOP_TYPE)) : (n[_] = b.SHORT_TYPE, s.blocktype_old[_] == b.NORM_TYPE && (s.blocktype_old[_] = b.START_TYPE), s.blocktype_old[_] == b.STOP_TYPE && (s.blocktype_old[_] = b.SHORT_TYPE)), a[_] = s.blocktype_old[_], s.blocktype_old[_] = n[_];
				}(t, Q, w, Z), A = 0; A < R; A++) {
					var Te, ke, xe, Pe = 0;
					A > 1 ? (Te = v, Pe = -2, ke = b.NORM_TYPE, w[0] != b.SHORT_TYPE && w[1] != b.SHORT_TYPE || (ke = b.SHORT_TYPE), xe = u[_][A - 2]) : (Te = p, Pe = 0, ke = w[A], xe = h[_][A]), ke == b.SHORT_TYPE ? Te[Pe + A] = N(xe, q.masking_lower) : Te[Pe + A] = X(xe, q.masking_lower), t.analysis && (q.pinfo.pe[_][A] = Te[Pe + A]);
				}
				return 0;
			};
			var U = [
				-1730326e-23,
				-.01703172,
				-1349528e-23,
				.0418072,
				-673278e-22,
				-.0876324,
				-30835e-21,
				.1863476,
				-1104424e-22,
				-.627638
			];
			function z(e, t, a) {
				if (0 == a) for (var n = 0; n < e.npart_s; n++) e.nb_s2[t][n] = e.nb_s1[t][n], e.nb_s1[t][n] = 0;
			}
			function K(e, t) {
				for (var a = 0; a < e.npart_l; a++) e.nb_2[t][a] = e.nb_1[t][a], e.nb_1[t][a] = 0;
			}
			function Z(e, t, a, n, s, r) {
				var _, i, l, f = e.internal_flags, h = new float[b.CBANDS](), u = o(b.CBANDS), p = new int[b.CBANDS]();
				for (l = i = 0; l < f.npart_s; ++l) {
					var m = 0, d = 0, v = f.numlines_s[l];
					for (_ = 0; _ < v; ++_, ++i) {
						var g = t[r][i];
						m += g, d < g && (d = g);
					}
					a[l] = m, c(m >= 0), h[l] = d, c(v > 0), u[l] = m / v, c(u[l] >= 0);
				}
				for (c(l == f.npart_s), c(129 == i); l < b.CBANDS; ++l) h[l] = 0, u[l] = 0;
				for (function(e, t, a, n) {
					var s = B.length - 1, r = 0, _ = a[r] + a[r + 1];
					for (c(_ >= 0), _ > 0 ? ((i = t[r]) < t[r + 1] && (i = t[r + 1]), c(e.numlines_s[r] + e.numlines_s[r + 1] - 1 > 0), (o = 0 | (_ = 20 * (2 * i - _) / (_ * (e.numlines_s[r] + e.numlines_s[r + 1] - 1)))) > s && (o = s), n[r] = o) : n[r] = 0, r = 1; r < e.npart_s - 1; r++) {
						var i, o;
						_ = a[r - 1] + a[r] + a[r + 1], c(r + 1 < e.npart_s), c(_ >= 0), _ > 0 ? ((i = t[r - 1]) < t[r] && (i = t[r]), i < t[r + 1] && (i = t[r + 1]), c(e.numlines_s[r - 1] + e.numlines_s[r] + e.numlines_s[r + 1] - 1 > 0), (o = 0 | (_ = 20 * (3 * i - _) / (_ * (e.numlines_s[r - 1] + e.numlines_s[r] + e.numlines_s[r + 1] - 1)))) > s && (o = s), n[r] = o) : n[r] = 0;
					}
					c(r > 0), c(r == e.npart_s - 1), _ = a[r - 1] + a[r], c(_ >= 0), _ > 0 ? ((i = t[r - 1]) < t[r] && (i = t[r]), c(e.numlines_s[r - 1] + e.numlines_s[r] - 1 > 0), (o = 0 | (_ = 20 * (2 * i - _) / (_ * (e.numlines_s[r - 1] + e.numlines_s[r] - 1)))) > s && (o = s), n[r] = o) : n[r] = 0, c(r == e.npart_s - 1);
				}(f, h, u, p), i = l = 0; l < f.npart_s; l++) {
					var w, S, R, A, M, y = f.s3ind_s[l][0], E = f.s3ind_s[l][1];
					for (w = p[y], S = 1, A = f.s3_ss[i] * a[y] * B[p[y]], ++i, ++y; y <= E;) w += p[y], S += 1, A = P(A, R = f.s3_ss[i] * a[y] * B[p[y]], y - l), ++i, ++y;
					A *= M = .5 * B[w = (1 + 2 * w) / (2 * S)], n[l] = A, f.nb_s2[s][l] = f.nb_s1[s][l], f.nb_s1[s][l] = A, R = h[l], R *= f.minval_s[l], R *= M, n[l] > R && (n[l] = R), f.masking_lower > 1 && (n[l] *= f.masking_lower), n[l] > a[l] && (n[l] = a[l]), f.masking_lower < 1 && (n[l] *= f.masking_lower), c(n[l] >= 0);
				}
				for (; l < b.CBANDS; ++l) a[l] = 0, n[l] = 0;
			}
			function Q(e, t, a, n, s) {
				var r, _ = o(b.CBANDS), i = o(b.CBANDS), l = f(b.CBANDS + 2);
				C(e, t, a, _, i), F(e, _, i, l);
				var h = 0;
				for (r = 0; r < e.npart_l; r++) {
					var u, p, d, v = e.s3ind[r][0], g = e.s3ind[r][1], w = 0, S = 0;
					for (w = l[v], S += 1, p = e.s3_ll[h] * a[v] * B[l[v]], ++h, ++v; v <= g;) w += l[v], S += 1, p = P(p, u = e.s3_ll[h] * a[v] * B[l[v]], v - r), ++h, ++v;
					if (p *= d = .5 * B[w = (1 + 2 * w) / (2 * S)], e.blocktype_old[1 & s] == b.SHORT_TYPE) {
						var R = 2 * e.nb_1[s][r];
						n[r] = R > 0 ? Math.min(p, R) : Math.min(p, a[r] * m);
					} else {
						var A = 16 * e.nb_2[s][r], M = 2 * e.nb_1[s][r];
						A <= 0 && (A = p), M <= 0 && (M = p), R = e.blocktype_old[1 & s] == b.NORM_TYPE ? Math.min(M, A) : M, n[r] = Math.min(p, R);
					}
					e.nb_2[s][r] = e.nb_1[s][r], e.nb_1[s][r] = p, u = _[r], u *= e.minval_l[r], u *= d, n[r] > u && (n[r] = u), e.masking_lower > 1 && (n[r] *= e.masking_lower), n[r] > a[r] && (n[r] = a[r]), e.masking_lower < 1 && (n[r] *= e.masking_lower), c(n[r] >= 0);
				}
				for (; r < b.CBANDS; ++r) a[r] = 0, n[r] = 0;
			}
			function W(e, t, a, n, s, r, _) {
				for (var i, o, l = 2 * r, f = r > 0 ? Math.pow(10, s) : 1, h = 0; h < _; ++h) {
					var u = e[2][h], b = e[3][h], p = t[0][h], m = t[1][h], d = t[2][h], v = t[3][h];
					if (p <= 1.58 * m && m <= 1.58 * p) {
						var g = a[h] * b, w = a[h] * u;
						o = Math.max(d, Math.min(v, g)), i = Math.max(v, Math.min(d, w));
					} else o = d, i = v;
					if (r > 0) {
						var S, R, A = n[h] * f;
						if (S = Math.min(Math.max(p, A), Math.max(m, A)), (R = (d = Math.max(o, A)) + (v = Math.max(i, A))) > 0 && S * l < R) {
							var M = S * l / R;
							d *= M, v *= M, c(R > 0);
						}
						o = Math.min(d, o), i = Math.min(v, i);
					}
					o > u && (o = u), i > b && (i = b), t[2][h] = o, t[3][h] = i;
				}
			}
			function J(e, t) {
				var a;
				return (a = e >= 0 ? 27 * -e : e * t) <= -72 ? 0 : Math.exp(a * v);
			}
			function $(e) {
				var t, a, n = 0;
				for (n = 0; J(n, e) > 1e-20; n -= 1);
				for (s = n, r = 0; Math.abs(r - s) > 1e-12;) J(n = (r + s) / 2, e) > 0 ? r = n : s = n;
				t = s;
				var s, r;
				n = 0;
				for (n = 0; J(n, e) > 1e-20; n += 1);
				for (s = 0, r = n; Math.abs(r - s) > 1e-12;) J(n = (r + s) / 2, e) > 0 ? s = n : r = n;
				a = r;
				var _, i = 0, o = 1e3;
				for (_ = 0; _ <= o; ++_) i += J(n = t + _ * (a - t) / o, e);
				return (o + 1) / (i * (a - t));
			}
			function ee(e) {
				var t, a, n, s = e;
				return t = (s *= s >= 0 ? 3 : 1.5) >= .5 && s <= 2.5 ? 8 * ((n = s - .5) * n - 2 * n) : 0, (a = 15.811389 + 7.5 * (s += .474) - 17.5 * Math.sqrt(1 + s * s)) <= -60 ? 0 : (s = Math.exp((t + a) * v), s /= .6609193);
			}
			function te(e) {
				return e < 0 && (e = 0), e *= .001, 13 * Math.atan(.76 * e) + 3.5 * Math.atan(e * e / 56.25);
			}
			function ae(e, t, a, n, s, r, _, i, l, h, u, p) {
				var m, d = o(b.CBANDS + 1), v = i / (p > 15 ? 1152 : 384), g = f(b.HBLKSIZE);
				i /= l;
				var w = 0, S = 0;
				for (m = 0; m < b.CBANDS; m++) {
					var R;
					for (P = te(i * w), d[m] = i * w, R = w; te(i * R) - P < .34 && R <= l / 2; R++);
					for (e[m] = R - w, S = m + 1; w < R;) c(w < b.HBLKSIZE), g[w++] = m;
					if (w > l / 2) {
						w = l / 2, ++m;
						break;
					}
				}
				c(m < b.CBANDS), d[m] = i * w;
				for (var A = 0; A < p; A++) {
					var M, B, y = h[A], E = h[A + 1], T;
					(M = 0 | Math.floor(.5 + u * (y - .5))) < 0 && (M = 0), (B = 0 | Math.floor(.5 + u * (E - .5))) > l / 2 && (B = l / 2), a[A] = (g[M] + g[B]) / 2, t[A] = g[B], _[A] = (v * E - d[t[A]]) / (d[t[A] + 1] - d[t[A]]), _[A] < 0 ? _[A] = 0 : _[A] > 1 && (_[A] = 1), T = te(i * h[A] * u), T = Math.min(T, 15.5) / 15.5, r[A] = Math.pow(10, 1.25 * (1 - Math.cos(Math.PI * T)) - 2.5);
				}
				w = 0;
				for (var k = 0; k < S; k++) {
					var x = e[k], P = te(i * w), I = te(i * (w + x - 1));
					n[k] = .5 * (P + I), P = te(i * (w - .5)), I = te(i * (w + x - .5)), s[k] = I - P, w += x;
				}
				return S;
			}
			function ne(e, t, a, n, s, r) {
				var _, i = l([b.CBANDS, b.CBANDS]), f = 0;
				if (r) for (var h = 0; h < t; h++) for (_ = 0; _ < t; _++) {
					var c = ee(a[h] - a[_]) * n[_];
					i[h][_] = c * s[h];
				}
				else for (_ = 0; _ < t; _++) {
					var u = 15 + Math.min(21 / a[_], 12), p = $(u);
					for (h = 0; h < t; h++) {
						c = p * J(a[h] - a[_], u) * n[_];
						i[h][_] = c * s[h];
					}
				}
				for (h = 0; h < t; h++) {
					for (_ = 0; _ < t && !(i[h][_] > 0); _++);
					for (e[h][0] = _, _ = t - 1; _ > 0 && !(i[h][_] > 0); _--);
					e[h][1] = _, f += e[h][1] - e[h][0] + 1;
				}
				var m = o(f), d = 0;
				for (h = 0; h < t; h++) for (_ = e[h][0]; _ <= e[h][1]; _++) m[d++] = i[h][_];
				return m;
			}
			function se(e) {
				var t = te(e);
				return t = Math.min(t, 15.5) / 15.5, Math.pow(10, 1.25 * (1 - Math.cos(Math.PI * t)) - 2.5);
			}
			function re(e, t) {
				return e < -.3 && (e = 3410), e /= 1e3, e = Math.max(.1, e), 3.64 * Math.pow(e, -.8) - 6.8 * Math.exp(-.6 * Math.pow(e - 3.4, 2)) + 6 * Math.exp(-.15 * Math.pow(e - 8.7, 2)) + .001 * (.6 + .04 * t) * Math.pow(e, 4);
			}
			this.L3psycho_anal_vbr = function(t, a, n, s, _, i, h, u, p, m) {
				var v = t.internal_flags, g = o(b.HBLKSIZE), w = l([3, b.HBLKSIZE_s]), S = l([2, b.BLKSIZE]), R = l([
					2,
					3,
					b.BLKSIZE_s
				]), A = l([4, b.CBANDS]), M = l([4, b.CBANDS]), B = l([4, 3]), y = [
					[
						0,
						0,
						0,
						0
					],
					[
						0,
						0,
						0,
						0
					],
					[
						0,
						0,
						0,
						0
					],
					[
						0,
						0,
						0,
						0
					]
				], E = f(2), T = t.mode == e.JOINT_STEREO ? 4 : v.channels_out;
				(function(t, a, n, s, r, _, i, f, h, u) {
					for (var b = l([2, 576]), p = t.internal_flags, m = p.channels_out, v = t.mode == e.JOINT_STEREO ? 4 : m, g = 0; g < m; g++) {
						firbuf = a[g];
						var w = n + 576 - 350 - d + 192;
						c(10 == U.length);
						for (var S = 0; S < 576; S++) {
							for (var R = firbuf[w + S + 10], A = 0, M = 0; M < 9; M += 2) R += U[M] * (firbuf[w + S + M] + firbuf[w + S + d - M]), A += U[M + 1] * (firbuf[w + S + M + 1] + firbuf[w + S + d - M - 1]);
							b[g][S] = R + A;
						}
						r[s][g].en.assign(p.en[g]), r[s][g].thm.assign(p.thm[g]), v > 2 && (_[s][g].en.assign(p.en[g + 2]), _[s][g].thm.assign(p.thm[g + 2]));
					}
					for (g = 0; g < v; g++) {
						var B = o(12), y = o(12), E = [
							0,
							0,
							0,
							0
						], T = b[1 & g], k = 0, x = 3 == g ? p.nsPsy.attackthre_s : p.nsPsy.attackthre, P = 1;
						if (2 == g) for (S = 0, M = 576; M > 0; ++S, --M) {
							var I = b[0][S], O = b[1][S];
							b[0][S] = I + O, b[1][S] = I - O;
						}
						for (S = 0; S < 3; S++) y[S] = p.nsPsy.last_en_subshort[g][S + 6], c(p.nsPsy.last_en_subshort[g][S + 4] > 0), B[S] = y[S] / p.nsPsy.last_en_subshort[g][S + 4], E[0] += y[S];
						for (S = 0; S < 9; S++) {
							for (var V = k + 64, H = 1; k < V; k++) H < Math.abs(T[k]) && (H = Math.abs(T[k]));
							p.nsPsy.last_en_subshort[g][S] = y[S + 3] = H, E[1 + S / 3] += H, H > y[S + 3 - 2] ? (c(y[S + 3 - 2] > 0), H /= y[S + 3 - 2]) : y[S + 3 - 2] > 10 * H ? (c(H > 0), H = y[S + 3 - 2] / (10 * H)) : H = 0, B[S + 3] = H;
						}
						for (S = 0; S < 3; ++S) {
							var L = y[3 * S + 3] + y[3 * S + 4] + y[3 * S + 5], N = 1;
							6 * y[3 * S + 5] < L && (N *= .5, 6 * y[3 * S + 4] < L && (N *= .5)), f[g][S] = N;
						}
						if (t.analysis) {
							var D = B[0];
							for (S = 1; S < 12; S++) D < B[S] && (D = B[S]);
							p.pinfo.ers[s][g] = p.pinfo.ers_save[g], p.pinfo.ers_save[g] = D;
						}
						for (S = 0; S < 12; S++) 0 == h[g][S / 3] && B[S] > x && (h[g][S / 3] = S % 3 + 1);
						for (S = 1; S < 4; S++) {
							var X = E[S - 1], C = E[S];
							Math.max(X, C) < 4e4 && X < 1.7 * C && C < 1.7 * X && (1 == S && h[g][0] <= h[g][S] && (h[g][0] = 0), h[g][S] = 0);
						}
						h[g][0] <= p.nsPsy.lastAttacks[g] && (h[g][0] = 0), 3 != p.nsPsy.lastAttacks[g] && h[g][0] + h[g][1] + h[g][2] + h[g][3] == 0 || (P = 0, 0 != h[g][1] && 0 != h[g][0] && (h[g][1] = 0), 0 != h[g][2] && 0 != h[g][1] && (h[g][2] = 0), 0 != h[g][3] && 0 != h[g][2] && (h[g][3] = 0)), g < 2 ? u[g] = P : 0 == P && (u[0] = u[1] = 0), i[g] = p.tot_ener[g];
					}
				})(t, a, n, s, _, i, p, B, y, E), function(e, t) {
					var a = e.internal_flags;
					e.short_blocks != r.short_block_coupled || 0 != t[0] && 0 != t[1] || (t[0] = t[1] = 0);
					for (var n = 0; n < a.channels_out; n++) e.short_blocks == r.short_block_dispensed && (t[n] = 1), e.short_blocks == r.short_block_forced && (t[n] = 0);
				}(t, E);
				for (var k = 0; k < T; k++) q(t, a, n, k, s, g, S, P = 1 & k), G(t, s, k, g), 0 != E[P] ? Q(v, g, A[k], M[k], k) : K(v, k);
				E[0] + E[1] == 2 && t.mode == e.JOINT_STEREO && W(A, M, v.mld_cb_l, v.ATH.cb_l, t.ATHlower * v.ATH.adjust, t.msfix, v.npart_l);
				for (k = 0; k < T; k++) 0 != E[P = 1 & k] && O(v, A[k], M[k], k);
				for (var x = 0; x < 3; x++) {
					for (k = 0; k < T; ++k) 0 != E[P = 1 & k] ? z(v, k, x) : (j(t, a, n, k, x, w, R, P), Z(t, w, A[k], M[k], k, x));
					E[0] + E[1] == 0 && t.mode == e.JOINT_STEREO && W(A, M, v.mld_cb_s, v.ATH.cb_s, t.ATHlower * v.ATH.adjust, t.msfix, v.npart_s);
					for (k = 0; k < T; ++k) 0 == E[P = 1 & k] && I(v, A[k], M[k], k, x);
				}
				for (k = 0; k < T; k++) {
					var P;
					if (0 == E[P = 1 & k]) for (var V = 0; V < b.SBMAX_s; V++) {
						var L = o(3);
						for (x = 0; x < 3; x++) {
							var D = v.thm[k].s[V][x];
							if (D *= .8, y[k][x] >= 2 || 1 == y[k][x + 1]) {
								var C = 0 != x ? x - 1 : 2, F = H(v.thm[k].s[V][C], D, .36);
								D = Math.min(D, F);
							} else if (1 == y[k][x]) {
								C = 0 != x ? x - 1 : 2, F = H(v.thm[k].s[V][C], D, .18);
								D = Math.min(D, F);
							} else if (0 != x && 3 == y[k][x - 1] || 0 == x && 3 == v.nsPsy.lastAttacks[k]) {
								C = 2 != x ? x + 1 : 0, F = H(v.thm[k].s[V][C], D, .18);
								D = Math.min(D, F);
							}
							D *= B[k][x], L[x] = D;
						}
						for (x = 0; x < 3; x++) v.thm[k].s[V][x] = L[x];
					}
				}
				for (k = 0; k < T; k++) v.nsPsy.lastAttacks[k] = y[k][2];
				(function(e, t, a) {
					for (var n = e.internal_flags, s = 0; s < n.channels_out; s++) {
						var r = b.NORM_TYPE;
						0 != t[s] ? (c(n.blocktype_old[s] != b.START_TYPE), n.blocktype_old[s] == b.SHORT_TYPE && (r = b.STOP_TYPE)) : (r = b.SHORT_TYPE, n.blocktype_old[s] == b.NORM_TYPE && (n.blocktype_old[s] = b.START_TYPE), n.blocktype_old[s] == b.STOP_TYPE && (n.blocktype_old[s] = b.SHORT_TYPE)), a[s] = n.blocktype_old[s], n.blocktype_old[s] = r;
					}
				})(t, E, m);
				for (k = 0; k < T; k++) {
					var Y, J, $, ee;
					k > 1 ? (Y = u, J = -2, $ = b.NORM_TYPE, m[0] != b.SHORT_TYPE && m[1] != b.SHORT_TYPE || ($ = b.SHORT_TYPE), ee = i[s][k - 2]) : (Y = h, J = 0, $ = m[k], ee = _[s][k]), $ == b.SHORT_TYPE ? Y[J + k] = N(ee, v.masking_lower) : Y[J + k] = X(ee, v.masking_lower), t.analysis && (v.pinfo.pe[s][k] = Y[J + k]);
				}
				return 0;
			}, this.psymodel_init = function(e) {
				var r, _ = e.internal_flags, i = !0, l = 13, f = 24, h = 0, u = 0, p = -8.25, m = -4.5, d = o(b.CBANDS), v = o(b.CBANDS), g = o(b.CBANDS), w = e.out_samplerate;
				switch (e.experimentalZ) {
					default:
					case 0:
						i = !0;
						break;
					case 1:
						i = e.VBR != n.vbr_mtrh && e.VBR != n.vbr_mt;
						break;
					case 2:
						i = !1;
						break;
					case 3: l = 8, h = -1.75, u = -.0125, p = -8.25, m = -2.25;
				}
				for (_.ms_ener_ratio_old = .25, _.blocktype_old[0] = _.blocktype_old[1] = b.NORM_TYPE, r = 0; r < 4; ++r) {
					for (var S = 0; S < b.CBANDS; ++S) _.nb_1[r][S] = 0x56bc75e2d63100000, _.nb_2[r][S] = 0x56bc75e2d63100000, _.nb_s1[r][S] = _.nb_s2[r][S] = 1;
					for (var B = 0; B < b.SBMAX_l; B++) _.en[r].l[B] = 0x56bc75e2d63100000, _.thm[r].l[B] = 0x56bc75e2d63100000;
					for (S = 0; S < 3; ++S) {
						for (B = 0; B < b.SBMAX_s; B++) _.en[r].s[B][S] = 0x56bc75e2d63100000, _.thm[r].s[B][S] = 0x56bc75e2d63100000;
						_.nsPsy.lastAttacks[r] = 0;
					}
					for (S = 0; S < 9; S++) _.nsPsy.last_en_subshort[r][S] = 10;
				}
				for (_.loudness_sq_save[0] = _.loudness_sq_save[1] = 0, _.npart_l = ae(_.numlines_l, _.bo_l, _.bm_l, d, v, _.mld_l, _.PSY.bo_l_weight, w, b.BLKSIZE, _.scalefac_band.l, b.BLKSIZE / 1152, b.SBMAX_l), c(_.npart_l < b.CBANDS), r = 0; r < _.npart_l; r++) {
					var y = h;
					d[r] >= l && (y = u * (d[r] - l) / (f - l) + h * (f - d[r]) / (f - l)), g[r] = Math.pow(10, y / 10), _.numlines_l[r] > 0 ? _.rnumlines_l[r] = 1 / _.numlines_l[r] : _.rnumlines_l[r] = 0;
				}
				_.s3_ll = ne(_.s3ind, _.npart_l, d, v, g, i);
				S = 0;
				for (r = 0; r < _.npart_l; r++) {
					for (var E = s.MAX_VALUE, T = 0; T < _.numlines_l[r]; T++, S++) {
						var k = w * S / (1e3 * b.BLKSIZE), x = this.ATHformula(1e3 * k, e) - 20;
						x = Math.pow(10, .1 * x), E > (x *= _.numlines_l[r]) && (E = x);
					}
					_.ATH.cb_l[r] = E, (E = 20 * d[r] / 10 - 20) > 6 && (E = 100), E < -15 && (E = -15), E -= 8, _.minval_l[r] = Math.pow(10, E / 10) * _.numlines_l[r];
				}
				for (_.npart_s = ae(_.numlines_s, _.bo_s, _.bm_s, d, v, _.mld_s, _.PSY.bo_s_weight, w, b.BLKSIZE_s, _.scalefac_band.s, b.BLKSIZE_s / 384, b.SBMAX_s), c(_.npart_s < b.CBANDS), S = 0, r = 0; r < _.npart_s; r++) {
					y = p;
					d[r] >= l && (y = m * (d[r] - l) / (f - l) + p * (f - d[r]) / (f - l)), g[r] = Math.pow(10, y / 10), E = s.MAX_VALUE;
					for (T = 0; T < _.numlines_s[r]; T++, S++) {
						k = w * S / (1e3 * b.BLKSIZE_s), x = this.ATHformula(1e3 * k, e) - 20;
						x = Math.pow(10, .1 * x), E > (x *= _.numlines_s[r]) && (E = x);
					}
					_.ATH.cb_s[r] = E, E = 7 * d[r] / 12 - 7, d[r] > 12 && (E *= 1 + 3.1 * Math.log(1 + E)), d[r] < 12 && (E *= 1 + 2.3 * Math.log(1 - E)), E < -15 && (E = -15), E -= 8, _.minval_s[r] = Math.pow(10, E / 10) * _.numlines_s[r];
				}
				_.s3_ss = ne(_.s3ind_s, _.npart_s, d, v, g, i), R = Math.pow(10, 9 / 16), A = Math.pow(10, 1.5), M = Math.pow(10, 1.5), t.init_fft(_), _.decay = Math.exp(-1 * a / (.01 * w / 192));
				var P = 3.5;
				2 & e.exp_nspsytune && (P = 1), Math.abs(e.msfix) > 0 && (P = e.msfix), e.msfix = P;
				for (var I = 0; I < _.npart_l; I++) _.s3ind[I][1] > _.npart_l - 1 && (_.s3ind[I][1] = _.npart_l - 1);
				var O = 576 * _.mode_gr / w;
				if (_.ATH.decay = Math.pow(10, -1.2 * O), _.ATH.adjust = .01, _.ATH.adjustLimit = 1, c(_.bo_l[b.SBMAX_l - 1] <= _.npart_l), c(_.bo_s[b.SBMAX_s - 1] <= _.npart_s), -1 != e.ATHtype) {
					var V = e.out_samplerate / b.BLKSIZE, H = 0;
					for (k = 0, r = 0; r < b.BLKSIZE / 2; ++r) k += V, _.ATH.eql_w[r] = 1 / Math.pow(10, this.ATHformula(k, e) / 10), H += _.ATH.eql_w[r];
					for (H = 1 / H, r = b.BLKSIZE / 2; --r >= 0;) _.ATH.eql_w[r] *= H;
				}
				for (I = S = 0; I < _.npart_s; ++I) for (r = 0; r < _.numlines_s[I]; ++r) ++S;
				c(129 == S);
				for (I = S = 0; I < _.npart_l; ++I) for (r = 0; r < _.numlines_l[I]; ++r) ++S;
				for (c(513 == S), S = 0, r = 0; r < _.npart_l; r++) {
					k = w * (S + _.numlines_l[r] / 2) / (1 * b.BLKSIZE);
					_.mld_cb_l[r] = se(k), S += _.numlines_l[r];
				}
				for (; r < b.CBANDS; ++r) _.mld_cb_l[r] = 1;
				for (S = 0, r = 0; r < _.npart_s; r++) {
					k = w * (S + _.numlines_s[r] / 2) / (1 * b.BLKSIZE_s);
					_.mld_cb_s[r] = se(k), S += _.numlines_s[r];
				}
				for (; r < b.CBANDS; ++r) _.mld_cb_s[r] = 1;
				return 0;
			}, this.ATHformula = function(e, t) {
				var a;
				switch (t.ATHtype) {
					case 0:
						a = re(e, 9);
						break;
					case 1:
						a = re(e, -1);
						break;
					case 2:
					default:
						a = re(e, 0);
						break;
					case 3:
						a = re(e, 1) + 6;
						break;
					case 4: a = re(e, t.ATHcurve);
				}
				return a;
			};
		};
	}), g = _((e, t) => {
		var a = p();
		t.exports = function() {
			this.class_id = 0, this.num_samples = 0, this.num_channels = 0, this.in_samplerate = 0, this.out_samplerate = 0, this.scale = 0, this.scale_left = 0, this.scale_right = 0, this.analysis = !1, this.bWriteVbrTag = !1, this.decode_only = !1, this.quality = 0, this.mode = a.STEREO, this.force_ms = !1, this.free_format = !1, this.findReplayGain = !1, this.decode_on_the_fly = !1, this.write_id3tag_automatic = !1, this.brate = 0, this.compression_ratio = 0, this.copyright = 0, this.original = 0, this.extension = 0, this.emphasis = 0, this.error_protection = 0, this.strict_ISO = !1, this.disable_reservoir = !1, this.quant_comp = 0, this.quant_comp_short = 0, this.experimentalY = !1, this.experimentalZ = 0, this.exp_nspsytune = 0, this.preset = 0, this.VBR = null, this.VBR_q_frac = 0, this.VBR_q = 0, this.VBR_mean_bitrate_kbps = 0, this.VBR_min_bitrate_kbps = 0, this.VBR_max_bitrate_kbps = 0, this.VBR_hard_min = 0, this.lowpassfreq = 0, this.highpassfreq = 0, this.lowpasswidth = 0, this.highpasswidth = 0, this.maskingadjust = 0, this.maskingadjust_short = 0, this.ATHonly = !1, this.ATHshort = !1, this.noATH = !1, this.ATHtype = 0, this.ATHcurve = 0, this.ATHlower = 0, this.athaa_type = 0, this.athaa_loudapprox = 0, this.athaa_sensitivity = 0, this.short_blocks = null, this.useTemporal = !1, this.interChRatio = 0, this.msfix = 0, this.tune = !1, this.tune_value_a = 0, this.version = 0, this.encoder_delay = 0, this.encoder_padding = 0, this.framesize = 0, this.frameNum = 0, this.lame_allocated_gfp = 0, this.internal_flags = null;
		};
	}), w = _((e, t) => {
		var a = m(), n = {};
		n.SFBMAX = 3 * a.SBMAX_s, t.exports = n;
	}), S = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double;
		var n = a.new_float;
		a.new_float_n;
		var s = a.new_int;
		a.new_int_n, a.assert;
		var r = w();
		t.exports = function() {
			this.xr = n(576), this.l3_enc = s(576), this.scalefac = s(r.SFBMAX), this.xrpow_max = 0, this.part2_3_length = 0, this.big_values = 0, this.count1 = 0, this.global_gain = 0, this.scalefac_compress = 0, this.block_type = 0, this.mixed_block_flag = 0, this.table_select = s(3), this.subblock_gain = s(4), this.region0_count = 0, this.region1_count = 0, this.preflag = 0, this.scalefac_scale = 0, this.count1table_select = 0, this.part2_length = 0, this.sfb_lmax = 0, this.sfb_smin = 0, this.psy_lmax = 0, this.sfbmax = 0, this.psymax = 0, this.sfbdivide = 0, this.width = s(r.SFBMAX), this.window = s(r.SFBMAX), this.count1bits = 0, this.sfb_partition_table = null, this.slen = s(4), this.max_nonzero_coeff = 0;
			var e = this;
			function t(e) {
				return new Int32Array(e);
			}
			this.assign = function(a) {
				var n;
				e.xr = (n = a.xr, new Float32Array(n)), e.l3_enc = t(a.l3_enc), e.scalefac = t(a.scalefac), e.xrpow_max = a.xrpow_max, e.part2_3_length = a.part2_3_length, e.big_values = a.big_values, e.count1 = a.count1, e.global_gain = a.global_gain, e.scalefac_compress = a.scalefac_compress, e.block_type = a.block_type, e.mixed_block_flag = a.mixed_block_flag, e.table_select = t(a.table_select), e.subblock_gain = t(a.subblock_gain), e.region0_count = a.region0_count, e.region1_count = a.region1_count, e.preflag = a.preflag, e.scalefac_scale = a.scalefac_scale, e.count1table_select = a.count1table_select, e.part2_length = a.part2_length, e.sfb_lmax = a.sfb_lmax, e.sfb_smin = a.sfb_smin, e.psy_lmax = a.psy_lmax, e.sfbmax = a.sfbmax, e.psymax = a.psymax, e.sfbdivide = a.sfbdivide, e.width = t(a.width), e.window = t(a.window), e.count1bits = a.count1bits, e.sfb_partition_table = a.sfb_partition_table.slice(0), e.slen = t(a.slen), e.max_nonzero_coeff = a.max_nonzero_coeff;
			};
		};
	}), R = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double, a.new_float, a.new_float_n;
		var n = a.new_int;
		a.new_int_n, a.assert;
		var s = S();
		t.exports = function() {
			this.tt = [[null, null], [null, null]], this.main_data_begin = 0, this.private_bits = 0, this.resvDrain_pre = 0, this.resvDrain_post = 0, this.scfsi = [n(4), n(4)];
			for (var e = 0; e < 2; e++) for (var t = 0; t < 2; t++) this.tt[e][t] = new s();
		};
	}), A = _((e, t) => {
		var a = h(), n = a.System;
		a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double, a.new_float, a.new_float_n;
		var s = a.new_int;
		a.new_int_n, a.assert;
		var r = m();
		t.exports = function(e, t, a, _) {
			this.l = s(1 + r.SBMAX_l), this.s = s(1 + r.SBMAX_s), this.psfb21 = s(1 + r.PSFB21), this.psfb12 = s(1 + r.PSFB12);
			var i = this.l, o = this.s;
			4 == arguments.length && (this.arrL = arguments[0], this.arrS = arguments[1], this.arr21 = arguments[2], this.arr12 = arguments[3], n.arraycopy(this.arrL, 0, i, 0, Math.min(this.arrL.length, this.l.length)), n.arraycopy(this.arrS, 0, o, 0, Math.min(this.arrS.length, this.s.length)), n.arraycopy(this.arr21, 0, this.psfb21, 0, Math.min(this.arr21.length, this.psfb21.length)), n.arraycopy(this.arr12, 0, this.psfb12, 0, Math.min(this.arr12.length, this.psfb12.length)));
		};
	}), M = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double;
		var n = a.new_float, s = a.new_float_n, r = a.new_int;
		a.new_int_n, a.assert;
		var _ = m();
		t.exports = function() {
			this.last_en_subshort = s([4, 9]), this.lastAttacks = r(4), this.pefirbuf = n(19), this.longfact = n(_.SBMAX_l), this.shortfact = n(_.SBMAX_s), this.attackthre = 0, this.attackthre_s = 0;
		};
	}), B = _((e, t) => {
		t.exports = function() {
			this.sum = 0, this.seen = 0, this.want = 0, this.pos = 0, this.size = 0, this.bag = null, this.nVbrNumFrames = 0, this.nBytesWritten = 0, this.TotalFrameSize = 0;
		};
	}), y = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n;
		var n = a.new_byte, s = a.new_double, r = a.new_float, _ = a.new_float_n, i = a.new_int, o = a.new_int_n;
		a.assert;
		var l = R(), f = A(), c = M(), b = B(), p = u(), d = m(), v = w();
		function g() {
			function e() {
				this.write_timing = 0, this.ptr = 0, this.buf = n(40);
			}
			this.Class_ID = 0, this.lame_encode_frame_init = 0, this.iteration_init_init = 0, this.fill_buffer_resample_init = 0, this.mfbuf = _([2, g.MFSIZE]), this.mode_gr = 0, this.channels_in = 0, this.channels_out = 0, this.resample_ratio = 0, this.mf_samples_to_encode = 0, this.mf_size = 0, this.VBR_min_bitrate = 0, this.VBR_max_bitrate = 0, this.bitrate_index = 0, this.samplerate_index = 0, this.mode_ext = 0, this.lowpass1 = 0, this.lowpass2 = 0, this.highpass1 = 0, this.highpass2 = 0, this.noise_shaping = 0, this.noise_shaping_amp = 0, this.substep_shaping = 0, this.psymodel = 0, this.noise_shaping_stop = 0, this.subblock_gain = 0, this.use_best_huffman = 0, this.full_outer_loop = 0, this.l3_side = new l(), this.ms_ratio = r(2), this.padding = 0, this.frac_SpF = 0, this.slot_lag = 0, this.tag_spec = null, this.nMusicCRC = 0, this.OldValue = i(2), this.CurrentStep = i(2), this.masking_lower = 0, this.bv_scf = i(576), this.pseudohalf = i(v.SFBMAX), this.sfb21_extra = !1, this.inbuf_old = new Array(2), this.blackfilt = new Array(2 * g.BPC + 1), this.itime = s(2), this.sideinfo_len = 0, this.sb_sample = _([
				2,
				2,
				18,
				d.SBLIMIT
			]), this.amp_filter = r(32), this.header = new Array(g.MAX_HEADER_BUF), this.h_ptr = 0, this.w_ptr = 0, this.ancillary_flag = 0, this.ResvSize = 0, this.ResvMax = 0, this.scalefac_band = new f(), this.minval_l = r(d.CBANDS), this.minval_s = r(d.CBANDS), this.nb_1 = _([4, d.CBANDS]), this.nb_2 = _([4, d.CBANDS]), this.nb_s1 = _([4, d.CBANDS]), this.nb_s2 = _([4, d.CBANDS]), this.s3_ss = null, this.s3_ll = null, this.decay = 0, this.thm = new Array(4), this.en = new Array(4), this.tot_ener = r(4), this.loudness_sq = _([2, 2]), this.loudness_sq_save = r(2), this.mld_l = r(d.SBMAX_l), this.mld_s = r(d.SBMAX_s), this.bm_l = i(d.SBMAX_l), this.bo_l = i(d.SBMAX_l), this.bm_s = i(d.SBMAX_s), this.bo_s = i(d.SBMAX_s), this.npart_l = 0, this.npart_s = 0, this.s3ind = o([d.CBANDS, 2]), this.s3ind_s = o([d.CBANDS, 2]), this.numlines_s = i(d.CBANDS), this.numlines_l = i(d.CBANDS), this.rnumlines_l = r(d.CBANDS), this.mld_cb_l = r(d.CBANDS), this.mld_cb_s = r(d.CBANDS), this.numlines_s_num1 = 0, this.numlines_l_num1 = 0, this.pe = r(4), this.ms_ratio_s_old = 0, this.ms_ratio_l_old = 0, this.ms_ener_ratio_old = 0, this.blocktype_old = i(2), this.nsPsy = new c(), this.VBR_seek_table = new b(), this.ATH = null, this.PSY = null, this.nogap_total = 0, this.nogap_current = 0, this.decode_on_the_fly = !0, this.findReplayGain = !0, this.findPeakSample = !0, this.PeakSample = 0, this.RadioGain = 0, this.AudiophileGain = 0, this.rgdata = null, this.noclipGainChange = 0, this.noclipScale = 0, this.bitrate_stereoMode_Hist = o([16, 5]), this.bitrate_blockType_Hist = o([16, 6]), this.pinfo = null, this.hip = null, this.in_buffer_nsamples = 0, this.in_buffer_0 = null, this.in_buffer_1 = null, this.iteration_loop = null;
			for (var t = 0; t < this.en.length; t++) this.en[t] = new p();
			for (t = 0; t < this.thm.length; t++) this.thm[t] = new p();
			for (t = 0; t < this.header.length; t++) this.header[t] = new e();
		}
		g.MFSIZE = 3456 + d.ENCDELAY - d.MDCTDELAY, g.MAX_HEADER_BUF = 256, g.MAX_BITS_PER_CHANNEL = 4095, g.MAX_BITS_PER_GRANULE = 7680, g.BPC = 320, t.exports = g;
	}), E = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double;
		var n = a.new_float;
		a.new_float_n, a.new_int, a.new_int_n, a.assert;
		var s = m();
		t.exports = function() {
			this.useAdjust = 0, this.aaSensitivityP = 0, this.adjust = 0, this.adjustLimit = 0, this.decay = 0, this.floor = 0, this.l = n(s.SBMAX_l), this.s = n(s.SBMAX_s), this.psfb21 = n(s.PSFB21), this.psfb12 = n(s.PSFB12), this.cb_l = n(s.CBANDS), this.cb_s = n(s.CBANDS), this.eql_w = n(s.BLKSIZE / 2);
		};
	}), T = _((e, t) => {
		var a = h(), n = a.System;
		a.VbrMode, a.Float, a.ShortBlock, a.Util;
		var s = a.Arrays;
		function r() {
			r.YULE_ORDER;
			r.MAX_SAMP_FREQ;
			var e = r.RMS_WINDOW_TIME_NUMERATOR, t = r.RMS_WINDOW_TIME_DENOMINATOR;
			r.MAX_SAMPLES_PER_WINDOW;
			var a = [
				[
					.038575994352,
					-3.84664617118067,
					-.02160367184185,
					7.81501653005538,
					-.00123395316851,
					-11.34170355132042,
					-9291677959e-14,
					13.05504219327545,
					-.01655260341619,
					-12.28759895145294,
					.02161526843274,
					9.4829380631979,
					-.02074045215285,
					-5.87257861775999,
					.00594298065125,
					2.75465861874613,
					.00306428023191,
					-.86984376593551,
					.00012025322027,
					.13919314567432,
					.00288463683916
				],
				[
					.0541865640643,
					-3.47845948550071,
					-.02911007808948,
					6.36317777566148,
					-.00848709379851,
					-8.54751527471874,
					-.00851165645469,
					9.4769360780128,
					-.00834990904936,
					-8.81498681370155,
					.02245293253339,
					6.85401540936998,
					-.02596338512915,
					-4.39470996079559,
					.01624864962975,
					2.19611684890774,
					-.00240879051584,
					-.75104302451432,
					.00674613682247,
					.13149317958808,
					-.00187763777362
				],
				[
					.15457299681924,
					-2.37898834973084,
					-.09331049056315,
					2.84868151156327,
					-.06247880153653,
					-2.64577170229825,
					.02163541888798,
					2.23697657451713,
					-.05588393329856,
					-1.67148153367602,
					.04781476674921,
					1.00595954808547,
					.00222312597743,
					-.45953458054983,
					.03174092540049,
					.16378164858596,
					-.01390589421898,
					-.05032077717131,
					.00651420667831,
					.0234789740702,
					-.00881362733839
				],
				[
					.30296907319327,
					-1.61273165137247,
					-.22613988682123,
					1.0797749225997,
					-.08587323730772,
					-.2565625775407,
					.03282930172664,
					-.1627671912044,
					-.00915702933434,
					-.22638893773906,
					-.02364141202522,
					.39120800788284,
					-.00584456039913,
					-.22138138954925,
					.06276101321749,
					.04500235387352,
					-828086748e-14,
					.02005851806501,
					.00205861885564,
					.00302439095741,
					-.02950134983287
				],
				[
					.33642304856132,
					-1.49858979367799,
					-.2557224142557,
					.87350271418188,
					-.11828570177555,
					.12205022308084,
					.11921148675203,
					-.80774944671438,
					-.07834489609479,
					.47854794562326,
					-.0046997791438,
					-.12453458140019,
					-.0058950022444,
					-.04067510197014,
					.05724228140351,
					.08333755284107,
					.00832043980773,
					-.04237348025746,
					-.0163538138454,
					.02977207319925,
					-.0176017656815
				],
				[
					.4491525660845,
					-.62820619233671,
					-.14351757464547,
					.29661783706366,
					-.22784394429749,
					-.372563729424,
					-.01419140100551,
					.00213767857124,
					.04078262797139,
					-.42029820170918,
					-.12398163381748,
					.22199650564824,
					.04097565135648,
					.00613424350682,
					.10478503600251,
					.06747620744683,
					-.01863887810927,
					.05784820375801,
					-.03193428438915,
					.03222754072173,
					.00541907748707
				],
				[
					.56619470757641,
					-1.04800335126349,
					-.75464456939302,
					.29156311971249,
					.1624213774223,
					-.26806001042947,
					.16744243493672,
					.00819999645858,
					-.18901604199609,
					.45054734505008,
					.3093178284183,
					-.33032403314006,
					-.27562961986224,
					.0673936833311,
					.00647310677246,
					-.04784254229033,
					.08647503780351,
					.01639907836189,
					-.0378898455484,
					.01807364323573,
					-.00588215443421
				],
				[
					.58100494960553,
					-.51035327095184,
					-.53174909058578,
					-.31863563325245,
					-.14289799034253,
					-.20256413484477,
					.17520704835522,
					.1472815413433,
					.02377945217615,
					.38952639978999,
					.15558449135573,
					-.23313271880868,
					-.25344790059353,
					-.05246019024463,
					.01628462406333,
					-.02505961724053,
					.06920467763959,
					.02442357316099,
					-.03721611395801,
					.01818801111503,
					-.00749618797172
				],
				[
					.53648789255105,
					-.2504987195602,
					-.42163034350696,
					-.43193942311114,
					-.00275953611929,
					-.03424681017675,
					.04267842219415,
					-.04678328784242,
					-.10214864179676,
					.26408300200955,
					.14590772289388,
					.15113130533216,
					-.02459864859345,
					-.17556493366449,
					-.11202315195388,
					-.18823009262115,
					-.04060034127,
					.05477720428674,
					.0478866554818,
					.0470440968812,
					-.02217936801134
				]
			], _ = [
				[
					.98621192462708,
					-1.97223372919527,
					-1.97242384925416,
					.97261396931306,
					.98621192462708
				],
				[
					.98500175787242,
					-1.96977855582618,
					-1.97000351574484,
					.9702284756635,
					.98500175787242
				],
				[
					.97938932735214,
					-1.95835380975398,
					-1.95877865470428,
					.95920349965459,
					.97938932735214
				],
				[
					.97531843204928,
					-1.95002759149878,
					-1.95063686409857,
					.95124613669835,
					.97531843204928
				],
				[
					.97316523498161,
					-1.94561023566527,
					-1.94633046996323,
					.94705070426118,
					.97316523498161
				],
				[
					.96454515552826,
					-1.92783286977036,
					-1.92909031105652,
					.93034775234268,
					.96454515552826
				],
				[
					.96009142950541,
					-1.91858953033784,
					-1.92018285901082,
					.92177618768381,
					.96009142950541
				],
				[
					.95856916599601,
					-1.9154210807478,
					-1.91713833199203,
					.91885558323625,
					.95856916599601
				],
				[
					.94597685600279,
					-1.88903307939452,
					-1.89195371200558,
					.89487434461664,
					.94597685600279
				]
			];
			function i(e, t, a, n, s, r) {
				for (; 0 != s--;) a[n] = 1e-10 + e[t + 0] * r[0] - a[n - 1] * r[1] + e[t - 1] * r[2] - a[n - 2] * r[3] + e[t - 2] * r[4] - a[n - 3] * r[5] + e[t - 3] * r[6] - a[n - 4] * r[7] + e[t - 4] * r[8] - a[n - 5] * r[9] + e[t - 5] * r[10] - a[n - 6] * r[11] + e[t - 6] * r[12] - a[n - 7] * r[13] + e[t - 7] * r[14] - a[n - 8] * r[15] + e[t - 8] * r[16] - a[n - 9] * r[17] + e[t - 9] * r[18] - a[n - 10] * r[19] + e[t - 10] * r[20], ++n, ++t;
			}
			function o(e, t, a, n, s, r) {
				for (; 0 != s--;) a[n] = e[t + 0] * r[0] - a[n - 1] * r[1] + e[t - 1] * r[2] - a[n - 2] * r[3] + e[t - 2] * r[4], ++n, ++t;
			}
			function l(e) {
				return e * e;
			}
			this.InitGainAnalysis = function(a, n) {
				return function(a, n) {
					for (var r = 0; r < MAX_ORDER; r++) a.linprebuf[r] = a.lstepbuf[r] = a.loutbuf[r] = a.rinprebuf[r] = a.rstepbuf[r] = a.routbuf[r] = 0;
					switch (0 | n) {
						case 48e3:
							a.reqindex = 0;
							break;
						case 44100:
							a.reqindex = 1;
							break;
						case 32e3:
							a.reqindex = 2;
							break;
						case 24e3:
							a.reqindex = 3;
							break;
						case 22050:
							a.reqindex = 4;
							break;
						case 16e3:
							a.reqindex = 5;
							break;
						case 12e3:
							a.reqindex = 6;
							break;
						case 11025:
							a.reqindex = 7;
							break;
						case 8e3:
							a.reqindex = 8;
							break;
						default: return INIT_GAIN_ANALYSIS_ERROR;
					}
					return a.sampleWindow = 0 | (n * e + t - 1) / t, a.lsum = 0, a.rsum = 0, a.totsamp = 0, s.ill(a.A, 0), INIT_GAIN_ANALYSIS_OK;
				}(a, n) != INIT_GAIN_ANALYSIS_OK ? INIT_GAIN_ANALYSIS_ERROR : (a.linpre = MAX_ORDER, a.rinpre = MAX_ORDER, a.lstep = MAX_ORDER, a.rstep = MAX_ORDER, a.lout = MAX_ORDER, a.rout = MAX_ORDER, s.fill(a.B, 0), INIT_GAIN_ANALYSIS_OK);
			}, this.AnalyzeSamples = function(e, t, s, f, h, c, u) {
				var b, p, m, d, v, g, w;
				if (0 == c) return GAIN_ANALYSIS_OK;
				switch (w = 0, v = c, u) {
					case 1:
						f = t, h = s;
						break;
					case 2: break;
					default: return GAIN_ANALYSIS_ERROR;
				}
				for (c < MAX_ORDER ? (n.arraycopy(t, s, e.linprebuf, MAX_ORDER, c), n.arraycopy(f, h, e.rinprebuf, MAX_ORDER, c)) : (n.arraycopy(t, s, e.linprebuf, MAX_ORDER, MAX_ORDER), n.arraycopy(f, h, e.rinprebuf, MAX_ORDER, MAX_ORDER)); v > 0;) {
					g = v > e.sampleWindow - e.totsamp ? e.sampleWindow - e.totsamp : v, w < MAX_ORDER ? (b = e.linpre + w, p = e.linprebuf, m = e.rinpre + w, d = e.rinprebuf, g > MAX_ORDER - w && (g = MAX_ORDER - w)) : (b = s + w, p = t, m = h + w, d = f), i(p, b, e.lstepbuf, e.lstep + e.totsamp, g, a[e.reqindex]), i(d, m, e.rstepbuf, e.rstep + e.totsamp, g, a[e.reqindex]), o(e.lstepbuf, e.lstep + e.totsamp, e.loutbuf, e.lout + e.totsamp, g, _[e.reqindex]), o(e.rstepbuf, e.rstep + e.totsamp, e.routbuf, e.rout + e.totsamp, g, _[e.reqindex]), b = e.lout + e.totsamp, p = e.loutbuf, m = e.rout + e.totsamp, d = e.routbuf;
					for (var S = g % 8; 0 != S--;) e.lsum += l(p[b++]), e.rsum += l(d[m++]);
					for (S = g / 8; 0 != S--;) e.lsum += l(p[b + 0]) + l(p[b + 1]) + l(p[b + 2]) + l(p[b + 3]) + l(p[b + 4]) + l(p[b + 5]) + l(p[b + 6]) + l(p[b + 7]), b += 8, e.rsum += l(d[m + 0]) + l(d[m + 1]) + l(d[m + 2]) + l(d[m + 3]) + l(d[m + 4]) + l(d[m + 5]) + l(d[m + 6]) + l(d[m + 7]), m += 8;
					if (v -= g, w += g, e.totsamp += g, e.totsamp == e.sampleWindow) {
						var R = 10 * r.STEPS_per_dB * Math.log10((e.lsum + e.rsum) / e.totsamp * .5 + 1e-37), A = R <= 0 ? 0 : 0 | R;
						A >= e.A.length && (A = e.A.length - 1), e.A[A]++, e.lsum = e.rsum = 0, n.arraycopy(e.loutbuf, e.totsamp, e.loutbuf, 0, MAX_ORDER), n.arraycopy(e.routbuf, e.totsamp, e.routbuf, 0, MAX_ORDER), n.arraycopy(e.lstepbuf, e.totsamp, e.lstepbuf, 0, MAX_ORDER), n.arraycopy(e.rstepbuf, e.totsamp, e.rstepbuf, 0, MAX_ORDER), e.totsamp = 0;
					}
					if (e.totsamp > e.sampleWindow) return GAIN_ANALYSIS_ERROR;
				}
				return c < MAX_ORDER ? (n.arraycopy(e.linprebuf, c, e.linprebuf, 0, MAX_ORDER - c), n.arraycopy(e.rinprebuf, c, e.rinprebuf, 0, MAX_ORDER - c), n.arraycopy(t, s, e.linprebuf, MAX_ORDER - c, c), n.arraycopy(f, h, e.rinprebuf, MAX_ORDER - c, c)) : (n.arraycopy(t, s + c - MAX_ORDER, e.linprebuf, 0, MAX_ORDER), n.arraycopy(f, h + c - MAX_ORDER, e.rinprebuf, 0, MAX_ORDER)), GAIN_ANALYSIS_OK;
			}, this.GetTitleGain = function(e) {
				for (var t = function(e, t) {
					var a, n = 0;
					for (a = 0; a < t; a++) n += e[a];
					if (0 == n) return GAIN_NOT_ENOUGH_SAMPLES;
					var s = 0 | Math.ceil(n * .050000000000000044);
					for (a = t; a-- > 0 && !((s -= e[a]) <= 0););
					return 64.82 - a / r.STEPS_per_dB;
				}(e.A, e.A.length), a = 0; a < e.A.length; a++) e.B[a] += e.A[a], e.A[a] = 0;
				for (a = 0; a < MAX_ORDER; a++) e.linprebuf[a] = e.lstepbuf[a] = e.loutbuf[a] = e.rinprebuf[a] = e.rstepbuf[a] = e.routbuf[a] = 0;
				return e.totsamp = 0, e.lsum = e.rsum = 0, t;
			};
		}
		a.new_array_n, a.new_byte, a.new_double, a.new_float, a.new_float_n, a.new_int, a.new_int_n, a.assert, r.STEPS_per_dB = 100, r.MAX_dB = 120, r.GAIN_NOT_ENOUGH_SAMPLES = -24601, r.GAIN_ANALYSIS_ERROR = 0, r.GAIN_ANALYSIS_OK = 1, r.INIT_GAIN_ANALYSIS_ERROR = 0, r.INIT_GAIN_ANALYSIS_OK = 1, r.YULE_ORDER = 10, r.MAX_ORDER = r.YULE_ORDER, r.MAX_SAMP_FREQ = 48e3, r.RMS_WINDOW_TIME_NUMERATOR = 1, r.RMS_WINDOW_TIME_DENOMINATOR = 20, r.MAX_SAMPLES_PER_WINDOW = r.MAX_SAMP_FREQ * r.RMS_WINDOW_TIME_NUMERATOR / r.RMS_WINDOW_TIME_DENOMINATOR + 1, t.exports = r;
	}), k = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double;
		var n = a.new_float;
		a.new_float_n;
		var s = a.new_int;
		a.new_int_n, a.assert;
		var r = T();
		t.exports = function() {
			this.linprebuf = n(2 * r.MAX_ORDER), this.linpre = 0, this.lstepbuf = n(r.MAX_SAMPLES_PER_WINDOW + r.MAX_ORDER), this.lstep = 0, this.loutbuf = n(r.MAX_SAMPLES_PER_WINDOW + r.MAX_ORDER), this.lout = 0, this.rinprebuf = n(2 * r.MAX_ORDER), this.rinpre = 0, this.rstepbuf = n(r.MAX_SAMPLES_PER_WINDOW + r.MAX_ORDER), this.rstep = 0, this.routbuf = n(r.MAX_SAMPLES_PER_WINDOW + r.MAX_ORDER), this.rout = 0, this.sampleWindow = 0, this.totsamp = 0, this.lsum = 0, this.rsum = 0, this.freqindex = 0, this.first = 0, this.A = s(0 | r.STEPS_per_dB * r.MAX_dB), this.B = s(0 | r.STEPS_per_dB * r.MAX_dB);
		};
	}), x = _((e, t) => {
		t.exports = function(e) {
			this.bits = e;
		};
	}), P = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double;
		var n = a.new_float;
		a.new_float_n;
		var s = a.new_int;
		a.new_int_n;
		var r = a.assert, _ = x(), i = m(), o = w(), l = y();
		t.exports = function(e) {
			this.quantize = e, this.iteration_loop = function(e, t, a, f) {
				var h, c = e.internal_flags, u = n(o.SFBMAX), b = n(576), p = s(2), m = 0, d = c.l3_side, v = new _(m);
				this.quantize.rv.ResvFrameBegin(e, v), m = v.bits;
				for (var g = 0; g < c.mode_gr; g++) {
					h = this.quantize.qupvt.on_pe(e, t, p, m, g, g), c.mode_ext == i.MPG_MD_MS_LR && (this.quantize.ms_convert(c.l3_side, g), this.quantize.qupvt.reduce_side(p, a[g], m, h));
					for (var w = 0; w < c.channels_out; w++) {
						var S, R, A = d.tt[g][w];
						A.block_type != i.SHORT_TYPE ? (S = 0, R = c.PSY.mask_adjust - S) : (S = 0, R = c.PSY.mask_adjust_short - S), c.masking_lower = Math.pow(10, .1 * R), this.quantize.init_outer_loop(c, A), this.quantize.init_xrpow(c, A, b) && (this.quantize.qupvt.calc_xmin(e, f[g][w], A, u), this.quantize.outer_loop(e, A, u, b, w, p[w])), this.quantize.iteration_finish_one(c, g, w), r(A.part2_3_length <= l.MAX_BITS_PER_CHANNEL), r(A.part2_3_length <= p[w]);
					}
				}
				this.quantize.rv.ResvFrameEnd(c, m);
			};
		};
	}), I = _((e, t) => {
		function a(e, t, a, n) {
			this.xlen = e, this.linmax = t, this.table = a, this.hlen = n;
		}
		var n = {
			t1HB: [
				1,
				1,
				1,
				0
			],
			t2HB: [
				1,
				2,
				1,
				3,
				1,
				1,
				3,
				2,
				0
			],
			t3HB: [
				3,
				2,
				1,
				1,
				1,
				1,
				3,
				2,
				0
			],
			t5HB: [
				1,
				2,
				6,
				5,
				3,
				1,
				4,
				4,
				7,
				5,
				7,
				1,
				6,
				1,
				1,
				0
			],
			t6HB: [
				7,
				3,
				5,
				1,
				6,
				2,
				3,
				2,
				5,
				4,
				4,
				1,
				3,
				3,
				2,
				0
			],
			t7HB: [
				1,
				2,
				10,
				19,
				16,
				10,
				3,
				3,
				7,
				10,
				5,
				3,
				11,
				4,
				13,
				17,
				8,
				4,
				12,
				11,
				18,
				15,
				11,
				2,
				7,
				6,
				9,
				14,
				3,
				1,
				6,
				4,
				5,
				3,
				2,
				0
			],
			t8HB: [
				3,
				4,
				6,
				18,
				12,
				5,
				5,
				1,
				2,
				16,
				9,
				3,
				7,
				3,
				5,
				14,
				7,
				3,
				19,
				17,
				15,
				13,
				10,
				4,
				13,
				5,
				8,
				11,
				5,
				1,
				12,
				4,
				4,
				1,
				1,
				0
			],
			t9HB: [
				7,
				5,
				9,
				14,
				15,
				7,
				6,
				4,
				5,
				5,
				6,
				7,
				7,
				6,
				8,
				8,
				8,
				5,
				15,
				6,
				9,
				10,
				5,
				1,
				11,
				7,
				9,
				6,
				4,
				1,
				14,
				4,
				6,
				2,
				6,
				0
			],
			t10HB: [
				1,
				2,
				10,
				23,
				35,
				30,
				12,
				17,
				3,
				3,
				8,
				12,
				18,
				21,
				12,
				7,
				11,
				9,
				15,
				21,
				32,
				40,
				19,
				6,
				14,
				13,
				22,
				34,
				46,
				23,
				18,
				7,
				20,
				19,
				33,
				47,
				27,
				22,
				9,
				3,
				31,
				22,
				41,
				26,
				21,
				20,
				5,
				3,
				14,
				13,
				10,
				11,
				16,
				6,
				5,
				1,
				9,
				8,
				7,
				8,
				4,
				4,
				2,
				0
			],
			t11HB: [
				3,
				4,
				10,
				24,
				34,
				33,
				21,
				15,
				5,
				3,
				4,
				10,
				32,
				17,
				11,
				10,
				11,
				7,
				13,
				18,
				30,
				31,
				20,
				5,
				25,
				11,
				19,
				59,
				27,
				18,
				12,
				5,
				35,
				33,
				31,
				58,
				30,
				16,
				7,
				5,
				28,
				26,
				32,
				19,
				17,
				15,
				8,
				14,
				14,
				12,
				9,
				13,
				14,
				9,
				4,
				1,
				11,
				4,
				6,
				6,
				6,
				3,
				2,
				0
			],
			t12HB: [
				9,
				6,
				16,
				33,
				41,
				39,
				38,
				26,
				7,
				5,
				6,
				9,
				23,
				16,
				26,
				11,
				17,
				7,
				11,
				14,
				21,
				30,
				10,
				7,
				17,
				10,
				15,
				12,
				18,
				28,
				14,
				5,
				32,
				13,
				22,
				19,
				18,
				16,
				9,
				5,
				40,
				17,
				31,
				29,
				17,
				13,
				4,
				2,
				27,
				12,
				11,
				15,
				10,
				7,
				4,
				1,
				27,
				12,
				8,
				12,
				6,
				3,
				1,
				0
			],
			t13HB: [
				1,
				5,
				14,
				21,
				34,
				51,
				46,
				71,
				42,
				52,
				68,
				52,
				67,
				44,
				43,
				19,
				3,
				4,
				12,
				19,
				31,
				26,
				44,
				33,
				31,
				24,
				32,
				24,
				31,
				35,
				22,
				14,
				15,
				13,
				23,
				36,
				59,
				49,
				77,
				65,
				29,
				40,
				30,
				40,
				27,
				33,
				42,
				16,
				22,
				20,
				37,
				61,
				56,
				79,
				73,
				64,
				43,
				76,
				56,
				37,
				26,
				31,
				25,
				14,
				35,
				16,
				60,
				57,
				97,
				75,
				114,
				91,
				54,
				73,
				55,
				41,
				48,
				53,
				23,
				24,
				58,
				27,
				50,
				96,
				76,
				70,
				93,
				84,
				77,
				58,
				79,
				29,
				74,
				49,
				41,
				17,
				47,
				45,
				78,
				74,
				115,
				94,
				90,
				79,
				69,
				83,
				71,
				50,
				59,
				38,
				36,
				15,
				72,
				34,
				56,
				95,
				92,
				85,
				91,
				90,
				86,
				73,
				77,
				65,
				51,
				44,
				43,
				42,
				43,
				20,
				30,
				44,
				55,
				78,
				72,
				87,
				78,
				61,
				46,
				54,
				37,
				30,
				20,
				16,
				53,
				25,
				41,
				37,
				44,
				59,
				54,
				81,
				66,
				76,
				57,
				54,
				37,
				18,
				39,
				11,
				35,
				33,
				31,
				57,
				42,
				82,
				72,
				80,
				47,
				58,
				55,
				21,
				22,
				26,
				38,
				22,
				53,
				25,
				23,
				38,
				70,
				60,
				51,
				36,
				55,
				26,
				34,
				23,
				27,
				14,
				9,
				7,
				34,
				32,
				28,
				39,
				49,
				75,
				30,
				52,
				48,
				40,
				52,
				28,
				18,
				17,
				9,
				5,
				45,
				21,
				34,
				64,
				56,
				50,
				49,
				45,
				31,
				19,
				12,
				15,
				10,
				7,
				6,
				3,
				48,
				23,
				20,
				39,
				36,
				35,
				53,
				21,
				16,
				23,
				13,
				10,
				6,
				1,
				4,
				2,
				16,
				15,
				17,
				27,
				25,
				20,
				29,
				11,
				17,
				12,
				16,
				8,
				1,
				1,
				0,
				1
			],
			t15HB: [
				7,
				12,
				18,
				53,
				47,
				76,
				124,
				108,
				89,
				123,
				108,
				119,
				107,
				81,
				122,
				63,
				13,
				5,
				16,
				27,
				46,
				36,
				61,
				51,
				42,
				70,
				52,
				83,
				65,
				41,
				59,
				36,
				19,
				17,
				15,
				24,
				41,
				34,
				59,
				48,
				40,
				64,
				50,
				78,
				62,
				80,
				56,
				33,
				29,
				28,
				25,
				43,
				39,
				63,
				55,
				93,
				76,
				59,
				93,
				72,
				54,
				75,
				50,
				29,
				52,
				22,
				42,
				40,
				67,
				57,
				95,
				79,
				72,
				57,
				89,
				69,
				49,
				66,
				46,
				27,
				77,
				37,
				35,
				66,
				58,
				52,
				91,
				74,
				62,
				48,
				79,
				63,
				90,
				62,
				40,
				38,
				125,
				32,
				60,
				56,
				50,
				92,
				78,
				65,
				55,
				87,
				71,
				51,
				73,
				51,
				70,
				30,
				109,
				53,
				49,
				94,
				88,
				75,
				66,
				122,
				91,
				73,
				56,
				42,
				64,
				44,
				21,
				25,
				90,
				43,
				41,
				77,
				73,
				63,
				56,
				92,
				77,
				66,
				47,
				67,
				48,
				53,
				36,
				20,
				71,
				34,
				67,
				60,
				58,
				49,
				88,
				76,
				67,
				106,
				71,
				54,
				38,
				39,
				23,
				15,
				109,
				53,
				51,
				47,
				90,
				82,
				58,
				57,
				48,
				72,
				57,
				41,
				23,
				27,
				62,
				9,
				86,
				42,
				40,
				37,
				70,
				64,
				52,
				43,
				70,
				55,
				42,
				25,
				29,
				18,
				11,
				11,
				118,
				68,
				30,
				55,
				50,
				46,
				74,
				65,
				49,
				39,
				24,
				16,
				22,
				13,
				14,
				7,
				91,
				44,
				39,
				38,
				34,
				63,
				52,
				45,
				31,
				52,
				28,
				19,
				14,
				8,
				9,
				3,
				123,
				60,
				58,
				53,
				47,
				43,
				32,
				22,
				37,
				24,
				17,
				12,
				15,
				10,
				2,
				1,
				71,
				37,
				34,
				30,
				28,
				20,
				17,
				26,
				21,
				16,
				10,
				6,
				8,
				6,
				2,
				0
			],
			t16HB: [
				1,
				5,
				14,
				44,
				74,
				63,
				110,
				93,
				172,
				149,
				138,
				242,
				225,
				195,
				376,
				17,
				3,
				4,
				12,
				20,
				35,
				62,
				53,
				47,
				83,
				75,
				68,
				119,
				201,
				107,
				207,
				9,
				15,
				13,
				23,
				38,
				67,
				58,
				103,
				90,
				161,
				72,
				127,
				117,
				110,
				209,
				206,
				16,
				45,
				21,
				39,
				69,
				64,
				114,
				99,
				87,
				158,
				140,
				252,
				212,
				199,
				387,
				365,
				26,
				75,
				36,
				68,
				65,
				115,
				101,
				179,
				164,
				155,
				264,
				246,
				226,
				395,
				382,
				362,
				9,
				66,
				30,
				59,
				56,
				102,
				185,
				173,
				265,
				142,
				253,
				232,
				400,
				388,
				378,
				445,
				16,
				111,
				54,
				52,
				100,
				184,
				178,
				160,
				133,
				257,
				244,
				228,
				217,
				385,
				366,
				715,
				10,
				98,
				48,
				91,
				88,
				165,
				157,
				148,
				261,
				248,
				407,
				397,
				372,
				380,
				889,
				884,
				8,
				85,
				84,
				81,
				159,
				156,
				143,
				260,
				249,
				427,
				401,
				392,
				383,
				727,
				713,
				708,
				7,
				154,
				76,
				73,
				141,
				131,
				256,
				245,
				426,
				406,
				394,
				384,
				735,
				359,
				710,
				352,
				11,
				139,
				129,
				67,
				125,
				247,
				233,
				229,
				219,
				393,
				743,
				737,
				720,
				885,
				882,
				439,
				4,
				243,
				120,
				118,
				115,
				227,
				223,
				396,
				746,
				742,
				736,
				721,
				712,
				706,
				223,
				436,
				6,
				202,
				224,
				222,
				218,
				216,
				389,
				386,
				381,
				364,
				888,
				443,
				707,
				440,
				437,
				1728,
				4,
				747,
				211,
				210,
				208,
				370,
				379,
				734,
				723,
				714,
				1735,
				883,
				877,
				876,
				3459,
				865,
				2,
				377,
				369,
				102,
				187,
				726,
				722,
				358,
				711,
				709,
				866,
				1734,
				871,
				3458,
				870,
				434,
				0,
				12,
				10,
				7,
				11,
				10,
				17,
				11,
				9,
				13,
				12,
				10,
				7,
				5,
				3,
				1,
				3
			],
			t24HB: [
				15,
				13,
				46,
				80,
				146,
				262,
				248,
				434,
				426,
				669,
				653,
				649,
				621,
				517,
				1032,
				88,
				14,
				12,
				21,
				38,
				71,
				130,
				122,
				216,
				209,
				198,
				327,
				345,
				319,
				297,
				279,
				42,
				47,
				22,
				41,
				74,
				68,
				128,
				120,
				221,
				207,
				194,
				182,
				340,
				315,
				295,
				541,
				18,
				81,
				39,
				75,
				70,
				134,
				125,
				116,
				220,
				204,
				190,
				178,
				325,
				311,
				293,
				271,
				16,
				147,
				72,
				69,
				135,
				127,
				118,
				112,
				210,
				200,
				188,
				352,
				323,
				306,
				285,
				540,
				14,
				263,
				66,
				129,
				126,
				119,
				114,
				214,
				202,
				192,
				180,
				341,
				317,
				301,
				281,
				262,
				12,
				249,
				123,
				121,
				117,
				113,
				215,
				206,
				195,
				185,
				347,
				330,
				308,
				291,
				272,
				520,
				10,
				435,
				115,
				111,
				109,
				211,
				203,
				196,
				187,
				353,
				332,
				313,
				298,
				283,
				531,
				381,
				17,
				427,
				212,
				208,
				205,
				201,
				193,
				186,
				177,
				169,
				320,
				303,
				286,
				268,
				514,
				377,
				16,
				335,
				199,
				197,
				191,
				189,
				181,
				174,
				333,
				321,
				305,
				289,
				275,
				521,
				379,
				371,
				11,
				668,
				184,
				183,
				179,
				175,
				344,
				331,
				314,
				304,
				290,
				277,
				530,
				383,
				373,
				366,
				10,
				652,
				346,
				171,
				168,
				164,
				318,
				309,
				299,
				287,
				276,
				263,
				513,
				375,
				368,
				362,
				6,
				648,
				322,
				316,
				312,
				307,
				302,
				292,
				284,
				269,
				261,
				512,
				376,
				370,
				364,
				359,
				4,
				620,
				300,
				296,
				294,
				288,
				282,
				273,
				266,
				515,
				380,
				374,
				369,
				365,
				361,
				357,
				2,
				1033,
				280,
				278,
				274,
				267,
				264,
				259,
				382,
				378,
				372,
				367,
				363,
				360,
				358,
				356,
				0,
				43,
				20,
				19,
				17,
				15,
				13,
				11,
				9,
				7,
				6,
				4,
				7,
				5,
				3,
				1,
				3
			],
			t32HB: [
				1,
				10,
				8,
				20,
				12,
				20,
				16,
				32,
				14,
				12,
				24,
				0,
				28,
				16,
				24,
				16
			],
			t33HB: [
				15,
				28,
				26,
				48,
				22,
				40,
				36,
				64,
				14,
				24,
				20,
				32,
				12,
				16,
				8,
				0
			],
			t1l: [
				1,
				4,
				3,
				5
			],
			t2l: [
				1,
				4,
				7,
				4,
				5,
				7,
				6,
				7,
				8
			],
			t3l: [
				2,
				3,
				7,
				4,
				4,
				7,
				6,
				7,
				8
			],
			t5l: [
				1,
				4,
				7,
				8,
				4,
				5,
				8,
				9,
				7,
				8,
				9,
				10,
				8,
				8,
				9,
				10
			],
			t6l: [
				3,
				4,
				6,
				8,
				4,
				4,
				6,
				7,
				5,
				6,
				7,
				8,
				7,
				7,
				8,
				9
			],
			t7l: [
				1,
				4,
				7,
				9,
				9,
				10,
				4,
				6,
				8,
				9,
				9,
				10,
				7,
				7,
				9,
				10,
				10,
				11,
				8,
				9,
				10,
				11,
				11,
				11,
				8,
				9,
				10,
				11,
				11,
				12,
				9,
				10,
				11,
				12,
				12,
				12
			],
			t8l: [
				2,
				4,
				7,
				9,
				9,
				10,
				4,
				4,
				6,
				10,
				10,
				10,
				7,
				6,
				8,
				10,
				10,
				11,
				9,
				10,
				10,
				11,
				11,
				12,
				9,
				9,
				10,
				11,
				12,
				12,
				10,
				10,
				11,
				11,
				13,
				13
			],
			t9l: [
				3,
				4,
				6,
				7,
				9,
				10,
				4,
				5,
				6,
				7,
				8,
				10,
				5,
				6,
				7,
				8,
				9,
				10,
				7,
				7,
				8,
				9,
				9,
				10,
				8,
				8,
				9,
				9,
				10,
				11,
				9,
				9,
				10,
				10,
				11,
				11
			],
			t10l: [
				1,
				4,
				7,
				9,
				10,
				10,
				10,
				11,
				4,
				6,
				8,
				9,
				10,
				11,
				10,
				10,
				7,
				8,
				9,
				10,
				11,
				12,
				11,
				11,
				8,
				9,
				10,
				11,
				12,
				12,
				11,
				12,
				9,
				10,
				11,
				12,
				12,
				12,
				12,
				12,
				10,
				11,
				12,
				12,
				13,
				13,
				12,
				13,
				9,
				10,
				11,
				12,
				12,
				12,
				13,
				13,
				10,
				10,
				11,
				12,
				12,
				13,
				13,
				13
			],
			t11l: [
				2,
				4,
				6,
				8,
				9,
				10,
				9,
				10,
				4,
				5,
				6,
				8,
				10,
				10,
				9,
				10,
				6,
				7,
				8,
				9,
				10,
				11,
				10,
				10,
				8,
				8,
				9,
				11,
				10,
				12,
				10,
				11,
				9,
				10,
				10,
				11,
				11,
				12,
				11,
				12,
				9,
				10,
				11,
				12,
				12,
				13,
				12,
				13,
				9,
				9,
				9,
				10,
				11,
				12,
				12,
				12,
				9,
				9,
				10,
				11,
				12,
				12,
				12,
				12
			],
			t12l: [
				4,
				4,
				6,
				8,
				9,
				10,
				10,
				10,
				4,
				5,
				6,
				7,
				9,
				9,
				10,
				10,
				6,
				6,
				7,
				8,
				9,
				10,
				9,
				10,
				7,
				7,
				8,
				8,
				9,
				10,
				10,
				10,
				8,
				8,
				9,
				9,
				10,
				10,
				10,
				11,
				9,
				9,
				10,
				10,
				10,
				11,
				10,
				11,
				9,
				9,
				9,
				10,
				10,
				11,
				11,
				12,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12
			],
			t13l: [
				1,
				5,
				7,
				8,
				9,
				10,
				10,
				11,
				10,
				11,
				12,
				12,
				13,
				13,
				14,
				14,
				4,
				6,
				8,
				9,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				13,
				14,
				14,
				14,
				7,
				8,
				9,
				10,
				11,
				11,
				12,
				12,
				11,
				12,
				12,
				13,
				13,
				14,
				15,
				15,
				8,
				9,
				10,
				11,
				11,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				14,
				15,
				15,
				9,
				9,
				11,
				11,
				12,
				12,
				13,
				13,
				12,
				13,
				13,
				14,
				14,
				15,
				15,
				16,
				10,
				10,
				11,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				14,
				13,
				15,
				15,
				16,
				16,
				10,
				11,
				12,
				12,
				13,
				13,
				13,
				13,
				13,
				14,
				14,
				14,
				15,
				15,
				16,
				16,
				11,
				11,
				12,
				13,
				13,
				13,
				14,
				14,
				14,
				14,
				15,
				15,
				15,
				16,
				18,
				18,
				10,
				10,
				11,
				12,
				12,
				13,
				13,
				14,
				14,
				14,
				14,
				15,
				15,
				16,
				17,
				17,
				11,
				11,
				12,
				12,
				13,
				13,
				13,
				15,
				14,
				15,
				15,
				16,
				16,
				16,
				18,
				17,
				11,
				12,
				12,
				13,
				13,
				14,
				14,
				15,
				14,
				15,
				16,
				15,
				16,
				17,
				18,
				19,
				12,
				12,
				12,
				13,
				14,
				14,
				14,
				14,
				15,
				15,
				15,
				16,
				17,
				17,
				17,
				18,
				12,
				13,
				13,
				14,
				14,
				15,
				14,
				15,
				16,
				16,
				17,
				17,
				17,
				18,
				18,
				18,
				13,
				13,
				14,
				15,
				15,
				15,
				16,
				16,
				16,
				16,
				16,
				17,
				18,
				17,
				18,
				18,
				14,
				14,
				14,
				15,
				15,
				15,
				17,
				16,
				16,
				19,
				17,
				17,
				17,
				19,
				18,
				18,
				13,
				14,
				15,
				16,
				16,
				16,
				17,
				16,
				17,
				17,
				18,
				18,
				21,
				20,
				21,
				18
			],
			t15l: [
				3,
				5,
				6,
				8,
				8,
				9,
				10,
				10,
				10,
				11,
				11,
				12,
				12,
				12,
				13,
				14,
				5,
				5,
				7,
				8,
				9,
				9,
				10,
				10,
				10,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				6,
				7,
				7,
				8,
				9,
				9,
				10,
				10,
				10,
				11,
				11,
				12,
				12,
				13,
				13,
				13,
				7,
				8,
				8,
				9,
				9,
				10,
				10,
				11,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				13,
				8,
				8,
				9,
				9,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				13,
				9,
				9,
				9,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				13,
				13,
				13,
				14,
				10,
				9,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				14,
				14,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				14,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				13,
				13,
				14,
				14,
				14,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				14,
				14,
				14,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				14,
				15,
				14,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				14,
				14,
				14,
				15,
				12,
				12,
				11,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				13,
				13,
				14,
				14,
				15,
				15,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				14,
				14,
				14,
				14,
				14,
				15,
				15,
				13,
				13,
				13,
				13,
				13,
				13,
				13,
				13,
				14,
				14,
				14,
				14,
				15,
				15,
				14,
				15,
				13,
				13,
				13,
				13,
				13,
				13,
				13,
				14,
				14,
				14,
				14,
				14,
				15,
				15,
				15,
				15
			],
			t16_5l: [
				1,
				5,
				7,
				9,
				10,
				10,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				13,
				14,
				11,
				4,
				6,
				8,
				9,
				10,
				11,
				11,
				11,
				12,
				12,
				12,
				13,
				14,
				13,
				14,
				11,
				7,
				8,
				9,
				10,
				11,
				11,
				12,
				12,
				13,
				12,
				13,
				13,
				13,
				14,
				14,
				12,
				9,
				9,
				10,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				14,
				14,
				14,
				15,
				15,
				13,
				10,
				10,
				11,
				11,
				12,
				12,
				13,
				13,
				13,
				14,
				14,
				14,
				15,
				15,
				15,
				12,
				10,
				10,
				11,
				11,
				12,
				13,
				13,
				14,
				13,
				14,
				14,
				15,
				15,
				15,
				16,
				13,
				11,
				11,
				11,
				12,
				13,
				13,
				13,
				13,
				14,
				14,
				14,
				14,
				15,
				15,
				16,
				13,
				11,
				11,
				12,
				12,
				13,
				13,
				13,
				14,
				14,
				15,
				15,
				15,
				15,
				17,
				17,
				13,
				11,
				12,
				12,
				13,
				13,
				13,
				14,
				14,
				15,
				15,
				15,
				15,
				16,
				16,
				16,
				13,
				12,
				12,
				12,
				13,
				13,
				14,
				14,
				15,
				15,
				15,
				15,
				16,
				15,
				16,
				15,
				14,
				12,
				13,
				12,
				13,
				14,
				14,
				14,
				14,
				15,
				16,
				16,
				16,
				17,
				17,
				16,
				13,
				13,
				13,
				13,
				13,
				14,
				14,
				15,
				16,
				16,
				16,
				16,
				16,
				16,
				15,
				16,
				14,
				13,
				14,
				14,
				14,
				14,
				15,
				15,
				15,
				15,
				17,
				16,
				16,
				16,
				16,
				18,
				14,
				15,
				14,
				14,
				14,
				15,
				15,
				16,
				16,
				16,
				18,
				17,
				17,
				17,
				19,
				17,
				14,
				14,
				15,
				13,
				14,
				16,
				16,
				15,
				16,
				16,
				17,
				18,
				17,
				19,
				17,
				16,
				14,
				11,
				11,
				11,
				12,
				12,
				13,
				13,
				13,
				14,
				14,
				14,
				14,
				14,
				14,
				14,
				12
			],
			t16l: [
				1,
				5,
				7,
				9,
				10,
				10,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				13,
				14,
				10,
				4,
				6,
				8,
				9,
				10,
				11,
				11,
				11,
				12,
				12,
				12,
				13,
				14,
				13,
				14,
				10,
				7,
				8,
				9,
				10,
				11,
				11,
				12,
				12,
				13,
				12,
				13,
				13,
				13,
				14,
				14,
				11,
				9,
				9,
				10,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				14,
				14,
				14,
				15,
				15,
				12,
				10,
				10,
				11,
				11,
				12,
				12,
				13,
				13,
				13,
				14,
				14,
				14,
				15,
				15,
				15,
				11,
				10,
				10,
				11,
				11,
				12,
				13,
				13,
				14,
				13,
				14,
				14,
				15,
				15,
				15,
				16,
				12,
				11,
				11,
				11,
				12,
				13,
				13,
				13,
				13,
				14,
				14,
				14,
				14,
				15,
				15,
				16,
				12,
				11,
				11,
				12,
				12,
				13,
				13,
				13,
				14,
				14,
				15,
				15,
				15,
				15,
				17,
				17,
				12,
				11,
				12,
				12,
				13,
				13,
				13,
				14,
				14,
				15,
				15,
				15,
				15,
				16,
				16,
				16,
				12,
				12,
				12,
				12,
				13,
				13,
				14,
				14,
				15,
				15,
				15,
				15,
				16,
				15,
				16,
				15,
				13,
				12,
				13,
				12,
				13,
				14,
				14,
				14,
				14,
				15,
				16,
				16,
				16,
				17,
				17,
				16,
				12,
				13,
				13,
				13,
				13,
				14,
				14,
				15,
				16,
				16,
				16,
				16,
				16,
				16,
				15,
				16,
				13,
				13,
				14,
				14,
				14,
				14,
				15,
				15,
				15,
				15,
				17,
				16,
				16,
				16,
				16,
				18,
				13,
				15,
				14,
				14,
				14,
				15,
				15,
				16,
				16,
				16,
				18,
				17,
				17,
				17,
				19,
				17,
				13,
				14,
				15,
				13,
				14,
				16,
				16,
				15,
				16,
				16,
				17,
				18,
				17,
				19,
				17,
				16,
				13,
				10,
				10,
				10,
				11,
				11,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				13,
				13,
				13,
				10
			],
			t24l: [
				4,
				5,
				7,
				8,
				9,
				10,
				10,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				13,
				10,
				5,
				6,
				7,
				8,
				9,
				10,
				10,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				10,
				7,
				7,
				8,
				9,
				9,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				13,
				9,
				8,
				8,
				9,
				9,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				9,
				9,
				9,
				9,
				10,
				10,
				10,
				10,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				13,
				9,
				10,
				9,
				10,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				9,
				10,
				10,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				13,
				9,
				11,
				10,
				10,
				10,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				10,
				11,
				11,
				11,
				11,
				11,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				13,
				13,
				10,
				11,
				11,
				11,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				10,
				12,
				11,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				10,
				12,
				12,
				11,
				11,
				11,
				12,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				10,
				12,
				12,
				12,
				12,
				12,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				13,
				10,
				12,
				12,
				12,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				13,
				13,
				13,
				10,
				13,
				12,
				12,
				12,
				12,
				12,
				12,
				13,
				13,
				13,
				13,
				13,
				13,
				13,
				13,
				10,
				9,
				9,
				9,
				9,
				9,
				9,
				9,
				9,
				9,
				9,
				9,
				10,
				10,
				10,
				10,
				6
			],
			t32l: [
				1,
				5,
				5,
				7,
				5,
				8,
				7,
				9,
				5,
				7,
				7,
				9,
				7,
				9,
				9,
				10
			],
			t33l: [
				4,
				5,
				5,
				6,
				5,
				6,
				6,
				7,
				5,
				6,
				6,
				7,
				6,
				7,
				7,
				8
			]
		};
		n.ht = [
			new a(0, 0, null, null),
			new a(2, 0, n.t1HB, n.t1l),
			new a(3, 0, n.t2HB, n.t2l),
			new a(3, 0, n.t3HB, n.t3l),
			new a(0, 0, null, null),
			new a(4, 0, n.t5HB, n.t5l),
			new a(4, 0, n.t6HB, n.t6l),
			new a(6, 0, n.t7HB, n.t7l),
			new a(6, 0, n.t8HB, n.t8l),
			new a(6, 0, n.t9HB, n.t9l),
			new a(8, 0, n.t10HB, n.t10l),
			new a(8, 0, n.t11HB, n.t11l),
			new a(8, 0, n.t12HB, n.t12l),
			new a(16, 0, n.t13HB, n.t13l),
			new a(0, 0, null, n.t16_5l),
			new a(16, 0, n.t15HB, n.t15l),
			new a(1, 1, n.t16HB, n.t16l),
			new a(2, 3, n.t16HB, n.t16l),
			new a(3, 7, n.t16HB, n.t16l),
			new a(4, 15, n.t16HB, n.t16l),
			new a(6, 63, n.t16HB, n.t16l),
			new a(8, 255, n.t16HB, n.t16l),
			new a(10, 1023, n.t16HB, n.t16l),
			new a(13, 8191, n.t16HB, n.t16l),
			new a(4, 15, n.t24HB, n.t24l),
			new a(5, 31, n.t24HB, n.t24l),
			new a(6, 63, n.t24HB, n.t24l),
			new a(7, 127, n.t24HB, n.t24l),
			new a(8, 255, n.t24HB, n.t24l),
			new a(9, 511, n.t24HB, n.t24l),
			new a(11, 2047, n.t24HB, n.t24l),
			new a(13, 8191, n.t24HB, n.t24l),
			new a(0, 0, n.t32HB, n.t32l),
			new a(0, 0, n.t33HB, n.t33l)
		], n.largetbl = [
			65540,
			327685,
			458759,
			589832,
			655369,
			655370,
			720906,
			720907,
			786443,
			786444,
			786444,
			851980,
			851980,
			851980,
			917517,
			655370,
			262149,
			393222,
			524295,
			589832,
			655369,
			720906,
			720906,
			720907,
			786443,
			786443,
			786444,
			851980,
			917516,
			851980,
			917516,
			655370,
			458759,
			524295,
			589832,
			655369,
			720905,
			720906,
			786442,
			786443,
			851979,
			786443,
			851979,
			851980,
			851980,
			917516,
			917517,
			720905,
			589832,
			589832,
			655369,
			720905,
			720906,
			786442,
			786442,
			786443,
			851979,
			851979,
			917515,
			917516,
			917516,
			983052,
			983052,
			786441,
			655369,
			655369,
			720905,
			720906,
			786442,
			786442,
			851978,
			851979,
			851979,
			917515,
			917516,
			917516,
			983052,
			983052,
			983053,
			720905,
			655370,
			655369,
			720906,
			720906,
			786442,
			851978,
			851979,
			917515,
			851979,
			917515,
			917516,
			983052,
			983052,
			983052,
			1048588,
			786441,
			720906,
			720906,
			720906,
			786442,
			851978,
			851979,
			851979,
			851979,
			917515,
			917516,
			917516,
			917516,
			983052,
			983052,
			1048589,
			786441,
			720907,
			720906,
			786442,
			786442,
			851979,
			851979,
			851979,
			917515,
			917516,
			983052,
			983052,
			983052,
			983052,
			1114125,
			1114125,
			786442,
			720907,
			786443,
			786443,
			851979,
			851979,
			851979,
			917515,
			917515,
			983051,
			983052,
			983052,
			983052,
			1048588,
			1048589,
			1048589,
			786442,
			786443,
			786443,
			786443,
			851979,
			851979,
			917515,
			917515,
			983052,
			983052,
			983052,
			983052,
			1048588,
			983053,
			1048589,
			983053,
			851978,
			786444,
			851979,
			786443,
			851979,
			917515,
			917516,
			917516,
			917516,
			983052,
			1048588,
			1048588,
			1048589,
			1114125,
			1114125,
			1048589,
			786442,
			851980,
			851980,
			851979,
			851979,
			917515,
			917516,
			983052,
			1048588,
			1048588,
			1048588,
			1048588,
			1048589,
			1048589,
			983053,
			1048589,
			851978,
			851980,
			917516,
			917516,
			917516,
			917516,
			983052,
			983052,
			983052,
			983052,
			1114124,
			1048589,
			1048589,
			1048589,
			1048589,
			1179661,
			851978,
			983052,
			917516,
			917516,
			917516,
			983052,
			983052,
			1048588,
			1048588,
			1048589,
			1179661,
			1114125,
			1114125,
			1114125,
			1245197,
			1114125,
			851978,
			917517,
			983052,
			851980,
			917516,
			1048588,
			1048588,
			983052,
			1048589,
			1048589,
			1114125,
			1179661,
			1114125,
			1245197,
			1114125,
			1048589,
			851978,
			655369,
			655369,
			655369,
			720905,
			720905,
			786441,
			786441,
			786441,
			851977,
			851977,
			851977,
			851978,
			851978,
			851978,
			851978,
			655366
		], n.table23 = [
			65538,
			262147,
			458759,
			262148,
			327684,
			458759,
			393222,
			458759,
			524296
		], n.table56 = [
			65539,
			262148,
			458758,
			524296,
			262148,
			327684,
			524294,
			589831,
			458757,
			524294,
			589831,
			655368,
			524295,
			524295,
			589832,
			655369
		], n.bitrate_table = [
			[
				0,
				8,
				16,
				24,
				32,
				40,
				48,
				56,
				64,
				80,
				96,
				112,
				128,
				144,
				160,
				-1
			],
			[
				0,
				32,
				40,
				48,
				56,
				64,
				80,
				96,
				112,
				128,
				160,
				192,
				224,
				256,
				320,
				-1
			],
			[
				0,
				8,
				16,
				24,
				32,
				40,
				48,
				56,
				64,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1
			]
		], n.samplerate_table = [
			[
				22050,
				24e3,
				16e3,
				-1
			],
			[
				44100,
				48e3,
				32e3,
				-1
			],
			[
				11025,
				12e3,
				8e3,
				-1
			]
		], n.scfsi_band = [
			0,
			6,
			11,
			16,
			21
		], t.exports = n;
	}), O = _((e, t) => {
		var a = A(), n = h();
		n.System;
		var s = n.VbrMode, r = n.Float;
		n.ShortBlock;
		var _ = n.Util;
		n.Arrays, n.new_array_n, n.new_byte, n.new_double;
		var i = n.new_float;
		n.new_float_n;
		var o = n.new_int;
		n.new_int_n;
		var l = n.assert, f = m(), c = x(), u = y();
		function b() {
			var e = H(), t = null, n = null, h = null;
			function p(e) {
				return l(0 <= e + b.Q_MAX2 && e < b.Q_MAX), S[e + b.Q_MAX2];
			}
			this.setModules = function(e, a, s) {
				t = e, n = a, h = s;
			}, this.IPOW20 = function(e) {
				return l(0 <= e && e < b.Q_MAX), R[e];
			};
			var m = 2220446049250313e-31, d = b.IXMAX_VAL + 2, v = b.Q_MAX, g = b.Q_MAX2;
			b.LARGE_BITS;
			this.nr_of_sfb_block = [
				[
					[
						6,
						5,
						5,
						5
					],
					[
						9,
						9,
						9,
						9
					],
					[
						6,
						9,
						9,
						9
					]
				],
				[
					[
						6,
						5,
						7,
						3
					],
					[
						9,
						9,
						12,
						6
					],
					[
						6,
						9,
						12,
						6
					]
				],
				[
					[
						11,
						10,
						0,
						0
					],
					[
						18,
						18,
						0,
						0
					],
					[
						15,
						18,
						0,
						0
					]
				],
				[
					[
						7,
						7,
						7,
						0
					],
					[
						12,
						12,
						12,
						0
					],
					[
						6,
						15,
						12,
						0
					]
				],
				[
					[
						6,
						6,
						6,
						3
					],
					[
						12,
						9,
						9,
						6
					],
					[
						6,
						12,
						9,
						6
					]
				],
				[
					[
						8,
						8,
						5,
						0
					],
					[
						15,
						12,
						9,
						0
					],
					[
						6,
						18,
						9,
						0
					]
				]
			];
			var w = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				1,
				1,
				1,
				1,
				2,
				2,
				3,
				3,
				3,
				2,
				0
			];
			this.pretab = w, this.sfBandIndex = [
				new a([
					0,
					6,
					12,
					18,
					24,
					30,
					36,
					44,
					54,
					66,
					80,
					96,
					116,
					140,
					168,
					200,
					238,
					284,
					336,
					396,
					464,
					522,
					576
				], [
					0,
					4,
					8,
					12,
					18,
					24,
					32,
					42,
					56,
					74,
					100,
					132,
					174,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]),
				new a([
					0,
					6,
					12,
					18,
					24,
					30,
					36,
					44,
					54,
					66,
					80,
					96,
					114,
					136,
					162,
					194,
					232,
					278,
					332,
					394,
					464,
					540,
					576
				], [
					0,
					4,
					8,
					12,
					18,
					26,
					36,
					48,
					62,
					80,
					104,
					136,
					180,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]),
				new a([
					0,
					6,
					12,
					18,
					24,
					30,
					36,
					44,
					54,
					66,
					80,
					96,
					116,
					140,
					168,
					200,
					238,
					284,
					336,
					396,
					464,
					522,
					576
				], [
					0,
					4,
					8,
					12,
					18,
					26,
					36,
					48,
					62,
					80,
					104,
					134,
					174,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]),
				new a([
					0,
					4,
					8,
					12,
					16,
					20,
					24,
					30,
					36,
					44,
					52,
					62,
					74,
					90,
					110,
					134,
					162,
					196,
					238,
					288,
					342,
					418,
					576
				], [
					0,
					4,
					8,
					12,
					16,
					22,
					30,
					40,
					52,
					66,
					84,
					106,
					136,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]),
				new a([
					0,
					4,
					8,
					12,
					16,
					20,
					24,
					30,
					36,
					42,
					50,
					60,
					72,
					88,
					106,
					128,
					156,
					190,
					230,
					276,
					330,
					384,
					576
				], [
					0,
					4,
					8,
					12,
					16,
					22,
					28,
					38,
					50,
					64,
					80,
					100,
					126,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]),
				new a([
					0,
					4,
					8,
					12,
					16,
					20,
					24,
					30,
					36,
					44,
					54,
					66,
					82,
					102,
					126,
					156,
					194,
					240,
					296,
					364,
					448,
					550,
					576
				], [
					0,
					4,
					8,
					12,
					16,
					22,
					30,
					42,
					58,
					78,
					104,
					138,
					180,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]),
				new a([
					0,
					6,
					12,
					18,
					24,
					30,
					36,
					44,
					54,
					66,
					80,
					96,
					116,
					140,
					168,
					200,
					238,
					284,
					336,
					396,
					464,
					522,
					576
				], [
					0,
					4,
					8,
					12,
					18,
					26,
					36,
					48,
					62,
					80,
					104,
					134,
					174,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]),
				new a([
					0,
					6,
					12,
					18,
					24,
					30,
					36,
					44,
					54,
					66,
					80,
					96,
					116,
					140,
					168,
					200,
					238,
					284,
					336,
					396,
					464,
					522,
					576
				], [
					0,
					4,
					8,
					12,
					18,
					26,
					36,
					48,
					62,
					80,
					104,
					134,
					174,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]),
				new a([
					0,
					12,
					24,
					36,
					48,
					60,
					72,
					88,
					108,
					132,
					160,
					192,
					232,
					280,
					336,
					400,
					476,
					566,
					568,
					570,
					572,
					574,
					576
				], [
					0,
					8,
					16,
					24,
					36,
					52,
					72,
					96,
					124,
					160,
					162,
					164,
					166,
					192
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], [
					0,
					0,
					0,
					0,
					0,
					0,
					0
				])
			];
			var S = i(v + g + 1), R = i(v), A = i(d), M = i(d);
			function B(e, t) {
				var a = h.ATHformula(t, e);
				return a -= 100, a = Math.pow(10, a / 10 + e.ATHlower);
			}
			function y(e) {
				this.s = e;
			}
			this.adj43 = M, this.iteration_init = function(e) {
				var a, n = e.internal_flags, s = n.l3_side;
				if (0 == n.iteration_init_init) {
					for (n.iteration_init_init = 1, s.main_data_begin = 0, function(e) {
						for (var t = e.internal_flags.ATH.l, a = e.internal_flags.ATH.psfb21, n = e.internal_flags.ATH.s, s = e.internal_flags.ATH.psfb12, _ = e.internal_flags, i = e.out_samplerate, o = 0; o < f.SBMAX_l; o++) {
							var l = _.scalefac_band.l[o], h = _.scalefac_band.l[o + 1];
							t[o] = r.MAX_VALUE;
							for (var c = l; c < h; c++) {
								var u = B(e, c * i / 1152);
								t[o] = Math.min(t[o], u);
							}
						}
						for (o = 0; o < f.PSFB21; o++) for (l = _.scalefac_band.psfb21[o], h = _.scalefac_band.psfb21[o + 1], a[o] = r.MAX_VALUE, c = l; c < h; c++) u = B(e, c * i / 1152), a[o] = Math.min(a[o], u);
						for (o = 0; o < f.SBMAX_s; o++) {
							for (l = _.scalefac_band.s[o], h = _.scalefac_band.s[o + 1], n[o] = r.MAX_VALUE, c = l; c < h; c++) u = B(e, c * i / 384), n[o] = Math.min(n[o], u);
							n[o] *= _.scalefac_band.s[o + 1] - _.scalefac_band.s[o];
						}
						for (o = 0; o < f.PSFB12; o++) {
							for (l = _.scalefac_band.psfb12[o], h = _.scalefac_band.psfb12[o + 1], s[o] = r.MAX_VALUE, c = l; c < h; c++) u = B(e, c * i / 384), s[o] = Math.min(s[o], u);
							s[o] *= _.scalefac_band.s[13] - _.scalefac_band.s[12];
						}
						if (e.noATH) {
							for (o = 0; o < f.SBMAX_l; o++) t[o] = 1e-20;
							for (o = 0; o < f.PSFB21; o++) a[o] = 1e-20;
							for (o = 0; o < f.SBMAX_s; o++) n[o] = 1e-20;
							for (o = 0; o < f.PSFB12; o++) s[o] = 1e-20;
						}
						_.ATH.floor = 10 * Math.log10(B(e, -1));
					}(e), A[0] = 0, a = 1; a < d; a++) A[a] = Math.pow(a, 4 / 3);
					for (a = 0; a < d - 1; a++) M[a] = a + 1 - Math.pow(.5 * (A[a] + A[a + 1]), .75);
					for (M[a] = .5, a = 0; a < v; a++) R[a] = Math.pow(2, -.1875 * (a - 210));
					for (a = 0; a <= v + g; a++) S[a] = Math.pow(2, .25 * (a - 210 - g));
					var _, i, o, l;
					for (t.huffman_init(n), (a = e.exp_nspsytune >> 2 & 63) >= 32 && (a -= 64), _ = Math.pow(10, a / 4 / 10), (a = e.exp_nspsytune >> 8 & 63) >= 32 && (a -= 64), i = Math.pow(10, a / 4 / 10), (a = e.exp_nspsytune >> 14 & 63) >= 32 && (a -= 64), o = Math.pow(10, a / 4 / 10), (a = e.exp_nspsytune >> 20 & 63) >= 32 && (a -= 64), l = o * Math.pow(10, a / 4 / 10), a = 0; a < f.SBMAX_l; a++) h = a <= 6 ? _ : a <= 13 ? i : a <= 20 ? o : l, n.nsPsy.longfact[a] = h;
					for (a = 0; a < f.SBMAX_s; a++) {
						var h = a <= 5 ? _ : a <= 10 ? i : a <= 11 ? o : l;
						n.nsPsy.shortfact[a] = h;
					}
				}
			}, this.on_pe = function(e, t, a, s, r, _) {
				var i, f, h = e.internal_flags, b = 0, p = o(2), m = new c(b), d = n.ResvMaxBits(e, s, m, _), v = (b = m.bits) + d;
				for (v > u.MAX_BITS_PER_GRANULE && (v = u.MAX_BITS_PER_GRANULE), i = 0, f = 0; f < h.channels_out; ++f) a[f] = Math.min(u.MAX_BITS_PER_CHANNEL, b / h.channels_out), p[f] = 0 | a[f] * t[r][f] / 700 - a[f], p[f] > 3 * s / 4 && (p[f] = 3 * s / 4), p[f] < 0 && (p[f] = 0), p[f] + a[f] > u.MAX_BITS_PER_CHANNEL && (p[f] = Math.max(0, u.MAX_BITS_PER_CHANNEL - a[f])), i += p[f];
				if (i > d) for (f = 0; f < h.channels_out; ++f) p[f] = d * p[f] / i;
				for (f = 0; f < h.channels_out; ++f) a[f] += p[f], d -= p[f];
				for (i = 0, f = 0; f < h.channels_out; ++f) i += a[f];
				if (i > u.MAX_BITS_PER_GRANULE) {
					var g = 0;
					for (f = 0; f < h.channels_out; ++f) a[f] *= u.MAX_BITS_PER_GRANULE, a[f] /= i, g += a[f];
					l(g <= u.MAX_BITS_PER_GRANULE);
				}
				return v;
			}, this.reduce_side = function(e, t, a, n) {
				l(n <= u.MAX_BITS_PER_GRANULE), l(e[0] + e[1] <= u.MAX_BITS_PER_GRANULE);
				var s = .33 * (.5 - t) / .5;
				s < 0 && (s = 0), s > .5 && (s = .5);
				var r = 0 | .5 * s * (e[0] + e[1]);
				r > u.MAX_BITS_PER_CHANNEL - e[0] && (r = u.MAX_BITS_PER_CHANNEL - e[0]), r < 0 && (r = 0), e[1] >= 125 && (e[1] - r > 125 ? (e[0] < a && (e[0] += r), e[1] -= r) : (e[0] += e[1] - 125, e[1] = 125)), (r = e[0] + e[1]) > n && (e[0] = n * e[0] / r, e[1] = n * e[1] / r), l(e[0] <= u.MAX_BITS_PER_CHANNEL), l(e[1] <= u.MAX_BITS_PER_CHANNEL), l(e[0] + e[1] <= u.MAX_BITS_PER_GRANULE);
			}, this.athAdjust = function(e, t, a) {
				var n = 90.30873362, s = _.FAST_LOG10_X(t, 10), r = e * e, i = 0;
				return s -= a, r > 1e-20 && (i = 1 + _.FAST_LOG10_X(r, 10 / n)), i < 0 && (i = 0), s *= i, s += a + n - 94.82444863, Math.pow(10, .1 * s);
			}, this.calc_xmin = function(t, a, n, r) {
				var _, i = 0, o = t.internal_flags, l = 0, h = 0, c = o.ATH, u = n.xr, b = t.VBR == s.vbr_mtrh ? 1 : 0, p = o.masking_lower;
				for (t.VBR != s.vbr_mtrh && t.VBR != s.vbr_mt || (p = 1), _ = 0; _ < n.psy_lmax; _++) {
					B = (M = t.VBR == s.vbr_rh || t.VBR == s.vbr_mtrh ? athAdjust(c.adjust, c.l[_], c.floor) : c.adjust * c.l[_]) / (S = n.width[_]), y = m, k = S >> 1, T = 0;
					do
						T += x = u[l] * u[l], y += x < B ? x : B, T += P = u[++l] * u[l], y += P < B ? P : B, l++;
					while (--k > 0);
					if (T > M && h++, _ == f.SBPSY_l) y < (d = M * o.nsPsy.longfact[_]) && (y = d);
					if (0 != b && (M = y), !t.ATHonly) {
						if ((E = a.en.l[_]) > 0) {
							var d = T * a.thm.l[_] * p / E;
							0 != b && (d *= o.nsPsy.longfact[_]), M < d && (M = d);
						}
					}
					r[i++] = 0 != b ? M : M * o.nsPsy.longfact[_];
				}
				var v = 575;
				if (n.block_type != f.SHORT_TYPE) for (var g = 576; 0 != g-- && e.EQ(u[g], 0);) v = g;
				n.max_nonzero_coeff = v;
				for (var w = n.sfb_smin; _ < n.psymax; w++, _ += 3) {
					var S, R, A;
					for (A = t.VBR == s.vbr_rh || t.VBR == s.vbr_mtrh ? athAdjust(c.adjust, c.s[w], c.floor) : c.adjust * c.s[w], S = n.width[_], R = 0; R < 3; R++) {
						var M, B, y, E, T = 0, k = S >> 1;
						B = A / S, y = m;
						do {
							var x, P;
							T += x = u[l] * u[l], y += x < B ? x : B, T += P = u[++l] * u[l], y += P < B ? P : B, l++;
						} while (--k > 0);
						if (T > A && h++, w == f.SBPSY_s) y < (d = A * o.nsPsy.shortfact[w]) && (y = d);
						if (M = 0 != b ? y : A, !t.ATHonly && !t.ATHshort) {
							if ((E = a.en.s[w][R]) > 0) {
								d = T * a.thm.s[w][R] * p / E;
								0 != b && (d *= o.nsPsy.shortfact[w]), M < d && (M = d);
							}
						}
						r[i++] = 0 != b ? M : M * o.nsPsy.shortfact[w];
					}
					t.useTemporal && (r[i - 3] > r[i - 3 + 1] && (r[i - 3 + 1] += (r[i - 3] - r[i - 3 + 1]) * o.decay), r[i - 3 + 1] > r[i - 3 + 2] && (r[i - 3 + 2] += (r[i - 3 + 1] - r[i - 3 + 2]) * o.decay));
				}
				return h;
			}, this.calc_noise_core = function(e, t, a, n) {
				var s = 0, r = t.s, _ = e.l3_enc;
				if (r > e.count1) for (; 0 != a--;) {
					var o = e.xr[r];
					r++, s += o * o, o = e.xr[r], r++, s += o * o;
				}
				else if (r > e.big_values) {
					var l = i(2);
					for (l[0] = 0, l[1] = n; 0 != a--;) {
						o = Math.abs(e.xr[r]) - l[_[r]];
						r++, s += o * o, o = Math.abs(e.xr[r]) - l[_[r]], r++, s += o * o;
					}
				} else for (; 0 != a--;) {
					o = Math.abs(e.xr[r]) - A[_[r]] * n;
					r++, s += o * o, o = Math.abs(e.xr[r]) - A[_[r]] * n, r++, s += o * o;
				}
				return t.s = r, s;
			}, this.calc_noise = function(e, t, a, n, s) {
				var r, i, o = 0, l = 0, f = 0, h = 0, c = 0, u = -20, b = 0, m = e.scalefac, d = 0;
				for (n.over_SSD = 0, r = 0; r < e.psymax; r++) {
					var v = e.global_gain - (m[d++] + (0 != e.preflag ? w[r] : 0) << e.scalefac_scale + 1) - 8 * e.subblock_gain[e.window[r]], g = 0;
					if (null != s && s.step[r] == v) g = s.noise[r], b += e.width[r], a[o++] = g / t[l++], g = s.noise_log[r];
					else {
						var S = p(v);
						if (i = e.width[r] >> 1, b + e.width[r] > e.max_nonzero_coeff) {
							var R = e.max_nonzero_coeff - b + 1;
							i = R > 0 ? R >> 1 : 0;
						}
						var A = new y(b);
						g = this.calc_noise_core(e, A, i, S), b = A.s, null != s && (s.step[r] = v, s.noise[r] = g), g = a[o++] = g / t[l++], g = _.FAST_LOG10(Math.max(g, 1e-20)), null != s && (s.noise_log[r] = g);
					}
					if (null != s && (s.global_gain = e.global_gain), c += g, g > 0) {
						var M = Math.max(0 | 10 * g + .5, 1);
						n.over_SSD += M * M, f++, h += g;
					}
					u = Math.max(u, g);
				}
				return n.over_count = f, n.tot_noise = c, n.over_noise = h, n.max_noise = u, f;
			}, this.set_pinfo = function(e, t, a, n, s) {
				var r, _, o, h, c, u = e.internal_flags, b = 0 == t.scalefac_scale ? .5 : 1, p = t.scalefac, m = i(L3Side.SFBMAX), d = i(L3Side.SFBMAX), v = new CalcNoiseResult();
				calc_xmin(e, a, t, m), calc_noise(t, m, d, v, null);
				var g = 0;
				for (_ = t.sfb_lmax, t.block_type != f.SHORT_TYPE && 0 == t.mixed_block_flag && (_ = 22), r = 0; r < _; r++) {
					var S = u.scalefac_band.l[r], R = (A = u.scalefac_band.l[r + 1]) - S;
					for (h = 0; g < A; g++) h += t.xr[g] * t.xr[g];
					h /= R, c = 0x38d7ea4c68000, u.pinfo.en[n][s][r] = c * h, u.pinfo.xfsf[n][s][r] = c * m[r] * d[r] / R, a.en.l[r] > 0 && !e.ATHonly ? h /= a.en.l[r] : h = 0, u.pinfo.thr[n][s][r] = c * Math.max(h * a.thm.l[r], u.ATH.l[r]), u.pinfo.LAMEsfb[n][s][r] = 0, 0 != t.preflag && r >= 11 && (u.pinfo.LAMEsfb[n][s][r] = -b * w[r]), r < f.SBPSY_l && (l(p[r] >= 0), u.pinfo.LAMEsfb[n][s][r] -= b * p[r]);
				}
				if (t.block_type == f.SHORT_TYPE) for (_ = r, r = t.sfb_smin; r < f.SBMAX_s; r++) {
					S = u.scalefac_band.s[r], R = (A = u.scalefac_band.s[r + 1]) - S;
					for (var A, M = 0; M < 3; M++) {
						for (h = 0, o = S; o < A; o++) h += t.xr[g] * t.xr[g], g++;
						h = Math.max(h / R, 1e-20), c = 0x38d7ea4c68000, u.pinfo.en_s[n][s][3 * r + M] = c * h, u.pinfo.xfsf_s[n][s][3 * r + M] = c * m[_] * d[_] / R, a.en.s[r][M] > 0 ? h /= a.en.s[r][M] : h = 0, (e.ATHonly || e.ATHshort) && (h = 0), u.pinfo.thr_s[n][s][3 * r + M] = c * Math.max(h * a.thm.s[r][M], u.ATH.s[r]), u.pinfo.LAMEsfb_s[n][s][3 * r + M] = -2 * t.subblock_gain[M], r < f.SBPSY_s && (u.pinfo.LAMEsfb_s[n][s][3 * r + M] -= b * p[_]), _++;
					}
				}
				u.pinfo.LAMEqss[n][s] = t.global_gain, u.pinfo.LAMEmainbits[n][s] = t.part2_3_length + t.part2_length, u.pinfo.LAMEsfbits[n][s] = t.part2_length, u.pinfo.over[n][s] = v.over_count, u.pinfo.max_noise[n][s] = 10 * v.max_noise, u.pinfo.over_noise[n][s] = 10 * v.over_noise, u.pinfo.tot_noise[n][s] = 10 * v.tot_noise, u.pinfo.over_SSD[n][s] = v.over_SSD;
			};
		}
		b.Q_MAX = 257, b.Q_MAX2 = 116, b.LARGE_BITS = 1e5, b.IXMAX_VAL = 8206, t.exports = b;
	}), V = _((e, t) => {
		var a = h(), n = a.System;
		a.VbrMode, a.Float, a.ShortBlock, a.Util;
		var s = a.Arrays;
		a.new_array_n, a.new_byte, a.new_double, a.new_float, a.new_float_n;
		var r = a.new_int;
		a.new_int_n;
		var _ = a.assert, i = m(), o = I(), l = S(), f = O();
		t.exports = function e() {
			var t = null;
			function a(e) {
				this.bits = 0 | e;
			}
			this.qupvt = null, this.setModules = function(e) {
				this.qupvt = e, t = e;
			};
			var h = [
				[0, 0],
				[0, 0],
				[0, 0],
				[0, 0],
				[0, 0],
				[0, 1],
				[1, 1],
				[1, 1],
				[1, 2],
				[2, 2],
				[2, 3],
				[2, 3],
				[3, 4],
				[3, 4],
				[3, 4],
				[4, 5],
				[4, 5],
				[4, 6],
				[5, 6],
				[5, 6],
				[5, 7],
				[6, 7],
				[6, 7]
			];
			function c(e, t, a, n, s, r) {
				var i = .5946 / t;
				for (_(e > 0), e >>= 1; 0 != e--;) s[r++] = i > a[n++] ? 0 : 1, s[r++] = i > a[n++] ? 0 : 1;
			}
			function u(e, a, n, s, r, i) {
				_(e > 0);
				var o = (e >>= 1) % 2;
				for (e >>= 1; 0 != e--;) {
					var l = n[s++] * a, f = n[s++] * a, h, c, u = 0 | l, b, p, m;
					h = n[s++] * a, b = 0 | f, c = n[s++] * a, p = 0 | h, l += t.adj43[u], m = 0 | c, f += t.adj43[b], r[i++] = 0 | l, h += t.adj43[p], r[i++] = 0 | f, c += t.adj43[m], r[i++] = 0 | h, r[i++] = 0 | c;
				}
				0 != o && (u = 0 | (l = n[s++] * a), b = 0 | (f = n[s++] * a), l += t.adj43[u], f += t.adj43[b], r[i++] = 0 | l, r[i++] = 0 | f);
			}
			var b = [
				1,
				2,
				5,
				7,
				7,
				10,
				10,
				13,
				13,
				13,
				13,
				13,
				13,
				13,
				13
			];
			function p(e, t, a, n) {
				var s = function(e, t, a) {
					var n = 0, s = 0;
					do {
						var r = e[t++], _ = e[t++];
						n < r && (n = r), s < _ && (s = _);
					} while (t < a);
					return n < s && (n = s), n;
				}(e, t, a);
				switch (s) {
					case 0: return s;
					case 1: return function(e, t, a, n) {
						var s = 0, r = o.ht[1].hlen;
						do {
							var _ = 2 * e[t + 0] + e[t + 1];
							t += 2, s += r[_];
						} while (t < a);
						return n.bits += s, 1;
					}(e, t, a, n);
					case 2:
					case 3: return function(e, t, a, n, s) {
						var r, _, i = 0, l = o.ht[n].xlen;
						_ = 2 == n ? o.table23 : o.table56;
						do {
							var f = e[t + 0] * l + e[t + 1];
							t += 2, i += _[f];
						} while (t < a);
						return r = 65535 & i, (i >>= 16) > r && (i = r, n++), s.bits += i, n;
					}(e, t, a, b[s - 1], n);
					case 4:
					case 5:
					case 6:
					case 7:
					case 8:
					case 9:
					case 10:
					case 11:
					case 12:
					case 13:
					case 14:
					case 15: return function(e, t, a, n, s) {
						var r = 0, _ = 0, i = 0, l = o.ht[n].xlen, f = o.ht[n].hlen, h = o.ht[n + 1].hlen, c = o.ht[n + 2].hlen;
						do {
							var u = e[t + 0] * l + e[t + 1];
							t += 2, r += f[u], _ += h[u], i += c[u];
						} while (t < a);
						var b = n;
						return r > _ && (r = _, b++), r > i && (r = i, b = n + 2), s.bits += r, b;
					}(e, t, a, b[s - 1], n);
					default:
						if (s > f.IXMAX_VAL) return n.bits = f.LARGE_BITS, -1;
						var r, _;
						for (s -= 15, r = 24; r < 32 && !(o.ht[r].linmax >= s); r++);
						for (_ = r - 8; _ < 24 && !(o.ht[_].linmax >= s); _++);
						return function(e, t, a, n, s, r) {
							var _, i = 65536 * o.ht[n].xlen + o.ht[s].xlen, l = 0;
							do {
								var f = e[t++], h = e[t++];
								0 != f && (f > 14 && (f = 15, l += i), f *= 16), 0 != h && (h > 14 && (h = 15, l += i), f += h), l += o.largetbl[f];
							} while (t < a);
							return _ = 65535 & l, (l >>= 16) > _ && (l = _, n = s), r.bits += l, n;
						}(e, t, a, _, r, n);
				}
			}
			function m(e, t, n, s, r, _, o, l) {
				for (var f = t.big_values, h = 2; h < i.SBMAX_l + 1; h++) {
					var c = e.scalefac_band.l[h];
					if (c >= f) break;
					var u = r[h - 2] + t.count1bits;
					if (n.part2_3_length <= u) break;
					var b = new a(u), m = p(s, c, f, b);
					u = b.bits, n.part2_3_length <= u || (n.assign(t), n.part2_3_length = u, n.region0_count = _[h - 2], n.region1_count = h - 2 - _[h - 2], n.table_select[0] = o[h - 2], n.table_select[1] = l[h - 2], n.table_select[2] = m);
				}
			}
			this.noquant_count_bits = function(e, t, n) {
				var s = t.l3_enc, r = Math.min(576, t.max_nonzero_coeff + 2 >> 1 << 1);
				for (null != n && (n.sfb_count1 = 0); r > 1 && 0 == (s[r - 1] | s[r - 2]); r -= 2);
				t.count1 = r;
				for (var l = 0, f = 0; r > 3; r -= 4) {
					var h;
					if ((2147483647 & (s[r - 1] | s[r - 2] | s[r - 3] | s[r - 4])) > 1) break;
					h = 2 * (2 * (2 * s[r - 4] + s[r - 3]) + s[r - 2]) + s[r - 1], l += o.t32l[h], f += o.t33l[h];
				}
				var c = l;
				if (t.count1table_select = 0, l > f && (c = f, t.count1table_select = 1), t.count1bits = c, t.big_values = r, 0 == r) return c;
				if (t.block_type == i.SHORT_TYPE) (l = 3 * e.scalefac_band.s[3]) > t.big_values && (l = t.big_values), f = t.big_values;
				else if (t.block_type == i.NORM_TYPE) {
					if (_(r <= 576), l = t.region0_count = e.bv_scf[r - 2], f = t.region1_count = e.bv_scf[r - 1], _(l + f + 2 < i.SBPSY_l), f = e.scalefac_band.l[l + f + 2], l = e.scalefac_band.l[l + 1], f < r) {
						var u = new a(c);
						t.table_select[2] = p(s, f, r, u), c = u.bits;
					}
				} else t.region0_count = 7, t.region1_count = i.SBMAX_l - 1 - 7 - 1, (l = e.scalefac_band.l[8]) > (f = r) && (l = f);
				if (l = Math.min(l, r), f = Math.min(f, r), _(l >= 0), _(f >= 0), 0 < l) {
					u = new a(c);
					t.table_select[0] = p(s, 0, l, u), c = u.bits;
				}
				if (l < f) {
					u = new a(c);
					t.table_select[1] = p(s, l, f, u), c = u.bits;
				}
				if (2 == e.use_best_huffman && (t.part2_3_length = c, best_huffman_divide(e, t), c = t.part2_3_length), null != n && t.block_type == i.NORM_TYPE) {
					for (var b = 0; e.scalefac_band.l[b] < t.big_values;) b++;
					n.sfb_count1 = b;
				}
				return c;
			}, this.count_bits = function(e, a, n, r) {
				var o = n.l3_enc, l = f.IXMAX_VAL / t.IPOW20(n.global_gain);
				if (n.xrpow_max > l) return f.LARGE_BITS;
				if (function(e, a, n, r, o) {
					var l, f, h, b = 0, p = 0, m = 0, d = 0, v = a, g = 0, w = v, S = 0, R = e, A = 0;
					for (h = null != o && r.global_gain == o.global_gain, f = r.block_type == i.SHORT_TYPE ? 38 : 21, l = 0; l <= f; l++) {
						var M = -1;
						if ((h || r.block_type == i.NORM_TYPE) && (M = r.global_gain - (r.scalefac[l] + (0 != r.preflag ? t.pretab[l] : 0) << r.scalefac_scale + 1) - 8 * r.subblock_gain[r.window[l]]), _(r.width[l] >= 0), h && o.step[l] == M) 0 != p && (u(p, n, R, A, w, S), p = 0), 0 != m && (c(m, n, R, A, w, S), m = 0);
						else {
							var B = r.width[l];
							if (b + r.width[l] > r.max_nonzero_coeff) {
								var y = r.max_nonzero_coeff - b + 1;
								s.fill(a, r.max_nonzero_coeff, 576, 0), (B = y) < 0 && (B = 0), l = f + 1;
							}
							if (0 == p && 0 == m && (w = v, S = g, R = e, A = d), null != o && o.sfb_count1 > 0 && l >= o.sfb_count1 && o.step[l] > 0 && M >= o.step[l] ? (0 != p && (u(p, n, R, A, w, S), p = 0, w = v, S = g, R = e, A = d), m += B) : (0 != m && (c(m, n, R, A, w, S), m = 0, w = v, S = g, R = e, A = d), p += B), B <= 0) {
								0 != m && (c(m, n, R, A, w, S), m = 0), 0 != p && (u(p, n, R, A, w, S), p = 0);
								break;
							}
						}
						l <= f && (g += r.width[l], d += r.width[l], b += r.width[l]);
					}
					0 != p && (u(p, n, R, A, w, S), p = 0), 0 != m && (c(m, n, R, A, w, S), m = 0);
				}(a, o, t.IPOW20(n.global_gain), n, r), 2 & e.substep_shaping) for (var h = 0, b = n.global_gain + n.scalefac_scale, p = .634521682242439 / t.IPOW20(b), m = 0; m < n.sfbmax; m++) {
					var d, v = n.width[m];
					if (_(v >= 0), 0 == e.pseudohalf[m]) h += v;
					else for (d = h, h += v; d < h; ++d) o[d] = a[d] >= p ? o[d] : 0;
				}
				return this.noquant_count_bits(e, n, r);
			}, this.best_huffman_divide = function(e, t) {
				var n = new l(), s = t.l3_enc, h = r(23), c = r(23), u = r(23), b = r(23);
				if (t.block_type != i.SHORT_TYPE || 1 != e.mode_gr) {
					n.assign(t), t.block_type == i.NORM_TYPE && (function(e, t, n, s, r, _, i) {
						for (var o = t.big_values, l = 0; l <= 22; l++) s[l] = f.LARGE_BITS;
						for (l = 0; l < 16; l++) {
							var h = e.scalefac_band.l[l + 1];
							if (h >= o) break;
							var c = 0, u = new a(c), b = p(n, 0, h, u);
							c = u.bits;
							for (var m = 0; m < 8; m++) {
								var d = e.scalefac_band.l[l + m + 2];
								if (d >= o) break;
								var v = c, g = p(n, h, d, u = new a(v));
								v = u.bits, s[l + m] > v && (s[l + m] = v, r[l + m] = l, _[l + m] = b, i[l + m] = g);
							}
						}
					}(e, t, s, h, c, u, b), m(e, n, t, s, h, c, u, b));
					var d = n.big_values;
					if (!(0 == d || (s[d - 2] | s[d - 1]) > 1 || (d = t.count1 + 2) > 576)) {
						n.assign(t), n.count1 = d;
						var v = 0, g = 0;
						for (_(d <= 576); d > n.big_values; d -= 4) {
							var w = 2 * (2 * (2 * s[d - 4] + s[d - 3]) + s[d - 2]) + s[d - 1];
							v += o.t32l[w], g += o.t33l[w];
						}
						if (n.big_values = d, n.count1table_select = 0, v > g && (v = g, n.count1table_select = 1), n.count1bits = v, n.block_type == i.NORM_TYPE) m(e, n, t, s, h, c, u, b);
						else {
							if (n.part2_3_length = v, (v = e.scalefac_band.l[8]) > d && (v = d), v > 0) {
								var S = new a(n.part2_3_length);
								n.table_select[0] = p(s, 0, v, S), n.part2_3_length = S.bits;
							}
							if (d > v) {
								S = new a(n.part2_3_length);
								n.table_select[1] = p(s, v, d, S), n.part2_3_length = S.bits;
							}
							t.part2_3_length > n.part2_3_length && t.assign(n);
						}
					}
				}
			};
			var d = [
				1,
				1,
				1,
				1,
				8,
				2,
				2,
				2,
				4,
				4,
				4,
				8,
				8,
				8,
				16,
				16
			], v = [
				1,
				2,
				4,
				8,
				1,
				2,
				4,
				8,
				2,
				4,
				8,
				2,
				4,
				8,
				4,
				8
			], g = [
				0,
				0,
				0,
				0,
				3,
				1,
				1,
				1,
				2,
				2,
				2,
				3,
				3,
				3,
				4,
				4
			], w = [
				0,
				1,
				2,
				3,
				0,
				1,
				2,
				3,
				1,
				2,
				3,
				1,
				2,
				3,
				2,
				3
			];
			e.slen1_tab = g, e.slen2_tab = w, this.best_scalefac_store = function(e, a, n, s) {
				var r, l, f, h, c = s.tt[a][n], u = 0;
				for (f = 0, r = 0; r < c.sfbmax; r++) {
					var b = c.width[r];
					for (_(b >= 0), f += b, h = -b; h < 0 && 0 == c.l3_enc[h + f]; h++);
					0 == h && (c.scalefac[r] = u = -2);
				}
				if (0 == c.scalefac_scale && 0 == c.preflag) {
					var p = 0;
					for (r = 0; r < c.sfbmax; r++) c.scalefac[r] > 0 && (p |= c.scalefac[r]);
					if (!(1 & p) && 0 != p) {
						for (r = 0; r < c.sfbmax; r++) c.scalefac[r] > 0 && (c.scalefac[r] >>= 1);
						c.scalefac_scale = u = 1;
					}
				}
				if (0 == c.preflag && c.block_type != i.SHORT_TYPE && 2 == e.mode_gr) {
					for (r = 11; r < i.SBPSY_l && !(c.scalefac[r] < t.pretab[r] && -2 != c.scalefac[r]); r++);
					if (r == i.SBPSY_l) {
						for (r = 11; r < i.SBPSY_l; r++) c.scalefac[r] > 0 && (c.scalefac[r] -= t.pretab[r]);
						c.preflag = u = 1;
					}
				}
				for (l = 0; l < 4; l++) s.scfsi[n][l] = 0;
				for (2 == e.mode_gr && 1 == a && s.tt[0][n].block_type != i.SHORT_TYPE && s.tt[1][n].block_type != i.SHORT_TYPE && (function(e, t) {
					for (var a, n = t.tt[1][e], s = t.tt[0][e], r = 0; r < o.scfsi_band.length - 1; r++) {
						for (a = o.scfsi_band[r]; a < o.scfsi_band[r + 1] && !(s.scalefac[a] != n.scalefac[a] && n.scalefac[a] >= 0); a++);
						if (a == o.scfsi_band[r + 1]) {
							for (a = o.scfsi_band[r]; a < o.scfsi_band[r + 1]; a++) n.scalefac[a] = -1;
							t.scfsi[e][r] = 1;
						}
					}
					var _ = 0, l = 0;
					for (a = 0; a < 11; a++) -1 != n.scalefac[a] && (l++, _ < n.scalefac[a] && (_ = n.scalefac[a]));
					for (var f = 0, h = 0; a < i.SBPSY_l; a++) -1 != n.scalefac[a] && (h++, f < n.scalefac[a] && (f = n.scalefac[a]));
					for (r = 0; r < 16; r++) if (_ < d[r] && f < v[r]) {
						var c = g[r] * l + w[r] * h;
						n.part2_length > c && (n.part2_length = c, n.scalefac_compress = r);
					}
				}(n, s), u = 0), r = 0; r < c.sfbmax; r++) -2 == c.scalefac[r] && (c.scalefac[r] = 0);
				0 != u && (2 == e.mode_gr ? this.scale_bitcount(c) : this.scale_bitcount_lsf(e, c));
			};
			var S = [
				0,
				18,
				36,
				54,
				54,
				36,
				54,
				72,
				54,
				72,
				90,
				72,
				90,
				108,
				108,
				126
			], R = [
				0,
				18,
				36,
				54,
				51,
				35,
				53,
				71,
				52,
				70,
				88,
				69,
				87,
				105,
				104,
				122
			], A = [
				0,
				10,
				20,
				30,
				33,
				21,
				31,
				41,
				32,
				42,
				52,
				43,
				53,
				63,
				64,
				74
			];
			this.scale_bitcount = function(e) {
				var a, n, s, r = 0, o = 0, l = e.scalefac;
				if (_(function(e, t) {
					for (var a = 0; a < t; ++a) if (e[a] < 0) return !1;
					return !0;
				}(l, e.sfbmax)), e.block_type == i.SHORT_TYPE) s = S, 0 != e.mixed_block_flag && (s = R);
				else if (s = A, 0 == e.preflag) {
					for (n = 11; n < i.SBPSY_l && !(l[n] < t.pretab[n]); n++);
					if (n == i.SBPSY_l) for (e.preflag = 1, n = 11; n < i.SBPSY_l; n++) l[n] -= t.pretab[n];
				}
				for (n = 0; n < e.sfbdivide; n++) r < l[n] && (r = l[n]);
				for (; n < e.sfbmax; n++) o < l[n] && (o = l[n]);
				for (e.part2_length = f.LARGE_BITS, a = 0; a < 16; a++) r < d[a] && o < v[a] && e.part2_length > s[a] && (e.part2_length = s[a], e.scalefac_compress = a);
				return e.part2_length == f.LARGE_BITS;
			};
			var M = [
				[
					15,
					15,
					7,
					7
				],
				[
					15,
					15,
					7,
					0
				],
				[
					7,
					3,
					0,
					0
				],
				[
					15,
					31,
					31,
					0
				],
				[
					7,
					7,
					7,
					0
				],
				[
					3,
					3,
					0,
					0
				]
			];
			this.scale_bitcount_lsf = function(e, a) {
				var s, o, l, f, h, c, u, b, p = r(4), m = a.scalefac;
				for (s = 0 != a.preflag ? 2 : 0, u = 0; u < 4; u++) p[u] = 0;
				if (a.block_type == i.SHORT_TYPE) {
					o = 1;
					var d = t.nr_of_sfb_block[s][o];
					for (b = 0, l = 0; l < 4; l++) for (f = d[l] / 3, u = 0; u < f; u++, b++) for (h = 0; h < 3; h++) m[3 * b + h] > p[l] && (p[l] = m[3 * b + h]);
				} else {
					o = 0;
					d = t.nr_of_sfb_block[s][o];
					for (b = 0, l = 0; l < 4; l++) for (f = d[l], u = 0; u < f; u++, b++) m[b] > p[l] && (p[l] = m[b]);
				}
				for (c = !1, l = 0; l < 4; l++) p[l] > M[s][l] && (c = !0);
				if (!c) {
					var v, g, w, S;
					for (a.sfb_partition_table = t.nr_of_sfb_block[s][o], l = 0; l < 4; l++) a.slen[l] = B[p[l]];
					switch (v = a.slen[0], g = a.slen[1], w = a.slen[2], S = a.slen[3], s) {
						case 0:
							a.scalefac_compress = (5 * v + g << 4) + (w << 2) + S;
							break;
						case 1:
							a.scalefac_compress = 400 + (5 * v + g << 2) + w;
							break;
						case 2:
							a.scalefac_compress = 500 + 3 * v + g;
							break;
						default: n.err.printf("intensity stereo not implemented yet\n");
					}
				}
				if (!c) for (_(null != a.sfb_partition_table), a.part2_length = 0, l = 0; l < 4; l++) a.part2_length += a.slen[l] * a.sfb_partition_table[l];
				return c;
			};
			var B = [
				0,
				1,
				2,
				2,
				3,
				3,
				3,
				3,
				4,
				4,
				4,
				4,
				4,
				4,
				4,
				4
			];
			this.huffman_init = function(e) {
				for (var t = 2; t <= 576; t += 2) {
					for (var a, n = 0; e.scalefac_band.l[++n] < t;);
					for (a = h[n][0]; e.scalefac_band.l[a + 1] > t;) a--;
					for (a < 0 && (a = h[n][0]), e.bv_scf[t - 2] = a, a = h[n][1]; e.scalefac_band.l[a + e.bv_scf[t - 2] + 2] > t;) a--;
					a < 0 && (a = h[n][1]), e.bv_scf[t - 1] = a;
				}
			};
		};
	}), H = _((e, t) => {
		var a = h(), n = a.System;
		a.VbrMode, a.Float, a.ShortBlock, a.Util;
		var s = a.Arrays;
		a.new_array_n;
		var r = a.new_byte;
		a.new_double, a.new_float;
		var _ = a.new_float_n, i = a.new_int;
		a.new_int_n;
		var o = a.assert, l = V(), f = I(), c = m(), u = y();
		function b() {
			var e = L(), t = this, a = 32, h = null, b = null, p = null, m = null;
			this.setModules = function(e, t, a, n) {
				h = e, b = t, p = a, m = n;
			};
			var d = null, v = 0, g = 0, w = 0;
			function S(e) {
				n.arraycopy(e.header[e.w_ptr].buf, 0, d, g, e.sideinfo_len), g += e.sideinfo_len, v += 8 * e.sideinfo_len, e.w_ptr = e.w_ptr + 1 & u.MAX_HEADER_BUF - 1;
			}
			function R(t, n, s) {
				for (o(s < 30); s > 0;) {
					var r;
					0 == w && (w = 8, g++, o(g < e.LAME_MAXMP3BUFFER), o(t.header[t.w_ptr].write_timing >= v), t.header[t.w_ptr].write_timing == v && S(t), d[g] = 0), r = Math.min(s, w), w -= r, o((s -= r) < a), o(w < a), d[g] |= n >> s << w, v += r;
				}
			}
			function A(t, n, s) {
				for (o(s < 30); s > 0;) {
					var r;
					0 == w && (w = 8, g++, o(g < e.LAME_MAXMP3BUFFER), d[g] = 0), r = Math.min(s, w), w -= r, o((s -= r) < a), o(w < a), d[g] |= n >> s << w, v += r;
				}
			}
			function M(e, t) {
				var a, n = e.internal_flags;
				if (o(t >= 0), t >= 8 && (R(n, 76, 8), t -= 8), t >= 8 && (R(n, 65, 8), t -= 8), t >= 8 && (R(n, 77, 8), t -= 8), t >= 8 && (R(n, 69, 8), t -= 8), t >= 32) {
					var s = p.getLameShortVersion();
					if (t >= 32) for (a = 0; a < s.length && t >= 8; ++a) t -= 8, R(n, s.charAt(a), 8);
				}
				for (; t >= 1; t -= 1) R(n, n.ancillary_flag, 1), n.ancillary_flag ^= e.disable_reservoir ? 0 : 1;
				o(0 == t);
			}
			function B(e, t, n) {
				for (var s = e.header[e.h_ptr].ptr; n > 0;) {
					var r = Math.min(n, 8 - (7 & s));
					o((n -= r) < a), e.header[e.h_ptr].buf[s >> 3] |= t >> n << 8 - (7 & s) - r, s += r;
				}
				e.header[e.h_ptr].ptr = s;
			}
			function y(e, t) {
				e <<= 8;
				for (var a = 0; a < 8; a++) 65536 & ((t <<= 1) ^ (e <<= 1)) && (t ^= 32773);
				return t;
			}
			function E(e, t) {
				var a, n = f.ht[t.count1table_select + 32], s = 0, r = t.big_values, _ = t.big_values;
				for (o(t.count1table_select < 2), a = (t.count1 - t.big_values) / 4; a > 0; --a) {
					var i = 0, l = 0, h = t.l3_enc[r + 0];
					0 != h && (l += 8, t.xr[_ + 0] < 0 && i++, o(h <= 1)), 0 != (h = t.l3_enc[r + 1]) && (l += 4, i *= 2, t.xr[_ + 1] < 0 && i++, o(h <= 1)), 0 != (h = t.l3_enc[r + 2]) && (l += 2, i *= 2, t.xr[_ + 2] < 0 && i++, o(h <= 1)), 0 != (h = t.l3_enc[r + 3]) && (l++, i *= 2, t.xr[_ + 3] < 0 && i++, o(h <= 1)), r += 4, _ += 4, R(e, i + n.table[l], n.hlen[l]), s += n.hlen[l];
				}
				return s;
			}
			function T(e, t, n, s, r) {
				var _ = f.ht[t], i = 0;
				if (o(t < 32), 0 == t) return i;
				for (var l = n; l < s; l += 2) {
					var h = 0, c = 0, u = _.xlen, b = _.xlen, p = 0, m = r.l3_enc[l], d = r.l3_enc[l + 1];
					if (0 != m && (r.xr[l] < 0 && p++, h--), t > 15) {
						if (m > 14) {
							var v = m - 15;
							o(v <= _.linmax), p |= v << 1, c = u, m = 15;
						}
						if (d > 14) {
							var g = d - 15;
							o(g <= _.linmax), p <<= u, p |= g, c += u, d = 15;
						}
						b = 16;
					}
					0 != d && (p <<= 1, r.xr[l + 1] < 0 && p++, h--), o((m | d) < 16), m = m * b + d, c -= h, h += _.hlen[m], o(h <= a), o(c <= a), R(e, _.table[m], h), R(e, p, c), i += h + c;
				}
				return i;
			}
			function k(e, t) {
				var a = 3 * e.scalefac_band.s[3];
				a > t.big_values && (a = t.big_values);
				var n = T(e, t.table_select[0], 0, a, t);
				return n += T(e, t.table_select[1], a, t.big_values, t);
			}
			function x(e, t) {
				var a = t.big_values, n, s, r;
				o(0 <= a && a <= 576);
				var _ = t.region0_count + 1;
				return o(0 <= _), o(_ < e.scalefac_band.l.length), s = e.scalefac_band.l[_], _ += t.region1_count + 1, o(0 <= _), o(_ < e.scalefac_band.l.length), s > a && (s = a), (r = e.scalefac_band.l[_]) > a && (r = a), n = T(e, t.table_select[0], 0, s, t), n += T(e, t.table_select[1], s, r, t), n += T(e, t.table_select[2], r, a, t);
			}
			function P() {
				this.total = 0;
			}
			function I(e, a) {
				var s, r, _, i, o = e.internal_flags, l = o.w_ptr;
				return -1 == (i = o.h_ptr - 1) && (i = u.MAX_HEADER_BUF - 1), s = o.header[i].write_timing - v, a.total = s, s >= 0 && (r = 1 + i - l, i < l && (r = 1 + i - l + u.MAX_HEADER_BUF), s -= 8 * r * o.sideinfo_len), s += _ = t.getframebits(e), a.total += _, a.total % 8 != 0 ? a.total = 1 + a.total / 8 : a.total = a.total / 8, a.total += g + 1, s < 0 && n.err.println("strange error flushing buffer ... \n"), s;
			}
			this.getframebits = function(e) {
				var t, a = e.internal_flags;
				return t = 0 != a.bitrate_index ? f.bitrate_table[e.version][a.bitrate_index] : e.brate, o(8 <= t && t <= 640), 8 * (0 | 72e3 * (e.version + 1) * t / e.out_samplerate + a.padding);
			}, this.CRC_writeheader = function(e, t) {
				var a = 65535;
				a = y(255 & t[2], a), a = y(255 & t[3], a);
				for (var n = 6; n < e.sideinfo_len; n++) a = y(255 & t[n], a);
				t[4] = byte(a >> 8), t[5] = byte(255 & a);
			}, this.flush_bitstream = function(e) {
				var t, a, n = e.internal_flags, s = n.h_ptr - 1;
				if (-1 == s && (s = u.MAX_HEADER_BUF - 1), t = n.l3_side, !((a = I(e, new P())) < 0)) {
					if (M(e, a), o(n.header[s].write_timing + this.getframebits(e) == v), n.ResvSize = 0, t.main_data_begin = 0, n.findReplayGain) {
						var r = h.GetTitleGain(n.rgdata);
						o(NEQ(r, GainAnalysis.GAIN_NOT_ENOUGH_SAMPLES)), n.RadioGain = 0 | Math.floor(10 * r + .5);
					}
					n.findPeakSample && (n.noclipGainChange = 0 | Math.ceil(20 * Math.log10(n.PeakSample / 32767) * 10), n.noclipGainChange > 0 && (EQ(e.scale, 1) || EQ(e.scale, 0)) ? n.noclipScale = Math.floor(32767 / n.PeakSample * 100) / 100 : n.noclipScale = -1);
				}
			}, this.add_dummy_byte = function(e, t, a) {
				for (var n, s = e.internal_flags; a-- > 0;) for (A(0, t, 8), n = 0; n < u.MAX_HEADER_BUF; ++n) s.header[n].write_timing += 8;
			}, this.format_bitstream = function(e) {
				var t = e.internal_flags, a = t.l3_side, r = this.getframebits(e);
				M(e, a.resvDrain_pre), function(e, t) {
					var a, r, _, i = e.internal_flags;
					if (a = i.l3_side, i.header[i.h_ptr].ptr = 0, s.fill(i.header[i.h_ptr].buf, 0, i.sideinfo_len, 0), e.out_samplerate < 16e3 ? B(i, 4094, 12) : B(i, 4095, 12), B(i, e.version, 1), B(i, 1, 2), B(i, e.error_protection ? 0 : 1, 1), B(i, i.bitrate_index, 4), B(i, i.samplerate_index, 2), B(i, i.padding, 1), B(i, e.extension, 1), B(i, e.mode.ordinal(), 2), B(i, i.mode_ext, 2), B(i, e.copyright, 1), B(i, e.original, 1), B(i, e.emphasis, 2), e.error_protection && B(i, 0, 16), 1 == e.version) {
						for (o(a.main_data_begin >= 0), B(i, a.main_data_begin, 9), 2 == i.channels_out ? B(i, a.private_bits, 3) : B(i, a.private_bits, 5), _ = 0; _ < i.channels_out; _++) {
							var l;
							for (l = 0; l < 4; l++) B(i, a.scfsi[_][l], 1);
						}
						for (r = 0; r < 2; r++) for (_ = 0; _ < i.channels_out; _++) B(i, (f = a.tt[r][_]).part2_3_length + f.part2_length, 12), B(i, f.big_values / 2, 9), B(i, f.global_gain, 8), B(i, f.scalefac_compress, 4), f.block_type != c.NORM_TYPE ? (B(i, 1, 1), B(i, f.block_type, 2), B(i, f.mixed_block_flag, 1), 14 == f.table_select[0] && (f.table_select[0] = 16), B(i, f.table_select[0], 5), 14 == f.table_select[1] && (f.table_select[1] = 16), B(i, f.table_select[1], 5), B(i, f.subblock_gain[0], 3), B(i, f.subblock_gain[1], 3), B(i, f.subblock_gain[2], 3)) : (B(i, 0, 1), 14 == f.table_select[0] && (f.table_select[0] = 16), B(i, f.table_select[0], 5), 14 == f.table_select[1] && (f.table_select[1] = 16), B(i, f.table_select[1], 5), 14 == f.table_select[2] && (f.table_select[2] = 16), B(i, f.table_select[2], 5), o(0 <= f.region0_count && f.region0_count < 16), o(0 <= f.region1_count && f.region1_count < 8), B(i, f.region0_count, 4), B(i, f.region1_count, 3)), B(i, f.preflag, 1), B(i, f.scalefac_scale, 1), B(i, f.count1table_select, 1);
					} else for (o(a.main_data_begin >= 0), B(i, a.main_data_begin, 8), B(i, a.private_bits, i.channels_out), r = 0, _ = 0; _ < i.channels_out; _++) {
						var f;
						B(i, (f = a.tt[r][_]).part2_3_length + f.part2_length, 12), B(i, f.big_values / 2, 9), B(i, f.global_gain, 8), B(i, f.scalefac_compress, 9), f.block_type != c.NORM_TYPE ? (B(i, 1, 1), B(i, f.block_type, 2), B(i, f.mixed_block_flag, 1), 14 == f.table_select[0] && (f.table_select[0] = 16), B(i, f.table_select[0], 5), 14 == f.table_select[1] && (f.table_select[1] = 16), B(i, f.table_select[1], 5), B(i, f.subblock_gain[0], 3), B(i, f.subblock_gain[1], 3), B(i, f.subblock_gain[2], 3)) : (B(i, 0, 1), 14 == f.table_select[0] && (f.table_select[0] = 16), B(i, f.table_select[0], 5), 14 == f.table_select[1] && (f.table_select[1] = 16), B(i, f.table_select[1], 5), 14 == f.table_select[2] && (f.table_select[2] = 16), B(i, f.table_select[2], 5), o(0 <= f.region0_count && f.region0_count < 16), o(0 <= f.region1_count && f.region1_count < 8), B(i, f.region0_count, 4), B(i, f.region1_count, 3)), B(i, f.scalefac_scale, 1), B(i, f.count1table_select, 1);
					}
					e.error_protection && CRC_writeheader(i, i.header[i.h_ptr].buf);
					var h = i.h_ptr;
					o(i.header[h].ptr == 8 * i.sideinfo_len), i.h_ptr = h + 1 & u.MAX_HEADER_BUF - 1, i.header[i.h_ptr].write_timing = i.header[h].write_timing + t, i.h_ptr == i.w_ptr && n.err.println("Error: MAX_HEADER_BUF too small in bitstream.c \n");
				}(e, r);
				var _ = 8 * t.sideinfo_len;
				if (_ += function(e) {
					var t, a, n, s, r = 0, _ = e.internal_flags, i = _.l3_side;
					if (1 == e.version) for (t = 0; t < 2; t++) for (a = 0; a < _.channels_out; a++) {
						var f = i.tt[t][a], h = l.slen1_tab[f.scalefac_compress], u = l.slen2_tab[f.scalefac_compress];
						for (s = 0, n = 0; n < f.sfbdivide; n++) -1 != f.scalefac[n] && (R(_, f.scalefac[n], h), s += h);
						for (; n < f.sfbmax; n++) -1 != f.scalefac[n] && (R(_, f.scalefac[n], u), s += u);
						o(s == f.part2_length), f.block_type == c.SHORT_TYPE ? s += k(_, f) : s += x(_, f), s += E(_, f), o(s == f.part2_3_length + f.part2_length), r += s;
					}
					else for (t = 0, a = 0; a < _.channels_out; a++) {
						f = i.tt[t][a];
						var b, p, m = 0;
						if (o(null != f.sfb_partition_table), s = 0, n = 0, p = 0, f.block_type == c.SHORT_TYPE) {
							for (; p < 4; p++) {
								var d = f.sfb_partition_table[p] / 3, v = f.slen[p];
								for (b = 0; b < d; b++, n++) R(_, Math.max(f.scalefac[3 * n + 0], 0), v), R(_, Math.max(f.scalefac[3 * n + 1], 0), v), R(_, Math.max(f.scalefac[3 * n + 2], 0), v), m += 3 * v;
							}
							s += k(_, f);
						} else {
							for (; p < 4; p++) for (d = f.sfb_partition_table[p], v = f.slen[p], b = 0; b < d; b++, n++) R(_, Math.max(f.scalefac[n], 0), v), m += v;
							s += x(_, f);
						}
						s += E(_, f), o(s == f.part2_3_length), o(m == f.part2_length), r += m + s;
					}
					return r;
				}(e), M(e, a.resvDrain_post), _ += a.resvDrain_post, a.main_data_begin += (r - _) / 8, I(e, new P()) != t.ResvSize && n.err.println("Internal buffer inconsistency. flushbits <> ResvSize"), 8 * a.main_data_begin != t.ResvSize && (n.err.printf("bit reservoir error: \nl3_side.main_data_begin: %d \nResvoir size:             %d \nresv drain (post)         %d \nresv drain (pre)          %d \nheader and sideinfo:      %d \ndata bits:                %d \ntotal bits:               %d (remainder: %d) \nbitsperframe:             %d \n", 8 * a.main_data_begin, t.ResvSize, a.resvDrain_post, a.resvDrain_pre, 8 * t.sideinfo_len, _ - a.resvDrain_post - 8 * t.sideinfo_len, _, _ % 8, r), n.err.println("This is a fatal error.  It has several possible causes:"), n.err.println("90%%  LAME compiled with buggy version of gcc using advanced optimizations"), n.err.println(" 9%%  Your system is overclocked"), n.err.println(" 1%%  bug in LAME encoding library"), t.ResvSize = 8 * a.main_data_begin), o(v % 8 == 0), v > 1e9) {
					var i;
					for (i = 0; i < u.MAX_HEADER_BUF; ++i) t.header[i].write_timing -= v;
					v = 0;
				}
				return 0;
			}, this.copy_buffer = function(e, t, a, s, r) {
				var l = g + 1;
				if (l <= 0) return 0;
				if (0 != s && l > s) return -1;
				if (n.arraycopy(d, 0, t, a, l), g = -1, w = 0, 0 != r) {
					var f = i(1);
					if (f[0] = e.nMusicCRC, m.updateMusicCRC(f, t, a, l), e.nMusicCRC = f[0], l > 0 && (e.VBR_seek_table.nBytesWritten += l), e.decode_on_the_fly) {
						for (var c, u = _([2, 1152]), p = l, v = -1; 0 != v;) if (v = b.hip_decode1_unclipped(e.hip, t, a, p, u[0], u[1]), p = 0, -1 == v && (v = 0), v > 0) {
							if (o(v <= 1152), e.findPeakSample) {
								for (c = 0; c < v; c++) u[0][c] > e.PeakSample ? e.PeakSample = u[0][c] : -u[0][c] > e.PeakSample && (e.PeakSample = -u[0][c]);
								if (e.channels_out > 1) for (c = 0; c < v; c++) u[1][c] > e.PeakSample ? e.PeakSample = u[1][c] : -u[1][c] > e.PeakSample && (e.PeakSample = -u[1][c]);
							}
							if (e.findReplayGain && h.AnalyzeSamples(e.rgdata, u[0], 0, u[1], 0, v, e.channels_out) == GainAnalysis.GAIN_ANALYSIS_ERROR) return -6;
						}
					}
				}
				return l;
			}, this.init_bit_stream_w = function(t) {
				d = r(e.LAME_MAXMP3BUFFER), t.h_ptr = t.w_ptr = 0, t.header[t.h_ptr].write_timing = 0, g = -1, w = 0, v = 0;
			};
		}
		b.EQ = function(e, t) {
			return Math.abs(e) > Math.abs(t) ? Math.abs(e - t) <= 1e-6 * Math.abs(e) : Math.abs(e - t) <= 1e-6 * Math.abs(t);
		}, b.NEQ = function(e, t) {
			return !b.EQ(e, t);
		}, t.exports = b;
	}), L = _((e, t) => {
		var a = h(), n = a.System, s = a.VbrMode;
		a.Float;
		var r = a.ShortBlock;
		a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double;
		var _ = a.new_float;
		a.new_float_n, a.new_int;
		var i = a.new_int_n, o = a.new_short_n, l = a.assert, f = v(), c = g(), u = y(), b = E(), d = k(), w = P(), S = H(), R = I(), A = m();
		t.exports = function e() {
			var t, a, h, m, v, g = p(), M = this;
			e.V9 = 410, e.V8 = 420, e.V7 = 430, e.V6 = 440, e.V5 = 450, e.V4 = 460, e.V3 = 470, e.V2 = 480, e.V1 = 490, e.V0 = 500, e.R3MIX = 1e3, e.STANDARD = 1001, e.EXTREME = 1002, e.INSANE = 1003, e.STANDARD_FAST = 1004, e.EXTREME_FAST = 1005, e.MEDIUM = 1006, e.MEDIUM_FAST = 1007, e.LAME_MAXMP3BUFFER = 147456;
			var B, y, E, T = new f();
			function k() {
				this.mask_adjust = 0, this.mask_adjust_short = 0, this.bo_l_weight = _(A.SBMAX_l), this.bo_s_weight = _(A.SBMAX_s);
			}
			function x() {
				this.lowerlimit = 0;
			}
			function P(e, t) {
				this.lowpass = t;
			}
			this.enc = new A(), this.setModules = function(e, n, s, r, _, i, o, l, f) {
				t = e, a = n, h = s, m = r, v = _, B = i, y = l, E = f, this.enc.setModules(a, T, m, B);
			};
			var I = 4294479419;
			function O(e) {
				return e > 1 ? 0 : e <= 0 ? 1 : Math.cos(Math.PI / 2 * e);
			}
			function V(e, t) {
				switch (e) {
					case 44100: return t.version = 1, 0;
					case 48e3: return t.version = 1, 1;
					case 32e3: return t.version = 1, 2;
					case 22050:
					case 11025: return t.version = 0, 0;
					case 24e3:
					case 12e3: return t.version = 0, 1;
					case 16e3:
					case 8e3: return t.version = 0, 2;
					default: return t.version = 0, -1;
				}
			}
			function H(e, t, a) {
				a < 16e3 && (t = 2);
				for (var n = R.bitrate_table[t][1], s = 2; s <= 14; s++) R.bitrate_table[t][s] > 0 && Math.abs(R.bitrate_table[t][s] - e) < Math.abs(n - e) && (n = R.bitrate_table[t][s]);
				return n;
			}
			function L(e, t, a) {
				a < 16e3 && (t = 2);
				for (var n = 0; n <= 14; n++) if (R.bitrate_table[t][n] > 0 && R.bitrate_table[t][n] == e) return n;
				return -1;
			}
			function N(e, t) {
				e.lowerlimit = [
					new P(8, 2e3),
					new P(16, 3700),
					new P(24, 3900),
					new P(32, 5500),
					new P(40, 7e3),
					new P(48, 7500),
					new P(56, 1e4),
					new P(64, 11e3),
					new P(80, 13500),
					new P(96, 15100),
					new P(112, 15600),
					new P(128, 17e3),
					new P(160, 17500),
					new P(192, 18600),
					new P(224, 19400),
					new P(256, 19700),
					new P(320, 20500)
				][M.nearestBitrateFullIndex(t)].lowpass;
			}
			function D(e) {
				var t = A.BLKSIZE + e.framesize - A.FFTOFFSET;
				return t = Math.max(t, 512 + e.framesize - 32), l(u.MFSIZE >= t), t;
			}
			function X(e, t, a, n, s, r) {
				var _ = M.enc.lame_encode_mp3_frame(e, t, a, n, s, r);
				return e.frameNum++, _;
			}
			function C() {
				this.n_in = 0, this.n_out = 0;
			}
			function F() {
				this.num_used = 0;
			}
			function Y(e, t) {
				return 0 != t ? Y(t, e % t) : e;
			}
			function q(e, t, a) {
				var n = Math.PI * t;
				(e /= a) < 0 && (e = 0), e > 1 && (e = 1);
				var s = e - .5, r = .42 - .5 * Math.cos(2 * e * Math.PI) + .08 * Math.cos(4 * e * Math.PI);
				return Math.abs(s) < 1e-9 ? n / Math.PI : r * Math.sin(a * n * s) / (Math.PI * a * s);
			}
			function j(e, t, a, n, s, r, i, o, f) {
				var h, c, b = e.internal_flags, p = 0, m = e.out_samplerate / Y(e.out_samplerate, e.in_samplerate);
				m > u.BPC && (m = u.BPC);
				var d = Math.abs(b.resample_ratio - Math.floor(.5 + b.resample_ratio)) < 1e-4 ? 1 : 0, v = 1 / b.resample_ratio;
				v > 1 && (v = 1);
				var g = 31;
				0 == g % 2 && --g;
				var w = (g += d) + 1;
				if (0 == b.fill_buffer_resample_init) {
					for (b.inbuf_old[0] = _(w), b.inbuf_old[1] = _(w), h = 0; h <= 2 * m; ++h) b.blackfilt[h] = _(w);
					for (b.itime[0] = 0, b.itime[1] = 0, p = 0; p <= 2 * m; p++) {
						var S = 0, R = (p - m) / (2 * m);
						for (h = 0; h <= g; h++) S += b.blackfilt[p][h] = q(h - R, v, g);
						for (h = 0; h <= g; h++) b.blackfilt[p][h] /= S;
					}
					b.fill_buffer_resample_init = 1;
				}
				var A = b.inbuf_old[f];
				for (c = 0; c < n; c++) {
					var M, B;
					if (M = c * b.resample_ratio, g + (p = 0 | Math.floor(M - b.itime[f])) - g / 2 >= i) break;
					R = M - b.itime[f] - (p + g % 2 * .5);
					l(Math.abs(R) <= .501), B = 0 | Math.floor(2 * R * m + m + .5);
					var y = 0;
					for (h = 0; h <= g; ++h) {
						var E = 0 | h + p - g / 2;
						l(E < i), l(E + w >= 0), y += (E < 0 ? A[w + E] : s[r + E]) * b.blackfilt[B][h];
					}
					t[a + c] = y;
				}
				if (o.num_used = Math.min(i, g + p - g / 2), b.itime[f] += o.num_used - c * b.resample_ratio, o.num_used >= w) for (h = 0; h < w; h++) A[h] = s[r + o.num_used + h - w];
				else {
					var T = w - o.num_used;
					for (h = 0; h < T; ++h) A[h] = A[h + o.num_used];
					for (p = 0; h < w; ++h, ++p) A[h] = s[r + p];
					l(p == o.num_used);
				}
				return c;
			}
			function G(e, t, a, n, s, r) {
				var _ = e.internal_flags;
				if (_.resample_ratio < .9999 || _.resample_ratio > 1.0001) for (var i = 0; i < _.channels_out; i++) {
					var o = new F();
					r.n_out = j(e, t[i], _.mf_size, e.framesize, a[i], n, s, o, i), r.n_in = o.num_used;
				}
				else {
					r.n_out = Math.min(e.framesize, s), r.n_in = r.n_out;
					for (var l = 0; l < r.n_out; ++l) t[0][_.mf_size + l] = a[0][n + l], 2 == _.channels_out && (t[1][_.mf_size + l] = a[1][n + l]);
				}
			}
			this.lame_init = function() {
				var e = new c();
				return 0 != function(e) {
					var t;
					return e.class_id = I, t = e.internal_flags = new u(), e.mode = g.NOT_SET, e.original = 1, e.in_samplerate = 44100, e.num_channels = 2, e.num_samples = -1, e.bWriteVbrTag = !0, e.quality = -1, e.short_blocks = null, t.subblock_gain = -1, e.lowpassfreq = 0, e.highpassfreq = 0, e.lowpasswidth = -1, e.highpasswidth = -1, e.VBR = s.vbr_off, e.VBR_q = 4, e.ATHcurve = -1, e.VBR_mean_bitrate_kbps = 128, e.VBR_min_bitrate_kbps = 0, e.VBR_max_bitrate_kbps = 0, e.VBR_hard_min = 0, t.VBR_min_bitrate = 1, t.VBR_max_bitrate = 13, e.quant_comp = -1, e.quant_comp_short = -1, e.msfix = -1, t.resample_ratio = 1, t.OldValue[0] = 180, t.OldValue[1] = 180, t.CurrentStep[0] = 4, t.CurrentStep[1] = 4, t.masking_lower = 1, t.nsPsy.attackthre = -1, t.nsPsy.attackthre_s = -1, e.scale = -1, e.athaa_type = -1, e.ATHtype = -1, e.athaa_loudapprox = -1, e.athaa_sensitivity = 0, e.useTemporal = null, e.interChRatio = -1, t.mf_samples_to_encode = A.ENCDELAY + A.POSTDELAY, e.encoder_padding = 0, t.mf_size = A.ENCDELAY - A.MDCTDELAY, e.findReplayGain = !1, e.decode_on_the_fly = !1, t.decode_on_the_fly = !1, t.findReplayGain = !1, t.findPeakSample = !1, t.RadioGain = 0, t.AudiophileGain = 0, t.noclipGainChange = 0, t.noclipScale = -1, e.preset = 0, e.write_id3tag_automatic = !0, 0;
				}(e) ? null : (e.lame_allocated_gfp = 1, e);
			}, this.nearestBitrateFullIndex = function(e) {
				var t = [
					8,
					16,
					24,
					32,
					40,
					48,
					56,
					64,
					80,
					96,
					112,
					128,
					160,
					192,
					224,
					256,
					320
				], a = 0, n = 0, s = 0, r = 0;
				r = t[16], s = 16, n = t[16], a = 16;
				for (var _ = 0; _ < 16; _++) if (Math.max(e, t[_ + 1]) != e) {
					r = t[_ + 1], s = _ + 1, n = t[_], a = _;
					break;
				}
				return r - e > e - n ? a : s;
			}, this.lame_init_params = function(e) {
				var _, o, c, u = e.internal_flags;
				if (u.Class_ID = 0, null == u.ATH && (u.ATH = new b()), null == u.PSY && (u.PSY = new k()), null == u.rgdata && (u.rgdata = new d()), u.channels_in = e.num_channels, 1 == u.channels_in && (e.mode = g.MONO), u.channels_out = e.mode == g.MONO ? 1 : 2, u.mode_ext = A.MPG_MD_MS_LR, e.mode == g.MONO && (e.force_ms = !1), e.VBR == s.vbr_off && 128 != e.VBR_mean_bitrate_kbps && 0 == e.brate && (e.brate = e.VBR_mean_bitrate_kbps), e.VBR == s.vbr_off || e.VBR == s.vbr_mtrh || e.VBR == s.vbr_mt || (e.free_format = !1), e.VBR == s.vbr_off && 0 == e.brate && S.EQ(e.compression_ratio, 0) && (e.compression_ratio = 11.025), e.VBR == s.vbr_off && e.compression_ratio > 0 && (0 == e.out_samplerate && (e.out_samplerate = map2MP3Frequency(int(.97 * e.in_samplerate))), e.brate = 0 | 16 * e.out_samplerate * u.channels_out / (1e3 * e.compression_ratio), u.samplerate_index = V(e.out_samplerate, e), e.free_format || (e.brate = H(e.brate, e.version, e.out_samplerate))), 0 != e.out_samplerate && (e.out_samplerate < 16e3 ? (e.VBR_mean_bitrate_kbps = Math.max(e.VBR_mean_bitrate_kbps, 8), e.VBR_mean_bitrate_kbps = Math.min(e.VBR_mean_bitrate_kbps, 64)) : e.out_samplerate < 32e3 ? (e.VBR_mean_bitrate_kbps = Math.max(e.VBR_mean_bitrate_kbps, 8), e.VBR_mean_bitrate_kbps = Math.min(e.VBR_mean_bitrate_kbps, 160)) : (e.VBR_mean_bitrate_kbps = Math.max(e.VBR_mean_bitrate_kbps, 32), e.VBR_mean_bitrate_kbps = Math.min(e.VBR_mean_bitrate_kbps, 320))), 0 == e.lowpassfreq) {
					var p = 16e3;
					switch (e.VBR) {
						case s.vbr_off:
							N(M = new x(), e.brate), p = M.lowerlimit;
							break;
						case s.vbr_abr:
							var M;
							N(M = new x(), e.VBR_mean_bitrate_kbps), p = M.lowerlimit;
							break;
						case s.vbr_rh:
							var P = [
								19500,
								19e3,
								18600,
								18e3,
								17500,
								16e3,
								15600,
								14900,
								12500,
								1e4,
								3950
							];
							if (0 <= e.VBR_q && e.VBR_q <= 9) {
								var D = P[e.VBR_q], X = P[e.VBR_q + 1], C = e.VBR_q_frac;
								p = linear_int(D, X, C);
							} else p = 19500;
							break;
						default:
							P = [
								19500,
								19e3,
								18500,
								18e3,
								17500,
								16500,
								15500,
								14500,
								12500,
								9500,
								3950
							];
							if (0 <= e.VBR_q && e.VBR_q <= 9) {
								D = P[e.VBR_q], X = P[e.VBR_q + 1], C = e.VBR_q_frac;
								p = linear_int(D, X, C);
							} else p = 19500;
					}
					e.mode != g.MONO || e.VBR != s.vbr_off && e.VBR != s.vbr_abr || (p *= 1.5), e.lowpassfreq = 0 | p;
				}
				if (0 == e.out_samplerate && (2 * e.lowpassfreq > e.in_samplerate && (e.lowpassfreq = e.in_samplerate / 2), e.out_samplerate = (_ = 0 | e.lowpassfreq, o = e.in_samplerate, c = 44100, o >= 48e3 ? c = 48e3 : o >= 44100 ? c = 44100 : o >= 32e3 ? c = 32e3 : o >= 24e3 ? c = 24e3 : o >= 22050 ? c = 22050 : o >= 16e3 ? c = 16e3 : o >= 12e3 ? c = 12e3 : o >= 11025 ? c = 11025 : o >= 8e3 && (c = 8e3), -1 == _ ? c : (_ <= 15960 && (c = 44100), _ <= 15250 && (c = 32e3), _ <= 11220 && (c = 24e3), _ <= 9970 && (c = 22050), _ <= 7230 && (c = 16e3), _ <= 5420 && (c = 12e3), _ <= 4510 && (c = 11025), _ <= 3970 && (c = 8e3), o < c ? o > 44100 ? 48e3 : o > 32e3 ? 44100 : o > 24e3 ? 32e3 : o > 22050 ? 24e3 : o > 16e3 ? 22050 : o > 12e3 ? 16e3 : o > 11025 ? 12e3 : o > 8e3 ? 11025 : 8e3 : c))), e.lowpassfreq = Math.min(20500, e.lowpassfreq), e.lowpassfreq = Math.min(e.out_samplerate / 2, e.lowpassfreq), e.VBR == s.vbr_off && (e.compression_ratio = 16 * e.out_samplerate * u.channels_out / (1e3 * e.brate)), e.VBR == s.vbr_abr && (e.compression_ratio = 16 * e.out_samplerate * u.channels_out / (1e3 * e.VBR_mean_bitrate_kbps)), e.bWriteVbrTag || (e.findReplayGain = !1, e.decode_on_the_fly = !1, u.findPeakSample = !1), u.findReplayGain = e.findReplayGain, u.decode_on_the_fly = e.decode_on_the_fly, u.decode_on_the_fly && (u.findPeakSample = !0), u.findReplayGain && t.InitGainAnalysis(u.rgdata, e.out_samplerate) == GainAnalysis.INIT_GAIN_ANALYSIS_ERROR) return e.internal_flags = null, -6;
				switch (u.decode_on_the_fly && !e.decode_only && (null != u.hip && E.hip_decode_exit(u.hip), u.hip = E.hip_decode_init()), u.mode_gr = e.out_samplerate <= 24e3 ? 1 : 2, e.framesize = 576 * u.mode_gr, e.encoder_delay = A.ENCDELAY, u.resample_ratio = e.in_samplerate / e.out_samplerate, e.VBR) {
					case s.vbr_mt:
					case s.vbr_rh:
					case s.vbr_mtrh:
						e.compression_ratio = [
							5.7,
							6.5,
							7.3,
							8.2,
							10,
							11.9,
							13,
							14,
							15,
							16.5
						][e.VBR_q];
						break;
					case s.vbr_abr:
						e.compression_ratio = 16 * e.out_samplerate * u.channels_out / (1e3 * e.VBR_mean_bitrate_kbps);
						break;
					default: e.compression_ratio = 16 * e.out_samplerate * u.channels_out / (1e3 * e.brate);
				}
				if (e.mode == g.NOT_SET && (e.mode = g.JOINT_STEREO), e.highpassfreq > 0 ? (u.highpass1 = 2 * e.highpassfreq, e.highpasswidth >= 0 ? u.highpass2 = 2 * (e.highpassfreq + e.highpasswidth) : u.highpass2 = 2 * e.highpassfreq, u.highpass1 /= e.out_samplerate, u.highpass2 /= e.out_samplerate) : (u.highpass1 = 0, u.highpass2 = 0), e.lowpassfreq > 0 ? (u.lowpass2 = 2 * e.lowpassfreq, e.lowpasswidth >= 0 ? (u.lowpass1 = 2 * (e.lowpassfreq - e.lowpasswidth), u.lowpass1 < 0 && (u.lowpass1 = 0)) : u.lowpass1 = 2 * e.lowpassfreq, u.lowpass1 /= e.out_samplerate, u.lowpass2 /= e.out_samplerate) : (u.lowpass1 = 0, u.lowpass2 = 0), function(e) {
					var t = e.internal_flags, a = 32, s = -1;
					if (t.lowpass1 > 0) {
						for (var r = 999, _ = 0; _ <= 31; _++) (f = _ / 31) >= t.lowpass2 && (a = Math.min(a, _)), t.lowpass1 < f && f < t.lowpass2 && (r = Math.min(r, _));
						t.lowpass1 = 999 == r ? (a - .75) / 31 : (r - .75) / 31, t.lowpass2 = a / 31;
					}
					if (t.highpass2 > 0 && t.highpass2 < .75 / 31 * .9 && (t.highpass1 = 0, t.highpass2 = 0, n.err.println("Warning: highpass filter disabled.  highpass frequency too small\n")), t.highpass2 > 0) {
						var i = -1;
						for (_ = 0; _ <= 31; _++) (f = _ / 31) <= t.highpass1 && (s = Math.max(s, _)), t.highpass1 < f && f < t.highpass2 && (i = Math.max(i, _));
						t.highpass1 = s / 31, t.highpass2 = -1 == i ? (s + .75) / 31 : (i + .75) / 31;
					}
					for (_ = 0; _ < 32; _++) {
						var o, l, f = _ / 31;
						o = t.highpass2 > t.highpass1 ? O((t.highpass2 - f) / (t.highpass2 - t.highpass1 + 1e-20)) : 1, l = t.lowpass2 > t.lowpass1 ? O((f - t.lowpass1) / (t.lowpass2 - t.lowpass1 + 1e-20)) : 1, t.amp_filter[_] = o * l;
					}
				}(e), u.samplerate_index = V(e.out_samplerate, e), u.samplerate_index < 0) return e.internal_flags = null, -1;
				if (e.VBR == s.vbr_off) {
					if (e.free_format) u.bitrate_index = 0;
					else if (e.brate = H(e.brate, e.version, e.out_samplerate), u.bitrate_index = L(e.brate, e.version, e.out_samplerate), u.bitrate_index <= 0) return e.internal_flags = null, -1;
				} else u.bitrate_index = 1;
				e.analysis && (e.bWriteVbrTag = !1), null != u.pinfo && (e.bWriteVbrTag = !1), a.init_bit_stream_w(u);
				for (var F, Y = u.samplerate_index + 3 * e.version + 6 * (e.out_samplerate < 16e3 ? 1 : 0), q = 0; q < A.SBMAX_l + 1; q++) u.scalefac_band.l[q] = m.sfBandIndex[Y].l[q];
				for (q = 0; q < A.PSFB21 + 1; q++) {
					var j = (u.scalefac_band.l[22] - u.scalefac_band.l[21]) / A.PSFB21, G = u.scalefac_band.l[21] + q * j;
					u.scalefac_band.psfb21[q] = G;
				}
				u.scalefac_band.psfb21[A.PSFB21] = 576;
				for (q = 0; q < A.SBMAX_s + 1; q++) u.scalefac_band.s[q] = m.sfBandIndex[Y].s[q];
				for (q = 0; q < A.PSFB12 + 1; q++) {
					j = (u.scalefac_band.s[13] - u.scalefac_band.s[12]) / A.PSFB12, G = u.scalefac_band.s[12] + q * j;
					u.scalefac_band.psfb12[q] = G;
				}
				for (u.scalefac_band.psfb12[A.PSFB12] = 192, 1 == e.version ? u.sideinfo_len = 1 == u.channels_out ? 21 : 36 : u.sideinfo_len = 1 == u.channels_out ? 13 : 21, e.error_protection && (u.sideinfo_len += 2), function(e) {
					var t = e.internal_flags;
					e.frameNum = 0, e.write_id3tag_automatic && y.id3tag_write_v2(e), t.bitrate_stereoMode_Hist = i([16, 5]), t.bitrate_blockType_Hist = i([16, 6]), t.PeakSample = 0, e.bWriteVbrTag && B.InitVbrTag(e);
				}(e), u.Class_ID = I, F = 0; F < 19; F++) u.nsPsy.pefirbuf[F] = 700 * u.mode_gr * u.channels_out;
				switch (-1 == e.ATHtype && (e.ATHtype = 4), l(e.VBR_q <= 9), l(e.VBR_q >= 0), e.VBR) {
					case s.vbr_mt: e.VBR = s.vbr_mtrh;
					case s.vbr_mtrh:
						null == e.useTemporal && (e.useTemporal = !1), h.apply_preset(e, 500 - 10 * e.VBR_q, 0), e.quality < 0 && (e.quality = LAME_DEFAULT_QUALITY), e.quality < 5 && (e.quality = 0), e.quality > 5 && (e.quality = 5), u.PSY.mask_adjust = e.maskingadjust, u.PSY.mask_adjust_short = e.maskingadjust_short, e.experimentalY ? u.sfb21_extra = !1 : u.sfb21_extra = e.out_samplerate > 44e3, u.iteration_loop = new VBRNewIterationLoop(v);
						break;
					case s.vbr_rh:
						h.apply_preset(e, 500 - 10 * e.VBR_q, 0), u.PSY.mask_adjust = e.maskingadjust, u.PSY.mask_adjust_short = e.maskingadjust_short, e.experimentalY ? u.sfb21_extra = !1 : u.sfb21_extra = e.out_samplerate > 44e3, e.quality > 6 && (e.quality = 6), e.quality < 0 && (e.quality = LAME_DEFAULT_QUALITY), u.iteration_loop = new VBROldIterationLoop(v);
						break;
					default:
						var U;
						u.sfb21_extra = !1, e.quality < 0 && (e.quality = LAME_DEFAULT_QUALITY), (U = e.VBR) == s.vbr_off && (e.VBR_mean_bitrate_kbps = e.brate), h.apply_preset(e, e.VBR_mean_bitrate_kbps, 0), e.VBR = U, u.PSY.mask_adjust = e.maskingadjust, u.PSY.mask_adjust_short = e.maskingadjust_short, U == s.vbr_off ? u.iteration_loop = new w(v) : u.iteration_loop = new ABRIterationLoop(v);
				}
				if (l(e.scale >= 0), e.VBR != s.vbr_off) {
					if (u.VBR_min_bitrate = 1, u.VBR_max_bitrate = 14, e.out_samplerate < 16e3 && (u.VBR_max_bitrate = 8), 0 != e.VBR_min_bitrate_kbps && (e.VBR_min_bitrate_kbps = H(e.VBR_min_bitrate_kbps, e.version, e.out_samplerate), u.VBR_min_bitrate = L(e.VBR_min_bitrate_kbps, e.version, e.out_samplerate), u.VBR_min_bitrate < 0)) return -1;
					if (0 != e.VBR_max_bitrate_kbps && (e.VBR_max_bitrate_kbps = H(e.VBR_max_bitrate_kbps, e.version, e.out_samplerate), u.VBR_max_bitrate = L(e.VBR_max_bitrate_kbps, e.version, e.out_samplerate), u.VBR_max_bitrate < 0)) return -1;
					e.VBR_min_bitrate_kbps = R.bitrate_table[e.version][u.VBR_min_bitrate], e.VBR_max_bitrate_kbps = R.bitrate_table[e.version][u.VBR_max_bitrate], e.VBR_mean_bitrate_kbps = Math.min(R.bitrate_table[e.version][u.VBR_max_bitrate], e.VBR_mean_bitrate_kbps), e.VBR_mean_bitrate_kbps = Math.max(R.bitrate_table[e.version][u.VBR_min_bitrate], e.VBR_mean_bitrate_kbps);
				}
				return e.tune && (u.PSY.mask_adjust += e.tune_value_a, u.PSY.mask_adjust_short += e.tune_value_a), function(e) {
					var t = e.internal_flags;
					switch (e.quality) {
						default:
						case 9:
							t.psymodel = 0, t.noise_shaping = 0, t.noise_shaping_amp = 0, t.noise_shaping_stop = 0, t.use_best_huffman = 0, t.full_outer_loop = 0;
							break;
						case 8: e.quality = 7;
						case 7:
							t.psymodel = 1, t.noise_shaping = 0, t.noise_shaping_amp = 0, t.noise_shaping_stop = 0, t.use_best_huffman = 0, t.full_outer_loop = 0;
							break;
						case 6:
						case 5:
							t.psymodel = 1, 0 == t.noise_shaping && (t.noise_shaping = 1), t.noise_shaping_amp = 0, t.noise_shaping_stop = 0, -1 == t.subblock_gain && (t.subblock_gain = 1), t.use_best_huffman = 0, t.full_outer_loop = 0;
							break;
						case 4:
							t.psymodel = 1, 0 == t.noise_shaping && (t.noise_shaping = 1), t.noise_shaping_amp = 0, t.noise_shaping_stop = 0, -1 == t.subblock_gain && (t.subblock_gain = 1), t.use_best_huffman = 1, t.full_outer_loop = 0;
							break;
						case 3:
							t.psymodel = 1, 0 == t.noise_shaping && (t.noise_shaping = 1), t.noise_shaping_amp = 1, t.noise_shaping_stop = 1, -1 == t.subblock_gain && (t.subblock_gain = 1), t.use_best_huffman = 1, t.full_outer_loop = 0;
							break;
						case 2:
							t.psymodel = 1, 0 == t.noise_shaping && (t.noise_shaping = 1), 0 == t.substep_shaping && (t.substep_shaping = 2), t.noise_shaping_amp = 1, t.noise_shaping_stop = 1, -1 == t.subblock_gain && (t.subblock_gain = 1), t.use_best_huffman = 1, t.full_outer_loop = 0;
							break;
						case 1:
						case 0: t.psymodel = 1, 0 == t.noise_shaping && (t.noise_shaping = 1), 0 == t.substep_shaping && (t.substep_shaping = 2), t.noise_shaping_amp = 2, t.noise_shaping_stop = 1, -1 == t.subblock_gain && (t.subblock_gain = 1), t.use_best_huffman = 1, t.full_outer_loop = 0;
					}
				}(e), l(e.scale >= 0), e.athaa_type < 0 ? u.ATH.useAdjust = 3 : u.ATH.useAdjust = e.athaa_type, u.ATH.aaSensitivityP = Math.pow(10, e.athaa_sensitivity / -10), null == e.short_blocks && (e.short_blocks = r.short_block_allowed), e.short_blocks != r.short_block_allowed || e.mode != g.JOINT_STEREO && e.mode != g.STEREO || (e.short_blocks = r.short_block_coupled), e.quant_comp < 0 && (e.quant_comp = 1), e.quant_comp_short < 0 && (e.quant_comp_short = 0), e.msfix < 0 && (e.msfix = 0), e.exp_nspsytune = 1 | e.exp_nspsytune, e.internal_flags.nsPsy.attackthre < 0 && (e.internal_flags.nsPsy.attackthre = f.NSATTACKTHRE), e.internal_flags.nsPsy.attackthre_s < 0 && (e.internal_flags.nsPsy.attackthre_s = f.NSATTACKTHRE_S), l(e.scale >= 0), e.scale < 0 && (e.scale = 1), e.ATHtype < 0 && (e.ATHtype = 4), e.ATHcurve < 0 && (e.ATHcurve = 4), e.athaa_loudapprox < 0 && (e.athaa_loudapprox = 2), e.interChRatio < 0 && (e.interChRatio = 0), null == e.useTemporal && (e.useTemporal = !0), u.slot_lag = u.frac_SpF = 0, e.VBR == s.vbr_off && (u.slot_lag = u.frac_SpF = 72e3 * (e.version + 1) * e.brate % e.out_samplerate | 0), m.iteration_init(e), T.psymodel_init(e), l(e.scale >= 0), 0;
			}, this.lame_encode_flush = function(e, t, n, s) {
				var r, _, i, l, f = e.internal_flags, h = o([2, 1152]), c = 0, u = f.mf_samples_to_encode - A.POSTDELAY, b = D(e);
				if (f.mf_samples_to_encode < 1) return 0;
				for (r = 0, e.in_samplerate != e.out_samplerate && (u += 16 * e.out_samplerate / e.in_samplerate), (i = e.framesize - u % e.framesize) < 576 && (i += e.framesize), e.encoder_padding = i, l = (u + i) / e.framesize; l > 0 && c >= 0;) {
					var p = b - f.mf_size, m = e.frameNum;
					p *= e.in_samplerate, (p /= e.out_samplerate) > 1152 && (p = 1152), p < 1 && (p = 1), _ = s - r, 0 == s && (_ = 0), n += c = this.lame_encode_buffer(e, h[0], h[1], p, t, n, _), r += c, l -= m != e.frameNum ? 1 : 0;
				}
				if (f.mf_samples_to_encode = 0, c < 0) return c;
				if (_ = s - r, 0 == s && (_ = 0), a.flush_bitstream(e), (c = a.copy_buffer(f, t, n, _, 1)) < 0) return c;
				if (n += c, _ = s - (r += c), 0 == s && (_ = 0), e.write_id3tag_automatic) {
					if (y.id3tag_write_v1(e), (c = a.copy_buffer(f, t, n, _, 0)) < 0) return c;
					r += c;
				}
				return r;
			}, this.lame_encode_buffer = function(e, n, s, r, i, o, f) {
				var h = e.internal_flags, c = [null, null];
				if (h.Class_ID != I) return -3;
				if (0 == r) return 0;
				(function(e, t) {
					(null == e.in_buffer_0 || e.in_buffer_nsamples < t) && (e.in_buffer_0 = _(t), e.in_buffer_1 = _(t), e.in_buffer_nsamples = t);
				})(h, r), c[0] = h.in_buffer_0, c[1] = h.in_buffer_1;
				for (var b = 0; b < r; b++) c[0][b] = n[b], h.channels_in > 1 && (c[1][b] = s[b]);
				return function(e, n, s, r, _, i, o) {
					var f, h, c, b, p, m = e.internal_flags, d = 0, v = [null, null], g = [null, null];
					if (m.Class_ID != I) return -3;
					if (0 == r) return 0;
					if (p = a.copy_buffer(m, _, i, o, 0), p < 0) return p;
					if (i += p, d += p, g[0] = n, g[1] = s, S.NEQ(e.scale, 0) && S.NEQ(e.scale, 1)) for (h = 0; h < r; ++h) g[0][h] *= e.scale, 2 == m.channels_out && (g[1][h] *= e.scale);
					if (S.NEQ(e.scale_left, 0) && S.NEQ(e.scale_left, 1)) for (h = 0; h < r; ++h) g[0][h] *= e.scale_left;
					if (S.NEQ(e.scale_right, 0) && S.NEQ(e.scale_right, 1)) for (h = 0; h < r; ++h) g[1][h] *= e.scale_right;
					if (2 == e.num_channels && 1 == m.channels_out) for (h = 0; h < r; ++h) g[0][h] = .5 * (g[0][h] + g[1][h]), g[1][h] = 0;
					b = D(e), v[0] = m.mfbuf[0], v[1] = m.mfbuf[1];
					var w = 0;
					for (; r > 0;) {
						var R = [null, null], M = 0, B = 0;
						R[0] = g[0], R[1] = g[1];
						var y = new C();
						if (G(e, v, R, w, r, y), M = y.n_in, B = y.n_out, m.findReplayGain && !m.decode_on_the_fly && t.AnalyzeSamples(m.rgdata, v[0], m.mf_size, v[1], m.mf_size, B, m.channels_out) == GainAnalysis.GAIN_ANALYSIS_ERROR) return -6;
						if (r -= M, w += M, m.channels_out, m.mf_size += B, l(m.mf_size <= u.MFSIZE), m.mf_samples_to_encode < 1 && (m.mf_samples_to_encode = A.ENCDELAY + A.POSTDELAY), m.mf_samples_to_encode += B, m.mf_size >= b) {
							var E = o - d;
							if (0 == o && (E = 0), (f = X(e, v[0], v[1], _, i, E)) < 0) return f;
							for (i += f, d += f, m.mf_size -= e.framesize, m.mf_samples_to_encode -= e.framesize, c = 0; c < m.channels_out; c++) for (h = 0; h < m.mf_size; h++) v[c][h] = v[c][h + e.framesize];
						}
					}
					return l(0 == r), d;
				}(e, c[0], c[1], r, i, o, f);
			};
		};
	}), N = _((e, t) => {
		var a = h();
		a.System;
		var n = a.VbrMode;
		a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n, a.new_byte, a.new_double, a.new_float, a.new_float_n, a.new_int, a.new_int_n, a.assert, t.exports = function() {
			var e, t = L();
			function a(e, t, a, n, s, r, _, i, o, l, f, h, c, u, b) {
				this.vbr_q = e, this.quant_comp = t, this.quant_comp_s = a, this.expY = n, this.st_lrm = s, this.st_s = r, this.masking_adj = _, this.masking_adj_short = i, this.ath_lower = o, this.ath_curve = l, this.ath_sensitivity = f, this.interch = h, this.safejoint = c, this.sfb21mod = u, this.msfix = b;
			}
			function s(e, t, a, n, s, r, _, i, o, l, f, h, c, u) {
				this.quant_comp = t, this.quant_comp_s = a, this.safejoint = n, this.nsmsfix = s, this.st_lrm = r, this.st_s = _, this.nsbass = i, this.scale = o, this.masking_adj = l, this.ath_lower = f, this.ath_curve = h, this.interch = c, this.sfscale = u;
			}
			this.setModules = function(t) {
				e = t;
			};
			var r = [
				new a(0, 9, 9, 0, 5.2, 125, -4.2, -6.3, 4.8, 1, 0, 0, 2, 21, .97),
				new a(1, 9, 9, 0, 5.3, 125, -3.6, -5.6, 4.5, 1.5, 0, 0, 2, 21, 1.35),
				new a(2, 9, 9, 0, 5.6, 125, -2.2, -3.5, 2.8, 2, 0, 0, 2, 21, 1.49),
				new a(3, 9, 9, 1, 5.8, 130, -1.8, -2.8, 2.6, 3, -4, 0, 2, 20, 1.64),
				new a(4, 9, 9, 1, 6, 135, -.7, -1.1, 1.1, 3.5, -8, 0, 2, 0, 1.79),
				new a(5, 9, 9, 1, 6.4, 140, .5, .4, -7.5, 4, -12, 2e-4, 0, 0, 1.95),
				new a(6, 9, 9, 1, 6.6, 145, .67, .65, -14.7, 6.5, -19, 4e-4, 0, 0, 2.3),
				new a(7, 9, 9, 1, 6.6, 145, .8, .75, -19.7, 8, -22, 6e-4, 0, 0, 2.7),
				new a(8, 9, 9, 1, 6.6, 145, 1.2, 1.15, -27.5, 10, -23, 7e-4, 0, 0, 0),
				new a(9, 9, 9, 1, 6.6, 145, 1.6, 1.6, -36, 11, -25, 8e-4, 0, 0, 0),
				new a(10, 9, 9, 1, 6.6, 145, 2, 2, -36, 12, -25, 8e-4, 0, 0, 0)
			], _ = [
				new a(0, 9, 9, 0, 4.2, 25, -7, -4, 7.5, 1, 0, 0, 2, 26, .97),
				new a(1, 9, 9, 0, 4.2, 25, -5.6, -3.6, 4.5, 1.5, 0, 0, 2, 21, 1.35),
				new a(2, 9, 9, 0, 4.2, 25, -4.4, -1.8, 2, 2, 0, 0, 2, 18, 1.49),
				new a(3, 9, 9, 1, 4.2, 25, -3.4, -1.25, 1.1, 3, -4, 0, 2, 15, 1.64),
				new a(4, 9, 9, 1, 4.2, 25, -2.2, .1, 0, 3.5, -8, 0, 2, 0, 1.79),
				new a(5, 9, 9, 1, 4.2, 25, -1, 1.65, -7.7, 4, -12, 2e-4, 0, 0, 1.95),
				new a(6, 9, 9, 1, 4.2, 25, -0, 2.47, -7.7, 6.5, -19, 4e-4, 0, 0, 2),
				new a(7, 9, 9, 1, 4.2, 25, .5, 2, -14.5, 8, -22, 6e-4, 0, 0, 2),
				new a(8, 9, 9, 1, 4.2, 25, 1, 2.4, -22, 10, -23, 7e-4, 0, 0, 2),
				new a(9, 9, 9, 1, 4.2, 25, 1.5, 2.95, -30, 11, -25, 8e-4, 0, 0, 2),
				new a(10, 9, 9, 1, 4.2, 25, 2, 2.95, -36, 12, -30, 8e-4, 0, 0, 2)
			];
			function i(e, t, a) {
				var s = e.VBR == n.vbr_rh ? r : _, i = e.VBR_q_frac, o = s[t], l = s[t + 1], f = o;
				o.st_lrm = o.st_lrm + i * (l.st_lrm - o.st_lrm), o.st_s = o.st_s + i * (l.st_s - o.st_s), o.masking_adj = o.masking_adj + i * (l.masking_adj - o.masking_adj), o.masking_adj_short = o.masking_adj_short + i * (l.masking_adj_short - o.masking_adj_short), o.ath_lower = o.ath_lower + i * (l.ath_lower - o.ath_lower), o.ath_curve = o.ath_curve + i * (l.ath_curve - o.ath_curve), o.ath_sensitivity = o.ath_sensitivity + i * (l.ath_sensitivity - o.ath_sensitivity), o.interch = o.interch + i * (l.interch - o.interch), o.msfix = o.msfix + i * (l.msfix - o.msfix), function(e, t) {
					0 > t && (t = 0);
					9 < t && (t = 9);
					e.VBR_q = t, e.VBR_q_frac = 0;
				}(e, f.vbr_q), 0 != a ? e.quant_comp = f.quant_comp : Math.abs(e.quant_comp - -1) > 0 || (e.quant_comp = f.quant_comp), 0 != a ? e.quant_comp_short = f.quant_comp_s : Math.abs(e.quant_comp_short - -1) > 0 || (e.quant_comp_short = f.quant_comp_s), 0 != f.expY && (e.experimentalY = 0 != f.expY), 0 != a ? e.internal_flags.nsPsy.attackthre = f.st_lrm : Math.abs(e.internal_flags.nsPsy.attackthre - -1) > 0 || (e.internal_flags.nsPsy.attackthre = f.st_lrm), 0 != a ? e.internal_flags.nsPsy.attackthre_s = f.st_s : Math.abs(e.internal_flags.nsPsy.attackthre_s - -1) > 0 || (e.internal_flags.nsPsy.attackthre_s = f.st_s), 0 != a ? e.maskingadjust = f.masking_adj : Math.abs(e.maskingadjust - 0) > 0 || (e.maskingadjust = f.masking_adj), 0 != a ? e.maskingadjust_short = f.masking_adj_short : Math.abs(e.maskingadjust_short - 0) > 0 || (e.maskingadjust_short = f.masking_adj_short), 0 != a ? e.ATHlower = -f.ath_lower / 10 : Math.abs(10 * -e.ATHlower - 0) > 0 || (e.ATHlower = -f.ath_lower / 10), 0 != a ? e.ATHcurve = f.ath_curve : Math.abs(e.ATHcurve - -1) > 0 || (e.ATHcurve = f.ath_curve), 0 != a ? e.athaa_sensitivity = f.ath_sensitivity : Math.abs(e.athaa_sensitivity - -1) > 0 || (e.athaa_sensitivity = f.ath_sensitivity), f.interch > 0 && (0 != a ? e.interChRatio = f.interch : Math.abs(e.interChRatio - -1) > 0 || (e.interChRatio = f.interch)), f.safejoint > 0 && (e.exp_nspsytune = e.exp_nspsytune | f.safejoint), f.sfb21mod > 0 && (e.exp_nspsytune = e.exp_nspsytune | f.sfb21mod << 20), 0 != a ? e.msfix = f.msfix : Math.abs(e.msfix - -1) > 0 || (e.msfix = f.msfix), 0 == a && (e.VBR_q = t, e.VBR_q_frac = i);
			}
			var o = [
				new s(8, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -30, 11, .0012, 1),
				new s(16, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -25, 11, .001, 1),
				new s(24, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -20, 11, .001, 1),
				new s(32, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -15, 11, .001, 1),
				new s(40, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -10, 11, 9e-4, 1),
				new s(48, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -10, 11, 9e-4, 1),
				new s(56, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -6, 11, 8e-4, 1),
				new s(64, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -2, 11, 8e-4, 1),
				new s(80, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, 0, 8, 7e-4, 1),
				new s(96, 9, 9, 0, 2.5, 6.6, 145, 0, .95, 0, 1, 5.5, 6e-4, 1),
				new s(112, 9, 9, 0, 2.25, 6.6, 145, 0, .95, 0, 2, 4.5, 5e-4, 1),
				new s(128, 9, 9, 0, 1.95, 6.4, 140, 0, .95, 0, 3, 4, 2e-4, 1),
				new s(160, 9, 9, 1, 1.79, 6, 135, 0, .95, -2, 5, 3.5, 0, 1),
				new s(192, 9, 9, 1, 1.49, 5.6, 125, 0, .97, -4, 7, 3, 0, 0),
				new s(224, 9, 9, 1, 1.25, 5.2, 125, 0, .98, -6, 9, 2, 0, 0),
				new s(256, 9, 9, 1, .97, 5.2, 125, 0, 1, -8, 10, 1, 0, 0),
				new s(320, 9, 9, 1, .9, 5.2, 125, 0, 1, -10, 12, 0, 0, 0)
			];
			function l(t, a, s) {
				var r = a, _ = e.nearestBitrateFullIndex(a);
				if (t.VBR = n.vbr_abr, t.VBR_mean_bitrate_kbps = r, t.VBR_mean_bitrate_kbps = Math.min(t.VBR_mean_bitrate_kbps, 320), t.VBR_mean_bitrate_kbps = Math.max(t.VBR_mean_bitrate_kbps, 8), t.brate = t.VBR_mean_bitrate_kbps, t.VBR_mean_bitrate_kbps > 320 && (t.disable_reservoir = !0), o[_].safejoint > 0 && (t.exp_nspsytune = 2 | t.exp_nspsytune), o[_].sfscale > 0 && (t.internal_flags.noise_shaping = 2), Math.abs(o[_].nsbass) > 0) {
					var i = int(4 * o[_].nsbass);
					i < 0 && (i += 64), t.exp_nspsytune = t.exp_nspsytune | i << 2;
				}
				return 0 != s ? t.quant_comp = o[_].quant_comp : Math.abs(t.quant_comp - -1) > 0 || (t.quant_comp = o[_].quant_comp), 0 != s ? t.quant_comp_short = o[_].quant_comp_s : Math.abs(t.quant_comp_short - -1) > 0 || (t.quant_comp_short = o[_].quant_comp_s), 0 != s ? t.msfix = o[_].nsmsfix : Math.abs(t.msfix - -1) > 0 || (t.msfix = o[_].nsmsfix), 0 != s ? t.internal_flags.nsPsy.attackthre = o[_].st_lrm : Math.abs(t.internal_flags.nsPsy.attackthre - -1) > 0 || (t.internal_flags.nsPsy.attackthre = o[_].st_lrm), 0 != s ? t.internal_flags.nsPsy.attackthre_s = o[_].st_s : Math.abs(t.internal_flags.nsPsy.attackthre_s - -1) > 0 || (t.internal_flags.nsPsy.attackthre_s = o[_].st_s), 0 != s ? t.scale = o[_].scale : Math.abs(t.scale - -1) > 0 || (t.scale = o[_].scale), 0 != s ? t.maskingadjust = o[_].masking_adj : Math.abs(t.maskingadjust - 0) > 0 || (t.maskingadjust = o[_].masking_adj), o[_].masking_adj > 0 ? 0 != s ? t.maskingadjust_short = .9 * o[_].masking_adj : Math.abs(t.maskingadjust_short - 0) > 0 || (t.maskingadjust_short = .9 * o[_].masking_adj) : 0 != s ? t.maskingadjust_short = 1.1 * o[_].masking_adj : Math.abs(t.maskingadjust_short - 0) > 0 || (t.maskingadjust_short = 1.1 * o[_].masking_adj), 0 != s ? t.ATHlower = -o[_].ath_lower / 10 : Math.abs(10 * -t.ATHlower - 0) > 0 || (t.ATHlower = -o[_].ath_lower / 10), 0 != s ? t.ATHcurve = o[_].ath_curve : Math.abs(t.ATHcurve - -1) > 0 || (t.ATHcurve = o[_].ath_curve), 0 != s ? t.interChRatio = o[_].interch : Math.abs(t.interChRatio - -1) > 0 || (t.interChRatio = o[_].interch), a;
			}
			this.apply_preset = function(e, a, s) {
				switch (a) {
					case t.R3MIX:
						a = t.V3, e.VBR = n.vbr_mtrh;
						break;
					case t.MEDIUM:
						a = t.V4, e.VBR = n.vbr_rh;
						break;
					case t.MEDIUM_FAST:
						a = t.V4, e.VBR = n.vbr_mtrh;
						break;
					case t.STANDARD:
						a = t.V2, e.VBR = n.vbr_rh;
						break;
					case t.STANDARD_FAST:
						a = t.V2, e.VBR = n.vbr_mtrh;
						break;
					case t.EXTREME:
						a = t.V0, e.VBR = n.vbr_rh;
						break;
					case t.EXTREME_FAST:
						a = t.V0, e.VBR = n.vbr_mtrh;
						break;
					case t.INSANE: return a = 320, e.preset = a, l(e, a, s), e.VBR = n.vbr_off, a;
				}
				switch (e.preset = a, a) {
					case t.V9: return i(e, 9, s), a;
					case t.V8: return i(e, 8, s), a;
					case t.V7: return i(e, 7, s), a;
					case t.V6: return i(e, 6, s), a;
					case t.V5: return i(e, 5, s), a;
					case t.V4: return i(e, 4, s), a;
					case t.V3: return i(e, 3, s), a;
					case t.V2: return i(e, 2, s), a;
					case t.V1: return i(e, 1, s), a;
					case t.V0: return i(e, 0, s), a;
				}
				return 8 <= a && a <= 320 ? l(e, a, s) : (e.preset = 0, a);
			};
		};
	}), D = _((e, t) => {
		t.exports = function() {
			this.setModules = function(e, t) {};
		};
	}), X = _((e, t) => {
		t.exports = function() {
			this.over_noise = 0, this.tot_noise = 0, this.max_noise = 0, this.over_count = 0, this.over_SSD = 0, this.bits = 0;
		};
	}), C = _((e, t) => {
		var a = h(), n = a.new_float, s = a.new_int;
		a.assert, t.exports = function() {
			this.global_gain = 0, this.sfb_count1 = 0, this.step = s(39), this.noise = n(39), this.noise_log = n(39);
		};
	}), F = _((e, t) => {
		var a = h(), n = a.System, s = a.VbrMode;
		a.Float, a.ShortBlock;
		var r = a.Util, _ = a.Arrays;
		a.new_array_n, a.new_byte, a.new_double;
		var i = a.new_float;
		a.new_float_n, a.new_int, a.new_int_n;
		var o = a.assert, l = D(), f = X(), c = C(), u = m(), b = S(), p = w();
		t.exports = function() {
			var e, t, a;
			this.rv = null, this.qupvt = null;
			var h, m = new l();
			function d(e) {
				this.ordinal = e;
			}
			function v(e) {
				for (var t = 0; t < e.sfbmax; t++) if (e.scalefac[t] + e.subblock_gain[e.window[t]] == 0) return !1;
				return !0;
			}
			function g(e) {
				return r.FAST_LOG10(.368 + .632 * e * e * e);
			}
			function w(e, t, a, n, s) {
				var r;
				switch (e) {
					default:
					case 9:
						t.over_count > 0 ? (r = a.over_SSD <= t.over_SSD, a.over_SSD == t.over_SSD && (r = a.bits < t.bits)) : r = a.max_noise < 0 && 10 * a.max_noise + a.bits <= 10 * t.max_noise + t.bits;
						break;
					case 0:
						r = a.over_count < t.over_count || a.over_count == t.over_count && a.over_noise < t.over_noise || a.over_count == t.over_count && BitStream.EQ(a.over_noise, t.over_noise) && a.tot_noise < t.tot_noise;
						break;
					case 8: a.max_noise = function(e, t) {
						for (var a = 1e-37, n = 0; n < t.psymax; n++) a += g(e[n]);
						return Math.max(1e-20, a);
					}(s, n);
					case 1:
						r = a.max_noise < t.max_noise;
						break;
					case 2:
						r = a.tot_noise < t.tot_noise;
						break;
					case 3:
						r = a.tot_noise < t.tot_noise && a.max_noise < t.max_noise;
						break;
					case 4:
						r = a.max_noise <= 0 && t.max_noise > .2 || a.max_noise <= 0 && t.max_noise < 0 && t.max_noise > a.max_noise - .2 && a.tot_noise < t.tot_noise || a.max_noise <= 0 && t.max_noise > 0 && t.max_noise > a.max_noise - .2 && a.tot_noise < t.tot_noise + t.over_noise || a.max_noise > 0 && t.max_noise > -.05 && t.max_noise > a.max_noise - .1 && a.tot_noise + a.over_noise < t.tot_noise + t.over_noise || a.max_noise > 0 && t.max_noise > -.1 && t.max_noise > a.max_noise - .15 && a.tot_noise + a.over_noise + a.over_noise < t.tot_noise + t.over_noise + t.over_noise;
						break;
					case 5:
						r = a.over_noise < t.over_noise || BitStream.EQ(a.over_noise, t.over_noise) && a.tot_noise < t.tot_noise;
						break;
					case 6:
						r = a.over_noise < t.over_noise || BitStream.EQ(a.over_noise, t.over_noise) && (a.max_noise < t.max_noise || BitStream.EQ(a.max_noise, t.max_noise) && a.tot_noise <= t.tot_noise);
						break;
					case 7: r = a.over_count < t.over_count || a.over_noise < t.over_noise;
				}
				return 0 == t.over_count && (r = r && a.bits < t.bits), r;
			}
			function S(e, t, n, s, r) {
				var i = e.internal_flags;
				(function(e, t, a, n, s) {
					var r, _ = e.internal_flags;
					r = 0 == t.scalefac_scale ? 1.2968395546510096 : 1.6817928305074292;
					for (var i = 0, o = 0; o < t.sfbmax; o++) i < a[o] && (i = a[o]);
					var l = _.noise_shaping_amp;
					switch (3 == l && (l = s ? 2 : 1), l) {
						case 2: break;
						case 1:
							i > 1 ? i = Math.pow(i, .5) : i *= .95;
							break;
						default: i > 1 ? i = 1 : i *= .95;
					}
					var f = 0;
					for (o = 0; o < t.sfbmax; o++) {
						var h, c = t.width[o];
						if (f += c, !(a[o] < i)) {
							if (2 & _.substep_shaping && (_.pseudohalf[o] = 0 == _.pseudohalf[o] ? 1 : 0, 0 == _.pseudohalf[o] && 2 == _.noise_shaping_amp)) return;
							for (t.scalefac[o]++, h = -c; h < 0; h++) n[f + h] *= r, n[f + h] > t.xrpow_max && (t.xrpow_max = n[f + h]);
							if (2 == _.noise_shaping_amp) return;
						}
					}
				})(e, t, n, s, r);
				var l = v(t);
				return !l && (!(l = 2 == i.mode_gr ? h.scale_bitcount(t) : h.scale_bitcount_lsf(i, t)) || (i.noise_shaping > 1 && (_.fill(i.pseudohalf, 0), 0 == t.scalefac_scale ? (function(e, t) {
					for (var n = 0, s = 0; s < e.sfbmax; s++) {
						var r = e.width[s], _ = e.scalefac[s];
						if (0 != e.preflag && (_ += a.pretab[s]), n += r, 1 & _) {
							_++;
							for (var i = -r; i < 0; i++) t[n + i] *= 1.2968395546510096, t[n + i] > e.xrpow_max && (e.xrpow_max = t[n + i]);
						}
						e.scalefac[s] = _ >> 1;
					}
					e.preflag = 0, e.scalefac_scale = 1;
				}(t, s), l = !1) : t.block_type == u.SHORT_TYPE && i.subblock_gain > 0 && (l = function(e, t, n) {
					var s, r = t.scalefac;
					for (s = 0; s < t.sfb_lmax; s++) if (r[s] >= 16) return !0;
					for (var _ = 0; _ < 3; _++) {
						var i = 0, l = 0;
						for (s = t.sfb_lmax + _; s < t.sfbdivide; s += 3) i < r[s] && (i = r[s]);
						for (; s < t.sfbmax; s += 3) l < r[s] && (l = r[s]);
						if (!(i < 16 && l < 8)) {
							if (t.subblock_gain[_] >= 7) return !0;
							t.subblock_gain[_]++;
							var f = e.scalefac_band.l[t.sfb_lmax];
							for (s = t.sfb_lmax + _; s < t.sfbmax; s += 3) {
								var h = t.width[s], c = r[s];
								if (o(c >= 0), (c -= 4 >> t.scalefac_scale) >= 0) r[s] = c, f += 3 * h;
								else {
									r[s] = 0;
									var u = 210 + (c << t.scalefac_scale + 1);
									p = a.IPOW20(u), f += h * (_ + 1);
									for (var b = -h; b < 0; b++) n[f + b] *= p, n[f + b] > t.xrpow_max && (t.xrpow_max = n[f + b]);
									f += h * (3 - _ - 1);
								}
							}
							var p = a.IPOW20(202);
							for (f += t.width[s] * (_ + 1), b = -t.width[s]; b < 0; b++) n[f + b] *= p, n[f + b] > t.xrpow_max && (t.xrpow_max = n[f + b]);
						}
					}
					return !1;
				}(i, t, s) || v(t))), l || (l = 2 == i.mode_gr ? h.scale_bitcount(t) : h.scale_bitcount_lsf(i, t)), !l));
			}
			this.setModules = function(n, s, r, _) {
				e = n, t = s, this.rv = s, a = r, this.qupvt = r, h = _, m.setModules(a, h);
			}, this.ms_convert = function(e, t) {
				for (var a = 0; a < 576; ++a) {
					var n = e.tt[t][0].xr[a], s = e.tt[t][1].xr[a];
					e.tt[t][0].xr[a] = (n + s) * (.5 * r.SQRT2), e.tt[t][1].xr[a] = (n - s) * (.5 * r.SQRT2);
				}
			}, this.init_xrpow = function(e, t, a) {
				var n = 0, s = 0 | t.max_nonzero_coeff;
				if (o(null != a), t.xrpow_max = 0, o(0 <= s && s <= 575), _.fill(a, s, 576, 0), n = function(e, t, a, n) {
					n = 0;
					for (var s = 0; s <= a; ++s) {
						var r = Math.abs(e.xr[s]);
						n += r, t[s] = Math.sqrt(r * Math.sqrt(r)), t[s] > e.xrpow_max && (e.xrpow_max = t[s]);
					}
					return n;
				}(t, a, s, n), n > 1e-20) {
					var r = 0;
					2 & e.substep_shaping && (r = 1);
					for (var i = 0; i < t.psymax; i++) e.pseudohalf[i] = r;
					return !0;
				}
				return _.fill(t.l3_enc, 0, 576, 0), !1;
			}, this.init_outer_loop = function(e, t) {
				t.part2_3_length = 0, t.big_values = 0, t.count1 = 0, t.global_gain = 210, t.scalefac_compress = 0, t.table_select[0] = 0, t.table_select[1] = 0, t.table_select[2] = 0, t.subblock_gain[0] = 0, t.subblock_gain[1] = 0, t.subblock_gain[2] = 0, t.subblock_gain[3] = 0, t.region0_count = 0, t.region1_count = 0, t.preflag = 0, t.scalefac_scale = 0, t.count1table_select = 0, t.part2_length = 0, t.sfb_lmax = u.SBPSY_l, t.sfb_smin = u.SBPSY_s, t.psy_lmax = e.sfb21_extra ? u.SBMAX_l : u.SBPSY_l, t.psymax = t.psy_lmax, t.sfbmax = t.sfb_lmax, t.sfbdivide = 11;
				for (var s = 0; s < u.SBMAX_l; s++) t.width[s] = e.scalefac_band.l[s + 1] - e.scalefac_band.l[s], t.window[s] = 3;
				if (t.block_type == u.SHORT_TYPE) {
					var r = i(576);
					t.sfb_smin = 0, t.sfb_lmax = 0, 0 != t.mixed_block_flag && (t.sfb_smin = 3, t.sfb_lmax = 2 * e.mode_gr + 4), t.psymax = t.sfb_lmax + 3 * ((e.sfb21_extra ? u.SBMAX_s : u.SBPSY_s) - t.sfb_smin), t.sfbmax = t.sfb_lmax + 3 * (u.SBPSY_s - t.sfb_smin), t.sfbdivide = t.sfbmax - 18, t.psy_lmax = t.sfb_lmax;
					var o = e.scalefac_band.l[t.sfb_lmax];
					n.arraycopy(t.xr, 0, r, 0, 576);
					for (s = t.sfb_smin; s < u.SBMAX_s; s++) for (var l = e.scalefac_band.s[s], f = e.scalefac_band.s[s + 1], h = 0; h < 3; h++) for (var c = l; c < f; c++) t.xr[o++] = r[3 * c + h];
					var b = t.sfb_lmax;
					for (s = t.sfb_smin; s < u.SBMAX_s; s++) t.width[b] = t.width[b + 1] = t.width[b + 2] = e.scalefac_band.s[s + 1] - e.scalefac_band.s[s], t.window[b] = 0, t.window[b + 1] = 1, t.window[b + 2] = 2, b += 3;
				}
				t.count1bits = 0, t.sfb_partition_table = a.nr_of_sfb_block[0][0], t.slen[0] = 0, t.slen[1] = 0, t.slen[2] = 0, t.slen[3] = 0, t.max_nonzero_coeff = 575, _.fill(t.scalefac, 0), function(e, t) {
					var n = e.ATH, s = t.xr;
					if (t.block_type != u.SHORT_TYPE) for (var r = !1, _ = u.PSFB21 - 1; _ >= 0 && !r; _--) {
						var i = e.scalefac_band.psfb21[_], o = e.scalefac_band.psfb21[_ + 1], l = a.athAdjust(n.adjust, n.psfb21[_], n.floor);
						e.nsPsy.longfact[21] > 1e-12 && (l *= e.nsPsy.longfact[21]);
						for (var f = o - 1; f >= i; f--) {
							if (!(Math.abs(s[f]) < l)) {
								r = !0;
								break;
							}
							s[f] = 0;
						}
					}
					else for (var h = 0; h < 3; h++) for (r = !1, _ = u.PSFB12 - 1; _ >= 0 && !r; _--) {
						o = (i = 3 * e.scalefac_band.s[12] + (e.scalefac_band.s[13] - e.scalefac_band.s[12]) * h + (e.scalefac_band.psfb12[_] - e.scalefac_band.psfb12[0])) + (e.scalefac_band.psfb12[_ + 1] - e.scalefac_band.psfb12[_]);
						var c = a.athAdjust(n.adjust, n.psfb12[_], n.floor);
						for (e.nsPsy.shortfact[12] > 1e-12 && (c *= e.nsPsy.shortfact[12]), f = o - 1; f >= i; f--) {
							if (!(Math.abs(s[f]) < c)) {
								r = !0;
								break;
							}
							s[f] = 0;
						}
					}
				}(e, t);
			}, d.BINSEARCH_NONE = new d(0), d.BINSEARCH_UP = new d(1), d.BINSEARCH_DOWN = new d(2), this.trancate_smallspectrums = function(e, t, n, s) {
				var r = i(p.SFBMAX);
				if ((4 & e.substep_shaping || t.block_type != u.SHORT_TYPE) && !(128 & e.substep_shaping)) {
					a.calc_noise(t, n, r, new f(), null);
					for (var o = 0; o < 576; o++) {
						var l = 0;
						0 != t.l3_enc[o] && (l = Math.abs(t.xr[o])), s[o] = l;
					}
					o = 0;
					var c = 8;
					t.block_type == u.SHORT_TYPE && (c = 6);
					do {
						var b, m, d, v, g = t.width[c];
						if (o += g, !(r[c] >= 1 || (_.sort(s, o - g, g), BitStream.EQ(s[o - 1], 0)))) {
							b = (1 - r[c]) * n[c], m = 0, v = 0;
							do {
								var w;
								for (d = 1; v + d < g && !BitStream.NEQ(s[v + o - g], s[v + o + d - g]); d++);
								if (b < (w = s[v + o - g] * s[v + o - g] * d)) {
									0 != v && (m = s[v + o - g - 1]);
									break;
								}
								b -= w, v += d;
							} while (v < g);
							if (!BitStream.EQ(m, 0)) do
								Math.abs(t.xr[o - g]) <= m && (t.l3_enc[o - g] = 0);
							while (--g > 0);
						}
					} while (++c < t.psymax);
					t.part2_3_length = h.noquant_count_bits(e, t, null);
				}
			}, this.outer_loop = function(e, t, r, _, l, m) {
				var v = e.internal_flags, g = new b(), R = i(576), A = i(p.SFBMAX), M = new f(), B = new c(), y = 9999999, E = !1, T = !1, k = 0;
				if (function(e, t, a, n, s) {
					var r, _ = e.CurrentStep[n], i = !1, l = e.OldValue[n], f = d.BINSEARCH_NONE;
					for (t.global_gain = l, a -= t.part2_length, o(0 != _);;) {
						var c;
						if (r = h.count_bits(e, s, t, null), 1 == _ || r == a) break;
						r > a ? (f == d.BINSEARCH_DOWN && (i = !0), i && (_ /= 2), f = d.BINSEARCH_UP, c = _) : (f == d.BINSEARCH_UP && (i = !0), i && (_ /= 2), f = d.BINSEARCH_DOWN, c = -_), t.global_gain += c, t.global_gain < 0 && (t.global_gain = 0, i = !0), t.global_gain > 255 && (t.global_gain = 255, i = !0);
					}
					for (o(t.global_gain >= 0), o(t.global_gain < 256); r > a && t.global_gain < 255;) t.global_gain++, r = h.count_bits(e, s, t, null);
					e.CurrentStep[n] = l - t.global_gain >= 4 ? 4 : 2, e.OldValue[n] = t.global_gain, t.part2_3_length = r;
				}(v, t, m, l, _), 0 == v.noise_shaping) return 100;
				a.calc_noise(t, r, A, M, B), M.bits = t.part2_3_length, g.assign(t);
				var x = 0;
				for (n.arraycopy(_, 0, R, 0, 576); !E;) {
					do {
						var P, I = new f(), O = 255;
						if (P = 2 & v.substep_shaping ? 20 : 3, v.sfb21_extra) {
							if (A[g.sfbmax] > 1) break;
							if (g.block_type == u.SHORT_TYPE && (A[g.sfbmax + 1] > 1 || A[g.sfbmax + 2] > 1)) break;
						}
						if (!S(e, g, A, _, T)) break;
						0 != g.scalefac_scale && (O = 254);
						var V = m - g.part2_length;
						if (V <= 0) break;
						for (; (g.part2_3_length = h.count_bits(v, _, g, B)) > V && g.global_gain <= O;) g.global_gain++;
						if (g.global_gain > O) break;
						if (0 == M.over_count) {
							for (; (g.part2_3_length = h.count_bits(v, _, g, B)) > y && g.global_gain <= O;) g.global_gain++;
							if (g.global_gain > O) break;
						}
						if (a.calc_noise(g, r, A, I, B), I.bits = g.part2_3_length, 0 != (w(t.block_type != u.SHORT_TYPE ? e.quant_comp : e.quant_comp_short, M, I, g, A) ? 1 : 0)) y = t.part2_3_length, M = I, t.assign(g), x = 0, n.arraycopy(_, 0, R, 0, 576);
						else if (0 == v.full_outer_loop) {
							if (++x > P && 0 == M.over_count) break;
							if (3 == v.noise_shaping_amp && T && x > 30) break;
							if (3 == v.noise_shaping_amp && T && g.global_gain - k > 15) break;
						}
					} while (g.global_gain + g.scalefac_scale < 255);
					3 == v.noise_shaping_amp ? T ? E = !0 : (g.assign(t), n.arraycopy(R, 0, _, 0, 576), x = 0, k = g.global_gain, T = !0) : E = !0;
				}
				return o(t.global_gain + t.scalefac_scale <= 255), e.VBR == s.vbr_rh || e.VBR == s.vbr_mtrh ? n.arraycopy(R, 0, _, 0, 576) : 1 & v.substep_shaping && trancate_smallspectrums(v, t, r, _), M.over_count;
			}, this.iteration_finish_one = function(e, a, n) {
				var s = e.l3_side, r = s.tt[a][n];
				h.best_scalefac_store(e, a, n, s), 1 == e.use_best_huffman && h.best_huffman_divide(e, r), t.ResvAdjust(e, r);
			}, this.VBR_encode_granule = function(e, t, a, s, r, l, f) {
				var h, c = e.internal_flags, u = new b(), p = i(576), m = f, d = f + 1, v = (f + l) / 2, g = 0, w = c.sfb21_extra;
				o(m <= LameInternalFlags.MAX_BITS_PER_CHANNEL), _.fill(u.l3_enc, 0);
				do
					o(v >= l), o(v <= f), o(l <= f), c.sfb21_extra = !(v > m - 42) && w, outer_loop(e, t, a, s, r, v) <= 0 ? (g = 1, d = t.part2_3_length, u.assign(t), n.arraycopy(s, 0, p, 0, 576), h = (f = d - 32) - l, v = (f + l) / 2) : (h = f - (l = v + 32), v = (f + l) / 2, 0 != g && (g = 2, t.assign(u), n.arraycopy(p, 0, s, 0, 576)));
				while (h > 12);
				c.sfb21_extra = w, 2 == g && n.arraycopy(u.l3_enc, 0, t.l3_enc, 0, 576), o(t.part2_3_length <= m);
			}, this.get_framebits = function(a, n) {
				var s = a.internal_flags;
				s.bitrate_index = s.VBR_min_bitrate;
				var r = e.getframebits(a);
				s.bitrate_index = 1, r = e.getframebits(a);
				for (var _ = 1; _ <= s.VBR_max_bitrate; _++) {
					s.bitrate_index = _;
					var i = new MeanBits(r);
					n[_] = t.ResvFrameBegin(a, i), r = i.bits;
				}
			}, this.VBR_old_prepare = function(e, n, s, r, _, i, o, l, f) {
				var h, c = e.internal_flags, b = 0, p = 1, m = 0;
				c.bitrate_index = c.VBR_max_bitrate;
				var d = t.ResvFrameBegin(e, new MeanBits(0)) / c.mode_gr;
				get_framebits(e, i);
				for (var v = 0; v < c.mode_gr; v++) {
					var g = a.on_pe(e, n, l[v], d, v, 0);
					c.mode_ext == u.MPG_MD_MS_LR && (ms_convert(c.l3_side, v), a.reduce_side(l[v], s[v], d, g));
					for (var w = 0; w < c.channels_out; ++w) {
						var S = c.l3_side.tt[v][w];
						S.block_type != u.SHORT_TYPE ? (b = 1.28 / (1 + Math.exp(3.5 - n[v][w] / 300)) - .05, h = c.PSY.mask_adjust - b) : (b = 2.56 / (1 + Math.exp(3.5 - n[v][w] / 300)) - .14, h = c.PSY.mask_adjust_short - b), c.masking_lower = Math.pow(10, .1 * h), init_outer_loop(c, S), f[v][w] = a.calc_xmin(e, r[v][w], S, _[v][w]), 0 != f[v][w] && (p = 0), o[v][w] = 126, m += l[v][w];
					}
				}
				for (v = 0; v < c.mode_gr; v++) for (w = 0; w < c.channels_out; w++) m > i[c.VBR_max_bitrate] && (l[v][w] *= i[c.VBR_max_bitrate], l[v][w] /= m), o[v][w] > l[v][w] && (o[v][w] = l[v][w]);
				return p;
			}, this.bitpressure_strategy = function(e, t, a, n) {
				for (var s = 0; s < e.mode_gr; s++) for (var r = 0; r < e.channels_out; r++) {
					for (var _ = e.l3_side.tt[s][r], i = t[s][r], o = 0, l = 0; l < _.psy_lmax; l++) i[o++] *= 1 + .029 * l * l / u.SBMAX_l / u.SBMAX_l;
					if (_.block_type == u.SHORT_TYPE) for (l = _.sfb_smin; l < u.SBMAX_s; l++) i[o++] *= 1 + .029 * l * l / u.SBMAX_s / u.SBMAX_s, i[o++] *= 1 + .029 * l * l / u.SBMAX_s / u.SBMAX_s, i[o++] *= 1 + .029 * l * l / u.SBMAX_s / u.SBMAX_s;
					n[s][r] = 0 | Math.max(a[s][r], .9 * n[s][r]);
				}
			}, this.VBR_new_prepare = function(e, n, s, r, _, i) {
				var o, l = e.internal_flags, f = 1, h = 0, c = 0;
				if (e.free_format) {
					l.bitrate_index = 0;
					b = new MeanBits(h);
					o = t.ResvFrameBegin(e, b), h = b.bits, _[0] = o;
				} else {
					l.bitrate_index = l.VBR_max_bitrate;
					var b = new MeanBits(h);
					t.ResvFrameBegin(e, b), h = b.bits, get_framebits(e, _), o = _[l.VBR_max_bitrate];
				}
				for (var p = 0; p < l.mode_gr; p++) {
					a.on_pe(e, n, i[p], h, p, 0), l.mode_ext == u.MPG_MD_MS_LR && ms_convert(l.l3_side, p);
					for (var m = 0; m < l.channels_out; ++m) {
						var d = l.l3_side.tt[p][m];
						l.masking_lower = Math.pow(10, .1 * l.PSY.mask_adjust), init_outer_loop(l, d), 0 != a.calc_xmin(e, s[p][m], d, r[p][m]) && (f = 0), c += i[p][m];
					}
				}
				for (p = 0; p < l.mode_gr; p++) for (m = 0; m < l.channels_out; m++) c > o && (i[p][m] *= o, i[p][m] /= c);
				return f;
			}, this.calc_target_bits = function(n, s, r, _, i, o) {
				var l, f, h, c, b = n.internal_flags, p = b.l3_side, m = 0;
				b.bitrate_index = b.VBR_max_bitrate;
				var d = new MeanBits(m);
				for (o[0] = t.ResvFrameBegin(n, d), m = d.bits, b.bitrate_index = 1, m = e.getframebits(n) - 8 * b.sideinfo_len, i[0] = m / (b.mode_gr * b.channels_out), m = n.VBR_mean_bitrate_kbps * n.framesize * 1e3, 1 & b.substep_shaping && (m *= 1.09), m /= n.out_samplerate, m -= 8 * b.sideinfo_len, m /= b.mode_gr * b.channels_out, (l = .93 + .07 * (11 - n.compression_ratio) / 5.5) < .9 && (l = .9), l > 1 && (l = 1), f = 0; f < b.mode_gr; f++) {
					var v = 0;
					for (h = 0; h < b.channels_out; h++) {
						if (_[f][h] = int(l * m), s[f][h] > 700) {
							var g = int((s[f][h] - 700) / 1.4), w = p.tt[f][h];
							_[f][h] = int(l * m), w.block_type == u.SHORT_TYPE && g < m / 2 && (g = m / 2), g > 3 * m / 2 ? g = 3 * m / 2 : g < 0 && (g = 0), _[f][h] += g;
						}
						_[f][h] > LameInternalFlags.MAX_BITS_PER_CHANNEL && (_[f][h] = LameInternalFlags.MAX_BITS_PER_CHANNEL), v += _[f][h];
					}
					if (v > LameInternalFlags.MAX_BITS_PER_GRANULE) for (h = 0; h < b.channels_out; ++h) _[f][h] *= LameInternalFlags.MAX_BITS_PER_GRANULE, _[f][h] /= v;
				}
				if (b.mode_ext == u.MPG_MD_MS_LR) for (f = 0; f < b.mode_gr; f++) a.reduce_side(_[f], r[f], m * b.channels_out, LameInternalFlags.MAX_BITS_PER_GRANULE);
				for (c = 0, f = 0; f < b.mode_gr; f++) for (h = 0; h < b.channels_out; h++) _[f][h] > LameInternalFlags.MAX_BITS_PER_CHANNEL && (_[f][h] = LameInternalFlags.MAX_BITS_PER_CHANNEL), c += _[f][h];
				if (c > o[0]) for (f = 0; f < b.mode_gr; f++) for (h = 0; h < b.channels_out; h++) _[f][h] *= o[0], _[f][h] /= c;
			};
		};
	}), Y = _((e, t) => {
		var a = h().assert;
		t.exports = function() {
			var e;
			this.setModules = function(t) {
				e = t;
			}, this.ResvFrameBegin = function(t, n) {
				var s, r = t.internal_flags, _ = r.l3_side, i = e.getframebits(t);
				n.bits = (i - 8 * r.sideinfo_len) / r.mode_gr;
				var o = 2048 * r.mode_gr - 8;
				t.brate > 320 ? s = 8 * int(1e3 * t.brate / (t.out_samplerate / 1152) / 8 + .5) : (s = 11520, t.strict_ISO && (s = 8 * int(32e4 / (t.out_samplerate / 1152) / 8 + .5))), r.ResvMax = s - i, r.ResvMax > o && (r.ResvMax = o), (r.ResvMax < 0 || t.disable_reservoir) && (r.ResvMax = 0);
				var l = n.bits * r.mode_gr + Math.min(r.ResvSize, r.ResvMax);
				return l > s && (l = s), a(0 == r.ResvMax % 8), a(r.ResvMax >= 0), _.resvDrain_pre = 0, null != r.pinfo && (r.pinfo.mean_bits = n.bits / 2, r.pinfo.resvsize = r.ResvSize), l;
			}, this.ResvMaxBits = function(e, t, a, n) {
				var s, r = e.internal_flags, _ = r.ResvSize, i = r.ResvMax;
				0 != n && (_ += t), 1 & r.substep_shaping && (i *= .9), a.bits = t, 10 * _ > 9 * i ? (s = _ - 9 * i / 10, a.bits += s, r.substep_shaping |= 128) : (s = 0, r.substep_shaping &= 127, e.disable_reservoir || 1 & r.substep_shaping || (a.bits -= .1 * t));
				var o = _ < 6 * r.ResvMax / 10 ? _ : 6 * r.ResvMax / 10;
				return (o -= s) < 0 && (o = 0), o;
			}, this.ResvAdjust = function(e, t) {
				e.ResvSize -= t.part2_3_length + t.part2_length;
			}, this.ResvFrameEnd = function(e, t) {
				var n, s = e.l3_side;
				e.ResvSize += t * e.mode_gr;
				var r = 0;
				s.resvDrain_post = 0, s.resvDrain_pre = 0, 0 != (n = e.ResvSize % 8) && (r += n), (n = e.ResvSize - r - e.ResvMax) > 0 && (a(0 == n % 8), a(n >= 0), r += n);
				var _ = Math.min(8 * s.main_data_begin, r) / 8;
				s.resvDrain_pre += 8 * _, r -= 8 * _, e.ResvSize -= 8 * _, s.main_data_begin -= _, s.resvDrain_post += r, e.ResvSize -= r;
			};
		};
	}), q = _((e, t) => {
		t.exports = function() {
			this.getLameVersion = function() {
				return "3.98.4";
			}, this.getLameShortVersion = function() {
				return "3.98.4";
			}, this.getLameVeryShortVersion = function() {
				return "LAME3.98r";
			}, this.getPsyVersion = function() {
				return "0.93";
			}, this.getLameUrl = function() {
				return "http://www.mp3dev.org/";
			}, this.getLameOsBitness = function() {
				return "32bits";
			};
		};
	}), j = _((e, t) => {
		var a = h(), n = a.System, s = a.VbrMode;
		a.Float;
		var r = a.ShortBlock;
		a.Util;
		var _ = a.Arrays;
		a.new_array_n;
		var i = a.new_byte;
		a.new_double, a.new_float, a.new_float_n, a.new_int, a.new_int_n;
		var o = a.assert;
		function l() {
			var e, t, a;
			this.setModules = function(n, s, r) {
				e = n, t = s, a = r;
			};
			var f = l.NUMTOCENTRIES, h = l.MAXFRAMESIZE, c = f + 4 + 4 + 4 + 4 + 4 + 9 + 1 + 1 + 8 + 1 + 1 + 3 + 1 + 1 + 2 + 4 + 2 + 2, u = "Xing", b = "Info", p = [
				0,
				49345,
				49537,
				320,
				49921,
				960,
				640,
				49729,
				50689,
				1728,
				1920,
				51009,
				1280,
				50625,
				50305,
				1088,
				52225,
				3264,
				3456,
				52545,
				3840,
				53185,
				52865,
				3648,
				2560,
				51905,
				52097,
				2880,
				51457,
				2496,
				2176,
				51265,
				55297,
				6336,
				6528,
				55617,
				6912,
				56257,
				55937,
				6720,
				7680,
				57025,
				57217,
				8e3,
				56577,
				7616,
				7296,
				56385,
				5120,
				54465,
				54657,
				5440,
				55041,
				6080,
				5760,
				54849,
				53761,
				4800,
				4992,
				54081,
				4352,
				53697,
				53377,
				4160,
				61441,
				12480,
				12672,
				61761,
				13056,
				62401,
				62081,
				12864,
				13824,
				63169,
				63361,
				14144,
				62721,
				13760,
				13440,
				62529,
				15360,
				64705,
				64897,
				15680,
				65281,
				16320,
				16e3,
				65089,
				64001,
				15040,
				15232,
				64321,
				14592,
				63937,
				63617,
				14400,
				10240,
				59585,
				59777,
				10560,
				60161,
				11200,
				10880,
				59969,
				60929,
				11968,
				12160,
				61249,
				11520,
				60865,
				60545,
				11328,
				58369,
				9408,
				9600,
				58689,
				9984,
				59329,
				59009,
				9792,
				8704,
				58049,
				58241,
				9024,
				57601,
				8640,
				8320,
				57409,
				40961,
				24768,
				24960,
				41281,
				25344,
				41921,
				41601,
				25152,
				26112,
				42689,
				42881,
				26432,
				42241,
				26048,
				25728,
				42049,
				27648,
				44225,
				44417,
				27968,
				44801,
				28608,
				28288,
				44609,
				43521,
				27328,
				27520,
				43841,
				26880,
				43457,
				43137,
				26688,
				30720,
				47297,
				47489,
				31040,
				47873,
				31680,
				31360,
				47681,
				48641,
				32448,
				32640,
				48961,
				32e3,
				48577,
				48257,
				31808,
				46081,
				29888,
				30080,
				46401,
				30464,
				47041,
				46721,
				30272,
				29184,
				45761,
				45953,
				29504,
				45313,
				29120,
				28800,
				45121,
				20480,
				37057,
				37249,
				20800,
				37633,
				21440,
				21120,
				37441,
				38401,
				22208,
				22400,
				38721,
				21760,
				38337,
				38017,
				21568,
				39937,
				23744,
				23936,
				40257,
				24320,
				40897,
				40577,
				24128,
				23040,
				39617,
				39809,
				23360,
				39169,
				22976,
				22656,
				38977,
				34817,
				18624,
				18816,
				35137,
				19200,
				35777,
				35457,
				19008,
				19968,
				36545,
				36737,
				20288,
				36097,
				19904,
				19584,
				35905,
				17408,
				33985,
				34177,
				17728,
				34561,
				18368,
				18048,
				34369,
				33281,
				17088,
				17280,
				33601,
				16640,
				33217,
				32897,
				16448
			];
			function m(e, t) {
				var a = 255 & e[t + 0];
				return a <<= 8, a |= 255 & e[t + 1], a <<= 8, a |= 255 & e[t + 2], a <<= 8, a |= 255 & e[t + 3];
			}
			function d(e, t, a) {
				e[t + 0] = 255 & a >> 24, e[t + 1] = 255 & a >> 16, e[t + 2] = 255 & a >> 8, e[t + 3] = 255 & a;
			}
			function v(e, t, a) {
				e[t + 0] = 255 & a >> 8, e[t + 1] = 255 & a;
			}
			function g(e, t, a) {
				return 255 & (e << t | a & ~(-1 << t));
			}
			function w(t, a) {
				var n = t.internal_flags;
				a[0] = g(a[0], 8, 255), a[1] = g(a[1], 3, 7), a[1] = g(a[1], 1, t.out_samplerate < 16e3 ? 0 : 1), a[1] = g(a[1], 1, t.version), a[1] = g(a[1], 2, 1), a[1] = g(a[1], 1, t.error_protection ? 0 : 1), a[2] = g(a[2], 4, n.bitrate_index), a[2] = g(a[2], 2, n.samplerate_index), a[2] = g(a[2], 1, 0), a[2] = g(a[2], 1, t.extension), a[3] = g(a[3], 2, t.mode.ordinal()), a[3] = g(a[3], 2, n.mode_ext), a[3] = g(a[3], 1, t.copyright), a[3] = g(a[3], 1, t.original), a[3] = g(a[3], 2, t.emphasis), a[0] = 255;
				var r, _, i = 241 & a[1];
				r = 1 == t.version ? 128 : t.out_samplerate < 16e3 ? 32 : 64, t.VBR == s.vbr_off && (r = t.brate), _ = t.free_format ? 0 : 255 & 16 * e.BitrateIndex(r, t.version, t.out_samplerate), 1 == t.version ? (a[1] = 255 & i | 10, i = 13 & a[2], a[2] = 255 & (_ | i)) : (a[1] = 255 & i | 2, i = 13 & a[2], a[2] = 255 & (_ | i));
			}
			function S(e, t) {
				return t = t >> 8 ^ p[255 & (t ^ e)];
			}
			this.addVbrFrame = function(e) {
				var t = e.internal_flags, a = Tables.bitrate_table[e.version][t.bitrate_index];
				o(null != t.VBR_seek_table.bag), function(e, t) {
					if (e.nVbrNumFrames++, e.sum += t, e.seen++, !(e.seen < e.want) && (e.pos < e.size && (e.bag[e.pos] = e.sum, e.pos++, e.seen = 0), e.pos == e.size)) {
						for (var a = 1; a < e.size; a += 2) e.bag[a / 2] = e.bag[a];
						e.want *= 2, e.pos /= 2;
					}
				}(t.VBR_seek_table, a);
			}, this.getVbrTag = function(e) {
				var t = new VBRTagData(), a = 0;
				t.flags = 0;
				var n = e[a + 1] >> 3 & 1, s = e[a + 2] >> 2 & 3, r = e[a + 3] >> 6 & 3, _ = e[a + 2] >> 4 & 15;
				if (_ = Tables.bitrate_table[n][_], e[a + 1] >> 4 == 14 ? t.samprate = Tables.samplerate_table[2][s] : t.samprate = Tables.samplerate_table[n][s], !function(e, t) {
					return new String(e, t, 4(), null).equals(u) || new String(e, t, 4(), null).equals(b);
				}(e, a += 0 != n ? 3 != r ? 36 : 21 : 3 != r ? 21 : 13)) return null;
				a += 4, t.hId = n;
				var i = t.flags = m(e, a);
				if (a += 4, 1 & i && (t.frames = m(e, a), a += 4), 2 & i && (t.bytes = m(e, a), a += 4), 4 & i) {
					if (null != t.toc) for (var o = 0; o < f; o++) t.toc[o] = e[a + o];
					a += f;
				}
				t.vbrScale = -1, 8 & i && (t.vbrScale = m(e, a), a += 4), t.headersize = 72e3 * (n + 1) * _ / t.samprate;
				var l = e[(a += 21) + 0] << 4;
				l += e[a + 1] >> 4;
				var h = (15 & e[a + 1]) << 8;
				return (l < 0 || l > 3e3) && (l = -1), ((h += 255 & e[a + 2]) < 0 || h > 3e3) && (h = -1), t.encDelay = l, t.encPadding = h, t;
			}, this.InitVbrTag = function(e) {
				var a, n = e.internal_flags;
				a = 1 == e.version ? 128 : e.out_samplerate < 16e3 ? 32 : 64, e.VBR == s.vbr_off && (a = e.brate);
				var r = 72e3 * (e.version + 1) * a / e.out_samplerate, _ = n.sideinfo_len + c;
				if (n.VBR_seek_table.TotalFrameSize = r, r < _ || r > h) e.bWriteVbrTag = !1;
				else {
					n.VBR_seek_table.nVbrNumFrames = 0, n.VBR_seek_table.nBytesWritten = 0, n.VBR_seek_table.sum = 0, n.VBR_seek_table.seen = 0, n.VBR_seek_table.want = 1, n.VBR_seek_table.pos = 0, null == n.VBR_seek_table.bag && (n.VBR_seek_table.bag = new int[400](), n.VBR_seek_table.size = 400);
					var o = i(h);
					w(e, o);
					for (var l = n.VBR_seek_table.TotalFrameSize, f = 0; f < l; ++f) t.add_dummy_byte(e, 255 & o[f], 1);
				}
			}, this.updateMusicCRC = function(e, t, a, n) {
				for (var s = 0; s < n; ++s) e[0] = S(t[a + s], e[0]);
			}, this.getLameTagFrame = function(e, o) {
				var l = e.internal_flags;
				if (!e.bWriteVbrTag) return 0;
				if (l.Class_ID != Lame.LAME_ID) return 0;
				if (l.VBR_seek_table.pos <= 0) return 0;
				if (o.length < l.VBR_seek_table.TotalFrameSize) return l.VBR_seek_table.TotalFrameSize;
				_.fill(o, 0, l.VBR_seek_table.TotalFrameSize, 0), w(e, o);
				var h = i(f);
				if (e.free_format) for (var c = 1; c < f; ++c) h[c] = 255 & 255 * c / 100;
				else (function(e, t) {
					if (!(e.pos <= 0)) for (var a = 1; a < f; ++a) {
						var n = a / f, s = 0 | Math.floor(n * e.pos);
						s > e.pos - 1 && (s = e.pos - 1);
						var r = 0 | 256 * e.bag[s] / e.sum;
						r > 255 && (r = 255), t[a] = 255 & r;
					}
				})(l.VBR_seek_table, h);
				var p = l.sideinfo_len;
				e.error_protection && (p -= 2), e.VBR == s.vbr_off ? (o[p++] = 255 & b.charAt(0), o[p++] = 255 & b.charAt(1), o[p++] = 255 & b.charAt(2), o[p++] = 255 & b.charAt(3)) : (o[p++] = 255 & u.charAt(0), o[p++] = 255 & u.charAt(1), o[p++] = 255 & u.charAt(2), o[p++] = 255 & u.charAt(3)), d(o, p, 15), d(o, p += 4, l.VBR_seek_table.nVbrNumFrames), p += 4;
				var m = l.VBR_seek_table.nBytesWritten + l.VBR_seek_table.TotalFrameSize;
				d(o, p, 0 | m), p += 4, n.arraycopy(h, 0, o, p, h.length), p += h.length, e.error_protection && t.CRC_writeheader(l, o);
				var g = 0;
				for (c = 0; c < p; c++) g = S(o[c], g);
				return p += function(e, t, n, s, _) {
					var i, o, l, f, h, c = e.internal_flags, u = 0, b = e.encoder_delay, p = e.encoder_padding, m = 100 - 10 * e.VBR_q - e.quality, g = a.getLameVeryShortVersion(), w = [
						1,
						5,
						3,
						2,
						4,
						0,
						3
					], R = 0 | (e.lowpassfreq / 100 + .5 > 255 ? 255 : e.lowpassfreq / 100 + .5), A = 0, M = 0, B = e.internal_flags.noise_shaping, y = 0, E = 0, T = 0, k = !!(1 & e.exp_nspsytune), x = !!(2 & e.exp_nspsytune), P = !1, I = !1, O = e.internal_flags.nogap_total, V = e.internal_flags.nogap_current, H = e.ATHtype;
					switch (e.VBR) {
						case vbr_abr:
							h = e.VBR_mean_bitrate_kbps;
							break;
						case vbr_off:
							h = e.brate;
							break;
						default: h = e.VBR_min_bitrate_kbps;
					}
					switch (i = 0 + (e.VBR.ordinal() < w.length ? w[e.VBR.ordinal()] : 0), c.findReplayGain && (c.RadioGain > 510 && (c.RadioGain = 510), c.RadioGain < -510 && (c.RadioGain = -510), M = 8192, M |= 3072, c.RadioGain >= 0 ? M |= c.RadioGain : (M |= 512, M |= -c.RadioGain)), c.findPeakSample && (A = Math.abs(0 | c.PeakSample / 32767 * Math.pow(2, 23) + .5)), -1 != O && (V > 0 && (I = !0), V < O - 1 && (P = !0)), f = H + ((k ? 1 : 0) << 4) + ((x ? 1 : 0) << 5) + ((P ? 1 : 0) << 6) + ((I ? 1 : 0) << 7), m < 0 && (m = 0), e.mode) {
						case MONO:
							y = 0;
							break;
						case STEREO:
							y = 1;
							break;
						case DUAL_CHANNEL:
							y = 2;
							break;
						case JOINT_STEREO:
							y = e.force_ms ? 4 : 3;
							break;
						case NOT_SET:
						default: y = 7;
					}
					T = e.in_samplerate <= 32e3 ? 0 : 48e3 == e.in_samplerate ? 2 : e.in_samplerate > 48e3 ? 3 : 1, (e.short_blocks == r.short_block_forced || e.short_blocks == r.short_block_dispensed || -1 == e.lowpassfreq && -1 == e.highpassfreq || e.scale_left < e.scale_right || e.scale_left > e.scale_right || e.disable_reservoir && e.brate < 320 || e.noATH || e.ATHonly || 0 == H || e.in_samplerate <= 32e3) && (E = 1), o = B + (y << 2) + (E << 5) + (T << 6), l = c.nMusicCRC, d(n, s + u, m), u += 4;
					for (var L = 0; L < 9; L++) n[s + u + L] = 255 & g.charAt(L);
					n[s + (u += 9)] = 255 & i, n[s + ++u] = 255 & R, d(n, s + ++u, A), v(n, s + (u += 4), M), v(n, s + (u += 2), 0), n[s + (u += 2)] = 255 & f, n[s + ++u] = h >= 255 ? 255 : 255 & h, n[s + ++u] = 255 & b >> 4, n[s + u + 1] = 255 & (b << 4) + (p >> 8), n[s + u + 2] = 255 & p, n[s + (u += 3)] = 255 & o, u++, n[s + u++] = 0, v(n, s + u, e.preset), d(n, s + (u += 2), t), v(n, s + (u += 4), l), u += 2;
					for (var N = 0; N < u; N++) _ = S(n[s + N], _);
					return v(n, s + u, _), u + 2;
				}(e, m, o, p, g), l.VBR_seek_table.TotalFrameSize;
			}, this.putVbrTag = function(e, t) {
				if (e.internal_flags.VBR_seek_table.pos <= 0) return -1;
				if (t.seek(t.length()), 0 == t.length()) return -1;
				var a = function(e) {
					e.seek(0);
					var t = i(10);
					return e.readFully(t), new String(t, "ISO-8859-1").startsWith("ID3") ? 0 : ((127 & t[6]) << 21 | (127 & t[7]) << 14 | (127 & t[8]) << 7 | 127 & t[9]) + t.length;
				}(t);
				t.seek(a);
				var n = i(h), s = getLameTagFrame(e, n);
				return s > n.length ? -1 : (s < 1 || t.write(n, 0, s), 0);
			};
		}
		l.NUMTOCENTRIES = 100, l.MAXFRAMESIZE = 2880, t.exports = l;
	}), U = _((e, t) => {
		var a = h();
		a.System, a.VbrMode, a.Float, a.ShortBlock, a.Util, a.Arrays, a.new_array_n;
		var n = a.new_byte;
		a.new_double, a.new_float, a.new_float_n, a.new_int, a.new_int_n;
		var s = a.assert, r = L(), _ = N(), i = T(), o = O(), l = F(), f = V(), c = Y(), u = p(), b = H();
		m();
		var d = q(), v = j();
		function g() {
			this.setModules = function(e, t) {};
		}
		function w() {
			this.setModules = function(e, t, a) {};
		}
		function S() {}
		function R() {
			this.setModules = function(e, t) {};
		}
		function A() {
			this.dataOffset = 0, this.dataLen = 0, this.channels = 0, this.sampleRate = 0;
		}
		function M(e) {
			return e.charCodeAt(0) << 24 | e.charCodeAt(1) << 16 | e.charCodeAt(2) << 8 | e.charCodeAt(3);
		}
		A.RIFF = M("RIFF"), A.WAVE = M("WAVE"), A.fmt_ = M("fmt "), A.data = M("data"), A.readHeader = function(e) {
			var t = new A(), a = e.getUint32(0, !1);
			if (A.RIFF == a && (e.getUint32(4, !0), A.WAVE == e.getUint32(8, !1) && A.fmt_ == e.getUint32(12, !1))) {
				var n = e.getUint32(16, !0), s = 20;
				switch (n) {
					case 16:
					case 18:
						t.channels = e.getUint16(s + 2, !0), t.sampleRate = e.getUint32(s + 4, !0);
						break;
					default: throw "extended fmt chunk not implemented";
				}
				s += n;
				for (var r = A.data, _ = 0; r != a && (a = e.getUint32(s, !1), _ = e.getUint32(s + 4, !0), r != a);) s += _ + 8;
				return t.dataLen = _, t.dataOffset = s + 8, t;
			}
		}, t.exports.Mp3Encoder = function(e, t, a) {
			3 != arguments.length && (console.error("WARN: Mp3Encoder(channels, samplerate, kbps) not specified"), e = 1, t = 44100, a = 128);
			var h = new r(), p = new g(), m = new i(), A = new b(), M = new _(), B = new o(), y = new l(), E = new v(), T = new d(), k = new R(), x = new c(), P = new f(), I = new w(), O = new S();
			h.setModules(m, A, M, B, y, E, T, k, O), A.setModules(m, O, T, E), k.setModules(A, T), M.setModules(h), y.setModules(A, x, B, P), B.setModules(P, x, h.enc.psy), x.setModules(A), P.setModules(B), E.setModules(h, A, T), p.setModules(I, O), I.setModules(T, k, M);
			var V = h.lame_init();
			V.num_channels = e, V.in_samplerate = t, V.brate = a, V.mode = u.STEREO, V.quality = 3, V.bWriteVbrTag = !1, V.disable_reservoir = !0, V.write_id3tag_automatic = !1, s(0 == h.lame_init_params(V));
			var H = 1152, L = 0 | 1.25 * H + 7200, N = n(L);
			this.encodeBuffer = function(t, a) {
				1 == e && (a = t), s(t.length == a.length), t.length > H && (H = t.length, N = n(L = 0 | 1.25 * H + 7200));
				var r = h.lame_encode_buffer(V, t, a, t.length, N, 0, L);
				return new Int8Array(N.subarray(0, r));
			}, this.flush = function() {
				var e = h.lame_encode_flush(V, N, 0, L);
				return new Int8Array(N.subarray(0, e));
			};
		}, t.exports.WavHeader = A;
	})();
	function z(e, t, a) {
		for (let n = 0; n < a.length; n++, t += 2) {
			const s = Math.max(-1, Math.min(1, a[n]));
			e.setInt16(t, s < 0 ? 32768 * s : 32767 * s, !0);
		}
	}
	function K(e, t) {
		const a = function(e) {
			switch (e) {
				case 2: return new Z([.5, .5]);
				case 3: return new Z([
					-0,
					-684e-6,
					.001238,
					-0,
					-.003098,
					.004522,
					-0,
					-.008736,
					.011729,
					-0,
					-.020268,
					.026356,
					-0,
					-.045082,
					.060638,
					-0,
					-.133528,
					.273491,
					.666667,
					.273491,
					-.133528,
					-0,
					.060638,
					-.045082,
					-0,
					.026356,
					-.020268,
					-0,
					.011729,
					-.008736,
					-0,
					.004522,
					-.003098,
					-0,
					.001238,
					-684e-6,
					-0
				]);
				case 4: return new Z([
					0,
					79e-5,
					-0,
					-.002338,
					0,
					.005222,
					-0,
					-.010087,
					0,
					.017899,
					-0,
					-.030433,
					0,
					.052057,
					-0,
					-.098769,
					0,
					.3158,
					.5,
					.3158,
					0,
					-.098769,
					-0,
					.052057,
					0,
					-.030433,
					-0,
					.017899,
					0,
					-.010087,
					-0,
					.005222,
					0,
					-.002338,
					-0,
					79e-5,
					0
				]);
				case 5: return new Z([
					-212e-6,
					464e-6,
					.00136,
					-0,
					-.003402,
					-.003069,
					.004324,
					.009594,
					-0,
					-.017023,
					-.013756,
					.017888,
					.037672,
					-0,
					-.066591,
					-.058055,
					.090628,
					.300344,
					.4,
					.300344,
					.090628,
					-.058055,
					-.066591,
					-0,
					.037672,
					.017888,
					-.013756,
					-.017023,
					-0,
					.009594,
					.004324,
					-.003069,
					-.003402,
					-0,
					.00136,
					464e-6,
					-212e-6
				]);
				case 6: return new Z([
					-0,
					-684e-6,
					-.001238,
					0,
					.003098,
					.004522,
					-0,
					-.008736,
					-.011729,
					0,
					.020268,
					.026356,
					-0,
					-.045082,
					-.060638,
					0,
					.133528,
					.273491,
					.333333,
					.273491,
					.133528,
					0,
					-.060638,
					-.045082,
					-0,
					.026356,
					.020268,
					0,
					-.011729,
					-.008736,
					-0,
					.004522,
					.003098,
					0,
					-.001238,
					-684e-6,
					-0
				]);
				default: throw new Error(`unsupported divider (${e})`);
			}
		}(t), n = new Float32Array(Math.round(e.length / t));
		let s = 0, r = 0, _ = 0;
		for (; r < n.length;) s < e.length ? a.sampleIn(e[s++]) : a.sampleIn(0), ++_, _ === t && (_ = 0, n[r++] = a.sampleOut());
		return n;
	}
	var Z = class {
		constructor(e) {
			this.coeffs = null, this.nCoeffs = 0, this.registers = null, this.iTopReg = -1, this.coeffs = e, this.nCoeffs = e.length, this.registers = new Float32Array(this.nCoeffs), this.iTopReg = this.nCoeffs - 1;
		}
		sampleIn(e) {
			let t = this.iTopReg;
			t += 1, t >= this.nCoeffs && (t = 0), this.registers[t] = e, this.iTopReg = t;
		}
		sampleOut() {
			let e = 0, t = 0;
			for (let a = this.iTopReg; a >= 0; a--) e += this.coeffs[t++] * this.registers[a];
			for (let a = this.nCoeffs - 1; a > this.iTopReg; a--) e += this.coeffs[t++] * this.registers[a];
			return e;
		}
	};
	function Q(e, t, a) {
		const { numberOfChannels: n, sampleRate: s } = e;
		let r = new Array(n);
		for (let c = 0; c < n; c += 1) r[c] = e.getChannelData(c);
		a(.1);
		const _ = s / t.sampleRate;
		let i;
		switch (1 !== _ && (r = r.map((e) => K(e, _))), a(.2), `${n}->${t.numChannels}`) {
			case "1->1":
				i = r[0];
				break;
			case "1->2":
				i = W([r[0], r[0]]);
				break;
			case "2->1":
				i = function(e) {
					const t = e[0], a = e[1], n = t.length, s = new Float32Array(n);
					for (let r = 0; r < n; r++) s[r++] = (t[r] + a[r]) / 2;
					return s;
				}(r);
				break;
			case "2->2":
				i = W(r);
				break;
			default: throw new Error("unsupported channels conversion");
		}
		a(.3);
		const o = t.numChannels * t.sampleSize, l = i.length * t.sampleSize, f = new ArrayBuffer(44 + l), h = new DataView(f);
		switch (J(h, 0, "RIFF"), h.setUint32(4, f.byteLength - 8, !0), J(h, 8, "WAVE"), J(h, 12, "fmt "), h.setUint32(16, 16, !0), h.setUint16(20, 1, !0), h.setUint16(22, t.numChannels, !0), h.setUint32(24, t.sampleRate, !0), h.setUint32(28, t.sampleRate * o, !0), h.setUint16(32, o, !0), h.setUint16(34, 8 * t.sampleSize, !0), J(h, 36, "data"), h.setUint32(40, l, !0), a(.4), t.sampleSize) {
			case 1:
				(function(e, t, a) {
					for (let n = 0; n < a.length; n++, t += 1) {
						const s = (Math.max(-1, Math.min(1, a[n])) + 1) / 2;
						e.setInt8(t, 255 * s);
					}
				})(h, 44, i);
				break;
			case 2: z(h, 44, i);
		}
		return a(1), new Blob([f], { type: "audio/wav" });
	}
	function W(e) {
		const t = e[0], a = e[1], n = t.length, s = new Float32Array(2 * n);
		let r = 0;
		for (let _ = 0; _ < n; _++) s[r++] = t[_], s[r++] = a[_];
		return s;
	}
	function J(e, t, a) {
		for (let n = 0; n < a.length; n++) e.setUint8(t + n, a.charCodeAt(n));
	}
	let $ = null, ee = null, te = 0;
	function ae(e) {
		const { id: t, command: a, payload: n } = e.data, s = new ne(t);
		try {
			let e = !1;
			switch (a) {
				case "init":
					e = function({ sampleRate: e, numberOfChannels: t }) {
						if (re(), t > 2) throw new Error("invalid number of channels");
						return $ = new f({
							numberOfChannels: t,
							sampleRate: e
						}), ee = setInterval(se, 1e3), !0;
					}(n);
					break;
				case "addSamples":
					$.addSamples(n.samples), e = !0;
					break;
				case "truncate":
					e = $.truncateAt(n.position);
					break;
				case "export": {
					e = {};
					const t = $.getAudioBuffer(function(e) {
						s.send({
							step: "copy",
							progress: e
						});
					});
					e.duration = t.duration, n.raw && (e.raw = function(e) {
						const { numberOfChannels: t, sampleRate: a, length: n, duration: s } = e, r = {
							numberOfChannels: t,
							sampleRate: a,
							length: n,
							duration: s,
							channels: []
						};
						for (let _ = 0; _ < t; _ += 1) r.channels.push(e.getChannelData(_));
						return r;
					}(t)), n.wav && (e.wav = function(e, t, a) {
						"object" != typeof t && (t = {
							numChannels: e.numberOfChannels,
							sampleRate: e.sampleRate,
							sampleSize: 2
						});
						return Q(e, t, a);
					}(t, n.wav, function(e) {
						s.send({
							step: "wav",
							progress: e
						});
					})), n.mp3 && (e.mp3 = function(e, t, a) {
						"object" != typeof t && (t = { outputRate: 128 });
						return function(e, t, a) {
							const { numberOfChannels: n, sampleRate: s, length: r } = e, _ = t.outputRate, i = new U.Mp3Encoder(n, s, _), o = 1152, l = [], f = new Int16Array(o), h = new DataView(f.buffer), c = new Int16Array(o), u = new DataView(c.buffer);
							let b, p, m = 0;
							for (let d = 0; d < r; d += o) p = Math.min(1, Math.round(100 * d / r) / 100), p !== m && (a(p), m = p), z(h, 0, e.getChannelData(0).subarray(d, d + o)), z(u, 0, e.getChannelData(1).subarray(d, d + o)), b = i.encodeBuffer(f, c), b.length > 0 && l.push(b);
							return b = i.flush(), b.length > 0 && l.push(b), new Blob(l, { type: "audio/mpeg" });
						}(e, t, a);
					}(t, n.mp3, function(e) {
						s.send({
							step: "mp3",
							progress: e
						});
					}));
					break;
				}
				case "cleanup": e = re();
			}
			s.done(e);
		} catch (r) {
			s.fail(r);
		}
	}
	function ne(e) {
		this._id = e;
	}
	function se() {
		let e = 0;
		$ && (e = $.length * $.numberOfChannels * 4), e !== te && (te = e, self.postMessage({
			id: "memoryUsage",
			done: !1,
			payload: e
		}));
	}
	function re() {
		return $ = null, null !== ee && clearInterval(ee), !0;
	}
	self.onmessage = function(e) {
		null === e.data && (self.onmessage = ae, self.postMessage(null));
	}, ne.prototype.done = function(e) {
		self.postMessage({
			id: this._id,
			done: !0,
			payload: e
		});
	}, ne.prototype.send = function(e) {
		self.postMessage({
			id: this._id,
			done: !1,
			payload: e
		});
	}, ne.prototype.fail = function(e) {
		self.postMessage({
			id: this._id,
			done: !0,
			error: e
		});
	};
})();
