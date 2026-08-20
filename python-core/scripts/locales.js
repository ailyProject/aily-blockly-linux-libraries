'use strict';

const lines = (text) => text.trim().split('\n');

const messages = {
  zh_cn: lines(`
当程序启动时 %1 %2
永久循环 %1 %2
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
当 MQTT %1 收到消息时将主题设为 %2、载荷设为 %3 并执行 %4 %5
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
CPU 温度 °C`),
  zh_hk: lines(`
當程式啟動時 %1 %2
永久循環 %1 %2
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
當 MQTT %1 收到訊息時將主題設為 %2、負載設為 %3 並執行 %4 %5
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
CPU 溫度 °C`),
  ja: lines(`
プログラム開始時 %1 %2
永久ループ %1 %2
%1 秒待つ
%1 を表示
数値 %1
テキスト %1
真偽値 %1
項目 %1 のタプル
項目 %1 のリスト
変数 %1 を %2 にする
変数 %1
もし %1 なら %2 %3
%2 の各 %1 について %3 %4
画像 %1 を幅 %2、高さ %3 に変更
画像 %1 を %2 で変換
画像 %1 を下限 %2、上限 %3 でマスク
%1 の連結成分、結合度 %2
画像ファイル %1 を読み込む
画像 %1 をファイル %2 に保存
%1 に矩形を描く：x %2、y %3 から x %4、y %5、色 %6、線幅 %7
%1 に円を描く：x %2、y %3、半径 %4、色 %5、線幅 %6
%1 に線を描く：x %2、y %3 から x %4、y %5、色 %6、線幅 %7
%2 の x %3、y %4 にテキスト %1 を描く、倍率 %5、色 %6、線幅 %7
%1 の QR コードを復号
%1 のバーコードを復号
AprilTag 検出器 %1 を初期化、ファミリー %2
AprilTag 検出器 %1 でグレー画像 %2 を検出
ソケット %1 を初期化、ファミリー %2、種類 %3
ネットワークアドレス：ホスト %1、ポート %2
ソケット %1 を %2 に接続
ソケット %1 を %2 にバインド
ソケット %1 を待ち受け、バックログ %2
ソケット %1 が接続を受け入れる
ソケット %1 で %2 を送信
ソケット %1 で %2 バイト受信
ソケット %1 を閉じる
MQTT クライアント %1 を初期化
MQTT %1 をホスト %2、ポート %3、キープアライブ %4 で接続
MQTT %1 がトピック %2 にメッセージ %3 を公開
MQTT %1 がトピック %2 を購読
MQTT %1 がメッセージを受信したらトピックを %2、ペイロードを %3 にして %4 %5
MQTT %1 を永久ループ
MQTT %1 を切断
HTTP %1：URL %2、データ %3
HTTP 応答 %1 の属性 %2
現在のディレクトリを HTTP で公開：ホスト %1、ポート %2
テキストファイル %1 を読む
テキストファイル %2 を %1 モードで処理、内容 %3
パス %1 は存在する
ディレクトリ %1 を一覧
システムコマンド %1 を実行
CPU 温度 °C`),
  ko: lines(`
프로그램이 시작될 때 %1 %2
영원히 반복 %1 %2
%1 초 기다리기
%1 출력
숫자 %1
텍스트 %1
불리언 %1
항목 %1 로 만든 튜플
항목 %1 로 만든 목록
변수 %1 을 %2 로 설정
변수 %1
만약 %1 이면 %2 %3
%2 의 각 %1 에 대해 %3 %4
이미지 %1 을 너비 %2, 높이 %3 으로 조정
이미지 %1 을 %2 로 변환
이미지 %1 을 하한 %2, 상한 %3 으로 마스크
%1 의 연결 요소, 연결성 %2
이미지 파일 %1 불러오기
이미지 %1 을 파일 %2 에 저장
%1 에 사각형 그리기: x %2, y %3 에서 x %4, y %5, 색 %6, 두께 %7
%1 에 원 그리기: x %2, y %3, 반지름 %4, 색 %5, 두께 %6
%1 에 선 그리기: x %2, y %3 에서 x %4, y %5, 색 %6, 두께 %7
%2 의 x %3, y %4 에 텍스트 %1 그리기, 배율 %5, 색 %6, 두께 %7
%1 의 QR 코드 디코딩
%1 의 바코드 디코딩
AprilTag 감지기 %1 초기화, 패밀리 %2
AprilTag 감지기 %1 로 회색 이미지 %2 감지
소켓 %1 초기화, 패밀리 %2, 유형 %3
네트워크 주소: 호스트 %1, 포트 %2
소켓 %1 을 %2 에 연결
소켓 %1 을 %2 에 바인드
소켓 %1 대기, 백로그 %2
소켓 %1 연결 수락
소켓 %1 로 %2 보내기
소켓 %1 에서 %2 바이트 받기
소켓 %1 닫기
MQTT 클라이언트 %1 초기화
MQTT %1 을 호스트 %2, 포트 %3, keepalive %4 로 연결
MQTT %1 이 주제 %2 에 메시지 %3 게시
MQTT %1 이 주제 %2 구독
MQTT %1 이 메시지를 받으면 주제를 %2, 페이로드를 %3 으로 하고 %4 %5
MQTT %1 영원히 루프
MQTT %1 연결 해제
HTTP %1: URL %2, 데이터 %3
HTTP 응답 %1 의 속성 %2
현재 디렉터리를 HTTP로 제공: 호스트 %1, 포트 %2
텍스트 파일 %1 읽기
텍스트 파일 %2 를 %1 모드로 처리, 내용 %3
경로 %1 이 존재함
디렉터리 %1 나열
시스템 명령 %1 실행
CPU 온도 °C`),
  de: lines(`
wenn das Programm startet %1 %2
endlos wiederholen %1 %2
%1 Sekunden warten
%1 ausgeben
Zahl %1
Textwert %1
Boolesch %1
Tupel mit %1
Liste mit %1
Variable %1 auf %2 setzen
Wert der Variablen %1
wenn %1 dann %2 %3
für jedes %1 in %2 tue %3 %4
Bild %1 auf Breite %2, Höhe %3 skalieren
Bild %1 mit %2 umwandeln
Bild %1 mit Untergrenze %2, Obergrenze %3 maskieren
Zusammenhängende Komponenten von %1, Konnektivität %2
Bilddatei %1 laden
Bild %1 in Datei %2 speichern
Rechteck auf %1 zeichnen: von x %2, y %3 nach x %4, y %5, Farbe %6, Stärke %7
Kreis auf %1 zeichnen: x %2, y %3, Radius %4, Farbe %5, Stärke %6
Linie auf %1 zeichnen: von x %2, y %3 nach x %4, y %5, Farbe %6, Stärke %7
Text %1 auf %2 bei x %3, y %4 zeichnen, Skala %5, Farbe %6, Stärke %7
QR-Codes in %1 dekodieren
Barcodes in %1 dekodieren
AprilTag-Detektor %1 initialisieren, Familie %2
AprilTag-Detektor %1 erkennt Graubild %2
Socket %1 initialisieren, Familie %2, Typ %3
Netzwerkadresse: Host %1, Port %2
Socket %1 mit %2 verbinden
Socket %1 an %2 binden
Socket %1 lauschen, Backlog %2
Socket %1 Verbindung annehmen
über Socket %1 senden %2
von Socket %1 %2 Bytes empfangen
Socket %1 schließen
MQTT-Client %1 initialisieren
MQTT %1 verbinden Host %2, Port %3, Keepalive %4
MQTT %1 Thema %2 Nachricht %3 veröffentlichen
MQTT %1 Thema %2 abonnieren
wenn MQTT %1 eine Nachricht empfängt, setze Thema %2, Nutzlast %3 und tue %4 %5
MQTT %1 endlos schleifen
MQTT %1 trennen
HTTP %1: URL %2, Daten %3
HTTP-Antwort %1 Eigenschaft %2
aktuelles Verzeichnis per HTTP bereitstellen: Host %1, Port %2
Textdatei %1 lesen
Textdatei %2 im Modus %1 mit Inhalt %3
Pfad %1 existiert
Verzeichnis %1 auflisten
Systembefehl %1 ausführen
CPU-Temperatur °C`),
  fr: lines(`
quand le programme démarre %1 %2
répéter indéfiniment %1 %2
attendre %1 secondes
afficher %1
nombre %1
texte %1
booléen %1
tuple contenant %1
liste contenant %1
définir la variable %1 à %2
la variable %1
si %1 alors %2 %3
pour chaque %1 dans %2 faire %3 %4
redimensionner l’image %1 largeur %2 hauteur %3
convertir l’image %1 avec %2
masquer l’image %1 bas %2 haut %3
composantes connexes de %1 connectivité %2
charger le fichier image %1
enregistrer l’image %1 dans le fichier %2
dessiner un rectangle sur %1 de x %2 y %3 à x %4 y %5 couleur %6 épaisseur %7
dessiner un cercle sur %1 x %2 y %3 rayon %4 couleur %5 épaisseur %6
dessiner une ligne sur %1 de x %2 y %3 à x %4 y %5 couleur %6 épaisseur %7
dessiner le texte %1 sur %2 x %3 y %4 échelle %5 couleur %6 épaisseur %7
décoder les QR codes dans %1
décoder les codes-barres dans %1
initialiser le détecteur AprilTag %1 famille %2
le détecteur AprilTag %1 détecte l’image grise %2
initialiser le socket %1 famille %2 type %3
adresse réseau : hôte %1 port %2
connecter le socket %1 à %2
lier le socket %1 à %2
faire écouter le socket %1 file %2
le socket %1 accepte une connexion
envoyer %2 via le socket %1
recevoir %2 octets du socket %1
fermer le socket %1
initialiser le client MQTT %1
MQTT %1 se connecter hôte %2 port %3 keepalive %4
MQTT %1 publier sujet %2 message %3
MQTT %1 s’abonner au sujet %2
quand MQTT %1 reçoit un message, définir sujet %2 charge %3 puis %4 %5
MQTT %1 boucler indéfiniment
déconnecter MQTT %1
HTTP %1 : URL %2 données %3
propriété %2 de la réponse HTTP %1
servir le répertoire actuel en HTTP : hôte %1 port %2
lire le fichier texte %1
traiter le fichier texte %2 en mode %1 contenu %3
le chemin %1 existe
lister le répertoire %1
exécuter la commande système %1
température CPU °C`),
  es: lines(`
cuando el programa inicia %1 %2
repetir para siempre %1 %2
esperar %1 segundos
imprimir %1
número %1
texto %1
booleano %1
tupla con %1
lista con %1
establecer variable %1 a %2
la variable %1
si %1 entonces %2 %3
para cada %1 en %2 hacer %3 %4
redimensionar imagen %1 ancho %2 alto %3
convertir imagen %1 usando %2
máscara de imagen %1 inferior %2 superior %3
componentes conectados de %1 conectividad %2
cargar archivo de imagen %1
guardar imagen %1 en archivo %2
dibujar rectángulo en %1 de x %2 y %3 a x %4 y %5 color %6 grosor %7
dibujar círculo en %1 x %2 y %3 radio %4 color %5 grosor %6
dibujar línea en %1 de x %2 y %3 a x %4 y %5 color %6 grosor %7
dibujar texto %1 en %2 x %3 y %4 escala %5 color %6 grosor %7
decodificar códigos QR en %1
decodificar códigos de barras en %1
inicializar detector AprilTag %1 familia %2
detector AprilTag %1 detecta imagen gris %2
inicializar socket %1 familia %2 tipo %3
dirección de red: host %1 puerto %2
conectar socket %1 a %2
vincular socket %1 a %2
hacer que el socket %1 escuche cola %2
el socket %1 acepta conexión
enviar %2 por el socket %1
recibir %2 bytes del socket %1
cerrar socket %1
inicializar cliente MQTT %1
MQTT %1 conectar host %2 puerto %3 keepalive %4
MQTT %1 publicar tema %2 mensaje %3
MQTT %1 suscribirse al tema %2
cuando MQTT %1 reciba un mensaje, tema %2 carga %3 hacer %4 %5
MQTT %1 bucle eterno
desconectar MQTT %1
HTTP %1: URL %2 datos %3
propiedad %2 de la respuesta HTTP %1
servir el directorio actual por HTTP: host %1 puerto %2
leer archivo de texto %1
tratar archivo de texto %2 en modo %1 contenido %3
la ruta %1 existe
listar directorio %1
ejecutar comando del sistema %1
temperatura de CPU °C`),
  pt: lines(`
quando o programa inicia %1 %2
repetir para sempre %1 %2
esperar %1 segundos
imprimir %1
número %1
texto %1
booleano %1
tupla contendo %1
lista contendo %1
definir variável %1 para %2
variável %1
se %1 então %2 %3
para cada %1 em %2 faça %3 %4
redimensionar imagem %1 largura %2 altura %3
converter imagem %1 usando %2
máscara da imagem %1 inferior %2 superior %3
componentes conectados de %1 conectividade %2
carregar arquivo de imagem %1
salvar imagem %1 no arquivo %2
desenhar retângulo em %1 de x %2 y %3 até x %4 y %5 cor %6 espessura %7
desenhar círculo em %1 x %2 y %3 raio %4 cor %5 espessura %6
desenhar linha em %1 de x %2 y %3 até x %4 y %5 cor %6 espessura %7
desenhar texto %1 em %2 x %3 y %4 escala %5 cor %6 espessura %7
decodificar códigos QR em %1
decodificar códigos de barras em %1
inicializar detector AprilTag %1 família %2
detector AprilTag %1 detecta imagem cinza %2
inicializar socket %1 família %2 tipo %3
endereço de rede: host %1 porta %2
conectar socket %1 a %2
vincular socket %1 a %2
fazer o socket %1 escutar fila %2
o socket %1 aceita conexão
enviar %2 pelo socket %1
receber %2 bytes do socket %1
fechar socket %1
inicializar cliente MQTT %1
MQTT %1 conectar host %2 porta %3 keepalive %4
MQTT %1 publicar tópico %2 mensagem %3
MQTT %1 assinar tópico %2
quando MQTT %1 receber mensagem, tópico %2 carga %3 faça %4 %5
MQTT %1 loop eterno
desconectar MQTT %1
HTTP %1: URL %2 dados %3
propriedade %2 da resposta HTTP %1
servir o diretório atual via HTTP: host %1 porta %2
ler arquivo de texto %1
tratar arquivo de texto %2 no modo %1 conteúdo %3
o caminho %1 existe
listar diretório %1
executar comando do sistema %1
temperatura da CPU °C`),
  ru: lines(`
когда программа запускается %1 %2
повторять вечно %1 %2
ждать %1 секунд
напечатать %1
число %1
текст %1
логическое %1
кортеж из %1
список из %1
задать переменную %1 как %2
переменная %1
если %1 то %2 %3
для каждого %1 в %2 сделать %3 %4
изменить размер изображения %1 ширина %2 высота %3
преобразовать изображение %1 через %2
маска изображения %1 низ %2 верх %3
связные компоненты %1 связность %2
загрузить файл изображения %1
сохранить изображение %1 в файл %2
нарисовать прямоугольник на %1 от x %2 y %3 до x %4 y %5 цвет %6 толщина %7
нарисовать круг на %1 x %2 y %3 радиус %4 цвет %5 толщина %6
нарисовать линию на %1 от x %2 y %3 до x %4 y %5 цвет %6 толщина %7
нарисовать текст %1 на %2 x %3 y %4 масштаб %5 цвет %6 толщина %7
декодировать QR-коды в %1
декодировать штрихкоды в %1
инициализировать детектор AprilTag %1 семейство %2
детектор AprilTag %1 обнаруживает серое изображение %2
инициализировать сокет %1 семейство %2 тип %3
сетевой адрес: хост %1 порт %2
подключить сокет %1 к %2
привязать сокет %1 к %2
слушать сокет %1 очередь %2
сокет %1 принимает соединение
отправить %2 через сокет %1
принять %2 байт из сокета %1
закрыть сокет %1
инициализировать клиент MQTT %1
MQTT %1 подключить хост %2 порт %3 keepalive %4
MQTT %1 опубликовать тему %2 сообщение %3
MQTT %1 подписаться на тему %2
когда MQTT %1 получит сообщение, тема %2 нагрузка %3 выполнить %4 %5
MQTT %1 бесконечный цикл
отключить MQTT %1
HTTP %1: URL %2 данные %3
свойство %2 ответа HTTP %1
раздавать текущий каталог по HTTP: хост %1 порт %2
прочитать текстовый файл %1
обработать текстовый файл %2 в режиме %1 содержимое %3
путь %1 существует
перечислить каталог %1
выполнить системную команду %1
температура ЦП °C`),
  ar: lines(`
عند بدء البرنامج %1 %2
كرر إلى الأبد %1 %2
انتظر %1 ثانية
اطبع %1
عدد %1
نص %1
منطقي %1
صف يحتوي %1
قائمة تحتوي %1
عيّن المتغير %1 إلى %2
المتغير %1
إذا %1 فنفّذ %2 %3
لكل %1 في %2 نفّذ %3 %4
غيّر حجم الصورة %1 عرض %2 ارتفاع %3
حوّل الصورة %1 باستخدام %2
قناع الصورة %1 الأدنى %2 الأعلى %3
المكونات المتصلة لـ %1 الاتصال %2
حمّل ملف الصورة %1
احفظ الصورة %1 في الملف %2
ارسم مستطيلاً على %1 من x %2 y %3 إلى x %4 y %5 لون %6 سماكة %7
ارسم دائرة على %1 x %2 y %3 نصف قطر %4 لون %5 سماكة %6
ارسم خطاً على %1 من x %2 y %3 إلى x %4 y %5 لون %6 سماكة %7
ارسم النص %1 على %2 عند x %3 y %4 مقياس %5 لون %6 سماكة %7
فك رموز QR في %1
فك الرموز الشريطية في %1
هيئ كاشف AprilTag %1 العائلة %2
كاشف AprilTag %1 يكتشف الصورة الرمادية %2
هيئ المقبس %1 العائلة %2 النوع %3
عنوان الشبكة: المضيف %1 المنفذ %2
وصّل المقبس %1 إلى %2
اربط المقبس %1 بـ %2
اجعل المقبس %1 يستمع الطابور %2
المقبس %1 يقبل اتصالاً
أرسل %2 عبر المقبس %1
استقبل %2 بايت من المقبس %1
أغلق المقبس %1
هيئ عميل MQTT %1
MQTT %1 يتصل بالمضيف %2 المنفذ %3 keepalive %4
MQTT %1 ينشر الموضوع %2 الرسالة %3
MQTT %1 يشترك في الموضوع %2
عندما يستقبل MQTT %1 رسالة عيّن الموضوع %2 والحمل %3 ونفّذ %4 %5
MQTT %1 يكرر إلى الأبد
افصل MQTT %1
HTTP %1: الرابط %2 البيانات %3
خاصية %2 لاستجابة HTTP %1
قدّم المجلد الحالي عبر HTTP: المضيف %1 المنفذ %2
اقرأ ملف النص %1
عالج ملف النص %2 بالوضع %1 المحتوى %3
المسار %1 موجود
اعرض المجلد %1
شغّل أمر النظام %1
درجة حرارة المعالج °C`),
};

const dropdownLabels = {
  zh_cn: { true: '真', false: '假', 'BGR to gray': 'BGR 转灰度', 'BGR to LAB': 'BGR 转 LAB', 'BGR to RGB': 'BGR 转 RGB', 'gray to BGR': '灰度转 BGR', 'status code': '状态码', write: '写入', append: '追加' },
  zh_hk: { true: '真', false: '假', 'BGR to gray': 'BGR 轉灰階', 'BGR to LAB': 'BGR 轉 LAB', 'BGR to RGB': 'BGR 轉 RGB', 'gray to BGR': '灰階轉 BGR', 'status code': '狀態碼', write: '寫入', append: '附加' },
  ja: { true: '真', false: '偽', 'BGR to gray': 'BGR からグレー', 'BGR to LAB': 'BGR から LAB', 'BGR to RGB': 'BGR から RGB', 'gray to BGR': 'グレーから BGR', 'status code': 'ステータスコード', write: '書き込み', append: '追記' },
  ko: { true: '참', false: '거짓', 'BGR to gray': 'BGR에서 회색조', 'BGR to LAB': 'BGR에서 LAB', 'BGR to RGB': 'BGR에서 RGB', 'gray to BGR': '회색조에서 BGR', 'status code': '상태 코드', write: '쓰기', append: '추가' },
};

const westernDropdownWords = {
  de: ['wahr', 'falsch', 'Statuscode', 'schreiben', 'anhängen'],
  fr: ['vrai', 'faux', 'code d’état', 'écrire', 'ajouter'],
  es: ['verdadero', 'falso', 'código de estado', 'escribir', 'añadir'],
  pt: ['verdadeiro', 'falso', 'código de status', 'escrever', 'acrescentar'],
  ru: ['истина', 'ложь', 'код состояния', 'записать', 'добавить'],
  ar: ['صحيح', 'خطأ', 'رمز الحالة', 'كتابة', 'إلحاق'],
};

function buildWesternDropdownMap(locale) {
  const w = westernDropdownWords[locale];
  const grayscale = { de: 'Graustufen', fr: 'niveaux de gris', es: 'escala de grises', pt: 'tons de cinza', ru: 'оттенки серого', ar: 'تدرج رمادي' }[locale];
  return {
    true: w[0], false: w[1],
    'BGR to gray': `BGR → ${grayscale}`, 'BGR to LAB': 'BGR → LAB', 'BGR to RGB': 'BGR → RGB', 'gray to BGR': `${grayscale} → BGR`,
    'status code': w[2], write: w[3], append: w[4],
  };
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
