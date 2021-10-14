<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	export default {
		name: 'App'
	}
</script>
<style>
	/* 解决element-ui的table表格控件表头与内容列不对齐问题 */
	.el-table th.gutter {
		display: table-cell !important;
	}

	.marker {
		position: absolute;
		border-radius: 50%;
		z-index: 999;
	}

	.el-dialog {
		display: flex;
		flex-direction: column;
		margin: 0 !important;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/*height:600px;*/
		max-height: calc(100% - 30px);
		max-width: calc(100% - 30px);
	}

	.el-dialog .el-dialog__body {
		flex: 1;
		overflow: auto;
	}
	
	.flex{
		display: flex;
	}
</style>
