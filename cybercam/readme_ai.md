# CyberCAM Python

01Studio CyberCAM K230-only Python blocks. Camera, display, KPU, GPIO, PWM, UART, audio, and IMU use CanMV/walnutpi APIs, not generic CPython. Portable language, OpenCV, network, and file blocks stay here so CyberCAM projects remain self-contained. Networking protocols require an already configured network.

## Library Info
- **Name**: @aily-project/lib-cybercam
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format |
|------------|------------|--------------------------|------------|
| `cybercam_start` | Hat | DO(input_statement) | `cybercam_start() @DO: child_block()` |
| `cybercam_forever` | Hat | DO(input_statement) | `cybercam_forever() @DO: child_block()` |
| `cybercam_sleep` | Statement | SECONDS(input_value) | `cybercam_sleep(math_number(0))` |
| `cybercam_print` | Statement | VALUE(input_value) | `cybercam_print(math_number(0))` |
| `cybercam_number` | Value | VALUE(field_number) | `cybercam_number(0)` |
| `cybercam_text` | Value | VALUE(field_input) | `cybercam_text("VALUE")` |
| `cybercam_boolean` | Value | VALUE(dropdown) | `cybercam_boolean(TRUE)` |
| `cybercam_tuple` | Value | ITEMS(input_value) | `cybercam_tuple(math_number(1000))` |
| `cybercam_list` | Value | ITEMS(input_value) | `cybercam_list(math_number(1000))` |
| `cybercam_set_variable` | Statement | NAME(field_input), VALUE(input_value) | `cybercam_set_variable("value", math_number(0))` |
| `cybercam_get_variable` | Value | NAME(field_input) | `cybercam_get_variable("value")` |
| `cybercam_if` | Statement | CONDITION(input_value), DO(input_statement) | `cybercam_if(logic_boolean(TRUE)) @DO: child_block()` |
| `cybercam_for_each` | Statement | NAME(field_input), ITEMS(input_value), DO(input_statement) | `cybercam_for_each("item", math_number(1000)) @DO: child_block()` |
| `cybercam_gpio_init` | Statement | NAME(field_input), PIN(dropdown), DIRECTION(dropdown), PULL(dropdown) | `cybercam_gpio_init("pin", PIN, INPUT, NONE)` |
| `cybercam_gpio_write` | Statement | NAME(field_input), VALUE(input_value) | `cybercam_gpio_write("pin", logic_boolean(TRUE))` |
| `cybercam_gpio_read` | Value | NAME(field_input) | `cybercam_gpio_read("pin")` |
| `cybercam_gpio_deinit` | Statement | NAME(field_input) | `cybercam_gpio_deinit("pin")` |
| `cybercam_led_write` | Statement | VALUE(input_value) | `cybercam_led_write(logic_boolean(TRUE))` |
| `cybercam_key_pressed` | Value | (none) | `cybercam_key_pressed()` |
| `cybercam_pwm_init` | Statement | NAME(field_input), TARGET(dropdown) | `cybercam_pwm_init("pwm", "0,0")` |
| `cybercam_pwm_frequency` | Statement | NAME(field_input), FREQUENCY(input_value) | `cybercam_pwm_frequency("pwm", math_number(0))` |
| `cybercam_pwm_duty` | Statement | NAME(field_input), DUTY(input_value) | `cybercam_pwm_duty("pwm", math_number(0))` |
| `cybercam_pwm_enable` | Statement | NAME(field_input) | `cybercam_pwm_enable("pwm")` |
| `cybercam_pwm_disable` | Statement | NAME(field_input) | `cybercam_pwm_disable("pwm")` |
| `cybercam_pwm_close` | Statement | NAME(field_input) | `cybercam_pwm_close("pwm")` |
| `cybercam_uart_init` | Statement | NAME(field_input), BAUD(dropdown) | `cybercam_uart_init("uart", "9600")` |
| `cybercam_uart_available` | Value | NAME(field_input) | `cybercam_uart_available("uart")` |
| `cybercam_uart_read` | Value | NAME(field_input), SIZE(input_value) | `cybercam_uart_read("uart", math_number(0))` |
| `cybercam_uart_write` | Statement | NAME(field_input), DATA(input_value) | `cybercam_uart_write("uart", math_number(0))` |
| `cybercam_uart_flush` | Statement | NAME(field_input) | `cybercam_uart_flush("uart")` |
| `cybercam_uart_close` | Statement | NAME(field_input) | `cybercam_uart_close("uart")` |
| `cybercam_camera_init` | Statement | NAME(field_input), WIDTH(input_value), HEIGHT(input_value), SENSOR_ID(dropdown) | `cybercam_camera_init("camera", math_number(0), math_number(0), "2")` |
| `cybercam_camera_opened` | Value | NAME(field_input) | `cybercam_camera_opened("camera")` |
| `cybercam_camera_read` | Value | NAME(field_input) | `cybercam_camera_read("camera")` |
| `cybercam_camera_hmirror` | Statement | NAME(field_input), ENABLED(input_value) | `cybercam_camera_hmirror("camera", logic_boolean(TRUE))` |
| `cybercam_camera_vflip` | Statement | NAME(field_input), ENABLED(input_value) | `cybercam_camera_vflip("camera", logic_boolean(TRUE))` |
| `cybercam_camera_release` | Statement | NAME(field_input) | `cybercam_camera_release("camera")` |
| `cybercam_display_init` | Statement | (none) | `cybercam_display_init()` |
| `cybercam_display_rotation` | Statement | ROTATION(dropdown) | `cybercam_display_rotation("0")` |
| `cybercam_display_show` | Statement | IMAGE(input_value) | `cybercam_display_show(math_number(0))` |
| `cybercam_ide_show` | Statement | IMAGE(input_value) | `cybercam_ide_show(math_number(0))` |
| `cybercam_lcd_direction` | Value | (none) | `cybercam_lcd_direction()` |
| `cybercam_image_resize` | Value | IMAGE(input_value), WIDTH(input_value), HEIGHT(input_value) | `cybercam_image_resize(math_number(0), math_number(0), math_number(0))` |
| `cybercam_image_convert` | Value | IMAGE(input_value), CONVERSION(dropdown) | `cybercam_image_convert(math_number(0), COLOR_BGR2GRAY)` |
| `cybercam_image_in_range` | Value | IMAGE(input_value), LOWER(input_value), UPPER(input_value) | `cybercam_image_in_range(math_number(0), math_number(0), math_number(0))` |
| `cybercam_image_components` | Value | IMAGE(input_value), CONNECTIVITY(dropdown) | `cybercam_image_components(math_number(0), "4")` |
| `cybercam_image_load` | Value | PATH(input_value) | `cybercam_image_load(text("value"))` |
| `cybercam_image_save` | Statement | IMAGE(input_value), PATH(input_value) | `cybercam_image_save(math_number(0), text("value"))` |
| `cybercam_draw_rectangle` | Statement | IMAGE(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value),... | `cybercam_draw_rectangle(math_number(0), math_number(0), math_number(0), math_number(0), ...)` |
| `cybercam_draw_circle` | Statement | IMAGE(input_value), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_va... | `cybercam_draw_circle(math_number(0), math_number(0), math_number(0), math_number(0), ...)` |
| `cybercam_draw_line` | Statement | IMAGE(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value),... | `cybercam_draw_line(math_number(0), math_number(0), math_number(0), math_number(0), ...)` |
| `cybercam_draw_text` | Statement | TEXT(input_value), IMAGE(input_value), X(input_value), Y(input_value), SCALE(input_valu... | `cybercam_draw_text(text("value"), math_number(0), math_number(0), math_number(0), ...)` |
| `cybercam_qr_decode` | Value | IMAGE(input_value) | `cybercam_qr_decode(math_number(0))` |
| `cybercam_barcode_decode` | Value | IMAGE(input_value) | `cybercam_barcode_decode(math_number(0))` |
| `cybercam_apriltag_init` | Statement | NAME(field_input), FAMILY(dropdown) | `cybercam_apriltag_init("tags", tag16h5)` |
| `cybercam_apriltag_detect` | Value | NAME(field_input), IMAGE(input_value) | `cybercam_apriltag_detect("tags", math_number(0))` |
| `cybercam_ai_init_simple` | Statement | NAME(field_input), MODEL(dropdown), MODEL_PATH(input_value), MODEL_SIZE(input_value) | `cybercam_ai_init_simple("detector", FALL_DETECT, text("value"), math_number(0))` |
| `cybercam_ai_init_face` | Statement | NAME(field_input), MODEL_PATH(input_value), ANCHORS_PATH(input_value), MODEL_SIZE(input... | `cybercam_ai_init_face("detector", text("value"), text("value"), math_number(0))` |
| `cybercam_ai_init_mask` | Statement | NAME(field_input), DETECT_MODEL(input_value), ANCHORS_PATH(input_value), MODEL_SIZE(inp... | `cybercam_ai_init_mask("detector", text("value"), text("value"), math_number(0), ...)` |
| `cybercam_ai_init_hand_keypoint` | Statement | NAME(field_input), MODEL(dropdown), DETECT_MODEL(input_value), KEYPOINT_MODEL(input_value) | `cybercam_ai_init_hand_keypoint("detector", HAND_KEYPOINT, text("value"), text("value"))` |
| `cybercam_ai_init_ocr` | Statement | NAME(field_input), DETECT_MODEL(input_value), RECOGNITION_MODEL(input_value), DICTIONAR... | `cybercam_ai_init_ocr("ocr", text("value"), text("value"), text("value"), ...)` |
| `cybercam_ai_init_licence` | Statement | NAME(field_input), DETECT_MODEL(input_value), RECOGNITION_MODEL(input_value), ANCHORS_P... | `cybercam_ai_init_licence("licence", text("value"), text("value"), text("value"), ...)` |
| `cybercam_ai_run` | Value | NAME(field_input), IMAGE(input_value) | `cybercam_ai_run("detector", math_number(0))` |
| `cybercam_ai_run_confidence` | Value | NAME(field_input), IMAGE(input_value), CONFIDENCE(input_value) | `cybercam_ai_run_confidence("detector", math_number(0), math_number(0))` |
| `cybercam_ai_run_thresholds` | Value | NAME(field_input), IMAGE(input_value), CONFIDENCE(input_value), NMS(input_value) | `cybercam_ai_run_thresholds("detector", math_number(0), math_number(0), math_number(1000))` |
| `cybercam_result_length` | Value | RESULTS(input_value) | `cybercam_result_length(math_number(0))` |
| `cybercam_result_item` | Value | RESULTS(input_value), INDEX(input_value) | `cybercam_result_item(math_number(0), math_number(0))` |
| `cybercam_result_property` | Value | RESULT(input_value), PROPERTY(dropdown) | `cybercam_result_property(math_number(0), reliability)` |
| `cybercam_socket_init` | Statement | NAME(field_input), FAMILY(dropdown), TYPE(dropdown) | `cybercam_socket_init("sock", AF_INET, SOCK_STREAM)` |
| `cybercam_socket_address` | Value | HOST(input_value), PORT(input_value) | `cybercam_socket_address(text("value"), math_number(0))` |
| `cybercam_socket_connect` | Statement | NAME(field_input), ADDRESS(input_value) | `cybercam_socket_connect("sock", math_number(0))` |
| `cybercam_socket_bind` | Statement | NAME(field_input), ADDRESS(input_value) | `cybercam_socket_bind("sock", math_number(0))` |
| `cybercam_socket_listen` | Statement | NAME(field_input), BACKLOG(input_value) | `cybercam_socket_listen("sock", math_number(0))` |
| `cybercam_socket_accept` | Value | NAME(field_input) | `cybercam_socket_accept("sock")` |
| `cybercam_socket_send` | Statement | NAME(field_input), DATA(input_value) | `cybercam_socket_send("sock", math_number(0))` |
| `cybercam_socket_receive` | Value | NAME(field_input), SIZE(input_value) | `cybercam_socket_receive("sock", math_number(0))` |
| `cybercam_socket_close` | Statement | NAME(field_input) | `cybercam_socket_close("sock")` |
| `cybercam_mqtt_init` | Statement | NAME(field_input) | `cybercam_mqtt_init("client")` |
| `cybercam_mqtt_connect` | Statement | NAME(field_input), HOST(input_value), PORT(input_value), KEEPALIVE(input_value) | `cybercam_mqtt_connect("client", text("value"), math_number(0), math_number(0))` |
| `cybercam_mqtt_publish` | Statement | NAME(field_input), TOPIC(input_value), MESSAGE(input_value) | `cybercam_mqtt_publish("client", text("value"), text("value"))` |
| `cybercam_mqtt_subscribe` | Statement | NAME(field_input), TOPIC(input_value) | `cybercam_mqtt_subscribe("client", text("value"))` |
| `cybercam_mqtt_on_message` | Statement | NAME(field_input), TOPIC_NAME(field_input), PAYLOAD_NAME(field_input), DO(input_statement) | `cybercam_mqtt_on_message("client", "topic", "payload") @DO: child_block()` |
| `cybercam_mqtt_loop` | Statement | NAME(field_input) | `cybercam_mqtt_loop("client")` |
| `cybercam_mqtt_disconnect` | Statement | NAME(field_input) | `cybercam_mqtt_disconnect("client")` |
| `cybercam_http_request` | Value | METHOD(dropdown), URL(input_value), DATA(input_value) | `cybercam_http_request(GET, text("value"), math_number(0))` |
| `cybercam_http_response` | Value | RESPONSE(input_value), PROPERTY(dropdown) | `cybercam_http_response(math_number(0), status_code)` |
| `cybercam_http_server` | Statement | HOST(input_value), PORT(input_value) | `cybercam_http_server(text("value"), math_number(0))` |
| `cybercam_file_read` | Value | PATH(input_value) | `cybercam_file_read(text("value"))` |
| `cybercam_file_write` | Statement | MODE(dropdown), PATH(input_value), CONTENT(input_value) | `cybercam_file_write(w, text("value"), math_number(0))` |
| `cybercam_file_exists` | Value | PATH(input_value) | `cybercam_file_exists(text("value"))` |
| `cybercam_file_list` | Value | PATH(input_value) | `cybercam_file_list(text("value"))` |
| `cybercam_command` | Value | COMMAND(input_value) | `cybercam_command(text("value"))` |
| `cybercam_audio_play` | Statement | PATH(input_value) | `cybercam_audio_play(text("value"))` |
| `cybercam_audio_record` | Statement | PATH(input_value), SECONDS(input_value), RATE(input_value) | `cybercam_audio_record(text("value"), math_number(0), math_number(0))` |
| `cybercam_imu_init` | Statement | NAME(field_input), BUS(input_value), ADDRESS(input_value) | `cybercam_imu_init("imu", math_number(0), math_number(0))` |
| `cybercam_imu_read` | Value | NAME(field_input) | `cybercam_imu_read("imu")` |
| `cybercam_imu_axis` | Value | NAME(field_input), AXIS(dropdown) | `cybercam_imu_axis("imu", "0")` |
| `cybercam_imu_calibrate` | Statement | NAME(field_input), SAMPLES(input_value) | `cybercam_imu_calibrate("imu", math_number(0))` |
| `cybercam_imu_close` | Statement | NAME(field_input) | `cybercam_imu_close("imu")` |
| `cybercam_cpu_temperature` | Value | (none) | `cybercam_cpu_temperature()` |
| `cybercam_chip_id` | Value | (none) | `cybercam_chip_id()` |

## Parameter Options

Dropdown values and defaults follow `block.json`.

## Notes

Parameters and dropdown values follow `block.json`; inputs accept value blocks. Touch, Wi-Fi management, Bluetooth, generic I2C, SPI, GPIO interrupts, and ADC are excluded pending verified executable CyberCAM Python API contracts.
