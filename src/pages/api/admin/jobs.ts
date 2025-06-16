import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
      break;

    case 'POST':
      try {
        const job = req.body;
        const { data, error } = await supabase
          .from('jobs')
          .insert([job]);

        if (error) throw error;
        res.status(201).json(data);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
      break;

    case 'PUT':
      try {
        const { id, updates } = req.body;
        const { data, error } = await supabase
          .from('jobs')
          .update(updates)
          .eq('id', id);

        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        const { data, error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', id);

        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
