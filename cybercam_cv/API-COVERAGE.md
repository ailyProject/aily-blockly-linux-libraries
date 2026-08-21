# Camera & AI API Coverage

This inventory defines the evidence and non-duplication boundary of `@aily-project/lib-cybercam-cv` 0.0.1. The package owns exactly 24 CyberCAM-specific blocks: 23 types moved unchanged from `@aily-project/lib-cybercam`, plus the new `cybercam_camera_read_raw`. The surface comprises 12 camera/display blocks and 12 KPU/result blocks.

Primary official sources:

- [01Studio CyberCAM machine-vision category](https://wiki.01studio.cc/docs/category/%E6%9C%BA%E5%99%A8%E8%A7%86%E8%A7%89-2/)
- [01Studio machine-vision source tree](https://github.com/01studio-lab/01studio_wiki/tree/main/docs/cybercam/machine_vision)
- [Official CyberCAM-Apps repository and AI-vision inventory](https://github.com/01studio-lab/CyberCAM-Apps)

The live category currently groups OpenCV, camera, display, drawing, image detection, color recognition, code recognition, KPU AI, and online training. The table below maps each area without treating every tutorial step as a package API.

## Official lesson mapping

| Official lesson area and evidence | `lib-cybercam-cv` coverage | Deliberately delegated or excluded |
|---|---|---|
| [OpenCV introduction](https://wiki.01studio.cc/docs/cybercam/machine_vision/opencv_intro/) | No duplicate OpenCV wrapper | Portable OpenCV operations remain in `@aily-project/lib-vision` |
| [Camera](https://wiki.01studio.cc/docs/cybercam/machine_vision/camera/) | `cybercam_camera_init`, `opened`, image-only `read`, complete-result `read_raw`, `hmirror`, `vflip`, `release`; `cybercam_ide_show`. The sensor choices preserve CSI2 `id=2` and CSI0 `id=0`. | FPS calculation, text drawing, and other generic Python/OpenCV steps use `lib-core` and `lib-vision` |
| [Display](https://wiki.01studio.cc/docs/cybercam/machine_vision/lcd/) | `cybercam_display_init`, `rotation`, `show`; `cybercam_lcd_direction`. Rotation values cover the documented 0/1/2/3 directions (0°/90°/180°/270°). | Generic image annotation remains in `lib-vision` |
| [Drawing and text](https://wiki.01studio.cc/docs/cybercam/machine_vision/draw/) | Camera/display blocks can supply and present images | `python_draw_rectangle`, `circle`, `line`, `polyline`, `text`, and `text_freetype` remain in `lib-vision` |
| [Image detection category](https://wiki.01studio.cc/docs/category/%E5%9B%BE%E5%83%8F%E6%A3%80%E6%B5%8B-1/): [edges](https://wiki.01studio.cc/docs/cybercam/machine_vision/image_detection/find_edges/), [circles](https://wiki.01studio.cc/docs/cybercam/machine_vision/image_detection/find_circles/), [rectangles](https://wiki.01studio.cc/docs/cybercam/machine_vision/image_detection/find_rects/) | Camera/display acquisition and presentation only | Generic Canny, Hough circles, Gaussian blur, morphology, contour search/analysis, rotated rectangles, and drawing are implemented once in `lib-vision` |
| [Color recognition category](https://wiki.01studio.cc/docs/category/%E9%A2%9C%E8%89%B2%E8%AF%86%E5%88%AB-1/): [single color](https://wiki.01studio.cc/docs/cybercam/machine_vision/color_recognition/single_color/), [multiple colors](https://wiki.01studio.cc/docs/cybercam/machine_vision/color_recognition/mutli_color/), [counting](https://wiki.01studio.cc/docs/cybercam/machine_vision/color_recognition/count/) | Camera/display acquisition and presentation only | `python_image_convert`, `python_image_in_range`, and `python_image_components` remain in `lib-vision`; complete tutorial pipelines are not duplicated |
| [Code recognition category](https://wiki.01studio.cc/docs/category/%E7%A0%81%E7%B1%BB%E8%AF%86%E5%88%AB-1/): [QR](https://wiki.01studio.cc/docs/cybercam/machine_vision/code/qr_code/), [barcode](https://wiki.01studio.cc/docs/cybercam/machine_vision/code/barcode/), [AprilTag](https://wiki.01studio.cc/docs/cybercam/machine_vision/code/apriltag/) | Camera/display acquisition and presentation only | QR/barcode/AprilTag detection, symbol filtering, and result-field access remain in `lib-vision` |
| [KPU AI category](https://wiki.01studio.cc/docs/category/ai%E8%A7%86%E8%A7%89kpu-1/) and the eleven pages mapped below | Six KPU constructors, three `run(...)` forms, and three result accessors | OpenCV rendering of boxes, labels, landmarks, and skeletons remains in `lib-vision` |
| [Online model training](https://wiki.01studio.cc/docs/cybercam/machine_vision/train/) | No runtime block | Dataset creation, annotation, training, download, app packaging, and QR/manual deployment are external workflows |

The official site may change category slugs while retaining the document routes. Both the category URL and stable-looking document URLs are recorded so the evidence can be rechecked.

## Migrated block ownership

| Group | Count | Unchanged block types |
|---|---:|---|
| Migrated camera lifecycle | 6 | `cybercam_camera_init`, `cybercam_camera_opened`, `cybercam_camera_read`, `cybercam_camera_hmirror`, `cybercam_camera_vflip`, `cybercam_camera_release` |
| New complete camera read | 1 | `cybercam_camera_read_raw`, returning the documented `(ret, img)` pair instead of discarding the success flag |
| Display, IDE, and direction | 5 | `cybercam_display_init`, `cybercam_display_rotation`, `cybercam_display_show`, `cybercam_ide_show`, `cybercam_lcd_direction` |
| KPU construction | 6 | `cybercam_ai_init_simple`, `cybercam_ai_init_face`, `cybercam_ai_init_mask`, `cybercam_ai_init_hand_keypoint`, `cybercam_ai_init_ocr`, `cybercam_ai_init_licence` |
| KPU execution | 3 | `cybercam_ai_run`, `cybercam_ai_run_confidence`, `cybercam_ai_run_thresholds` |
| Result access | 3 | `cybercam_result_length`, `cybercam_result_item`, `cybercam_result_property` |
| **Total** | **24** | 23 migrated types retain serialized identity; one type is new |

## Confirmed `walnutpi.kpu` classes

The current CyberCAM wiki directly demonstrates eleven classes. The official CyberCAM-Apps inventory additionally supplies OCR, smoke, and traffic-light examples, giving the fourteen classes represented by the blocks.

| Confirmed class | Official evidence | Block representation |
|---|---|---|
| `kpu.FACE_DETECT` | [Face detection lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/face_detection/) | `cybercam_ai_init_face` |
| `kpu.FACE_MASK` | [Mask detection lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/mask_det/) | `cybercam_ai_init_mask` |
| `kpu.FALL_DETECT` | [Fall detection lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/falldown_detection/) | `cybercam_ai_init_simple` (`FALL_DETECT`) |
| `kpu.HAND_DETECT` | [Hand detection lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/hand_detection/) | `cybercam_ai_init_simple` (`HAND_DETECT`) |
| `kpu.HAND_KEYPOINT` | [Hand-keypoint lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/hand_keypoint_det/) | `cybercam_ai_init_hand_keypoint` (`HAND_KEYPOINT`) |
| `kpu.HAND_KEYPOINT_CLS` | [Gesture-classification lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/hand_keypoint_class/) | `cybercam_ai_init_hand_keypoint` (`HAND_KEYPOINT_CLS`) |
| `kpu.LICENCE_DETECT` | [License recognition lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/license_det_rec/) | `cybercam_ai_init_licence` |
| `kpu.OCR` | [Official OCR app](https://github.com/01studio-lab/CyberCAM-Apps/blob/main/app/ai-vision/ocr/main.py) | `cybercam_ai_init_ocr` |
| `kpu.PERSON_DETECT` | [Person detection lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/person_detection/) | `cybercam_ai_init_simple` (`PERSON_DETECT`) |
| `kpu.PERSON_KEYPOINT` | [Person-keypoint lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/person_keypoint/) | `cybercam_ai_init_simple` (`PERSON_KEYPOINT`) |
| `kpu.SMOKE_DETECT` | [Official smoke-detection app](https://github.com/01studio-lab/CyberCAM-Apps/blob/main/app/ai-vision/smoke-det/main.py) | `cybercam_ai_init_simple` (`SMOKE_DETECT`) |
| `kpu.TRAFFIC_LIGHT_DETECT` | [Official traffic-light app](https://github.com/01studio-lab/CyberCAM-Apps/blob/main/app/ai-vision/traffic-light-recg/main.py) | `cybercam_ai_init_simple` (`TRAFFIC_LIGHT_DETECT`) |
| `kpu.YOLO11_CLS` | [YOLO11 classification lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/yolo11_cls/) | `cybercam_ai_init_simple` (`YOLO11_CLS`) |
| `kpu.YOLO11_DET` | [YOLO11 detection lesson](https://wiki.01studio.cc/docs/cybercam/machine_vision/ai_vision/yolo11_det/) | `cybercam_ai_init_simple` (`YOLO11_DET`) |

`cybercam_ai_run`, `cybercam_ai_run_confidence`, and `cybercam_ai_run_thresholds` preserve the existing zero-, one-, and two-threshold call forms. Not every model accepts every form; projects must use the call shape demonstrated for the selected model. Result fields also vary by model. The result-property dropdown exposes verified fields including nested face-landmark `.x`/`.y` paths, `mask` for `FACE_MASK`, and `top5` for `YOLO11_CLS`.

## Explicit non-duplication boundary

| Capability | Owning package or status | Reason |
|---|---|---|
| CyberCAM CSI camera, onboard display, IDE preview, direction sensor, and `walnutpi.kpu` | `@aily-project/lib-cybercam-cv` | Firmware- and board-specific API |
| Portable OpenCV image transforms and file operations | `@aily-project/lib-vision` | Same Python/OpenCV behavior can be reused by all compatible Linux boards |
| Portable OpenCV drawing | `@aily-project/lib-vision` | Avoid parallel `cybercam_*` and `python_*` wrappers for the same function |
| QR, barcode, and AprilTag | `@aily-project/lib-vision` | Implemented with portable `pyzbar` and `pupil_apriltags` APIs |
| Ordinary `/dev/video*` V4L2 camera through `cv2.VideoCapture` | `@aily-project/lib-camera`, which does not declare CyberCAM compatibility | Not interchangeable with `walnutpi.Sensor` and the CSI pipeline |
| GPIO, onboard LED/key, and K230 PWM | `@aily-project/lib-cybercam-gpio` | Twelve existing `cybercam_*` types moved unchanged from the base package; they use CyberCAM `board`/`digitalio` pins and fixed `periphery.PWM` chip/channel mappings |
| CyberCAM UART2 (`/dev/ttyS2`) | `@aily-project/lib-serial` | New projects use the six toolbox-visible `linux_uart_*` types; six `cybercam_uart_*` definitions are hidden solely for legacy-workspace compatibility, giving 12 registered definitions and 6 toolbox-visible blocks |
| ADC, K230 ALSA audio, QMI8658 IMU, and chip ID | `@aily-project/lib-cybercam` | These ten remaining base-board blocks stay separate from machine vision, GPIO/PWM, and UART |
| Python lifecycle, values, variables, and control flow | `@aily-project/lib-core` | Language primitives are portable |
| Tutorial OpenCV, contour, drawing, connected-component, and code-result operations | `@aily-project/lib-vision` 0.0.1 (32 blocks) | Shared across compatible Linux boards instead of being duplicated here |
| Model files, anchors, dictionaries, labels, fonts, datasets, and app assets | User/official example deployment | Binary/data assets depend on the model and target system image |
| Online training and app installation | External 01Studio workflow | Not a stable runtime Python API |

## Runtime and migration boundary

The generated program requires the aily CPython generator runtime and a CyberCAM image that supplies compatible `walnutpi` modules. KPU model compatibility depends on the system image and nncase/runtime version; the package does not convert or validate model binaries.

Existing workspaces retain the same 23 migrated vision block type strings and field machine values. `cybercam_camera_read_raw` is additive. Projects must add `@aily-project/lib-cybercam-cv` after the vision split. The later GPIO split likewise preserves all 12 GPIO/LED/key/PWM type strings, so projects using them add `@aily-project/lib-cybercam-gpio`. The six legacy `cybercam_uart_*` types then moved from the base package to `@aily-project/lib-serial`, where they are hidden compatibility definitions; new CyberCAM projects use the six toolbox-visible `linux_uart_*` types and must set `DEVICE` to `/dev/ttyS2`. The base `@aily-project/lib-cybercam` now owns only ten ADC/audio/IMU/chip-ID blocks. Loading this package with an older aggregate base version that still registers the 23 vision types, loading the GPIO package with an older base version that still registers its 12 migrated types, or loading the updated serial package with an older base version that still registers the legacy UART definitions is unsupported because Blockly definitions and `Python.forBlock` handlers would collide.
