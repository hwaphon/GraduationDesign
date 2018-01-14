// context 要传入组件中的 this
class Tooltip {
	constructor (context) {
		this.context = context
	}

	show (type, message) {
		this.context.$message({
			type,
			message,
			duration: 2000,
			center: true
		})
	}
}

export default Tooltip
