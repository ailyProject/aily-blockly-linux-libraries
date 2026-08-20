'use strict';

const lines = (text) => text.trim().split('\n');

const faceLandmarkOptions = [
  ['left eye', 'left_eye'],
  ['left eye x', 'left_eye.x'],
  ['left eye y', 'left_eye.y'],
  ['right eye', 'right_eye'],
  ['right eye x', 'right_eye.x'],
  ['right eye y', 'right_eye.y'],
  ['nose', 'nose'],
  ['nose x', 'nose.x'],
  ['nose y', 'nose.y'],
  ['left mouth', 'left_mouth'],
  ['left mouth x', 'left_mouth.x'],
  ['left mouth y', 'left_mouth.y'],
  ['right mouth', 'right_mouth'],
  ['right mouth x', 'right_mouth.x'],
  ['right mouth y', 'right_mouth.y'],
];

const faceLandmarkLabels = {
  zh_cn: ['左眼', '左眼 x', '左眼 y', '右眼', '右眼 x', '右眼 y', '鼻子', '鼻子 x', '鼻子 y', '左嘴角', '左嘴角 x', '左嘴角 y', '右嘴角', '右嘴角 x', '右嘴角 y'],
  zh_hk: ['左眼', '左眼 x', '左眼 y', '右眼', '右眼 x', '右眼 y', '鼻子', '鼻子 x', '鼻子 y', '左嘴角', '左嘴角 x', '左嘴角 y', '右嘴角', '右嘴角 x', '右嘴角 y'],
  ja: ['左目', '左目 x', '左目 y', '右目', '右目 x', '右目 y', '鼻', '鼻 x', '鼻 y', '左口角', '左口角 x', '左口角 y', '右口角', '右口角 x', '右口角 y'],
  ko: ['왼쪽 눈', '왼쪽 눈 x', '왼쪽 눈 y', '오른쪽 눈', '오른쪽 눈 x', '오른쪽 눈 y', '코', '코 x', '코 y', '왼쪽 입꼬리', '왼쪽 입꼬리 x', '왼쪽 입꼬리 y', '오른쪽 입꼬리', '오른쪽 입꼬리 x', '오른쪽 입꼬리 y'],
  de: ['linkes Auge', 'linkes Auge x', 'linkes Auge y', 'rechtes Auge', 'rechtes Auge x', 'rechtes Auge y', 'Nase', 'Nase x', 'Nase y', 'linker Mundwinkel', 'linker Mundwinkel x', 'linker Mundwinkel y', 'rechter Mundwinkel', 'rechter Mundwinkel x', 'rechter Mundwinkel y'],
  fr: ['œil gauche', 'œil gauche x', 'œil gauche y', 'œil droit', 'œil droit x', 'œil droit y', 'nez', 'nez x', 'nez y', 'coin gauche de la bouche', 'coin gauche de la bouche x', 'coin gauche de la bouche y', 'coin droit de la bouche', 'coin droit de la bouche x', 'coin droit de la bouche y'],
  es: ['ojo izquierdo', 'ojo izquierdo x', 'ojo izquierdo y', 'ojo derecho', 'ojo derecho x', 'ojo derecho y', 'nariz', 'nariz x', 'nariz y', 'comisura izquierda', 'comisura izquierda x', 'comisura izquierda y', 'comisura derecha', 'comisura derecha x', 'comisura derecha y'],
  pt: ['olho esquerdo', 'olho esquerdo x', 'olho esquerdo y', 'olho direito', 'olho direito x', 'olho direito y', 'nariz', 'nariz x', 'nariz y', 'canto esquerdo da boca', 'canto esquerdo da boca x', 'canto esquerdo da boca y', 'canto direito da boca', 'canto direito da boca x', 'canto direito da boca y'],
  ru: ['левый глаз', 'левый глаз x', 'левый глаз y', 'правый глаз', 'правый глаз x', 'правый глаз y', 'нос', 'нос x', 'нос y', 'левый угол рта', 'левый угол рта x', 'левый угол рта y', 'правый угол рта', 'правый угол рта x', 'правый угол рта y'],
  ar: ['العين اليسرى', 'العين اليسرى x', 'العين اليسرى y', 'العين اليمنى', 'العين اليمنى x', 'العين اليمنى y', 'الأنف', 'الأنف x', 'الأنف y', 'زاوية الفم اليسرى', 'زاوية الفم اليسرى x', 'زاوية الفم اليسرى y', 'زاوية الفم اليمنى', 'زاوية الفم اليمنى x', 'زاوية الفم اليمنى y'],
};

// Entries follow the block declaration order in build-assets.js. Technical names and
// acronyms remain unchanged; every surrounding label is written for the target locale.
const messages = {
  zh_cn: lines(`
当 CyberCAM 启动时 %1 %2
CyberCAM 永久循环 %1 %2
等待 %1 秒
打印 %1
数值 %1
文本 %1
布尔值 %1
由项目 %1 构成元组
由项目 %1 构成列表
将变量 %1 设为 %2
变量 %1
如果 %1 则执行 %2 %3
对于 %2 中的每个 %1 执行 %3 %4
初始化 GPIO %1，引脚 %2，方向 %3，上下拉 %4
将 GPIO %1 设为 %2
GPIO %1 的值
将板载 LED 设为 %1
板载按键已按下
初始化 PWM %1，目标 %2
将 PWM %1 的频率设为 %2 Hz
将 PWM %1 的占空比设为 %2（0–1）
启用 PWM %1
禁用 PWM %1
关闭 PWM %1
初始化 UART %1，波特率 %2
UART %1 可读取的字节数
从 UART %1 读取 %2 字节
向 UART %1 写入 %2
清空 UART %1 的输入缓冲区
初始化摄像头 %1，宽 %2，高 %3，传感器 %4
摄像头 %1 已打开
摄像头 %1 的图像
设置摄像头 %1 水平镜像 %2
设置摄像头 %1 垂直翻转 %2
释放摄像头 %1
初始化板载显示屏
将显示屏旋转角度设为 %1
在显示屏上显示图像 %1
在 IDE 中显示图像 %1
当前显示屏方向
将图像 %1 调整为宽 %2、高 %3
使用 %2 转换图像 %1
对图像 %1 按下限 %2、上限 %3 生成掩膜
计算 %1 的连通组件，连通性 %2
加载图像文件 %1
将图像 %1 保存到文件 %2
在 %1 上绘制矩形：从 x %2、y %3 到 x %4、y %5，颜色 %6，线宽 %7
在 %1 上绘制圆：x %2、y %3，半径 %4，颜色 %5，线宽 %6
在 %1 上绘制线段：从 x %2、y %3 到 x %4、y %5，颜色 %6，线宽 %7
在 %2 的 x %3、y %4 处绘制文本 %1，缩放 %5，颜色 %6，线宽 %7
解码 %1 中的二维码
解码 %1 中的条形码
初始化 AprilTag 检测器 %1，标签族 %2
使用 AprilTag 检测器 %1 检测灰度图像 %2
初始化 AI %1，模型 %2，路径 %3，尺寸 %4
初始化人脸检测器 %1，模型 %2，锚点 %3，尺寸 %4
初始化口罩检测器 %1，检测模型 %2，锚点 %3，尺寸 %4，口罩模型 %5
初始化手部 AI %1，类型 %2，检测模型 %3，关键点模型 %4
初始化 OCR %1，检测模型 %2，识别模型 %3，字典 %4，检测尺寸 %5，识别宽 %6、高 %7
初始化车牌 AI %1，检测模型 %2，识别模型 %3，锚点 %4，标签 %5，检测尺寸 %6，识别宽 %7、高 %8
用 AI %1 处理 %2
用 AI %1 处理 %2，置信度 %3
用 AI %1 处理 %2，置信度 %3，NMS %4
结果列表 %1 的长度
结果列表 %1 的第 %2 项
结果 %1 的属性 %2
初始化套接字 %1，地址族 %2，类型 %3
网络地址：主机 %1，端口 %2
将套接字 %1 连接到 %2
将套接字 %1 绑定到 %2
让套接字 %1 监听，积压队列 %2
套接字 %1 接受连接
通过套接字 %1 发送 %2
通过套接字 %1 接收 %2 字节
关闭套接字 %1
初始化 MQTT 客户端 %1
MQTT %1 连接主机 %2、端口 %3，保活 %4
MQTT %1 向主题 %2 发布消息 %3
MQTT %1 订阅主题 %2
MQTT %1 永久运行消息循环
断开 MQTT %1
HTTP %1：URL %2，数据 %3
HTTP 响应 %1 的属性 %2
通过 HTTP 提供当前目录：主机 %1，端口 %2
读取文本文件 %1
以 %1 模式处理文本文件 %2，内容 %3
路径 %1 存在
列出目录 %1
运行系统命令 %1
播放 WAV 文件 %1
录制 WAV 到 %1，时长 %2 秒，采样率 %3
初始化 QMI8658 IMU %1，总线 %2，地址 %3
IMU %1 的六轴数值
IMU %1 的轴 %2
校准 IMU %1，采样数 %2
K230 CPU 温度 °C
K230 唯一芯片 ID`),
  zh_hk: lines(`
當 CyberCAM 啟動時 %1 %2
CyberCAM 永久循環 %1 %2
等待 %1 秒
列印 %1
數值 %1
文字 %1
布林值 %1
由項目 %1 組成元組
由項目 %1 組成清單
將變數 %1 設為 %2
變數 %1
如果 %1 則執行 %2 %3
對 %2 中的每個 %1 執行 %3 %4
初始化 GPIO %1，引腳 %2，方向 %3，上下拉 %4
將 GPIO %1 設為 %2
GPIO %1 的值
將板載 LED 設為 %1
板載按鍵已按下
初始化 PWM %1，目標 %2
將 PWM %1 的頻率設為 %2 Hz
將 PWM %1 的佔空比設為 %2（0–1）
啟用 PWM %1
停用 PWM %1
關閉 PWM %1
初始化 UART %1，鮑率 %2
UART %1 可讀取的位元組數
從 UART %1 讀取 %2 位元組
向 UART %1 寫入 %2
清空 UART %1 的輸入緩衝區
初始化相機 %1，寬 %2，高 %3，感測器 %4
相機 %1 已開啟
相機 %1 的圖像
設定相機 %1 水平鏡像 %2
設定相機 %1 垂直翻轉 %2
釋放相機 %1
初始化板載螢幕
將螢幕旋轉角度設為 %1
在螢幕上顯示圖像 %1
在 IDE 中顯示圖像 %1
目前螢幕方向
將圖像 %1 調整為寬 %2、高 %3
使用 %2 轉換圖像 %1
對圖像 %1 按下限 %2、上限 %3 產生遮罩
計算 %1 的連通元件，連通性 %2
載入圖像檔案 %1
將圖像 %1 儲存至檔案 %2
在 %1 上繪製矩形：從 x %2、y %3 到 x %4、y %5，顏色 %6，線寬 %7
在 %1 上繪製圓形：x %2、y %3，半徑 %4，顏色 %5，線寬 %6
在 %1 上繪製線段：從 x %2、y %3 到 x %4、y %5，顏色 %6，線寬 %7
在 %2 的 x %3、y %4 繪製文字 %1，縮放 %5，顏色 %6，線寬 %7
解碼 %1 中的 QR Code
解碼 %1 中的條碼
初始化 AprilTag 偵測器 %1，標籤族 %2
使用 AprilTag 偵測器 %1 偵測灰階圖像 %2
初始化 AI %1，模型 %2，路徑 %3，尺寸 %4
初始化人臉偵測器 %1，模型 %2，錨點 %3，尺寸 %4
初始化口罩偵測器 %1，偵測模型 %2，錨點 %3，尺寸 %4，口罩模型 %5
初始化手部 AI %1，類型 %2，偵測模型 %3，關鍵點模型 %4
初始化 OCR %1，偵測模型 %2，辨識模型 %3，字典 %4，偵測尺寸 %5，辨識寬 %6、高 %7
初始化車牌 AI %1，偵測模型 %2，辨識模型 %3，錨點 %4，標籤 %5，偵測尺寸 %6，辨識寬 %7、高 %8
用 AI %1 處理 %2
用 AI %1 處理 %2，信心度 %3
用 AI %1 處理 %2，信心度 %3，NMS %4
結果清單 %1 的長度
結果清單 %1 的第 %2 項
結果 %1 的屬性 %2
初始化 Socket %1，位址族 %2，類型 %3
網絡位址：主機 %1，連接埠 %2
將 Socket %1 連線至 %2
將 Socket %1 綁定至 %2
讓 Socket %1 監聽，等候佇列 %2
Socket %1 接受連線
透過 Socket %1 傳送 %2
透過 Socket %1 接收 %2 位元組
關閉 Socket %1
初始化 MQTT 用戶端 %1
MQTT %1 連線主機 %2、連接埠 %3，保活 %4
MQTT %1 向主題 %2 發佈訊息 %3
MQTT %1 訂閱主題 %2
MQTT %1 永久執行訊息循環
中斷 MQTT %1
HTTP %1：URL %2，資料 %3
HTTP 回應 %1 的屬性 %2
透過 HTTP 提供目前目錄：主機 %1，連接埠 %2
讀取文字檔案 %1
以 %1 模式處理文字檔案 %2，內容 %3
路徑 %1 存在
列出目錄 %1
執行系統命令 %1
播放 WAV 檔案 %1
錄製 WAV 至 %1，時長 %2 秒，取樣率 %3
初始化 QMI8658 IMU %1，匯流排 %2，位址 %3
IMU %1 的六軸數值
IMU %1 的軸 %2
校準 IMU %1，取樣數 %2
K230 CPU 溫度 °C
K230 唯一晶片 ID`),
  ja: lines(`
CyberCAM の起動時 %1 %2
CyberCAM で無限に繰り返す %1 %2
%1 秒待つ
%1 を表示
数値 %1
テキスト %1
真偽値 %1
項目 %1 からタプルを作成
項目 %1 からリストを作成
変数 %1 を %2 に設定
変数 %1
もし %1 なら %2 %3
%2 の各 %1 について %3 %4
GPIO %1 を初期化：ピン %2、方向 %3、プル %4
GPIO %1 を %2 に設定
GPIO %1 の値
オンボード LED を %1 に設定
オンボードキーが押されている
PWM %1 を初期化：対象 %2
PWM %1 の周波数を %2 Hz に設定
PWM %1 のデューティ比を %2（0–1）に設定
PWM %1 を有効化
PWM %1 を無効化
PWM %1 を閉じる
UART %1 を初期化：ボーレート %2
UART %1 の受信可能バイト数
UART %1 から %2 バイト読み取る
UART %1 に %2 を書き込む
UART %1 の入力バッファを消去
カメラ %1 を初期化：幅 %2、高さ %3、センサー %4
カメラ %1 は開いている
カメラ %1 の画像
カメラ %1 の左右反転を %2 に設定
カメラ %1 の上下反転を %2 に設定
カメラ %1 を解放
オンボード画面を初期化
画面の回転を %1 に設定
画像 %1 を画面に表示
画像 %1 を IDE に表示
現在の画面方向
画像 %1 を幅 %2、高さ %3 にリサイズ
画像 %1 を %2 で変換
画像 %1 を下限 %2、上限 %3 でマスク化
%1 の連結成分を計算：接続性 %2
画像ファイル %1 を読み込む
画像 %1 をファイル %2 に保存
%1 に矩形を描画：x %2、y %3 から x %4、y %5、色 %6、太さ %7
%1 に円を描画：x %2、y %3、半径 %4、色 %5、太さ %6
%1 に線を描画：x %2、y %3 から x %4、y %5、色 %6、太さ %7
%2 の x %3、y %4 に文字 %1 を描画：倍率 %5、色 %6、太さ %7
%1 内の QR コードを読み取る
%1 内のバーコードを読み取る
AprilTag 検出器 %1 を初期化：ファミリー %2
AprilTag 検出器 %1 でグレースケール画像 %2 を検出
AI %1 を初期化：モデル %2、パス %3、サイズ %4
顔検出器 %1 を初期化：モデル %2、アンカー %3、サイズ %4
マスク検出器 %1 を初期化：検出モデル %2、アンカー %3、サイズ %4、マスクモデル %5
手 AI %1 を初期化：種類 %2、検出モデル %3、キーポイントモデル %4
OCR %1 を初期化：検出 %2、認識 %3、辞書 %4、検出サイズ %5、認識幅 %6、高さ %7
ナンバープレート AI %1 を初期化：検出 %2、認識 %3、アンカー %4、ラベル %5、検出サイズ %6、認識幅 %7、高さ %8
AI %1 を %2 に実行
AI %1 を %2 に実行：信頼度 %3
AI %1 を %2 に実行：信頼度 %3、NMS %4
結果リスト %1 の長さ
結果リスト %1 の項目 %2
結果 %1 のプロパティ %2
ソケット %1 を初期化：アドレスファミリー %2、種類 %3
ネットワークアドレス：ホスト %1、ポート %2
ソケット %1 を %2 に接続
ソケット %1 を %2 にバインド
ソケット %1 を待ち受け：バックログ %2
ソケット %1 で接続を受け入れる
ソケット %1 で %2 を送信
ソケット %1 で %2 バイト受信
ソケット %1 を閉じる
MQTT クライアント %1 を初期化
MQTT %1 をホスト %2、ポート %3 に接続：キープアライブ %4
MQTT %1 でトピック %2 にメッセージ %3 を発行
MQTT %1 でトピック %2 を購読
MQTT %1 のメッセージループを常時実行
MQTT %1 を切断
HTTP %1：URL %2、データ %3
HTTP レスポンス %1 のプロパティ %2
現在のディレクトリを HTTP 配信：ホスト %1、ポート %2
テキストファイル %1 を読み取る
テキストファイル %2 を %1 モードで処理：内容 %3
パス %1 が存在する
ディレクトリ %1 を一覧表示
システムコマンド %1 を実行
WAV ファイル %1 を再生
WAV を %1 に録音：%2 秒、サンプルレート %3
QMI8658 IMU %1 を初期化：バス %2、アドレス %3
IMU %1 の6軸値
IMU %1 の軸 %2
IMU %1 を校正：サンプル数 %2
K230 CPU 温度 °C
K230 固有チップ ID`),
  ko: lines(`
CyberCAM 시작 시 %1 %2
CyberCAM에서 계속 반복 %1 %2
%1초 기다리기
%1 출력
숫자 %1
텍스트 %1
불리언 %1
항목 %1로 튜플 만들기
항목 %1로 리스트 만들기
변수 %1을(를) %2로 설정
변수 %1
%1이면 %2 실행 %3
%2의 각 %1에 대해 %3 실행 %4
GPIO %1 초기화: 핀 %2, 방향 %3, 풀 %4
GPIO %1을(를) %2로 설정
GPIO %1 값
온보드 LED를 %1로 설정
온보드 키가 눌림
PWM %1 초기화: 대상 %2
PWM %1 주파수를 %2 Hz로 설정
PWM %1 듀티 사이클을 %2(0–1)로 설정
PWM %1 활성화
PWM %1 비활성화
PWM %1 닫기
UART %1 초기화: 보드레이트 %2
UART %1에서 읽을 수 있는 바이트 수
UART %1에서 %2바이트 읽기
UART %1에 %2 쓰기
UART %1 입력 버퍼 비우기
카메라 %1 초기화: 너비 %2, 높이 %3, 센서 %4
카메라 %1이 열려 있음
카메라 %1 이미지
카메라 %1 수평 미러를 %2로 설정
카메라 %1 수직 뒤집기를 %2로 설정
카메라 %1 해제
온보드 디스플레이 초기화
디스플레이 회전을 %1로 설정
이미지 %1을(를) 디스플레이에 표시
이미지 %1을(를) IDE에 표시
현재 디스플레이 방향
이미지 %1 크기 변경: 너비 %2, 높이 %3
이미지 %1을(를) %2로 변환
이미지 %1 마스크: 하한 %2, 상한 %3
%1의 연결 요소 계산: 연결성 %2
이미지 파일 %1 불러오기
이미지 %1을(를) 파일 %2에 저장
%1에 사각형 그리기: x %2, y %3에서 x %4, y %5까지, 색 %6, 두께 %7
%1에 원 그리기: x %2, y %3, 반지름 %4, 색 %5, 두께 %6
%1에 선 그리기: x %2, y %3에서 x %4, y %5까지, 색 %6, 두께 %7
%2의 x %3, y %4에 텍스트 %1 그리기: 배율 %5, 색 %6, 두께 %7
%1의 QR 코드 디코딩
%1의 바코드 디코딩
AprilTag 검출기 %1 초기화: 패밀리 %2
AprilTag 검출기 %1로 회색조 이미지 %2 검출
AI %1 초기화: 모델 %2, 경로 %3, 크기 %4
얼굴 검출기 %1 초기화: 모델 %2, 앵커 %3, 크기 %4
마스크 검출기 %1 초기화: 검출 모델 %2, 앵커 %3, 크기 %4, 마스크 모델 %5
손 AI %1 초기화: 유형 %2, 검출 모델 %3, 키포인트 모델 %4
OCR %1 초기화: 검출 %2, 인식 %3, 사전 %4, 검출 크기 %5, 인식 너비 %6, 높이 %7
번호판 AI %1 초기화: 검출 %2, 인식 %3, 앵커 %4, 라벨 %5, 검출 크기 %6, 인식 너비 %7, 높이 %8
AI %1을(를) %2에 실행
AI %1을(를) %2에 실행: 신뢰도 %3
AI %1을(를) %2에 실행: 신뢰도 %3, NMS %4
결과 리스트 %1 길이
결과 리스트 %1의 항목 %2
결과 %1의 속성 %2
소켓 %1 초기화: 주소 패밀리 %2, 유형 %3
네트워크 주소: 호스트 %1, 포트 %2
소켓 %1을(를) %2에 연결
소켓 %1을(를) %2에 바인드
소켓 %1 수신 대기: 백로그 %2
소켓 %1에서 연결 수락
소켓 %1로 %2 전송
소켓 %1로 %2바이트 수신
소켓 %1 닫기
MQTT 클라이언트 %1 초기화
MQTT %1을(를) 호스트 %2, 포트 %3에 연결: 킵얼라이브 %4
MQTT %1로 토픽 %2에 메시지 %3 발행
MQTT %1로 토픽 %2 구독
MQTT %1 메시지 루프 계속 실행
MQTT %1 연결 해제
HTTP %1: URL %2, 데이터 %3
HTTP 응답 %1의 속성 %2
현재 디렉터리를 HTTP로 제공: 호스트 %1, 포트 %2
텍스트 파일 %1 읽기
텍스트 파일 %2를 %1 모드로 처리: 내용 %3
경로 %1이 존재함
디렉터리 %1 목록
시스템 명령 %1 실행
WAV 파일 %1 재생
WAV를 %1에 녹음: %2초, 샘플 레이트 %3
QMI8658 IMU %1 초기화: 버스 %2, 주소 %3
IMU %1 6축 값
IMU %1 축 %2
IMU %1 보정: 샘플 수 %2
K230 CPU 온도 °C
K230 고유 칩 ID`),
  de: lines(`
Wenn CyberCAM startet %1 %2
Auf CyberCAM dauerhaft wiederholen %1 %2
%1 Sekunden warten
%1 ausgeben
Zahl %1
Text %1
Boolescher Wert %1
Tupel mit %1
Liste mit %1
Variable %1 auf %2 setzen
Variable %1
Wenn %1, dann %2 %3
Für jedes %1 in %2 ausführen %3 %4
GPIO %1 initialisieren: Pin %2, Richtung %3, Pull-Widerstand %4
GPIO %1 auf %2 setzen
Wert von GPIO %1
Onboard-LED auf %1 setzen
Onboard-Taste ist gedrückt
PWM %1 initialisieren: Ziel %2
Frequenz von PWM %1 auf %2 Hz setzen
Tastgrad von PWM %1 auf %2 (0–1) setzen
PWM %1 aktivieren
PWM %1 deaktivieren
PWM %1 schließen
UART %1 initialisieren: Baudrate %2
Verfügbare Bytes an UART %1
%2 Bytes von UART %1 lesen
%2 an UART %1 schreiben
Eingabepuffer von UART %1 leeren
Kamera %1 initialisieren: Breite %2, Höhe %3, Sensor %4
Kamera %1 ist geöffnet
Bild von Kamera %1
Horizontale Spiegelung von Kamera %1 auf %2 setzen
Vertikale Spiegelung von Kamera %1 auf %2 setzen
Kamera %1 freigeben
Onboard-Anzeige initialisieren
Anzeigedrehung auf %1 setzen
Bild %1 auf der Anzeige darstellen
Bild %1 in der IDE darstellen
Aktuelle Anzeigerichtung
Bild %1 auf Breite %2 und Höhe %3 skalieren
Bild %1 mit %2 konvertieren
Maske für Bild %1 mit Untergrenze %2 und Obergrenze %3 erzeugen
Zusammenhängende Komponenten von %1 mit Konnektivität %2 bestimmen
Bilddatei %1 laden
Bild %1 in Datei %2 speichern
Rechteck auf %1 zeichnen: von x %2, y %3 bis x %4, y %5, Farbe %6, Stärke %7
Kreis auf %1 zeichnen: x %2, y %3, Radius %4, Farbe %5, Stärke %6
Linie auf %1 zeichnen: von x %2, y %3 bis x %4, y %5, Farbe %6, Stärke %7
Text %1 auf %2 bei x %3, y %4 zeichnen: Skalierung %5, Farbe %6, Stärke %7
QR-Codes in %1 dekodieren
Barcodes in %1 dekodieren
AprilTag-Detektor %1 initialisieren: Familie %2
Graustufenbild %2 mit AprilTag-Detektor %1 untersuchen
KI %1 initialisieren: Modell %2, Pfad %3, Größe %4
Gesichtsdetektor %1 initialisieren: Modell %2, Anker %3, Größe %4
Maskendetektor %1 initialisieren: Detektionsmodell %2, Anker %3, Größe %4, Maskenmodell %5
Hand-KI %1 initialisieren: Typ %2, Detektionsmodell %3, Schlüsselpunktemodell %4
OCR %1 initialisieren: Detektion %2, Erkennung %3, Wörterbuch %4, Detektionsgröße %5, Erkennungsbreite %6, Höhe %7
Kennzeichen-KI %1 initialisieren: Detektion %2, Erkennung %3, Anker %4, Beschriftungen %5, Detektionsgröße %6, Erkennungsbreite %7, Höhe %8
KI %1 auf %2 ausführen
KI %1 auf %2 ausführen: Konfidenz %3
KI %1 auf %2 ausführen: Konfidenz %3, NMS %4
Länge der Ergebnisliste %1
Eintrag %2 der Ergebnisliste %1
Eigenschaft %2 von Ergebnis %1
Socket %1 initialisieren: Adressfamilie %2, Typ %3
Netzwerkadresse: Host %1, Port %2
Socket %1 mit %2 verbinden
Socket %1 an %2 binden
Socket %1 lauschen lassen: Rückstau %2
Verbindung an Socket %1 annehmen
%2 über Socket %1 senden
%2 Bytes über Socket %1 empfangen
Socket %1 schließen
MQTT-Client %1 initialisieren
MQTT %1 mit Host %2 und Port %3 verbinden: Keepalive %4
Mit MQTT %1 Nachricht %3 an Thema %2 veröffentlichen
Mit MQTT %1 Thema %2 abonnieren
Nachrichtenschleife von MQTT %1 dauerhaft ausführen
MQTT %1 trennen
HTTP %1: URL %2, Daten %3
Eigenschaft %2 der HTTP-Antwort %1
Aktuelles Verzeichnis über HTTP bereitstellen: Host %1, Port %2
Textdatei %1 lesen
Textdatei %2 im Modus %1 verarbeiten: Inhalt %3
Pfad %1 ist vorhanden
Verzeichnis %1 auflisten
Systembefehl %1 ausführen
WAV-Datei %1 abspielen
WAV nach %1 aufnehmen: %2 Sekunden, Abtastrate %3
QMI8658-IMU %1 initialisieren: Bus %2, Adresse %3
Sechsachsenwerte von IMU %1
Achse %2 von IMU %1
IMU %1 kalibrieren: %2 Abtastwerte
K230-CPU-Temperatur °C
Eindeutige K230-Chip-ID`),
  fr: lines(`
Au démarrage de CyberCAM %1 %2
Répéter indéfiniment sur CyberCAM %1 %2
Attendre %1 secondes
Afficher %1
Nombre %1
Texte %1
Booléen %1
Tuple contenant %1
Liste contenant %1
Définir la variable %1 sur %2
Variable %1
Si %1, alors exécuter %2 %3
Pour chaque %1 dans %2, exécuter %3 %4
Initialiser GPIO %1 : broche %2, direction %3, tirage %4
Définir GPIO %1 sur %2
Valeur de GPIO %1
Définir la LED intégrée sur %1
Le bouton intégré est enfoncé
Initialiser PWM %1 : cible %2
Définir la fréquence de PWM %1 sur %2 Hz
Définir le rapport cyclique de PWM %1 sur %2 (0–1)
Activer PWM %1
Désactiver PWM %1
Fermer PWM %1
Initialiser UART %1 : débit %2
Octets disponibles sur UART %1
Lire %2 octets depuis UART %1
Écrire %2 sur UART %1
Vider le tampon d’entrée de UART %1
Initialiser la caméra %1 : largeur %2, hauteur %3, capteur %4
La caméra %1 est ouverte
Image de la caméra %1
Définir le miroir horizontal de la caméra %1 sur %2
Définir le retournement vertical de la caméra %1 sur %2
Libérer la caméra %1
Initialiser l’écran intégré
Définir la rotation de l’écran sur %1
Afficher l’image %1 sur l’écran
Afficher l’image %1 dans l’IDE
Orientation actuelle de l’écran
Redimensionner l’image %1 à la largeur %2 et la hauteur %3
Convertir l’image %1 avec %2
Masquer l’image %1 avec la borne basse %2 et la borne haute %3
Composantes connexes de %1 avec une connectivité de %2
Charger le fichier image %1
Enregistrer l’image %1 dans le fichier %2
Tracer un rectangle sur %1 : de x %2, y %3 à x %4, y %5, couleur %6, épaisseur %7
Tracer un cercle sur %1 : x %2, y %3, rayon %4, couleur %5, épaisseur %6
Tracer une ligne sur %1 : de x %2, y %3 à x %4, y %5, couleur %6, épaisseur %7
Tracer le texte %1 sur %2 à x %3, y %4 : échelle %5, couleur %6, épaisseur %7
Décoder les codes QR dans %1
Décoder les codes-barres dans %1
Initialiser le détecteur AprilTag %1 : famille %2
Détecter l’image en niveaux de gris %2 avec le détecteur AprilTag %1
Initialiser l’IA %1 : modèle %2, chemin %3, taille %4
Initialiser le détecteur de visages %1 : modèle %2, ancres %3, taille %4
Initialiser le détecteur de masques %1 : modèle de détection %2, ancres %3, taille %4, modèle de masque %5
Initialiser l’IA de la main %1 : type %2, modèle de détection %3, modèle de points clés %4
Initialiser OCR %1 : détection %2, reconnaissance %3, dictionnaire %4, taille de détection %5, largeur de reconnaissance %6, hauteur %7
Initialiser l’IA de plaques %1 : détection %2, reconnaissance %3, ancres %4, étiquettes %5, taille de détection %6, largeur de reconnaissance %7, hauteur %8
Exécuter l’IA %1 sur %2
Exécuter l’IA %1 sur %2 : confiance %3
Exécuter l’IA %1 sur %2 : confiance %3, NMS %4
Longueur de la liste de résultats %1
Élément %2 de la liste de résultats %1
Propriété %2 du résultat %1
Initialiser le socket %1 : famille d’adresses %2, type %3
Adresse réseau : hôte %1, port %2
Connecter le socket %1 à %2
Lier le socket %1 à %2
Mettre le socket %1 en écoute : file d’attente %2
Accepter une connexion sur le socket %1
Envoyer %2 via le socket %1
Recevoir %2 octets via le socket %1
Fermer le socket %1
Initialiser le client MQTT %1
Connecter MQTT %1 à l’hôte %2, port %3 : maintien %4
Publier le message %3 sur le sujet %2 avec MQTT %1
Abonner MQTT %1 au sujet %2
Exécuter indéfiniment la boucle de messages MQTT %1
Déconnecter MQTT %1
HTTP %1 : URL %2, données %3
Propriété %2 de la réponse HTTP %1
Servir le répertoire actuel en HTTP : hôte %1, port %2
Lire le fichier texte %1
Traiter le fichier texte %2 en mode %1 : contenu %3
Le chemin %1 existe
Lister le répertoire %1
Exécuter la commande système %1
Lire le fichier WAV %1
Enregistrer un WAV vers %1 : %2 secondes, fréquence d’échantillonnage %3
Initialiser l’IMU QMI8658 %1 : bus %2, adresse %3
Valeurs sur six axes de l’IMU %1
Axe %2 de l’IMU %1
Étalonner l’IMU %1 : %2 échantillons
Température du processeur K230 °C
Identifiant unique de la puce K230`),
  es: lines(`
Al iniciar CyberCAM %1 %2
Repetir siempre en CyberCAM %1 %2
Esperar %1 segundos
Imprimir %1
Número %1
Texto %1
Booleano %1
Tupla que contiene %1
Lista que contiene %1
Establecer la variable %1 en %2
Variable %1
Si %1, ejecutar %2 %3
Para cada %1 en %2, ejecutar %3 %4
Inicializar GPIO %1: pin %2, dirección %3, resistencia %4
Establecer GPIO %1 en %2
Valor de GPIO %1
Establecer el LED integrado en %1
El botón integrado está pulsado
Inicializar PWM %1: destino %2
Establecer la frecuencia de PWM %1 en %2 Hz
Establecer el ciclo de trabajo de PWM %1 en %2 (0–1)
Activar PWM %1
Desactivar PWM %1
Cerrar PWM %1
Inicializar UART %1: velocidad %2
Bytes disponibles en UART %1
Leer %2 bytes de UART %1
Escribir %2 en UART %1
Vaciar el búfer de entrada de UART %1
Inicializar la cámara %1: ancho %2, alto %3, sensor %4
La cámara %1 está abierta
Imagen de la cámara %1
Establecer el espejo horizontal de la cámara %1 en %2
Establecer el volteo vertical de la cámara %1 en %2
Liberar la cámara %1
Inicializar la pantalla integrada
Establecer la rotación de la pantalla en %1
Mostrar la imagen %1 en la pantalla
Mostrar la imagen %1 en el IDE
Orientación actual de la pantalla
Redimensionar la imagen %1 a ancho %2 y alto %3
Convertir la imagen %1 con %2
Crear máscara de la imagen %1 con límite inferior %2 y superior %3
Componentes conectados de %1 con conectividad %2
Cargar el archivo de imagen %1
Guardar la imagen %1 en el archivo %2
Dibujar un rectángulo en %1: de x %2, y %3 a x %4, y %5, color %6, grosor %7
Dibujar un círculo en %1: x %2, y %3, radio %4, color %5, grosor %6
Dibujar una línea en %1: de x %2, y %3 a x %4, y %5, color %6, grosor %7
Dibujar el texto %1 en %2, x %3, y %4: escala %5, color %6, grosor %7
Decodificar códigos QR en %1
Decodificar códigos de barras en %1
Inicializar el detector AprilTag %1: familia %2
Detectar la imagen en gris %2 con el detector AprilTag %1
Inicializar la IA %1: modelo %2, ruta %3, tamaño %4
Inicializar el detector facial %1: modelo %2, anclas %3, tamaño %4
Inicializar el detector de mascarillas %1: modelo de detección %2, anclas %3, tamaño %4, modelo de mascarilla %5
Inicializar la IA de manos %1: tipo %2, modelo de detección %3, modelo de puntos clave %4
Inicializar OCR %1: detección %2, reconocimiento %3, diccionario %4, tamaño de detección %5, ancho de reconocimiento %6, alto %7
Inicializar la IA de matrículas %1: detección %2, reconocimiento %3, anclas %4, etiquetas %5, tamaño de detección %6, ancho de reconocimiento %7, alto %8
Ejecutar la IA %1 sobre %2
Ejecutar la IA %1 sobre %2: confianza %3
Ejecutar la IA %1 sobre %2: confianza %3, NMS %4
Longitud de la lista de resultados %1
Elemento %2 de la lista de resultados %1
Propiedad %2 del resultado %1
Inicializar el socket %1: familia de direcciones %2, tipo %3
Dirección de red: host %1, puerto %2
Conectar el socket %1 a %2
Vincular el socket %1 a %2
Poner el socket %1 a escuchar: cola %2
Aceptar una conexión en el socket %1
Enviar %2 mediante el socket %1
Recibir %2 bytes mediante el socket %1
Cerrar el socket %1
Inicializar el cliente MQTT %1
Conectar MQTT %1 al host %2, puerto %3: mantenimiento %4
Publicar el mensaje %3 en el tema %2 con MQTT %1
Suscribir MQTT %1 al tema %2
Ejecutar siempre el bucle de mensajes MQTT %1
Desconectar MQTT %1
HTTP %1: URL %2, datos %3
Propiedad %2 de la respuesta HTTP %1
Servir el directorio actual por HTTP: host %1, puerto %2
Leer el archivo de texto %1
Procesar el archivo de texto %2 en modo %1: contenido %3
La ruta %1 existe
Listar el directorio %1
Ejecutar el comando del sistema %1
Reproducir el archivo WAV %1
Grabar WAV en %1: %2 segundos, frecuencia de muestreo %3
Inicializar la IMU QMI8658 %1: bus %2, dirección %3
Valores de seis ejes de la IMU %1
Eje %2 de la IMU %1
Calibrar la IMU %1: %2 muestras
Temperatura de la CPU K230 °C
ID único del chip K230`),
  pt: lines(`
Ao iniciar o CyberCAM %1 %2
Repetir continuamente no CyberCAM %1 %2
Aguardar %1 segundos
Imprimir %1
Número %1
Texto %1
Booleano %1
Tupla contendo %1
Lista contendo %1
Definir a variável %1 como %2
Variável %1
Se %1, executar %2 %3
Para cada %1 em %2, executar %3 %4
Inicializar GPIO %1: pino %2, direção %3, resistor %4
Definir GPIO %1 como %2
Valor de GPIO %1
Definir o LED integrado como %1
O botão integrado está pressionado
Inicializar PWM %1: destino %2
Definir a frequência de PWM %1 como %2 Hz
Definir o ciclo de trabalho de PWM %1 como %2 (0–1)
Ativar PWM %1
Desativar PWM %1
Fechar PWM %1
Inicializar UART %1: taxa %2
Bytes disponíveis na UART %1
Ler %2 bytes da UART %1
Escrever %2 na UART %1
Limpar o buffer de entrada da UART %1
Inicializar a câmera %1: largura %2, altura %3, sensor %4
A câmera %1 está aberta
Imagem da câmera %1
Definir o espelhamento horizontal da câmera %1 como %2
Definir a inversão vertical da câmera %1 como %2
Liberar a câmera %1
Inicializar a tela integrada
Definir a rotação da tela como %1
Mostrar a imagem %1 na tela
Mostrar a imagem %1 no IDE
Orientação atual da tela
Redimensionar a imagem %1 para largura %2 e altura %3
Converter a imagem %1 com %2
Criar máscara da imagem %1 com limite inferior %2 e superior %3
Componentes conectados de %1 com conectividade %2
Carregar o arquivo de imagem %1
Salvar a imagem %1 no arquivo %2
Desenhar retângulo em %1: de x %2, y %3 até x %4, y %5, cor %6, espessura %7
Desenhar círculo em %1: x %2, y %3, raio %4, cor %5, espessura %6
Desenhar linha em %1: de x %2, y %3 até x %4, y %5, cor %6, espessura %7
Desenhar o texto %1 em %2, x %3, y %4: escala %5, cor %6, espessura %7
Decodificar códigos QR em %1
Decodificar códigos de barras em %1
Inicializar o detector AprilTag %1: família %2
Detectar a imagem em tons de cinza %2 com o detector AprilTag %1
Inicializar a IA %1: modelo %2, caminho %3, tamanho %4
Inicializar o detector facial %1: modelo %2, âncoras %3, tamanho %4
Inicializar o detector de máscaras %1: modelo de detecção %2, âncoras %3, tamanho %4, modelo de máscara %5
Inicializar a IA de mãos %1: tipo %2, modelo de detecção %3, modelo de pontos-chave %4
Inicializar OCR %1: detecção %2, reconhecimento %3, dicionário %4, tamanho de detecção %5, largura de reconhecimento %6, altura %7
Inicializar a IA de placas %1: detecção %2, reconhecimento %3, âncoras %4, rótulos %5, tamanho de detecção %6, largura de reconhecimento %7, altura %8
Executar a IA %1 em %2
Executar a IA %1 em %2: confiança %3
Executar a IA %1 em %2: confiança %3, NMS %4
Comprimento da lista de resultados %1
Item %2 da lista de resultados %1
Propriedade %2 do resultado %1
Inicializar o socket %1: família de endereços %2, tipo %3
Endereço de rede: host %1, porta %2
Conectar o socket %1 a %2
Vincular o socket %1 a %2
Colocar o socket %1 em escuta: fila %2
Aceitar uma conexão no socket %1
Enviar %2 pelo socket %1
Receber %2 bytes pelo socket %1
Fechar o socket %1
Inicializar o cliente MQTT %1
Conectar MQTT %1 ao host %2, porta %3: manutenção %4
Publicar a mensagem %3 no tópico %2 com MQTT %1
Assinar o tópico %2 com MQTT %1
Executar continuamente o loop de mensagens MQTT %1
Desconectar MQTT %1
HTTP %1: URL %2, dados %3
Propriedade %2 da resposta HTTP %1
Servir o diretório atual por HTTP: host %1, porta %2
Ler o arquivo de texto %1
Processar o arquivo de texto %2 no modo %1: conteúdo %3
O caminho %1 existe
Listar o diretório %1
Executar o comando do sistema %1
Reproduzir o arquivo WAV %1
Gravar WAV em %1: %2 segundos, taxa de amostragem %3
Inicializar a IMU QMI8658 %1: barramento %2, endereço %3
Valores de seis eixos da IMU %1
Eixo %2 da IMU %1
Calibrar a IMU %1: %2 amostras
Temperatura da CPU K230 °C
ID exclusivo do chip K230`),
  ru: lines(`
При запуске CyberCAM %1 %2
Повторять всегда на CyberCAM %1 %2
Ждать %1 секунд
Вывести %1
Число %1
Текст %1
Логическое значение %1
Кортеж с элементами %1
Список с элементами %1
Задать переменной %1 значение %2
Переменная %1
Если %1, выполнить %2 %3
Для каждого %1 в %2 выполнить %3 %4
Инициализировать GPIO %1: вывод %2, направление %3, подтяжка %4
Задать GPIO %1 значение %2
Значение GPIO %1
Задать встроенному светодиоду значение %1
Встроенная кнопка нажата
Инициализировать PWM %1: назначение %2
Задать частоту PWM %1 равной %2 Гц
Задать коэффициент заполнения PWM %1 равным %2 (0–1)
Включить PWM %1
Выключить PWM %1
Закрыть PWM %1
Инициализировать UART %1: скорость %2
Доступно байтов в UART %1
Прочитать %2 байтов из UART %1
Записать %2 в UART %1
Очистить входной буфер UART %1
Инициализировать камеру %1: ширина %2, высота %3, датчик %4
Камера %1 открыта
Изображение камеры %1
Задать горизонтальное отражение камеры %1 равным %2
Задать вертикальный переворот камеры %1 равным %2
Освободить камеру %1
Инициализировать встроенный экран
Задать поворот экрана %1
Показать изображение %1 на экране
Показать изображение %1 в IDE
Текущая ориентация экрана
Изменить размер изображения %1: ширина %2, высота %3
Преобразовать изображение %1 с помощью %2
Создать маску изображения %1 с нижней границей %2 и верхней %3
Связные компоненты %1 со связностью %2
Загрузить файл изображения %1
Сохранить изображение %1 в файл %2
Нарисовать прямоугольник на %1: от x %2, y %3 до x %4, y %5, цвет %6, толщина %7
Нарисовать окружность на %1: x %2, y %3, радиус %4, цвет %5, толщина %6
Нарисовать линию на %1: от x %2, y %3 до x %4, y %5, цвет %6, толщина %7
Нарисовать текст %1 на %2 в x %3, y %4: масштаб %5, цвет %6, толщина %7
Декодировать QR-коды в %1
Декодировать штрихкоды в %1
Инициализировать детектор AprilTag %1: семейство %2
Обнаружить метки на полутоновом изображении %2 детектором AprilTag %1
Инициализировать ИИ %1: модель %2, путь %3, размер %4
Инициализировать детектор лиц %1: модель %2, якоря %3, размер %4
Инициализировать детектор масок %1: модель обнаружения %2, якоря %3, размер %4, модель маски %5
Инициализировать ИИ руки %1: тип %2, модель обнаружения %3, модель ключевых точек %4
Инициализировать OCR %1: обнаружение %2, распознавание %3, словарь %4, размер обнаружения %5, ширина распознавания %6, высота %7
Инициализировать ИИ номеров %1: обнаружение %2, распознавание %3, якоря %4, метки %5, размер обнаружения %6, ширина распознавания %7, высота %8
Запустить ИИ %1 на %2
Запустить ИИ %1 на %2: достоверность %3
Запустить ИИ %1 на %2: достоверность %3, NMS %4
Длина списка результатов %1
Элемент %2 списка результатов %1
Свойство %2 результата %1
Инициализировать сокет %1: семейство адресов %2, тип %3
Сетевой адрес: узел %1, порт %2
Подключить сокет %1 к %2
Привязать сокет %1 к %2
Перевести сокет %1 в режим прослушивания: очередь %2
Принять соединение на сокете %1
Отправить %2 через сокет %1
Получить %2 байтов через сокет %1
Закрыть сокет %1
Инициализировать клиент MQTT %1
Подключить MQTT %1 к узлу %2, порт %3: интервал поддержки %4
Опубликовать сообщение %3 в теме %2 через MQTT %1
Подписать MQTT %1 на тему %2
Постоянно выполнять цикл сообщений MQTT %1
Отключить MQTT %1
HTTP %1: URL %2, данные %3
Свойство %2 ответа HTTP %1
Раздавать текущий каталог по HTTP: узел %1, порт %2
Прочитать текстовый файл %1
Обработать текстовый файл %2 в режиме %1: содержимое %3
Путь %1 существует
Показать содержимое каталога %1
Выполнить системную команду %1
Воспроизвести файл WAV %1
Записать WAV в %1: %2 секунд, частота дискретизации %3
Инициализировать IMU QMI8658 %1: шина %2, адрес %3
Шестиосевые значения IMU %1
Ось %2 IMU %1
Калибровать IMU %1: %2 отсчётов
Температура процессора K230 °C
Уникальный идентификатор чипа K230`),
  ar: lines(`
عند بدء CyberCAM %1 %2
التكرار دائمًا على CyberCAM %1 %2
الانتظار %1 ثانية
طباعة %1
رقم %1
نص %1
قيمة منطقية %1
صف يحتوي على %1
قائمة تحتوي على %1
ضبط المتغير %1 على %2
المتغير %1
إذا كان %1 فنفّذ %2 %3
لكل %1 في %2 نفّذ %3 %4
تهيئة GPIO %1: الطرف %2، الاتجاه %3، المقاومة %4
ضبط GPIO %1 على %2
قيمة GPIO %1
ضبط LED المدمج على %1
الزر المدمج مضغوط
تهيئة PWM %1: الهدف %2
ضبط تردد PWM %1 على %2 Hz
ضبط دورة عمل PWM %1 على %2 (0–1)
تمكين PWM %1
تعطيل PWM %1
إغلاق PWM %1
تهيئة UART %1: معدل البث %2
البايتات المتاحة في UART %1
قراءة %2 بايت من UART %1
كتابة %2 إلى UART %1
مسح مخزن إدخال UART %1
تهيئة الكاميرا %1: العرض %2، الارتفاع %3، المستشعر %4
الكاميرا %1 مفتوحة
صورة الكاميرا %1
ضبط الانعكاس الأفقي للكاميرا %1 على %2
ضبط القلب الرأسي للكاميرا %1 على %2
تحرير الكاميرا %1
تهيئة الشاشة المدمجة
ضبط تدوير الشاشة على %1
عرض الصورة %1 على الشاشة
عرض الصورة %1 في IDE
اتجاه الشاشة الحالي
تغيير حجم الصورة %1 إلى العرض %2 والارتفاع %3
تحويل الصورة %1 باستخدام %2
إنشاء قناع للصورة %1 بالحد الأدنى %2 والأعلى %3
المكونات المتصلة في %1 باتصال %2
تحميل ملف الصورة %1
حفظ الصورة %1 في الملف %2
رسم مستطيل على %1: من x %2 وy %3 إلى x %4 وy %5، اللون %6، السماكة %7
رسم دائرة على %1: x %2، y %3، نصف القطر %4، اللون %5، السماكة %6
رسم خط على %1: من x %2 وy %3 إلى x %4 وy %5، اللون %6، السماكة %7
رسم النص %1 على %2 عند x %3 وy %4: المقياس %5، اللون %6، السماكة %7
فك رموز QR في %1
فك الرموز الشريطية في %1
تهيئة كاشف AprilTag %1: العائلة %2
الكشف في الصورة الرمادية %2 باستخدام كاشف AprilTag %1
تهيئة الذكاء الاصطناعي %1: النموذج %2، المسار %3، الحجم %4
تهيئة كاشف الوجوه %1: النموذج %2، المراسي %3، الحجم %4
تهيئة كاشف الأقنعة %1: نموذج الكشف %2، المراسي %3، الحجم %4، نموذج القناع %5
تهيئة ذكاء اليد %1: النوع %2، نموذج الكشف %3، نموذج النقاط الرئيسية %4
تهيئة OCR %1: الكشف %2، التعرف %3، القاموس %4، حجم الكشف %5، عرض التعرف %6، الارتفاع %7
تهيئة ذكاء لوحات المركبات %1: الكشف %2، التعرف %3، المراسي %4، التسميات %5، حجم الكشف %6، عرض التعرف %7، الارتفاع %8
تشغيل الذكاء الاصطناعي %1 على %2
تشغيل الذكاء الاصطناعي %1 على %2: الثقة %3
تشغيل الذكاء الاصطناعي %1 على %2: الثقة %3، NMS %4
طول قائمة النتائج %1
العنصر %2 من قائمة النتائج %1
الخاصية %2 من النتيجة %1
تهيئة المقبس %1: عائلة العناوين %2، النوع %3
عنوان الشبكة: المضيف %1، المنفذ %2
توصيل المقبس %1 إلى %2
ربط المقبس %1 بالعنوان %2
جعل المقبس %1 يستمع: قائمة الانتظار %2
قبول اتصال على المقبس %1
إرسال %2 عبر المقبس %1
استقبال %2 بايت عبر المقبس %1
إغلاق المقبس %1
تهيئة عميل MQTT %1
توصيل MQTT %1 بالمضيف %2 والمنفذ %3: الإبقاء %4
نشر الرسالة %3 في الموضوع %2 عبر MQTT %1
اشتراك MQTT %1 في الموضوع %2
تشغيل حلقة رسائل MQTT %1 دائمًا
قطع اتصال MQTT %1
HTTP %1: الرابط %2، البيانات %3
الخاصية %2 من استجابة HTTP %1
تقديم المجلد الحالي عبر HTTP: المضيف %1، المنفذ %2
قراءة الملف النصي %1
معالجة الملف النصي %2 بالوضع %1: المحتوى %3
المسار %1 موجود
سرد المجلد %1
تشغيل أمر النظام %1
تشغيل ملف WAV %1
تسجيل WAV إلى %1: المدة %2 ثانية، معدل العينة %3
تهيئة IMU QMI8658 %1: الناقل %2، العنوان %3
قيم المحاور الستة لـ IMU %1
المحور %2 من IMU %1
معايرة IMU %1: عدد العينات %2
درجة حرارة معالج K230 °C
معرّف شريحة K230 الفريد`),
};

const additionalMessages = {
  zh_cn: {
    cybercam_gpio_deinit: '反初始化 GPIO %1',
    cybercam_uart_close: '关闭 UART %1',
    cybercam_mqtt_on_message: '当 MQTT %1 收到消息，将主题存入 %2、载荷存入 %3，执行 %4 %5',
    cybercam_imu_close: '关闭 IMU %1',
  },
  zh_hk: {
    cybercam_gpio_deinit: '解除初始化 GPIO %1',
    cybercam_uart_close: '關閉 UART %1',
    cybercam_mqtt_on_message: '當 MQTT %1 收到訊息，將主題存入 %2、酬載存入 %3，執行 %4 %5',
    cybercam_imu_close: '關閉 IMU %1',
  },
  ja: {
    cybercam_gpio_deinit: 'GPIO %1 を初期化解除',
    cybercam_uart_close: 'UART %1 を閉じる',
    cybercam_mqtt_on_message: 'MQTT %1 がメッセージを受信したらトピックを %2、ペイロードを %3 にして実行 %4 %5',
    cybercam_imu_close: 'IMU %1 を閉じる',
  },
  ko: {
    cybercam_gpio_deinit: 'GPIO %1 초기화 해제',
    cybercam_uart_close: 'UART %1 닫기',
    cybercam_mqtt_on_message: 'MQTT %1 메시지 수신 시 주제를 %2, 페이로드를 %3에 저장하고 실행 %4 %5',
    cybercam_imu_close: 'IMU %1 닫기',
  },
  de: {
    cybercam_gpio_deinit: 'GPIO %1 deinitialisieren',
    cybercam_uart_close: 'UART %1 schließen',
    cybercam_mqtt_on_message: 'wenn MQTT %1 eine Nachricht empfängt, Thema %2 und Nutzlast %3 setzen, dann %4 %5',
    cybercam_imu_close: 'IMU %1 schließen',
  },
  fr: {
    cybercam_gpio_deinit: 'désinitialiser le GPIO %1',
    cybercam_uart_close: 'fermer l’UART %1',
    cybercam_mqtt_on_message: 'quand MQTT %1 reçoit un message, définir le sujet %2 et la charge %3 puis faire %4 %5',
    cybercam_imu_close: 'fermer l’IMU %1',
  },
  es: {
    cybercam_gpio_deinit: 'desinicializar GPIO %1',
    cybercam_uart_close: 'cerrar UART %1',
    cybercam_mqtt_on_message: 'cuando MQTT %1 reciba un mensaje, guardar tema %2 y carga %3 y ejecutar %4 %5',
    cybercam_imu_close: 'cerrar IMU %1',
  },
  pt: {
    cybercam_gpio_deinit: 'desinicializar GPIO %1',
    cybercam_uart_close: 'fechar UART %1',
    cybercam_mqtt_on_message: 'quando MQTT %1 receber mensagem, definir tópico %2 e carga %3 e executar %4 %5',
    cybercam_imu_close: 'fechar IMU %1',
  },
  ru: {
    cybercam_gpio_deinit: 'деинициализировать GPIO %1',
    cybercam_uart_close: 'закрыть UART %1',
    cybercam_mqtt_on_message: 'когда MQTT %1 получает сообщение, записать тему в %2, данные в %3 и выполнить %4 %5',
    cybercam_imu_close: 'закрыть IMU %1',
  },
  ar: {
    cybercam_gpio_deinit: 'إلغاء تهيئة GPIO %1',
    cybercam_uart_close: 'إغلاق UART %1',
    cybercam_mqtt_on_message: 'عند استلام MQTT %1 رسالة، خزّن الموضوع في %2 والحمولة في %3 ثم نفّذ %4 %5',
    cybercam_imu_close: 'إغلاق IMU %1',
  },
};

const dropdownLabels = {
  zh_cn: { true: '真', false: '假', input: '输入', output: '输出', none: '无', up: '上拉', down: '下拉', 'fill light / PWM2': '补光灯 / PWM2', 'buzzer / PWM3': '蜂鸣器 / PWM3', 'backlight / PWM5': '背光 / PWM5', 'onboard CSI2': '板载 CSI2', default: '默认', 'BGR to gray': 'BGR 转灰度', 'BGR to LAB': 'BGR 转 LAB', 'BGR to RGB': 'BGR 转 RGB', 'gray to BGR': '灰度转 BGR', 'Fall detection': '跌倒检测', 'Hand detection': '手部检测', 'Person detection': '人员检测', 'Person keypoints': '人体关键点', 'Smoke detection': '烟雾检测', 'Traffic light': '交通灯检测', 'YOLO11 classification': 'YOLO11 分类', 'YOLO11 detection': 'YOLO11 检测', keypoints: '关键点', 'gesture classification': '手势分类', confidence: '置信度', width: '宽度', height: '高度', label: '标签', text: '文本', corners: '角点', 'status code': '状态码', write: '写入', append: '追加', 'acceleration X (g)': '加速度 X（g）', 'acceleration Y (g)': '加速度 Y（g）', 'acceleration Z (g)': '加速度 Z（g）', 'gyro X (dps)': '陀螺仪 X（dps）', 'gyro Y (dps)': '陀螺仪 Y（dps）', 'gyro Z (dps)': '陀螺仪 Z（dps）' },
  zh_hk: { true: '真', false: '假', input: '輸入', output: '輸出', none: '無', up: '上拉', down: '下拉', 'fill light / PWM2': '補光燈 / PWM2', 'buzzer / PWM3': '蜂鳴器 / PWM3', 'backlight / PWM5': '背光 / PWM5', 'onboard CSI2': '板載 CSI2', default: '預設', 'BGR to gray': 'BGR 轉灰階', 'BGR to LAB': 'BGR 轉 LAB', 'BGR to RGB': 'BGR 轉 RGB', 'gray to BGR': '灰階轉 BGR', 'Fall detection': '跌倒偵測', 'Hand detection': '手部偵測', 'Person detection': '人員偵測', 'Person keypoints': '人體關鍵點', 'Smoke detection': '煙霧偵測', 'Traffic light': '交通燈偵測', 'YOLO11 classification': 'YOLO11 分類', 'YOLO11 detection': 'YOLO11 偵測', keypoints: '關鍵點', 'gesture classification': '手勢分類', confidence: '信心度', width: '寬度', height: '高度', label: '標籤', text: '文字', corners: '角點', 'status code': '狀態碼', write: '寫入', append: '附加', 'acceleration X (g)': '加速度 X（g）', 'acceleration Y (g)': '加速度 Y（g）', 'acceleration Z (g)': '加速度 Z（g）', 'gyro X (dps)': '陀螺儀 X（dps）', 'gyro Y (dps)': '陀螺儀 Y（dps）', 'gyro Z (dps)': '陀螺儀 Z（dps）' },
  ja: { true: '真', false: '偽', input: '入力', output: '出力', none: 'なし', up: 'プルアップ', down: 'プルダウン', 'fill light / PWM2': '補助灯 / PWM2', 'buzzer / PWM3': 'ブザー / PWM3', 'backlight / PWM5': 'バックライト / PWM5', 'onboard CSI2': 'オンボード CSI2', default: '既定', 'BGR to gray': 'BGR からグレー', 'BGR to LAB': 'BGR から LAB', 'BGR to RGB': 'BGR から RGB', 'gray to BGR': 'グレーから BGR', 'Fall detection': '転倒検出', 'Hand detection': '手検出', 'Person detection': '人物検出', 'Person keypoints': '人物キーポイント', 'Smoke detection': '煙検出', 'Traffic light': '信号機検出', 'YOLO11 classification': 'YOLO11 分類', 'YOLO11 detection': 'YOLO11 検出', keypoints: 'キーポイント', 'gesture classification': 'ジェスチャー分類', confidence: '信頼度', width: '幅', height: '高さ', label: 'ラベル', text: 'テキスト', corners: '頂点', 'status code': 'ステータスコード', write: '書き込み', append: '追記', 'acceleration X (g)': '加速度 X（g）', 'acceleration Y (g)': '加速度 Y（g）', 'acceleration Z (g)': '加速度 Z（g）', 'gyro X (dps)': 'ジャイロ X（dps）', 'gyro Y (dps)': 'ジャイロ Y（dps）', 'gyro Z (dps)': 'ジャイロ Z（dps）' },
  ko: { true: '참', false: '거짓', input: '입력', output: '출력', none: '없음', up: '풀업', down: '풀다운', 'fill light / PWM2': '보조광 / PWM2', 'buzzer / PWM3': '부저 / PWM3', 'backlight / PWM5': '백라이트 / PWM5', 'onboard CSI2': '온보드 CSI2', default: '기본값', 'BGR to gray': 'BGR에서 회색조', 'BGR to LAB': 'BGR에서 LAB', 'BGR to RGB': 'BGR에서 RGB', 'gray to BGR': '회색조에서 BGR', 'Fall detection': '낙상 검출', 'Hand detection': '손 검출', 'Person detection': '사람 검출', 'Person keypoints': '사람 키포인트', 'Smoke detection': '연기 검출', 'Traffic light': '신호등 검출', 'YOLO11 classification': 'YOLO11 분류', 'YOLO11 detection': 'YOLO11 검출', keypoints: '키포인트', 'gesture classification': '제스처 분류', confidence: '신뢰도', width: '너비', height: '높이', label: '라벨', text: '텍스트', corners: '모서리', 'status code': '상태 코드', write: '쓰기', append: '추가', 'acceleration X (g)': '가속도 X(g)', 'acceleration Y (g)': '가속도 Y(g)', 'acceleration Z (g)': '가속도 Z(g)', 'gyro X (dps)': '자이로 X(dps)', 'gyro Y (dps)': '자이로 Y(dps)', 'gyro Z (dps)': '자이로 Z(dps)' },
};

const westernDropdownWords = {
  de: ['wahr', 'falsch', 'Eingang', 'Ausgang', 'keiner', 'Pull-up', 'Pull-down', 'Fülllicht', 'Summer', 'Hintergrundbeleuchtung', 'integriert', 'Standard', 'Sturzerkennung', 'Handerkennung', 'Personenerkennung', 'Körperpunkte', 'Raucherkennung', 'Ampelerkennung', 'Klassifikation', 'Erkennung', 'Schlüsselpunkte', 'Gestenklassifikation', 'Konfidenz', 'Breite', 'Höhe', 'Beschriftung', 'Text', 'Ecken', 'Statuscode', 'schreiben', 'anhängen', 'Beschleunigung', 'Gyroskop'],
  fr: ['vrai', 'faux', 'entrée', 'sortie', 'aucun', 'tirage haut', 'tirage bas', 'éclairage', 'buzzer', 'rétroéclairage', 'intégré', 'par défaut', 'détection de chute', 'détection de main', 'détection de personne', 'points du corps', 'détection de fumée', 'feu tricolore', 'classification', 'détection', 'points clés', 'classification des gestes', 'confiance', 'largeur', 'hauteur', 'étiquette', 'texte', 'coins', 'code d’état', 'écrire', 'ajouter', 'accélération', 'gyroscope'],
  es: ['verdadero', 'falso', 'entrada', 'salida', 'ninguno', 'pull-up', 'pull-down', 'luz de relleno', 'zumbador', 'retroiluminación', 'integrado', 'predeterminado', 'detección de caídas', 'detección de manos', 'detección de personas', 'puntos corporales', 'detección de humo', 'semáforo', 'clasificación', 'detección', 'puntos clave', 'clasificación de gestos', 'confianza', 'ancho', 'alto', 'etiqueta', 'texto', 'esquinas', 'código de estado', 'escribir', 'añadir', 'aceleración', 'giroscopio'],
  pt: ['verdadeiro', 'falso', 'entrada', 'saída', 'nenhum', 'pull-up', 'pull-down', 'luz de preenchimento', 'buzzer', 'luz de fundo', 'integrado', 'padrão', 'detecção de queda', 'detecção de mão', 'detecção de pessoa', 'pontos do corpo', 'detecção de fumaça', 'semáforo', 'classificação', 'detecção', 'pontos-chave', 'classificação de gestos', 'confiança', 'largura', 'altura', 'rótulo', 'texto', 'cantos', 'código de status', 'escrever', 'acrescentar', 'aceleração', 'giroscópio'],
  ru: ['истина', 'ложь', 'вход', 'выход', 'нет', 'подтяжка вверх', 'подтяжка вниз', 'подсветка', 'зуммер', 'подсветка экрана', 'встроенный', 'по умолчанию', 'обнаружение падения', 'обнаружение руки', 'обнаружение человека', 'ключевые точки тела', 'обнаружение дыма', 'светофор', 'классификация', 'обнаружение', 'ключевые точки', 'классификация жестов', 'достоверность', 'ширина', 'высота', 'метка', 'текст', 'углы', 'код состояния', 'записать', 'добавить', 'ускорение', 'гироскоп'],
  ar: ['صحيح', 'خطأ', 'إدخال', 'إخراج', 'بلا', 'رفع', 'خفض', 'ضوء تعبئة', 'طنان', 'إضاءة خلفية', 'مدمج', 'افتراضي', 'كشف السقوط', 'كشف اليد', 'كشف الشخص', 'نقاط الجسم', 'كشف الدخان', 'إشارة المرور', 'تصنيف', 'كشف', 'نقاط رئيسية', 'تصنيف الإيماءات', 'الثقة', 'العرض', 'الارتفاع', 'التسمية', 'النص', 'الزوايا', 'رمز الحالة', 'كتابة', 'إلحاق', 'التسارع', 'الجيروسكوب'],
};

function buildWesternDropdownMap(locale) {
  const w = westernDropdownWords[locale];
  const grayscale = { de: 'Graustufen', fr: 'niveaux de gris', es: 'escala de grises', pt: 'tons de cinza', ru: 'оттенки серого', ar: 'تدرج رمادي' }[locale];
  return {
    true: w[0], false: w[1], input: w[2], output: w[3], none: w[4], up: w[5], down: w[6],
    'fill light / PWM2': `${w[7]} / PWM2`, 'buzzer / PWM3': `${w[8]} / PWM3`, 'backlight / PWM5': `${w[9]} / PWM5`,
    'onboard CSI2': `${w[10]} CSI2`, default: w[11], 'BGR to gray': `BGR → ${grayscale}`, 'BGR to LAB': 'BGR → LAB', 'BGR to RGB': 'BGR → RGB', 'gray to BGR': `${grayscale} → BGR`,
    'Fall detection': w[12], 'Hand detection': w[13], 'Person detection': w[14], 'Person keypoints': w[15], 'Smoke detection': w[16], 'Traffic light': w[17],
    'YOLO11 classification': `YOLO11 ${w[18]}`, 'YOLO11 detection': `YOLO11 ${w[19]}`, keypoints: w[20], 'gesture classification': w[21], confidence: w[22], width: w[23], height: w[24], label: w[25], text: w[26], corners: w[27], 'status code': w[28], write: w[29], append: w[30],
    'acceleration X (g)': `${w[31]} X (g)`, 'acceleration Y (g)': `${w[31]} Y (g)`, 'acceleration Z (g)': `${w[31]} Z (g)`, 'gyro X (dps)': `${w[32]} X (dps)`, 'gyro Y (dps)': `${w[32]} Y (dps)`, 'gyro Z (dps)': `${w[32]} Z (dps)`,
  };
}

function localizedMessages(locale, blocks) {
  if (!messages[locale]) throw new Error(`Missing message catalog for ${locale}`);
  const resultProperty = blocks.find((block) => block.type === 'cybercam_result_property');
  const propertyField = resultProperty?.args0?.find((arg) => arg.name === 'PROPERTY');
  if (!propertyField || !Array.isArray(propertyField.options)) {
    throw new Error('Missing cybercam_result_property PROPERTY dropdown');
  }
  const existingValues = new Set(propertyField.options.map((option) => option[1]));
  for (const option of faceLandmarkOptions) {
    if (!existingValues.has(option[1])) propertyField.options.push(option);
  }
  let legacyIndex = 0;
  const translated = blocks.map((block) => {
    const added = additionalMessages[locale]?.[block.type];
    return added || messages[locale][legacyIndex++];
  });
  if (legacyIndex !== messages[locale].length) {
    throw new Error(`${locale} used ${legacyIndex} legacy messages; expected ${messages[locale].length}`);
  }
  return translated;
}

function localizeDropdown(locale, label) {
  const landmarkIndex = faceLandmarkOptions.findIndex((option) => option[0] === label);
  if (landmarkIndex >= 0) return faceLandmarkLabels[locale]?.[landmarkIndex] || label;
  const map = dropdownLabels[locale] || buildWesternDropdownMap(locale);
  return map[label] || label;
}

module.exports = { localizedMessages, localizeDropdown };
