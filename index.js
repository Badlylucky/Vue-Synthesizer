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
		scriptProcessorNode: [],
		wave: "sine",
		gain: 500,
		nowplaying: false,
		osc: [],
		masterVolume: [],
		note: 72
	},
	methods: {
		keyPlay: function (note) {
			this.note = note
			this.osc.type = this.wave
			this.osc.frequency.value = calcFrequency(note)
			this.masterVolume.gain.value = this.gain / 1000
			console.log(this.osc.type + " " + this.osc.frequency.value + " " + this.masterVolume.gain.value)
			if (!this.nowplaying) {
				this.osc.start(0)
				this.nowplaying = true
			}
			setTimeout(function () { app.masterVolume.gain.value = 0 }, 400)
		}
	},
	created: function () {
		this.audioContext = new AudioContext()
		const bufferSize = 4096 //仮で置く
		this.scriptProcessorNode = this.audioContext.createScriptProcessor(bufferSize, 2, 2)
		let dummy = this.audioContext.createBufferSource()
		dummy.connect(this.scriptProcessorNode) //iOSのバグ防止
		this.osc = this.audioContext.createOscillator()
		this.osc.type = this.wave
		this.osc.frequency.value = 440
		this.masterVolume = this.audioContext.createGain()
		this.masterVolume.gain.value = 0
		//this.osc.connect(this.masterVolume)
		this.scriptProcessorNode.connect(this.masterVolume)
		this.masterVolume.connect(this.audioContext.destination)
	},
	destroyed: function () {
		this.osc.stop(0)
	}
})
//ここから波形の初期化
app.scriptProcessorNode.onaudioprocess = function (event) {
	let inputLs = event.inputBuffer.getChannelData(0)
	let inputRs = event.inputBuffer.getChannelData(1)
	let outputLs = event.outputBuffer.getChannelData(0)
	let outputRs = event.outputBuffer.getChannelData(1)
	const frequency = calcFrequency(app.note) //音高を求める
	const fs = app.audioContext.sampleRate
	let n = 0 // Phase
	for (let i = 0; i < fs * 0.4 / 2; i++) {
		let t0 = fs / frequency
		let output = 0
		switch (app.wave) {
			case 'sine':
				output = Math.sin((2 * Math.PI * frequency * n) / fs)
				break
			case 'square':
				output = (n < (t0 / 2)) ? 1 : -1
				break
			case 'sawtooth':
				let p = 2 * n / t0
				output = p - 1
				break
			case 'triangle':
				let q = 4 * n / t0
				output = (n < (t0 / 2)) ? (-1 + q) : (3 - q)
				break
			case 'noise':
				output = 2 * (Math.random() - 0.5)
				break
			default:
				break
		}
		outputLs[i] = output
		outputRs[i] = output
		n++
		if (n >= t0) {
			n = 0
		}
	}
}
function sendResult() {
	API.LMSSetValue('cmi.core.score.raw', app.score + "")
	API.LMSSetValue('cmi.core.lesson_status', app.lesson_status)
	API.LMSCommit("")
	API.LMSFinish("")
	console.log("送信しました。")
}