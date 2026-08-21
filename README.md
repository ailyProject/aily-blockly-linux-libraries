# aily-blockly-linux-libraries

面向 aily Blockly 独立 CPython 生成器的功能化积木库。所有生成器只注册到 `globalThis.Python`；项目根 `package.json` 仍须设置 `"devmode": "python"`，编辑器构建也必须包含 Python generator runtime。

## Python 库清单与运行时

新增的 [Python 库完整清单](PYTHON-LIBRARIES.md) 以 `catalog/python-libraries.json` 为统计真源：共 **100** 个 Linux/Raspberry Pi CPython 库，分为 13 类。其中 **26** 个是通过 Adafruit Blinka 在 CPython 中运行的 `adafruit-circuitpython-*` 驱动，另外 **74** 个是普通 CPython、Linux/Pi 系统绑定或平台栈；它们都不是 MicroPython-only 库。文档同时列出每项的目录、导入路径、安装命令、运行时分类，以及 Raspberry Pi 5B 的 DHT、NeoPixel、I²C clock stretching、venv 和 Build HAT 限制。

| 目录 | npm 包 | 积木数 | 功能 |
| --- | --- | ---: | --- |
| `core` | `@aily-project/lib-core` | 18 | Python 基础语法、程序结构、变量和基础数据。 |
| `vision` | `@aily-project/lib-vision` | 32 | 通用 OpenCV 图像处理、连通域/轮廓分析、绘图与码识别。 |
| `network` | `@aily-project/lib-network` | 23 | 通用 IPv4/IPv6、TCP/UDP Socket 与标准库 HTTP 文件服务器。 |
| `paho_mqtt` | `@aily-project/lib-paho-mqtt` | 21 | Paho MQTT 2.x 发布/订阅、认证、TLS、回调与消息循环。 |
| `requests` | `@aily-project/lib-requests` | 24（工具箱可见 22） | Requests HTTP 客户端、Session、请求选项、上传下载、响应与异常处理；另隐藏兼容 2 个 `python_http_*`。 |
| `file` | `@aily-project/lib-file` | 8（工具箱可见 4） | 标准文本文件与目录操作；另隐藏注册 4 个 `cybercam_file_*` 以兼容旧工程。 |
| `filesystem` | `@aily-project/lib-filesystem` | 2 | 系统命令和 Linux CPU 温度。 |
| `camera` | `@aily-project/lib-camera` | 4 | 通过 OpenCV 和 V4L2 初始化、采集与释放普通 Linux 摄像头。 |
| `gpio` | `@aily-project/lib-gpio` | 17 | 基于 gpiozero 的 GPIO、可配置 LED/按键和 PWM（15 个工具箱可见积木）。 |
| `serial` | `@aily-project/lib-serial` | 12（工具箱可见 6） | Linux/CyberCAM UART；新工程使用 `linux_uart_*`，CyberCAM 设备固定为 `/dev/ttyS2`，另隐藏注册 6 个 `cybercam_uart_*` 以兼容旧工程。 |
| `audio` | `@aily-project/lib-audio` | 2 | 通过 ALSA 播放和录制 WAV 音频。 |
| `rpi_i2c` | `@aily-project/lib-rpi-i2c` | 9 | 树莓派 smbus2 寄存器、块数据与重复启动 I2C 通信。 |
| `rpi_spi` | `@aily-project/lib-rpi-spi` | 5 | 树莓派 py-spidev 初始化、全双工传输、读写与关闭。 |
| `rpi_picamera2` | `@aily-project/lib-rpi-picamera2` | 7 | 树莓派官方 Picamera2/libcamera CSI 相机配置、控制与采集。 |
| `cybercam` | `@aily-project/lib-cybercam` | 10 | CyberCAM ADC、音频、IMU 与芯片 ID。 |
| `cybercam_gpio` | `@aily-project/lib-cybercam-gpio` | 12 | CyberCAM GPIO、板载 LED/按键与 PWM；既有 type 原样迁移。 |
| `cybercam_cv` | `@aily-project/lib-cybercam-cv` | 24 | CyberCAM 相机/显示/KPU：23 个既有 type 原样迁移，并新增完整相机读取结果积木。 |

板卡专用扩展使用清晰的目录与 API 命名空间：树莓派为 `rpi_*`（npm 包为 `lib-rpi-*`），CyberCAM 为 `cybercam_*`。`cybercam_gpio` 接收的 12 个 GPIO/LED/按键/PWM type 与 `cybercam_cv` 接收的 23 个相机/显示/KPU type 均不改名；视觉包新增的完整读取积木为 `cybercam_camera_read_raw`。`serial` 还隐藏注册 6 个既有 `cybercam_uart_*` type，`file` 隐藏注册 4 个既有 `cybercam_file_*` type，均仅用于反序列化旧工作区；新工程分别使用工具箱可见的 `linux_uart_*` 与 `python_file_*`。现有通用库及其迁移稳定的 `linux_*`/`python_*` type 也不改名。

## 硬件与 API 边界

- 已核对的 01Studio CyberCAM GPIO/Blinka 教程只给出 I2C2/SPI0 的引脚复用信息，未给出可验证的 Python 构造器、设备节点和启用流程，因此本仓库暂不宣称 CyberCAM I2C/SPI 支持。
- CyberCAM ADC 积木依据 K230 Linux SDK 的 IIO sysfs 合约实现，只开放板上引出的 ADC0/ADC1；它依赖目标镜像注册 ADC 驱动，3.6 V 是开发板标称量程而不是精密校准值。
- CyberCAM UART2 复用现有 `@aily-project/lib-serial`：新工程必须使用 6 个工具箱可见的 `linux_uart_*` type，并将 `DEVICE` 固定填写为 `/dev/ttyS2`。6 个 `cybercam_uart_*` 只作为隐藏兼容定义保留；UART2 使用期间不要同时把 TX2/RX2 初始化为 GPIO。
- CyberCAM CSI 相机、板载显示、IDE 预览、屏幕方向和 `walnutpi.kpu` 由 `cybercam_cv` 独立维护；普通 V4L2 `camera` 库不能替代该 CSI 管线。
- 官方机器视觉教程中的通用 OpenCV、绘图、颜色/形状处理、QR、条码和 AprilTag 不在 `cybercam_cv` 重复定义，继续使用兼容 CyberCAM 的 `vision`。
- `rpi_*` 新库仅声明兼容 Raspberry Pi 5。I2C/SPI 必须先在系统中启用并获得 `/dev/i2c-*`、`/dev/spidev*` 权限；Picamera2 应通过 Raspberry Pi OS 的 APT 软件包安装。

## 迁移

- 原 `network` 中的 7 个 `python_mqtt_*` type 已保持原名迁移至独立的 `@aily-project/lib-paho-mqtt`；旧工作区无需重命名这些 type，但必须改为加载新包。不要将新包与仍注册相同 7 个 type 的旧版 `lib-network` 同时加载。
- 原 `network` 中的 `python_http_request` 与 `python_http_response` 已保持原 schema 和历史生成语义迁至独立的 `@aily-project/lib-requests`，并在新工具箱中隐藏；新工程使用 22 个 `python_requests_*` type。旧工作区无需改 type，但必须改为加载新包；不要与仍注册这两个 type 的旧版 `lib-network` 或 `lib-python-core` 同时加载。标准库 `python_http_server` 继续留在 `network`。
- 原 `@aily-project/lib-python-core` 的功能拆为 `core`、`vision`、`network`、`file`、`filesystem`；其中 `file` 接收 4 个 `python_file_*` type，`filesystem` 仅保留 `python_command` 与 `python_cpu_temperature`。
- 原 `@aily-project/lib-linux-python` 被 `vision`、`camera`、`gpio`、`serial`、`audio` 取代。
- 原 `lib-python-core` / `lib-linux-python` 拆出的 73 个 block type 保持不变，该部分已有工作区无需改名。不要同时加载旧聚合库和新功能库。
- `cybercam` 0.0.1 剥离了 52 个通用积木：Python 基础 13 个、OpenCV/码识别 14 个、网络 19 个、文件 4 个、系统 2 个。旧工程中的 4 个 `cybercam_file_*` 可由 `lib-file` 隐藏兼容定义直接恢复；其余通用 `cybercam_*` type 需替换为对应功能库的 `python_*` type。
- 机器视觉拆分阶段，`cybercam` 将 23 个相机、显示和 KPU type 原样迁至 `cybercam_cv`，当时基础库由 51 块减至 28 块；新视觉库另增加 `cybercam_camera_read_raw`，共 24 块。后续 GPIO 拆分后的当前基础库数量见下一项。
- `cybercam` 随后将 12 个 GPIO、板载 LED/按键和 PWM type 原样迁至 `cybercam_gpio`；`@aily-project/lib-cybercam-gpio` 共 12 块，该阶段基础 `cybercam` 剩 16 块。旧工作区无需重命名这些 type，但必须加入新 GPIO 包；不要将新包与仍注册相同 12 个 type 的旧版 `lib-cybercam` 同时加载。
- UART 拆分阶段，6 个 `cybercam_uart_*` type 从基础 `cybercam` 移入现有 `@aily-project/lib-serial` 并隐藏注册，只用于兼容旧工作区；基础 `cybercam` 因此现为 10 块。新工程改用 6 个工具箱可见的 `linux_uart_*`，在 CyberCAM 上将 `DEVICE` 固定填写为 `/dev/ttyS2`。更新后的 `serial` 共注册 12 个 definition、工具箱仅展示 6 个；不要与仍注册这些旧 UART type 的旧版 `lib-cybercam` 同时加载。
- 4 个 `cybercam_file_*` type 已保持序列化名称移入 `@aily-project/lib-file` 并隐藏注册；新工程使用工具箱可见的 `python_file_read`、`python_file_write`、`python_file_exists` 与 `python_file_list`。`file` 共注册 8 个 definition、工具箱仅展示 4 个；不要与仍注册这些旧文件 type 的旧版 `lib-cybercam` 同时加载，也不要与仍注册相同 `python_file_*` type 的旧版 `lib-python-core` 同时加载。
- `core`、`vision`、`network`、`file`、`filesystem` 均声明兼容 CyberCAM。面向普通 V4L2 设备的 `linux_camera_*` 位于仅兼容普通 Linux 板卡的 `camera`；CyberCAM CSI 相机应使用 `cybercam_cv` 的 `cybercam_camera_*`。
- CyberCAM 的 GPIO、板载 LED/按键和 PWM 由 `cybercam_gpio` 维护；UART 由声明兼容 CyberCAM 的 `serial` 维护；ADC、音频、IMU 和芯片 ID 保留在 10 块的基础 `cybercam`。CyberCAM UART 的设备合约固定为 `/dev/ttyS2`，不能照搬其他 Linux 板卡的设备节点；通用 `gpio` 或 `audio` 实现也不能无损替代 CyberCAM 的板级合约。
- Raspberry Pi 专用的 I2C、SPI 与 Picamera2 功能分别位于 `rpi_i2c`、`rpi_spi`、`rpi_picamera2`；npm 安装不会安装 `smbus2`、`spidev`、`python3-picamera2`，也不会启用内核接口或修改设备权限。
- 所有当前包统一使用 `0.0.1`。原来依赖 `lib-python-core` + `lib-linux-python` 的完整 Linux 项目，应改为依赖上述 11 个通用功能包。只按实际功能选装时，可省略不使用的包。

上述所有功能包均不再使用资产生成脚本；已提交的 `block.json`、`toolbox.json` 和 `i18n/*.json` 是静态真源。
