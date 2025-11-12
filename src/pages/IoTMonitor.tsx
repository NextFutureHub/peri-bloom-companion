import { useState, useEffect } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { GradientButton, SoftButton } from "@/shared/ui/atoms/button-variants";
import { Thermometer, Droplets, Volume2, Wifi, WifiOff, Activity } from "lucide-react";
import { toast } from "sonner";

interface SensorData {
  temperature: number;
  humidity: number;
  noise: number;
  timestamp: Date;
}

interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

const IoTMonitor = () => {
  const { t } = useTranslation();
  const [port, setPort] = useState<SerialPort | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    noise: 0,
    timestamp: new Date(),
  });
  const [history, setHistory] = useState<SensorData[]>([]);

  const connectDevice = async () => {
    try {
      if ('serial' in navigator) {
        const selectedPort = await (navigator as any).serial.requestPort();
        await selectedPort.open({ baudRate: 9600 });
        setPort(selectedPort);
        setIsConnected(true);
        toast.success(t("iot.connected"));
        readData(selectedPort);
      } else {
        toast.error(t("iot.notSupported"));
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error(t("iot.connectionError"));
    }
  };

  const disconnectDevice = async () => {
    if (port) {
      try {
        await port.close();
        setPort(null);
        setIsConnected(false);
        toast.success(t("iot.disconnected"));
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    }
  };

  const readData = async (serialPort: SerialPort) => {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = serialPort.readable?.pipeTo(textDecoder.writable as any);
    const reader = textDecoder.readable?.getReader();

    if (!reader) return;

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        // Parse Arduino data (format: "T:25.5,H:60.2,N:45")
        const match = value.match(/T:([\d.]+),H:([\d.]+),N:([\d.]+)/);
        if (match) {
          const newData: SensorData = {
            temperature: parseFloat(match[1]),
            humidity: parseFloat(match[2]),
            noise: parseFloat(match[3]),
            timestamp: new Date(),
          };
          
          setSensorData(newData);
          setHistory((prev) => [...prev.slice(-19), newData]); // Keep last 20 readings
        }
      }
    } catch (error) {
      console.error("Read error:", error);
      toast.error(t("iot.readError"));
    }
  };

  useEffect(() => {
    return () => {
      if (port) {
        port.close();
      }
    };
  }, [port]);

  const getStatusColor = (value: number, type: 'temp' | 'humidity' | 'noise') => {
    if (type === 'temp') {
      if (value < 18 || value > 26) return "text-red-500";
      return "text-green-500";
    }
    if (type === 'humidity') {
      if (value < 30 || value > 60) return "text-orange-500";
      return "text-green-500";
    }
    if (type === 'noise') {
      if (value > 60) return "text-red-500";
      return "text-green-500";
    }
    return "text-primary";
  };

  return (
    <div className="relative min-h-[calc(100dvh-5rem)] p-6">
      {/* Hint overlay - z-40 чтобы навигация (z-50) была поверх */}
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="relative z-10 bg-background/95 backdrop-blur-md rounded-lg shadow-lg px-6 py-4 border border-border">
          <p className="text-lg font-semibold text-foreground text-center">
            Скоро наши устройства поступят в продажу
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              {t("iot.title")}
            </CardTitle>
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-green-500">
                  <Wifi className="w-5 h-5" />
                  <span className="text-sm">{t("iot.connected")}</span>
                </div>
                <SoftButton onClick={disconnectDevice} size="sm">
                  {t("iot.disconnect")}
                </SoftButton>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <WifiOff className="w-5 h-5" />
                  <span className="text-sm">{t("iot.disconnected")}</span>
                </div>
                <GradientButton onClick={connectDevice} size="sm">
                  {t("iot.connect")}
                </GradientButton>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Temperature */}
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Thermometer className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("iot.temperature")}</p>
                      <p className={`text-2xl font-bold ${getStatusColor(sensorData.temperature, 'temp')}`}>
                        {sensorData.temperature.toFixed(1)}°C
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("iot.optimal")}: 18-26°C</p>
                </CardContent>
              </Card>

              {/* Humidity */}
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Droplets className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("iot.humidity")}</p>
                      <p className={`text-2xl font-bold ${getStatusColor(sensorData.humidity, 'humidity')}`}>
                        {sensorData.humidity.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("iot.optimal")}: 30-60%</p>
                </CardContent>
              </Card>

              {/* Noise */}
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Volume2 className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("iot.noise")}</p>
                      <p className={`text-2xl font-bold ${getStatusColor(sensorData.noise, 'noise')}`}>
                        {sensorData.noise.toFixed(0)} dB
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("iot.optimal")}: &lt;60 dB</p>
                </CardContent>
              </Card>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">{t("iot.history")}</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.slice().reverse().map((reading, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                    >
                      <span className="text-muted-foreground">
                        {reading.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="flex gap-4">
                        <span>🌡️ {reading.temperature.toFixed(1)}°C</span>
                        <span>💧 {reading.humidity.toFixed(1)}%</span>
                        <span>🔊 {reading.noise.toFixed(0)} dB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isConnected && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">{t("iot.connectMessage")}</p>
                <p className="text-xs">{t("iot.requirements")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IoTMonitor;
