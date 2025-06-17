
import type { NextApiRequest, NextApiResponse } from 'next';
import { getJobs, createJob, updateJob, deleteJob } from '@/api/jobsApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await getJobs();
        res.status(200).json(result.data);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
      break;

    case 'POST':
      try {
        const job = req.body;
        const data = await createJob(job);
        res.status(201).json(data);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
      break;

    case 'PUT':
      try {
        const { id, updates } = req.body;
        const data = await updateJob(id, updates);
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        const data = await deleteJob(id);
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
