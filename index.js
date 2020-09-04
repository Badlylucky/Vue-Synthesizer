var API
function init() {
	console.log("初期化を開始します")
	var win1 = window
	try {
		while (win1.API == null && win1.parent != null && win1.parent != win1) {
			win1 = win1.parent
		}
	} catch (e) {
		console.log("e12")
	}
	if (win1.API != undefined) {
		API = win1.API
	}
	console.log(API)
	if (API) {
		API.LMSInitialize("")
		API.LMSSetValue('cmi.core.lesson_status', 'browsed')
		API.LMSCommit("")
		console.log("APIを初期化しました")
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
		mainosc: [],
		mainWave: "sine",
		mainGain: 500,
		mainDetune: 0,
		mainLFO:[],
		subosc: [],
		subWave: "sine",
		subGain: 500,
		subDetune: 0,
		subLFO:[],
		mainOscVolume: [],
		subOscVolume: [],
		masterVolume:[],
		nowplaying: false,
		note: 72
	},
	methods: {
		keyPlay: function (note) {
			this.note = note
			this.mainOscVolume.gain.value = this.mainGain / 1000
			this.subOscVolume.gain.value=this.subGain/1000
			this.mainosc.type=this.mainWave
			this.mainosc.frequency.value=calcFrequency(note)
			this.mainosc.detune.value=this.mainDetune
			this.subosc.type=this.subWave
			this.subosc.frequency.value=calcFrequency(note)
			this.subosc.detune.value=this.subDetune
			this.masterVolume.gain.value=1
			if (!this.nowplaying) {
				this.mainosc.start(0)
				this.subosc.start(0)
				this.nowplaying = true
			}
			setTimeout(function () { app.masterVolume.gain.value = 0 }, 400)
		}
	},
	created: function () {
		this.audioContext = new AudioContext()
		this.mainosc = this.audioContext.createOscillator()
		this.subosc = this.audioContext.createOscillator()
		this.mainLFO = this.audioContext.createOscillator()
		this.subLFO = this.audioContext.createOscillator()
		this.subOscVolume = this.audioContext.createGain()
		this.mainOscVolume = this.audioContext.createGain()
		this.masterVolume = this.audioContext.createGain()
		this.masterVolume.gain.value = 0
		this.subosc.connect(this.subOscVolume)
		this.subOscVolume.connect(this.masterVolume)
		this.mainosc.connect(this.mainOscVolume)
		this.mainOscVolume.connect(this.masterVolume)
		this.masterVolume.connect(this.audioContext.destination)
	},
	destroyed: function () {
		this.subosc.stop(0)
	}
})
function sendResult() {
	API.LMSSetValue('cmi.core.score.raw', app.score + "")
	API.LMSSetValue('cmi.core.lesson_status', app.lesson_status)
	API.LMSCommit("")
	API.LMSFinish("")
	console.log("送信しました。")
}