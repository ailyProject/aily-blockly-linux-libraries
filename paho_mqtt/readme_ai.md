# Paho MQTT Blockly contract

Package: `@aily-project/lib-paho-mqtt`; target runtime: CPython with `paho-mqtt>=2.1,<3`.

## Generation rules

- All clients use `paho.mqtt.client.Client(callback_api_version=CallbackAPIVersion.VERSION2, ...)`.
- The import alias is private: `_python_paho_mqtt`.
- MQTT 3.1.1 and MQTT 5 are selectable; TCP and WebSocket transports are selectable.
- Authentication, TLS, will, WebSocket options, callback assignment, and reconnect delay belong before `connect()`.
- `connect()` does not prove broker acceptance. A network loop must process CONNACK and invoke `on_connect`.
- Put `subscribe()` inside `on_connect` to restore subscriptions after reconnecting.
- Incoming payload is bytes. Decode only through an explicit payload-decode block.
- Exactly one of `loop_start`, `loop_forever`, or repeated `loop` should drive a client.
- `loop_start` and `loop_forever` drive automatic reconnect and its backoff; manual `loop` requires application-managed disconnect detection and reconnection.
- `publish_wait` checks `MQTTMessageInfo.is_published()` after waiting and raises `TimeoutError` if its deadline expires; it must not run inside a callback handled by that same network loop.
- Cleanup disconnects a connected client and stops a background loop.

## Stable migrated types

`python_mqtt_init`, `python_mqtt_connect`, `python_mqtt_publish`, `python_mqtt_subscribe`, `python_mqtt_on_message`, `python_mqtt_loop`, and `python_mqtt_disconnect` retain their serialized type names from the old network aggregate. Do not load this package with a network package version that still registers those types.

## Event locals

- on-connect: boolean success, Paho `ReasonCode`, boolean session-present.
- on-message: topic string, payload bytes, QoS integer, retained boolean.
- on-disconnect: Paho `ReasonCode`, boolean indicating whether the broker sent a DISCONNECT packet.

Event result names are made unique after Python identifier sanitization, including collisions with the client name. Paho stores one handler for each callback property; if a program assigns multiple blocks of the same callback type to one client, the last generated assignment is the active handler.
