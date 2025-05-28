import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface SaleRequest {
  _id?: ObjectId;
  id: string;
  bondRequestId: string;
  bondId: string;
  userEmail: string;
  status: 'pending' | 'accepted' | 'normal';
  timestamp: string;
  price: {
    originalPrice: string;
    sellPrice: string;
    interestRate: number;
    daysHeld: number;
    interestAmount: string;
  };
  declineReason?: string;
}

function calculateSellPrice(originalPrice: string, purchaseDate: string, annualInterestRate: number): {
  sellPrice: string;
  interestAmount: string;
  daysHeld: number;
} {
  const price = parseFloat(originalPrice.replace(/[^0-9.-]+/g, ""));
  const purchase = new Date(purchaseDate);
  const now = new Date();
  
  // Calculate days held
  const daysHeld = Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate daily interest rate
  const dailyRate = annualInterestRate / 365;
  
  // Calculate interest amount
  const interestAmount = price * dailyRate * daysHeld;
  
  // Calculate total sell price
  const sellPrice = price + interestAmount;
  
  return {
    sellPrice: sellPrice.toLocaleString('en-US', { maximumFractionDigits: 0 }),
    interestAmount: interestAmount.toLocaleString('en-US', { maximumFractionDigits: 0 }),
    daysHeld
  };
}

export async function createSaleRequest(
  bondRequestId: string,
  bondId: string,
  userEmail: string,
  originalPrice: string,
  purchaseDate: string,
  annualInterestRate: number
): Promise<SaleRequest | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check if a sale request already exists for this bond request with a non-normal status
    const existingSaleRequest = await db.collection<SaleRequest>('saleRequests').findOne({
      bondRequestId,
      userEmail,
      status: { $ne: 'normal' }
    });

    if (existingSaleRequest) {
      throw new Error('A sale request already exists for this bond');
    }
    
    // Calculate sell price
    const { sellPrice, interestAmount, daysHeld } = calculateSellPrice(originalPrice, purchaseDate, annualInterestRate);
    
    // Generate a unique ID for the sale request
    const id = crypto.randomUUID();
    
    const saleRequest: SaleRequest = {
      id,
      bondRequestId,
      bondId,
      userEmail,
      status: 'pending',
      timestamp: new Date().toISOString(),
      price: {
        originalPrice,
        sellPrice,
        interestRate: annualInterestRate * 100, // Convert to percentage for display
        daysHeld,
        interestAmount
      }
    };

    // Insert into saleRequests collection
    const result = await db.collection('saleRequests').insertOne(saleRequest);
    
    if (!result.acknowledged) {
      throw new Error('Failed to create sale request');
    }

    // Update the bond request to reference this sale request
    const updateResult = await db.collection('bondRequests').updateOne(
      { id: bondRequestId },
      { 
        $set: { 
          saleRequest: {
            status: 'pending',
            timestamp: saleRequest.timestamp
          }
        } 
      }
    );

    if (!updateResult.acknowledged) {
      // If bond request update fails, delete the sale request
      await db.collection('saleRequests').deleteOne({ id });
      throw new Error('Failed to update bond request');
    }

    return saleRequest;
  } catch (error) {
    console.error('Error creating sale request:', error);
    throw error;
  }
}

export async function getSaleRequests(): Promise<SaleRequest[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const requests = await db.collection<SaleRequest>('saleRequests')
      .find()
      .sort({ timestamp: -1 })
      .toArray();
    return requests;
  } catch (error) {
    console.error('Error fetching sale requests:', error);
    throw error;
  }
}

export async function getSaleRequest(id: string): Promise<SaleRequest | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const request = await db.collection<SaleRequest>('saleRequests').findOne({ id });
    return request;
  } catch (error) {
    console.error('Error fetching sale request:', error);
    throw error;
  }
}

export async function updateSaleRequest(
  id: string,
  update: Partial<SaleRequest>
): Promise<SaleRequest | null> {
  try {
    console.log('Updating sale request:', {
      id,
      update
    });

    const client = await clientPromise;
    const db = client.db();
    
    // Update the sale request
    const updateResult = await db.collection<SaleRequest>('saleRequests').updateOne(
      { id },
      { $set: update }
    );

    console.log('MongoDB update result:', {
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      upsertedCount: updateResult.upsertedCount
    });

    // Get the updated sale request
    const updatedSaleRequest = await db.collection<SaleRequest>('saleRequests').findOne({ id });
    
    if (updatedSaleRequest) {
      // Update the corresponding bond request's saleRequest status
      const bondUpdateResult = await db.collection('bondRequests').updateOne(
        { id: updatedSaleRequest.bondRequestId },
        { 
          $set: { 
            saleRequest: {
              status: updatedSaleRequest.status,
              timestamp: updatedSaleRequest.timestamp
            }
          } 
        }
      );

      console.log('Bond request update result:', {
        matchedCount: bondUpdateResult.matchedCount,
        modifiedCount: bondUpdateResult.modifiedCount
      });
    }

    return updatedSaleRequest;
  } catch (error) {
    console.error('Error updating sale request:', error);
    throw error;
  }
} 