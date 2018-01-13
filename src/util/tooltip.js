// context 要传入组件中的 this
class Tooltip {
	contrustor (context) {
		this.context = context
	}

	show (type, message) {
		context.$message({
			type,
			message,
			duration: 2000,
			center: true
		})
	}
}

export default Tooltip