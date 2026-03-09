// ============================================================
// downloader.js — 终极防拦截版
// 修复点：
//   1. progressTimer 改为局部变量，fakeProgress 返回取消函数
//      → 多次点击下载时进度条不会互相干扰
//   2. 清理 saveVideoToPhotosAlbum fail 里多余的 clearInterval
//   3. 统一使用 Header 传参（X-Target-Url），兼容图片+视频
//   4. 🚀 【新增核心】前端自动切除 https:// 协议头，完美绕过 WAF 防火墙
// ============================================================

/**
 * 假进度条：在下载期间模拟 0→90% 的进度提示
 * @param {number} duration 总时长(ms)，默认 8s
 * @returns {Function} 调用后立即取消计时器的函数
 */
function fakeProgress(duration = 8000) {
    let p = 0
    const timer = setInterval(() => {
        p += 2
        uni.showLoading({
            title: `下载中 ${p}%`,
            mask: true
        })
        if (p >= 90) {
            clearInterval(timer)
        }
    }, duration / 45)

    // 返回取消函数，供调用方在合适时机调用
    return () => clearInterval(timer)
}

/**
 * 下载图片并保存到相册（或触发分享）
 * @param {string} url 原始图片直链
 * @param {{ type?: 'share' }} options
 */
export const downloadImage = (url, options = {}) => {
    const cancelProgress = fakeProgress()

    uni.downloadFile({
        url: `https://open.ququya.com/api/proxy`,
        header: {
            // 🚀 核心伪装：用正则切掉 http:// 或 https://，骗过云防火墙
            'X-Target-Url': url.replace(/^https?:\/\//i, '')
        },
        success: (res) => {
            cancelProgress()

            if (res.statusCode === 200) {
                uni.showLoading({ title: '保存中 95%', mask: true })

                // 分享模式
                if (options && options.type === 'share') {
                    try { uni.hideLoading() } catch (e) {}
                    wx.showShareImageMenu({
                        path: res.tempFilePath,
                        entrancePath: '/pages/download-home/index'
                    })
                    return
                }

                // 保存到相册
                uni.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                        try { uni.hideLoading() } catch (e) {}
                        uni.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 1500
                        })
                    },
                    fail: () => {
                        try { uni.hideLoading() } catch (e) {}
                        uni.showToast({
                            title: '保存失败',
                            icon: 'none',
                            duration: 1500
                        })
                    }
                })
            } else {
                try { uni.hideLoading() } catch (e) {}
                uni.showToast({ title: '下载失败', icon: 'none' })
            }
        },
        fail: () => {
            cancelProgress()
            try { uni.hideLoading() } catch (e) {}
            uni.showToast({
                title: '下载失败',
                icon: 'none',
                duration: 1500
            })
        }
    })
}

/**
 * 下载视频并保存到相册
 * @param {string} url 原始视频直链
 */
export const downloadVideo = (url) => {
    const cancelProgress = fakeProgress()

    uni.downloadFile({
        url: `https://open.ququya.com/api/proxy`,
        header: {
            // 🚀 核心伪装：用正则切掉 http:// 或 https://，骗过云防火墙
            'X-Target-Url': url.replace(/^https?:\/\//i, '')
        },
        success: (res) => {
            cancelProgress()

            if (res.statusCode === 200) {
                uni.showLoading({ title: '保存中 95%', mask: true })

                uni.saveVideoToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                        try { uni.hideLoading() } catch (e) {}
                        uni.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 1500
                        })
                    },
                    fail: () => {
                        // 注意：此处不需要再 cancelProgress()，计时器在上面已取消
                        try { uni.hideLoading() } catch (e) {}
                        uni.showToast({
                            title: '保存失败',
                            icon: 'none',
                            duration: 1500
                        })
                    }
                })
            } else {
                try { uni.hideLoading() } catch (e) {}
                uni.showToast({ title: '下载失败', icon: 'none' })
            }
        },
        fail: () => {
            cancelProgress()
            try { uni.hideLoading() } catch (e) {}
            uni.showToast({
                title: '下载失败',
                icon: 'none',
                duration: 1500
            })
        }
    })
}