var API
function init() {
	console.log("初期化を開始します")
	var win1 = window
	try {
		while (win1.API == null && win1.parent != null && win1.parent != win1) {
			win1 = win1.parent;
		}
	} catch (e) {
		console.log("e12");
	}
	if (win1.API != undefined) {
		API = win1.API;
	}
	console.log(API);
	if (API) {
		API.LMSInitialize("");
		API.LMSSetValue('cmi.core.lesson_status', 'browsed');
		API.LMSCommit("");
		console.log("APIを初期化しました");
		//完了したことを示す部分
		//他に適切な部分があればそこに書く
		API.LMSSetValue('cmi.core.lesson_status', 'completed');
		API.LMSCommit("");
		API.LMSFinish("");
	}
}
Vue.component('vue-synthesizer', {
	template: `<div v-on:mouseup="keyStop()">
	<div class="synth">
		<!--オシレーター部-->
		<main style="display: flex">
			<div class="half-box">
				<span>Wave 1</span>
				<br>
				<input type="radio" value="sine" v-model="mainWave">Sine
				<input type="radio" value="square" v-model="mainWave">Square
				<input type="radio" value="sawtooth" v-model="mainWave">Sawtooth
				<input type="radio" value="triangle" v-model="mainWave">Triangle
				<br>
				<span>Octave</span><input type="tel" class="text-small"
					v-on:blur="function(){mainOctave=clampInput(mainOctave,-3,11,4)}" v-model="mainOctave">
				<span>Pitch</span><input type="tel" class="text-mid"
					v-on:blur="function(){mainDetune=clampInput(mainDetune,-153600,153600,0)}" v-model="mainDetune">
				<input type="range" min="-200" max="200" v-model="mainDetune">
				<br>
				<span>Volume</span><input type="range" min="0" max="500" v-model="mainGain">
			</div>
			<div class="half-box">
				<span>Wave 2</span>
				<br>
				<input type="radio" value="sine" v-model="subWave">Sine
				<input type="radio" value="square" v-model="subWave">Square
				<input type="radio" value="sawtooth" v-model="subWave">Sawtooth
				<input type="radio" value="triangle" v-model="subWave">Triangle
				<br>
				<span>Octave</span><input type="tel" class="text-small"
					v-on:blur="function(){subOctave=clampInput(subOctave,-3,11,4)}" v-model="subOctave">
				<span>Pitch</span><input type="tel" class="text-mid"
					v-on:blur="function(){subDetune=clampInput(subDetune,-153600,153600,0)}" v-model="subDetune">
				<input type="range" min="-200" max="200" v-model="subDetune">
				<br>
				<span>Volume</span><input type="range" min="0" max="500" v-model="subGain">
			</div>
		</main>
		<!--フィルター部-->
		<main class="full-box">
			<span>Filter(LPF & HPF)</span>
			<br>
			<main style="display: flex">
				<div>
					<span>Low Pass</span>
					<br>
					<span>Cutoff</span><input type="tel" class="text-large"
						v-on:blur="function(){LPFCutoff=clampInput(LPFCutoff,0,24000,15000)}" v-model="LPFCutoff">
					<input type="range" min="0" max="17000" v-model="LPFCutoff">
					<br>
					<span>Emphasis</span><input type="tel" class="text-mid"
						v-on:blur="function(){LPFEmphasis=clampInput(LPFEmphasis,0,30,5)}" v-model="LPFEmphasis">
					<input type="range" min="0" max="20" step="0.1" v-model="LPFEmphasis">
				</div>
				<div>
					<span>High Pass</span>
					<br>
					<span>Cutoff</span><input type="tel" class="text-large"
						v-on:blur="function(){HPFCutoff=clampInput(HPFCutoff,0,24000,50)}" v-model="HPFCutoff">
					<input type="range" min="0" max="17000" v-model="HPFCutoff">
					<br>
					<span>Emphasis</span><input type="tel" class="text-mid"
						v-on:blur="function(){HPFEmphasis=clampInput(HPFEmphasis,0,30,5)}" v-model="HPFEmphasis">
					<input type="range" min="0" max="20" step="0.1" v-model="HPFEmphasis">
				</div>
			</main>
		</main>
		<!--エンベロープ-->
		<!--LFO-->
		<main style="display: flex">
			<div class="half-box">
				<span>LFO 1</span>
				<br>
				<input type="radio" value="sine" v-model="mainLFOWave">Sine
				<input type="radio" value="square" v-model="mainLFOWave">Square
				<input type="radio" value="sawtooth" v-model="mainLFOWave">Sawtooth
				<input type="radio" value="triangle" v-model="mainLFOWave">Triangle
				<br>
				<span>Rate</span><input type="tel" class="text-large"
					v-on:blur="function(){mainLFORate=clampInput(mainLFORate,-10000,10000,5)}"
					v-model="mainLFORate">
				<input type="range" class="range-small" min="0" max="15" v-model="mainLFORate">
				<input type="checkbox" v-model="mainLFOSync">Sync.
				<br>
				<span>Depth</span><input type="tel" class="text-large"
					v-on:blur="function(){mainLFODepth=clampInput(mainLFODepth,-1000000,1000000,10)}"
					v-model="mainLFODepth">
				<span v-if="mainLFOSync">
					<input type="range" class="range-large" min="0" max="10000" v-model="mainLFODepth">
				</span>
				<span v-else>
					<input type="range" class="range-large" min="0" max="100" v-model="mainLFODepth">
				</span>
				<br>
				<div style="font-size: 60%;">
					<input type="checkbox" value="mainOscFreq" v-model="mainLFOApply">Freq.(Wave1)
					<input type="checkbox" value="mainOscVol" v-model="mainLFOApply">Vol.(Wave1)
					<input type="checkbox" value="subOscFreq" v-model="mainLFOApply">Freq.(Wave2)
					<input type="checkbox" value="subOscVol" v-model="mainLFOApply">Vol.(Wave2)
					<br>
					<input type="checkbox" value="LPFCutoff" v-model="mainLFOApply">Cutoff(LPF)
					<input type="checkbox" value="LPFEmphasis" v-model="mainLFOApply">Emp.(LPF)
					<input type="checkbox" value="HPFCutoff" v-model="mainLFOApply">Cutoff(HPF)
					<input type="checkbox" value="HPFEmphasis" v-model="mainLFOApply">Emp.(HPF)
					<br>
					<input type="checkbox" value="mainLFORate" v-model="mainLFOApply">Rate(LFO1)
					<input type="checkbox" value="mainLFODepth" v-model="mainLFOApply">Depth(LFO1)
					<input type="checkbox" value="subLFORate" v-model="mainLFOApply">Rate(LFO2)
					<input type="checkbox" value="subLFODepth" v-model="mainLFOApply">Depth(LFO2)
				</div>
			</div>
			<div class="half-box">
				<span>LFO 2</span>
				<br>
				<input type="radio" value="sine" v-model="subLFOWave">Sine
				<input type="radio" value="square" v-model="subLFOWave">Square
				<input type="radio" value="sawtooth" v-model="subLFOWave">Sawtooth
				<input type="radio" value="triangle" v-model="subLFOWave">Triangle
				<br>
				<span>Rate</span><input type="tel" class="text-large"
					v-on:blur="function(){subLFORate=clampInput(subLFORate,-10000,10000,5)}" v-model="subLFORate">
				<input type="range" class="range-small" min="0" max="15" v-model="subLFORate">
				<input type="checkbox" v-model="subLFOSync">Sync.
				<br>
				<span>Depth</span><input type="tel" class="text-large"
					v-on:blur="function(){subLFODepth=clampInput(subLFODepth,-1000000,1000000,10)}"
					v-model="subLFODepth">
				<span v-if="subLFOSync">
					<input type="range" class="range-large" min="0" max="10000" v-model="subLFODepth">
				</span>
				<span v-else>
					<input type="range" class="range-large" min="0" max="100" v-model="subLFODepth">
				</span>
				<br>
				<div style="font-size:60%">
					<input type="checkbox" value="mainOscFreq" v-model="subLFOApply">Freq.(Wave1)
					<input type="checkbox" value="mainOscVol" v-model="subLFOApply">Vol.(Wave1)
					<input type="checkbox" value="subOscFreq" v-model="subLFOApply">Freq.(Wave2)
					<input type="checkbox" value="subOscVol" v-model="subLFOApply">Vol.(Wave2)
					<br>
					<input type="checkbox" value="LPFCutoff" v-model="subLFOApply">Cutoff(LPF)
					<input type="checkbox" value="LPFEmphasis" v-model="subLFOApply">Emp.(LPF)
					<input type="checkbox" value="HPFCutoff" v-model="subLFOApply">Cutoff(HPF)
					<input type="checkbox" value="HPFEmphasis" v-model="subLFOApply">Emp.(HPF)
					<br>
					<input type="checkbox" value="mainLFORate" v-model="subLFOApply">Rate(LFO1)
					<input type="checkbox" value="mainLFODepth" v-model="subLFOApply">Depth(LFO1)
					<input type="checkbox" value="subLFORate" v-model="subLFOApply">Rate(LFO2)
					<input type="checkbox" value="subLFODepth" v-model="subLFOApply">Depth(LFO2)
				</div>
			</div>
		</main>
		<!--エンベロープ-->
		<main class="full-box">
			<span>Envelope(Master Volume)</span>
			<br>
			<span>Attack</span><input type="tel" class="text-mid"
				v-on:blur="function(){attack=clampInput(attack,0.01,60.0,0.5)}" v-model="attack">
			<input type="range" min="0.01" max="2.0" step="0.01" v-model="attack">
			<span>Attack Curve</span><input type="tel" class="text-mid"
				v-on:blur="function(){attackCurve=clampInput(attackCurve,0,1.0,0)}" v-model="attackCurve"><input
				type="range" min="0" max="1" step="0.01" v-model="attackCurve">
			<br>
			<span>Decay</span><input type="tel" class="text-mid"
				v-on:blur="function(){decay=clampInput(decay,0.01,60.0,0.5)}" v-model="decay"><input type="range"
				min="0.01" max="2.0" step="0.01" v-model="decay">
			<span>Sustain</span><input type="tel" class="text-mid"
				v-on:blur="function(){sustain=clampInput(sustain,0,1.0,0.5)}" v-model="sustain"><input type="range"
				min="0.0" max="1.0" step="0.01" v-model="sustain">
			<span>Release</span><input type="tel" class="text-mid"
				v-on:blur="function(){release=clampInput(release,0.01,60.0,0.5)}" v-model="release"><input
				type="range" min="0.01" max="2.0" step="0.01" v-model="release">
		</main>
		<ul class="set">
			<li class="white c" v-on:mousedown="keyPlay(60)" v-on:mouseup="keyStop()"></li>
			<li class="black cs" v-on:mousedown="keyPlay(61)" v-on:mouseup="keyStop()"></li>
			<li class="white d" v-on:mousedown="keyPlay(62)" v-on:mouseup="keyStop()"></li>
			<li class="black ds" v-on:mousedown="keyPlay(63)" v-on:mouseup="keyStop()"></li>
			<li class="white e" v-on:mousedown="keyPlay(64)" v-on:mouseup="keyStop()"></li>
			<li class="white f" v-on:mousedown="keyPlay(65)" v-on:mouseup="keyStop()"></li>
			<li class="black fs" v-on:mousedown="keyPlay(66)" v-on:mouseup="keyStop()"></li>
			<li class="white g" v-on:mousedown="keyPlay(67)" v-on:mouseup="keyStop()"></li>
			<li class="black gs" v-on:mousedown="keyPlay(68)" v-on:mouseup="keyStop()"></li>
			<li class="white a" v-on:mousedown="keyPlay(69)" v-on:mouseup="keyStop()"></li>
			<li class="black as" v-on:mousedown="keyPlay(70)" v-on:mouseup="keyStop()"></li>
			<li class="white b" v-on:mousedown="keyPlay(71)" v-on:mouseup="keyStop()"></li>
		</ul>
	</div>
</div>`,
	data: function () {
		return {
			audioContext: [],
			//Wave 1
			mainosc: [],
			mainWave: "sine",
			mainGain: 350,
			mainDetune: 0,
			mainOctave: 4,
			mainOscVolume: [],
			//Wave 2
			subosc: [],
			subWave: "sine",
			subGain: 350,
			subDetune: 0,
			subOctave: 4,
			subOscVolume: [],
			//Filter
			LPF: [],
			LPFCutoff: 15000,
			LPFEmphasis: 5,
			HPF: [],
			HPFCutoff: 50,
			HPFEmphasis: 5,
			//LFO 1
			mainLFO: [],
			mainLFOWave: "sine",
			mainLFORate: 5,
			mainLFOSync: false,
			mainLFOApply: [],
			mainLFOGain: [],
			mainLFODepth: 10,
			//LFO 2
			subLFO: [],
			subLFOWave: "sine",
			subLFORate: 5,
			subLFOSync: false,
			subLFOApply: [],
			subLFOGain: [],
			subLFODepth: 10,
			//Env
			Envelope: [],
			attack: 0.5,
			attackCurve: 0.0,
			decay: 0.5,
			sustain: 0.5,
			release: 0.5,
			//Others
			masterVolume: [],
			nowplaying: false,
			note: 72
		}
	},
	methods: {
		keyPlay: function (note) {
			this.note = note;
			this.mainOscVolume.gain.value = this.mainGain / 1000;
			this.subOscVolume.gain.value = this.subGain / 1000;
			this.mainosc.type = this.mainWave;
			this.mainosc.frequency.value = this.calcFrequency(note + (this.mainOctave - 4) * 12);
			this.mainosc.detune.value = this.mainDetune;
			this.subosc.type = this.subWave;
			this.subosc.frequency.value = this.calcFrequency(note + (this.subOctave - 4) * 12);
			this.subosc.detune.value = this.subDetune;
			this.LPF.frequency.value = this.LPFCutoff;
			this.LPF.Q.value = this.LPFEmphasis;
			this.HPF.frequency.value = this.HPFCutoff;
			this.HPF.Q.value = this.HPFEmphasis;
			this.Envelope.attack.value = this.attack;
			this.Envelope.attackcurve.value = this.attackCurve;
			this.Envelope.decay.value = this.decay;
			this.Envelope.sustain.value = this.sustain;
			this.Envelope.release.value = this.release;
			this.setLFO();
			if (!this.nowplaying) {
				this.mainosc.start(0);
				this.subosc.start(0);
				this.mainLFO.start(0);
				this.subLFO.start(0);
				this.nowplaying = true;
			}
			this.Envelope.trigger.value = 1;
		},
		keyStop: function () {
			this.Envelope.trigger.value = 0;
		},
		//LFOに値を設定して接続する
		setLFO: function () {
			this.mainLFOGain.disconnect();
			this.subLFOGain.disconnect();
			if (this.mainLFOSync) {
				this.mainLFO.frequency.value = this.calcFrequency(this.note + (this.mainOctave - 4) * 12) * this.mainLFORate;
			} else {
				this.mainLFO.frequency.value = this.mainLFORate;
			}
			this.mainLFOGain.gain.value = this.mainLFODepth;
			if (this.subLFOSync) {
				this.subLFO.frequency.value = this.calcFrequency(this.note + (this.mainOctave - 4) * 12) * this.subLFORate;
			} else {
				this.subLFO.frequency.value = this.subLFORate;
			}
			this.subLFOGain.gain.value = this.subLFODepth;
			//main
			for (const i in this.mainLFOApply) {
				switch (this.mainLFOApply[i]) {
					case "mainOscFreq":
						this.mainLFOGain.connect(this.mainosc.frequency); break;
					case "mainOscVol":
						this.mainLFOGain.connect(this.mainOscVolume.gain); break;
					case "subOscFreq":
						this.mainLFOGain.connect(this.subosc.frequency); break;
					case "subOscVol":
						this.mainLFOGain.connect(this.subOscVolume.gain); break;
					case "LPFCutoff":
						this.mainLFOGain.connect(this.LPF.frequency); break;
					case "LPFEmphasis":
						this.mainLFOGain.connect(this.LPF.Q); break;
					case "HPFCutoff":
						this.mainLFOGain.connect(this.HPF.frequency); break;
					case "HPFEmphasis":
						this.mainLFOGain.connect(this.HPF.Q); break;
					case "mainLFORate":
						this.mainLFOGain.connect(this.mainLFO.frequency); break;
					case "mainLFODepth":
						this.mainLFOGain.connect(this.mainLFOGain.gain); break;
					case "subLFORate":
						this.mainLFOGain.connect(this.subLFO.frequency); break;
					case "subLFODepth":
						this.mainLFOGain.connect(this.subLFOGain.gain); break;
					default:
						console.log("error! not any match " + this.mainLFOApply[i]); break;
				}
			}
			//sub
			for (const i in this.subLFOApply) {
				switch (this.subLFOApply[i]) {
					case "mainOscFreq":
						this.subLFOGain.connect(this.mainosc.frequency); break;
					case "mainOscVol":
						this.subLFOGain.connect(this.mainOscVolume.gain); break;
					case "subOscFreq":
						this.subLFOGain.connect(this.subosc.frequency); break;
					case "subOscVol":
						this.subLFOGain.connect(this.subOscVolume.gain); break;
					case "LPFCutoff":
						this.subLFOGain.connect(this.LPF.frequency); break;
					case "LPFEmphasis":
						this.subLFOGain.connect(this.LPF.Q); break;
					case "HPFCutoff":
						this.subLFOGain.connect(this.HPF.frequency); break;
					case "HPFEmphasis":
						this.subLFOGain.connect(this.HPF.Q); break;
					case "mainLFORate":
						this.subLFOGain.connect(this.mainLFO.frequency); break;
					case "mainLFODepth":
						this.subLFOGain.connect(this.mainLFOGain.gain); break;
					case "subLFORate":
						this.subLFOGain.connect(this.subLFO.frequency); break;
					case "subLFODepth":
						this.subLFOGain.connect(this.subLFOGain.gain); break;
				}
			}
		},
		//textboxに入力された値を補正する
		clampInput: function (value, min, max, defVal) {
			let ret;
			var regexp = new RegExp(/^[+,-]?([1-9]\d*|0)(\.\d+)?$/);
			if (!regexp.test(value)) {
				ret = defVal;
			} else if (value < min) {
				ret = min;
			} else if (value > max) {
				ret = max;
			} else {
				ret = value;
			}
			return ret;
		},
		//引数のmidiノート番号の周波数を計算する
		calcFrequency: function (note) {
			let basefreq;
			const n = (note + 12) % 12;
			let basenote;
			switch (n) {
				case 0:
					basefreq = 261.6;
					basenote = 60;
					break
				case 1:
					basefreq = 277.2;
					basenote = 61;
					break
				case 2:
					basefreq = 293.7;
					basenote = 62;
					break
				case 3:
					basefreq = 311.1;
					basenote = 63;
					break;
				case 4:
					basefreq = 329.6;
					basenote = 64;
					break
				case 5:
					basefreq = 349.2;
					basenote = 65;
					break;
				case 6:
					basefreq = 370.0;
					basenote = 66;
					break;
				case 7:
					basefreq = 392.0;
					basenote = 67;
					break;
				case 8:
					basefreq = 415.3;
					basenote = 68;
					break;
				case 9:
					basefreq = 440.0;
					basenote = 69;
					break;
				case 10:
					basefreq = 466.2;
					basenote = 70;
					break;
				case 11:
					basefreq = 493.9;
					basenote = 71;
					break;
			}
			return basefreq * Math.pow(2.0, (note - basenote) / 12);
		}
	},
	created: async function () {
		//各インスタンスの初期化
		this.audioContext = new AudioContext();
		await AdsrNode.Initialize(this.audioContext);
		this.mainosc = this.audioContext.createOscillator();
		this.subosc = this.audioContext.createOscillator();
		this.mainLFO = this.audioContext.createOscillator();
		this.subLFO = this.audioContext.createOscillator();
		this.mainLFOGain = this.audioContext.createGain();
		this.subLFOGain = this.audioContext.createGain();
		this.subOscVolume = this.audioContext.createGain();
		this.mainOscVolume = this.audioContext.createGain();
		this.LPF = this.audioContext.createBiquadFilter();
		this.HPF = this.audioContext.createBiquadFilter();
		this.LPF.type = "lowpass";
		this.HPF.type = "highpass";
		this.Envelope = new AdsrNode(this.audioContext);
		this.masterVolume = this.audioContext.createGain();
		this.masterVolume.gain.value = 0;
		//ここから初期設定のconnect
		//後で移す
		this.subosc.connect(this.subOscVolume);
		this.subOscVolume.connect(this.LPF);
		this.mainosc.connect(this.mainOscVolume);
		this.mainOscVolume.connect(this.LPF);
		this.LPF.connect(this.HPF);
		this.HPF.connect(this.masterVolume);
		this.mainLFO.connect(this.mainLFOGain);
		this.subLFO.connect(this.subLFOGain);
		this.Envelope.connect(this.masterVolume.gain);
		this.masterVolume.connect(this.audioContext.destination);
	},
	destroyed: function () {
		this.mainosc.stop(0);
		this.subosc.stop(0);
		this.mainLFO.stop(0);
		this.subLFO.stop(0);
	}
});
var app = new Vue({
	el: '#app'
})
function sendResult() {
	API.LMSSetValue('cmi.core.score.raw', app.score + "");
	API.LMSSetValue('cmi.core.lesson_status', app.lesson_status);
	API.LMSCommit("");
	API.LMSFinish("");
	console.log("送信しました。");
}