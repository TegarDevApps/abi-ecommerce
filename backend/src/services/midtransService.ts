import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

export interface SnapTokenRequest {
  order_id: string;
  order_number: string;
  gross_amount: number;
  customer_details: {
    first_name: string;
    email?: string;
    phone?: string;
    billing_address?: string;
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface SnapTokenResponse {
  token: string;
  redirect_url: string;
  sandbox_instructions: {
    va_numbers: Array<{ bank: string; va_number: string }>;
    qris_payload: string;
    amount: number;
    expires_at: string;
  };
}

export class MidtransSandboxService {
  /**
   * Generates a Midtrans Snap transaction token and mock Sandbox instruction details
   */
  static async createTransaction(req: SnapTokenRequest): Promise<SnapTokenResponse> {
    console.log(`💳 [Midtrans Snap Sandbox] Generating token for Order ${req.order_number} (Rp ${req.gross_amount.toLocaleString()})...`);
    
    // In production with real keys, we would POST to https://app.sandbox.midtrans.com/snap/v1/transactions
    // Here we generate an interactive simulated token so local testing works without external HTTP timeouts.
    const token = `SNAP_TX_${req.order_number.replace(/[^A-Za-z0-9]/g, '')}_${uuidv4().substring(0, 8)}`;
    
    // Generate realistic Virtual Account numbers based on order number hash
    const numericHash = req.order_number.replace(/[^0-9]/g, '').padEnd(8, '8').substring(0, 8);
    
    return {
      token,
      redirect_url: `https://app.sandbox.midtrans.com/snap/v3/redirection/${token}`,
      sandbox_instructions: {
        va_numbers: [
          { bank: 'mandiri', va_number: `88908${numericHash}` },
          { bank: 'bca', va_number: `70012${numericHash}` },
          { bank: 'bri', va_number: `22334${numericHash}` }
        ],
        qris_payload: `00020101021226580011ID.CO.MIDTRANS.WWW01189360091400000000005204541153033605802ID5914Ajak Abi Store6007Jakarta6304D1B9`,
        amount: req.gross_amount,
        expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 hours
      }
    };
  }

  /**
   * Simulates incoming webhook from Midtrans when customer pays in Sandbox
   */
  static verifyWebhookSignature(order_number: string, status_code: string, gross_amount: string, signature_key: string): boolean {
    // Basic validation in sandbox mode
    return status_code === '200' && gross_amount !== '';
  }
}
