# 板载外设

`@aily-project/lib-cybercam` 是 01Studio CyberCAM K230 的基础板级库。功能化拆分后，本库保留 10 个 IIO ADC、音频、IMU 和系统积木。原有 4 个文本文件 type 已保持不变迁至 `@aily-project/lib-file`，原有 6 个 UART type 已保持不变迁至 `@aily-project/lib-serial`，两组均作为不出现在 toolbox 中的旧工程兼容定义；原有 12 个 GPIO、板载 LED/按键与 PWM type 已保持不变迁至 `@aily-project/lib-cybercam-gpio`；原有 23 个相机、显示与 KPU type 同样保持不变迁至 `@aily-project/lib-cybercam-cv`，新视觉库另增加一个完整相机读取结果积木。

保留的能力包括：

- K230 Linux IIO ADC0/ADC1 原始值与标称电压
- K230 ALSA 音频设备、QMI8658 IMU 与芯片 ID

不要在 Raspberry Pi 或独立 WalnutPi Linux 板上安装本库；这些平台应选择对应的通用 Python/Linux 功能库。

## GPIO 拆分

以下 12 个既有 block type 只改变所属包，不改名，也不改变既有输入或 dropdown machine value：

- 数字 GPIO（4）：`cybercam_gpio_init`、`cybercam_gpio_write`、`cybercam_gpio_read`、`cybercam_gpio_deinit`
- 板载资源（2）：`cybercam_led_write`、`cybercam_key_pressed`
- PWM（6）：`cybercam_pwm_init`、`cybercam_pwm_frequency`、`cybercam_pwm_duty`、`cybercam_pwm_enable`、`cybercam_pwm_disable`、`cybercam_pwm_close`

使用这些积木的项目必须安装 `@aily-project/lib-cybercam-gpio`。旧工作区中的 type 无需重命名，但不能同时加载仍包含这 12 个定义的旧聚合版 `lib-cybercam` 与新 GPIO 包，否则会重复注册 Blockly block 和 Python generator handler。通用 `@aily-project/lib-gpio` 使用 gpiozero，不具备 CyberCAM 的 `board`/`digitalio` 引脚别名或 K230 `periphery.PWM` 芯片/通道语义，不能替代本板专用包。

## UART 拆分

以下 6 个既有 block type 已保持原有序列化 type 迁至 `@aily-project/lib-serial`：`cybercam_uart_init`、`cybercam_uart_available`、`cybercam_uart_read`、`cybercam_uart_write`、`cybercam_uart_flush`、`cybercam_uart_close`。它们仅作为不出现在 toolbox 中的旧工程兼容定义；旧工作区无需重命名，但必须加入 `@aily-project/lib-serial` 依赖。

新工程使用 `linux_uart_init`、`linux_uart_available`、`linux_uart_read`、`linux_uart_write`、`linux_uart_flush` 和 `linux_uart_close`，并在初始化积木中把 CyberCAM 串口设备明确设置为 `/dev/ttyS2`。不能同时加载新 `lib-serial` 与仍注册上述 6 个 `cybercam_uart_*` type 的旧聚合版 `lib-cybercam`，否则 Blockly block 和 Python generator handler 会重复注册。

## 文件操作拆分

以下 4 个既有 block type 已保持原有序列化 type 迁至 `@aily-project/lib-file`：`cybercam_file_read`、`cybercam_file_write`、`cybercam_file_exists`、`cybercam_file_list`。它们仅作为不出现在 toolbox 中的旧工程兼容定义；旧工作区无需重命名，但必须加入 `@aily-project/lib-file` 依赖。

新工程使用工具箱可见的 `python_file_read`、`python_file_write`、`python_file_exists` 和 `python_file_list`。不能同时加载新 `lib-file` 与仍注册上述 4 个 `cybercam_file_*` type 的旧聚合版 `lib-cybercam`，也不能与仍注册相同 `python_file_*` type 的旧版 `lib-python-core` 同时加载，否则 Blockly block 和 Python generator handler 会重复注册。

## 机器视觉拆分

以下 23 个既有 block type 只改变所属包，不改名，也不改变既有输入和 dropdown machine value：

- 相机与显示（11）：`cybercam_camera_init`、`cybercam_camera_opened`、`cybercam_camera_read`、`cybercam_camera_hmirror`、`cybercam_camera_vflip`、`cybercam_camera_release`、`cybercam_display_init`、`cybercam_display_rotation`、`cybercam_display_show`、`cybercam_ide_show`、`cybercam_lcd_direction`
- KPU 与结果（12）：`cybercam_ai_init_simple`、`cybercam_ai_init_face`、`cybercam_ai_init_mask`、`cybercam_ai_init_hand_keypoint`、`cybercam_ai_init_ocr`、`cybercam_ai_init_licence`、`cybercam_ai_run`、`cybercam_ai_run_confidence`、`cybercam_ai_run_thresholds`、`cybercam_result_length`、`cybercam_result_item`、`cybercam_result_property`

使用这些积木的项目必须安装 `@aily-project/lib-cybercam-cv`。新包还提供新增 type `cybercam_camera_read_raw`，返回完整 `(ret, img)`。不要同时加载仍包含上述 23 个定义的旧聚合版 `lib-cybercam` 与新视觉包，否则会重复注册 block 和 generator handler。

### ADC 运行前提

ADC 积木只开放 CyberCAM 背面焊盘 ADC0/ADC1。原始值为 12 位（0–4095），电压换算默认采用开发板标称满量程 3.6 V；精密测量应传入校准后的满量程。该功能依赖系统镜像通过 IIO 注册 K230 ADC，较旧镜像可能不可用，生成程序会在找不到或无法读取设备时给出明确错误。不要向焊盘输入超过 3.6 V；K230 芯片侧 ADC 为 1.8 V，CyberCAM 通过板级分压扩大量程。

依据：[CyberCAM GPIO/ADC 引脚说明](https://wiki.01studio.cc/docs/cybercam/basic_examples/gpio_intro/)；[K230 Linux SDK ADC/IIO 使用说明](https://www.kendryte.com/k230_linux/en/main/app_develop_guide/driver/adc.html)。后者是开发分支文档，因此仍需按目标镜像验证。

## Runtime requirement

项目级 `package.json` 必须设置 `"devmode": "python"`，编辑器构建也必须包含 aily CPython generator runtime。库兼容性元数据不会自行激活该 runtime。

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-cybercam` |
| Version | 0.0.1 |
| Blocks | 10 |
| Board | 01Studio CyberCAM K230 (Python mode) |
| Author | ailyProject; hardware APIs by 01Studio |
| Source | https://github.com/01studio-lab/01studio_wiki/tree/main/docs/cybercam |
| License | MIT |

## Functional libraries

按项目实际需要组合安装：

| Removed from CyberCAM | Replacement library | New block prefix |
|---|---|---|
| Python 基础语法与程序结构（13） | `@aily-project/lib-core` | `python_*` |
| OpenCV、绘图和码识别（14） | `@aily-project/lib-vision` | `python_*` |
| Socket 与 HTTP 文件服务器（10） | `@aily-project/lib-network` | `python_*` |
| MQTT（7） | `@aily-project/lib-paho-mqtt` | `python_mqtt_*` |
| Requests HTTP 客户端（2 个旧 type 隐藏兼容；另有 22 个新积木） | `@aily-project/lib-requests` | 旧 `python_http_*` type 不变；新工程使用 `python_requests_*` |
| 标准文件操作（4 个可见 + 4 个旧 type 隐藏兼容） | `@aily-project/lib-file` | 旧工程 type 不变；新工程使用 `python_file_*` |
| 系统命令和 CPU 温度（2） | `@aily-project/lib-filesystem` | `python_*` |
| CyberCAM UART（6 个迁移；旧 type 隐藏兼容） | `@aily-project/lib-serial` | 旧工程 type 不变；新工程使用 `linux_uart_*` |
| CyberCAM GPIO、板载 LED/按键与 PWM（12 个迁移） | `@aily-project/lib-cybercam-gpio` | 迁移的 `cybercam_*` type 不变 |
| CyberCAM 相机、显示与 KPU（23 个迁移 + 1 个新增） | `@aily-project/lib-cybercam-cv` | 迁移的 `cybercam_*` type 不变 |

此前从聚合库移出的 52 个通用积木改用对应功能库，其中 14 个原视觉 type 迁移到 `vision`；该通用库现已扩展为 32 个图像处理、轮廓与码识别积木，可用于 CyberCAM，而且不会在 `cybercam_cv` 中重复定义。面向普通 V4L2 设备的 4 个 `linux_camera_*` 仅适用于兼容 Linux 板卡；CyberCAM 的 CSI 相机必须使用 `cybercam_cv` 的 `cybercam_camera_*`。

ADC 和音频积木仍保留在本库，因为它们包含 CyberCAM 固定焊盘或 K230 设备名。文件操作由 `@aily-project/lib-file` 维护：旧 `cybercam_file_*` type 保留为隐藏兼容定义，新工程使用 `python_file_*`。UART 已由 `@aily-project/lib-serial` 统一维护：旧 `cybercam_uart_*` type 保留为隐藏兼容定义，新工程使用 `linux_uart_*` 并指定 `/dev/ttyS2`。CyberCAM 专用 GPIO、LED/按键和 PWM 则由 `@aily-project/lib-cybercam-gpio` 独立维护。

## Migration from the aggregate package layout

将旧工程中已移除的通用 `cybercam_*` 积木替换为上表对应库的 `python_*` 积木；4 个 `cybercam_file_*` 是例外，它们已在 `lib-file` 中隐藏兼容，无需重命名。块的输入结构与 dropdown machine value 保持一致，可按前缀进行迁移；新建通用积木的以下 toolbox shadow 默认值有意采用通用库语义，迁移旧工程时应保留原输入：

- 图像路径：`/data/...` 改为 `/tmp/...`
- 新的通用文件积木：文件路径默认为 `file.txt`，目录列举默认为当前目录 `.`；隐藏兼容块仍保留旧 `/data/...` fallback
- 绘制文字：`CyberCAM` 改为 `Python`
- Socket listen backlog：`0` 改为 `1`
- MQTT 默认主题：`/cybercam/data` 改为 `/python/data`

迁移的 4 个文件 type、6 个 UART type、12 个 GPIO/LED/按键/PWM type 和 23 个机器视觉 type 均无需重命名，但旧项目需要分别把 `@aily-project/lib-file`、`@aily-project/lib-serial`、`@aily-project/lib-cybercam-gpio` 和 `@aily-project/lib-cybercam-cv` 加入依赖。基础库不再提供这些 block 定义或 generator handler；其中旧文件和 UART type 只在各自新包中隐藏注册，不进入新工程 toolbox。

典型板级工程使用 `@aily-project/lib-core` 和本库；需要文件操作时加入 `@aily-project/lib-file`，需要系统命令或 CPU 温度时加入 `@aily-project/lib-filesystem`；需要 UART 时加入 `@aily-project/lib-serial`，新建初始化积木时把设备设置为 `/dev/ttyS2`；需要数字 IO、板载 LED/按键或 PWM 时加入 `@aily-project/lib-cybercam-gpio`。机器视觉工程再加入 `@aily-project/lib-cybercam-cv`，需要 OpenCV、绘图或码识别时同时加入 `@aily-project/lib-vision`。
