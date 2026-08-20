# Python Core

Portable CPython blocks for language primitives, OpenCV, QR/barcode/AprilTag, socket/MQTT/HTTP, files, and system commands. No GPIO, camera driver, display, KPU, audio, or IMU.

## Library Info
- **Name**: @aily-project/lib-python-core
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format |
|------------|------------|--------------------------|------------|
| `python_start` | Hat | DO(input_statement) | `python_start() @DO: child_block()` |
| `python_forever` | Hat | DO(input_statement) | `python_forever() @DO: child_block()` |
| `python_sleep` | Statement | SECONDS(input_value) | `python_sleep(math_number(1))` |
| `python_print` | Statement | VALUE(input_value) | `python_print(math_number(0))` |
| `python_number` | Value | VALUE(field_number) | `python_number(0)` |
| `python_text` | Value | VALUE(field_input) | `python_text("VALUE")` |
| `python_boolean` | Value | VALUE(dropdown) | `python_boolean(TRUE)` |
| `python_tuple` | Value | ITEMS(input_value) | `python_tuple(math_number(0))` |
| `python_list` | Value | ITEMS(input_value) | `python_list(math_number(0))` |
| `python_set_variable` | Statement | NAME(field_input), VALUE(input_value) | `python_set_variable("value", math_number(0))` |
| `python_get_variable` | Value | NAME(field_input) | `python_get_variable("value")` |
| `python_if` | Statement | CONDITION(input_value), DO(input_statement) | `python_if(logic_boolean(TRUE)) @DO: child_block()` |
| `python_for_each` | Statement | NAME(field_input), ITEMS(input_value), DO(input_statement) | `python_for_each("item", math_number(0)) @DO: child_block()` |
| `python_image_resize` | Value | IMAGE, WIDTH, HEIGHT | `python_image_resize(image, 640, 480)` |
| `python_image_convert` | Value | IMAGE, CONVERSION(dropdown) | `python_image_convert(image, COLOR_BGR2GRAY)` |
| `python_image_in_range` | Value | IMAGE, LOWER, UPPER | `python_image_in_range(image, lower, upper)` |
| `python_image_components` | Value | IMAGE, CONNECTIVITY(dropdown) | `python_image_components(image, 8)` |
| `python_image_load` | Value | PATH | `python_image_load(text("/tmp/image.jpg"))` |
| `python_image_save` | Statement | IMAGE, PATH | `python_image_save(image, text("/tmp/image.jpg"))` |
| `python_draw_rectangle` | Statement | IMAGE, X1, Y1, X2, Y2, COLOR, THICKNESS | `python_draw_rectangle(...)` |
| `python_draw_circle` | Statement | IMAGE, X, Y, RADIUS, COLOR, THICKNESS | `python_draw_circle(...)` |
| `python_draw_line` | Statement | IMAGE, X1, Y1, X2, Y2, COLOR, THICKNESS | `python_draw_line(...)` |
| `python_draw_text` | Statement | TEXT, IMAGE, X, Y, SCALE, COLOR, THICKNESS | `python_draw_text(...)` |
| `python_qr_decode` | Value | IMAGE | `python_qr_decode(image)` |
| `python_barcode_decode` | Value | IMAGE | `python_barcode_decode(image)` |
| `python_apriltag_init` | Statement | NAME, FAMILY(dropdown) | `python_apriltag_init("tags", tag36h11)` |
| `python_apriltag_detect` | Value | NAME, IMAGE | `python_apriltag_detect("tags", image)` |
| `python_socket_init` | Statement | NAME, FAMILY, TYPE | `python_socket_init("sock", AF_INET, SOCK_STREAM)` |
| `python_socket_address` | Value | HOST, PORT | `python_socket_address(text("localhost"), 80)` |
| `python_socket_connect` | Statement | NAME, ADDRESS | `python_socket_connect("sock", address)` |
| `python_socket_bind` | Statement | NAME, ADDRESS | `python_socket_bind("sock", address)` |
| `python_socket_listen` | Statement | NAME, BACKLOG | `python_socket_listen("sock", 1)` |
| `python_socket_accept` | Value | NAME | `python_socket_accept("sock")` |
| `python_socket_send` | Statement | NAME, DATA | `python_socket_send("sock", data)` |
| `python_socket_receive` | Value | NAME, SIZE | `python_socket_receive("sock", 1024)` |
| `python_socket_close` | Statement | NAME | `python_socket_close("sock")` |
| `python_mqtt_init` | Statement | NAME | `python_mqtt_init("client")` |
| `python_mqtt_connect` | Statement | NAME, HOST, PORT, KEEPALIVE | `python_mqtt_connect("client", host, 1883, 60)` |
| `python_mqtt_publish` | Statement | NAME, TOPIC, MESSAGE | `python_mqtt_publish("client", topic, message)` |
| `python_mqtt_subscribe` | Statement | NAME, TOPIC | `python_mqtt_subscribe("client", topic)` |
| `python_mqtt_on_message` | Statement | NAME, TOPIC_NAME, PAYLOAD_NAME, DO | `python_mqtt_on_message("client") @DO: child_block()` |
| `python_mqtt_loop` | Statement | NAME | `python_mqtt_loop("client")` |
| `python_mqtt_disconnect` | Statement | NAME | `python_mqtt_disconnect("client")` |
| `python_http_request` | Value | METHOD, URL, DATA | `python_http_request(GET, url, data)` |
| `python_http_response` | Value | RESPONSE, PROPERTY | `python_http_response(response, text)` |
| `python_http_server` | Statement | HOST, PORT | `python_http_server(host, 8080)` |
| `python_file_read` | Value | PATH | `python_file_read(text("/tmp/file.txt"))` |
| `python_file_write` | Statement | MODE, PATH, CONTENT | `python_file_write(w, path, content)` |
| `python_file_exists` | Value | PATH | `python_file_exists(path)` |
| `python_file_list` | Value | PATH | `python_file_list(path)` |
| `python_command` | Value | COMMAND | `python_command(text("uname -a"))` |
| `python_cpu_temperature` | Value | (none) | `python_cpu_temperature()` |

## Notes

Use `@aily-project/lib-linux-python` for gpiozero/OpenCV VideoCapture/pyserial. Use `@aily-project/lib-cybercam` for CanMV/K230 hardware.
