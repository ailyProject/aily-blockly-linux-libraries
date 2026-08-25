# aily-blockly-linux-libraries

面向 aily Blockly 独立 CPython 生成器的功能化积木库。

## Python 库清单

当前仓库共包含 **142** 个库目录：29 个核心、通用及板级功能库，以及 113 个采用统一 CPython API 白名单结构的生态库。点击目录名可查看对应库的积木定义、生成器和使用说明。

树莓派与 NVIDIA Jetson 的覆盖情况、选型依据及暂缓项目见[《树莓派与 Jetson Python 库缺口分析》](EDGE-PYTHON-LIBRARIES.md)。

### 板卡兼容性

所有 `package.json.compatibility.type` 均以兄弟仓库 `aily-blockly-linux-boards/LIST.md` 为来源，并由 [`scripts/sync-board-compatibility.js`](scripts/sync-board-compatibility.js) 同步。当前支持 8 个正式 type：

| 平台 | type |
| --- | --- |
| WalnutPi 2B | `allwinner:t527:walnutpi_2b` |
| Raspberry Pi Zero 2 W | `broadcom:bcm2710a1:raspberrypi_0_2w` |
| Raspberry Pi 4B | `broadcom:bcm2711:raspberrypi_4b` |
| Raspberry Pi 5B | `broadcom:bcm2712:raspberrypi_5` |
| CyberCAM | `canaan:k230:cybercam` |
| Jetson AGX Orin | `nvidia:tegra234:jetson_agx_orin` |
| Jetson Orin Nano | `nvidia:tegra234:jetson_orin_nano` |
| Jetson Orin NX | `nvidia:tegra234:jetson_orin_nx` |

兼容性按运行时和硬件后端声明，而不是仅按“能安装 Python”推断：通用 Linux CPython 生态包覆盖 7 款 SSH SBC；CyberCAM 使用专用板级包；树莓派 GPIO/Picamera2 等包覆盖三款树莓派；Hailo 仅标记 Pi 5；Jetson.GPIO、CUDA、TensorRT、VPI 等只标记三款 Orin。WalnutPi 官方 Python 路径使用 Blinka，因此 Blinka 及 CircuitPython 驱动覆盖三款树莓派和 WalnutPi，而通用 gpiozero 包不再宣称支持未验证的 WalnutPi/Jetson 后端。

平台专用性逐包审核见 [`PLATFORM-SPEC-AUDIT.md`](PLATFORM-SPEC-AUDIT.md)。只属于 Raspberry Pi、NVIDIA Jetson、CyberCAM 或 WalnutPi 单一平台家族的库必须声明 `"spec": true`；同步脚本会自动补齐并由测试持续校验。跨平台库如果仍需排除部分 board type，也保留 `spec`，因为当前库管理器仅在该字段为 `true` 时执行 `compatibility.type` 过滤。

新增或修改板卡 type 后运行：

```powershell
node scripts\sync-board-compatibility.js
node scripts\build-platform-spec-audit.js
node scripts\build-python-library-catalog.js
node --test test\*.test.js
```

### 核心、通用及板级功能库（29）

| 类别 | 目录 | 库 | 功能 |
| --- | --- | --- | --- |
| 基础 | [`core`](core/) | Core | Python 程序结构和基础数据。 |
| 基础 | [`core_logic`](core_logic/) | Logic | 条件、比较、布尔运算和条件表达式。 |
| 基础 | [`core_loop`](core_loop/) | Loops | 重复、计数、迭代及循环控制。 |
| 基础 | [`core_math`](core_math/) | Math | 算术、常用数学函数、统计和随机数。 |
| 基础 | [`core_text`](core_text/) | Text | 文本拼接、查找、切片、转换和替换。 |
| 基础 | [`core_variables`](core_variables/) | Variables | 工作区变量的读取、赋值和修改。 |
| 标准库 | [`datetime`](datetime/) | Date & Time | 日期、时间戳、计时、格式化和解析。 |
| 标准库 | [`file`](file/) | File | 跨平台文件读写和目录操作。 |
| 标准库 | [`json`](json/) | JSON | JSON 序列化、解析、校验和文件读写。 |
| 标准库 | [`sqlite3`](sqlite3/) | SQLite | SQLite 查询、事务和连接管理。 |
| 标准库 | [`threading`](threading/) | Threading | 线程、定时器、锁、事件和线程安全队列。 |
| 通用 | [`audio`](audio/) | Audio | 通过 ALSA 播放和录制 WAV 音频。 |
| 通用 | [`camera`](camera/) | Camera | 通过 OpenCV 访问 Linux V4L2 摄像头。 |
| 通用 | [`filesystem`](filesystem/) | System | 系统命令和 Linux CPU 温度。 |
| 通用 | [`gpio`](gpio/) | GPIO & PWM | 基于 gpiozero 的 GPIO、LED、按键和 PWM。 |
| 通用 | [`gpiozero_devices`](gpiozero_devices/) | GPIO Zero Devices | 电机、舵机、超声波、编码器和蜂鸣器。 |
| 通用 | [`network`](network/) | Network | TCP/UDP Socket 和 HTTP 文件服务器。 |
| 通用 | [`paho_mqtt`](paho_mqtt/) | Paho MQTT | MQTT 2.x 发布、订阅、认证和 TLS。 |
| 通用 | [`requests`](requests/) | Requests | Requests HTTP 客户端。 |
| 通用 | [`serial`](serial/) | Serial | Linux 串口及旧版 CyberCAM UART 兼容积木。 |
| 通用 | [`stepper`](stepper/) | Four-wire Stepper | 四线步进电机的步数、转速、角度和位置控制。 |
| 通用 | [`vision`](vision/) | Vision | OpenCV 图像处理、轮廓分析和码识别。 |
| 树莓派 | [`rpi_i2c`](rpi_i2c/) | I2C / SMBus | 基于 smbus2 的 I²C/SMBus 通信。 |
| 树莓派 | [`rpi_spi`](rpi_spi/) | SPI | 基于 py-spidev 的 SPI 通信。 |
| 树莓派 | [`rpi_picamera2`](rpi_picamera2/) | Picamera2 | 树莓派 CSI 相机配置、控制和采集。 |
| CyberCAM | [`cybercam`](cybercam/) | Onboard Peripherals | 板载 ADC、音频、IMU 和芯片 ID。 |
| CyberCAM | [`cybercam_cv`](cybercam_cv/) | Camera & AI | 相机、显示、IDE 预览和 KPU 推理。 |
| CyberCAM | [`cybercam_gpio`](cybercam_gpio/) | GPIO / LED / PWM | GPIO、板载 LED/按键和 PWM。 |
| 传感器 | [`adafruit_ds3231`](adafruit_ds3231/) | DS3231 RTC | 通过 Adafruit Blinka 读写 DS3231 实时时钟。 |

### CPython 白名单生态库（113）

本节按 [`catalog/python-libraries.json`](catalog/python-libraries.json) 中的分类列出。这些库面向 Linux/Raspberry Pi 的 CPython 运行时；其中 Adafruit CircuitPython 驱动通过 Blinka 运行，并非 MicroPython 固件库。

#### 树莓派扩展（6）

| 目录 | 库 |
| --- | --- |
| [`rpi_buildhat`](rpi_buildhat/) | Build HAT |
| [`rpi_imx500`](rpi_imx500/) | Raspberry Pi IMX500 |
| [`rpi_lgpio`](rpi_lgpio/) | rpi-lgpio |
| [`rpi_sense_emu`](rpi_sense_emu/) | Sense HAT Emulator |
| [`rpi_sense_hat`](rpi_sense_hat/) | Sense HAT |
| [`rtimulib`](rtimulib/) | RTIMULib |

#### NVIDIA Jetson（9）

| 目录 | 库 |
| --- | --- |
| [`cuda_python`](cuda_python/) | NVIDIA CUDA Python |
| [`cupy`](cupy/) | CuPy |
| [`jetson_gpio`](jetson_gpio/) | Jetson.GPIO |
| [`jetson_inference`](jetson_inference/) | jetson-inference |
| [`jetson_stats`](jetson_stats/) | jetson-stats / jtop |
| [`jetson_utils`](jetson_utils/) | jetson-utils |
| [`nvidia_vpi`](nvidia_vpi/) | NVIDIA VPI |
| [`pycuda`](pycuda/) | PyCUDA |
| [`tensorrt`](tensorrt/) | NVIDIA TensorRT |

#### 硬件与 I/O（8）

| 目录 | 库 |
| --- | --- |
| [`adafruit_blinka`](adafruit_blinka/) | Adafruit Blinka |
| [`evdev`](evdev/) | python-evdev |
| [`gpiod`](gpiod/) | libgpiod v2 |
| [`hidapi`](hidapi/) | hidapi |
| [`lgpio`](lgpio/) | lgpio |
| [`pyftdi`](pyftdi/) | PyFtdi GPIO |
| [`python_periphery`](python_periphery/) | python-periphery |
| [`pyusb`](pyusb/) | PyUSB |

#### 工业通信（4）

| 目录 | 库 |
| --- | --- |
| [`cantools`](cantools/) | cantools |
| [`minimalmodbus`](minimalmodbus/) | MinimalModbus |
| [`pymodbus`](pymodbus/) | PyModbus |
| [`python_can`](python_can/) | python-can |

#### 系统工具（6）

| 目录 | 库 |
| --- | --- |
| [`dbus_next`](dbus_next/) | dbus-next |
| [`psutil`](psutil/) | psutil |
| [`pyudev`](pyudev/) | pyudev |
| [`pyyaml`](pyyaml/) | PyYAML |
| [`schedule`](schedule/) | schedule |
| [`watchdog`](watchdog/) | watchdog Observer |

#### 网络与服务（12）

| 目录 | 库 |
| --- | --- |
| [`aiohttp`](aiohttp/) | aiohttp |
| [`bleak`](bleak/) | Bleak Bluetooth LE |
| [`fastapi`](fastapi/) | FastAPI |
| [`flask`](flask/) | Flask |
| [`httpx`](httpx/) | HTTPX |
| [`paramiko`](paramiko/) | Paramiko |
| [`python_socketio`](python_socketio/) | python-socketio |
| [`redis`](redis/) | redis-py |
| [`scapy`](scapy/) | Scapy |
| [`uvicorn`](uvicorn/) | Uvicorn |
| [`websockets`](websockets/) | websockets |
| [`zeroconf`](zeroconf/) | python-zeroconf |

#### 传感器（23）

| 目录 | 库 |
| --- | --- |
| [`adafruit_ads1x15`](adafruit_ads1x15/) | CircuitPython ADS1x15 |
| [`adafruit_ahtx0`](adafruit_ahtx0/) | CircuitPython AHTx0 |
| [`adafruit_apds9960`](adafruit_apds9960/) | CircuitPython APDS9960 |
| [`adafruit_bme280`](adafruit_bme280/) | CircuitPython BME280 |
| [`adafruit_bme680`](adafruit_bme680/) | CircuitPython BME680 |
| [`adafruit_bmp280`](adafruit_bmp280/) | CircuitPython BMP280 |
| [`adafruit_bno055`](adafruit_bno055/) | CircuitPython BNO055 |
| [`adafruit_ccs811`](adafruit_ccs811/) | CircuitPython CCS811 |
| [`adafruit_dht`](adafruit_dht/) | CircuitPython DHT |
| [`adafruit_ina219`](adafruit_ina219/) | CircuitPython INA219 |
| [`adafruit_lis3dh`](adafruit_lis3dh/) | CircuitPython LIS3DH |
| [`adafruit_mcp3xxx`](adafruit_mcp3xxx/) | CircuitPython MCP3xxx |
| [`adafruit_mlx90614`](adafruit_mlx90614/) | CircuitPython MLX90614 |
| [`adafruit_mpu6050`](adafruit_mpu6050/) | CircuitPython MPU6050 |
| [`adafruit_pn532`](adafruit_pn532/) | CircuitPython PN532 |
| [`adafruit_scd4x`](adafruit_scd4x/) | CircuitPython SCD4x |
| [`adafruit_sgp30`](adafruit_sgp30/) | CircuitPython SGP30 |
| [`adafruit_tsl2591`](adafruit_tsl2591/) | CircuitPython TSL2591 |
| [`adafruit_vl53l0x`](adafruit_vl53l0x/) | CircuitPython VL53L0X |
| [`adafruit_vl53l1x`](adafruit_vl53l1x/) | CircuitPython VL53L1X |
| [`gpsd_py3`](gpsd_py3/) | gpsd-py3 |
| [`pynmea2`](pynmea2/) | pynmea2 |
| [`w1thermsensor`](w1thermsensor/) | W1ThermSensor |

#### 执行器（6）

| 目录 | 库 |
| --- | --- |
| [`adafruit_motor`](adafruit_motor/) | CircuitPython Motor |
| [`adafruit_motorkit`](adafruit_motorkit/) | CircuitPython MotorKit |
| [`adafruit_pca9685`](adafruit_pca9685/) | CircuitPython PCA9685 |
| [`adafruit_servokit`](adafruit_servokit/) | CircuitPython ServoKit |
| [`neopixel`](neopixel/) | CircuitPython NeoPixel |
| [`rpi_hardware_pwm`](rpi_hardware_pwm/) | Raspberry Pi Hardware PWM |

#### 显示与图像输出（8）

| 目录 | 库 |
| --- | --- |
| [`adafruit_rgb_display`](adafruit_rgb_display/) | CircuitPython RGB Display |
| [`luma_lcd`](luma_lcd/) | luma.lcd |
| [`luma_led_matrix`](luma_led_matrix/) | luma.led_matrix |
| [`luma_oled`](luma_oled/) | luma.oled |
| [`pillow`](pillow/) | Pillow Image |
| [`pyav`](pyav/) | PyAV |
| [`qrcode`](qrcode/) | qrcode |
| [`rplcd`](rplcd/) | RPLCD |

#### 视觉与 AI（9）

| 目录 | 库 |
| --- | --- |
| [`depthai`](depthai/) | DepthAI v3 |
| [`hailo_platform`](hailo_platform/) | HailoRT Python |
| [`onnxruntime`](onnxruntime/) | ONNX Runtime |
| [`pytorch`](pytorch/) | PyTorch |
| [`pytesseract`](pytesseract/) | pytesseract |
| [`scikit_image`](scikit_image/) | scikit-image I/O |
| [`tflite_runtime`](tflite_runtime/) | LiteRT / TFLite Runtime |
| [`torchvision`](torchvision/) | TorchVision |
| [`ultralytics`](ultralytics/) | Ultralytics |

#### 多媒体（1）

| 目录 | 库 |
| --- | --- |
| [`gstreamer`](gstreamer/) | GStreamer |

#### 数据科学（5）

| 目录 | 库 |
| --- | --- |
| [`matplotlib`](matplotlib/) | Matplotlib pyplot |
| [`munkres`](munkres/) | Munkres |
| [`numpy`](numpy/) | NumPy |
| [`pandas`](pandas/) | pandas |
| [`scipy`](scipy/) | SciPy Signal |

#### 音频（9）

| 目录 | 库 |
| --- | --- |
| [`librosa`](librosa/) | librosa |
| [`pyaudio`](pyaudio/) | PyAudio |
| [`pydub`](pydub/) | pydub |
| [`pygame`](pygame/) | pygame |
| [`pyttsx3`](pyttsx3/) | pyttsx3 |
| [`sounddevice`](sounddevice/) | python-sounddevice |
| [`soundfile`](soundfile/) | SoundFile |
| [`speech_recognition`](speech_recognition/) | SpeechRecognition |
| [`vosk`](vosk/) | Vosk |

#### 物联网与云服务（5）

| 目录 | 库 |
| --- | --- |
| [`adafruit_io`](adafruit_io/) | Adafruit IO |
| [`aiocoap`](aiocoap/) | aiocoap |
| [`aws_iot_device_sdk`](aws_iot_device_sdk/) | AWS IoT Device SDK v2 |
| [`azure_iot_device`](azure_iot_device/) | Azure IoT Device |
| [`influxdb_client`](influxdb_client/) | InfluxDB Client |

#### 机器人（2）

| 目录 | 库 |
| --- | --- |
| [`pymavlink`](pymavlink/) | pymavlink |
| [`rclpy`](rclpy/) | ROS 2 rclpy |
