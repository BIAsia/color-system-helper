# Color System Helper
Cross-file sync color name / order, and export color assets to table(.csv), without cloud service.
无需云服务，本地跨文件同步色彩命名、色板排序，并导出色板为表格。

## Description
Help you manage your color system without Adobe Cloud Service.

- Cross-file sync color name: duplicate your color system between files as named color layers, and click "update color asset".
- Export to table(.csv): export color names, hex and rgba from assets to csv file.

Use rectangle for the color layer. The color name is the same as the color layer name, and the order is the same as the layer order. 

You can choose anything but ensure including the color layers. The plugin will only focus on:

- Rectangle layers
- with visible solid color fill
- which has been renamed manually

无云服务支持时的色彩系统助手。

- 跨文件色彩名称同步：将你的色彩系统以命名颜色块的形式在文件间复制，点击“update color asset”更新到色板。
- 导出为表格：将 assets 中的颜色名、十六进制色值(hex)及 rgba 导出为表格。

使用矩形作为颜色块图层，颜色名称与颜色块图层名称一致，顺序与颜色块图层顺序一致。

你可以选中任何包含颜色图层的内容，插件会只关注：

- 矩形图层
- 有实色填充
- 被手动命名过

## Release notes
### v0.7.0
new!
- export color assets to csv file

better
- support choosing artboard.
- ignore filled rectangle layer if it has not been named.

新增！
- 支持导出 asset 到 csv 文件

优化
- 支持直接选中颜色块所在画板来添加
- 忽略未命名的矩形色块

### v0.6.0
- meet basic requirement.
- ignore text & image.
- feedback when success.


## License

Apache 2.0