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
//引数のmidiノート番号の周波数を計算する
function calcFrequency(note) {
	let basefreq
	const n = (note + 12) % 12
	let basenote
	switch (n) {
		case 0:
			basefreq = 261.6
			basenote = 60
			break
		case 1:
			basefreq = 277.2
			basenote = 61
			break
		case 2:
			basefreq = 293.7
			basenote = 62
			break
		case 3:
			basefreq = 311.1
			basenote = 63
			break
		case 4:
			basefreq = 329.6
			basenote = 64
			break
		case 5:
			basefreq = 349.2
			basenote = 65
			break
		case 6:
			basefreq = 370.0
			basenote = 66
			break
		case 7:
			basefreq = 392.0
			basenote = 67
			break
		case 8:
			basefreq = 415.3
			basenote = 68
			break
		case 9:
			basefreq = 440.0
			basenote = 69
			break
		case 10:
			basefreq = 466.2
			basenote = 70
			break
		case 11:
			basefreq = 493.9
			basenote = 71
			break
	}
	return basefreq * Math.pow(2.0, (note - basenote) / 12)
}
var app = new Vue({
	el: '#app',
	data: {
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
		mainLFOApply: [],
		mainLFOGain: [],
		mainLFODepth: 10,
		//LFO 2
		subLFO: [],
		subLFOWave: "sine",
		subLFORate: 5,
		subLFOApply: [],
		subLFOGain: [],
		subLFODepth: 10,
		//Others
		masterVolume:[],
		masterGain: 500,
		nowplaying: false,
		note: 72
	},
	methods: {
		keyPlay: function (note) {
			this.note = note;
			this.mainOscVolume.gain.value = this.mainGain / 1000;
			this.subOscVolume.gain.value=this.subGain/1000;
			this.mainosc.type=this.mainWave;
			this.mainosc.frequency.value=calcFrequency(note+(this.mainOctave-4)*12);
			this.mainosc.detune.value=this.mainDetune;
			this.subosc.type=this.subWave;
			this.subosc.frequency.value=calcFrequency(note+(this.subOctave-4)*12);
			this.subosc.detune.value=this.subDetune;
			this.LPF.frequency.value=this.LPFCutoff;
			this.LPF.Q.value=this.LPFEmphasis;
			this.HPF.frequency.value=this.HPFCutoff;
			this.HPF.Q.value=this.HPFEmphasis;
			this.masterVolume.gain.value=this.masterGain/1000;
			this.setLFO();
			if (!this.nowplaying) {
				this.mainosc.start(0);
				this.subosc.start(0);
				this.mainLFO.start(0);
				this.subLFO.start(0);
				this.nowplaying = true;
			}
			setTimeout(function () { app.masterVolume.gain.value = 0 }, 400);
		},
		//LFOに値を設定して接続する
		setLFO:function(){
			this.mainLFOGain.disconnect();
			this.subLFOGain.disconnect();
			this.mainLFO.frequency.value=this.mainLFORate;
			this.mainLFOGain.gain.value=this.mainLFODepth;
			this.subLFO.frequency.value=this.subLFORate;
			this.subLFOGain.gain.value=this.subLFODepth;
			//main
			for(const i in this.mainLFOApply){
				switch(this.mainLFOApply[i]){
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
					case "masterVol":
						this.mainLFOGain.connect(this.masterVolume.gain); break;
					default:
						console.log("error! not any match"); break;
				}
			}
			//sub
			for(const i in this.subLFOApply){
				switch(this.subLFOApply[i]){
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
					case "masterVol":
						this.subLFOGain.connect(this.masterVolume.gain); break;
					case "mainLFORate":
						this.subLFOGain.connect(this.mainLFO.frequency); break;
					case "mainLFODepth":
						this.subLFOGain.connect(this.mainLFOGain.gain); break;
				}
			}
		}
	},
	created: function () {
		//各インスタンスの初期化
		this.audioContext = new AudioContext();
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
		this.LPF.type="lowpass";
		this.HPF.type="highpass";
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
		this.masterVolume.connect(this.audioContext.destination);
	},
	destroyed: function () {
		this.mainosc.stop(0);
		this.subosc.stop(0);
	}
})
function sendResult() {
	API.LMSSetValue('cmi.core.score.raw', app.score + "");
	API.LMSSetValue('cmi.core.lesson_status', app.lesson_status);
	API.LMSCommit("");
	API.LMSFinish("");
	console.log("送信しました。");
}