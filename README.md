# Color System Helper
Cross-file sync color name / order, and export color assets to artboard or table(.csv), without cloud service.
无需云服务，本地跨文件同步色彩命名、色板排序，并导出色板到画板或表格。

## Description
Help you manage your color system without Adobe Cloud Service.

- Export color assets to artboard.
- Cross-file sync color name: duplicate this artboard between files, then click "update color asset" to sync assets.
- Export to table(.csv): export color names, hex and rgba from assets to csv file.

How it run:

The artboard exported used rectangle for the color layer. The color name is the same as the color layer name, and the order is the same as the layer order. You can manually do this also.

When sync, you can choose anything but ensure to include the color layers. The plugin will only focus on:

- Rectangle layers
- with visible solid color fill
- which has been renamed manually

无云服务支持时的色彩系统助手。

- 导出色板到画板：将保存到 assets 中的色彩导出为画板。
- 跨文件色彩名称同步：将导出的画板在文件间复制，点击“update color asset”更新到色板。
- 导出为表格：将 assets 中的颜色名、十六进制色值(hex)及 rgba 导出为表格。

原理：

导出的色彩画板使用矩形作为颜色块图层，颜色名称与颜色块图层名称一致，色板中顺序与颜色块图层顺序一致。遵循这个规律也可以自定义画板。

你也可以选中任何包含颜色图层的内容，插件只会关注：

- 矩形图层
- 有实色填充
- 被手动命名过

## Release notes
### v0.7.0
new!
- export color assets to artboard
- export color assets to csv file

better
- support choosing artboard.
- ignore filled rectangle layer if it has not been named.

新增！
- 支持导出 asset 到画板
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