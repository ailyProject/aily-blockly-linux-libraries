# Camera & AI

Package: `@aily-project/lib-cybercam-cv`

Version: 0.0.1

Runtime: standalone CPython generator at `globalThis.Python`

Target: `canaan:k230:cybercam`

This package owns 24 CyberCAM-specific camera, display, and KPU blocks: 23 types moved unchanged from `@aily-project/lib-cybercam`, plus the new `cybercam_camera_read_raw` block for the complete camera-read result.

## Block surface

### Camera and display (12)

`cybercam_camera_init`, `cybercam_camera_opened`, `cybercam_camera_read`, `cybercam_camera_read_raw`, `cybercam_camera_hmirror`, `cybercam_camera_vflip`, `cybercam_camera_release`, `cybercam_display_init`, `cybercam_display_rotation`, `cybercam_display_show`, `cybercam_ide_show`, `cybercam_lcd_direction`.

These blocks generate `walnutpi.Sensor`, `Display`, `IDE`, and `direction` calls. Camera selection exposes onboard CSI2 (`id=2`) and expansion CSI0 (`id=0`); display rotation exposes the documented values 0°, 90°, 180°, and 270°. `cybercam_camera_read` returns the image directly, while `cybercam_camera_read_raw` preserves the complete `(ret, img)` result. Do not substitute `linux_camera_*`: those blocks target ordinary V4L2 devices through `cv2.VideoCapture` and are not CyberCAM-compatible.

### KPU inference and results (12)

`cybercam_ai_init_simple`, `cybercam_ai_init_face`, `cybercam_ai_init_mask`, `cybercam_ai_init_hand_keypoint`, `cybercam_ai_init_ocr`, `cybercam_ai_init_licence`, `cybercam_ai_run`, `cybercam_ai_run_confidence`, `cybercam_ai_run_thresholds`, `cybercam_result_length`, `cybercam_result_item`, `cybercam_result_property`.

Confirmed classes: `FACE_DETECT`, `FACE_MASK`, `FALL_DETECT`, `HAND_DETECT`, `HAND_KEYPOINT`, `HAND_KEYPOINT_CLS`, `LICENCE_DETECT`, `OCR`, `PERSON_DETECT`, `PERSON_KEYPOINT`, `SMOKE_DETECT`, `TRAFFIC_LIGHT_DETECT`, `YOLO11_CLS`, and `YOLO11_DET`.

Result properties include verified box, label, text, keypoint, and face-landmark fields, plus `mask` for mask-detection results and `top5` for YOLO11 classification results. Result shapes remain model-specific.

Model, anchor, dictionary, and label assets are not bundled. Deploy files that match the target CyberCAM image and nncase/KPU runtime, then pass their real paths to the initializer blocks.

## Non-duplication boundary

The official machine-vision lessons also use portable OpenCV image operations, drawing, shape/color processing, QR/barcode decoding, and AprilTag detection. Those remain in the CyberCAM-compatible `@aily-project/lib-vision` 0.0.1 package under 32 `python_*` block types. It includes the tutorial's Canny, Hough-circle, morphology, contour, connected-component, FreeType, and code-result operations; this package does not copy them.

Online training, dataset annotation, app packaging, QR deployment, and system configuration are external workflows rather than stable runtime APIs and are intentionally excluded.

## Composition and migration

Use `@aily-project/lib-core` for program structure, this package for CyberCAM vision hardware and KPU, and `@aily-project/lib-vision` for portable image processing. GPIO, onboard LED/key, and PWM belong to the 12-block `@aily-project/lib-cybercam-gpio`. UART belongs to `@aily-project/lib-serial`, which registers 12 definitions but exposes only the six `linux_uart_*` types in its toolbox; new CyberCAM projects must set `DEVICE` to `/dev/ttyS2`, while the six hidden `cybercam_uart_*` definitions exist only for legacy-workspace compatibility. ADC, audio, IMU, and chip ID remain in the ten-block `@aily-project/lib-cybercam`.

Existing projects do not rename the 23 migrated vision block types. The raw camera-read block is new. Add `@aily-project/lib-cybercam-cv` to the project. Projects using the 12 migrated GPIO/LED/key/PWM types must also add `@aily-project/lib-cybercam-gpio`; keep the base CyberCAM package only for ADC, audio, IMU, or chip ID. Legacy workspaces using the six `cybercam_uart_*` types add the updated `@aily-project/lib-serial`; new workspaces use its visible `linux_uart_*` types with `/dev/ttyS2`. Do not load this package with an older aggregate `lib-cybercam` release that still defines the same 23 vision types, do not load the new GPIO package with an older base release that still registers its 12 migrated types, and do not load the updated serial package with an older base release that still registers the legacy UART handlers.

The project must use `"devmode": "python"` and load the aily CPython generator runtime. See `API-COVERAGE.md` for official lesson mapping and evidence URLs.
