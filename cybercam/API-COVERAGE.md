# CyberCAM API Coverage

This inventory maps the public Blockly API to the official 01Studio CyberCAM Wiki lessons and the confirmed `walnutpi.kpu` classes used by CyberCAM-Apps. It deliberately excludes installation, shell-only administration, UI workflows, and APIs for which the supplied references contain no executable Python contract.

Reference snapshots used for verification:

- `%TEMP%/codex-cybercam-reference/01studio_wiki/docs/cybercam`
- `%TEMP%/codex-cybercam-reference/CyberCAM-Apps`

## Official Wiki lesson areas

| Lesson area | Evidence | Blockly coverage or exclusion |
|---|---|---|
| Basic examples | `basic_examples/gpio_python.md`, `led.md`, `key.md`, `pwm_light.md`, `uart.md`, `file.md`, `command.md` | `cybercam_gpio_*`, `cybercam_led_write`, `cybercam_key_pressed`, `cybercam_pwm_*`, `cybercam_uart_*`, `cybercam_file_*`, `cybercam_command` |
| Machine vision | `machine_vision/camera.md`, `lcd.md`, `draw.md`, color-recognition lessons, code-recognition lessons, and `ai_vision/*.md` | Camera, display, OpenCV conversion/masking/components/drawing, QR, barcode, AprilTag, and all confirmed KPU blocks |
| Network | `network/socket.md`, `mqtt.md`, `http.md` | Socket client/server lifecycle, Paho MQTT lifecycle including message callback consumption, Requests client accessors, and `HTTPServer` with `SimpleHTTPRequestHandler`; these protocols operate over an already configured network |
| OS and software | `os_software/audio.md`, `chip_id.md`, `cpu_temp.md`; image/file behavior is also evidenced by CyberCAM-Apps | WAV playback/recording, image load/save, chip ID, and CPU temperature blocks |
| Sensor modules | `sensor_module/relay.md`; GPIO pin behavior is defined by the Basic examples | Relay operation maps to the generic documented `cybercam_gpio_init`, `cybercam_gpio_write`, and `cybercam_gpio_read` blocks |

The library also supplies self-contained Python language primitives (`number`, `text`, `boolean`, tuple, list, variables, `if`, and `for each`) so programs do not depend on Arduino-only core blocks. These are Python syntax helpers rather than CyberCAM hardware APIs.

## Confirmed `walnutpi.kpu` classes

Exactly the following 14 classes are instantiated in the supplied CyberCAM-Apps examples.

| Confirmed class | Evidence in CyberCAM-Apps | Block type |
|---|---|---|
| `kpu.FACE_DETECT` | `app/ai-vision/face-det/main.py` | `cybercam_ai_init_face` |
| `kpu.FACE_MASK` | `app/ai-vision/mask-det/main.py` | `cybercam_ai_init_mask` |
| `kpu.FALL_DETECT` | `app/ai-vision/fall-det/main.py` | `cybercam_ai_init_simple` (`FALL_DETECT`) |
| `kpu.HAND_DETECT` | `app/ai-vision/hand-det/main.py` | `cybercam_ai_init_simple` (`HAND_DETECT`) |
| `kpu.HAND_KEYPOINT` | `app/ai-vision/hand-keypoint/main.py` | `cybercam_ai_init_hand_keypoint` |
| `kpu.HAND_KEYPOINT_CLS` | `app/ai-vision/hand-keypoint-cls/main.py` | `cybercam_ai_init_hand_keypoint` |
| `kpu.LICENCE_DETECT` | `app/ai-vision/license-recg/main.py` | `cybercam_ai_init_licence` |
| `kpu.OCR` | `app/ai-vision/ocr/main.py` | `cybercam_ai_init_ocr` |
| `kpu.PERSON_DETECT` | `app/ai-vision/person-det/main.py` | `cybercam_ai_init_simple` (`PERSON_DETECT`) |
| `kpu.PERSON_KEYPOINT` | `app/ai-vision/person-keypoint/main.py` | `cybercam_ai_init_simple` (`PERSON_KEYPOINT`) |
| `kpu.SMOKE_DETECT` | `app/ai-vision/smoke-det/main.py` | `cybercam_ai_init_simple` (`SMOKE_DETECT`) |
| `kpu.TRAFFIC_LIGHT_DETECT` | `app/ai-vision/traffic-light-recg/main.py` | `cybercam_ai_init_simple` (`TRAFFIC_LIGHT_DETECT`) |
| `kpu.YOLO11_CLS` | `app/ai-vision/yolo11-cls/main.py` | `cybercam_ai_init_simple` (`YOLO11_CLS`) |
| `kpu.YOLO11_DET` | `app/ai-vision/yolo11-det/main.py` | `cybercam_ai_init_simple` (`YOLO11_DET`) |

`cybercam_ai_run`, `cybercam_ai_run_confidence`, and `cybercam_ai_run_thresholds` represent the documented zero-, one-, and two-threshold `run(...)` forms. Result-list and result-property blocks expose only fields observed in the examples: `reliability`, `x`, `y`, `w`, `h`, `label`, `text`, `keypoints`, and `corners`. FACE_DETECT and FACE_MASK results additionally expose the observed landmark objects `left_eye`, `right_eye`, `nose`, `left_mouth`, and `right_mouth`, including each landmark's nested `.x` and `.y` coordinates.

## Evidence-based exclusions

| Excluded lesson or capability | Reason |
|---|---|
| Product introduction, bracket/module assembly, downloads, updates, IDE setup, Python tutorial, and model training | Documentation or UI workflow only; no stable CyberCAM runtime API to generate. |
| OS initialization, auto-run, terminal, mapped devices, system apps, and custom-app packaging | Administrative shell/UI workflows. `cybercam_command` covers documented one-shot commands without inventing privileged management APIs. |
| Generic edge, circle, rectangle, and polygon detectors | The lessons use raw OpenCV calls with substantial algorithm-specific parameters. No stable, shared public signature is evidenced; foundational OpenCV image and drawing blocks remain available. |
| Chinese FreeType rendering helper | The Wiki implements an application-local helper around `cv2.freetype`; it is not a CyberCAM API. The documented `cv2.putText` path is represented. |
| Bluetooth showcase and AI-agent internals in CyberCAM-Apps | Application-specific code outside the official Wiki lesson API surface; no reusable Blockly contract is inferred. |
| Touch, Wi-Fi management, Bluetooth, generic I2C, SPI, GPIO interrupts, and ADC | Local evidence confirms hardware presence, but not a stable, verified executable CyberCAM Python API contract. Networking protocol blocks assume an already configured network and do not invent Wi-Fi management APIs. |
| Additional `walnutpi.kpu` names | Excluded unless instantiated by the supplied official app examples. The confirmed class table above is exhaustive for this reference snapshot. |

This evidence policy keeps generators tied to documented Python calls and avoids speculative wrappers.
