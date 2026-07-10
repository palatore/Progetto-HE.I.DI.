import { Capacitor } from '@capacitor/core';

const PC_LOCAL_IP = '10.19.175.118';

export const API_URL = Capacitor.isNativePlatform()
  ? `http://${PC_LOCAL_IP}:3000`
  : 'http://localhost:3000';