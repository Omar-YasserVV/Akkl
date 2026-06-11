import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface QrScannerViewProps {
  message?: string;
  onScan?: (data: string) => void;
}

export function QrScannerView({
  message = "Align the QR code within the frame to start your order",
  onScan,
}: QrScannerViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const lastScan = useRef<string | null>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned || data === lastScan.current) return;
    lastScan.current = data;
    setScanned(true);
    onScan?.(data);
  };

  // Permission denied
  if (permission && !permission.granted && !permission.canAskAgain) {
    return (
      <View className="flex-1 bg-[#0D0D0D] items-center justify-center px-8">
        <Ionicons name="camera-outline" size={48} color="#ffffff50" />{" "}
        {/* ← fixed */}
        <Text className="text-white/70 text-center text-[15px] mt-4 leading-6">
          Camera access was denied. Please enable it in your device settings.
        </Text>
      </View>
    );
  }

  // Waiting for permission
  if (!permission?.granted) {
    return (
      <View className="flex-1 bg-[#0D0D0D] items-center justify-center px-8">
        <Ionicons name="camera-outline" size={48} color="#ffffff50" />
        <Text className="text-white/70 text-center text-[15px] mt-4 leading-6">
          Camera permission is required to scan QR codes.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="mt-5 px-6 py-3 bg-[#065FCC] rounded-[8px]"
        >
          <Text className="text-white font-bold text-[15px]">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={{ flex: 1, width: "100%", height: "100%" }} // <-- Use absolute style sizing instead of or along with className
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View className="absolute inset-0 items-center justify-center">
        <View className="absolute top-0 left-0 right-0 items-center pt-8 px-8">
          <Text className="text-[26px] font-extrabold text-white mb-2">
            Scan Table QR
          </Text>
          <Text className="text-center text-[15px] text-white/75 leading-6">
            {message}
          </Text>
        </View>

        <View className="w-[220px] h-[220px] relative">
          <View className="absolute top-0 left-0 w-[36px] h-[36px] border-t-[3px] border-l-[3px] border-white rounded-tl-[6px]" />
          <View className="absolute top-0 right-0 w-[36px] h-[36px] border-t-[3px] border-r-[3px] border-white rounded-tr-[6px]" />
          <View className="absolute bottom-0 left-0 w-[36px] h-[36px] border-b-[3px] border-l-[3px] border-white rounded-bl-[6px]" />
          <View className="absolute bottom-0 right-0 w-[36px] h-[36px] border-b-[3px] border-r-[3px] border-white rounded-br-[6px]" />
        </View>

        {scanned && (
          <TouchableOpacity
            onPress={() => {
              setScanned(false);
              lastScan.current = null;
            }}
            className="absolute bottom-32 px-6 py-3 bg-white/20 rounded-[8px] border border-white/40"
          >
            <Text className="text-white font-semibold text-[15px]">
              Tap to scan again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
