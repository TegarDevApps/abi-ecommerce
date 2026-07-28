import { config } from '../config';

export interface ShippingRateRequest {
  origin_postal_code?: string; // Default Jakarta 12190
  destination_city: string;
  destination_postal_code?: string;
  weight_grams: number;
}

export interface ShippingRateOption {
  courier_code: string;
  courier_name: string;
  service_name: string;
  price: number;
  estimated_days: string;
  description: string;
}

export class ShippingCalculatorService {
  /**
   * Calculate dynamic shipping rates based on destination city and weight (Biteship / RajaOngkir integration style)
   */
  static async calculateRates(req: ShippingRateRequest): Promise<ShippingRateOption[]> {
    const weightKg = Math.max(1, Math.ceil(req.weight_grams / 1000));
    const cityLower = (req.destination_city || '').toLowerCase();

    console.log(`📦 [Biteship/RajaOngkir Calculator] Calculating rates to '${req.destination_city}' for weight: ${req.weight_grams}g (${weightKg}kg)`);

    // Dynamic pricing tiers based on destination region
    let baseRatePerKg = 15000;
    if (cityLower.includes('jakarta') || cityLower.includes('bekasi') || cityLower.includes('depok') || cityLower.includes('bogor') || cityLower.includes('tangerang')) {
      baseRatePerKg = 10000; // Jabodetabek Tier
    } else if (cityLower.includes('bandung') || cityLower.includes('semarang') || cityLower.includes('surabaya') || cityLower.includes('yogyakarta') || cityLower.includes('solo')) {
      baseRatePerKg = 18000; // Major Java Cities Tier
    } else if (cityLower.includes('medan') || cityLower.includes('makassar') || cityLower.includes('palembang') || cityLower.includes('balikpapan') || cityLower.includes('denpasar')) {
      baseRatePerKg = 32000; // Major Outer Java Tier
    } else if (cityLower !== '') {
      baseRatePerKg = 28000; // Default National Tier
    }

    const jneRegPrice = baseRatePerKg * weightKg;
    const sicepatBestPrice = Math.round(baseRatePerKg * 1.3) * weightKg;
    const jneYesPrice = Math.round(baseRatePerKg * 1.6) * weightKg;

    return [
      {
        courier_code: 'jne_reg',
        courier_name: 'JNE',
        service_name: 'REG (Reguler)',
        price: jneRegPrice,
        estimated_days: '2-4 Hari',
        description: 'Layanan reguler nasional terpercaya dengan pelacakan akurat.',
      },
      {
        courier_code: 'sicepat_best',
        courier_name: 'Sicepat Express',
        service_name: 'BEST (Besok Sampai Tujuan)',
        price: sicepatBestPrice,
        estimated_days: '1-2 Hari',
        description: 'Pengiriman cepat prioritas dengan perlindungan paket ekstra.',
      },
      {
        courier_code: 'jne_yes',
        courier_name: 'JNE',
        service_name: 'YES (Yakin Esok Sampai)',
        price: jneYesPrice,
        estimated_days: '1 Hari',
        description: 'Jaminan kiriman tiba keesokan harinya, cocok untuk urgent keberangkatan.',
      },
      {
        courier_code: 'anteraja_reg',
        courier_name: 'Anteraja',
        service_name: 'Reguler',
        price: Math.round(jneRegPrice * 0.95),
        estimated_days: '2-3 Hari',
        description: 'Layanan kurir gesit berstandar ISO untuk keamanan barang travel.',
      }
    ];
  }
}
