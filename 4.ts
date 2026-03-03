import { Request, Response } from 'express';

/**
 * Controller untuk mengambil data dashboard user
 */
export const getDashboardData = async (req: any, res: Response) => {
  try {
    // Logika pengambilan data dari DB nantinya menggunakan repository
    res.json({
      user_id: req.user.id,
      balance: 15750000,
      currency: 'IDR',
      savings_goal: 'Rumah Impian'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

import { calculateAutoStash } from '../../core/services/stashService';
import { pool } from '../../config/database';

export const handleTransaction = async (req: any, res: Response) => {
    const { amount, pocketId } = req.body;
    const stash = calculateAutoStash(amount); // Memanggil logika dari 5.ts

    // Lakukan update database menggunakan pool (6.ts)
    // misal: UPDATE pockets SET balance = balance - (amount + stash) ...
};

