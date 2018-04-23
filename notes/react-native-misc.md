# ReactNative Misc

记录 ReactNative 开发中遇到的一些问题及解决办法。

1. Image 全屏问题
1. react-navigation 使用总结

## Image 全屏问题

这个问题前前后后遇到了三次，之前没有记录下来，在第三次遇到的时候就又抓狂了。

这个问题出现在 android 上，iOS 上没有问题。在 iOS 上给 image 设置属性 `resizeMode='stretch'` 和 style `{ flex: 1 }` 就够了，但是在 android 上，还必须要给 style 加上 `{ width: null, height: null }` 才 work，原因未知。

完整的示例代码：

    <Image source={require(...)}
           style={styles.imgBg}
           resizeMode='stretch'>
    </Image>

    imgBg: {
      flex: 1,
      width: null,
      height: null,
    }

## react-navigation 使用总结

[React Navigation](https://reactnavigation.org/)

把一个 react native 的老项目从 0.37 升级到 0.53，其中最大的变化是，原来的导航器 react navigator 被弃用了，官方推荐使用第三方库 React Navigation。

(说实话，整个升级过程下来，并没有体会到 React Navigation 相比原来的 react navigator 有什么更好的地方，更不便利的地方倒是有一堆。)

个人觉得 React Navigation 相比 navigator 的两大不便利之处：

### 不同层级之间页面的跳转

在 react navigator 中，所有页面相当于是在同一层级，所以相互之间跳转是非常灵活的，而在 React Navigation 中，navigator 是分层级的，每层的 navigator 中有 n 个页面，每个页面只能在本层的 navigator 之间方便地跳转，如果第三层 navigator 中的某个页面要跳转到第二层 navigator 中的某个页面，那就麻烦了，你需要把第二层的 navigator 对象传给第三层...

如果想在第三层跳转到第一层的页面，那么需要把第一层的 navigator 对象一层一层往下传。

如果第二层想切换第三层的页面，用 ref。

示例代码：

    renderBottomTabs() {
      const { screenProps, navigation } = this.props
      if (this.isStaff()) {
        return <StaffTabs screenProps={{parentNavigation: navigation, ...screenProps}} />
      } else {
        return <PatientTabs ref={ _ref => this._patientTabs = _ref}
                  screenProps={{parentNavigation: navigation, ...screenProps}} />
      }
    }

![](../art/react-navigation.jpeg)

### 传参

用 react navigator 进行页面跳转时，navigator 中的参数是传到页面的 props 中的，这样我可以用 propTypes 来约束 props 的类型，但用 react navigation 传进来的参数，是要从 navigation.state.params 中取，这样就没法用 propTypes 来定义接收到参数类型了。
