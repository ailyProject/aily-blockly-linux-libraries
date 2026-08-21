# Paho MQTT

面向 CyberCAM、Raspberry Pi 5、WalnutPi 与通用 CPython Linux 的 Paho MQTT Blockly 库。它保留原 `network` 聚合库中的 7 个 `python_mqtt_*` 类型，并扩展为 21 个积木，覆盖 Paho MQTT 2.x 的安全连接、事件回调、发布订阅与网络循环。

- npm 包：`@aily-project/lib-paho-mqtt`
- Python 依赖：`paho-mqtt>=2.1,<3`
- Blockly 积木：21 个
- 协议：MQTT 3.1.1、MQTT 5
- 传输：TCP、WebSocket；两种传输均可叠加 TLS
- 回调合约：`CallbackAPIVersion.VERSION2`

安装目标机依赖：

```bash
python3 -m pip install "paho-mqtt>=2.1,<3"
```

## 功能

| 分组 | 积木 | Paho 接口 |
| --- | --- | --- |
| 客户端 | `python_mqtt_init` | `Client(CallbackAPIVersion.VERSION2, ...)` |
| 连接配置 | `python_mqtt_set_auth`、`python_mqtt_set_tls`、`python_mqtt_set_will`、`python_mqtt_set_websocket_options`、`python_mqtt_set_reconnect_delay` | 认证、验证式 TLS、遗嘱、WebSocket 路径、自动重连退避 |
| 连接与事件 | `python_mqtt_connect`、`python_mqtt_on_connect`、`python_mqtt_on_disconnect` | `connect()` 与 Paho 2.x 回调 |
| 发布订阅 | `python_mqtt_publish`、`python_mqtt_publish_wait`、`python_mqtt_subscribe`、`python_mqtt_unsubscribe` | QoS 0/1/2、retain、发布完成等待、主题过滤器 |
| 消息 | `python_mqtt_on_message`、`python_mqtt_decode_payload` | topic、原始 bytes payload、QoS、retain 与显式文本解码 |
| 网络循环 | `python_mqtt_loop_start`、`python_mqtt_loop_stop`、`python_mqtt_loop_once`、`python_mqtt_loop` | 后台、单次与永久循环模式 |
| 状态与退出 | `python_mqtt_is_connected`、`python_mqtt_disconnect` | 连接状态、正常断开 |

## 推荐流程

订阅客户端：

1. 创建客户端。需要稳定标识时填写 broker 内唯一的 client ID；留空则由 broker 分配临时 ID。
2. 需要时配置账号、TLS、遗嘱、WebSocket 路径和重连延时；这些积木必须放在连接之前。
3. 配置“连接结果”事件，并把“订阅主题”放在事件内部。这样断线重连后会重新订阅。
4. 配置“收到消息”事件；payload 是 `bytes`，需要文本时连接“解码 MQTT 载荷”。
5. 连接 broker。
6. 纯订阅服务使用“永久运行消息循环”；还要执行其他主程序逻辑时使用“启动后台循环”。

发布客户端：

1. 创建并连接客户端，然后启动一种网络循环。
2. 发布消息时选择 QoS 与 retain。
3. 程序马上退出或必须确认发布完成时，使用“发布并等待”；不要在 MQTT 回调内部等待，否则可能阻塞网络线程。
4. 正常退出时先断开，再停止后台循环。

## 01Studio CyberCAM 示例参数

01Studio 教程使用公开 broker `mq.tongxinmao.com:18830`，演示向主题发布以及在 `on_connect` 中订阅、在 `on_message` 中接收。可把它转换成上述 Blockly 流程，但公开 broker 只适合实验；client ID 与主题都应改成自己的唯一值。

教程仍展示旧式 `mqtt.Client()` 和四参数 `on_connect(client, userdata, flags, rc)`。本库不会照抄这部分，因为 Paho 2.x 已提供版本化回调；生成代码显式使用 `CallbackAPIVersion.VERSION2`，连接事件签名为：

```python
def on_connect(client, userdata, flags, reason_code, properties):
    ...
```

## 重要语义

- `connect()` 的返回只说明连接请求已发起；broker 的 CONNACK 接受或拒绝必须在网络循环处理后由“连接结果”事件判断。
- 必须运行且只能选择一种网络循环模式。不要混用后台循环、永久循环和手动单次循环。
- 后台循环与永久循环会驱动自动重连并采用配置的重连退避；手动单次循环不会自动重连，应用需自行检测断线并重新连接。
- `loop_forever()` 是阻塞调用，后续积木通常只会在断线或出错后执行。
- `publish()` 成功排队不等于 broker 已收到。可靠退出前使用“发布并等待”。
- `message.payload` 是 bytes，不会自动当成文本。
- `+` 与 `#` 是订阅过滤器通配符，不能出现在发布主题中。
- TLS 默认验证证书和主机名；留空 CA 文件时使用系统信任库。本库不提供关闭证书验证的积木。
- 回调由网络循环线程执行；事件体应避免耗时阻塞。
- 断开事件的“服务端 DISCONNECT 包”只表示收到了 broker 的 MQTT DISCONNECT 报文；broker 直接关闭 TCP 或网络中断时该值仍可能为否。
- MQTT 5 的 clean-start 与 properties 属于进阶能力，本版使用 Paho 默认 clean-start，不伪装成 MQTT 3 的 clean-session 参数。

## 迁移

7 个既有类型 `python_mqtt_init`、`python_mqtt_connect`、`python_mqtt_publish`、`python_mqtt_subscribe`、`python_mqtt_on_message`、`python_mqtt_loop`、`python_mqtt_disconnect` 保持原名，旧工作区无需重命名。它们已从 `@aily-project/lib-network` 迁到本包；不要同时加载仍包含这些类型的旧版 network 包和本包。

## 参考资料

- [01Studio CyberCAM MQTT 通讯](https://wiki.01studio.cc/docs/cybercam/network/mqtt)
- [Eclipse Paho MQTT Python](https://eclipse.dev/paho/files/paho.mqtt.python/html/index.html)
- [Paho Client API](https://eclipse.dev/paho/files/paho.mqtt.python/html/client.html)
- [Paho 2.x 迁移说明](https://eclipse.dev/paho/files/paho.mqtt.python/html/migrations.html)

本库只向 `globalThis.Python.forBlock` 注册生成器；没有 CPython generator runtime 时会安全跳过，不会回退到 MPY/MicroPython 生成器。
