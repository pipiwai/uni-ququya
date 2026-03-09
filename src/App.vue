<template>
	<view>
		<router-view></router-view>
		<view class="global-footer">
			<text>全局底部菜单</text>
		</view>
	</view>
</template>

<script>
export default {
	onLaunch: function (e) {
		// ✅ 建议保留：使用新接口减少黄色警告
		try {
			const deviceInfo = wx.getDeviceInfo();
			console.log('趣趣鸭已启动:', deviceInfo.brand, deviceInfo.model);
		} catch (err) {
			console.log('旧版本基础库');
		}
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	onShareAppMessage() {
		return {
			title: '抖音、小红书等平台视频图片无水印下载',
			path: '/pages/download-home/index'
		}
	},
	onShareTimeline() {
		return {
			title: '抖音、小红书等平台视频图片无水印下载',
			query: '/pages/download-home/index'
		}
	}
}
</script>

<style src="./main.css"></style>

<style>
/*  字体代码已经删掉啦，因为你已经在后台加了白名单，TDesign 会自己搞定 */

.global-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 20rpx 0;
  background-color: #ffffff;
  border-top: 1rpx solid #eeeeee;
  font-size: 24rpx;
  color: #999999;
}
</style>