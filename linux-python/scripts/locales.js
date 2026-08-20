'use strict';

const lines = (text) => text.trim().split('\n');

const messages = {
  zh_cn: lines(`
初始化 GPIO %1，引脚 %2，方向 %3，上下拉 %4
将 GPIO %1 设为 %2
GPIO %1 的值
关闭 GPIO %1
将板载 LED 设为 %1
板载按键已按下
初始化 PWM %1，引脚 %2，频率 %3 Hz
将 PWM %1 的占空比设为 %2（0–1）
关闭 PWM %1
初始化串口 %1，设备 %2，波特率 %3
串口 %1 可读取的字节数
从串口 %1 读取 %2 字节
向串口 %1 写入 %2
清空串口 %1 的输入缓冲区
关闭串口 %1
初始化摄像头 %1，设备 %2，宽 %3，高 %4
摄像头 %1 已打开
摄像头 %1 的图像
释放摄像头 %1
播放 WAV 文件 %1
录制 WAV 到 %1，时长 %2 秒，采样率 %3`),
  zh_hk: lines(`
初始化 GPIO %1，引腳 %2，方向 %3，上下拉 %4
將 GPIO %1 設為 %2
GPIO %1 的值
關閉 GPIO %1
將板載 LED 設為 %1
板載按鍵已按下
初始化 PWM %1，引腳 %2，頻率 %3 Hz
將 PWM %1 的佔空比設為 %2（0–1）
關閉 PWM %1
初始化串口 %1，裝置 %2，鮑率 %3
串口 %1 可讀取的位元組數
從串口 %1 讀取 %2 位元組
向串口 %1 寫入 %2
清空串口 %1 的輸入緩衝區
關閉串口 %1
初始化相機 %1，裝置 %2，寬 %3，高 %4
相機 %1 已開啟
相機 %1 的圖像
釋放相機 %1
播放 WAV 檔案 %1
錄製 WAV 至 %1，時長 %2 秒，取樣率 %3`),
  ja: lines(`
GPIO %1 を初期化、ピン %2、方向 %3、プル %4
GPIO %1 を %2 にする
GPIO %1 の値
GPIO %1 を閉じる
オンボード LED を %1 にする
オンボードキーが押されている
PWM %1 を初期化、ピン %2、周波数 %3 Hz
PWM %1 のデューティを %2（0–1）にする
PWM %1 を閉じる
シリアル %1 を初期化、デバイス %2、ボーレート %3
シリアル %1 の受信可能バイト数
シリアル %1 から %2 バイト読む
シリアル %1 に %2 を書く
シリアル %1 の入力バッファを空にする
シリアル %1 を閉じる
カメラ %1 を初期化、デバイス %2、幅 %3、高さ %4
カメラ %1 は開いている
カメラ %1 の画像
カメラ %1 を解放する
WAV ファイル %1 を再生
WAV を %1 に録音、秒数 %2、サンプリング %3`),
  ko: lines(`
GPIO %1 초기화, 핀 %2, 방향 %3, 풀 %4
GPIO %1 을 %2 로 설정
GPIO %1 값
GPIO %1 닫기
온보드 LED 를 %1 로 설정
온보드 키가 눌림
PWM %1 초기화, 핀 %2, 주파수 %3 Hz
PWM %1 듀티를 %2(0–1)로 설정
PWM %1 닫기
시리얼 %1 초기화, 장치 %2, 보드레이트 %3
시리얼 %1 에서 읽을 수 있는 바이트
시리얼 %1 에서 %2 바이트 읽기
시리얼 %1 에 %2 쓰기
시리얼 %1 입력 버퍼 비우기
시리얼 %1 닫기
카메라 %1 초기화, 장치 %2, 너비 %3, 높이 %4
카메라 %1 이 열림
카메라 %1 이미지
카메라 %1 해제
WAV 파일 %1 재생
WAV 를 %1 에 녹음, 초 %2, 샘플링 %3`),
  de: lines(`
GPIO %1 initialisieren, Pin %2, Richtung %3, Pull %4
GPIO %1 auf %2 setzen
GPIO-%1-Wert
GPIO %1 schließen
Onboard-LED auf %1 setzen
Onboard-Taste ist gedrückt
PWM %1 initialisieren, Pin %2, Frequenz %3 Hz
PWM-%1-Tastverhältnis auf %2 (0–1) setzen
PWM %1 schließen
Seriell %1 initialisieren, Gerät %2, Baud %3
verfügbare Bytes von Seriell %1
%2 Bytes von Seriell %1 lesen
auf Seriell %1 schreiben %2
Eingangspuffer von Seriell %1 leeren
Seriell %1 schließen
Kamera %1 initialisieren, Gerät %2, Breite %3, Höhe %4
Kamera %1 ist geöffnet
Bild von Kamera %1
Kamera %1 freigeben
WAV-Datei %1 abspielen
WAV nach %1 aufnehmen, Sekunden %2, Abtastrate %3`),
  fr: lines(`
initialiser GPIO %1 broche %2 direction %3 rappel %4
mettre GPIO %1 à %2
valeur de GPIO %1
fermer GPIO %1
mettre la LED intégrée à %1
la touche intégrée est enfoncée
initialiser PWM %1 broche %2 fréquence %3 Hz
régler le rapport cyclique de PWM %1 à %2 (0–1)
fermer PWM %1
initialiser le port série %1 périphérique %2 débit %3
octets disponibles du port série %1
lire %2 octets du port série %1
écrire %2 sur le port série %1
vider le tampon d’entrée du port série %1
fermer le port série %1
initialiser la caméra %1 périphérique %2 largeur %3 hauteur %4
la caméra %1 est ouverte
image de la caméra %1
libérer la caméra %1
lire le fichier WAV %1
enregistrer un WAV vers %1 secondes %2 fréquence %3`),
  es: lines(`
inicializar GPIO %1 pin %2 dirección %3 pull %4
establecer GPIO %1 a %2
valor de GPIO %1
cerrar GPIO %1
establecer el LED integrado a %1
la tecla integrada está pulsada
inicializar PWM %1 pin %2 frecuencia %3 Hz
establecer el ciclo de trabajo de PWM %1 a %2 (0–1)
cerrar PWM %1
inicializar serie %1 dispositivo %2 baudios %3
bytes disponibles de serie %1
leer %2 bytes de serie %1
escribir %2 en serie %1
vaciar el búfer de entrada de serie %1
cerrar serie %1
inicializar cámara %1 dispositivo %2 ancho %3 alto %4
la cámara %1 está abierta
imagen de la cámara %1
liberar cámara %1
reproducir archivo WAV %1
grabar WAV en %1 segundos %2 muestreo %3`),
  pt: lines(`
inicializar GPIO %1 pino %2 direção %3 pull %4
definir GPIO %1 para %2
valor de GPIO %1
fechar GPIO %1
definir o LED integrado para %1
a tecla integrada está pressionada
inicializar PWM %1 pino %2 frequência %3 Hz
definir o ciclo de trabalho de PWM %1 para %2 (0–1)
fechar PWM %1
inicializar serial %1 dispositivo %2 baud %3
bytes disponíveis da serial %1
ler %2 bytes da serial %1
escrever %2 na serial %1
limpar o buffer de entrada da serial %1
fechar serial %1
inicializar câmera %1 dispositivo %2 largura %3 altura %4
a câmera %1 está aberta
imagem da câmera %1
liberar câmera %1
reproduzir arquivo WAV %1
gravar WAV em %1 segundos %2 taxa %3`),
  ru: lines(`
инициализировать GPIO %1 пин %2 направление %3 подтяжка %4
установить GPIO %1 в %2
значение GPIO %1
закрыть GPIO %1
установить встроенный светодиод в %1
встроенная кнопка нажата
инициализировать PWM %1 пин %2 частота %3 Гц
установить скважность PWM %1 в %2 (0–1)
закрыть PWM %1
инициализировать порт %1 устройство %2 скорость %3
доступные байты порта %1
прочитать %2 байт из порта %1
записать %2 в порт %1
очистить входной буфер порта %1
закрыть порт %1
инициализировать камеру %1 устройство %2 ширина %3 высота %4
камера %1 открыта
изображение камеры %1
освободить камеру %1
воспроизвести WAV-файл %1
записать WAV в %1 секунды %2 частота %3`),
  ar: lines(`
هيئ GPIO %1 الطرف %2 الاتجاه %3 السحب %4
عيّن GPIO %1 إلى %2
قيمة GPIO %1
أغلق GPIO %1
عيّن مؤشر LED المدمج إلى %1
المفتاح المدمج مضغوط
هيئ PWM %1 الطرف %2 التردد %3 هرتز
عيّن دورة PWM %1 إلى %2 (0–1)
أغلق PWM %1
هيئ المنفذ التسلسلي %1 الجهاز %2 السرعة %3
البايتات المتاحة من المنفذ %1
اقرأ %2 بايت من المنفذ %1
اكتب %2 إلى المنفذ %1
امسح مخزن إدخال المنفذ %1
أغلق المنفذ %1
هيئ الكاميرا %1 الجهاز %2 العرض %3 الارتفاع %4
الكاميرا %1 مفتوحة
صورة الكاميرا %1
حرّر الكاميرا %1
شغّل ملف WAV %1
سجّل WAV إلى %1 ثوانٍ %2 معدل %3`),
};

const dropdownLabels = {
  zh_cn: { input: '输入', output: '输出', none: '无', up: '上拉', down: '下拉' },
  zh_hk: { input: '輸入', output: '輸出', none: '無', up: '上拉', down: '下拉' },
  ja: { input: '入力', output: '出力', none: 'なし', up: 'プルアップ', down: 'プルダウン' },
  ko: { input: '입력', output: '출력', none: '없음', up: '풀업', down: '풀다운' },
};

const westernDropdownWords = {
  de: ['Eingang', 'Ausgang', 'keiner', 'Pull-up', 'Pull-down'],
  fr: ['entrée', 'sortie', 'aucun', 'tirage haut', 'tirage bas'],
  es: ['entrada', 'salida', 'ninguno', 'pull-up', 'pull-down'],
  pt: ['entrada', 'saída', 'nenhum', 'pull-up', 'pull-down'],
  ru: ['вход', 'выход', 'нет', 'подтяжка вверх', 'подтяжка вниз'],
  ar: ['إدخال', 'إخراج', 'بلا', 'رفع', 'خفض'],
};

function buildWesternDropdownMap(locale) {
  const w = westernDropdownWords[locale];
  return { input: w[0], output: w[1], none: w[2], up: w[3], down: w[4] };
}

function localizedMessages(locale) {
  if (!messages[locale]) throw new Error(`Missing message catalog for ${locale}`);
  return messages[locale];
}

function localizeDropdown(locale, label) {
  const map = dropdownLabels[locale] || buildWesternDropdownMap(locale);
  return map[label] || label;
}

module.exports = { localizedMessages, localizeDropdown };
